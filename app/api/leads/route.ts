import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock-key');

export async function POST(req: Request) {
  try {
    const { email, company, auditId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Save to Supabase
    await supabase.from('leads').insert({
      email,
      company_name: company,
      audit_id: auditId
    });

    // Fetch audit to get savings
    const { data: audit } = await supabase.from('audits').select('*').eq('id', auditId).single();
    const totalSavings = audit?.total_monthly_savings || 0;
    const annualSavings = audit?.total_annual_savings || 0;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Team SpendLens <onboarding@resend.dev>',
        to: email,
        subject: `Your AI spend audit — $${totalSavings}/mo savings identified`,
        text: `Hi there,

We've analyzed your AI stack and found $${totalSavings}/month in potential savings ($${annualSavings}/year).

View your full audit: ${baseUrl}/audit/${auditId}

${audit?.is_high_savings ? 'A Credex specialist will reach out within 24 hours about how discounted AI credits could save you an additional 10–30%.' : ''}

— Team SpendLens`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
