// Test script to check Azure deployments
const https = require('https');

const deployments = [
  {
    name: 'Static Web App',
    baseUrl: 'https://salmon-hill-0c0adfc0f.2.azurestaticapps.net',
  },
  {
    name: 'Container App',
    baseUrl: 'https://billcollector.happybeach-985d7362.westus2.azurecontainerapps.io',
  }
];

async function testDeployment(deployment) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${deployment.name}`);
  console.log(`URL: ${deployment.baseUrl}`);
  console.log('='.repeat(60));

  // Test 1: Health check (version endpoint)
  try {
    const versionResponse = await fetch(`${deployment.baseUrl}/api/version`);
    const versionData = await versionResponse.json();
    console.log('✅ Version API:', JSON.stringify(versionData, null, 2));
  } catch (error) {
    console.error('❌ Version API failed:', error.message);
  }

  // Test 2: Upload a sample file
  try {
    console.log('\nUploading sample file...');
    const sampleData = {
      callId: "test-call-" + Date.now(),
      date: new Date().toISOString(),
      agent: "Test Agent",
      duration: 180,
      transcript: [
        { speaker: "agent", text: "Hello, this is regarding your account." },
        { speaker: "client", text: "What do you want?" },
        { speaker: "agent", text: "You must pay this debt immediately or we'll garnish your wages!" }
      ]
    };

    const uploadResponse = await fetch(`${deployment.baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'test-call.json',
        content: JSON.stringify(sampleData),
      })
    });

    const uploadResult = await uploadResponse.json();
    console.log('📤 Upload response:', JSON.stringify(uploadResult, null, 2));

    if (uploadResult.success) {
      // Test 3: Trigger processing
      console.log('\nTriggering analysis...');
      const processResponse = await fetch(`${deployment.baseUrl}/api/process/test-call.json`, {
        method: 'POST',
      });
      
      const processResult = await processResponse.json();
      console.log('⚙️  Process response:', JSON.stringify(processResult, null, 2));

      // Wait a bit for processing
      console.log('\nWaiting 5 seconds for processing...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Test 4: Get analysis
      console.log('\nFetching analysis...');
      const analysisResponse = await fetch(`${deployment.baseUrl}/api/analysis/test-call.json`);
      const analysisResult = await analysisResponse.json();
      console.log('📊 Analysis result:', JSON.stringify(analysisResult, null, 2));
    }
  } catch (error) {
    console.error('❌ Test flow failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function main() {
  for (const deployment of deployments) {
    try {
      await testDeployment(deployment);
    } catch (error) {
      console.error(`Failed to test ${deployment.name}:`, error);
    }
  }
}

main().catch(console.error);
