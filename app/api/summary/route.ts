import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateFallbackSummary } from '@/lib/audit-engine';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { 
      teamSize, 
      useCase, 
      currentTotal, 
      toolsSummary, 
      totalSavings, 
      topRecommendations,
      toolCount,
      annualSavings,
      nextStep
    } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      const fallback = generateFallbackSummary(currentTotal, toolCount, useCase, teamSize, totalSavings, annualSavings, topRecommendations, nextStep);
      return NextResponse.json({ summary: fallback });
    }

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

    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash-latest" },
      { apiVersion: "v1beta" }
    );
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text() || generateFallbackSummary(currentTotal, toolCount, useCase, teamSize, totalSavings, annualSavings, topRecommendations, nextStep);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary API Error:', error);
    const body = await req.json().catch(() => ({}));
    const fallback = generateFallbackSummary(
      body.currentTotal || 0, 
      body.toolCount || 0, 
      body.useCase || 'mixed', 
      body.teamSize || 1, 
      body.totalSavings || 0, 
      body.annualSavings || 0, 
      body.topRecommendations || 'Reviewing tool usage', 
      body.nextStep || 'Review your team plans'
    );
    return NextResponse.json({ summary: fallback });
  }
}
