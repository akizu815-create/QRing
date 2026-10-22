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
  "ご本人から必要な情報を聞き取れない",
  "ご家族などへの連絡経路が見つからない",
  "関係機関をまたぐ対応が求められる",
  "位置情報機器に頼れない場面もある",
];

const steps = [
  { title: "QRコードを身につける", body: "利用者が登録したQRコードを身につけ、外出時の連絡手段を備えます。" },
  { title: "発見者がスキャンする", body: "発見した方がスマートフォンでQRコードをスキャンします。専用アプリは不要です。" },
  { title: "プライバシー電話番号を介して発信する", body: "お互いの電話番号を公開せずに、表示された番号へ発信します。" },
  { title: "登録先と直接通話する", body: "ご家族などの登録先と、発見時の状況を直接会話できます。" },
];

const useCases = [
  { title: "警察・地域安全", body: "高齢者を保護した際、ご本人が連絡先を伝えられなくても、QRコードがあれば登録先へ連絡する手段になります。既存の保護・連絡手順を補完する活用例です。" },
  { title: "消防・救急", body: "救急対応時に、ご家族などの登録先への連絡を支援します。現場の状況を直接伝えるための一つの手段として検討できます。" },
  { title: "高齢者福祉・地域包括支援", body: "地域の見守り活動で、発見後の連絡手段として活用できます。GPSや既存の見守りネットワークと併用する想定です。" },
  { title: "防災・動物愛護", body: "ペット防災の場面では、保護した方と飼い主の連絡を支援できます。電話番号を公開せずに状況を伝えられます。" },
  { title: "金融機関・地域安全", body: "特殊詐欺が疑われる場面で、本人の了承を得てQRコードをスキャンできる場合の連絡支援として検討できます。警察・金融機関への相談に代わるものではありません。" },
];

const benefits = [
  { title: "発見後の直接通話", body: "発見者から登録先へ、状況を直接伝えられる連絡手段を加えられます。" },
  { title: "既存施策との併用", body: "GPSや見守りネットワークを置き換えず、別の連絡経路として併用できます。" },
  { title: "固定費を抑えた料金設計", body: "登録料・月額基本料は無料。利用に応じた費用負担を検討できます。" },
  { title: "利用状況の把握", body: "管理者画面を通じて、見守り事業の運用状況や費用の確認を支援します。" },
];

const management = [
  "QRコードの登録数・利用者数",
  "通話成立件数・利用日時",
  "QRコードごとの利用履歴",
  "利用料金・請求状況",
  "その他の管理機能",
];

const implementation = [
  "対象住民や配布方法の検討",
  "QRコード製品の準備・配布",
  "利用者や家族による登録",
  "地域の見守り活動で利用",
  "管理者画面による利用状況の確認",
];

const prices = [
  { label: "登録料", value: "無料" },
  { label: "月額基本料", value: "無料" },
  { label: "導入時に必要な費用", value: "QRコード製品の購入費用" },
  { label: "一般向け利用料", value: "通話成立時、1セッション880円（税込）" },
  { label: "発見者のサービス利用料", value: "無料" },
  { label: "通常の電話料金", value: "発信者負担" },
];

const faq = [
  { question: "既存の見守りサービスと併用できますか？", answer: "はい。GPSや地域の見守りネットワークなどと併用し、発見後の連絡手段としてご検討いただけます。" },
  { question: "導入時に必要な費用はありますか？", answer: "QRコード製品の購入費用が必要です。製品の金額や自治体での導入条件については個別にご相談ください。" },
  { question: "サービス利用料は誰が負担しますか？", answer: "一般向けの利用料は、通話が成立した1セッションにつき880円（税込）です。通話時間が5秒未満の場合、サービス利用料は発生しません。自治体負担型・住民負担型のいずれもご相談いただけます。具体的な負担方法は個別にご案内します。" },
  { question: "管理者画面では何を確認できますか？", answer: "QRコードの登録数や利用者数、通話成立件数・利用日時、QRコードごとの利用履歴、利用料金・請求状況などを確認できます。提供範囲は個別にご相談ください。" },
  { question: "お互いの電話番号は表示されますか？", answer: "いいえ。プライバシー電話番号を介して通話するため、お互いの本来の電話番号は相手に表示されません。" },
  { question: "QRコードをスキャンすれば必ず連絡できますか？", answer: "いいえ。スキャン後に発見者が発信し、登録先との通話が成立する必要があります。スキャンのみで通話が始まる仕組みではありません。" },
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
              認知症高齢者の見守りに、<span className="text-moss">発見後の連絡</span>という選択肢を。
            </h1>
            <div className="body-jp mt-8 max-w-2xl space-y-5 text-sm md:text-base">
              <p>「つながるQR」は、身につけたQRコードを発見者がスキャンすることで、お互いの電話番号を公開せず、登録先と直接通話できるサービスです。</p>
              <p>認知症高齢者の見守りをはじめ、既存の見守り施策を補完する新たな連絡手段として、自治体での活用をご検討いただけます。</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-deepmoss md:text-sm">
              <li>専用アプリ不要</li><li>お互いの電話番号は非公開</li><li>登録料・月額基本料0円</li>
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Image src="/images/municipalities-hero.png" alt="屋外を一緒に歩く高齢女性と若い女性。高齢女性のバッグにQRコードのタグが付いている" width={1672} height={941} priority sizes="(min-width: 1024px) 48vw, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="challenges-title">
        <div className="container-wide">
          <SectionHeading en="CHALLENGES" title="保護された高齢者の連絡先がわからない。そのとき、どう対応していますか？" id="challenges-title" />
          <p className="body-jp max-w-3xl text-base">認知症高齢者などが外出先で保護された際、ご本人から氏名やご家族の連絡先を確認できず、対応に時間を要することがあります。</p>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {challenges.map((item) => <li key={item} className="py-4 text-sm leading-relaxed md:text-base">{item}</li>)}
              </ul>
              <p className="body-jp mt-7 text-sm">特殊詐欺が疑われる場面でも、本人の了承を得たうえで登録先への連絡を支援する活用が考えられます。被害防止の効果を保証するものではありません。</p>
            </div>
            <Image src="/images/municipalities-challenges.png" alt="連絡先を伝えにくい高齢者、関係機関の連絡調整、見守り機器を持たない場合や特殊詐欺が疑われる場面を示す図" width={1536} height={1024} sizes="(min-width: 1024px) 52vw, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="solution-title">
        <div className="container-wide">
          <SectionHeading en="SOLUTION" title="発見したその場から、ご家族などの登録先へ直接通話。" id="solution-title" />
          <ol className="grid gap-8 border-t border-ink/15 pt-9 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => <li key={step.title} className="border-b border-ink/10 pb-7">
              <span className="font-sans text-xl font-medium tabular-nums text-moss">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-xl leading-relaxed md:text-2xl">{step.title}</h3>
              <p className="body-jp mt-4 text-sm">{step.body}</p>
            </li>)}
          </ol>
          <p className="body-jp mt-8 text-sm">※GPSによる位置追跡、自動発見、公的な本人確認を行うサービスではありません。詳しい仕組みは<Link href="/service/#privacy-call" className="ml-1 text-moss underline underline-offset-4">プライバシー電話番号について</Link>をご覧ください。</p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="use-cases-title">
        <div className="container-wide">
          <SectionHeading en="USE CASES" title="地域のさまざまな場面で、発見後の連絡をサポート。" id="use-cases-title" />
          <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
            {useCases.map((item) => <article key={item.title} className="bg-ivory p-7 md:p-9">
              <h3 className="font-serif text-xl leading-relaxed md:text-2xl">{item.title}</h3>
              <p className="body-jp mt-4 text-sm">{item.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="benefits-title">
        <div className="container-wide">
          <SectionHeading en="BENEFITS" title="既存の見守り施策に、もうひとつの連絡手段を。" id="benefits-title" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, index) => <article key={item.title} className="border-t border-moss/40 pt-5">
              <span className="font-sans text-sm font-medium tabular-nums text-moss">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-xl leading-relaxed">{item.title}</h3>
              <p className="body-jp mt-3 text-sm">{item.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="management-title">
        <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5"><SectionHeading en="MANAGEMENT" title="管理者画面で、利用状況を見える化。" id="management-title" /><p className="body-jp text-sm md:text-base">自治体の見守り事業における運用状況の把握や費用管理を支援します。画面の提供範囲は個別にご相談ください。</p></div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-7">
            {management.map((item, index) => <li key={item} className="flex gap-5 py-5 text-sm md:text-base"><span className="font-sans tabular-nums text-moss">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="implementation-title">
        <div className="container-wide">
          <SectionHeading en="IMPLEMENTATION" title="地域の実情に合わせた、柔軟な導入方法。" id="implementation-title" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {implementation.map((item, index) => <li key={item} className="border-t border-moss/40 pt-4"><span className="font-sans text-sm tabular-nums text-moss">STEP {String(index + 1).padStart(2, "0")}</span><p className="mt-3 text-sm leading-loose md:text-base">{item}</p></li>)}
          </ol>
          <div className="mt-12 grid gap-8 border-t border-ink/15 pt-9 md:grid-cols-2">
            <div><h3 className="font-serif text-2xl">自治体負担型</h3><p className="body-jp mt-3 text-sm">自治体がサービス利用料を負担し、住民へ提供する方式です。</p></div>
            <div><h3 className="font-serif text-2xl">住民負担型</h3><p className="body-jp mt-3 text-sm">自治体がサービスを周知し、登録者が利用料を負担する方式です。</p></div>
          </div>
          <p className="body-jp mt-8 text-sm">具体的な契約条件や請求方法は個別にご相談ください。</p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="price-title">
        <div className="container-wide">
          <SectionHeading en="PRICE" title="必要なときだけ利用できる料金設計。" id="price-title" />
          <dl className="max-w-4xl divide-y divide-ink/10 border-y border-ink/10">
            {prices.map((item) => <div key={item.label} className="grid gap-1 py-5 sm:grid-cols-[220px_1fr] sm:gap-6"><dt className="text-sm text-ink/65">{item.label}</dt><dd className="font-sans text-base font-medium leading-relaxed text-ink">{item.value}</dd></div>)}
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-ink/65">※通話時間が5秒未満の場合、サービス利用料は発生しません。</p>
          <p className="body-jp mt-7 text-sm">QRコード製品の金額は未定です。自治体での費用負担方法は、対象人数や運用方法に応じて個別にご相談ください。料金の詳しい条件は<Link href="/price/#pricing-title" className="ml-1 text-moss underline underline-offset-4">料金のご案内</Link>をご覧ください。</p>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="other-use-cases-title">
        <div className="container-wide">
          <SectionHeading en="OTHER USE CASES" title="高齢者の見守りから、地域のさまざまな『もしも』へ。" id="other-use-cases-title" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-t border-ink/20 pt-5"><h3 className="font-serif text-xl">ペット防災</h3><p className="body-jp mt-3 text-sm">災害時などに保護されたペットと飼い主の連絡を支援します。</p></div>
            <div className="border-t border-ink/20 pt-5"><h3 className="font-serif text-xl">公共施設での落とし物</h3><p className="body-jp mt-3 text-sm">見つかった持ち物から、持ち主への連絡手段を用意できます。</p></div>
            <div className="border-t border-ink/20 pt-5"><h3 className="font-serif text-xl">地域の連絡支援</h3><p className="body-jp mt-3 text-sm">地域の事情に応じた、発見後の連絡の仕組みとして活用を検討できます。</p></div>
          </div>
          <Link href="/service/#use-cases" className="mt-8 inline-block text-sm text-moss underline underline-offset-4">その他の活用シーンを見る →</Link>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="faq-title">
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
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="contact-title">
        <div className="container-narrow text-center">
          <p className="eyebrow">CONTACT</p>
          <h2 id="contact-title" className="mt-6 font-serif text-[clamp(28px,3vw,42px)] font-light leading-relaxed">自治体での導入について、<br className="sm:hidden" />お気軽にご相談ください。</h2>
          <p className="body-jp mx-auto mt-7 max-w-2xl text-sm md:text-base">高齢者福祉課、認知症施策担当、地域包括支援センター、地域安全・防災担当部署などからのご相談をお待ちしています。</p>
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-10 normal-case">自治体での導入について相談する ↗</a>
        </div>
      </section>
    </>
  );
}
