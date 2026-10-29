import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";

export const metadata = pageMetadata("pets");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-[clamp(26px,3vw,40px)] font-light leading-[1.6]";
const eyebrowClass = "font-serif text-[11px] tracking-[0.24em] text-ink/60";
const steps = [
  { title: "QRコードをスキャン", body: "見つけた方が、首輪などのQRコードをスキャンします。", image: "/images/how-it-works-step-02.png", alt: "QRタグをスマートフォンで読み取る操作のイメージ" },
  { title: "電話をかける", body: "画面の「電話をかける」をタップします。", image: "/images/how-to-app-screen.png", alt: "「電話をかける」ボタンがあるつながるQRの案内画面" },
  { title: "飼い主へつながる", body: "プライバシー電話番号を通じて、登録先と通話できます。", image: "/images/how-it-works-step-03.png", alt: "電話番号を相手に公開せず通話するイメージ" },
];

export default function PetsPage() {
  return (
    <>
      <PageStructuredData page="pets" />
      <section className="overflow-hidden bg-ivory pb-10 pt-32 md:pb-14 md:pt-40" aria-labelledby="pets-heading">
        <div className="container-wide grid items-center gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-5">
          <div className="relative z-10">
            <p className={eyebrowClass}>PET CARE</p>
            <h1 id="pets-heading" className="mt-5 font-serif text-[clamp(30px,3.2vw,46px)] font-light leading-[1.6] tracking-tight">
              大切な家族が、<br />いつでもつながる<span className="inline-block"><span className="text-moss">安心</span>を。</span>
            </h1>
            <div className="body-jp mt-6 max-w-xl space-y-3 text-sm text-ink/75 md:text-base">
              <p>もしものときに、見つけてくださった方から飼い主へ。</p>
              <p>つながるQRは、お互いの電話番号を公開せず、声でつながる連絡手段です。</p>
            </div>
          </div>
          <figure className="-mx-6 md:-mx-8">
            <div className="relative aspect-[4/3] md:aspect-[6/5]" style={{ maskImage: "linear-gradient(to right, transparent, black 9%, black 90%, transparent), linear-gradient(to bottom, transparent, black 10%, black 88%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 9%, black 90%, transparent), linear-gradient(to bottom, transparent, black 10%, black 88%, transparent)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
              <Image src="/images/pets/hero.webp" alt="木漏れ日の中で、QRタグを付けた犬に寄り添う女性のイメージ" fill priority sizes="(min-width: 1280px) 660px, (min-width: 768px) 55vw, 100vw" className="object-cover object-[23%_50%]" />
            </div>
            <figcaption className="px-6 text-right text-[10px] leading-relaxed text-ink/55 md:px-8">※写真はイメージです。写真内のQRコードはご利用いただけません。</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-cream/40 py-14 md:py-20" aria-labelledby="concerns-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CONCERNS</p>
          <h2 id="concerns-heading" className={`${headingClass} mt-4`}>迷子札に、<span className="inline-block">電話番号を書きたくない。</span></h2>
          <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
            <p>大切なペットの迷子に備えたい。でも、自分の電話番号を首輪や迷子札に記載することには抵抗がある。</p>
            <p>見つけてもらえたとき、飼い主へ連絡できる手段を用意しておくことが大切です。</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="solution-heading">
        <div className="container-wide">
          <p className={eyebrowClass}>SOLUTION</p>
          <h2 id="solution-heading" className={`${headingClass} mt-4`}>QRコードから、<span className="inline-block">声でつながる。</span></h2>
          <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
            <p>首輪などに付けたQRコードを発見者がスキャンし、画面の『電話をかける』をタップ。</p>
            <p>お互いの電話番号を公開せず、飼い主などの登録先と直接通話できます。</p>
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
          <Link href="/service/" className={`${linkClass} mt-5`}>サービスの仕組みを見る →</Link>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20" aria-labelledby="preparation-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>PREPARATION</p>
          <h2 id="preparation-heading" className={`${headingClass} mt-4`}>マイクロチップとは、<span className="inline-block">役割が異なります。</span></h2>
          <div className="body-jp mt-6 max-w-3xl space-y-3 text-sm text-ink/75 md:text-base">
            <p>マイクロチップは、専用の読み取り機器を使った個体識別に役立ちます。</p>
            <p>つながるQRは、見つけてくださった方から飼い主へ直接連絡できる手段です。</p>
            <p>それぞれの役割に合わせて、組み合わせて備えることもできます。</p>
          </div>
          <p className="body-jp mt-6 text-xs text-ink/60">つながるQRは、法令上必要な所有者明示やマイクロチップに関する手続き・義務を代替するものではありません。</p>
          <p className="body-jp mt-3 text-xs text-ink/60">参考：<a href="https://www.env.go.jp/nature/dobutsu/aigo/shuyo/how.html" className="link-underline text-moss">環境省「迷子にさせないために」</a></p>
        </div>
      </section>

      <section className="py-16 text-center md:py-24" aria-labelledby="closing-heading">
        <div className="container-narrow">
          <p className={eyebrowClass}>CLOSING</p>
          <h2 id="closing-heading" className={`${headingClass} mt-4`}>小さなQRコードに、<span className="inline-block">大きな安心を。</span></h2>
          <p className="body-jp mx-auto mt-6 max-w-xl text-sm text-ink/75 md:text-base">一般向けの『つながるQR』は、正式リリースに向けて準備中です。</p>
          <Link href="/news/" className="mt-7 inline-flex items-center gap-4 bg-moss px-7 py-4 text-sm text-ivory transition-colors duration-300 hover:bg-deepmoss">最新のお知らせを見る<span aria-hidden="true">→</span></Link>
          <p className="mt-5"><Link href="/price/" className={linkClass}>料金について →</Link></p>
        </div>
      </section>
    </>
  );
}
