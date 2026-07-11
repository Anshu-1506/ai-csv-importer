import OpenAI from 'openai';
import { CRMRecord, ALLOWED_STATUSES, ALLOWED_SOURCES, CRMStatus, DataSource } from '../types';

export class OpenRouterService {
  private client: OpenAI;
  private batchSize: number;
  private model: string;

  constructor(apiKey: string, batchSize: number = 5) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI CSV Importer",
      }
    });
    
    this.batchSize = batchSize;
    // Use a currently free model on OpenRouter
    this.model = "qwen/qwen-2.5-7b-instruct";
    // Alternative free models (uncomment to use):
    // "microsoft/phi-3-mini-128k-instruct:free"
    // "mistralai/mistral-7b-instruct:free"
    // "qwen/qwen-2.5-7b-instruct:free"
    
    console.log('✅ OpenRouter Service initialized with model:', this.model);
  }

  private buildPrompt(records: any[]): string {
    const fullData = JSON.stringify(records, null, 2);
    const totalRecords = records.length;

    return `
You are an AI assistant that converts CSV data into a standardized CRM format.

IMPORTANT: You MUST process ALL ${totalRecords} records provided below. Return a JSON array with EXACTLY ${totalRecords} objects.

INPUT DATA (ALL ${totalRecords} records):
${fullData}

CRM SCHEMA:
{
  created_at: string (ISO date format, use current date if not available),
  name: string,
  email: string,
  country_code: string,
  mobile_without_country_code: string,
  company: string,
  city: string,
  state: string,
  country: string,
  lead_owner: string,
  crm_status: string (must be one of: ${ALLOWED_STATUSES.join(', ')}),
  crm_note: string,
  data_source: string (must be one of: ${ALLOWED_SOURCES.join(', ')} or empty string),
  possession_time: string,
  description: string
}

RULES:
1. Process EVERY row in the input data - do not skip any row
2. CRM_STATUS must be exactly one of: ${ALLOWED_STATUSES.join(', ')}
3. DATA_SOURCE must be exactly one of: ${ALLOWED_SOURCES.join(', ')} or empty string if uncertain
4. created_at must be JavaScript Date compatible (ISO format)
5. If multiple emails exist, use the first as primary email and append others to crm_note
6. If multiple phone numbers exist, use the first as primary mobile and append others to crm_note
7. All additional remarks, notes, comments, follow-ups, extra information should go into crm_note
8. Return ONLY valid JSON - no additional text, no markdown formatting

IMPORTANT: 
- You MUST return a JSON array with exactly ${totalRecords} objects (one for each input row)
- Identify fields regardless of CSV column names
- Map columns intelligently based on content and context
- Do not include any explanations or markdown formatting in your response
- The response must be a valid JSON array

Return format (EXACTLY ${totalRecords} objects):
[
  {
    "created_at": "2024-01-01T00:00:00.000Z",
    "name": "John Doe",
    "email": "john@example.com",
    "country_code": "+1",
    "mobile_without_country_code": "1234567890",
    "company": "Acme Corp",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "lead_owner": "Jane Smith",
    "crm_status": "GOOD_LEAD_FOLLOW_UP",
    "crm_note": "Additional notes here",
    "data_source": "leads_on_demand",
    "possession_time": "2024-01-01T00:00:00.000Z",
    "description": "Lead description"
  }
]`;
  }

  private cleanResponse(text: string): string {
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    return cleaned.trim();
  }

  async processBatch(records: any[], retryCount: number = 0): Promise<{ records: CRMRecord[]; skipped: number }> {
    const maxRetries = 3;
    
    try {
      const prompt = this.buildPrompt(records);
      console.log(`📦 Processing batch of ${records.length} records with OpenRouter (${this.model})...`);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert data processor. Always return valid JSON arrays. Process ALL input data and return exactly the same number of objects as input rows."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 8192,
      });

      const text = completion.choices[0]?.message?.content || '';
      console.log(`✅ OpenRouter response received, length: ${text.length}`);
      
      const cleanedText = this.cleanResponse(text);
      let parsedRecords: CRMRecord[];
      try {
        parsedRecords = JSON.parse(cleanedText);
        
        if (!Array.isArray(parsedRecords)) {
          console.error('❌ AI response is not an array:', typeof parsedRecords);
          throw new Error('AI response is not an array');
        }
        
        console.log(`📊 Parsed ${parsedRecords.length} records from AI response`);
      } catch (error) {
        console.error('❌ Failed to parse AI response:', error);
        console.error('📝 Raw response (first 500 chars):', text.substring(0, 500));
        throw new Error('Invalid JSON response from AI');
      }

      const validRecords: CRMRecord[] = [];
      let skipped = 0;

      for (const record of parsedRecords) {
        if (!record.email && !record.mobile_without_country_code) {
          skipped++;
          continue;
        }

        if (!ALLOWED_STATUSES.includes(record.crm_status as CRMStatus)) {
          record.crm_status = 'GOOD_LEAD_FOLLOW_UP';
        }

        if (record.data_source && !ALLOWED_SOURCES.includes(record.data_source as DataSource)) {
          record.data_source = '';
        }

        validRecords.push(record);
      }

      console.log(`✅ Batch complete: ${validRecords.length} valid, ${skipped} skipped`);
      return { records: validRecords, skipped };
      
    } catch (error: any) {
      console.error('❌ Error processing batch:', error);
      
      // Handle rate limits with retry
      if (error.status === 429 && retryCount < maxRetries) {
        const delay = 30000 * Math.pow(2, retryCount);
        console.log(`⏳ Rate limit hit. Retrying in ${delay/1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.processBatch(records, retryCount + 1);
      }
      
      throw error;
    }
  }

  async processRecords(records: any[]): Promise<{ records: CRMRecord[]; skipped: number }> {
    const allRecords: CRMRecord[] = [];
    let totalSkipped = 0;

    console.log(`🔄 Processing ${records.length} records in batches of ${this.batchSize}`);

    for (let i = 0; i < records.length; i += this.batchSize) {
      const batch = records.slice(i, i + this.batchSize);
      console.log(`📊 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(records.length / this.batchSize)}`);
      
      try {
        const result = await this.processBatch(batch);
        allRecords.push(...result.records);
        totalSkipped += result.skipped;
      } catch (error) {
        console.error(`❌ Failed to process batch ${Math.floor(i / this.batchSize) + 1}:`, error);
        throw error;
      }
    }

    console.log(`✅ All records processed: ${allRecords.length} valid, ${totalSkipped} skipped`);
    return { records: allRecords, skipped: totalSkipped };
  }
}