export default function HeroVisual() {
  return (
    <div className="relative w-full overflow-hidden bg-cream">
      <div className="relative h-[calc(100svh-5rem)] min-h-[540px] w-full md:aspect-[3/2] md:h-auto md:min-h-0">
        {/* 静的配信でも、画面幅・対応形式に合う既存写真だけを読み込む。 */}
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet="/images/hero_mobile.avif" />
          <source media="(max-width: 767px)" type="image/webp" srcSet="/images/hero_mobile.webp" />
          <source media="(max-width: 767px)" srcSet="/images/hero_mobile.png" />
          <source type="image/avif" srcSet="/images/hero-clean.avif" />
          <source type="image/webp" srcSet="/images/hero-clean.webp" />
          <img
            src="/images/hero-clean.png"
            alt="高齢の女性、つながるQRを身につけた犬とバッグ"
            width={1586}
            height={992}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[52%_center] md:object-center"
          />
        </picture>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ivory/90 via-ivory/25 to-transparent md:hidden"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-[58%] bg-gradient-to-b from-ivory/75 via-ivory/25 to-transparent md:block"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 grain" aria-hidden="true" />
    </div>
  );
}
