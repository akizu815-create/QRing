import Image from "next/image";
import PageStructuredData from "@/components/PageStructuredData";
import { pageMetadata } from "@/lib/seo";

const CONTACT_URL = "https://axb.qring.jp/contact";
const label = "font-serif text-[11px] tracking-[0.24em] text-moss";
const sectionHeading = "mt-4 font-serif text-[clamp(25px,2.7vw,36px)] font-light leading-[1.6]";

const PRODUCTS = [
  { no: "01", title: "バッグ・革小物", description: "紛失時に、発見した方から持ち主へ連絡できる商品に。", image: "bag", alt: "QRタグを付けたバッグの協業商品イメージ" },
  { no: "02", title: "キーホルダー・ネームタグ", description: "日常的に持ち歩くものに、もしもの連絡手段を。", image: "keys", alt: "鍵とQR付きキーホルダーの協業商品イメージ" },
  { no: "03", title: "ペット用品", description: "首輪や迷子札などに、飼い主へつながる仕組みを。", image: "pet", alt: "QRタグを取り付けた首輪の協業商品イメージ" },
  { no: "04", title: "衣類・生活用品", description: "アイロン接着式QRシールなどで、見守りや紛失対策に役立つ商品づくりに。", image: "clothing", alt: "白い衣類の襟裏にQRシールを直接貼り付けた協業商品イメージ" },
] as const;

const PLANS = [
  { en: "COLLABORATION PLAN", title: "コラボプラン", description: "既存の「つながるQR」の機能をそのまま活用し、商品形態やロゴ、カラー、デザインなどを変更できるプランです。", note: "サービスの基本仕様は変更しません。" },
  { en: "CUSTOM PLAN", title: "カスタムプラン", description: "企業の用途やご要望に合わせ、サービスの仕組みや機能を個別に設計するプランです。", note: "具体的な対応内容は、ご相談のうえ検討します。" },
] as const;

function ContactButton({ children }: { children: React.ReactNode }) {
  return (
    <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center justify-center gap-3 bg-moss px-7 py-4 text-sm leading-relaxed tracking-[0.08em] text-ivory transition-colors duration-500 hover:bg-deepmoss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss">
      {children}<span aria-hidden="true">→</span>
    </a>
  );
}

export const metadata = pageMetadata("collaboration");

export default function CollaborationPage() {
  return (
    <>
      <PageStructuredData page="collaboration" />

      <section className="bg-ivory pb-14 pt-36 md:pb-20 md:pt-44" aria-labelledby="collaboration-heading">
        <div className="container-wide grid items-center gap-9 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-12">
          <div>
            <p className={label}>COLLABORATION</p>
            <h1 id="collaboration-heading" className="mt-5 font-serif text-[clamp(26px,3vw,40px)] font-light leading-[1.65] tracking-tight">
              いつもの商品に、<br />新しい<span className="text-moss">安心</span>という価値を。
            </h1>
            <div className="body-jp mt-5 space-y-3 text-sm text-ink/75">
              <p>バッグやキーホルダー、ペット用品などに、電話番号を公開せず声でつながる仕組みを。</p>
              <p>貴社の商品やブランドと「つながるQR」を組み合わせた、新しい商品づくりをご提案します。</p>
            </div>
            <div className="mt-7"><ContactButton>コラボについて相談する</ContactButton></div>
          </div>
          <div className="relative aspect-[9/4] w-full overflow-hidden">
            <Image src="/images/collaboration/hero.webp" alt="QRタグを付けたバッグとキーホルダーの協業商品イメージ" fill priority sizes="(min-width: 1280px) 590px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20" aria-labelledby="product-ideas-heading">
        <div className="container-wide">
          <p className={label}>PRODUCT IDEAS</p>
          <h2 id="product-ideas-heading" className={sectionHeading}>さまざまな商品に、つながる仕組みを。</h2>
          <p className="body-jp mt-4 text-sm text-ink/75">商品の用途やデザインに合わせて、つながるQRを取り入れることができます。</p>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <article key={product.no} className="min-w-0">
                <div className="relative aspect-[9/4] overflow-hidden bg-cream">
                  <Image src={`/images/collaboration/${product.image}.webp`} alt={product.alt} fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-5 text-[10px] tracking-[0.2em] text-ink/55">{product.no}</p>
                <h3 className="mt-2 font-serif text-lg font-light leading-relaxed">{product.title}</h3>
                <p className="body-jp mt-3 text-sm text-ink/75">{product.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-xs leading-relaxed text-ink/55">※写真は協業商品の提案例です。販売中の商品や導入実績を示すものではなく、写真内のQRコードはご利用いただけません。</p>
        </div>
      </section>

      <section className="bg-ivory py-14 md:py-20" aria-labelledby="partnership-plans-heading">
        <div className="container-wide">
          <p className={label}>PARTNERSHIP PLANS</p>
          <h2 id="partnership-plans-heading" className={sectionHeading}>ご要望に合わせた、2つの協業プラン。</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <article key={plan.en} className="flex h-full flex-col border border-ink/10 bg-white/40 p-7 md:p-9">
                <p className="font-serif text-[10px] tracking-[0.16em] text-moss">{plan.en}</p>
                <h3 className="mt-3 font-serif text-2xl font-light">{plan.title}</h3>
                <p className="body-jp mb-5 mt-5 text-sm text-ink/75">{plan.description}</p>
                <p className="mt-auto text-xs leading-relaxed text-ink/60">{plan.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-ink/60">※対応範囲・費用・数量・納期などは個別にご相談ください。</p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20" aria-labelledby="collaboration-contact-heading">
        <div className="container-narrow text-center">
          <p className={label}>CONTACT</p>
          <h2 id="collaboration-contact-heading" className={sectionHeading}>新しい商品づくりを、ご一緒に。</h2>
          <div className="body-jp mt-5 space-y-2 text-sm text-ink/75">
            <p>商品アイデアの段階から、お気軽にご相談ください。</p>
            <p>貴社のご要望に合わせた協業の形を検討します。</p>
          </div>
          <div className="mt-7"><ContactButton>コラボについて問い合わせる</ContactButton></div>
        </div>
      </section>
    </>
  );
}
