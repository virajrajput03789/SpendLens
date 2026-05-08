'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING_DATA, ToolName, UseCase } from '@/lib/pricing-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Search, ChevronDown } from 'lucide-react';

interface ToolInput {
  id: string;
  tool: string;
  plan: string;
  currentMonthlyCost: number;
  seats: number;
}

export default function AuditForm() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCase>('coding');
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spendlens-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
        if (parsed.tools) setTools(parsed.tools);
      } catch (e) {
        console.error('Failed to parse form state');
      }
    } else {
      addTool();
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendlens-form', JSON.stringify({ teamSize, useCase, tools }));
    }
  }, [teamSize, useCase, tools, isLoaded]);

  const addTool = () => {
    setTools([...tools, { id: crypto.randomUUID(), tool: 'Cursor', plan: 'Pro', currentMonthlyCost: 20, seats: 1 }]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const updateTool = (id: string, field: keyof ToolInput, value: any) => {
    setTools(tools.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === 'tool' || field === 'plan' || field === 'seats') {
          const toolData = PRICING_DATA[updated.tool as ToolName];
          if (toolData && field === 'tool') {
             updated.plan = Object.keys(toolData)[0]; // Reset plan to first available
          }
          const pData = PRICING_DATA[updated.tool as ToolName];
          if (pData) {
            const price = pData[updated.plan as keyof typeof pData] as number | undefined;
            if (price !== undefined) {
               updated.currentMonthlyCost = price * updated.seats;
            }
          }
        }
        return updated;
      }
      return t;
    }));
  };

  const currentTotalCost = tools.reduce((sum, t) => sum + (Number(t.currentMonthlyCost) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tools.some(t => t.seats > teamSize)) {
      setError('Seats for a tool cannot exceed total team size.');
      return;
    }

    if (tools.length === 0) {
      setError('Please add at least one tool.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: tools, teamSize, useCase }),
      });

      if (!res.ok) throw new Error('Failed to run audit');
      
      const data = await res.json();
      localStorage.setItem('spendlens-mock-audit', JSON.stringify({
        team_size: teamSize,
        use_case: useCase,
        audit_output: data.auditOutput
      }));
      router.push(`/audit/${data.auditId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  const inputClasses = "bg-[#0a0a0f] border-[var(--border-default)] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all rounded-lg h-10 text-[14px]";
  const triggerClasses = "w-full bg-[#0a0a0f] border-[var(--border-default)] focus:border-[#6366f1] transition-all rounded-lg h-11 text-[14px] text-white";
  const contentClasses = "bg-[#12121f] border border-white/10 text-white shadow-2xl z-[100]";
  const itemClasses = "cursor-pointer focus:bg-[#6366f1] focus:text-white transition-colors";

  return (
    <div className="min-h-screen bg-[#04040a] py-[60px] px-6 flex justify-center items-start relative">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-[680px] w-full bg-[#12121f] border border-white/[0.08] rounded-[24px] p-12 shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-up relative z-1">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] rounded-t-[2px]" />

        <div className="mb-10">
          <div className="w-10 h-10 bg-[#6366f1]/20 border border-[#6366f1]/30 rounded-full flex items-center justify-center mb-4 text-[20px]">
            🔍
          </div>
          <h1 className="font-display text-[28px] font-bold text-white">Audit Your AI Stack</h1>
          <p className="text-[#94a3b8] text-[14px] mt-2">Tell us what you use. We'll tell you what to cut.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="label-dark">Total Team Size</label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                required
                className="input-dark h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="label-dark">Primary Use Case</label>
              <Select value={useCase} onValueChange={(v) => v && setUseCase(v as UseCase)}>
                <SelectTrigger className={triggerClasses}>
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent className={contentClasses}>
                  <SelectItem value="coding" className={itemClasses}>Coding / Engineering</SelectItem>
                  <SelectItem value="writing" className={itemClasses}>Writing / Content</SelectItem>
                  <SelectItem value="data" className={itemClasses}>Data Analysis</SelectItem>
                  <SelectItem value="research" className={itemClasses}>Research</SelectItem>
                  <SelectItem value="mixed" className={itemClasses}>Mixed / General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <label className="label-dark mb-0">TOOLS</label>
            <button 
              type="button" 
              onClick={addTool}
              className="bg-transparent border border-[#6366f1]/30 text-[#6366f1] rounded-[8px] px-4 py-2 text-[13px] font-medium transition-all hover:bg-[#6366f1]/5 hover:border-[#6366f1]"
            >
              + Add Tool
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {tools.map((tool) => {
              const availablePlans = PRICING_DATA[tool.tool as ToolName] 
                ? Object.keys(PRICING_DATA[tool.tool as ToolName]) 
                : ['Custom'];

              return (
                <div key={tool.id} className="group bg-white/[0.02] border border-white/[0.04] rounded-[12px] p-5 relative overflow-hidden transition-all hover:border-white/[0.08] hover:bg-white/[0.04]">
                  <div className="absolute left-0 top-0 w-[3px] h-full bg-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 sm:col-span-5 space-y-1">
                      <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Tool</label>
                      <Select value={tool.tool} onValueChange={(v) => updateTool(tool.id, 'tool', v)}>
                        <SelectTrigger className="bg-[#0a0a0f] border-white/5 h-10 text-[13px] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={contentClasses}>
                          {Object.keys(PRICING_DATA).map(t => (
                            <SelectItem key={t} value={t} className={itemClasses}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Plan</label>
                      <Select value={tool.plan} onValueChange={(v) => updateTool(tool.id, 'plan', v)}>
                        <SelectTrigger className="bg-[#0a0a0f] border-white/5 h-10 text-[13px] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={contentClasses}>
                          {availablePlans.map(p => (
                            <SelectItem key={p} value={p} className={itemClasses}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-3 sm:col-span-1.5 space-y-1">
                      <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Seats</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={tool.seats} 
                        onChange={(e) => updateTool(tool.id, 'seats', parseInt(e.target.value) || 1)} 
                        className="input-dark h-10 px-2"
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-1.5 space-y-1 flex items-end">
                      <button 
                        type="button" 
                        onClick={() => removeTool(tool.id)}
                        className="text-[#ef4444]/50 hover:text-[#ef4444] hover:bg-[#ef4444]/10 p-2.5 rounded-[6px] transition-all ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#6366f1]/5 border border-[#6366f1]/15 rounded-[12px] p-5 flex justify-between items-center mb-6">
            <span className="text-[13px] text-[#94a3b8] font-medium">Running Total Spend</span>
            <span className="font-display text-[22px] font-bold text-[#6366f1] transition-all animate-[counter_0.3s_ease]">
              ${currentTotalCost.toLocaleString()}/mo
            </span>
          </div>

          {error && <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-[13px] font-medium p-4 rounded-[12px] mb-6">{error}</div>}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-display font-bold py-4 px-6 rounded-[12px] shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-[0_2px_10px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Running Audit...</span>
              </>
            ) : (
              <span>Analyze Spend & Identify Savings</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
