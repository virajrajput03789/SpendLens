'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LeadCapture({ auditId, isHighSavings, isOptimal }: { auditId: string, isHighSavings: boolean, isOptimal: boolean }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
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
        body: JSON.stringify({ email, company, auditId }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center text-blue-900">
          <h3 className="text-xl font-bold mb-2">Report sent!</h3>
          <p>Check your inbox for the full breakdown.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-indigo-100 shadow-sm mt-12">
      <CardHeader className="bg-indigo-50/50 pb-4">
        {isHighSavings ? (
          <>
            <CardTitle className="text-xl text-indigo-900">Capture more savings with Credex credits</CardTitle>
            <CardDescription>Book a free consultation and get this report in your inbox.</CardDescription>
          </>
        ) : isOptimal ? (
          <>
            <CardTitle className="text-xl">Notify me when new savings apply</CardTitle>
            <CardDescription>Get an email when lower pricing is available for your stack.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-xl">Get this report in your inbox</CardTitle>
            <CardDescription>Save these insights to share with your team.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          {/* Honeypot field */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@startup.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input id="company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send me the report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
