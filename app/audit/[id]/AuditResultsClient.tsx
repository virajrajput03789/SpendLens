'use client';

import React, { useEffect, useState, useRef } from 'react';
import AuditResults from '@/components/AuditResults';
import BackButton from '@/components/ui/BackButton';

export default function AuditResultsClient({ initialData, mockId }: { initialData?: any, mockId?: string }) {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [data, setData] = useState<any>(initialData);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // In local testing without Supabase, load from localStorage
    if (!initialData && mockId) {
      const saved = localStorage.getItem('spendlens-mock-audit');
      if (saved) setData(JSON.parse(saved));
    }
  }, [initialData, mockId]);

  useEffect(() => {
    if (data && data.audit_output && !fetchedRef.current) {
      fetchedRef.current = true;
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

          if (!res.ok) throw new Error('Failed to fetch summary');

          const reader = res.body?.getReader();
          if (!reader) throw new Error('No reader available');
          
          const decoder = new TextDecoder();
          let summaryText = '';

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              const chunkValue = decoder.decode(value, { stream: true });
              summaryText += chunkValue;
              setAiSummary(summaryText);
            }
          } finally {
            reader.releaseLock();
          }
        } catch (e) {
          console.error('Streaming error:', e);
          setAiSummary('Failed to generate summary.');
          fetchedRef.current = false;
        }
      };
      fetchSummary();
    }
  }, [data]);

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
       <div className="w-12 h-12 border-4 border-[#6366f1]/20 border-t-[#6366f1] rounded-full animate-spin mb-4"></div>
       <div className="text-[var(--text-muted)] font-medium">Loading audit data...</div>
    </div>
  );

  return (
    <div className="w-full max-w-[760px] mx-auto bg-[#0a0a0f]">
      <BackButton label="Back to Audit" />
      <AuditResults 
        auditData={data.audit_output} 
        aiSummary={aiSummary} 
        isPublic={false} 
      />
    </div>
  );
}
