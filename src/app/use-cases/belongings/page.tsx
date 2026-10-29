import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";

export const metadata = pageMetadata("belongings");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3vw,40px)] font-light leading-[1.6]";
const eyebrowClass = "font-serif text-[11px] tracking-[0.24em] text-ink/60";
const photoMask = {
  maskImage: "linear-gradient(to right, transparent, black 9%, black 91%, transparent), linear-gradient(to bottom, transparent, black 10%, black 89%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 9%, black 91%, transparent), linear-gradient(to bottom, transparent, black 10%, black 89%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};
const steps = [
  { title: "QRコードをスキャン", body: "見つけた方が、持ち物のQRコードをスキャンします。", image: "/images/how-it-works-step-02.png", alt: "QRタグをスマートフォンで読み取る操作のイメージ" },
  { title: "電話をかける", body: "画面の「電話をかける」をタップします。", image: "/images/how-to-app-screen.png", alt: "「電話をかける」ボタンがあるつながるQRの案内画面" },
  { title: "持ち主へつながる", body: "お互いの電話番号を公開せず、登録先と通話できます。", image: "/images/how-it-works-step-03.png", alt: "電話番号を相手に公開せず通話するイメージ" },
];
const belongings = [
  { title: "鍵・キーケース", body: "日常的に持ち歩くものに、もしもの連絡手段を。", image: "keys", alt: "鍵とQRタグを付けたキーケースの利用イメージ" },
  { title: "財布・小物", body: "落としたときに、見つけた方から持ち主へつながる備えに。", image: "wallet", alt: "QRタグを付けた財布の利用イメージ" },
  { title: "スーツケース・旅行用品", body: "移動や宿泊の際の、紛失・取り違え対策に。", image: "suitcase", alt: "QRタグを付けたスーツケースの利用イメージ" },
];

export default function BelongingsPage() {
  return (
    <>
      <PageStructuredData page="belongings" />
      <section className="overflow-hidden bg-ivory pb-10 pt-32 md:pb-14 md:pt-40" aria-labelledby="belongings-heading">
        <div className="container-wide grid items-center gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-5">
          <div className="relative z-10">
            <p className={eyebrowClass}>LOST &amp; FOUND</p>
            <h1 id="belongings-heading" className="mt-5 font-serif text-[clamp(30px,3.2vw,46px)] font-light leading-[1.6] tracking-tight">
              大切な持ち物に、<br /><span className="text-moss">もしもの備え</span>を。
            </h1>
            <div className="body-jp mt-6 max-w-xl space-y-3 text-sm text-ink/75 md:text-base">
              <p>バッグや鍵、財布、旅行用品などを見つけてくださった方から、持ち主へ。</p>
              <p>つながるQRは、お互いの電話番号を公開せず、声でつながる連絡手段です。</p>
            </div>
          </div>
          <div className="relative -mx-6 aspect-[5/4] md:-mx-8 md:aspect-[6/5]" style={photoMask}>
            <Image src="/images/belongings/keys.webp" alt="自然光の中に置かれた、鍵とQRタグ付きキーケースの利用イメージ" fill priority sizes="(min-width: 1280px) 660px, (min-width: 768px) 55vw, 100vw" className="object-cover object-[61%_50%]" />
          </div>
        </div>
      </section>

      <section className="bg-cream/40 py-14 md:py-20" aria-labelledby="concerns-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-4`}>持ち物に、<span className="inline-block">電話番号を書きたくない。</span></h2>
          <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
            <p>落とし物や忘れ物に備えたい。でも、名前や電話番号をそのまま記載することには抵抗がある。</p>
            <p>そんなときにも、持ち主へつながる連絡手段を用意できます。</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="solution-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>SOLUTION</p>
          <h2 id="solution-heading" className={`${headingClass} mt-4`}>見つけてくださった方と、<span className="inline-block">声でつながる。</span></h2>
          <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
            <p>持ち物に付けたQRコードを発見者がスキャンし、「電話をかける」をタップ。</p>
            <p>プライバシー電話番号を通じて、持ち主と直接通話できます。</p>
          </div>
          <ol className="mt-10 grid gap-9 md:grid-cols-3 md:gap-10">
            {steps.map((step, index) => (
              <li key={step.title} className="relative min-w-0">
                <div className="relative mx-auto h-44 w-full max-w-sm md:h-48">
                  <Image src={step.image} alt={step.alt} fill sizes="(min-width: 1280px) 350px, (min-width: 768px) 28vw, 85vw" className="object-contain" />
                </div>
                {index < 2 && <span className="absolute -right-7 top-20 hidden text-2xl font-light text-moss/60 md:block" aria-hidden="true">›</span>}
                <h3 className="mt-5 font-serif text-xl font-light leading-relaxed"><span className="mr-3 text-sm text-moss">0{index + 1}</span>{step.title}</h3>
                <p className="body-jp mt-3 text-sm text-ink/75">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-7 text-[11px] leading-relaxed text-ink/55">※図解・画面は操作のイメージです。図解内のQRコードはご利用いただけません。</p>
          <p className="body-jp mt-5 text-sm text-ink/75">専用アプリや、発見者による電話番号の手入力は不要です。</p>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            <Link href="/service/" className={linkClass}>サービスの仕組みを見る →</Link>
            <Link href="/faq/" className={linkClass}>よくあるご質問 →</Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-cream/40 py-14 md:py-20" aria-labelledby="use-cases-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>USE CASES</p>
          <h2 id="use-cases-heading" className={`${headingClass} mt-4`}>さまざまな持ち物に。</h2>
          <p className="body-jp mt-6 text-sm text-ink/75 md:text-base">用途に合わせて、さまざまな持ち物に取り入れることができます。</p>
          <div className="mt-9 grid gap-9 md:grid-cols-3 md:gap-8">
            {belongings.map((item) => (
              <article key={item.title} className="min-w-0">
                <div className="relative -mx-3 aspect-[5/3]" style={photoMask}>
                  <Image src={`/images/belongings/${item.image}.webp`} alt={item.alt} fill sizes="(min-width: 1280px) 380px, (min-width: 768px) 30vw, 94vw" className="object-cover" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-light leading-relaxed">{item.title}</h3>
                <p className="body-jp mt-3 text-sm text-ink/75">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-9 md:flex md:items-baseline md:gap-6">
            <h3 className="font-serif text-xl font-light leading-relaxed">バッグ・持ち歩き用品</h3>
            <p className="body-jp mt-2 text-sm text-ink/75 md:mt-0">外出先での忘れ物や落とし物への備えに。</p>
          </div>
          <p className="body-jp mt-6 text-xs text-ink/60">※写真は利用イメージです。販売中の商品を示すものではなく、写真内のQRコードはご利用いただけません。</p>
          <p className="body-jp mt-3 text-xs text-ink/60">事前にQRコードを取り付け、発見後の連絡に備える仕組みです。位置を追跡する機能はなく、返還を保証するものではありません。通話機能は日本国内でのみご利用いただけます。</p>
          <Link href="/column/lost-item-preparation/" className={`${linkClass} mt-5`}>紛失への備えと、発見後の連絡について →</Link>
        </div>
      </section>

      <section className="py-16 text-center md:py-24" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-4`}>小さなQRコードに、<span className="inline-block">大きな安心を。</span></h2>
          <p className="body-jp mx-auto mt-6 max-w-xl text-sm text-ink/75 md:text-base">一般向けの「つながるQR」は、正式リリースに向けて準備中です。</p>
          <Link href="/news/" className="mt-7 inline-flex items-center gap-4 bg-moss px-7 py-4 text-sm text-ivory transition-colors duration-300 hover:bg-deepmoss">最新のお知らせを見る<span aria-hidden="true">→</span></Link>
          <p className="mt-5"><Link href="/price/" className={linkClass}>料金を見る →</Link></p>
        </div>
      </section>
    </>
  );
}
