import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";

export const metadata = pageMetadata("belongings");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]";
const eyebrowClass = "text-[10px] font-medium tracking-[0.3em] text-moss";
const concerns = [
  { title: "持ち主の連絡先がわからない", body: "落とし物を見つけても、誰に連絡すればよいかわからない。" },
  { title: "電話番号を公開したくない", body: "持ち物に名前や電話番号を書くことに抵抗がある。" },
  { title: "拾った方も連絡をためらう", body: "持ち主に知らせたくても、自分の電話番号を伝えることに不安がある。" },
];
const belongings = [
  { title: "バッグ・リュック", body: "外出先での置き忘れや紛失への備えに" },
  { title: "鍵・キーケース", body: "小さく、落とした場所がわかりにくい持ち物にも" },
  { title: "財布・小物", body: "持ち主への連絡手段を用意したいものに" },
  { title: "スーツケース・旅行用品", body: "宿泊先や移動中の忘れ物への備えに" },
];

export default function BelongingsPage() {
  return (
    <>
      <PageStructuredData page="belongings" />
      <section className="bg-cream pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="container-narrow">
          <p className={eyebrowClass}>LOST &amp; FOUND</p>
          <h1 className="mt-9 font-serif text-[clamp(34px,5vw,64px)] font-light leading-[1.5] tracking-tight">
            大切なものを、なくしてしまったら。
          </h1>
          <div className="body-jp mt-10 max-w-2xl space-y-4 text-sm text-ink/70 md:text-base">
            <p>バッグや鍵、財布など、毎日使う大切な持ち物。</p>
            <p>もしも置き忘れてしまったとき、見つけてくれた方から連絡を受けられる手段を用意しておきませんか。</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="concerns-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-6`}>見つけてもらえても、連絡できないことがある。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {concerns.map(({ title, body }, i) => <article key={title} className="bg-cream p-7 md:p-8"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-5 font-serif text-2xl font-light leading-relaxed">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-28 text-center md:py-44" aria-labelledby="key-message">
        <h2 id="key-message" className="mx-auto max-w-5xl font-serif text-[clamp(28px,4.2vw,58px)] font-light leading-[1.8] tracking-tight">
          見つけてくれた、その気持ちを。<br /><span className="text-moss">持ち主へつなぐ。</span>
        </h2>
      </section>

      <section className="py-24 md:py-36" aria-labelledby="solution-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>SOLUTION</p>
          <h2 id="solution-heading" className={`${headingClass} mt-6`}>電話番号を公開せず、<br />持ち主へ直接連絡。</h2>
          <div className="body-jp mt-8 max-w-2xl space-y-5 text-sm text-ink/70 md:text-base">
            <p>バッグや鍵などに取り付けたQRコードを発見者がスキャンすると、プライバシー電話番号を通じて登録先へ電話できます。</p>
            <p>持ち主も発見者も、お互いの電話番号を公開する必要はありません。</p>
          </div>
          <p className="body-jp mt-6 text-sm text-ink/65">持ち物を見つけてもらった、その先の連絡を支援します。</p>
          <Link href="/service/" className={`${linkClass} mt-9`}>サービスの仕組みを見る →</Link>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="use-cases-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>USE CASES</p>
          <h2 id="use-cases-heading" className={`${headingClass} mt-6`}>身近な持ち物に、もしもの備えを。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">{belongings.map(({ title, body }) => <article key={title} className="border-t border-moss/30 py-7"><h3 className="font-serif text-2xl font-light text-moss">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}</div>
        </div>
      </section>

      <section className="py-24 text-center md:py-36" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-6`}>小さなQRコードに、大きな安心を。</h2>
          <p className="body-jp mx-auto mt-8 max-w-xl text-sm text-ink/70 md:text-base">「つながるQR」は現在、一般向けサービスの正式リリースに向けて準備中です。</p>
          <Link href="/news/" className={`${linkClass} mt-9`}>最新のお知らせを見る →</Link>
        </div>
      </section>
    </>
  );
}
