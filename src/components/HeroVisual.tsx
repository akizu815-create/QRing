import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-cream md:max-h-[calc(100svh-13rem)]">
      <Image
        src="/images/hero.png"
        alt="高齢の女性、つながるQRを身につけた犬とバッグ"
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />
      <div
        className="absolute left-0 top-0 h-[60%] w-[49%] bg-ivory md:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-ivory/75 via-ivory/25 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
