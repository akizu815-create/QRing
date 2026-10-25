import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";

const COMPANY = [
  { k: "会社名", v: "株式会社QRing" },
  { k: "代表者", v: "代表取締役 木津 愛子" },
  { k: "設立", v: "2025年10月31日" },
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2丁目37番5号 RENEX Otsuka 10階" },
  { k: "資本金", v: "1,000万円" },
  { k: "事業内容", v: "「つながるQR」の開発・提供 / 関連サービスの企画運営" },
  { k: "主要取引銀行", v: "三井住友銀行" },
];

const scenes = [
  { image: "/images/use-case-family.png", alt: "緑道を歩きながら会話する高齢女性と家族", text: "道で困っている高齢者を見かけたとき。" },
  { image: "/images/use-case-pet.png", alt: "QRタグを身につけた犬と見つめ合う女性", text: "迷子のペットを見つけたとき。" },
  { image: "/images/use-case-belongings.png", alt: "バッグに取り付けられたQRタグ", text: "誰かの落とし物を拾ったとき。" },
];
const eyebrow = "text-[10px] font-medium tracking-[0.28em] text-moss md:text-[11px]";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <PageStructuredData page="about" />
      <section id="vision" className="scroll-mt-24 bg-ivory pb-20 pt-36 md:pb-32 md:pt-48" aria-labelledby="philosophy-heading">
        <div className="container-wide">
          <p className={eyebrow}>PHILOSOPHY<span className="ml-5 tracking-[0.12em] text-ink/55">企業理念</span></p>
          <h1 id="philosophy-heading" className="mt-9 font-serif text-[clamp(36px,5.2vw,74px)] font-light leading-[1.55] tracking-tight">
            人の善意を、<br className="sm:hidden" /><span className="text-moss">行動につなぐ。</span>
          </h1>
          <div className="mt-12 grid items-start gap-12 md:mt-16 md:grid-cols-12 md:gap-10 lg:gap-20">
            <div className="body-jp space-y-6 text-sm text-ink/75 md:col-span-7 md:text-base lg:col-span-6">
              <p>誰かを助けたいと思う気持ちは、私たちの身近なところにあります。</p>
              <p>でも、その気持ちがあっても、連絡する方法がわからなかったり、不安を感じたりして、行動に移せないことがあります。</p>
              <p>私たちQRingは、そんな善意と行動の間にある小さな障壁を、技術の力で取り除きたいと考えています。</p>
              <p>人の優しさを変えるのではなく、その優しさが自然に届くための仕組みをつくる。</p>
              <p>それが、私たちの目指すことです。</p>
            </div>
            <figure className="md:col-span-5 lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden md:mt-2 lg:aspect-[6/5]">
                <Image src="/images/about-vision-city-walk.png" alt="木漏れ日の都会の歩道を行き交う人々" fill sizes="(min-width: 1280px) 560px, (min-width: 768px) 42vw, 100vw" className="object-cover object-center" priority />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-24 bg-cream py-20 md:py-32" aria-labelledby="approach-heading">
        <div className="container-wide">
          <p className={eyebrow}>OUR APPROACH<span className="ml-5 tracking-[0.12em] text-ink/55">私たちの取り組み</span></p>
          <h2 id="approach-heading" className="mt-8 font-serif text-[clamp(30px,4vw,54px)] font-light leading-[1.6] tracking-tight">小さなQRコードで、<br className="sm:hidden" /><span className="text-moss">大きな安心を。</span></h2>
          <div className="mt-12 grid gap-9 md:mt-16 md:grid-cols-3 md:gap-6 lg:gap-10">
            {scenes.map((scene) => (
              <figure key={scene.image} className="min-w-0">
                <div className="relative aspect-[3/2] overflow-hidden"><Image src={scene.image} alt={scene.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" /></div>
                <figcaption className="body-jp mt-5 text-sm text-ink/75">{scene.text}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 grid gap-8 border-t border-moss/20 pt-10 md:mt-16 md:grid-cols-12 md:gap-10 md:pt-12">
            <p className="font-serif text-xl font-light leading-[1.9] md:col-span-5 md:text-2xl">助けたいと思っても、<br />連絡する方法がわからないことがあります。</p>
            <div className="body-jp space-y-6 text-sm text-ink/75 md:col-span-7 md:text-base">
              <p>そんなとき、小さなQRコードが、人と人をつなぐきっかけになれたら。</p>
              <p>私たちは、その思いから「つながるQR」の開発を進めています。</p>
              <p>お互いの電話番号を公開せずに通話できる仕組みを通じて、助けたいという気持ちを、実際の行動につなげていきたいと考えています。</p>
              <div className="pt-3"><Link href="/service/" className="link-underline inline-block text-sm leading-7 text-moss transition-colors duration-300 hover:text-ink">つながるQRについて詳しく見る →</Link></div>
              <p className="text-xs text-ink/55">「つながるQR」は正式リリースに向けて準備中です。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="message" className="scroll-mt-24 py-20 md:py-24" aria-labelledby="message-heading">
        <div className="container-wide grid gap-9 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4"><h2 id="message-heading" className="text-sm font-medium leading-8 tracking-[0.08em]"><span className="text-moss">MESSAGE</span><span className="mx-3 text-ink/30">｜</span>代表挨拶</h2></div>
          <div className="body-jp space-y-6 text-sm text-ink/75 md:col-span-8 md:max-w-2xl md:text-base">
            <p>誰かの力になりたいと思っていても、不安やためらいから、一歩を踏み出せないことがあります。</p>
            <p>技術だけで、人を助けることはできません。人を動かすのは、一人ひとりの中にある優しさや思いやりです。</p>
            <p>だからこそ、その気持ちを信じ、安心して行動に移せる仕組みをつくっていきたいと考えています。</p>
            <p>誰かを思う気持ちが、誰かの支えになる。そのつながりを、これからも大切に育ててまいります。</p>
            <div className="pt-3 text-right text-sm leading-loose"><p>株式会社QRing</p><p>代表取締役 木津 愛子</p></div>
          </div>
        </div>
      </section>

      <section id="company" className="scroll-mt-24 bg-cream py-20 md:py-28" aria-labelledby="company-heading">
        <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4"><p className={eyebrow}>COMPANY</p><h2 id="company-heading" className="mt-6 font-serif text-3xl font-light leading-relaxed md:text-4xl">会社概要</h2></div>
          <dl className="min-w-0 border-b border-ink/10 md:col-span-8">
            {COMPANY.map((row) => <div key={row.k} className="grid gap-3 border-t border-ink/10 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="text-xs leading-7 tracking-[0.12em] text-moss">{row.k}</dt><dd className="break-words text-sm leading-7 text-ink/80 md:text-base">{row.v}</dd></div>)}
          </dl>
        </div>
      </section>
    </>
  );
}
