import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import UseCaseFaq from "@/components/UseCaseFaq";
import { belongingsQuestions, commonQuestions } from "@/content/useCaseFaqs";

export const metadata = pageMetadata("belongings");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]";
const eyebrowClass = "text-[10px] font-medium tracking-[0.3em] text-ink/60";
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
            落とし物・忘れ物対策に、<br />持ち主へつながるQRを。
          </h1>
          <div className="body-jp mt-10 max-w-2xl space-y-4 text-sm text-ink/70 md:text-base">
            <p>鍵や財布、バッグをよくなくす方へ。つながるQRは、持ち物を見つけた方から連絡を受けるための備えです。</p>
            <p>事前に取り付けたQRコードを発見者が読み取ると、登録先へ電話できます。持ち主も発見者も、自分の電話番号を相手に公開せず通話できます。</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="concerns-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-6`}>見つけてもらえても、連絡できないことがある。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {concerns.map(({ title, body }, i) => <article key={title} className="bg-cream p-7 md:p-8"><p className="text-xs tracking-[0.2em] text-ink/60">0{i + 1}</p><h3 className="mt-5 font-serif text-2xl font-light leading-relaxed">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}
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
          <h2 id="solution-heading" className={`${headingClass} mt-6`}>電話番号を書かずに、<br />持ち物へ連絡手段を。</h2>
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
          <div className="mt-12 grid gap-6 md:grid-cols-2">{belongings.map(({ title, body }) => <article key={title} className="border-t border-moss/30 py-7"><h3 className="font-serif text-2xl font-light text-ink">{title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{body}</p></article>)}</div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="preparation-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>PREPARATION</p>
          <h2 id="preparation-heading" className={`${headingClass} mt-6`}>位置を探す対策と、見つかった後の連絡対策。</h2>
          <p className="body-jp mt-7 text-sm text-ink/70 md:text-base">持ち物の紛失対策には、置き場所を決めるなどの予防、タグで位置を確認する方法、拾った方から連絡を受ける方法があります。つながるQRは、発見後の連絡を支援します。</p>
          <Link href="/column/lost-item-preparation/" className={`${linkClass} mt-8`}>位置確認と発見後の連絡、それぞれの役割を見る →</Link>
        </div>
      </section>

      <UseCaseFaq id="belongings-questions" title="落とし物対策について、よくあるご質問。" questions={[...belongingsQuestions, ...commonQuestions]} />

      <section className="py-24 text-center md:py-36" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-6`}>小さなQRコードに、大きな安心を。</h2>
          <p className="body-jp mx-auto mt-8 max-w-xl text-sm text-ink/70 md:text-base">「つながるQR」は現在、一般向けサービスの正式リリースに向けて準備中です。</p>
          <Link href="/news/" className={`${linkClass} mt-9`}>最新のお知らせを見る →</Link>
          <div className="mt-6"><Link href="/price/" className={linkClass}>紛失への備えの料金と利用条件を見る →</Link></div>
        </div>
      </section>
    </>
  );
}
