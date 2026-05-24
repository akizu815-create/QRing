import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right scale-105 animate-slow-zoom"
      />

      {/* Soft tonal overlay so the headline sits comfortably on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory/30" />

      {/* Subtle paper grain */}
      <div className="absolute inset-0 grain pointer-events-none" />
    </div>
  );
}
