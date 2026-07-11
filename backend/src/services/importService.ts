import { OpenRouterService } from '../ai/openrouterService';
import { ImportResult } from '../types';
import { parseCSV } from '../utils/csvParser';

export class ImportService {
  private aiService: OpenRouterService;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    console.log('🚀 Initializing Import Service with OpenRouter...');
    const batchSize = parseInt(process.env.BATCH_SIZE || '5', 10);
    console.log(`📊 Using batch size: ${batchSize}`);
    this.aiService = new OpenRouterService(apiKey, batchSize);
  }

  async processImport(fileBuffer: Buffer): Promise<ImportResult> {
    try {
      const startTime = Date.now();
      const records = await parseCSV(fileBuffer);
      
      console.log(`📊 Total records parsed from CSV: ${records.length}`);
      
      if (records.length === 0) {
        throw new Error('CSV file is empty or contains no valid data');
      }

      const result = await this.aiService.processRecords(records);

      const processingTime = Date.now() - startTime;

      console.log(`✅ Import complete: ${result.records.length} imported, ${result.skipped} skipped in ${processingTime}ms`);

      return {
        success: true,
        totalImported: result.records.length,
        totalSkipped: result.skipped,
        records: result.records,
        processingTime
      };
    } catch (error) {
      console.error('❌ Import processing failed:', error);
      throw error;
    }
  }

  async validateAndProcessCSV(fileBuffer: Buffer): Promise<{ headers: string[]; rowCount: number }> {
    const records = await parseCSV(fileBuffer);
    const headers = Object.keys(records[0] || {});
    
    console.log(`📊 CSV Validation: ${records.length} rows, ${headers.length} columns`);
    console.log(`📊 Headers: ${headers.join(', ')}`);
    
    return {
      headers,
      rowCount: records.length
    };
  }
}