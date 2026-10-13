import Link from "next/link";
import HeroVisual from "@/components/HeroVisual";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import PriceSection from "@/components/PriceSection";
import ForBusiness from "@/components/ForBusiness";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";

const NEWS = [
  {
    date: "2026.08.03",
    cat: "EVENT",
    title:
      "【開催報告】Women Leaders TIB Lounge",
  },
  {
    date: "2026.07.22",
    cat: "EVENT",
    title:
      "【イベント出展のお知らせ】フィガロジャポン Business with Attitude ピッチコンテスト2026にブース出展いたしました",
  },
  {
    date: "2026.05.31",
    cat: "NEWS",
    title: "コーポレートサイトをリニューアルいたしました",
  },
];

const HERO_CTA_LABEL = "お問い合わせはこちら";
const CONTACT_URL = "https://axb.qring.jp/contact";
const HERO_FEATURES = ["アプリ不要", "電話番号は非公開", "特許取得済"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-ivory pt-20 md:pt-24">
        <div className="relative mx-auto w-full max-w-[1536px]">
          <HeroVisual />
          <div className="absolute inset-0 z-10 px-6 pt-3 md:hidden">
            <div className="max-w-[56%]">
              <span className="eyebrow">— Tsunagaru QR</span>
              <h1 className="mt-3 font-serif text-[clamp(28px,7.2vw,30px)] font-light leading-[1.35] tracking-tight">
                暮らしに、
                <br />
                <span className="text-moss">もしも</span>の備えを。
              </h1>
              <p className="mt-3 text-sm leading-[1.8] text-ink/80">
                お互いの電話番号を知られることなく、
                <br />
                声でつながる。
              </p>
            </div>

            <div className="mt-[clamp(8rem,24svh,14.5rem)]">
              <ul className="grid w-fit grid-cols-[max-content_max-content] gap-2 font-sans text-[15px] font-medium leading-none text-ink/90">
                {HERO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-moss/25 bg-white/75 px-4 py-2.5 backdrop-blur-sm"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 whitespace-nowrap !px-5 !py-3 !text-xs normal-case tracking-[0.12em]"
              >
                {HERO_CTA_LABEL}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="absolute left-[5.5%] top-0 z-10 hidden h-[68.5%] w-[39%] flex-col pb-[clamp(20px,2.5vw,38px)] pt-[clamp(24px,6vw,92px)] md:flex">
            <span className="eyebrow">— Tsunagaru QR</span>
            <h1 className="mt-4 font-serif text-[clamp(36px,4vw,64px)] font-light leading-[1.3] tracking-tight xl:mt-5">
              暮らしに、
              <br />
              <span className="text-moss">もしも</span>の備えを。
            </h1>
            <span className="mt-5 block h-px w-28 bg-gold xl:mt-7" aria-hidden="true" />
            <p className="mt-5 font-sans text-[clamp(15px,1.45vw,22px)] leading-[1.9] tracking-[0.08em] text-ink/80 xl:mt-7">
              お互いの電話番号を知られることなく、
              <br />
              声でつながる。
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-3 font-sans text-[15px] font-medium tracking-[0.02em] text-ink/90 xl:mt-6">
              {HERO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="whitespace-nowrap rounded-full border border-moss/25 bg-white/75 px-4 py-2.5 backdrop-blur-sm"
                >
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-[clamp(16px,2vw,28px)]">
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary normal-case tracking-[0.12em]"
              >
                {HERO_CTA_LABEL}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <UseCases />

      <PriceSection />

      <ForBusiness />

      {/* NEWS */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <SectionTitle eyebrow="— News" en="Recent." jp="最新のお知らせ" />
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/news"
                className="mt-10 inline-block text-xs tracking-[0.3em] uppercase link-underline"
              >
                View all →
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <ul>
              {NEWS.map((n, i) => (
                <Reveal as="li" key={n.title} delay={i * 80}>
                  <Link
                    href="/news"
                    className="group grid grid-cols-12 gap-4 py-7 border-t border-ink/10 last:border-b items-baseline"
                  >
                    <span className="col-span-3 font-serif text-sm text-ink/60">
                      {n.date}
                    </span>
                    <span className="col-span-3 md:col-span-2 text-[10px] tracking-[0.3em] uppercase text-moss">
                      {n.cat}
                    </span>
                    <span className="col-span-12 md:col-span-7 text-sm md:text-base text-ink group-hover:text-moss transition-colors duration-300">
                      {n.title}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
