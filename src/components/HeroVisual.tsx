import styles from "./HomeHero.module.css";

export default function HeroVisual() {
  return (
    <div className="relative col-start-1 row-start-1 w-full overflow-hidden bg-cream">
      <div className={`${styles.heroFrame} relative aspect-[941/1450] w-full md:aspect-[3/2]`}>
        {/* 静的配信でも、画面幅・対応形式に合う既存写真だけを読み込む。 */}
        <picture>
          <source media="(max-width: 767px)" type="image/webp" srcSet="/images/hero-mobile-woman-dog.webp" />
          <source type="image/avif" srcSet="/images/hero-clean.avif" />
          <source type="image/webp" srcSet="/images/hero-clean.webp" />
          <img
            src="/images/hero-clean.png"
            alt="女性、つながるQRを身につけた犬とバッグ"
            width={1586}
            height={992}
            fetchPriority="high"
            decoding="async"
            className={`${styles.heroPhoto} absolute inset-0 h-full w-full object-cover object-[52%_top] md:object-center`}
          />
        </picture>
        <div className={`${styles.heroWash} pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ivory/90 via-ivory/40 to-transparent md:hidden`} aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-[66%] bg-gradient-to-b from-ivory/85 via-ivory/30 to-transparent xl:block"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden grain md:block" aria-hidden="true" />
    </div>
  );
}
