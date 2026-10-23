import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { ELDERLY_MISSING_PERSONS as statistics } from "@/content/statistics/elderlyMissingPersons";

export const metadata = pageMetadata("elderly");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]";
const eyebrowClass = "text-[10px] font-medium tracking-[0.3em] text-moss";
const concerns = [
  { title: "本人が説明できない", body: "ご自身の名前や連絡先を伝えられない場合がある。" },
  { title: "家族の連絡先がわからない", body: "発見した方が、誰に連絡すればよいかわからないことがある。" },
  { title: "連絡を待つ家族の不安", body: "どこにいるのか、無事なのか。連絡が取れるまで不安が続く。" },
];
const options = [
  { title: "GPS", body: "居場所を確認するための手段。" },
  { title: "地域の見守り", body: "地域の人や関係機関による発見・保護を支援する取り組み。" },
  { title: "つながるQR", body: "発見・保護された後、ご家族への連絡を支援する手段。" },
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
            <p>外出先で道に迷ったり、ご自身の名前や連絡先を伝えられなくなったり。</p>
            <p>そんな「もしも」に備えて、ご家族につながる連絡手段を考えてみませんか。</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="data-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>DATA</p>
          <h2 id="data-heading" className={`${headingClass} mt-6`}>毎年1万7,000人以上。<br />認知症に係る行方不明者の届出。</h2>
          <p className="body-jp mt-6 text-sm text-ink/70 md:text-base">認知症に係る行方不明者の届出は、全国で年間1万7,000件を超えています。</p>
          <figure className="mt-12 md:mt-16" aria-labelledby="chart-caption" aria-describedby="chart-notes">
            <figcaption id="chart-caption" className="text-sm leading-7 text-ink/70">認知症またはその疑いに係る行方不明者の届出状況</figcaption>
            <p className="mt-3 text-xs text-ink/55">単位：人（延べ人数）／棒の基点は0</p>
            <div className="relative mt-12">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-64 flex-col justify-between text-[10px] text-ink/45 md:h-80">
                {[chartMax, chartMax / 2, 0].map((tick) => <div key={tick} className="relative border-t border-ink/10"><span className="absolute -top-4 left-0">{tick.toLocaleString("ja-JP")}</span></div>)}
              </div>
              <ol className="relative grid grid-cols-5 gap-2 px-1 md:gap-6 md:px-5">
                {statistics.values.map(({ year, count }) => (
                  <li key={year} className="min-w-0 text-center">
                    <div className="flex h-64 flex-col justify-end md:h-80">
                      <div className="relative" style={{ height: `${count / chartMax * 100}%` }}>
                        <p className={`absolute inset-x-0 bottom-full mb-3 whitespace-nowrap text-[11px] tabular-nums sm:text-sm md:text-base ${year === latestYear ? "font-semibold text-moss" : "text-ink/70"}`}>
                          {count.toLocaleString("ja-JP")}<span className="sr-only">人</span>
                        </p>
                        <div aria-hidden="true" className={`mx-auto h-full w-full max-w-20 rounded-t-sm ${year === latestYear ? "bg-moss" : "bg-moss/45"}`} />
                      </div>
                    </div>
                    <p className={`mt-4 text-[11px] sm:text-sm ${year === latestYear ? "font-semibold text-moss" : "text-ink/65"}`}>{year}<span className="sr-only">年</span></p>
                  </li>
                ))}
              </ol>
            </div>
            <div id="chart-notes" className="body-jp mt-8 space-y-2 text-xs text-ink/60">
              <p>※届出が出された者の延べ人数であり、実人数ではありません。認知症またはその疑いを含み、65歳以上に限定した統計ではありません。</p>
              <p>出典：警察庁「<a href={statistics.sourceUrl} className="link-underline text-moss">{statistics.title}</a>」および過年度資料。<time dateTime={statistics.publishedAt}>{statistics.publishedLabel}</time>公表。</p>
              <p><a href={statistics.documentUrl} className="link-underline text-moss">原資料（PDF）を見る →</a></p>
            </div>
          </figure>
        </div>
      </section>

      <section className="pb-24 md:pb-32" aria-labelledby="concerns-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>FAMILY CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-6`}>発見されても、<br className="sm:hidden" />家族につながれないことがある。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {concerns.map(({ title, body }, i) => <article key={title} className="bg-cream p-7 md:p-8"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-5 font-serif text-2xl font-light leading-relaxed">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-28 text-center md:py-44" aria-labelledby="key-message">
        <h2 id="key-message" className="mx-auto max-w-5xl font-serif text-[clamp(28px,4.2vw,58px)] font-light leading-[1.8] tracking-tight">
          見つけてもらえた、その先に。<br /><span className="text-moss">ご家族へつながる</span>手段を。
        </h2>
      </section>

      <section className="py-24 md:py-36" aria-labelledby="solution-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>SOLUTION</p>
          <h2 id="solution-heading" className={`${headingClass} mt-6`}>発見してくれた方と、<br />ご家族を直接つなぐ。</h2>
          <div className="body-jp mt-8 max-w-2xl space-y-5 text-sm text-ink/70 md:text-base"><p>身につけたQRコードを発見者がスキャンすることで、お互いの電話番号を公開せず、ご家族などの登録先へ電話できます。</p><p>小さなQRコードが、発見された後の連絡手段になります。</p></div>
          <Link href="/service/" className={`${linkClass} mt-9`}>サービスの仕組みを見る →</Link>
          <p className="body-jp mt-7 text-xs text-ink/55">※GPSによる位置追跡や自動発見の機能はありません。</p>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="options-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>OTHER OPTIONS</p>
          <h2 id="options-heading" className={`${headingClass} mt-6`}>見守りの備えは、<br className="sm:hidden" />ひとつだけではありません。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">{options.map(({ title, body }) => <article key={title} className="border-t border-moss/30 py-7"><h3 className="font-serif text-2xl font-light text-moss">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}</div>
          <p className="body-jp mt-8 text-sm text-ink/65">それぞれ役割が異なるため、組み合わせて備えることもできます。</p>
        </div>
      </section>

      <section className="py-24 text-center md:py-36" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-6`}>小さなQRコードに、大きな安心を。</h2>
          <p className="body-jp mx-auto mt-8 max-w-xl text-sm text-ink/70 md:text-base">「つながるQR」は現在、一般向けサービスの正式リリースに向けて準備中です。</p>
          <Link href="/news/" className={`${linkClass} mt-9`}>最新のお知らせを見る →</Link>
          <div className="mt-10"><Link href="/municipalities/" className="link-underline inline-block text-xs leading-7 text-ink/55 transition-colors duration-300 hover:text-moss">自治体での見守りへの活用はこちら →</Link></div>
        </div>
      </section>
    </>
  );
}
