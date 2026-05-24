import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "About",
  description: "QRingのビジョン、ミッション、代表挨拶、会社概要をご紹介します。",
};

const COMPANY = [
  { k: "会社名", v: "QRing 株式会社" },
  { k: "設立", v: "2023年" },
  { k: "代表者", v: "代表取締役" },
  { k: "所在地", v: "東京都" },
  { k: "事業内容", v: "「つながるQR」の開発・提供 / 関連サービスの企画運営" },
  { k: "特許", v: "特許第7460140号（2024年3月25日取得）" },
  { k: "TEL", v: "03-6555-8000（10:00 – 18:00 / 土日祝休）" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="— About" en="About QRing." jp="私たちについて" />

      {/* VISION */}
      <section id="vision" className="py-24 md:py-40">
        <div className="container-wide">
          <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
            <div className="md:col-span-5">
              <Reveal>
                <SectionTitle
                  eyebrow="— Vision"
                  en="Connecting people, quietly."
                  jp="人と人を、静かにつなぐ。"
                />
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={120}>
                <p className="body-jp text-base md:text-lg">
                  電話番号は、もっとも身近で、もっとも繊細な個人情報です。
                  教えることに躊躇い、教えてもらうことに気を遣う。
                  その小さな心の負担を、技術の力でほどいていく。
                  <br />
                  <br />
                  QRingが目指すのは、便利さの追求ではなく、
                  安心して人と人がつながれる社会のあたりまえを、
                  静かに、丁寧に、つくり直すことです。
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal delay={200}>
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <Image
                src="/images/about-vision.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-narrow">
          <Reveal>
            <span className="eyebrow">— Mission</span>
          </Reveal>
          <Reveal delay={120}>
            <p className="display mt-10 text-3xl md:text-5xl lg:text-6xl leading-[1.4]">
              「教えない、けれど
              <br />
              <span className="text-moss">つながる。」</span>
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="body-jp mt-12 text-base md:text-lg">
              プライバシーを守りながら、必要な時に確かにつながる。
              この、相反するように見える二つの価値を両立させることが、
              わたしたちの使命です。
            </p>
          </Reveal>
        </div>
      </section>

      {/* MESSAGE */}
      <section id="message" className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Reveal>
              <SectionTitle
                eyebrow="— Message"
                en="From the Founder."
                jp="代表挨拶"
              />
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={120}>
              <div className="body-jp text-base space-y-6">
                <p>
                  はじめまして、QRingです。
                  私たちは、日常のすぐ隣にある「番号を教える/教えない」という小さな葛藤に向き合うことから、このサービスを始めました。
                </p>
                <p>
                  落とし物の連絡先、ご家族の見守り、ビジネス上のやり取り。
                  電話番号という個人情報を介さずに、必要な相手と、必要なときだけ、安全につながる。
                  そんな新しい連絡のかたちを、わたしたちは『つながるQR』として世に届けます。
                </p>
                <p>
                  小さなQRコードに込めた大きな安心を、
                  どうぞお手元でお試しいただけますと幸いです。
                </p>
                <p className="pt-4 font-serif text-lg">QRing 代表</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section id="company" className="py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— Company"
              en="Company Profile."
              jp="会社概要"
            />
          </Reveal>
          <div className="mt-16 max-w-3xl">
            <dl>
              {COMPANY.map((row, i) => (
                <Reveal as="div" key={row.k} delay={i * 60}>
                  <div className="grid grid-cols-12 gap-4 py-6 border-t border-ink/10 last:border-b">
                    <dt className="col-span-12 md:col-span-3 text-[11px] tracking-[0.3em] uppercase text-moss">
                      {row.k}
                    </dt>
                    <dd className="col-span-12 md:col-span-9 text-sm md:text-base text-ink/80">
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
