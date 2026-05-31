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
  { k: "会社名", v: "株式会社QRing" },
  { k: "代表者", v: "代表取締役 木津 愛子" },
  { k: "設立", v: "2025年10月31日" },
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2-37-5 ONEST南大塚ビル10階" },
  { k: "資本金", v: "1,000万円" },
  { k: "事業内容", v: "「つながるQR」の開発・提供 / 関連サービスの企画運営" },
  { k: "主要取引銀行", v: "三井住友銀行" },
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
                  つながりやすい時代の中で、<br />
                  人と人とのあいだに、ふと心の距離を感じる場面があります。<br />
                  近くに人がいても、声をかけることをためらってしまう。<br />
                  そんな瞬間はないでしょうか。
                </p>

                <p>
                  たとえば、道で困った様子の高齢者を見かけたとき。<br />
                  「見知らぬ相手に声をかけて大丈夫だろうか」「このあと、どうやって対応しようか」と考えてしまい、一歩を踏み出せずにいることがあります。<br />
                  それは冷たさではなく、相手のことを思う気持ちがあるからこそ生まれるものだと思います。
                </p>

                <p>
                  多くの人は、本当は誰かの役に立ちたい。助けたい。<br />
                  けれど、個人情報への不安などが重なり、その気持ちが行動に結びつきにくくなっている場面が増えています。
                </p>

                <p>
                  「つながるQR」は、そうしたためらいを減らし、声をかける一歩をそっと後ろから支えるための仕組みです。<br />
                  電話番号を見せることなく通話ができることで、見知らぬ相手とも安心して声をつなげられる。文字だけでは伝わりにくい不安にも、声の温度で「大丈夫ですか？」を届けることができます。
                </p>

                <p>
                  私たちは、思いやりが安心ととも行動へとつながる社会を、少しずつ増やしていきたいと考えています。<br />
                  そして、必要なときに、必要な範囲で人と人とがつながる、そのあり方に、真摯に向き合っていきたいと考えています。
                </p>

                <div className="pt-4">
                  <p className="font-serif text-lg">代表取締役 木津 愛子</p>
                </div>
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