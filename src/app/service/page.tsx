import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Service",
  description:
    "つながるQRの仕組みと、ご利用方法、活用シーンをご紹介します。",
};

const STEPS = [
  {
    no: "01",
    en: "Register",
    title: "登録する",
    body: "専用のQRコードをスキャンし、ご自身の電話番号を一度だけ登録します。番号は暗号化され、外部に開示されることはありません。",
  },
  {
    no: "02",
    en: "Attach",
    title: "持ち物・場所に付ける",
    body: "鍵・財布・キャリーケース、お子さまの持ち物、ペットの首輪など、必要な場所にQRingを装着します。",
  },
  {
    no: "03",
    en: "Discover",
    title: "発見者がスキャン",
    body: "万一の際、発見してくださった方がQRをスキャン。発信ボタンを押すだけで、システムが安全な中間番号を生成します。",
  },
  {
    no: "04",
    en: "Connect",
    title: "番号を介さず通話",
    body: "中間番号を経由して通話が成立。お互いの本当の電話番号は、最後まで一切表示されません。",
  },
];

const USECASES = [
  {
    tag: "FOR FAMILIES",
    title: "ご家族の見守り",
    body: "ご高齢のご家族や、お子さまの持ち物に。発見者からご家族へ、確実かつ安全に連絡が届きます。一人歩きや迷子の不安を、そっと和らげます。",
  },
  {
    tag: "FOR PETS",
    title: "大切なペットに",
    body: "首輪に取り付けるだけ。万が一はぐれても、保護してくださった方からあなたへ直接ご連絡が届きます。",
  },
  {
    tag: "LOST & FOUND",
    title: "落とし物・忘れ物",
    body: "鍵、財布、キャリーケース、自転車。よくなくす持ち物にひとつ。住所や電話番号を晒すことなく、落とし物の発見をお知らせいただけます。",
  },
  {
    tag: "BUSINESS",
    title: "事業者さま向け",
    body: "配送スタッフ、現場作業員、顧客対応窓口。番号開示が難しい業務シーンに最適です。API連携・大量導入のご相談も承ります。",
  },
];

export default function ServicePage() {
  return (
    <>
      <PageHeader
        eyebrow="— Service"
        en="Tsunagaru QR."
        jp="サービスについて"
      />

      {/* INTRO */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <p className="display text-3xl md:text-5xl lg:text-6xl leading-[1.4]">
                小さなQRコードに、
                <br />
                <span className="text-moss">大きな安心を。</span>
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="body-jp mt-12 text-base md:text-lg">
                QRingは、電話番号を相手に開示することなく、QRコードを介して音声通話を実現する
                特許取得済（特許第7460140号）の通信サービスです。
                <br />
                <br />
                暗号化された番号情報をクラウドPBX上で復号し、
                一時的な中間番号を経由して接続する独自方式により、
                番号を渡すことなく、いつでも、確実に、つながることができます。
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6">
            <Reveal delay={240}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/service-hero.png"
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

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— How it works"
              en="Four Simple Steps."
              jp="ご利用の流れ"
            />
          </Reveal>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
            {STEPS.map((step, i) => (
              <Reveal key={step.no} delay={i * 100}>
                <div className="h-full bg-cream p-10 lg:p-12 relative">
                  <div className="flex items-baseline justify-between mb-10">
                    <span className="font-serif text-5xl text-moss/60">
                      {step.no}
                    </span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-ink/40">
                      step
                    </span>
                  </div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-moss">
                    {step.en}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-6 body-jp text-sm">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SENIOR FEATURE */}
      <section id="senior" className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <Reveal>
              <span className="eyebrow">— For Families</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display mt-8 text-3xl md:text-5xl leading-tight">
                大切なご家族の
                <br />
                <span className="text-moss">見守りに。</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-10 body-jp text-base md:text-lg">
                ご高齢のご家族が外出時にもしものことがあったとき、
                発見者の方から、ご家族の電話番号を一切知らせることなく
                直接ご連絡をいただける、見守りに特化したパッケージをご用意しています。
                <br />
                <br />
                一人歩きや迷子の不安に、静かに寄り添う設計です。
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <Reveal delay={150}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/senior.png"
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
          <Reveal>
            <SectionTitle
              eyebrow="— Use Cases"
              en="Where it gently helps."
              jp="活用シーン"
            />
          </Reveal>
          <div className="mt-20 grid md:grid-cols-2 gap-px bg-ink/10">
            {USECASES.map((u, i) => (
              <Reveal key={u.tag} delay={i * 80}>
                <article className="h-full bg-ivory p-10 lg:p-14 hover:bg-cream transition-colors duration-700">
                  <span className="text-[11px] tracking-[0.3em] uppercase text-moss">
                    {u.tag}
                  </span>
                  <h3 className="mt-6 font-serif text-2xl md:text-3xl">
                    {u.title}
                  </h3>
                  <p className="mt-6 body-jp text-sm md:text-base">{u.body}</p>
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
              href="https://axb.qring.jp:8070/contact"
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
