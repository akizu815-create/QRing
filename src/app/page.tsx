import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";
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

export const metadata = pageMetadata("home");

export default function Home() {
  return (
    <>
      <PageStructuredData page="home" />
      {/* HERO */}
      <section className="bg-ivory pt-20 md:pt-24">
        <div className="relative mx-auto w-full max-w-[1536px] md:max-lg:flex md:max-lg:flex-col-reverse">
          <HeroVisual />
          <div className="absolute inset-0 z-10 px-6 pt-3 md:inset-auto md:left-[5.5%] md:top-0 md:flex md:h-[63%] md:w-[43%] md:flex-col md:px-0 md:pb-[clamp(20px,2.5vw,38px)] md:pt-[clamp(24px,4vw,60px)] md:max-lg:relative md:max-lg:left-auto md:max-lg:h-auto md:max-lg:w-full md:max-lg:bg-ivory md:max-lg:px-[5.5%] md:max-lg:py-10">
            <div className="max-w-[56%] md:max-w-none">
              <span className="eyebrow">— Tsunagaru QR</span>
              <h1 className="mt-3 whitespace-nowrap font-serif text-[clamp(28px,7.2vw,30px)] font-light leading-[1.35] tracking-tight md:mt-4 md:text-[clamp(36px,4vw,64px)] md:leading-[1.3] xl:mt-5">
                暮らしに、
                <br />
                <span className="text-moss">もしも</span>の備えを。
              </h1>
              <span className="mt-5 hidden h-px w-28 bg-gold md:block xl:mt-7" aria-hidden="true" />
              <p className="mt-3 text-sm leading-[1.8] text-ink/80 md:mt-5 md:font-sans md:text-[clamp(15px,1.45vw,22px)] md:leading-[1.9] md:tracking-[0.08em] xl:mt-7">
                お互いの電話番号を<br className="md:hidden" />
                明かさずに、<br className="hidden md:block" />声でつながる。
              </p>
            </div>
            <div className="mt-[clamp(6rem,18svh,11rem)] md:mt-4 xl:mt-6">
              <ul className="grid w-fit grid-cols-[max-content_max-content] gap-2 font-sans text-[15px] font-medium leading-none text-ink/90 md:flex md:flex-wrap md:items-center md:gap-3 md:leading-normal md:tracking-[0.02em]">
                {HERO_FEATURES.map((feature) => (
                  <li key={feature} className="whitespace-nowrap rounded-full border border-moss/25 bg-white/75 px-4 py-2.5 backdrop-blur-sm">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col md:hidden items-start gap-2">
                <a
                  href={CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary whitespace-nowrap !px-5 !py-3 !text-xs normal-case tracking-[0.12em]"
                >
                  {HERO_CTA_LABEL}
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/municipalities/"
                  className="inline-flex max-w-full items-center border border-moss/50 bg-ivory/80 px-5 py-3 text-xs font-medium tracking-[0.04em] text-deepmoss transition-colors hover:border-moss hover:bg-ivory"
                >
                  自治体向けサービスを見る →
                </Link>
              </div>
              <div className="mt-4 hidden flex-wrap md:flex items-center gap-x-5 gap-y-2">
                <a
                  href={CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary normal-case tracking-[0.12em]"
                >
                  {HERO_CTA_LABEL}
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/municipalities/"
                  className="inline-flex items-center whitespace-nowrap border border-moss/50 bg-ivory/80 px-3 py-3 text-[11px] font-medium tracking-[0.02em] text-deepmoss transition-colors hover:border-moss hover:bg-ivory"
                >
                  自治体向けサービスを見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide py-5 text-center">
        <p className="text-xs leading-relaxed text-ink/65">{CONSUMER_SERVICE.notice}</p>
      </div>

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
                    <span className="col-span-3 md:col-span-2 text-[10px] tracking-[0.3em] uppercase text-ink/60">
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
      <div className="container-wide pb-8 text-center">
        <p className="text-xs leading-relaxed text-ink/65">本サービスの通話機能は、日本国内でのみご利用いただけます。</p>
      </div>
    </>
  );
}
