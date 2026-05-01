import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AuditResultsClient from './AuditResultsClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('audits').select('*').eq('id', params.id).single();
  if (!data) return { title: 'Audit Not Found' };
  
  return {
    title: `My AI stack could save $${data.total_monthly_savings}/month`,
    description: 'Free AI spend audit — see if your team is overpaying',
    openGraph: {
      title: `My AI stack could save $${data.total_monthly_savings}/month`,
      description: 'Free AI spend audit — see if your team is overpaying',
      images: [`/api/og?savings=${data.total_monthly_savings}`],
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

export default async function AuditPage({ params }: { params: { id: string } }) {
  const { data: auditData, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !auditData) {
    // Return mock data for local testing when Supabase fails
    return <AuditResultsClient mockId={params.id} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuditResultsClient initialData={auditData} />
    </div>
  );
}
