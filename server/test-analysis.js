const axios = require('axios');

async function testAnalysisEndpoint() {
  console.log('🧪 Testing Backend Analysis Endpoint\n');
  console.log('=' .repeat(50));
  
  const testPayload = {
    topic: 'Sustainable Fashion',
    sources: ['news'] // Just news API for faster response
  };

  console.log('\n📤 Request:');
  console.log('URL: POST http://localhost:5001/api/analysis');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  console.log('\n⏳ Sending request (60s timeout)...\n');

  try {
    const startTime = Date.now();
    
    const response = await axios.post('http://localhost:5001/api/analysis', testPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('✅ SUCCESS!\n');
    console.log('=' .repeat(50));
    console.log(`⏱️  Response Time: ${duration}s`);
    console.log('📊 Status Code:', response.status);
    console.log('\n📥 Response Structure:\n');
    
    // Show response structure without full content
    const data = response.data.data;
    console.log('Response Keys:', Object.keys(response.data));
    console.log('\n🔍 Validation:');
    console.log('✓ Success:', response.data.success);
    console.log('✓ Topic:', data.topic);
    console.log('✓ Summary Length:', data.summary?.length || 0, 'chars');
    console.log('✓ Key Insights:', data.keyInsights?.length || 0, 'items');
    console.log('✓ Emerging Trends:', data.emergingTrends?.length || 0, 'items');
    console.log('✓ Sentiment:', data.sentiment ? `${data.sentiment.positive}% positive` : 'Missing');
    console.log('✓ Competitors:', data.competitors?.length || 0, 'items');
    console.log('✓ Sources:', data.sources?.length || 0, 'items');
    console.log('✓ Future Outlook Length:', data.futureOutlook?.length || 0, 'chars');
    console.log('✓ Correlation Matrix:', data.correlationMatrix?.trends?.length || 0, 'trends');
    
    console.log('\n📊 Sample Data:');
    console.log('First Insight:', data.keyInsights?.[0]?.insight?.substring(0, 80) + '...');
    console.log('First Trend:', data.emergingTrends?.[0]?.trend);
    console.log('Model Used:', response.data.metadata?.model);
    
    console.log('\n✨ All systems operational! Backend is working correctly.\n');
    
  } catch (error) {
    console.log('❌ ERROR!\n');
    console.log('=' .repeat(50));
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏱️  Request timed out after 60 seconds');
      console.log('This might mean the API calls are taking too long.');
    } else if (error.response) {
      console.log('Status Code:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Is the backend running on http://localhost:5001?');
    } else {
      console.log('Error:', error.message);
    }
    
    process.exit(1);
  }
}

testAnalysisEndpoint();
