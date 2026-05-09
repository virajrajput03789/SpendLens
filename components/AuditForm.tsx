'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING_DATA, ToolName, UseCase } from '@/lib/pricing-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Search, ChevronDown, ArrowLeft, RefreshCcw, Zap } from 'lucide-react';
import BackButton from './ui/BackButton';

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
    <div className="min-h-screen bg-[#04040a] py-[60px] px-6 flex justify-center items-start relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[680px] w-full bg-[#12121f]/60 backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] animate-fade-up relative z-1 overflow-hidden">
        {/* Subtle premium top-border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="relative mb-10">
          <BackButton className="mb-8" />
          
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-[24px] shadow-inner">
              🔍
            </div>
            <div>
              <h1 className="font-display text-[28px] font-bold text-white tracking-tight">Audit Your AI Stack</h1>
              <p className="text-slate-400 text-[14px] mt-1 font-medium">Identify overspending and optimize your team's AI budget.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Team Size</label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                required
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl h-12 px-4 text-white text-[15px] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Primary Use Case</label>
              <Select value={useCase} onValueChange={(v) => v && setUseCase(v as UseCase)}>
                <SelectTrigger className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl h-12 px-4 text-white text-[15px]">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border border-white/[0.1] text-white shadow-2xl rounded-xl">
                  <SelectItem value="coding" className="hover:bg-indigo-500/10 cursor-pointer">Coding / Engineering</SelectItem>
                  <SelectItem value="writing" className="hover:bg-indigo-500/10 cursor-pointer">Writing / Content</SelectItem>
                  <SelectItem value="data" className="hover:bg-indigo-500/10 cursor-pointer">Data Analysis</SelectItem>
                  <SelectItem value="research" className="hover:bg-indigo-500/10 cursor-pointer">Research</SelectItem>
                  <SelectItem value="mixed" className="hover:bg-indigo-500/10 cursor-pointer">Mixed / General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your AI Tools</label>
              <button 
                type="button" 
                onClick={addTool}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-[13px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg border border-indigo-500/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Tool
              </button>
            </div>

            <div className="space-y-4">
              {tools.map((tool) => {
                const availablePlans = PRICING_DATA[tool.tool as ToolName] 
                  ? Object.keys(PRICING_DATA[tool.tool as ToolName]) 
                  : ['Custom'];

                return (
                  <div key={tool.id} className="group relative bg-white/[0.02] border border-white/[0.04] rounded-[18px] p-6 transition-all hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-lg">
                    {/* Delete button - Top-right alignment */}
                    <button 
                      type="button" 
                      onClick={() => removeTool(tool.id)}
                      className="absolute top-4 right-4 text-slate-600 hover:text-red-400/80 p-2 rounded-lg hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-4">
                      <div className="md:col-span-5 space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Tool Name</label>
                        <Select value={tool.tool} onValueChange={(v) => updateTool(tool.id, 'tool', v)}>
                          <SelectTrigger className="bg-[#0a0a0f] border-white/[0.06] hover:border-white/[0.12] h-11 text-[14px] text-white rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border border-white/[0.1] text-white shadow-2xl rounded-xl max-h-[300px]">
                            {Object.keys(PRICING_DATA).map(t => (
                              <SelectItem key={t} value={t} className="hover:bg-indigo-500/10 cursor-pointer">{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Plan Level</label>
                        <Select value={tool.plan} onValueChange={(v) => updateTool(tool.id, 'plan', v)}>
                          <SelectTrigger className="bg-[#0a0a0f] border-white/[0.06] hover:border-white/[0.12] h-11 text-[14px] text-white rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border border-white/[0.1] text-white shadow-2xl rounded-xl">
                            {availablePlans.map(p => (
                              <SelectItem key={p} value={p} className="hover:bg-indigo-500/10 cursor-pointer">{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Seats</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            min="1" 
                            value={tool.seats} 
                            onChange={(e) => updateTool(tool.id, 'seats', parseInt(e.target.value) || 1)} 
                            className="w-full bg-[#0a0a0f] border border-white/[0.06] hover:border-white/[0.12] focus:border-indigo-500/50 transition-all h-11 px-4 text-white text-[14px] rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl p-6 flex justify-between items-center shadow-inner">
              <div className="space-y-0.5">
                <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">Estimated Monthly Spend</span>
                <p className="text-[11px] text-slate-600">Calculated based on current public pricing</p>
              </div>
              <span className="font-display text-[28px] font-bold text-indigo-400">
                ${currentTotalCost.toLocaleString()}
              </span>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-[13px] font-medium p-4 rounded-xl">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-display font-bold py-4 px-6 rounded-xl shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)] hover:shadow-[0_16px_32px_-8px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Your AI Stack...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Run Savings Audit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
