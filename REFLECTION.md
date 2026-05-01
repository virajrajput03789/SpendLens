# Reflection

## 1. Hardest bug
The hardest bug I encountered was dealing with hydration mismatches when implementing `localStorage` persistence in Next.js 14. Initially, I loaded the form state directly during the initial component render. This caused React to complain because the server-rendered HTML (which had empty state) didn't match the client-rendered HTML (which had the `localStorage` data). I fixed this by using an `isLoaded` state flag. The component only renders `null` or a skeleton until `useEffect` completes the initial hydration, ensuring that the initial render exactly matches the server.

## 2. A decision you reversed
I originally planned to make the `POST /api/audit` route fail strictly if Supabase was unavailable or if the database insertion failed. Midway through, I reversed this decision. I realized that the primary user experience (getting the audit result) shouldn't be entirely gated behind our internal analytics tracking successfully recording the lead data. If Supabase fails, I now log the error and allow the user to continue to the results page using mock IDs or a local fallback, preserving the viral loop. If I hadn't reversed this, any DB downtime would completely break the lead gen flow.

## 3. What you'd build in week 2
If I had a second week, I would focus entirely on **Enterprise Stack Analysis**. Currently, the tool assumes teams can easily switch out single seats. In reality, large teams need to account for multi-year contracts, SAML SSO requirements, and unified billing limits. I'd add a secondary flow that asks "Do you require SSO?" or "Are you in an enterprise contract?" and adjust the confidence scores and savings accordingly. This specifically targets the most lucrative segment for Credex credits: high-spend enterprises.

## 4. How you used AI tools
I used AI heavily to generate boilerplate structure for Shadcn UI component integration and to mock the Vercel OG image layout since tweaking React-style CSS via trial-and-error can be tedious. I specifically did NOT trust AI with the core `audit-engine.ts` logic. I wrote that entirely manually. At one point, an AI tool incorrectly suggested mapping Copilot Enterprise to Cursor Business directly without considering the 1-to-1 seat ratio requirements, which I caught and corrected through my pure TS rules.

## 5. Self-ratings
- Discipline: 9/10 — Followed the commit guidelines strictly and scoped features precisely.
- Code quality: 8/10 — Strong typing and pure functions, but some Next.js edge cases required quick fixes.
- Design sense: 8/10 — Used Tailwind effectively to create a clean, Stripe-like dashboard layout for the results.
- Problem-solving: 9/10 — Addressed the fallback and persistence requirements creatively despite mocked constraints.
- Entrepreneurial thinking: 9/10 — Constantly tied technical implementation back to the GTM metrics and Credex conversion funnel.
