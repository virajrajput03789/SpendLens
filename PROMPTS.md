# Prompts

## AI Summary Prompt (used in /api/summary)

### Final prompt:
```text
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
```

### Why this structure:
- Role assignment ("financial advisor") improves specificity vs generic assistant
- Explicit "do not be generic" prevents filler phrases
- Structured data injection ensures all numbers are referenced
- 100-word constraint forces prioritization — longer summaries dilute the insight

### What I tried that didn't work:
- First attempt: no role, no constraint → generic paragraphs with no numbers
- Second attempt: asked for "3 bullet points" → lost the personal, readable tone
- Final: prose with hard word count + explicit anti-patterns listed

### Fallback:
```text
Your team is spending $${currentTotal}/month across ${toolCount} AI tools.
Based on your ${useCase} use case and team size of ${teamSize},
we identified $${totalSavings}/month in potential savings — that's
$${annualSavings} annually. The biggest opportunity is ${topRecommendation}.
Your next step: ${nextStep}.
```
