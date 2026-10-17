import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "つながるQRを社会インフラへ。株式会社QRingのビジョン、代表メッセージ、会社概要をご紹介します。",
};

const COMPANY = [
  { k: "会社名", v: "株式会社QRing" },
  { k: "代表者", v: "代表取締役 木津 愛子" },
  { k: "設立", v: "2025年10月31日" },
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2丁目37番5号 RENEX Otsuka 10階" },
  { k: "資本金", v: "1,000万円" },
  { k: "事業内容", v: "「つながるQR」の開発・提供 / 関連サービスの企画運営" },
  { k: "主要取引銀行", v: "三井住友銀行" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="— About" en="About QRing" />

      {/* INTRO */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid gap-12 md:grid-cols-12 lg:gap-20">
          <div className="md:col-span-9 lg:col-span-8">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                About QRing
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="display mt-7 text-3xl leading-[1.55] md:text-5xl lg:text-6xl">
                つながる安心を、<br />社会の当たり前に。
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="body-jp mt-10 max-w-2xl text-base text-ink/75 md:text-lg">
                必要なときに、誰もが安心してつながれる未来へ。
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="bg-cream py-24 md:py-40">
        <div className="container-wide">
          <div className="container-narrow text-center">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                OUR VISION
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-7 font-serif text-3xl font-light leading-[1.4] text-ink md:text-5xl">
                つながるQRを、社会インフラへ。
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <span className="mx-auto mt-8 block h-px w-12 bg-moss" />
              <p className="body-jp mx-auto mt-9 max-w-2xl text-base text-ink/75 md:text-lg">
                暮らしの中のさまざまな場面で、プライバシーを守りながら簡単につながれる仕組みを広げていきます。
              </p>
            </Reveal>
          </div>
          <Reveal delay={240}>
            <div className="relative mt-14 aspect-video w-full overflow-hidden md:mt-20">
              <Image
                src="/images/about-vision-city-walk.png"
                alt="木漏れ日の都会の歩道を行き交う人々"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MESSAGE */}
      <section id="message" className="py-24 md:py-40">
        <div className="container-wide grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
                MESSAGE
              </p>
              <h2 className="mt-7 max-w-lg font-serif text-3xl font-light leading-[1.5] text-ink md:text-5xl">
                小さな仕組みを、<br />社会の大きな安心へ。
              </h2>
              <span className="mt-8 block h-px w-12 bg-moss" />
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={120}>
              <div className="body-jp max-w-2xl space-y-7 text-base text-ink/80 md:text-lg">
                <p>私たちは、必要なときに誰もが安心してつながれる社会を目指しています。</p>
                <p>「つながるQR」は、プライバシーを守りながら、人と人を簡単につなぐ仕組みです。</p>
                <p>
                  暮らしの中のさまざまな場面で自然に使われ、やがて社会の当たり前となること。
                </p>
                <p>その未来に向けて、一歩ずつ取り組んでまいります。</p>
                <div className="pt-5 text-sm leading-loose text-ink/70 md:text-base">
                  <p>株式会社QRing</p>
                  <p>代表取締役　木津 愛子</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section id="company" className="bg-cream py-24 md:py-40">
        <div className="container-wide">
          <Reveal>
            <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
              COMPANY
            </p>
            <h2 className="mt-7 font-serif text-3xl font-light leading-[1.4] text-ink md:text-5xl">
              会社概要
            </h2>
            <span className="mt-8 block h-px w-12 bg-moss" />
          </Reveal>
          <div className="mt-14 max-w-3xl md:mt-16">
            <dl>
              {COMPANY.map((row, i) => (
                <Reveal as="div" key={row.k} delay={i * 60}>
                  <div className="grid grid-cols-12 gap-4 border-t border-ink/10 py-6 last:border-b">
                    <dt className="col-span-12 text-[11px] uppercase tracking-[0.3em] text-moss md:col-span-3">
                      {row.k}
                    </dt>
                    <dd className="col-span-12 text-sm text-ink/80 md:col-span-9 md:text-base">
                      {row.v}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
