import { NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inputs, teamSize, useCase } = body;

    if (!inputs || !teamSize || !useCase) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auditOutput = runAudit(inputs, teamSize, useCase);

    // Save to Supabase
    const { error } = await supabase.from('audits').insert({
      id: auditOutput.auditId,
      use_case: useCase,
      team_size: teamSize,
      tools_input: inputs,
      audit_output: auditOutput,
      total_monthly_savings: auditOutput.totalMonthlySavings,
      total_annual_savings: auditOutput.totalAnnualSavings,
      is_high_savings: auditOutput.highSavingsCase
    });

    if (error) {
      console.error('Error saving to Supabase:', error);
      // Continue anyway for the sake of the UX if DB fails
    }

    return NextResponse.json({ success: true, auditId: auditOutput.auditId, auditOutput });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
