const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testGemini(apiKey) {
  if (!apiKey) {
    console.log('⚠️ Gemini API Key: MISSING (Not configured in .env)');
    return;
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: 'GET',
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Gemini API Key: WORKING (Successfully listed models)');
    } else {
      console.log('❌ Gemini API Key: FAILED', data.error?.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Gemini API Key: ERROR', error.message);
  }
}

async function testGroq(apiKey) {
  if (!apiKey) {
    console.log('⚠️ Groq API Key: MISSING (Not configured in .env)');
    return;
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Groq API Key: WORKING');
    } else {
      console.log('❌ Groq API Key: FAILED', data.error?.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Groq API Key: ERROR', error.message);
  }
}

async function testOpenRouter(apiKey) {
  if (!apiKey) {
    console.log('⚠️ OpenRouter API Key: MISSING (Not configured in .env)');
    return;
  }
  try {
    let currentKey = apiKey;
    if(currentKey.startsWith('Sk-')) {
        currentKey = 'sk-' + currentKey.slice(3);
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentKey}`
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ OpenRouter API Key: WORKING');
    } else {
      console.log('❌ OpenRouter API Key: FAILED', data.error?.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ OpenRouter API Key: ERROR', error.message);
  }
}

async function testCloudflare(apiKey) {
  if (!apiKey) {
    console.log('⚠️ Cloudflare API Token: MISSING (Not configured in .env)');
    return;
  }
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok && data.success) {
      console.log('✅ Cloudflare API Token: WORKING (Token is active)');
    } else {
      console.log('❌ Cloudflare API Token: FAILED', data.errors?.[0]?.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Cloudflare API Token: ERROR', error.message);
  }
}

async function runTests() {
  console.log('Checking API Keys from Environment...\n');
  await testGemini(process.env.VITE_GEMINI_API_KEY);
  await testGroq(process.env.GROQ_API_KEY);
  await testOpenRouter(process.env.OPENROUTER_API_KEY);
  await testCloudflare(process.env.CLOUDFLARE_API_KEY);
}

runTests();
