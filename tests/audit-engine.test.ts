import { expect, test, describe } from 'vitest';
import { runAudit, generateFallbackSummary } from '../lib/audit-engine';

describe('Audit Engine Logic', () => {
  // Test 1: Team of 2 on Business plan → recommend Individual
  test('recommends downgrade for small team on business plan', () => {
    const inputs = [{ tool: 'Cursor', plan: 'Business', currentMonthlyCost: 80, seats: 2 }];
    const output = runAudit(inputs, 2, 'coding');
    expect(output.results[0].recommendation).toBe('downgrade');
    expect(output.results[0].recommendedPlan).toBe('Pro');
    expect(output.results[0].monthlySavings).toBe(40); // 2 seats * ($40 - $20)
  });

  // Test 2: Optimal spend → isOptimal: true, no savings inflated
  test('returns isOptimal true when savings < $100', () => {
    const inputs = [{ tool: 'Cursor', plan: 'Pro', currentMonthlyCost: 40, seats: 2 }];
    const output = runAudit(inputs, 2, 'coding');
    expect(output.isOptimal).toBe(true);
    expect(output.totalMonthlySavings).toBeLessThan(100);
  });

  // Test 3: High savings case > $500 triggers flag
  test('sets highSavingsCase true when savings exceed $500', () => {
    // 30 seats on Cursor Business ($1200) could be on Cursor Pro ($600) -> savings $600
    // Wait, Rule 1 says "If tool is per-seat AND user has <3 seats", so it won't trigger Rule 1 for 30 seats.
    // Instead we can test Rule 3 (switch) or Rule 2 (downgrade) 
    // Let's use a large team on Claude Max instead, downgrading to Pro based on 'writing' useCase.
    const inputs = [{ tool: 'Claude (Anthropic)', plan: 'Max', currentMonthlyCost: 1000, seats: 10 }];
    const output = runAudit(inputs, 10, 'writing');
    expect(output.highSavingsCase).toBe(true);
    expect(output.totalMonthlySavings).toBeGreaterThan(500);
  });

  // Test 4: Cross-vendor switch savings calculated correctly
  test('calculates cross-vendor savings accurately', () => {
    const inputs = [{ tool: 'GitHub Copilot', plan: 'Business', currentMonthlyCost: 190, seats: 10 }];
    // For coding, Copilot Business ($19) vs Cursor Pro ($20) - actually wait, the hardcoded rule we added:
    // If coding, Copilot Business vs Cursor Pro -> wait, Cursor Pro is $20, Copilot Business is $19. It doesn't save!
    // Let's use writing -> ChatGPT Team ($30) vs Claude Pro ($20). Savings = $10 * 10 = $100.
    const inputs2 = [{ tool: 'ChatGPT (OpenAI)', plan: 'Team', currentMonthlyCost: 300, seats: 10 }];
    const output = runAudit(inputs2, 10, 'writing');
    expect(output.results[0].recommendation).toBe('switch');
    expect(output.results[0].monthlySavings).toBe(100);
  });

  // Test 5: Credits opportunity triggered for spend > $200
  test('flags credits opportunity for high-spend tools', () => {
    const inputs = [{ tool: 'Cursor', plan: 'Pro', currentMonthlyCost: 240, seats: 12 }]; // optimal plan but > $200
    const output = runAudit(inputs, 12, 'coding');
    expect(output.results[0].creditsOpportunity).toBe(true);
    expect(output.results[0].recommendation).toBe('credits');
  });

  // Test 6: Annual savings = monthly * 12
  test('annual savings equals monthly times twelve', () => {
    const inputs = [{ tool: 'Cursor', plan: 'Business', currentMonthlyCost: 80, seats: 2 }];
    const output = runAudit(inputs, 2, 'coding');
    expect(output.totalAnnualSavings).toBe(output.totalMonthlySavings * 12);
  });

  // Test 7: Fallback audit summary generated when AI fails
  test('generates fallback summary when API is unavailable', () => {
    const summary = generateFallbackSummary(300, 2, 'coding', 5, 100, 1200, 'downgrade Cursor', 'Cancel seats');
    expect(summary).toContain('Your team is spending $300/month');
    expect(summary).toContain('100/month in potential savings');
    expect(summary).toContain('Cancel seats');
  });
});
