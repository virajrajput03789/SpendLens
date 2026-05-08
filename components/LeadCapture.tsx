'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LeadCapture({ auditId, isHighSavings, isOptimal }: { auditId: string, isHighSavings: boolean, isOptimal: boolean }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const honeypot = formData.get('website');
    if (honeypot) {
      setSubmitted(true); // Silently drop
      return;
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role, auditId }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-[24px] p-12 text-center mt-8 animate-fade-up">
        <div className="text-[#6366f1] text-[48px] mb-4">📬</div>
        <h3 className="font-display text-[24px] font-bold text-white mb-2">Report sent!</h3>
        <p className="text-[#94a3b8]">Check your inbox for the full breakdown and Credex optimization guide.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#12121f] border border-white/[0.08] rounded-[24px] p-10 mt-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-up stagger-3" style={{ animationDelay: '0.3s' }}>
      <div className="mb-8">
        <h3 className="font-display text-[22px] font-bold text-white mb-2">📬 Get your report in your inbox</h3>
        <p className="text-[#94a3b8] text-[14px]">
          {isHighSavings 
            ? "We'll email your full audit. For high-savings cases, a Credex specialist will reach out within 24 hours."
            : "We'll email your full audit breakdown and notify you of future optimization opportunities."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        
        <div className="space-y-2">
          <label className="label-dark">Work Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@company.com" 
            className="input-dark"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-dark">Company (Optional)</label>
            <input 
              type="text" 
              value={company} 
              onChange={e => setCompany(e.target.value)} 
              placeholder="Acme Corp" 
              className="input-dark"
            />
          </div>
          <div className="space-y-2">
            <label className="label-dark">Role (Optional)</label>
            <input 
              type="text" 
              value={role} 
              onChange={e => setRole(e.target.value)} 
              placeholder="Engineering Lead" 
              className="input-dark"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-display font-bold py-4 px-6 rounded-[12px] shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Send me the report →</span>
          )}
        </button>
      </form>
    </div>
  );
}
