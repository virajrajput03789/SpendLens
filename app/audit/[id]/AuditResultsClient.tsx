'use client';

import React, { useEffect, useState } from 'react';
import AuditResults from '@/components/AuditResults';

export default function AuditResultsClient({ initialData, mockId }: { initialData?: any, mockId?: string }) {
  const [aiSummary, setAiSummary] = useState<string>('Generating AI executive summary...');
  const [data, setData] = useState<any>(initialData);

  useEffect(() => {
    // In local testing without Supabase, load from localStorage
    if (!initialData && mockId) {
      const saved = localStorage.getItem('spendlens-mock-audit');
      if (saved) setData(JSON.parse(saved));
    }
  }, [initialData, mockId]);

  useEffect(() => {
    if (data && data.audit_output) {
      const fetchSummary = async () => {
        try {
          const res = await fetch('/api/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teamSize: data.team_size,
              useCase: data.use_case,
              currentTotal: data.audit_output.results.reduce((acc: number, r: any) => acc + r.currentMonthlyCost, 0),
              toolsSummary: data.audit_output.results.map((r: any) => r.tool).join(', '),
              totalSavings: data.audit_output.totalMonthlySavings,
              annualSavings: data.audit_output.totalAnnualSavings,
              toolCount: data.audit_output.results.length,
              topRecommendations: data.audit_output.results.filter((r: any) => r.monthlySavings > 0).map((r: any) => r.recommendedAction).join(' '),
              nextStep: 'Review the plan changes with your team.'
            }),
          });
          const { summary } = await res.json();
          setAiSummary(summary);
        } catch (e) {
          setAiSummary('Failed to generate summary.');
        }
      };
      fetchSummary();
    }
  }, [data]);

  if (!data) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AuditResults 
        auditData={data.audit_output} 
        aiSummary={aiSummary} 
        isPublic={false} 
      />
    </div>
  );
}
