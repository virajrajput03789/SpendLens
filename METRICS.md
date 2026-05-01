# Metrics

## North Star Metric
**Qualified leads generated per week** — a "qualified lead" = audit completed
with email captured AND monthly spend > $200. This directly maps to Credex
revenue potential. DAU is wrong here — people audit once a quarter, not daily.

## 3 Input Metrics
1. **Audit completion rate** (started → finished form) — drives lead volume
2. **Email capture rate** (finished audit → gave email) — drives lead quality
3. **High-savings audit rate** (% of audits with >$500 savings identified) —
   drives consultation bookings

## What to instrument first
1. Audit started event (with use_case, team_size)
2. Audit completed event (with total_savings bucket: <100, 100-500, >500)
3. Email captured event
4. Share link clicked
5. Credex CTA clicked

## Pivot trigger
If after 500 audits, email capture rate < 10%: the audit isn't showing enough
value. Pivot: show a teaser of savings before form completion, or reduce
form length. If consultation booking rate < 5% from email captures: improve
the follow-up email sequence before investing in more top-of-funnel.
