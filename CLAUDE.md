# CLAUDE.md

Project-specific guidance for Claude Code when working in this repo.

## Architecture

QRing is a Next.js 15 App Router site built with `output: "export"` (see
[next.config.mjs](next.config.mjs)) — a fully static export with no server/backend, deployed to
GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on every push to
`main`. There is no API route or SSR at runtime.

## Secrets & environment variables

- Never place a secret anywhere that ends up in `src/`'s client-rendered output, `public/`, or the
  built `out/` directory — since the whole site ships to the browser, anything there is public.
- Never use a `NEXT_PUBLIC_`-prefixed env var for a secret — Next.js inlines those into the client
  bundle at build time.
- `.env` (gitignored via `.env*`) is for local/CI scripts only, e.g. `scripts/`. It currently holds:
  - `GCP_API_KEY` — plain Google Cloud API key. Works for PageSpeed Insights; confirmed *not*
    sufficient for the GA4 Admin/Data or Search Console APIs (they require OAuth2/service-account
    auth, not API keys).
  - `GOOGLE_APPLICATION_CREDENTIALS`, `GA4_PROPERTY_ID` — service-account key path + numeric GA4
    property ID, used by `scripts/ga4-report.mjs` and `scripts/gsc-report.mjs` to query GA4 and
    Search Console. See [.claude/skills/google-apis/SKILL.md](.claude/skills/google-apis/SKILL.md)
    for setup and usage.
- If a script needs a secret in GitHub Actions, add it under repo Settings → Secrets and variables
  → Actions — never commit it or hardcode it in a workflow file.

## Analytics

- Google Analytics (gtag.js, `G-M75FF9RHJ6`) is wired up in [src/app/layout.tsx](src/app/layout.tsx)
  via `next/script`.
- `src/app/sitemap.ts` generates `/sitemap.xml` at build time for Search Console; it requires
  `export const dynamic = "force-static"` because of the static export config.
