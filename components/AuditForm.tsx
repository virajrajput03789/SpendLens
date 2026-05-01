'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING_DATA, ToolName, UseCase } from '@/lib/pricing-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

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
          if (toolData && field !== 'plan') {
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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Audit Your AI Stack</CardTitle>
        <CardDescription>Tell us what you use, and we'll tell you what to cut.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Total Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="useCase">Primary Use Case</Label>
              <Select value={useCase} onValueChange={(v: UseCase) => setUseCase(v)}>
                <SelectTrigger id="useCase">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding / Engineering</SelectItem>
                  <SelectItem value="writing">Writing / Content</SelectItem>
                  <SelectItem value="data">Data Analysis</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="mixed">Mixed / General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Tools</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTool}>
                <Plus className="w-4 h-4 mr-2" /> Add Tool
              </Button>
            </div>
            
            {tools.map((tool, index) => {
              const availablePlans = PRICING_DATA[tool.tool as ToolName] 
                ? Object.keys(PRICING_DATA[tool.tool as ToolName]) 
                : ['Custom'];

              return (
                <div key={tool.id} className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md bg-muted/20">
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <Label className="text-xs">Tool</Label>
                    <Select value={tool.tool} onValueChange={(v) => updateTool(tool.id, 'tool', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(PRICING_DATA).map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6 sm:col-span-3 space-y-1">
                    <Label className="text-xs">Plan</Label>
                    <Select value={tool.plan} onValueChange={(v) => updateTool(tool.id, 'plan', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePlans.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <Label className="text-xs">Seats</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={tool.seats} 
                      onChange={(e) => updateTool(tool.id, 'seats', parseInt(e.target.value) || 1)} 
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <Label className="text-xs">Cost/mo</Label>
                    <Input 
                      type="number" 
                      value={tool.currentMonthlyCost} 
                      onChange={(e) => updateTool(tool.id, 'currentMonthlyCost', parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTool(tool.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Running Total Spend:</span>
            <span className="text-xl font-bold">${currentTotalCost.toLocaleString()}/mo</span>
          </div>

          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Running Audit...' : 'Run Audit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
