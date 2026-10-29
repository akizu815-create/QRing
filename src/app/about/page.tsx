import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import PageHeader from "@/components/PageHeader";

const COMPANY = [
  { k: "会社名", v: "株式会社QRing" },
  { k: "代表者", v: "代表取締役 木津 愛子" },
  { k: "設立", v: "2025年10月31日" },
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2丁目37番5号 RENEX Otsuka 10階" },
  { k: "資本金", v: "1,000万円" },
  { k: "事業内容", v: "「つながるQR」の開発・提供 / 関連サービスの企画運営" },
  { k: "主要取引銀行", v: "三井住友銀行" },
];

const eyebrow = "text-[10px] font-medium tracking-[0.28em] text-ink/60 md:text-[11px]";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <PageStructuredData page="about" />
      <div className="[&>section]:pb-12 md:[&>section]:pb-16">
        <PageHeader eyebrow="— About" en="About" jp="私たちについて" />
      </div>

      <section id="vision" className="scroll-mt-24 bg-ivory pb-20 pt-12 md:pb-24 md:pt-16" aria-labelledby="philosophy-heading">
        <div className="container-wide grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-20">
          <div className="md:col-span-6">
            <p className={eyebrow}>PHILOSOPHY<span className="ml-5 tracking-[0.12em] text-ink/55">企業理念</span></p>
            <h2 id="philosophy-heading" className="mt-8 font-serif text-[clamp(36px,5.2vw,74px)] font-light leading-[1.55] tracking-tight">
              人の善意を、<br /><span className="text-moss">行動につなぐ。</span>
            </h2>
            <div className="body-jp mt-8 space-y-5 text-sm text-ink/75 md:mt-10 md:text-base">
              <p>誰かを助けたいと思う気持ちは、私たちの身近なところにあります。</p>
              <p>その気持ちを、安心して行動に移せるように。</p>
              <p>QRingは、人と人をつなぐ仕組みを、技術の力でつくっていきます。</p>
            </div>
            <div id="approach" className="scroll-mt-24 mt-7">
              <Link href="/service/" className="link-underline inline-block text-sm leading-7 text-ink/75 transition-colors duration-300 hover:text-moss">つながるQRについて詳しく見る →</Link>
            </div>
          </div>
          <figure className="md:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[6/5]">
              <Image src="/images/about-vision-city-walk.png" alt="木漏れ日の都会の歩道を行き交う人々" fill sizes="(min-width: 1280px) 560px, (min-width: 768px) 42vw, 100vw" className="object-cover object-center" priority />
            </div>
          </figure>
        </div>
      </section>

      <section id="message" className="scroll-mt-24 py-20 md:py-24" aria-labelledby="message-heading">
        <div className="container-wide grid gap-9 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4"><h2 id="message-heading" className="text-sm font-medium leading-8 tracking-[0.08em]"><span className="text-ink/60">MESSAGE</span><span className="mx-3 text-ink/30">｜</span>代表挨拶</h2></div>
          <div className="body-jp space-y-6 text-sm text-ink/75 md:col-span-8 md:max-w-2xl md:text-base">
            <p>技術だけで、人を助けることはできません。</p>
            <p>人を動かすのは、一人ひとりの中にある優しさや思いやりだと考えています。</p>
            <p>私たちは、その気持ちが自然に届く仕組みをつくり、人と人とのつながりを大切に育ててまいります。</p>
            <div className="pt-3 text-right text-sm leading-loose"><p>株式会社QRing</p><p>代表取締役 木津 愛子</p></div>
          </div>
        </div>
      </section>

      <section id="company" className="scroll-mt-24 bg-cream py-20 md:py-28" aria-labelledby="company-heading">
        <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4"><p className={eyebrow}>COMPANY</p><h2 id="company-heading" className="mt-6 font-serif text-3xl font-light leading-relaxed md:text-4xl">会社概要</h2></div>
          <dl className="min-w-0 border-b border-ink/10 md:col-span-8">
            {COMPANY.map((row) => <div key={row.k} className="grid gap-3 border-t border-ink/10 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="text-xs leading-7 tracking-[0.12em] text-ink/60">{row.k}</dt><dd className="break-words text-sm leading-7 text-ink/80 md:text-base">{row.v}</dd></div>)}
          </dl>
        </div>
      </section>
    </>
  );
}
