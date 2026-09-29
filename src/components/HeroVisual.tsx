import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="w-full overflow-hidden bg-cream">
      <div className="relative aspect-[943/1698] w-full md:hidden">
        <Image
          src="/images/hero_mobile.png"
          alt="高齢の女性、つながるQRを身につけた犬とバッグ"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ivory/90 via-ivory/25 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative hidden aspect-[3/2] w-full md:block">
        <Image
          src="/images/hero.png"
          alt="高齢の女性、つながるQRを身につけた犬とバッグ"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-ivory/75 via-ivory/25 to-transparent"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute left-0 top-0 h-[61%] w-[52%]" aria-hidden="true">
          <div className="absolute left-0 top-0 h-[88%] w-[86%] bg-ivory/95 backdrop-blur-[3px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-ivory via-ivory/90 to-transparent" />
        </div>
      </div>
    </div>
  );
}
