## QRing — build conventions

QRing's visual language is **premium minimalism**: quiet earth tones, a
serif/sans two-layer typography system, zero border-radius anywhere, and
slow (500–1200ms) fade transitions. Nothing here needs a theme provider —
all styling is static Tailwind utility classes plus a handful of
hand-authored component classes; there's no runtime theme injection.

### Setup caveats (read before composing)

- **`Header`, `Footer`, `HeroVisual`** reference site-relative public
  assets (`/images/logo-black.svg`, `/images/logo-white.svg`,
  `/images/hero.png`) via absolute paths. These are NOT bundled with the
  design system — the host app must serve matching files at those exact
  paths, or the image renders broken. When composing a new design with
  these components, either provide assets at the same paths or substitute
  your own imagery in an equivalent slot.
- **`Reveal`** is a scroll-triggered fade wrapper (IntersectionObserver +
  CSS transition): its children are invisible (`opacity-0
  translate-y-6`) until the element scrolls into view, then fade in over
  1200ms. Only wrap real content that should reveal on scroll — not
  above-the-fold chrome like `Header`/`Footer`. A static render (e.g. a
  screenshot) may catch it pre-reveal; that's expected, not broken.
- **`Header`/`Footer`** are full-page chrome — compose once per layout,
  not per section.

### Styling idiom

Utility-first Tailwind with QRing's brand tokens as named colors — use
these, never arbitrary hex values:

| Token | Hex | Use |
|---|---|---|
| `ivory` | #F7F4EE | base background |
| `cream` | #EFE9DD | section background (alternates with ivory) |
| `sand` | #E2D7C2 | sunken/texture background |
| `ink` | #1F1A14 | body text, primary button bg, CTA/invert bg |
| `moss` | #5B6E4F | the one accent color — eyebrows, hover, links |
| `deepmoss` | #3F4F36 | moss hover-deepen |
| `gold` / `softgold` | #B8954B / #D6B97A | sparing highlight (invert-mode accents) |

Apply as `bg-ink`, `text-moss`, `border-ink/10`, etc. (opacity via Tailwind's
`/NN` suffix is used constantly — e.g. `text-ink/60`, `bg-ink/10`).

Hand-authored component classes (defined in `styles.css`, safe to reuse
verbatim): `container-wide` (1280px max, standard page width),
`container-narrow` (960px, copy-focused), `eyebrow` (11px/tracking-0.3em/
uppercase/moss, section label), `display` (serif/weight-300/tight
headline), `body-jp` (leading-2/ink-80%, Japanese body copy),
`btn-primary` (ink→moss on hover), `btn-ghost` (outline→ink-fill on
hover), `link-underline` (right-to-left underline sweep on hover),
`grain` (apply to an `absolute inset-0` sibling for the paper-grain
texture — needs a `position: relative` ancestor).

**No border radius anywhere** — never add `rounded-*` utilities; every
edge in this system is square.

Typography: `font-serif` (Cormorant Garamond + Noto Serif JP — headlines
and display type only, always weight 300/light) and `font-sans` (Noto
Sans JP — body copy, nav, labels). Label/eyebrow text is uppercase with
wide tracking (`tracking-[0.2em]`–`tracking-[0.35em]`).

### Where the truth lives

`styles.css` (imports the full compiled stylesheet + tokens + fonts) is
the source of truth for every class above — read it before inventing a
new utility combination. Each component's `<Name>.prompt.md` has real
usage copy ported from the live site; `<Name>.d.ts` is the prop contract.

### Example composition

```tsx
<PageHeader eyebrow="— Service" en="Tsunagaru QR." jp="サービスについて" />

<section className="py-24 md:py-40 bg-cream">
  <div className="container-wide">
    <Reveal>
      <SectionTitle eyebrow="— Features" en="Three Promises." jp="QRingの、三つの約束。" />
    </Reveal>
    <div className="mt-20 grid md:grid-cols-3 gap-10">
      {/* feature-card-style children: bg-ivory, border-t border-ink/10,
          p-10, hover:border-moss, transition-all duration-700 */}
    </div>
  </div>
</section>
```
