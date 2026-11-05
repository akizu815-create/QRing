import heroStyles from "@/components/HomeHero.module.css";
import HomeColumns from "@/components/columns/HomeColumns";
import NewmarketSupportPlacement from "@/components/NewmarketSupportPlacement";
import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";
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

const HERO_CTA_LABEL = "サービスの仕組みを見る";
const HERO_FEATURES = ["専用アプリ不要", "高齢者・ペット・落とし物に"];

export const metadata = pageMetadata("home");

export default function Home() {
  const newsItems = isNewmarketSupportActive()
    ? [{ date: NEWMARKET_SUPPORT.publishedOn.replaceAll("-", "."), cat: "NEWS", title: NEWMARKET_SUPPORT.title, href: NEWMARKET_SUPPORT.path }, ...NEWS.slice(0, 2).map((item) => ({ ...item, href: "/news/" }))]
    : NEWS.slice(0, 3).map((item) => ({ ...item, href: "/news/" }));
  return (
    <>
      <PageStructuredData page="home" />
      {/* HERO: exact approved wording; mobile heading overlays the original photograph; desktop layout is preserved. */}
      <section className="bg-ivory pt-20 md:pt-24" aria-labelledby="home-hero-title">
        <div className="relative mx-auto grid w-full max-w-[1536px] grid-cols-1 md:block">
          <div className={`${heroStyles.heroCopy} contents md:relative md:z-10 md:block md:px-6 md:pb-7 md:pt-9 xl:absolute xl:left-[5.5%] xl:top-0 xl:w-[48%] xl:px-0 xl:pb-0 xl:pt-[clamp(26px,4vw,60px)]`}>
            <div className={`${heroStyles.heroHeading} absolute inset-x-0 top-0 z-10 px-6 pt-3 md:static md:p-0`}>
              <p className={`${heroStyles.heroBrand} text-[10px] leading-relaxed tracking-[0.08em] text-ink/65 md:text-sm`}>暮らしに、もしもの備えを。</p>
              <h1 id="home-hero-title" className={`${heroStyles.heroTitle} mt-2 font-serif text-[clamp(24px,6.7vw,30px)] font-light leading-[1.35] tracking-tight md:mt-4 md:text-[clamp(31px,3.3vw,52px)] md:leading-[1.4]`}>
                <span className="block whitespace-nowrap">番号を知らせず、</span>
                <span className="block md:whitespace-nowrap"><span className="inline-block">QRから</span><span className="inline-block text-moss">声でつながる。</span></span>
              </h1>
            </div>
            <div className={`${heroStyles.heroDetails} col-start-1 row-start-2 px-6 pb-7 pt-5 md:p-0`}>
              <p className={`${heroStyles.heroSubcopy} mt-0 text-sm leading-[1.9] text-ink/80 md:mt-5 md:text-[clamp(12px,1.12vw,17px)]`}>
                <span className="md:hidden" data-mobile-hero-subcopy>QRコードをスキャンして、発信するだけ。<br />お互いの電話番号を公開せずに、通話ができます。</span>
                <span className="hidden md:inline">QRコードを読み取って、発信するだけ。<br />お互いの電話番号を公開せずに、直接話せます。</span>
              </p>
              <ul className={`${heroStyles.heroFeatures} mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-relaxed text-deepmoss md:mt-5 md:text-sm`}>
                {HERO_FEATURES.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className={`${heroStyles.heroActions} mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-5`}>
                <Link href="/service/" className="btn-primary min-h-12 !px-5 !py-3 !text-sm normal-case tracking-[0.06em]">{HERO_CTA_LABEL}<span aria-hidden="true">→</span></Link>
                <Link href="/#for-business" className="inline-flex min-h-12 items-center text-sm text-deepmoss underline decoration-moss/35 underline-offset-4">自治体・法人の方へ →</Link>
              </div>
              <p className={`${heroStyles.heroNotice} mt-4 max-w-sm text-xs leading-relaxed text-ink/70`}>{CONSUMER_SERVICE.notice}</p>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <HowItWorks />

      <UseCases />

      <PriceSection />

      <ForBusiness />

      <HomeColumns />

      <NewmarketSupportPlacement placement="home-support" />

      {/* NEWS */}
      <section className="py-16 md:py-24">
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
              {newsItems.map((n, i) => (
                <Reveal as="li" key={n.title} delay={i * 80}>
                  <Link
                    href={n.href}
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
