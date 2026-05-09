# SpendLens — AI Spend Audit for Startups

SpendLens is a free tool that audits your team's AI tool subscriptions — Cursor, Claude, ChatGPT, Copilot, and more — and identifies where you're overspending, what to switch, and how much you'd save.

Built as a lead-generation asset for [Credex](https://credex.rocks), a marketplace for discounted AI infrastructure credits.

## Screenshots
![Audit Form](https://placehold.co/600x400/0a0a0f/white?text=Audit+Form+Input)
![Results Dashboard](https://placehold.co/600x400/0a0a0f/white?text=Per-tool+Results+Breakdown)
![Lead Capture](https://placehold.co/600x400/0a0a0f/white?text=Lead+Capture+Email+Gate)

## Quick Start
```bash
npm install
cp .env.example .env.local   # fill in Supabase + Resend + NVIDIA API keys
npm run dev
```

## Deployed URL
[https://spendlens-audit.vercel.app](https://spendlens-audit.vercel.app)

## Decisions
1. **Next.js over Vite + React**: Needed SSR for OG image generation and API routes in one codebase. App Router gives us RSC for the results page.
2. **Hardcoded audit rules over AI**: Audit math must be auditable and deterministic. AI is reserved for the human-readable summary only.
3. **Supabase over Firebase**: Postgres gives us proper relational queries for analytics. Row-level security lets us expose audit data safely.
4. **Resend (Sandbox Mode)**: Chosen for its excellent DX and specific recommendation in the assignment. Note: As I am using a sandbox API key without a verified domain, emails are currently sent only to the verified admin email. In a production environment, a verified domain would enable broad delivery.
5. **Honeypot over hCaptcha**: Lower friction for legitimate users; sufficient for this traffic level. Documented trade-off: less robust against targeted abuse.
