'use client';

import React, { useState } from 'react';
import { AuditOutput, ToolAuditResult } from '@/lib/audit-engine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Copy, CheckCircle } from 'lucide-react';
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      <Card className="border-t-4 border-t-green-500 shadow-md">
        <CardHeader className="text-center pb-2">
          {auditData.isOptimal ? (
            <CardTitle className="text-3xl text-gray-900">You're spending well.</CardTitle>
          ) : (
            <CardTitle className="text-4xl text-gray-900">
              You could save <span className="text-green-600 font-extrabold">${auditData.totalMonthlySavings}/mo</span>
            </CardTitle>
          )}
          <CardDescription className="text-lg mt-2">
            {auditData.isOptimal ? 'No major savings found.' : `That's $${auditData.totalAnnualSavings}/year in potential savings.`}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-muted/10 border-none shadow-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">AI Executive Summary</h3>
          <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold px-2">Per-Tool Breakdown</h3>
        {auditData.results.map((result: ToolAuditResult, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center bg-gray-50 border-b">
                <div className="p-4 col-span-2 flex items-center space-x-4">
                  <div className="font-semibold text-lg">{result.tool}</div>
                  <div className="flex items-center text-gray-500 space-x-2 text-sm">
                    <span>{result.currentPlan}</span>
                    <span>(${result.currentMonthlyCost})</span>
                  </div>
                </div>
                {result.monthlySavings > 0 ? (
                  <div className="p-4 col-span-2 bg-green-50 flex items-center space-x-3 h-full border-l border-green-100">
                    <ArrowRight className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">
                        {result.recommendation === 'downgrade' ? 'Downgrade to ' : 'Switch to '}
                        {result.recommendedPlan || 'Alternative'}
                      </div>
                      <div className="text-green-600 font-medium text-sm">Save ${result.monthlySavings}/mo</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 col-span-2 bg-gray-100 flex items-center space-x-3 h-full border-l">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div className="text-gray-600 font-medium">Optimal spend</div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white flex justify-between items-center text-sm">
                <span className="text-gray-700">{result.recommendedAction}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.confidence === 'high' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {result.confidence === 'high' ? 'High Confidence' : 'Medium Confidence'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isPublic && (
        <LeadCapture auditId={auditData.auditId} isHighSavings={auditData.highSavingsCase} isOptimal={auditData.isOptimal} />
      )}

      <div className="flex justify-center pt-6">
        <Button variant="outline" onClick={handleCopy} className="rounded-full px-6 py-6 shadow-sm border-gray-300">
          {copied ? <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> : <Copy className="w-5 h-5 mr-2" />}
          {copied ? 'Copied Link' : 'Copy Public Share Link'}
        </Button>
      </div>
    </div>
  );
}
