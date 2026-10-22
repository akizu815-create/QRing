import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "自治体向け認知症高齢者の見守り・QRコード連絡サービス｜つながるQR";
const description = "認知症高齢者の見守りや発見後の家族への連絡を支援する「つながるQR」。電話番号を公開せず直接通話でき、管理者画面で利用状況も確認可能。自治体での導入や費用負担方法をご相談いただけます。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/municipalities/" },
  openGraph: { title, description, url: "/municipalities/", type: "website" },
};

const contactUrl = "https://axb.qring.jp/contact";
const sectionClass = "scroll-mt-24 py-20 md:scroll-mt-28 md:py-28";

function SectionHeading({ en, title, id }: { en: string; title: string; id: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="eyebrow">{en}</p>
      <h2 id={id} className="mt-5 max-w-4xl font-serif text-[clamp(28px,3vw,42px)] font-light leading-[1.5]">
        {title}
      </h2>
      <span className="mt-7 block h-px w-12 bg-moss/70" aria-hidden="true" />
    </div>
  );
}

const challenges = [
  "本人が連絡先を伝えられない",
  "家族への連絡に時間がかかる",
  "GPSを持っていない場合がある",
];

const useCases = [
  { title: "警察", body: "保護した高齢者の家族へ連絡" },
  { title: "消防・救急", body: "緊急時の連絡を支援" },
  { title: "福祉・地域包括", body: "地域の見守りを補完" },
  { title: "金融機関", body: "特殊詐欺が疑われる場面の連絡支援" },
  { title: "防災・動物愛護", body: "保護したペットの飼い主へ連絡" },
];

const benefits = [
  { title: "家族への連絡を支援", body: "発見後の連絡手段を追加" },
  { title: "月額基本料0円", body: "利用に応じた料金設計" },
  { title: "利用状況を見える化", body: "登録数・通話履歴・料金管理" },
  { title: "既存施策と併用", body: "GPSや地域の見守りを補完" },
];

const management = [
  "登録QRコード数",
  "利用者数",
  "通話成立件数・履歴",
  "利用料金・請求状況",
];

const prices = [
  { label: "登録料", value: "無料" },
  { label: "月額基本料", value: "無料" },
  { label: "通話成立時", value: "1セッション880円（税込・一般向け料金）" },
  { label: "QRコード製品代", value: "別途" },
  { label: "発見者のサービス利用料", value: "無料" },
  { label: "通常の電話料金", value: "発信者負担" },
];

const faq = [
  { question: "既存の見守りサービスと併用できますか？", answer: "はい。GPSや地域の見守りネットワークと併用し、発見後の連絡手段を加えられます。" },
  { question: "費用は誰が負担しますか？", answer: "自治体負担型と住民負担型から、運用に合う方法をご相談いただけます。具体的な契約条件は個別にご案内します。" },
  { question: "管理者画面では何を確認できますか？", answer: "登録QRコード数、利用者数、通話成立件数・履歴、利用料金・請求状況を確認できます。提供範囲や権限は個別相談です。" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: "https://www.qring.jp/municipalities/",
  inLanguage: "ja-JP",
  publisher: { "@type": "Organization", name: "株式会社QRing", url: "https://www.qring.jp/" },
};

export default function MunicipalitiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48" aria-labelledby="municipalities-title">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow">FOR MUNICIPALITIES</p>
            <h1 id="municipalities-title" className="mt-7 max-w-2xl font-serif text-[clamp(30px,3.5vw,50px)] font-light leading-[1.55]">
              高齢者の見守りに、<span className="text-moss">発見後の連絡</span>という安心を。
            </h1>
            <p className="body-jp mt-8 max-w-2xl text-sm md:text-base">「つながるQR」は、発見者とご家族などの登録先を、電話番号を公開せずにつなぐサービスです。</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-deepmoss md:text-sm">
              <li>月額基本料0円</li><li>管理者画面あり</li><li>既存施策と併用可能</li>
            </ul>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 normal-case">自治体での導入を相談する</a>
          </div>
          <div className="lg:col-span-6">
            <Image src="/images/municipalities-hero.png" alt="屋外を一緒に歩く高齢女性と若い女性。高齢女性のバッグにQRコードのタグが付いている" width={1672} height={941} priority sizes="(min-width: 1024px) 48vw, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="benefits-title">
        <div className="container-wide">
          <SectionHeading en="BENEFITS" title="自治体の見守りに、4つのメリット。" id="benefits-title" />
          <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
            {benefits.map((item) => <article key={item.title} className="bg-ivory p-7 md:p-9">
              <h3 className="font-serif text-xl leading-relaxed text-deepmoss md:text-2xl">{item.title}</h3>
              <p className="body-jp mt-3 text-sm">{item.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="challenges-title">
        <div className="container-wide">
          <SectionHeading en="CHALLENGES" title="こんな場面で、困っていませんか？" id="challenges-title" />
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {challenges.map((item) => <li key={item} className="py-4 text-sm leading-relaxed md:text-base">{item}</li>)}
              </ul>
            </div>
            <Image src="/images/municipalities-challenges.png" alt="連絡先を伝えにくい高齢者、関係機関の連絡調整、見守り機器を持たない場合や特殊詐欺が疑われる場面を示す図" width={1536} height={1024} sizes="(min-width: 1024px) 52vw, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="use-cases-title">
        <div className="container-wide">
          <SectionHeading en="USE CASES" title="地域のさまざまな場面で活用。" id="use-cases-title" />
          <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
            {useCases.map((item) => <article key={item.title} className="bg-ivory p-7 md:p-9">
              <h3 className="font-serif text-xl leading-relaxed md:text-2xl">{item.title}</h3>
              <p className="body-jp mt-3 text-sm">{item.body}</p>
            </article>)}
          </div>
          <p className="body-jp mt-7 max-w-3xl text-xs text-ink/70">※いずれも活用例です。金融機関でのスキャンは本人の了承を得られる場合を想定しています。警察・消防などの正式な業務手順に代わるものではありません。</p>
          <Link href="/service/#use-cases" className="mt-5 inline-block text-sm text-moss underline underline-offset-4">詳しい活用シーンを見る →</Link>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="management-title">
        <div className="container-wide">
          <SectionHeading en="MANAGEMENT" title="導入後の利用状況も、まとめて管理。" id="management-title" />
          <ul className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {management.map((item) => <li key={item} className="bg-cream p-6 font-serif text-xl leading-relaxed text-deepmoss md:p-9 md:text-2xl">{item}</li>)}
          </ul>
          <p className="body-jp mt-6 text-xs text-ink/70">※管理者画面の提供範囲・権限は個別相談です。</p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="implementation-title">
        <div className="container-wide">
          <SectionHeading en="IMPLEMENTATION & PRICE" title="地域に合わせた導入方法。" id="implementation-title" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-t border-moss/40 pt-6"><h3 className="font-serif text-2xl text-deepmoss">自治体負担型</h3><p className="body-jp mt-3 text-sm">自治体がサービス利用料を負担</p></div>
            <div className="border-t border-moss/40 pt-6"><h3 className="font-serif text-2xl text-deepmoss">住民負担型</h3><p className="body-jp mt-3 text-sm">登録者がサービス利用料を負担</p></div>
          </div>
          <p className="body-jp mt-6 text-sm">※自治体ごとの契約条件は個別相談です。</p>
          <h3 id="price-title" className="mb-6 mt-10 scroll-mt-24 border-t border-ink/15 pt-8 font-serif text-2xl">料金の目安</h3>
          <dl className="max-w-4xl divide-y divide-ink/10 border-y border-ink/10">
            {prices.map((item) => <div key={item.label} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6"><dt className="text-sm text-ink/65">{item.label}</dt><dd className="font-sans text-base font-medium leading-relaxed text-ink">{item.value}</dd></div>)}
          </dl>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink/70">※サービス利用料は通話成立時のみ発生します。QRコードのスキャンだけ、または通話時間が5秒未満の場合は発生しません。通常の電話料金は別途発信者が負担します。QRコード製品の価格は未定です。</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href="/price/#pricing-title" className="text-moss underline underline-offset-4">料金について詳しく見る →</Link>
            <Link href="/service/" className="text-moss underline underline-offset-4">サービスの仕組みを見る →</Link>
          </div>
        </div>
      </section>

      <section className="scroll-mt-24 pt-20 md:scroll-mt-28 md:pt-28" aria-labelledby="faq-title">
        <div className="container-narrow">
          <SectionHeading en="FAQ" title="自治体向けのよくある質問" id="faq-title" />
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faq.map((item) => <details key={item.question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-sm font-medium leading-relaxed marker:hidden md:text-base [&::-webkit-details-marker]:hidden"><span>{item.question}</span><span aria-hidden="true" className="shrink-0 text-xl font-light text-moss group-open:rotate-45">＋</span></summary>
              <p className="body-jp pb-5 pr-8 text-sm">{item.answer}</p>
            </details>)}
          </div>
          <Link href="/faq/" className="mt-8 inline-block text-sm text-moss underline underline-offset-4">すべてのよくあるご質問を見る →</Link>
        </div>
        <div className="mt-20 bg-cream py-20 md:mt-28 md:py-28" aria-labelledby="contact-title">
          <div className="container-narrow text-center">
            <p className="eyebrow">CONTACT</p>
            <h2 id="contact-title" className="mt-6 font-serif text-[clamp(28px,3vw,42px)] font-light leading-relaxed">自治体での導入について、<br className="sm:hidden" />お気軽にご相談ください。</h2>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-10 normal-case">自治体での導入について相談する ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
