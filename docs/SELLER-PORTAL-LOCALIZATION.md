# NEXORA seller portal localization

Last updated: 2026-11-17

## Implemented

The seller portal now has a language selector for:

- Indonesian (id)
- English (en)
- Korean (ko)
- Japanese (ja)

Implementation files:

- seller-portal.html — language selector, responsive header and localized status-message integration.
- seller-portal-i18n.js — local dictionaries and browser-language detection.

The selected language is stored in the browser under nexora-seller-language. If no saved preference exists, the portal checks the browser's primary language. Unsupported browser languages fall back to Indonesian. The user can always change the language manually.

The localization code has no paid translation API dependency.

## Scope and limitations

- The seller portal's current static interface and common validation/status messages have translations for the four listed locales.
- Provider-generated technical error details may remain in the provider's original language after a translated prefix.
- The marketplace demo has its own four-language dictionary; other prototype pages are not yet fully localized.
- Product names and seller-entered descriptions are user content and are not automatically translated.
- Currency values are not converted. Country, currency and address rules are not yet fully localized by market.
- Dates, number formats and time zones have not yet been fully adapted per locale.
- These translations are initial machine-authored drafts and have not been reviewed by native speakers. Do not claim production-grade translation quality until language QA is completed.

## Automated checks

The GitHub Actions static validation checks:

1. JavaScript syntax in the seller portal localization file.
2. Presence of the language selector and localization script in the seller portal.
3. Presence of all four locale dictionaries.
4. A minimum translation-entry count to catch accidental truncation.
5. Existing marketplace dictionary and seller portal inline-script checks.

These are static checks, not a browser rendering or linguistic-quality test.

## Manual QA still required

After the site is deployed, use a test account and check on desktop and a narrow mobile viewport:

1. Switch between Indonesian, English, Korean and Japanese.
2. Reload and confirm the selected language persists.
3. Open login, registration, store setup and dashboard states in each language.
4. Trigger validation errors and a failed network request to inspect message readability.
5. Confirm the language selector does not overlap the logo or navigation on a small phone.
6. Ask fluent reviewers to check Korean and Japanese terminology before public launch.