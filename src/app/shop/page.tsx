import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "QRingプロダクトラインナップ。キーチャーム、シール、ペットタグなど。",
};

const PRODUCTS = [
  {
    tag: "KEY CHARM",
    name: "QRing Charm",
    price: "¥2,200 –",
    body: "鍵・バッグに。職人が削り出した真鍮プレートに刻まれた、ひとつだけの番号。",
  },
  {
    tag: "STICKER",
    name: "QRing Seal",
    price: "¥980 –",
    body: "電子機器・自転車・キャリーケースに。耐水・耐候性のクラフトシール。",
  },
  {
    tag: "PET TAG",
    name: "QRing for Pets",
    price: "¥1,800 –",
    body: "首輪に取り付ける軽量タイプ。アレルギーに配慮した医療グレード素材を使用。",
  },
  {
    tag: "CARE CARD",
    name: "QRing Care",
    price: "¥1,500 –",
    body: "ご高齢のご家族の見守りに。お財布に入れて持ち歩ける、上質な紙のカード。",
  },
];

function ProductMock() {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7F4EE" />
          <stop offset="100%" stopColor="#E2D7C2" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill="url(#card-bg)" />
      <rect
        x="30"
        y="40"
        width="140"
        height="160"
        fill="white"
        stroke="#1F1A14"
        strokeOpacity="0.1"
      />
      <g transform="translate(70 80)" fill="#1F1A14">
        <rect width="15" height="15" />
        <rect x="0" y="20" width="5" height="5" />
        <rect x="10" y="20" width="5" height="5" />
        <rect x="0" y="30" width="15" height="5" />
        <rect x="20" y="0" width="5" height="5" />
        <rect x="30" y="0" width="15" height="5" />
        <rect x="20" y="10" width="5" height="25" />
        <rect x="35" y="10" width="10" height="5" />
        <rect x="30" y="20" width="5" height="5" />
        <rect x="40" y="25" width="5" height="10" />
        <rect x="50" y="0" width="15" height="15" />
        <rect x="50" y="20" width="5" height="15" />
        <rect x="60" y="20" width="5" height="5" />
        <rect x="60" y="30" width="5" height="5" />
      </g>
      <text
        x="100"
        y="180"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="10"
        fill="#1F1A14"
        opacity="0.6"
        letterSpacing="2"
      >
        QRing
      </text>
    </svg>
  );
}

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="— Shop"
        en="The Collection."
        jp="プロダクトラインナップ"
      />

      <section className="py-24 md:py-32">
        <div className="container-narrow text-center">
          <Reveal>
            <p className="body-jp text-base md:text-lg">
              QRingは、暮らしの中で長く、美しく寄り添うプロダクトであることを目指しています。
              <br />
              素材、フォルム、手触りに至るまで。日本のものづくりの精度で、ひとつずつ。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-40">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <article className="group cursor-pointer">
                  <div className="relative aspect-[4/5] bg-cream overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-[1500ms] ease-out group-hover:scale-105">
                      <ProductMock />
                    </div>
                    <span className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase text-moss">
                      {p.tag}
                    </span>
                    <span className="absolute top-6 right-6 text-[10px] tracking-[0.3em] uppercase text-ink/40">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="pt-8 flex items-baseline justify-between gap-6">
                    <h3 className="font-serif text-2xl md:text-3xl">{p.name}</h3>
                    <p className="font-serif text-base text-ink/70 whitespace-nowrap">
                      {p.price}
                    </p>
                  </div>
                  <p className="mt-4 body-jp text-sm">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-cream">
        <div className="container-narrow text-center">
          <Reveal>
            <SectionTitle
              eyebrow="— Coming Soon"
              en="Online Store opens 2026."
              jp="オンラインストア準備中"
              align="center"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="body-jp mt-12 text-base">
              先行販売・発売開始のご案内をご希望の方は、お問い合わせフォームよりご連絡ください。
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link href="/contact" className="mt-12 btn-primary inline-flex">
              先行案内に登録する
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
