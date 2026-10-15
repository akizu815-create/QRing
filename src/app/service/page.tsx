import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Service",
  description:
    "つながるQRの仕組みと、ご利用方法、活用シーンをご紹介します。",
};

const USECASES = [
  {
    no: "01",
    title: "ご家族の見守りに",
    body: "ご高齢のご家族が外出先で困っているとき、周囲の方がQRコードを読み取ることで、登録された連絡先へ電話できます。ご家族の電話番号を相手に知らせる必要はありません。",
    image: "/images/use-case-family.png",
    imageAlt: "緑道を歩きながら会話する高齢女性と家族",
  },
  {
    no: "02",
    title: "大切なペットに",
    body: "万が一ペットが迷子になったときも、保護してくださった方が首輪のQRコードから飼い主に連絡できます。個人の電話番号を公開せずに、直接お話しできます。",
    image: "/images/use-case-pet.png",
    imageAlt: "QRタグを身につけた犬と見つめ合う女性",
  },
  {
    no: "03",
    title: "持ち物の紛失に",
    body: "バッグや鍵、財布などを置き忘れたとき、拾った方から持ち主へ連絡できます。住所や電話番号を書いた名札を付ける必要がなく、プライバシーを守りながら連絡を受けられます。",
    image: "/images/use-case-belongings.png",
    imageAlt: "バッグに取り付けられたQRタグ",
  },
] as const;

export default function ServicePage() {
  return (
    <>
      <PageHeader
        eyebrow="— Service"
        en="Service"
      />

      {/* INTRO */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <p className="display text-3xl leading-[1.55] md:text-5xl lg:text-6xl">
                小さな<span className="text-moss">QR</span>コードに、
                <br />
                大きな<span className="text-moss">安心</span>を。
              </p>
              <p className="mt-5 text-[11px] tracking-[0.16em] text-ink/50">
                特許取得済（特許第7460140号）
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="body-jp mt-10 space-y-5 text-base md:text-lg">
                <p>
                  つながるQRは、お互いの電話番号を知らせることなく、音声通話ができるサービスです。
                </p>
                <p>
                  ご家族の見守りや、ペットの迷子、持ち物の紛失など。もしものとき、QRコードを通じて必要な相手とつながります。
                </p>
                <p>
                  専用アプリは不要。スマートフォンから手軽にご利用いただけます。
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-6">
            <Reveal delay={240}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/service-hero-lost-bag.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                Use Cases
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-7 font-serif text-3xl font-light leading-[1.35] md:text-5xl">
                暮らしのさまざまな「もしも」に。
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
                身近なものにQRコードを添えることで、必要なときの連絡手段を用意できます。
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3 lg:gap-10">
            {USECASES.map((u, i) => (
              <Reveal key={u.no} delay={240 + i * 80}>
                <article className="h-full overflow-hidden bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={u.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-[1.025]"
                    />
                  </div>
                  <div className="p-7 md:p-8 lg:p-10">
                    <p className="text-[10px] font-medium tracking-[0.32em] text-moss">
                      USE CASE {u.no}
                    </p>
                    <h3 className="mt-4 font-serif text-2xl font-light leading-snug">
                    {u.title}
                    </h3>
                    <p className="body-jp mt-5 text-sm text-ink/70">{u.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-ink text-ivory">
        <div className="container-narrow text-center">
          <p className="display text-3xl md:text-5xl">
            まずは、お試しを。
          </p>
          <p className="mt-8 text-ivory/70 max-w-xl mx-auto text-sm md:text-base leading-loose">
            個人のお客さまはオンラインショップから、
            <br className="hidden md:inline" />
            事業者さまはお問い合わせフォームよりご相談ください。
          </p>
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-5 bg-ivory text-ink text-sm tracking-[0.25em] uppercase hover:bg-softgold transition-colors duration-500"
            >
              SHOPを見る
            </Link>
            <a
              href="https://axb.qring.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 border border-ivory/40 text-ivory text-sm tracking-[0.25em] uppercase hover:bg-ivory hover:text-ink transition-colors duration-500"
            >
              事業者の方はこちら
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
