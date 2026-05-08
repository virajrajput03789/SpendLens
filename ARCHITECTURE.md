# Architecture

## System Diagram

```mermaid
graph TD
    A[User fills form] --> B[/api/audit POST]
    B --> C[audit-engine.ts — pure TS rules]
    C --> D[Supabase — store audit]
    D --> E[/api/summary POST]
    E --> F[Google Gemini API]
    F --> G[Return audit ID]
    G --> H[/audit/id — results page]
    H --> I[/api/leads POST — email capture]
    I --> J[Supabase — leads table]
    I --> K[Resend — confirmation email]
```

## Data Flow
1. Form state lives in localStorage → submitted to /api/audit
2. Audit engine runs synchronously (no DB read needed — all rules in memory)
3. Full input + output stored in Supabase with UUID
4. Summary generated async via /api/summary (separate call, shows skeleton)
5. Public URL /audit/[id] fetches from Supabase, strips PII

## Stack Choices
- **Next.js 14**: SSR + API routes + @vercel/og in one framework
- **Supabase**: Managed Postgres, free tier, RLS support
- **Tailwind + shadcn/ui**: Rapid UI, accessible defaults, no design templates
- **Resend**: Transactional email (Sandbox mode for this submission)
- **TypeScript**: Mandatory for a finance-adjacent tool — no implicit any

## Scaling to 10k audits/day
- Move audit engine to an Edge Function (Cloudflare Workers) — stateless, fast
- Add Redis caching for pricing data (currently re-imported per request)
- Queue email sends with a job runner (BullMQ / Trigger.dev)
- Add Postgres read replica for analytics queries
- Rate limiting via Upstash Redis instead of in-memory
