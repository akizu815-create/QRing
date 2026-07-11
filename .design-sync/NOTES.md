# QRing site — design-sync notes

## Repo shape

This repo is the `qring-site` Next.js marketing site, **not** a publishable
component-library package. There is no `dist/`, no `package.json`
`main`/`module`/`exports`, and no Storybook. `/design-sync` is running in
**synth-entry package mode** by explicit user choice (2026-07-11): the sync
scans `src/components/` directly and treats its 6 exported components
(Header, Footer, HeroVisual, PageHeader, Reveal, SectionTitle) as "the
design system." `.d.ts` contracts are therefore weaker than a real build
would produce (props inferred from ts-morph over the `.tsx` source, not a
compiled declaration file).

## `cssEntry` is hand-assembled — re-sync must redo this

Tailwind's CSS is generated at `next build` time (no static stylesheet
lives in the repo). There's no single "compiled stylesheet" file the
converter can point at automatically, so `cfg.cssEntry` points at
`.design-sync/compiled.css`, which is **manually built, not committed
source** — regenerate it before every re-sync:

```sh
npm run build   # populates out/_next/static/css/*.css and out/_next/static/media/*.woff2
```

Then concatenate all CSS chunks referenced from `<head>` (check
`out/index.html` for the exact `href="…css"` list and order — Next.js
content-hashes filenames per build, so they change every time) into
`.design-sync/compiled.css`, and rewrite any `url(/_next/static/media/…)`
references to `url(./media/…)` (they're emitted as root-absolute paths,
which the converter's font-extraction can't resolve). Copy the referenced
`.woff2` files from `out/_next/static/media/` into `.design-sync/media/`.
One-shot version of what was done for the 2026-07-11 sync:

```sh
npm run build
cat out/_next/static/css/*.css > .design-sync/compiled.css   # verify order against out/index.html head first
mkdir -p .design-sync/media && cp out/_next/static/media/*.woff2 .design-sync/media/
sed -i 's#url(/_next/static/media/#url(./media/#g' .design-sync/compiled.css
```

`.design-sync/compiled.css` and `.design-sync/media/` are gitignored
build artifacts (regenerated every sync), not part of the durable set.

## Fonts

All 3 brand families (Cormorant Garamond, Noto Serif JP, Noto Sans JP) are
self-hosted via `next/font` and subset into ~250 small `.woff2` files
(mostly the two Japanese families' huge unicode-range coverage). All are
referenced from the compiled CSS and copied to `fonts/` — no
`cfg.extraFonts` needed, no `[FONT_MISSING]` expected.

## Entry file + process polyfill (required for the bundle to work at all)

There's no barrel export in `src/components/`, and all 6 components use
`export default function X()` (no named export) — the automatic
synth-entry fallback (`export * from '<file>'`) does NOT re-export
defaults, so it silently produces an empty `window.QRing`. Fixed with a
hand-written entry at `.design-sync/entry.mjs` (committed, part of the
durable set) that does `export { default as Header } from
'../src/components/Header';` etc. `cfg.entry` points at it, so re-syncs
pick it up automatically — **only edit it if a component is
added/removed/renamed in `src/components/`.**

That entry also imports `.design-sync/polyfill.mjs` first (also
committed). Next.js internals (`next/link` in Header/Footer) reference
bare `process.env.*` at module-eval time; esbuild's `platform: 'browser'`
bundle has no `process` global, so without the polyfill the ENTIRE bundle
throws `ReferenceError: process is not defined` during evaluation —
which manifested as **every** component (not just Header/Footer) missing
from `window.QRing`, since the whole IIFE's top-level code never finished
running. If a future re-sync somehow drops `polyfill.mjs`'s import from
`entry.mjs`, expect that exact symptom: `[BUNDLE_EXPORT] N/N not a
component on window.QRing` for ALL components at once.

## Components with runtime caveats

- **Header**: `position: fixed` — collapses to zero height in the default
  (unwrapped) render, which made the automatic floor-card attempt render
  empty. Fixed with `cfg.overrides.Header: {"cardMode": "single",
  "viewport": "1200x110"}` so the capture uses an explicit viewport
  instead of measuring natural flow height. The authored preview
  (`.design-sync/previews/Header.tsx`) then renders correctly.
- **Header / Footer / HeroVisual**: reference `/images/logo-black.svg` /
  `/images/logo-white.svg` / `/images/hero.png` via absolute
  site-relative paths. These are NOT shipped in the DS bundle (no
  mechanism like `cfg.extraFonts` exists for arbitrary images) — the
  preview cards show a broken-image glyph where the logo/hero photo would
  be. This is real, honest component behavior, not a preview defect;
  documented for the design agent in `.design-sync/conventions.md`.
- **HeroVisual**: `position: absolute; inset: 0` — only meaningful inside
  a sized `position: relative` parent (the authored preview wraps it in
  one; the real site wraps it in a `min-h-[100svh]` hero section).
- **Reveal**: IntersectionObserver + 1200ms CSS fade-in. Static
  screenshots catch it mid-transition (children render at reduced
  opacity, not full-strength ink color) even though it mechanically
  passes the render check (non-empty, no errors). **Known render warn —
  do not re-chase this on future syncs**: it's inherent to a
  scroll-triggered component being captured by a one-shot headless
  screenshot, not a composition bug.

## Re-sync risks

- `.design-sync/compiled.css` / `.design-sync/media/` are NOT derived by
  any `cfg.buildCmd` the converter runs automatically — a re-sync that
  only re-runs the staged converter without redoing the steps above will
  bundle a **stale** stylesheet/fonts. Redo the block above first, always.
- Tailwind only emits utility classes actually used in `src/`, so if a
  future component uses a new Tailwind utility not yet present in any
  built page, `npm run build` must run against the CURRENT `src/` (not a
  cached `out/`) for the compiled CSS to include it.
- Component discovery scope is `cfg.srcDir: "src/components"` —
  deliberately narrower than repo-wide `src/`, to exclude Next.js page
  components (`src/app/**/page.tsx`) from the synced set. If new shared
  components are added elsewhere (e.g. a future `src/components/ui/`
  subfolder), confirm they still fall under this srcDir.
- No real npm package here — `pkg`/`globalName` in config are synthetic
  (`qring-site` / `QRing`), not a publishable identity.
- `.hairline` (CSS class) and the `tracking-widest2` Tailwind utility are
  defined in `src/app/globals.css` / `tailwind.config.ts` but never
  actually used anywhere in `src/`, so Tailwind's production build drops
  them — they do NOT appear in the compiled `_ds_bundle.css`. Confirmed
  by grepping the built bundle before writing `conventions.md`; do not
  cite either in the conventions header, and re-check if either ever
  becomes actually used (then re-verify before citing).
- `.design-sync/entry.mjs` and `.design-sync/polyfill.mjs` are part of
  the durable set (committed, not gitignored) — see "Entry file + process
  polyfill" above. Keep `entry.mjs` in sync with
  `src/components/` additions/removals.
