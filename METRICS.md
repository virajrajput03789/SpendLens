# Metrics & Measurement

## North Star Metric: **Qualified Leads Generated per Week**
A "Qualified Lead" is defined as an audit completion where the user:
1. **Captured their email** (showing intent to save the report).
2. **Has a monthly AI spend > $200** (showing they are at a scale where Credex credits provide meaningful value).
3. **Has identifiable "High Savings" (> $100/mo)** (making the pitch for Credex a "no-brainer").

**Why this metric?**
Traditional metrics like Daily Active Users (DAU) or Session Length are misleading for a tool like SpendLens. A user should only need to audit their stack once a quarter. Therefore, we focus on the **Efficiency of the Lead Generation Funnel**. This metric directly maps to Credex's revenue potential and the ROI of the development effort.

## 3 Input Metrics (The Drivers)
1. **Audit Completion Efficiency (Form UX):**
   - Measured as: *# of Audits Completed / # of Audits Started*.
   - This tells us if the form is too long or if the tool selection is confusing. If this drops below 60%, we need to simplify the input fields or implement an "Auto-suggest" for tool pricing.
2. **Viral Coefficient (Social Proof):**
   - Measured as: *# of Unique Share Link Clicks / # of Audits Completed*.
   - The "Viral Loop" is critical for $0 budget growth. This metric measures if the "Aha!" moment of identified savings is strong enough to make a CTO want to share the result with their board or team.
3. **High-Value Lead Density:**
   - Measured as: *% of Audits identifying > $500/mo in savings*.
   - This measures "Lead Quality." If we are driving thousands of audits but they all show "Optimal Spend," our GTM strategy is targeting the wrong users. We need to find the "Overspenders" (Series A/B teams).

## What to instrument first
- **Custom Events (PostHog/Segment):**
  - `audit_form_started`: Tracked on the first tool added.
  - `audit_engine_run`: Tracked on form submission (success/fail).
  - `lead_captured`: Tracked on email submission.
  - `consultation_booked_intent`: Tracked when the "Book Free Consultation" button is clicked.
  - `share_link_copied`: Tracked when the user copies the public URL.

## Pivot Trigger: The "Trust vs. Growth" Threshold
If after **500 unique audits**, our **Email Capture Rate remains below 10%**, we face a value-proposition crisis. 

**Pivot Plan:**
- **The "Teaser" Pivot:** Instead of hiding the audit behind a completion button, we show a "Running Savings Estimate" that updates in real-time as they add tools. This builds trust before the final result.
- **The "Auto-Audit" Pivot:** If manual entry is the bottleneck, we pivot to a "Bill Upload" or "Plaid Integration" where we audit their actual bank statement/Stripe data.
- **Consultation Quality:** If consultation booking is < 2% of "High Savings" cases, we pivot the summary generation (PROMPTS.md) to be more aggressive/urgent about the "Loss of Capital" occurring every month.
