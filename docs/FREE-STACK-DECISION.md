# NEXORA — Zero-Upfront-Cost Technology Decision

Last updated: 2026-11-10

## Decision

Stop using Replit for this project because creating the app was blocked by an active-subscription requirement. Do not pay to bypass that gate.

Preferred no-upfront-cost candidate architecture:

| Layer | Candidate | Why it fits | Important limits |
|---|---|---|---|
| Source control | Existing GitHub repository | Already connected and holds the prototypes/specifications | GitHub is not the production database or commerce backend |
| Web hosting | Cloudflare Pages Free | Can serve a static, responsive web frontend from GitHub | Free-tier quotas and commercial terms must be checked at setup; it does not provide the whole marketplace backend |
| Authentication + database | Supabase Free | Managed authentication and PostgreSQL; relational data and row-level security suit stores, products and orders | Free-tier quotas, project pausing/availability, backups and storage limits must be checked; not a production SLA |
| Image storage | Supabase Storage Free initially | Keeps product images separate from relational records | Storage and bandwidth quotas apply; enforce file type/size limits and public/private access rules |
| Payments | No integration until PSP eligibility is verified | Avoids collecting funds incorrectly or exposing the project to unapproved fees | Payment providers may charge transaction fees and require business/KYC approval |

This is a candidate stack, not an assertion that accounts, services, deployments, or integrations are already active.

## Cost rules

- Target setup spend: Rp0.
- Do not enter payment details, start a trial, upgrade, buy a domain, or activate any paid service without the owner's explicit approval.
- Use free subdomains initially; a custom domain is not required for the first technical prototype.
- Free plans have quotas and can change. Monitor usage and stop before a paid overage or upgrade is triggered.
- PSP transaction fees, legal/compliance costs, and future scale costs cannot be assumed to be zero.

## Implementation plan

1. Build a mobile-first web frontend in the existing GitHub repository; preserve a web experience that works without installing an app.
2. Deploy the frontend to Cloudflare Pages from GitHub only after a free account/deployment path is confirmed.
3. Create a Supabase project on the Free plan only if the user can do so without payment details or a paid commitment; obtain project URL and public anon key from the user through the dashboard. Never ask for or expose the service-role key in frontend code.
4. Add SQL migrations for profiles, seller stores, products, orders and order items. Enable row-level security and write policies before using real data.
5. Implement authentication and seller/buyer flows against the backend.
6. Enforce the Free plan quota on the server/database, not localStorage.
7. Add file uploads with strict validation and storage policies.
8. Keep checkout in test/demo mode until a PSP confirms Indonesia marketplace support, seller onboarding/KYC, settlement, fees and legal eligibility.
9. Test on physical iPhone Safari, Android Chrome and desktop browsers. iPhone/iOS support is a mandatory launch gate.
10. Launch only after security, privacy, backup/restore, payment and operational release gates pass.

## Required user action

A one-time user action may be needed to create/authorize free Cloudflare and Supabase accounts and provide non-secret project configuration (Supabase project URL and public anon key). The user must never share passwords, OTPs, recovery codes, service-role keys, or payment credentials in chat.

## Status

- Replit creation attempt: blocked by `requires_active_subscription`; no app was created.
- GitHub source repository: available.
- Cloudflare Pages project: not created or deployed.
- Supabase project: not created or connected.
- Live NEXORA URL: not available yet.
- iPhone Safari testing: not performed yet.

## Launch warning

A free hosting URL or working prototype is not automatically a secure production marketplace. Never accept real orders or payments until backend authorization, data protection, order integrity, PSP compliance and all launch tests are complete.
