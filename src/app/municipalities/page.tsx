import type { CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { ELDERLY_MISSING_PERSONS as statistics } from "@/content/statistics/elderlyMissingPersons";
import chartStyles from "@/app/use-cases/elderly/StatisticsChart.module.css";
import Image from "next/image";
import Link from "next/link";

const contactUrl = "https://axb.qring.jp/contact";
const sectionClass = "scroll-mt-24 py-16 md:scroll-mt-28 md:py-24";
const linkClass = "link-underline inline-block text-sm leading-7 text-moss transition-colors duration-300 hover:text-ink";

function SectionHeading({ en, title, id }: { en: string; title: string; id: string }) {
  return <div className="mb-9 md:mb-12"><p className="eyebrow">{en}</p><h2 id={id} className="mt-6 max-w-4xl font-serif text-[clamp(28px,3.5vw,46px)] font-light leading-[1.6]">{title}</h2></div>;
}
const benefits = [
  { title: "連絡・調整の負担を軽減", body: "発見者から登録先へ直接連絡できる手段で、職員の連絡対応を支援します。" },
  { title: "既存施策をそのまま活用", body: "GPSや見守りネットワークに、発見後の連絡という選択肢を追加できます。" },
  { title: "無理のない導入を支援", body: "QRコードと案内資料を活用し、新たな業務負担を抑えた導入を目指します。" },
  { title: "地域の魅力向上へ", body: "住民に寄り添う新たな取り組みとして、自治体の姿勢を発信できます。" },
];
const useCases = [
  { title: "警察", body: "保護した高齢者のご家族への連絡支援" },
  { title: "消防・救急", body: "緊急時の連絡先確認を補完" },
  { title: "福祉・地域包括", body: "地域の見守り活動を補完" },
  { title: "金融機関", body: "特殊詐欺が疑われる場面での連絡支援" },
  { title: "防災・動物愛護", body: "迷子ペットの飼い主への連絡支援" },
];
const steps = [
  { title: "ご相談", body: "対象者・配布数・費用負担などを相談。" },
  { title: "QRコード・資料の準備", body: "QRコードや住民向け案内資料を準備。" },
  { title: "住民への案内・配布", body: "既存の窓口や福祉事業などを活用。" },
  { title: "利用開始・効果検証", body: "利用状況を確認し、運用を改善。" },
];
const faq = [
  { question: "既存の見守り施策と併用できますか？", answer: "はい。GPSや地域の見守りネットワークを補完する連絡手段として活用を想定しています。" },
  { question: "導入時に新しいシステム開発は必要ですか？", answer: "基本的なサービス利用では、大規模なシステム開発を前提としていません。具体的な運用方法は個別にご相談いただけます。" },
  { question: "まずは小規模に試すことはできますか？", answer: "対象者や配布数を絞った試験導入についてもご相談いただけます。" },
];

export const metadata = pageMetadata("municipalities");

export default function MunicipalitiesPage() {
  const latestYear = statistics.values[statistics.values.length - 1].year;
  const chartMax = Math.ceil(Math.max(...statistics.values.map(({ count }) => count)) / 5000) * 5000;
  return (
    <>
      <PageStructuredData page="municipalities" />
      <section className="bg-cream pb-20 pt-36 md:pb-24 md:pt-48" aria-labelledby="municipalities-title">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow">FOR MUNICIPALITIES</p>
            <h1 id="municipalities-title" className="mt-8 font-serif text-[clamp(32px,4vw,56px)] font-light leading-[1.6] tracking-tight">地域の安心を、<br /><span className="text-moss">自治体の新たな力に。</span></h1>
            <p className="body-jp mt-8 text-base text-ink/80">住民の善意を、実際の連絡につなぐ。</p>
            <p className="body-jp mt-5 text-sm text-ink/70 md:text-base">「つながるQR」は、発見後の連絡を支え、自治体の見守り施策を補完する新しい選択肢です。</p>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-9 normal-case">自治体での導入を相談する</a>
          </div>
          <div className="lg:col-span-6"><Image src="/images/municipalities-hero.png" alt="屋外を一緒に歩く高齢女性と若い女性。高齢女性のバッグにQRコードのタグが付いている" width={1672} height={941} priority sizes="(min-width: 1024px) 48vw, 100vw" className="h-auto w-full" /></div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="social-issue-title">
        <div className="container-wide grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5"><SectionHeading en="SOCIAL ISSUE" title="見守りの、その先にある課題。" id="social-issue-title" />

          </div>
          <figure className="min-w-0 lg:col-span-7" aria-labelledby="chart-caption" aria-describedby="chart-notes">
            <figcaption id="chart-caption" className="text-sm leading-7 text-ink/75">認知症またはその疑いに係る行方不明者の届出状況</figcaption>
            <p className="mt-3 text-xs text-ink/55">単位：人（延べ人数）／棒の基点は0</p>
            <div className={chartStyles.chart}>
              <div aria-hidden="true" className={chartStyles.ticks}>{[chartMax, chartMax / 2, 0].map((tick) => <div key={tick} className={chartStyles.tick}><span>{tick.toLocaleString("ja-JP")}</span></div>)}</div>
              <ol className={chartStyles.rows}>{statistics.values.map(({ year, count }) => <li key={year} className={`${chartStyles.row} ${year === latestYear ? chartStyles.latest : "text-ink/70"}`} style={{ "--ratio": count / chartMax } as CSSProperties}><p className={chartStyles.year}>{year}<span className="sr-only">年</span></p><div aria-hidden="true" className={chartStyles.track}><div className={chartStyles.bar} /></div><p className={chartStyles.value}>{count.toLocaleString("ja-JP")}<span className="sr-only">人</span></p></li>)}</ol>
            </div>
            <div id="chart-notes" className="body-jp mt-7 space-y-2 text-xs text-ink/55"><p>※届出が出された者の延べ人数で、実人数ではありません。認知症またはその疑いを含み、65歳以上に限定した統計ではありません。</p><p>出典：警察庁『{statistics.title}』および過年度資料をもとに株式会社QRing作成</p></div>
          </figure>
          <div className="lg:col-span-12 border-t border-ink/10 pt-8">
            <p className="font-serif text-xl font-light leading-[1.9] md:text-2xl">「見つける仕組み」に加えて、<br />「見つけた人が連絡できる仕組み」も。</p>
            <p className="body-jp mt-6 text-sm text-ink/70">既存の見守り活動を活かしながら、発見者からご家族などの登録先へ連絡できる手段を追加することができます。</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/use-cases/elderly/" className={linkClass}>高齢者の見守りと連絡の備えを見る →</Link><Link href="/service/" className={linkClass}>サービスの仕組みを見る →</Link></div>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="benefits-title">
        <div className="container-wide"><SectionHeading en="BENEFITS" title="自治体にも、職員にも。4つの導入メリット。" id="benefits-title" />
          <div className="grid gap-5 md:grid-cols-2">{benefits.map((item, i) => <article key={item.title} className="bg-ivory p-7 md:p-9"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-4 font-serif text-2xl font-light leading-relaxed text-moss">{item.title}</h3><p className="body-jp mt-4 text-sm text-ink/75">{item.body}</p></article>)}</div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="use-cases-title">
        <div className="container-wide"><SectionHeading en="USE CASES" title="一つの仕組みを、地域のさまざまな場面に。" id="use-cases-title" />
          <div className="divide-y divide-ink/10 border-y border-ink/10">{useCases.map((item, i) => <article key={item.title} className="grid gap-3 py-5 md:grid-cols-[2rem_12rem_minmax(0,1fr)] md:items-baseline md:gap-6"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="font-serif text-xl font-light text-moss">{item.title}</h3><p className="body-jp text-sm text-ink/70">{item.body}</p></article>)}</div>
          <p className="body-jp mt-5 text-xs text-ink/55">※いずれも想定する活用場面です。各機関での導入・運用が決定しているものではなく、正式な業務手順や緊急通報に代わるものではありません。金融機関での利用は本人の了承を得られる場合を想定しています。</p>
        </div>
      </section>

      <section className={`${sectionClass} bg-ivory`} aria-labelledby="implementation-title">
        <div className="container-wide"><SectionHeading en="EASY IMPLEMENTATION" title="新しい見守りを、無理のない導入から。" id="implementation-title" />
          <ol className="grid gap-6 md:grid-cols-4">{steps.map((item, i) => <li key={item.title} className="border-t border-moss/40 pt-5"><p className="text-xs tracking-[0.16em] text-moss">STEP {i + 1}</p><h3 className="mt-4 font-serif text-xl font-light leading-relaxed">{item.title}</h3><p className="body-jp mt-3 text-sm text-ink/70">{item.body}</p></li>)}</ol>
          <p className="body-jp mt-8 text-sm text-ink/70">住民向け説明動画や配布資料、職員向けマニュアルなど、導入負担を抑える支援体制の整備も進めています。</p>
          <div className="mt-8 border-t border-ink/15 pt-6"><h3 id="price-title" className="scroll-mt-24 text-sm font-medium text-moss">料金・管理について</h3><ul className="body-jp mt-4 space-y-2 text-sm text-ink/70"><li>自治体負担・住民負担などの費用負担方式は個別にご相談ください。</li><li>登録・通話状況、料金・請求状況を確認する管理機能は実装済みです。自治体向けの提供範囲・権限を確認のうえご案内します。</li><li>具体的な料金・契約条件は個別相談です。一般向け料金がそのまま自治体の契約価格となるものではありません。</li></ul><Link href="/price/" className={`${linkClass} mt-4`}>一般向けの料金条件を見る →</Link></div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="faq-title">
        <div className="container-narrow"><SectionHeading en="FAQ & CONTACT" title="導入前の疑問から、ご相談ください。" id="faq-title" />
          <div className="divide-y divide-ink/10 border-y border-ink/10">{faq.map((item) => <details key={item.question} className="group py-1"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-sm font-medium leading-relaxed marker:hidden md:text-base [&::-webkit-details-marker]:hidden"><span>{item.question}</span><span aria-hidden="true" className="shrink-0 text-xl font-light text-moss group-open:rotate-45">＋</span></summary><p className="body-jp pb-5 pr-8 text-sm text-ink/70">{item.answer}</p></details>)}</div>
          <div className="mt-12 text-center md:mt-16"><h3 className="font-serif text-[clamp(26px,3vw,38px)] font-light leading-relaxed">地域に合った見守りの形を、<br />一緒に考えませんか。</h3><a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 normal-case">自治体での導入を相談する</a></div>
        </div>
      </section>
    </>
  );
}
