import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import HowToUse from "@/components/HowToUse";


export const metadata = pageMetadata("service");

export default function ServicePage() {
  return (
    <>
      <PageStructuredData page="service" />
      <PageHeader
        eyebrow="— Service"
        en="Service"
        heading="つながるQRについて"
      />

      {/* INTRO */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <h2 className="display text-3xl leading-[1.55] md:text-5xl lg:text-6xl">
                小さな<span>QR</span>コードに、
                <br />
                大きな<span className="text-moss">安心</span>を。
              </h2>
              <p className="mt-5 text-[11px] tracking-[0.16em] text-ink/50">
                特許取得済（特許第7460140号）
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="body-jp mt-10 space-y-5 text-base md:text-lg">
                <p>
                  つながるQRは、QRコードを通じて、お互いの電話番号を公開せずに通話できるサービスです。
                </p>
                <p>
                  専用アプリは不要。見つけてくださった方が、画面の『電話をかける』をタップするだけで登録先につながります。
                </p>
              </div>
              <p id="use-cases" className="mt-7 scroll-mt-28 text-sm">
                <Link href="/#use-cases" className="link-underline text-ink/70 transition-colors hover:text-moss">
                  活用シーンはHOMEで見る →
                </Link>
              </p>
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
              <p className="text-[11px] font-medium tracking-[0.38em] text-ink/60">
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
                発見者と登録者の間に、プライバシー電話番号を使用します。お互いの電話番号を相手に表示せず、直接会話できます。
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
            <div className="mx-auto mt-12 grid max-w-6xl border-y border-ink/15 md:mt-16 md:grid-cols-2">
              <div className="py-8 text-center md:px-8 md:py-10">
                <p className="text-base font-semibold tracking-[0.22em] text-ink/60">01</p>
                <p className="mt-3 font-sans text-[38px] font-medium leading-tight tracking-tight text-ink">
                  <span>3</span>分
                </p>
                <p className="mt-4 text-[15px] font-medium leading-7 text-ink/80">
                  1回の通話は最大3分
                </p>
              </div>
              <div className="border-t border-ink/15 py-8 text-center md:border-l md:border-t-0 md:px-8 md:py-10">
                <p className="text-base font-semibold tracking-[0.22em] text-ink/60">02</p>
                <p className="mt-3 font-sans text-[38px] font-medium leading-tight tracking-tight text-ink">
                  <span>1</span>時間
                </p>
                <p className="mt-4 text-[15px] font-medium leading-7 text-ink/80">
                  再通話・折り返しが可能な時間
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="body-jp mx-auto mt-10 max-w-4xl space-y-3 text-sm text-ink/65">
              <p>
                QRコードのスキャンから1時間以内は、同じプライバシー電話番号で再通話・折り返しができます。
              </p>
              <p>
                着信には03-6555-8100〜03-6555-8199の電話番号を使用します。登録者の方は、この番号帯から着信する場合があることを事前にご確認ください。
              </p>
              <p><Link href="/price/#session-title" className="link-underline text-ink/75 transition-colors hover:text-moss">セッション・料金について詳しく見る →</Link></p>
            </div>
          </Reveal>
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
            {CONSUMER_SERVICE.notice}
          </p>
          <div className="mt-12 flex flex-col items-center gap-7">
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
