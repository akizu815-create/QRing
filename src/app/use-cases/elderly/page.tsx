import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./StatisticsChart.module.css";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { ELDERLY_MISSING_PERSONS as statistics } from "@/content/statistics/elderlyMissingPersons";

export const metadata = pageMetadata("elderly");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3vw,40px)] font-light leading-[1.6]";
const eyebrowClass = "font-serif text-[11px] tracking-[0.24em] text-ink/60";
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

const steps = [
  { title: "QRコードをスキャン", body: "見つけた方が、身につけたQRコードをスキャンします。", image: "/images/how-it-works-step-02.png", alt: "身につけたQRタグをスマートフォンでスキャンするイメージ" },
  { title: "電話をかける", body: "画面の「電話をかける」をタップします。", image: "/images/how-to-app-screen.png", alt: "「電話をかける」ボタンがあるつながるQRの案内画面" },
  { title: "ご家族へつながる", body: "プライバシー電話番号を通じて、登録先と通話できます。", image: "/images/how-it-works-step-03.png", alt: "プライバシー電話番号を通じて登録先と通話するイメージ" },
];

export default function ElderlyPage() {
  const latestYear = statistics.values[statistics.values.length - 1].year;
  const chartMax = Math.ceil(Math.max(...statistics.values.map(({ count }) => count)) / 5000) * 5000;

  return (
    <>
      <PageStructuredData page="elderly" />
      <section className="overflow-hidden bg-ivory pb-10 pt-32 md:pb-14 md:pt-40" aria-labelledby="elderly-heading">
        <div className="container-wide grid items-center gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-5">
          <div className="relative z-10">
            <p className={eyebrowClass}>FAMILY CARE</p>
            <h1 id="elderly-heading" className="mt-5 font-serif text-[clamp(30px,3.2vw,46px)] font-light leading-[1.6] tracking-tight">
              <span className="text-moss">もしも</span>、家族が<br /><span className="inline-block">帰ってこなかったら。</span>
            </h1>
            <div className="body-jp mt-6 max-w-xl space-y-3 text-sm text-ink/75 md:text-base">
              <p>いつもの外出が、思いがけない出来事につながることもあります。</p>
              <p>そんな『もしも』に備えて、見つけてくださった方からご家族へ連絡できる手段を用意しておきませんか。</p>
            </div>
          </div>
          <div className="relative -mx-6 aspect-[5/4] md:-mx-8 md:aspect-[6/5]" style={{ maskImage: "linear-gradient(to right, transparent, black 9%, black 91%, transparent), linear-gradient(to bottom, transparent, black 8%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 9%, black 91%, transparent), linear-gradient(to bottom, transparent, black 8%, black 90%, transparent)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
            <Image src="/images/municipalities-hero.png" alt="公園で寄り添って歩き、笑顔を交わす高齢女性とご家族" fill priority sizes="(min-width: 1280px) 660px, (min-width: 768px) 55vw, 100vw" className="object-cover object-[83%_50%]" />
          </div>
        </div>
      </section>

      <section className="bg-cream/40 py-14 md:py-20" aria-labelledby="concerns-heading">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className={eyebrowClass}>CONCERNS &amp; SOLUTION</p>
            <h2 id="concerns-heading" className={`${headingClass} mt-4`}>見つけてもらえても、<span className="inline-block">家族につながれないことがあります。</span></h2>
            <div className="body-jp mt-6 space-y-3 text-sm text-ink/75 md:text-base">
              <p>認知症のある方が外出先で保護されても、誰に連絡すればよいかわからないことがあります。</p>
              <p>だからこそ、見つけてくださった方がすぐに行動できる、わかりやすい案内があることも大切です。</p>
            </div>
            <div className="mt-7 border-l border-moss/30 pl-5">
              <p className="text-xs font-medium tracking-[0.08em] text-ink/60">シールの案内文イメージ（正式な商品文言ではありません）</p>
              <ul className="body-jp mt-3 space-y-1 text-sm text-ink/80"><li>迷子になっている可能性があります。</li><li>見守りが必要な方です。</li><li>こちらにご連絡ください。</li></ul>
            </div>
          </div>
          <div className="mt-12 md:mt-14">
            <h3 id="solution-heading" className="font-serif text-[clamp(25px,2.6vw,36px)] font-light leading-[1.6]">見つけてもらえた、その先に。<br /><span className="text-moss">ご家族</span>へつながる手段を。</h3>
            <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
              <p>身につけたQRコードを発見者がスキャンし、『電話をかける』をタップ。</p>
              <p>お互いの電話番号を公開することなく、ご家族などの登録先と直接通話できます。</p>
            </div>
            <ol id="family-contact-flow" className="mt-9 grid scroll-mt-28 gap-8 md:grid-cols-3 md:gap-10">
              {steps.map((step, index) => (
                <li key={step.title} className="relative min-w-0">
                  <div className="relative mx-auto h-40 w-full max-w-sm md:h-44">
                    <Image src={step.image} alt={step.alt} fill sizes="(min-width: 1280px) 350px, (min-width: 768px) 28vw, 85vw" className="object-contain" />
                  </div>
                  {index < 2 && <span className="absolute -right-7 top-16 hidden text-2xl font-light text-moss/60 md:block" aria-hidden="true">›</span>}
                  <h4 className="mt-4 font-serif text-xl font-light leading-relaxed"><span className="mr-3 text-sm text-moss">0{index + 1}</span>{step.title}</h4>
                  <p className="body-jp mt-3 text-sm text-ink/75">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[11px] leading-relaxed text-ink/55">※図解・画面は操作のイメージです。図解内のQRコードはご利用いただけません。</p>
            <p className="body-jp mt-4 text-sm text-ink/75">QRコードを身につけるご本人のスマートフォン操作は不要です。専用アプリや、発見者による電話番号の手入力も必要ありません。</p>
            <Link href="/service/" className={`${linkClass} mt-5`}>サービスの仕組みを見る →</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="data-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>DATA</p>
          <h2 id="data-heading" className={`${headingClass} mt-4`}>認知症による行方不明は、<span className="inline-block">身近な課題です。</span></h2>
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
              <p>出典：<a href={statistics.documentUrl} className="link-underline text-moss">警察庁『{statistics.title}』</a>および過年度資料をもとに株式会社QRing作成</p>
            </div>
          </figure>
          <div className="mt-14 border-t border-ink/10 pt-10 md:mt-16 md:pt-12" aria-labelledby="projection-heading">
            <h3 id="projection-heading" className="font-serif text-2xl font-light leading-relaxed md:text-3xl">これからの見守りに、さらなる備えを。</h3>
            <div className="body-jp mt-6 space-y-3 text-sm text-ink/70"><p>認知症のある65歳以上の人の数は、今後さらに増加すると見込まれています。</p></div>
            <dl className="mt-8 grid grid-cols-2 divide-x divide-ink/10 border-y border-ink/10 py-7 md:py-9">
              {projections.map((item) => <div key={item.year} className="min-w-0 px-3 text-center md:px-8"><dt className="text-xs leading-6 text-ink/60 md:text-sm">{item.year}<span className="ml-2 inline-block">{item.label}</span></dt><dd className="mt-4 whitespace-nowrap font-sans text-[clamp(28px,6vw,48px)] font-light tabular-nums"><span className="text-sm text-ink/65">約</span>{item.value}<span className="ml-1 text-sm text-ink/65 md:text-base">万人</span></dd></div>)}
            </dl>
            <div className="body-jp mt-5 space-y-1 text-xs text-ink/55"><p>※認知症のある65歳以上の人の数の推計であり、行方不明者届の人数を予測したものではありません。</p><p>※性年齢階級別の有病率が一定と仮定した推計です。</p><p>※出典：<a href="https://www8.cao.go.jp/kourei/whitepaper/w-2026/zenbun/pdf/1s2s_02.pdf" className="link-underline text-moss">内閣府「令和8年版高齢社会白書」</a></p></div>
          </div>
        </div>
      </section>

      <section className="bg-cream/40 py-16 md:py-24" aria-labelledby="options-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>COMPARISON</p>
          <h2 id="options-heading" className={`${headingClass} mt-6`}>見守りの方法は、<span className="inline-block">一つではありません。</span></h2>
          <p className="body-jp mt-6 text-sm text-ink/70 md:text-base">見守りサービスには、それぞれ役割があります。<br />つながるQRは、発見後にご家族へつながる手段として活用できます。</p>
          <p id="comparison-help" className="mt-7 text-xs text-ink/55 md:hidden">表は横にスクロールしてご覧いただけます。</p>
          <div className="mt-4 overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss md:mt-9" role="region" aria-label="見守り方法の比較表" aria-describedby="comparison-help" tabIndex={0}>
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm leading-7">
              <caption className="sr-only">見守り方法の基本機能と発見後の連絡方法の比較</caption>
              <colgroup><col className="w-[28%]" /><col className="w-[24%] bg-ivory" /><col className="w-[22%]" /><col className="w-[26%]" /></colgroup>
              <thead><tr className="border-y border-ink/20"><th scope="col" className="p-5 font-medium">比較項目</th><th scope="col" className="p-5 font-medium">つながるQR</th><th scope="col" className="p-5 font-medium">GPS見守り</th><th scope="col" className="p-5 font-medium">QRコード伝言板サービス</th></tr></thead>
              <tbody>{comparison.map(([label, qring, gps, board]) => <tr key={label} className="border-b border-ink/10"><th scope="row" className="p-5 font-medium text-ink/80">{label}</th><td className="p-5 text-ink/75">{qring}</td><td className="p-5 text-ink/75">{gps}</td><td className="p-5 text-ink/75">{board}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="body-jp mt-6 space-y-1 text-xs text-ink/55"><p>※一般的なGPS見守りサービスおよび各サービスの基本的な機能をもとに整理しています。</p><p>※サービスごとに機能や運用方法は異なります。</p><p>※それぞれ役割が異なるため、併用も考えられます。</p></div>
          <p className="body-jp mt-3 text-xs text-ink/60">つながるQRには、位置追跡や転倒の自動検知を行う機能はありません。</p>
          <Link href="/column/elderly-monitoring/" className={`${linkClass} mt-5`}>自宅・外出時の見守り方法を比較する →</Link>
        </div>
      </section>

      <section className="py-16 text-center md:py-24" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-4`}>小さなQRコードに、<span className="inline-block">大きな安心を。</span></h2>
          <p className="body-jp mx-auto mt-6 max-w-xl text-sm text-ink/75 md:text-base">一般向けの『つながるQR』は、正式リリースに向けて準備中です。</p>
          <Link href="/news/" className="mt-7 inline-flex items-center gap-4 bg-moss px-7 py-4 text-sm text-ivory transition-colors duration-300 hover:bg-deepmoss">最新のお知らせを見る<span aria-hidden="true">→</span></Link>
          <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2">
            <Link href="/price/" className={linkClass}>料金について →</Link>
            <Link id="elderly-questions" href="/faq/" className={linkClass}>よくあるご質問 →</Link>
          </div>
          <p className="mt-5"><Link href="/municipalities/" className="link-underline inline-block text-xs leading-7 text-ink/60 transition-colors duration-300 hover:text-moss">自治体での見守りへの活用はこちら →</Link></p>
        </div>
      </section>
    </>
  );
}
