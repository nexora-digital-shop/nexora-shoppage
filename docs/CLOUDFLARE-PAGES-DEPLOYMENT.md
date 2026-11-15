# NEXORA — Cloudflare Pages deployment runbook

Last updated: 2026-11-15

## Purpose

Deploy the existing static HTML frontend to a free Cloudflare Pages project without purchasing a domain, adding a payment method, or upgrading a plan. This creates a public demo URL only; it does not make NEXORA a production marketplace.

## Repository facts checked on 2026-11-15

- Repository: `nexora-digital-shop/nexora-shoppage`
- Production branch: `main`
- Static HTML files are in the repository root.
- `marketplace.html` is the multilingual marketplace demo.
- `seller-portal.html` is the early Supabase Auth/store-onboarding interface.
- `index.html` now redirects the root URL to `marketplace.html`, so the Pages root route opens the marketplace demo.
- The former ShopPage builder was preserved as `shoppage.html`.
- No `package.json` was found at the repository root, and no frontend build command is required by the current static files.
- No Cloudflare Pages project or live URL has been verified yet.

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

- Set **Site URL** to the exact deployed root URL, for example `https://nexora-shoppage.pages.dev` (use the actual URL, not this example).
- Add the exact **Redirect URL** ending in `/seller-portal.html`.
- Save the settings.
- Test signup confirmation, login, session persistence, logout, and store creation with a dedicated test account only.

Do not set a guessed URL before Cloudflare has issued the real hostname. Do not place a Supabase service-role/secret key in frontend code. The browser may use only the project's publishable/anon key with correctly tested Row Level Security.

## Important limits

- Cloudflare Pages hosts the static frontend; Supabase remains the authentication/database service.
- A successful Pages deployment does not prove Supabase Auth, database permissions, seller isolation, product management, orders, or payments work.
- Migration 004 is committed but still must be applied and tested in Supabase after confirming migrations 001–003 are present. Do not rerun older migrations blindly.
- The seller portal is still an early test interface. Keep real customer orders and payments disabled.
- Free-tier quotas and terms can change. Confirm the dashboard still offers the selected Pages path without a paid commitment before deployment; monitor limits and stop if an upgrade/payment prompt appears.

## Current status

**Runbook prepared; deployment not performed.** A repository change cannot create the owner's Cloudflare account/project or accept its account-specific authorization. The owner must complete the dashboard connection and share the generated public URL for the next configuration step.
