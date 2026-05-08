import { ToolName, UseCase, PRICING_DATA } from './pricing-data';

export interface UserToolInput {
  tool: string;
  plan: string;
  currentMonthlyCost: number;
  seats: number;
}

export interface ToolAuditResult {
  tool: string;
  currentPlan: string;
  currentMonthlyCost: number;
  recommendation: 'downgrade' | 'switch' | 'credits' | 'optimal';
  recommendedAction: string;
  recommendedPlan?: string;
  monthlySavings: number;
  annualSavings: number;
  creditsOpportunity: boolean;
  confidence: 'high' | 'medium';
}

export interface AuditOutput {
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isOptimal: boolean;
  highSavingsCase: boolean;
  auditId: string;
}

export function runAudit(
  inputs: UserToolInput[],
  teamSize: number,
  useCase: UseCase
): AuditOutput {
  let totalMonthlySavings = 0;
  const results: ToolAuditResult[] = [];
  
  for (const input of inputs) {
    let result: ToolAuditResult = {
      tool: input.tool,
      currentPlan: input.plan,
      currentMonthlyCost: input.currentMonthlyCost,
      recommendation: 'optimal',
      recommendedAction: 'You are on the most cost-effective plan.',
      monthlySavings: 0,
      annualSavings: 0,
      creditsOpportunity: false,
      confidence: 'high'
    };

    // Rule 4: Credits arbitrage (always evaluated)
    if (input.currentMonthlyCost > 200) {
      result.creditsOpportunity = true;
      if (result.recommendation === 'optimal') {
        result.recommendation = 'credits';
        result.recommendedAction = `Credex offers discounted credits for ${input.tool} — potential 10–30% savings on top of plan optimization.`;
      }
    }

    const toolData = PRICING_DATA[input.tool as keyof typeof PRICING_DATA];

    if (toolData) {
      const currentPlanPrice = toolData[input.plan as keyof typeof toolData] as number | undefined;
      const actualCurrentCost = currentPlanPrice ? currentPlanPrice * input.seats : input.currentMonthlyCost;

      // Rule 1: Wrong plan for team size
      if (input.seats < 3 && (input.plan.includes('Team') || input.plan.includes('Business') || input.plan.includes('Enterprise'))) {
        let individualPlan = '';
        let individualPrice = 0;

        if (input.tool === 'Cursor') { 
          individualPlan = 'Pro'; 
          individualPrice = (toolData as any)['Pro'] || 0; 
        }
        else if (input.tool === 'GitHub Copilot') { 
          individualPlan = 'Individual'; 
          individualPrice = (toolData as any)['Individual'] || 0; 
        }
        else if (input.tool === 'Claude (Anthropic)') { 
          individualPlan = 'Pro'; 
          individualPrice = (toolData as any)['Pro'] || 0; 
        }
        else if (input.tool === 'ChatGPT (OpenAI)') { 
          individualPlan = 'Plus'; 
          individualPrice = (toolData as any)['Plus'] || 0; 
        }
        else if (input.tool === 'Windsurf') { 
          individualPlan = 'Pro'; 
          individualPrice = (toolData as any)['Pro'] || 0; 
        }

        if (individualPlan && currentPlanPrice && currentPlanPrice > individualPrice) {
          result.recommendation = 'downgrade';
          result.recommendedPlan = individualPlan;
          result.monthlySavings = (currentPlanPrice - individualPrice) * input.seats;
          result.recommendedAction = `Team plans make sense at 5+ seats. At ${input.seats} seats, ${individualPlan} is more cost-effective.`;
          result.confidence = 'high';
        }
      }
      
      // Rule 2: Cheaper same-vendor plan (if not already downgraded by Rule 1)
      if (result.recommendation === 'optimal' || result.recommendation === 'credits') {
         if (input.tool === 'Claude (Anthropic)' && input.plan === 'Max' && useCase !== 'data') {
             const maxPrice = (toolData as any)['Max'] || 0;
             const proPrice = (toolData as any)['Pro'] || 0;
             result.recommendation = 'downgrade';
             result.recommendedPlan = 'Pro';
             result.monthlySavings = (maxPrice - proPrice) * input.seats;
             result.recommendedAction = `Based on your ${useCase} use case, Pro covers the core features you need.`;
             result.confidence = 'medium';
         }
      }

      // Rule 3: Cheaper alternative tool (cross-vendor)
      if ((result.recommendation === 'optimal' || result.recommendation === 'credits') && currentPlanPrice) {
        let alternative = '';
        let altPrice = 0;

        if (useCase === 'coding' && input.tool === 'GitHub Copilot' && input.plan === 'Business') {
           alternative = 'Cursor Pro';
           altPrice = PRICING_DATA['Cursor']['Pro'];
        } else if (useCase === 'writing' && input.tool === 'ChatGPT (OpenAI)' && input.plan === 'Team') {
           alternative = 'Claude Pro';
           altPrice = PRICING_DATA['Claude (Anthropic)']['Pro'];
        }

        if (alternative && currentPlanPrice > altPrice) {
           const savings = ((currentPlanPrice - altPrice) / currentPlanPrice) * 100;
           if (savings > 20) {
              result.recommendation = 'switch';
              result.recommendedAction = `For ${useCase}, ${alternative} offers comparable output at ${Math.round(savings)}% lower cost based on current pricing.`;
              result.monthlySavings = (currentPlanPrice - altPrice) * input.seats;
              result.confidence = 'medium';
           }
        }
      }
    }

    result.annualSavings = result.monthlySavings * 12;
    totalMonthlySavings += result.monthlySavings;
    results.push(result);
  }

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isOptimal: totalMonthlySavings < 100,
    highSavingsCase: totalMonthlySavings > 500,
    auditId: crypto.randomUUID(),
  };
}

export function generateFallbackSummary(
  currentTotal: number,
  toolCount: number,
  useCase: UseCase,
  teamSize: number,
  totalSavings: number,
  annualSavings: number,
  topRecommendation: string,
  nextStep: string
): string {
  return `Your team is spending $${currentTotal}/month across ${toolCount} AI tools. Based on your ${useCase} use case and team size of ${teamSize}, we identified $${totalSavings}/month in potential savings — that's $${annualSavings} annually. The biggest opportunity is ${topRecommendation}. Your next step: ${nextStep}.`;
}
