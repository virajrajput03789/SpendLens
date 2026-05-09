import OpenAI from 'openai';

async function testAI() {
  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: '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'
  });

  try {
    console.log('Testing NVIDIA GLM-5.1 connection...');
    const completion = await client.chat.completions.create({
      model: "z-ai/glm-5.1",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10
    });
    console.log('Success:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testAI();
