import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./StatisticsChart.module.css";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { ELDERLY_MISSING_PERSONS as statistics } from "@/content/statistics/elderlyMissingPersons";

export const metadata = pageMetadata("elderly");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]";
const eyebrowClass = "text-[10px] font-medium tracking-[0.3em] text-ink/60";
// 内閣府 令和8年版高齢社会白書 図1-2-2-6：443.2万人・584.2万人を概数表示。
// https://www8.cao.go.jp/kourei/whitepaper/w-2026/zenbun/pdf/1s2s_02.pdf
const projections = [{ year: "2022年", value: "443", label: "推計" }, { year: "2040年", value: "584", label: "将来推計" }];
// 比較対象の基本操作は公式案内で照合。運営会社名は表示しない。
// https://mirai-town.com/product/dokoshiru-briefing/
const comparison = [
  ["主な役割", "発見後の音声連絡", "現在地の把握", "発見情報の通知・伝言"],
  ["発見者から家族へ直接音声でつながれる", "○", "サービス・機種による", "基本は伝言板でのやり取り"],
  ["発見者の基本操作", "スキャン後、発信ボタンをタップ", "サービスによる", "スキャン後、発見情報を入力"],
  ["電話番号を相手に公開せず連絡", "○", "サービスによる", "○"],
];

export default function ElderlyPage() {
  const latestYear = statistics.values[statistics.values.length - 1].year;
  const chartMax = Math.ceil(Math.max(...statistics.values.map(({ count }) => count)) / 5000) * 5000;

  return (
    <>
      <PageStructuredData page="elderly" />
      <section className="bg-cream pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="container-narrow">
          <p className={eyebrowClass}>— FAMILY CARE</p>
          <h1 className="mt-9 font-serif text-[clamp(34px,5vw,64px)] font-light leading-[1.5] tracking-tight">
            もしも、家族が<br className="sm:hidden" />帰ってこなかったら。
          </h1>
          <div className="body-jp mt-10 max-w-2xl space-y-4 text-sm text-ink/70 md:text-base">
            <p>いつもの外出が、思いがけない出来事につながることもあります。</p>
            <p>そんな「もしも」に備えて、見つけてくださった方からご家族へ連絡できる手段を用意しておきませんか。</p>
          </div>
          <div className="mt-10 md:mt-14">
            <Image
              src="/images/municipalities-hero.png"
              alt="公園で寄り添って歩き、笑顔を交わす高齢女性とご家族"
              width={1672}
              height={941}
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="data-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>DATA</p>
          <h2 id="data-heading" className={`${headingClass} mt-6`}>認知症による行方不明は、身近な課題です。</h2>
          <p className="body-jp mt-6 text-sm text-ink/70 md:text-base">毎年、多くの認知症高齢者が行方不明として届け出されています。<br />見守りの必要性は、今後さらに高まることが見込まれます。</p>
          <figure className="mt-12 md:mt-16" aria-labelledby="chart-caption" aria-describedby="chart-notes">
            <figcaption id="chart-caption" className="text-sm leading-7 text-ink/70">認知症またはその疑いに係る行方不明者の届出状況</figcaption>
            <p className="mt-3 text-xs text-ink/55">単位：人（延べ人数）／棒の基点は0</p>
            <div className={styles.chart}>
              <div aria-hidden="true" className={styles.ticks}>
                {[chartMax, chartMax / 2, 0].map((tick) => <div key={tick} className={styles.tick}><span>{tick.toLocaleString("ja-JP")}</span></div>)}
              </div>
              <ol className={styles.rows}>
                {statistics.values.map(({ year, count }) => (
                  <li key={year} className={`${styles.row} ${year === latestYear ? styles.latest : "text-ink/70"}`} style={{ "--ratio": count / chartMax } as CSSProperties}>
                    <p className={styles.year}>{year}<span className="sr-only">年</span></p>
                    <div aria-hidden="true" className={styles.track}><div className={styles.bar} /></div>
                    <p className={styles.value}>{count.toLocaleString("ja-JP")}<span className="sr-only">人</span></p>
                  </li>
                ))}
              </ol>
            </div>
            <div id="chart-notes" className="body-jp mt-8 space-y-2 text-xs text-ink/60">
              <p>※届出が出された者の延べ人数であり、実人数ではありません。認知症またはその疑いを含み、65歳以上に限定した統計ではありません。</p>
              <p>出典：警察庁『{statistics.title}』および過年度資料をもとに株式会社QRing作成</p>
            </div>
          </figure>
          <div className="mt-14 border-t border-ink/10 pt-10 md:mt-16 md:pt-12" aria-labelledby="projection-heading">
            <h3 id="projection-heading" className="font-serif text-2xl font-light leading-relaxed md:text-3xl">これからの見守りに、さらなる備えを。</h3>
            <div className="body-jp mt-6 space-y-3 text-sm text-ink/70"><p>認知症のある65歳以上の人の数は、今後さらに増加すると見込まれています。</p><p>ご本人とご家族が安心して暮らすために、見守りに加えて、発見後の連絡手段も備えておくことが大切です。</p></div>
            <dl className="mt-8 grid grid-cols-2 divide-x divide-ink/10 border-y border-ink/10 py-7 md:py-9">
              {projections.map((item) => <div key={item.year} className="min-w-0 px-3 text-center md:px-8"><dt className="text-xs leading-6 text-ink/60 md:text-sm">{item.year}<span className="ml-2 inline-block">{item.label}</span></dt><dd className="mt-4 whitespace-nowrap font-sans text-[clamp(28px,6vw,48px)] font-light tabular-nums"><span className="text-sm text-ink/65">約</span>{item.value}<span className="ml-1 text-sm text-ink/65 md:text-base">万人</span></dd></div>)}
            </dl>
            <div className="body-jp mt-5 space-y-1 text-xs text-ink/55"><p>※認知症高齢者数は推計値です。</p><p>※性年齢階級別の有病率が一定と仮定した推計です。</p><p>※出典：内閣府「令和8年版高齢社会白書」</p></div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28" aria-labelledby="concerns-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>FAMILY CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-6`}>見つけてもらえても、家族につながれないことがあります。</h2>
          <div className="body-jp mt-7 space-y-4 text-sm text-ink/70 md:text-base"><p>認知症のある方が外出先で保護されても、誰に連絡すればよいかわからないことがあります。</p><p>だからこそ、見つけてくださった方がすぐに行動できる、わかりやすい案内があることも大切です。</p></div>
          <div className="mt-9 border-l border-moss/30 pl-6"><h3 className="text-xs font-medium tracking-[0.12em] text-ink/60">シールの案内文イメージ</h3><ul className="body-jp mt-4 space-y-2 text-sm text-ink/80 md:text-base"><li>迷子になっている可能性があります。</li><li>見守りが必要な方です。</li><li>こちらにご連絡ください。</li></ul></div>
        </div>
      </section>

      <section className="bg-ivory py-24 md:py-36" aria-labelledby="solution-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>SOLUTION</p>
          <h2 id="solution-heading" className="mt-7 font-serif text-[clamp(28px,4.2vw,58px)] font-light leading-[1.8] tracking-tight">見つけてもらえた、その先に。<br /><span className="text-moss">ご家族</span>へつながる手段を。</h2>
          <div className="body-jp mt-8 max-w-3xl space-y-5 text-sm text-ink/70 md:text-base"><p>身につけたQRコードを発見者がスキャンし、「電話をかける」をタップ。<br />お互いの電話番号を公開することなく、ご家族などの登録先と直接通話できます。</p><p>見つけてくださった方の善意を、ご家族への連絡につなぐ。<br />「つながるQR」は、そんな小さな備えを目指しています。</p></div>
          <Link href="/service/" className={`${linkClass} mt-8`}>サービスの仕組みを見る →</Link>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="options-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>OTHER OPTIONS</p>
          <h2 id="options-heading" className={`${headingClass} mt-6`}>見守りの方法は、一つではありません。</h2>
          <p className="body-jp mt-6 text-sm text-ink/70 md:text-base">見守りサービスには、それぞれ役割があります。<br />つながるQRは、発見後にご家族につながる手段として活用できます。</p>
          <p id="comparison-help" className="mt-7 text-xs text-ink/55 md:hidden">表は横にスクロールしてご覧いただけます。</p>
          <div className="mt-4 overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss md:mt-9" role="region" aria-label="見守り方法の比較表" aria-describedby="comparison-help" tabIndex={0}>
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm leading-7">
              <caption className="sr-only">見守り方法の基本機能と発見後の連絡方法の比較</caption>
              <colgroup><col className="w-[28%]" /><col className="w-[24%] bg-ivory" /><col className="w-[22%]" /><col className="w-[26%]" /></colgroup>
              <thead><tr className="border-y border-ink/20"><th scope="col" className="p-5 font-medium">比較項目</th><th scope="col" className="p-5 font-medium">つながるQR</th><th scope="col" className="p-5 font-medium">GPS見守り</th><th scope="col" className="p-5 font-medium">どこシル伝言板</th></tr></thead>
              <tbody>{comparison.map(([label, qring, gps, board]) => <tr key={label} className="border-b border-ink/10"><th scope="row" className="p-5 font-medium text-ink/80">{label}</th><td className="p-5 text-ink/75">{qring}</td><td className="p-5 text-ink/75">{gps}</td><td className="p-5 text-ink/75">{board}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="body-jp mt-6 space-y-1 text-xs text-ink/55"><p>※一般的なGPS見守りサービスおよび各サービスの基本的な機能をもとに整理しています。</p><p>※サービスごとに機能や運用方法は異なります。</p><p>※それぞれ役割が異なるため、併用も考えられます。</p></div>
        </div>
      </section>

      <section className="py-24 text-center md:py-36" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-6`}>小さなQRコードに、大きな安心を。</h2>
          <p className="body-jp mx-auto mt-8 max-w-xl text-sm text-ink/70 md:text-base">「つながるQR」は現在、一般向けサービスの正式リリースに向けて準備中です。</p>
          <p className="body-jp mt-4 text-sm text-ink/70 md:text-base">最新情報は、お知らせページをご確認ください。</p>
          <Link href="/news/" className={`${linkClass} mt-9`}>最新のお知らせを見る →</Link>
          <div className="mt-10"><Link href="/municipalities/" className="link-underline inline-block text-xs leading-7 text-ink/55 transition-colors duration-300 hover:text-moss">自治体での見守りへの活用はこちら →</Link></div>
        </div>
      </section>
    </>
  );
}
