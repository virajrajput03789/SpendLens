'use client';

import React, { useState } from 'react';
import { AuditOutput, ToolAuditResult } from '@/lib/audit-engine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Copy, CheckCircle, Sparkles, TrendingDown, RefreshCcw, Zap } from 'lucide-react';
import LeadCapture from './LeadCapture';

interface AuditResultsProps {
  auditData: AuditOutput;
  aiSummary: string;
  isPublic: boolean;
}

export default function AuditResults({ auditData, aiSummary, isPublic }: AuditResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (result: ToolAuditResult) => {
    if (result.monthlySavings === 0) {
      return (
        <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5" role="status">
          <CheckCircle className="w-3.5 h-3.5" /> Optimal
        </div>
      );
    }
    
    if (result.recommendation === 'downgrade') {
      return (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5" role="status">
          <TrendingDown className="w-3.5 h-3.5" /> Downgrade
        </div>
      );
    }

    if (result.recommendation === 'switch') {
      return (
        <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5" role="status">
          <RefreshCcw className="w-3.5 h-3.5" /> Switch
        </div>
      );
    }

    return (
      <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 text-[#a78bfa] px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5" role="status">
        <Zap className="w-3.5 h-3.5" /> Credits
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-[800px] mx-auto w-full pb-32 animate-fade-up">
      {/* Hero Savings Card */}
      <div className={`relative overflow-hidden border rounded-[24px] p-12 text-center shadow-2xl transition-all ${auditData.totalMonthlySavings > 100 ? 'border-[#10b981]/20 bg-gradient-to-br from-[#10b981]/5 to-[#6366f1]/5 animate-[border-flow_3s_ease_infinite]' : 'border-[#10b981]/25 bg-[#10b981]/5'}`}>
        <div className="flex flex-col items-center">
          {auditData.totalMonthlySavings > 100 ? (
            <>
              <div className="bg-[#10b981]/10 border border-[#10b981]/25 rounded-full px-5 py-2 text-[13px] font-bold text-[#10b981] flex items-center gap-2 mb-6">
                💰 Savings Opportunity Found
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display text-[80px] font-black text-[#10b981] tracking-tight drop-shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-[counter_0.6s_ease]">
                  ${auditData.totalMonthlySavings}
                </span>
                <span className="text-[28px] text-[#94a3b8] font-medium">/month</span>
              </div>
              <p className="text-[18px] text-[#94a3b8] mt-2">
                That's <span className="text-white font-bold">${auditData.totalAnnualSavings.toLocaleString()}</span> saved every year
              </p>
            </>
          ) : (
            <>
              <div className="text-[#10b981] text-[48px] mb-4">✓</div>
              <h1 className="font-display text-[32px] font-bold text-[#10b981]">You're spending well.</h1>
              <p className="text-[#94a3b8] text-[16px] mt-2">No major optimizations found for your current stack.</p>
            </>
          )}
        </div>
        
        {auditData.highSavingsCase && (
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
             <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-[16px] p-8 text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-[16px] mb-1 flex items-center gap-2">
                     <Zap className="text-[#6366f1] w-4 h-4" /> Capture even more savings
                  </h4>
                  <p className="text-[#94a3b8] text-[13px]">
                    Credex offers discounted AI credits — save an additional 10–30%
                  </p>
                </div>
                <button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold px-6 py-3 rounded-[8px] text-[14px] whitespace-nowrap shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-[1px] transition-all">
                  Book Free Consultation →
                </button>
             </div>
          </div>
        )}
      </div>

      {/* AI Summary Card */}
      <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] border-l-[3px] border-l-[#6366f1] rounded-[16px] p-8 shadow-xl animate-fade-up stagger-1" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[18px]">✨</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6366f1]">AI Executive Summary</span>
          <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-full px-2.5 py-0.5 text-[10px] text-[#06b6d4] ml-auto">
            Powered by NVIDIA Llama 3.1
          </div>
        </div>
        
        {aiSummary ? (
          <p className="text-[#94a3b8] text-[15px] leading-[1.8] italic font-medium">
            {aiSummary}
          </p>
        ) : (
          <div className="space-y-3" aria-busy="true" aria-label="Loading AI summary">
            <div className="h-4 bg-white/5 rounded w-full animate-shimmer"></div>
            <div className="h-4 bg-white/5 rounded w-[90%] animate-shimmer"></div>
            <div className="h-4 bg-white/5 rounded w-[70%] animate-shimmer"></div>
          </div>
        )}
      </div>

      {/* Per-Tool Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-[0.1em]">PER-TOOL BREAKDOWN</h3>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        
        <div className="space-y-3">
          {auditData.results.map((result: ToolAuditResult, i) => (
            <div 
              key={i} 
              className="bg-[#12121f] border border-white/[0.04] rounded-[16px] p-6 transition-all hover:border-white/[0.16] hover:bg-[#17172a] hover:translate-x-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-up group"
              style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <div className="text-white font-semibold text-[15px]">{result.tool}</div>
                  <div className="flex gap-1.5 items-center">
                    <span className="bg-white/5 border border-white/[0.04] rounded-[6px] px-2.5 py-1 text-[12px] text-[#94a3b8] font-mono">
                      {result.currentPlan}
                    </span>
                    <span className="bg-white/5 border border-white/[0.04] rounded-[6px] px-2.5 py-1 text-[12px] text-[#475569] font-mono">
                      ${result.currentMonthlyCost}/mo
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(result)}
                  {result.monthlySavings > 0 && (
                    <span className="font-display text-[18px] font-bold text-[#10b981]">
                      ${result.monthlySavings}/mo saved
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/[0.04] flex justify-between items-start">
                <p className="text-[13px] text-[#94a3b8] leading-[1.6] max-w-[80%]">
                  {result.recommendedAction}
                </p>
                <div className={`text-[11px] px-2 py-0.5 rounded-full ${result.confidence === 'high' ? 'bg-[#10b981]/5 text-[#10b981]' : 'bg-[#f59e0b]/5 text-[#f59e0b]'}`}>
                  ● {result.confidence === 'high' ? 'High' : 'Medium'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isPublic && (
        <LeadCapture auditId={auditData.auditId} isHighSavings={auditData.highSavingsCase} isOptimal={auditData.isOptimal} />
      )}

      {/* Share Button */}
      <div className="flex justify-center pt-10">
        <button 
          onClick={handleCopy} 
          className={`inline-flex items-center gap-2 bg-transparent border rounded-[12px] px-6 py-3 text-[14px] font-medium transition-all ${copied ? 'border-[#10b981] text-[#10b981]' : 'border-white/[0.08] text-[#94a3b8] hover:border-[#6366f1]/30 hover:text-[#6366f1] hover:bg-[#6366f1]/5'}`}
          aria-live="polite"
        >
          {copied ? (
            <><span>✓ Link copied to clipboard!</span></>
          ) : (
            <><span>🔗 Copy Public Share Link</span></>
          )}
        </button>
      </div>
    </div>
  );
}
