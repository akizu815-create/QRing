---
name: google-apis
description: How to authenticate and call Google APIs (GA4 Admin/Data, Search Console, PageSpeed Insights) for this project. Use whenever the user wants to query GA4 reports, Search Console search performance, or PageSpeed/Lighthouse scores — or otherwise "operate GA4/GSC/PageSpeed via Google API", even if phrased as "GA4のデータを取ってきて", "サーチコンソールを確認して", "ページスピードを調べて". Covers where each credential lives, which auth method each API needs, and how to avoid leaking a key into the static site.
---

# Google API access (GA4, Search Console, PageSpeed Insights)

QRing is a fully static export site (`output: "export"` in [next.config.mjs](../../../next.config.mjs),
deployed to GitHub Pages via [deploy.yml](../../../.github/workflows/deploy.yml)) with no backend.
Any Google API credential must never end up in `src/` client code, `public/`, or the built `out/`
bundle — it would ship straight to every visitor's browser. All API access happens through one-off
scripts under `scripts/`, run locally or in CI.

## Which auth method each API needs

| API | Auth | Why |
|---|---|---|
| GA4 Admin / Data API | Service account (`GOOGLE_APPLICATION_CREDENTIALS`) | Reads private, per-account data — needs a credential that identifies *who* is asking. |
| Search Console API | Same service account | Same reasoning; the account must also be added as a **user** on the property in Search Console. |
| PageSpeed Insights API | Plain API key (`GCP_API_KEY`) | Analyzes a public URL, not private account data — no per-site permission needed. |

Confirmed by direct testing: `GCP_API_KEY` alone gets a `401 UNAUTHENTICATED` /
`CREDENTIALS_MISSING` ("API keys are not supported by this API. Expected OAuth2 access token...")
from both `analyticsadmin.googleapis.com` and `analyticsdata.googleapis.com`. Don't re-attempt
plain-API-key auth against GA4 or Search Console — it will always fail. PageSpeed Insights, by
contrast, works with `GCP_API_KEY` with no extra setup.

## Credentials in `.env`

All of these live in the project-root `.env`, which is gitignored (`.env*` in
[.gitignore](../../../.gitignore)) and must never be committed, printed to logged output, or
hardcoded in a source file "temporarily."

- `GCP_API_KEY` — plain Google Cloud API key. Used by PageSpeed Insights only.
- `GOOGLE_APPLICATION_CREDENTIALS` — absolute path to a service-account JSON key file (kept
  *outside* the repo, e.g. `C:/Users/aiko_/secrets/qring-ga4-sa.json`). The
  `@google-analytics/data` and `google-auth-library` packages pick this up automatically — no
  need to load or pass the key manually in script code.
- `GA4_PROPERTY_ID` — the numeric GA4 property ID (e.g. `545047859`), *not* the `G-XXXXXXX`
  measurement ID used in [layout.tsx](../../../src/app/layout.tsx). Find it in GA4 Admin →
  Property Settings.

The service account in use is `qring-web@project-3d935907-2acc-4b4e-9b2.iam.gserviceaccount.com`.
It currently has:
- **GA4**: Viewer on the property behind `GA4_PROPERTY_ID`.
- **Search Console**: Full user on `sc-domain:qring.jp`.

## Setting up a service account from scratch (manual, one-time)

Claude cannot do this part — it requires the user's authenticated Google Cloud / GA4 / Search
Console session, and granting access is an access-control change Claude does not make on the
user's behalf. Steps for the human:

1. Google Cloud Console → IAM & Admin → Service Accounts → Create service account (any name, no
   project-level roles needed).
2. Open it → Keys → Add key → Create new key → JSON. Save the downloaded file **outside this
   repo** (e.g. move it out of `Downloads` into `~/secrets/`).
3. GA4 → Admin → Property Access Management → add the service account's email as **Viewer**.
4. Search Console → Settings → Users and permissions → add the same email (Restricted/Full user
   is fine for read-only reporting).
5. Set `GOOGLE_APPLICATION_CREDENTIALS` (path from step 2) and `GA4_PROPERTY_ID` (from GA4 Admin →
   Property Settings) in `.env`.

## Existing scripts

- [scripts/ga4-report.mjs](../../../scripts/ga4-report.mjs) — active users for the last 7 days.
- [scripts/gsc-report.mjs](../../../scripts/gsc-report.mjs) — top 10 search queries for the last
  28 days. Note: Search Console's API requires literal `YYYY-MM-DD` dates — relative strings like
  GA4's `"28daysAgo"` are rejected with a 400, so the script computes real dates.
- [scripts/pagespeed-check.mjs](../../../scripts/pagespeed-check.mjs) — Lighthouse performance
  score for a URL (`node scripts/pagespeed-check.mjs [url]`, defaults to `https://www.qring.jp/`).

Follow these as the pattern for new scripts: `dotenv/config` first, name the file for what it
does, never a `NEXT_PUBLIC_`-prefixed env var for any of these credentials.

## Running from CI

If a script needs to run in GitHub Actions, add the service-account JSON (as a single-line
secret), `GA4_PROPERTY_ID`, and/or `GCP_API_KEY` under repo **Settings → Secrets and variables →
Actions** rather than committing them. Write the JSON to a temp file at the start of the job and
point `GOOGLE_APPLICATION_CREDENTIALS` at it — see [deploy.yml](../../../.github/workflows/deploy.yml)
for the existing workflow structure to follow.
