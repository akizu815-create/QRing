import HeroVisual from '../../src/components/HeroVisual';

// HeroVisual is a fill-container background layer (position: absolute,
// inset: 0) — it's always composed inside a sized, position:relative
// section in the real site (see src/app/page.tsx's hero section), never
// rendered bare. This wrapper reproduces that composition.
export function Default() {
  return (
    <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
      <HeroVisual />
    </div>
  );
}
