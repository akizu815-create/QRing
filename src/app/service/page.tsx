import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import HowToUse from "@/components/HowToUse";


const USECASES = [
  {
    no: "01",
    title: "ご家族の見守りに",
    body: "ご高齢のご家族が外出先で困っているとき、周囲の方がQRコードをスキャンすることで、登録された連絡先へ電話できます。ご家族の電話番号を相手に知らせる必要はありません。",
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

export const metadata = pageMetadata("service");

export default function ServicePage() {
  return (
    <>
      <PageStructuredData page="service" />
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
              <p className="mt-5 text-xs leading-relaxed text-ink/65">※本サービスの通話機能は、日本国内でのみご利用いただけます。</p>
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

      <HowToUse />
      {/* PRIVACY CALL */}
      <section id="privacy-call" className="border-y border-ink/10 bg-ivory py-24 md:py-40">
        <div className="container-wide">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                Privacy Call
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-7 font-serif text-3xl font-light leading-[1.4] md:text-5xl">
                電話番号を知らせずに、声で<span className="text-moss">つながる</span>。
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="body-jp mx-auto mt-7 max-w-3xl text-sm text-ink/70 md:text-base">
                つながるQRでは、プライバシー電話番号を通じて、お互いの電話番号を相手に表示せずに通話できます。
              </p>
            </Reveal>
          </div>

          <Reveal delay={240}>
            <div className="relative mx-auto mt-14 aspect-[1916/823] w-full max-w-6xl md:mt-20">
              <Image
                src="/images/call-connection.png"
                alt="登録者と発見者をプライバシー電話番号でつなぐ仕組み"
                fill
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-contain"
              />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mx-auto mt-12 grid max-w-6xl border-y border-ink/15 md:mt-16 md:grid-cols-[0.8fr_1.05fr_1.5fr]">
              <div className="py-8 text-center md:px-8 md:py-10">
                <p className="text-base font-semibold tracking-[0.22em] text-moss">01</p>
                <p className="mt-3 font-sans text-[38px] font-medium leading-tight tracking-tight text-ink">
                  <span className="text-moss">3</span>分
                </p>
                <p className="mt-4 text-[15px] font-medium leading-7 text-ink/80">
                  1回の通話は最大3分
                </p>
              </div>
              <div className="border-t border-ink/15 py-8 text-center md:border-l md:border-t-0 md:px-8 md:py-10">
                <p className="text-base font-semibold tracking-[0.22em] text-moss">02</p>
                <p className="mt-3 font-sans text-[38px] font-medium leading-tight tracking-tight text-ink">
                  <span className="text-moss">1</span>時間
                </p>
                <p className="mt-4 text-[15px] font-medium leading-7 text-ink/80">
                  QRコードのスキャンから1時間以内は、双方から再通話・折り返しが可能
                </p>
              </div>
              <div className="border-t border-ink/15 py-8 text-center md:border-l md:border-t-0 md:px-8 md:py-10">
                <p className="text-base font-semibold tracking-[0.22em] text-moss">03</p>
                <p className="mt-3 font-sans text-[22px] font-medium leading-tight tracking-tight text-moss lg:text-2xl">
                  <span className="block md:inline">03-6555-8100〜</span>
                  <span className="block md:inline">03-6555-8199</span>
                </p>
                <p className="mt-4 text-[15px] font-medium leading-7 text-ink/80">
                  着信に使用する電話番号
                </p>
                <p className="mt-1 text-sm font-medium text-ink/65">全100番号</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="body-jp mx-auto mt-10 max-w-4xl space-y-3 text-sm text-ink/65">
              <p>
                1時間以内なら、同じプライバシー電話番号を使って何度でも通話できます。同じ時間枠内での複数通話に追加のサービス利用料金はかかりません。
              </p>
              <p>
                登録者の方は、この番号帯から着信する場合があることを事前にご確認ください。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                Use Cases
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-7 font-serif text-3xl font-light leading-[1.35] md:text-5xl">
                暮らしのさまざまな「<span className="text-moss">もしも</span>」に。
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
                    {(u.no === "01" || u.no === "02") && (
                      <div className="mt-6 text-right">
                        <Link href={u.no === "01" ? "/use-cases/elderly/" : "/use-cases/pets/"} className="link-underline inline-block text-xs tracking-[0.12em] text-moss transition-colors duration-300 hover:text-ink">
                          詳しく見る →
                        </Link>
                      </div>
                    )}
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
          <p className="text-[11px] font-medium tracking-[0.38em] text-softgold">
            Get Started
          </p>
          <h2 className="display mt-7 text-3xl md:text-5xl">
            {CONSUMER_SERVICE.heading}
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-loose text-ivory/70 md:text-base">
            {CONSUMER_SERVICE.description}
          </p>
          <div className="mt-12 flex flex-col items-center gap-7">
            <p className="text-sm font-medium tracking-[0.12em] text-softgold">{CONSUMER_SERVICE.availability}</p>
            <p className="text-sm leading-loose text-ivory/70">{CONSUMER_SERVICE.announcement}</p>
            <Link
              href={CONSUMER_SERVICE.cta.href}
              className="inline-flex items-center justify-center bg-moss px-10 py-5 text-sm tracking-[0.16em] text-ivory transition-colors duration-500 hover:bg-moss/80"
            >
              {CONSUMER_SERVICE.cta.label}
            </Link>
            <a
              href="https://axb.qring.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm tracking-[0.12em] text-ivory/65 transition-colors duration-300 hover:text-ivory"
            >
              法人・自治体の方はこちら →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
