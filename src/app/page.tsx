import Image from "next/image";
import Link from "next/link";
import HeroVisual from "@/components/HeroVisual";
import HowItWorks from "@/components/HowItWorks";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    no: "01",
    en: "No Number Shared",
    jp: "番号を、明かさずに。",
    body: "つながるQRは、お互いの電話番号を一切開示せずに音声通話を実現する、特許取得済みの新しい通信技術です。",
  },
  {
    no: "02",
    en: "No App Required",
    jp: "アプリの、インストール不要。",
    body: "QRコードを読み取るだけ。普段お使いの電話アプリで、誰でもすぐに通話を始められます。",
  },
  {
    no: "03",
    en: "For Everyone",
    jp: "すべての人に、安心を。",
    body: "落とし物・迷子・ご高齢の方の見守りまで。日常のあらゆる「もしも」に、静かに寄り添います。",
  },
];

const SERVICES = [
  {
    tag: "LOST & FOUND",
    title: "落とし物・忘れ物に",
    body: "持ち物につながるQRを付けておけば、拾った方が読み取るだけであなたへ連絡が届きます。住所や電話番号は、最後まで秘密のまま。",
  },
  {
    tag: "FOR SENIORS",
    title: "ご高齢の方の見守りに",
    body: "認知症や徘徊が心配なご家族へ。万一の際にも、発見した方からご家族へ確実に、そして安全につながります。",
  },
  {
    tag: "FOR PETS",
    title: "大切なペットに",
    body: "首輪に付けるだけ。万が一はぐれてしまっても、保護してくださった方からすぐにご連絡をいただけます。",
  },
  {
    tag: "BUSINESS",
    title: "法人の方へ",
    body: "顧客対応・配送・現場連絡など、番号開示が難しい業務シーンに。法人プラン・APIもご用意しています。",
  },
];

const NEWS = [
  {
    date: "2026.08.03",
    cat: "EVENT",
    title:
      "【開催報告】Women Leaders TIB Lounge",
  },
  {
    date: "2026.07.22",
    cat: "EVENT",
    title:
      "【イベント出展のお知らせ】フィガロジャポン Business with Attitude ピッチコンテスト2026にブース出展いたしました",
  },
  {
    date: "2026.05.31",
    cat: "NEWS",
    title: "コーポレートサイトをリニューアルいたしました",
  },
];

const HERO_CTA_LABEL = "お問い合わせはこちら";
const CONTACT_URL = "https://axb.qring.jp/contact";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-ivory pt-20 md:pt-24">
        <div className="relative mx-auto w-full max-w-[1536px]">
          <HeroVisual />
          <div className="absolute inset-0 z-10 max-w-[58%] px-6 pt-8 sm:max-w-[54%] sm:px-10 sm:pt-12 md:hidden">
            <span className="eyebrow">— Tsunagaru QR</span>
            <h1 className="mt-4 font-serif text-[30px] font-light leading-[1.35] tracking-tight min-[390px]:text-[32px] sm:mt-5 sm:text-[40px]">
              暮らしに、
              <br />
              <span className="text-moss">もしも</span>の備えを。
            </h1>
            <p className="mt-4 text-sm leading-[1.8] text-ink/80 sm:mt-5 sm:text-base">
              大切な人や、大切なものと
              <br />
              つながるQRサービス。
            </p>
          </div>
          <div className="absolute left-[5.5%] top-[12%] z-10 hidden w-[39%] md:block">
            <span className="eyebrow">— Tsunagaru QR</span>
            <h1 className="mt-5 font-serif text-[clamp(36px,4vw,64px)] font-light leading-[1.3] tracking-tight">
              暮らしに、
              <br />
              <span className="text-moss">もしも</span>の備えを。
            </h1>
            <span className="mt-7 block h-px w-28 bg-gold" aria-hidden="true" />
            <p className="mt-7 font-sans text-[clamp(15px,1.45vw,22px)] leading-[1.9] tracking-[0.08em] text-ink/80">
              大切な人や、大切なものと
              <br />
              つながるQRサービス。
            </p>
          </div>
        </div>

        <div className="container-wide flex justify-center py-7 md:py-9">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary normal-case tracking-[0.12em]"
          >
            {HERO_CTA_LABEL}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <HowItWorks />

      {/* CONCEPT */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <Image
          src="/images/texture-wave.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40 pointer-events-none -z-0"
        />
        <div className="container-narrow relative z-10">
          <Reveal>
            <span className="eyebrow">— Concept</span>
          </Reveal>
          <Reveal delay={120}>
            <p className="display mt-10 text-3xl md:text-5xl lg:text-6xl leading-[1.4]">
              つながる、
              <span className="text-moss">けれど</span>
              <br />
              知られない。
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="body-jp mt-12 text-base md:text-lg max-w-2xl">
              番号を渡すこと、それは時に大きな勇気を必要とします。
              <br />
              つながるQRは、電話番号を相手に明かさない新しい通話のかたち。
              <br />
              落とし物の届け出から、ご家族の見守り、ビジネスの現場まで。
              <br />
              「もしも」のときに、静かに、確かに、人と人をつなぎます。
            </p>
          </Reveal>
        </div>

        {/* decorative line */}
        <div className="container-wide mt-24">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— Features"
              en="Three Promises."
              jp="つながるQRの、三つの約束。"
            />
          </Reveal>
          <div className="mt-20 grid md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
            {FEATURES.map((f, i) => (
              <Reveal key={f.no} delay={i * 120}>
                <div className="group h-full bg-ivory p-10 lg:p-12 border-t border-ink/10 hover:border-moss transition-colors duration-700">
                  <p className="font-serif text-5xl text-moss/70 group-hover:text-moss transition-colors duration-700">
                    {f.no}
                  </p>
                  <h3 className="mt-8 font-serif text-2xl lg:text-3xl leading-tight">
                    {f.en}
                  </h3>
                  <p className="mt-3 text-sm tracking-[0.2em] text-ink/60">
                    {f.jp}
                  </p>
                  <p className="mt-8 body-jp text-sm">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-40">
        <div className="container-wide">
          <div className="grid md:grid-cols-12 gap-12 md:gap-8 mb-20">
            <div className="md:col-span-5">
              <Reveal>
                <SectionTitle
                  eyebrow="— Service"
                  en="Where it works."
                  jp="つながるQRが活躍する場面。"
                />
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={120}>
                <p className="body-jp text-base">
                  日常の小さな不安から、ビジネスの大切な接点まで。
                  電話番号を介さない安全な通話は、想像以上に多くの場面で
                  わたしたちの生活を、そっと支えます。
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-ink/10">
            {SERVICES.map((s, i) => (
              <Reveal key={s.tag} delay={i * 80}>
                <article className="group h-full bg-ivory p-10 lg:p-14 transition-colors duration-700 hover:bg-cream">
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[11px] tracking-[0.3em] text-moss uppercase">
                      {s.tag}
                    </span>
                    <span className="text-ink/40 font-serif text-sm">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-6 body-jp text-sm md:text-base">{s.body}</p>
                  <div className="mt-10">
                    <Link
                      href="/service"
                      className="text-xs tracking-[0.3em] uppercase text-ink group-hover:text-moss link-underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-32 md:py-48 bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg
            viewBox="0 0 1200 600"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="cta-glow" cx="70%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#D6B97A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D6B97A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1200" height="600" fill="url(#cta-glow)" />
          </svg>
        </div>
        <div className="container-narrow relative z-10 text-center">
          <Reveal>
            <span className="text-[11px] tracking-[0.35em] uppercase text-softgold">
              — For Business
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display mt-8 text-4xl md:text-6xl lg:text-7xl">
              次世代のプロダクトを共に創る、
              <br />
              パートナー企業募集中。
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-10 text-ivory/70 max-w-xl mx-auto text-sm md:text-base leading-loose">
              コラボレーション製品の共同企画、新規事業開発、業務提携などのご相談を承っております。
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-12 flex justify-center gap-4 flex-wrap">
              <a
                href="https://axb.qring.jp/contact?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-ivory text-ink text-sm tracking-[0.25em] uppercase hover:bg-softgold transition-colors duration-500"
              >
                資料請求 / お問い合わせ
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-24 md:py-40">
        <div className="container-wide grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <SectionTitle eyebrow="— News" en="Recent." jp="最新のお知らせ" />
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/news"
                className="mt-10 inline-block text-xs tracking-[0.3em] uppercase link-underline"
              >
                View all →
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <ul>
              {NEWS.map((n, i) => (
                <Reveal as="li" key={n.title} delay={i * 80}>
                  <Link
                    href="/news"
                    className="group grid grid-cols-12 gap-4 py-7 border-t border-ink/10 last:border-b items-baseline"
                  >
                    <span className="col-span-3 font-serif text-sm text-ink/60">
                      {n.date}
                    </span>
                    <span className="col-span-3 md:col-span-2 text-[10px] tracking-[0.3em] uppercase text-moss">
                      {n.cat}
                    </span>
                    <span className="col-span-12 md:col-span-7 text-sm md:text-base text-ink group-hover:text-moss transition-colors duration-300">
                      {n.title}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
