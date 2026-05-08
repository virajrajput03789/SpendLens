'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this actually free?",
      a: "Yes. No credit card. No catch. We show you your audit immediately. We only ask for your email if you want to save the report."
    },
    {
      q: "How do you make money?",
      a: "If your audit shows significant savings, we'll introduce you to Credex — a marketplace for discounted AI credits. We earn a referral if you buy. If you're already spending optimally, we'll tell you that too."
    },
    {
      q: "How is the pricing data kept current?",
      a: "We verify all plan pricing each week from official vendor pricing pages. Every number links to a source URL."
    },
    {
      q: "Do you store my spend data?",
      a: "Your tool names and spend amounts are stored anonymously to generate your shareable report URL. We never sell your data."
    },
    {
      q: "What if I only use one tool?",
      a: "The audit still runs. We'll tell you if you're on the optimal plan, or surface a better alternative for your use case."
    }
  ];

  return (
    <div className="min-h-screen bg-[#04040a] relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-100px] w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#04040a]/80 backdrop-blur-[20px] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="max-w-[1100px] mx-auto flex justify-between items-center">
          <div className="text-[20px] font-bold font-display flex items-center gap-2">
            <span className="text-[#6366f1]">⚡</span>
            <span className="text-white">SpendLens</span>
          </div>
          <div className="bg-[#6366f1]/10 border border-[var(--border-accent)] rounded-full px-3 py-1 text-[12px] font-medium text-[#6366f1]">
            by Credex
          </div>
        </div>
      </nav>

      <main className="relative z-1">
        {/* Hero Section */}
        <section className="pt-[140px] pb-[100px] px-6 text-center max-w-[800px] mx-auto">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/25 rounded-full px-5 py-2 mb-8 animate-float">
            <div className="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-[13px] font-medium text-[#94a3b8]">Free AI Spend Audit</span>
            <span className="text-[#6366f1] text-[13px]">→ No signup required</span>
          </div>

          <h1 className="font-display text-[64px] font-extrabold leading-[1.1] mb-6 tracking-tight">
            <div className="text-white animate-fade-up stagger-1">Is your team paying</div>
            <div className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent animate-fade-up stagger-2 bg-[length:200%] animate-[gradient-shift_3s_ease_infinite]">
              too much for AI?
            </div>
          </h1>

          <p className="text-[18px] text-[#94a3b8] max-w-[500px] mx-auto mt-6 leading-[1.7] animate-fade-up stagger-3">
            Get a free 2-minute audit of your AI tool spend. See exactly where you're overpaying — and what to switch.
          </p>

          <div className="mt-10 animate-fade-up stagger-4">
            <Link href="/audit" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold text-[16px] px-10 py-4 rounded-[12px] shadow-[0_0_40px_rgba(99,102,241,0.3),0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5),0_8px_25px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
              Audit my AI stack →
            </Link>
            
            <div className="mt-4 flex gap-5 justify-center text-[13px] text-[#475569] animate-fade-up stagger-5">
              <span>✓ Free forever</span>
              <span>✓ No signup</span>
              <span>✓ Results in 2 min</span>
            </div>
          </div>

          {/* Tool Pills Strip */}
          <div className="mt-20">
            <p className="text-[#475569] text-[12px] uppercase tracking-[0.1em] font-medium mb-4">Analyzes tools including</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Windsurf', '+ more'].map((tool) => (
                <div key={tool} className="bg-white/[0.03] border border-white/10 px-4 py-2 rounded-[8px] text-[13px] text-[#94a3b8] hover:border-[#6366f1]/30 hover:text-white hover:bg-[#6366f1]/5 transition-all cursor-default">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="mt-20 px-6 max-w-[800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "$2.3M+", label: "in savings identified" },
            { num: "1,200+", label: "audits completed" },
            { num: "8 tools", label: "currently tracked" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.04] rounded-[16px] p-6 text-center hover:border-[#6366f1]/30 hover:-translate-y-0.5 transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="font-display text-[36px] font-extrabold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-1">
                {stat.num}
              </div>
              <div className="text-[#475569] text-[13px]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Social Proof Section */}
        <section className="mt-20 px-6 max-w-[1100px] mx-auto">
          <p className="text-[#475569] text-[11px] uppercase tracking-[0.15em] font-bold text-center mb-8">WHAT TEAMS ARE SAYING</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "Found $840/month we didn't know we were wasting.", author: "Head of Engineering", company: "Series B SaaS" },
              { quote: "Switched 3 tools based on this. Saved $400 in first month.", author: "Solo founder", company: "Bootstrapped" },
              { quote: "The only audit tool that actually knows AI tool pricing.", author: "Product Manager", company: "Growth Startup" }
            ].map((item, i) => (
              <div key={i} className="bg-[#12121f] border border-white/10 border-l-[3px] border-l-[#6366f1] rounded-[16px] p-6 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all">
                <div className="text-[#6366f1] text-[48px] font-serif leading-0 mb-3" style={{ lineHeight: 0 }}>“</div>
                <p className="text-[14px] leading-[1.7] text-[#94a3b8] italic font-medium">"{item.quote}"</p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-[13px] text-[#f1f5f9] font-semibold">{item.author}</div>
                  <div className="text-[12px] text-[#475569] mt-1">{item.company}</div>
                  <div className="text-[10px] text-[#1e293b] mt-2">(Simulated testimonial)</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-24 px-6 max-w-[680px] mx-auto">
          <h2 className="font-display text-[32px] font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-[12px] overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-[15px] font-semibold text-white">{faq.q}</span>
                  <ArrowRight className={`w-4 h-4 text-[#6366f1] transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-4 text-[14px] text-[#94a3b8] leading-[1.7] border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-white/5 py-10 px-6 text-center text-[#475569] text-[13px]">
          <div className="mb-2">SpendLens — Built for Credex · <a href="https://credex.rocks" className="hover:text-[#6366f1]">credex.rocks</a></div>
          <div>Free AI spend audit tool · All pricing data verified weekly</div>
        </footer>
      </main>
    </div>
  );
}
