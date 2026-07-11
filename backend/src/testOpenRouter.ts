import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  console.log('🔑 API Key exists:', !!apiKey);
  
  if (!apiKey) {
    console.error('❌ Missing API key');
    return;
  }

  // Current free models on OpenRouter (as of 2026)
  const freeModels = [
    "openrouter/optimus-alpha",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "google/gemini-2.0-flash-001",
    "mistralai/mistral-7b-instruct-v0.3",
    "microsoft/phi-3.5-mini-128k-instruct",
    "qwen/qwen-2.5-7b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "microsoft/phi-3-medium-128k-instruct",
  ];

  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });
    
    console.log('🌐 Testing OpenRouter models...');
    console.log('📋 Check your dashboard for free models: https://openrouter.ai/activity\n');
    
    let workingModel = null;
    
    for (const model of freeModels) {
      try {
        console.log(`📝 Testing: ${model}`);
        const completion = await client.chat.completions.create({
          model: model,
          messages: [
            {
              role: "user",
              content: "Say 'Hello, CSV Importer is working!'"
            }
          ],
          temperature: 0.2,
          max_tokens: 50,
        });

        console.log(`✅ SUCCESS with ${model}`);
        console.log(`📝 Response: ${completion.choices[0]?.message?.content}`);
        workingModel = model;
        break; // Stop after first successful model
      } catch (error: any) {
        if (error.status === 402) {
          console.log(`❌ ${model}: Requires payment`);
        } else if (error.status === 404) {
          console.log(`❌ ${model}: Not found`);
        } else {
          console.log(`❌ ${model}: ${error.message}`);
        }
      }
    }
    
    if (workingModel) {
      console.log(`\n✅ Use this model in your code: "${workingModel}"`);
      console.log('\n💡 To check all available models, visit:');
      console.log('   https://openrouter.ai/models');
    } else {
      console.log('\n❌ No working models found.');
      console.log('\n💡 Try these steps:');
      console.log('1. Visit: https://openrouter.ai/models');
      console.log('2. Filter by "Free"');
      console.log('3. Copy the exact model name');
      console.log('4. Update the model in your code');
      console.log('\n📋 Also check your OpenRouter dashboard:');
      console.log('   https://openrouter.ai/activity');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testOpenRouter();