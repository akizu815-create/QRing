import Image from "next/image";
import Reveal from "@/components/Reveal";

const BUSINESS_CARDS = [
  {
    label: "Pilot project",
    title: "実証実験パートナー",
    body: "ホテル・自治体・施設など、実際の現場でサービスを試していただける方へ。",
    image: "/images/business-pilot-project.png",
    imageAlt: "温かみのある施設でサービスについて相談する様子",
  },
  {
    label: "Collaboration",
    title: "コラボ製品パートナー",
    body: "ブランドやメーカーとともに、つながるQRを活用した新しい製品を。",
    image: "/images/business-collaboration.png",
    imageAlt: "バッグや革小物のコラボレーション製品を相談する様子",
  },
] as const;

function BusinessCard({ card }: { card: (typeof BUSINESS_CARDS)[number] }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-ink/10 bg-white">
      <div className="relative aspect-video overflow-hidden bg-cream">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-[1.025]"
        />
      </div>
      <div className="flex flex-1 flex-col p-7 md:p-9 lg:p-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-moss">
          {card.label}
        </p>
        <h3 className="mt-4 font-serif text-[26px] font-light leading-snug md:text-3xl">
          {card.title}
        </h3>
        <p className="body-jp mt-5 text-sm text-ink/70 md:max-w-md">{card.body}</p>
        <span
          className="mt-8 self-end text-xs tracking-[0.18em] text-ink/55"
          aria-label={`${card.title}の詳細ページは未設定です`}
        >
          詳しく見る →
        </span>
      </div>
    </article>
  );
}

export default function ForBusiness() {
  return (
    <section id="for-business" className="bg-ivory py-24 md:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-moss/80">
              For business
            </p>
            <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-serif text-[clamp(34px,4vw,58px)] font-light leading-[1.3] tracking-tight">
              新しい安心を、<span className="text-moss">ともに</span>。
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
              つながるQRの可能性を広げる、パートナーを募集しています。
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
          {BUSINESS_CARDS.map((card, index) => (
            <Reveal key={card.label} delay={240 + index * 120} className="h-full">
              <BusinessCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
