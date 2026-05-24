import type { Metadata } from "next";
import Image from "next/image";
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
    image: "/images/product-charm.png",
  },
  {
    tag: "STICKER",
    name: "QRing Seal",
    price: "¥980 –",
    body: "電子機器・自転車・キャリーケースに。耐水・耐候性のクラフトシール。",
    image: "/images/product-seal.png",
  },
  {
    tag: "PET TAG",
    name: "QRing for Pets",
    price: "¥1,800 –",
    body: "首輪に取り付ける軽量タイプ。アレルギーに配慮した医療グレード素材を使用。",
    image: "/images/product-pet.png",
  },
  {
    tag: "CARE CARD",
    name: "QRing Care",
    price: "¥1,500 –",
    body: "ご高齢のご家族の見守りに。お財布に入れて持ち歩ける、上質な紙のカード。",
    image: "/images/product-care.png",
  },
];

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
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase text-moss bg-ivory/80 px-3 py-1 backdrop-blur-sm">
                      {p.tag}
                    </span>
                    <span className="absolute top-6 right-6 text-[10px] tracking-[0.3em] uppercase text-ink/60 bg-ivory/80 px-3 py-1 backdrop-blur-sm">
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
