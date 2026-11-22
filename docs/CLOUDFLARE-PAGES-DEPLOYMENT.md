# NEXORA — Cloudflare Pages deployment runbook

Last updated: 2026-11-22

## Purpose

Deploy the existing static HTML frontend to a free Cloudflare Pages project without purchasing a domain, adding a payment method, or upgrading a plan. This creates a public demo URL only; it does not make NEXORA a production marketplace.

## Repository facts checked on 2026-11-22

- Repository: `nexora-digital-shop/nexora-shoppage`
- Production branch: `main`
- Static HTML files are in the repository root.
- `marketplace.html` is the multilingual marketplace demo.
- `seller-portal.html` is the early Supabase Auth/store-onboarding interface.
- `index.html` redirects the root URL to `marketplace.html`.
- The former ShopPage builder is preserved as `shoppage.html`.
- No `package.json` is present at the repository root; the current frontend is plain static HTML/CSS/JavaScript and needs no build command.
- The repository contains Supabase migrations 001–005. The owner previously reported 001–003 were applied; this has not been independently checked against the live Supabase project. Migrations 004 and 005 are committed but must be checked and applied in order if absent.
- No Cloudflare Pages project or live URL has been verified.

## Create the Pages project

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages**.
3. Choose **Create application** (or **Create**) and select the **Pages** path, not the Workers application wizard.
4. Choose **Connect to Git** / **Import an existing Git repository**.
5. Authorize GitHub if prompted and select `nexora-digital-shop/nexora-shoppage`.
6. Set the production branch to `main`.
7. Use these build settings for the current plain-HTML repository:
   - Project name: `nexora-shoppage` (if available).
   - Framework preset: **None**.
   - Build command: leave blank when the form permits no build command.
   - Build output directory: `.` (the repository root, where the HTML files are).
   - Root directory: leave at the repository root/default.
8. Review the settings. Do not select a paid Workers plan, add a payment method, buy a domain, or start a paid trial.
9. Start deployment only if the dashboard clearly shows a free Pages deployment path. If the UI forces a paid plan, card, or a different Workers configuration, stop and ask for help rather than accepting it.

If Cloudflare rejects `.` as the output directory or the screen differs from these instructions, do not guess another folder or switch to Workers. Capture the exact error/screen and pause for review.

## Verify the deployment

After Cloudflare reports a successful deployment:

1. Copy the exact generated `*.pages.dev` URL from the Pages project overview.
2. Open the root URL. It should redirect to the NEXORA marketplace demo.
3. Open `/marketplace.html` and confirm the four-language demo appears.
4. Open `/seller-portal.html` and confirm the seller portal interface loads. Do not enter real customer data or use it for real transactions.
5. Check the deployment on a phone browser as well as desktop.
6. Share only the public `pages.dev` URL in the project chat. Never share account passwords, OTPs, recovery codes, service-role keys, or payment credentials.

## Supabase configuration — only after the real URL exists

In Supabase, open **Authentication → URL Configuration**:

- Set **Site URL** to the exact deployed root URL (use the actual URL, not an example).
- Add the exact **Redirect URL** ending in `/seller-portal.html`.
- Save the settings.
- Test signup confirmation, login, session persistence, logout, and store creation with a dedicated test account only.

The seller portal sends confirmation links to `/seller-portal.html` on the current host. Do not enter a guessed hostname before Cloudflare issues the real URL. Do not place a Supabase service-role/secret key in frontend code. The browser may use only the project's publishable/anon key with correctly tested Row Level Security.

## Supabase migration order and safety

The repository contains these migrations:

1. `202611100001_initial_marketplace.sql`
2. `202611100002_auth_and_store_onboarding.sql`
3. `202611100003_store_write_hardening.sql`
4. `202611120004_store_onboarding_validation.sql`
5. `202611200005_secure_definer_search_path.sql`

Before applying anything, inspect the live Supabase project and establish which migrations and functions are already present. The owner previously reported migrations 001–003 were applied, but that report has not been independently verified in this deployment session. Do not rerun migrations 001–003 blindly.

If the live database is confirmed to be at migration 003, review and apply migration 004 first, then migration 005. If the live database is already at 004, review and apply only 005. If migration history or schema state is ambiguous, stop and inspect before executing SQL.

Migration 004 enforces the 500-character store-description limit and restricts the store-creation RPC to authenticated callers. Migration 005 replaces the profile-bootstrap trigger function and store-creation RPC with SECURITY DEFINER functions pinned to an empty `search_path`, with schema-qualified table references. These are committed source files; their presence in GitHub does not prove they have been applied or that live database behavior is correct.

After application, test the trigger, RPC grants, description lengths of 500 and 501 characters, new-store draft status, and seller-to-seller data isolation using dedicated test accounts. Never use real customer or payment data for these tests.

## Important limits

- Cloudflare Pages hosts the static frontend; Supabase remains the authentication/database service.
- A successful Pages deployment does not prove Supabase Auth, database permissions, seller isolation, product management, orders, or payments work.
- The seller portal is still an early test interface. Product CRUD, buyer checkout, payment collection and order management are not ready. Keep real customer orders and payments disabled.
- Free-tier quotas and terms can change. Confirm the dashboard still offers the selected Pages path without a paid commitment before deployment; monitor limits and stop if an upgrade/payment prompt appears.

## Current status

**Runbook prepared; deployment not performed.** A repository change cannot create the owner's Cloudflare account/project or accept its account-specific authorization. The owner must complete the dashboard connection and share the generated public URL for the next configuration step.
