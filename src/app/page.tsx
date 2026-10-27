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
          <div className="absolute inset-0 z-10 px-6 pt-3 md:hidden">
            <div className="max-w-[56%]">
              <span className="eyebrow">— Tsunagaru QR</span>
              <p aria-hidden="true" className="mt-3 font-serif text-[clamp(28px,7.2vw,30px)] font-light leading-[1.35] tracking-tight">
                暮らしに、
                <br />
                <span className="text-moss">もしも</span>の備えを。
              </p>
              <p className="mt-3 text-sm leading-[1.8] text-ink/80">
                お互いの電話番号を
                <br />
                明かさずに、声でつながる。
              </p>
            </div>

            <div className="mt-[clamp(6rem,18svh,11rem)]">
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
              <div className="mt-4 flex flex-col items-start gap-2">
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
            </div>
          </div>
          <div className="absolute left-[5.5%] top-0 z-10 hidden h-[63%] w-[43%] flex-col pb-[clamp(20px,2.5vw,38px)] pt-[clamp(24px,4vw,60px)] md:flex md:max-lg:relative md:max-lg:left-auto md:max-lg:h-auto md:max-lg:w-full md:max-lg:bg-ivory md:max-lg:px-[5.5%] md:max-lg:py-10">
            <span className="eyebrow">— Tsunagaru QR</span>
            <p aria-hidden="true" className="mt-4 font-serif text-[clamp(36px,4vw,64px)] font-light leading-[1.3] tracking-tight xl:mt-5">
              暮らしに、
              <br />
              <span className="text-moss">もしも</span>の備えを。
            </p>
            <span className="mt-5 block h-px w-28 bg-gold xl:mt-7" aria-hidden="true" />
            <p className="mt-5 font-sans text-[clamp(15px,1.45vw,22px)] leading-[1.9] tracking-[0.08em] text-ink/80 xl:mt-7">
              お互いの電話番号を明かさずに、
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
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
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
      </section>

      <div className="container-wide py-5 text-center">
        <p className="text-xs leading-relaxed text-ink/65">{CONSUMER_SERVICE.notice}</p>
      </div>

      <section className="py-14 md:py-20" aria-labelledby="service-overview">
        <div className="container-narrow text-center">
          <h1 id="service-overview" className="font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]">
            高齢者・ペットの見守りと、落とし物対策に。<br />
            電話番号を公開せず、<span className="text-moss">声でつながる</span>QR。
          </h1>
          <div className="body-jp mx-auto mt-8 max-w-2xl space-y-4 text-left text-sm md:text-base">
            <p>つながるQRは、高齢者の外出時の見守り、ペットの迷子、持ち物の紛失に備える、QRコードの連絡サービスです。</p>
            <p>身につけたQRコードを見つけた方が読み取り、画面の「電話をかける」から、ご家族・飼い主・持ち主へ連絡できます。お互いの電話番号を公開せず、専用アプリなしで通話できます。</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-ink/75">
            <Link href="/use-cases/elderly/" className="link-underline transition-colors hover:text-moss">高齢者の外出時の見守り →</Link>
            <Link href="/use-cases/pets/" className="link-underline transition-colors hover:text-moss">ペットの迷子対策 →</Link>
            <Link href="/use-cases/belongings/" className="link-underline transition-colors hover:text-moss">落とし物・忘れ物対策 →</Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      <UseCases />

      <PriceSection />

      <ForBusiness />

      <section className="bg-cream py-20 md:py-28" aria-labelledby="guides-heading">
        <div className="container-narrow">
          <p className="eyebrow">GUIDES</p>
          <h2 id="guides-heading" className="mt-6 font-serif text-3xl font-light leading-relaxed md:text-4xl">ご家族や持ち物に合う、備えの選び方。</h2>
          <div className="mt-8 grid gap-6 text-sm leading-8 text-moss md:grid-cols-2">
            <Link href="/column/elderly-monitoring/" className="border-t border-ink/15 py-6 hover:text-ink">高齢者の見守り方法を比較する →</Link>
            <Link href="/column/lost-item-preparation/" className="border-t border-ink/15 py-6 hover:text-ink">位置確認タグ・QRタグの役割を知る →</Link>
          </div>
        </div>
      </section>

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
