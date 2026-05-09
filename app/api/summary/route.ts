import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize NVIDIA AI Client
const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY
});

export async function POST(req: Request) {
  try {
    const { 
      teamSize, 
      useCase, 
      currentTotal, 
      toolsSummary, 
      totalSavings, 
      topRecommendations
    } = await req.json();

    const prompt = `
You are a financial advisor specializing in AI infrastructure costs.
A startup team has just completed an AI spend audit. Here are their results:

Team size: ${teamSize}
Primary use case: ${useCase}
Current total monthly AI spend: $${currentTotal}
Tools audited: ${toolsSummary}
Total potential monthly savings: $${totalSavings}
Key recommendations: ${topRecommendations}

Write a concise, friendly, and specific 100-word audit summary for this team.
Be direct about the savings opportunity. Mention specific tools by name.
Do not be generic. Do not use filler phrases like "it's important to note."
End with one actionable next step they should take this week.
    `;

    const response = await client.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Lower temperature for faster, more focused response
      max_tokens: 256,   // Drastically reduced tokens to speed up generation
      presence_penalty: 0.1,
      stream: true,
    });

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err: any) {
          console.error('Stream error:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
