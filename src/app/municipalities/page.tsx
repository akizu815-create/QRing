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
  "ご本人が氏名や連絡先を伝えられない",
  "ご家族などへの連絡経路がわからない",
  "警察や福祉などの関係機関で連絡調整が必要になる",
  "GPS等の機器を携行していない場合がある",
];

const useCases = [
  { title: "警察・地域安全", body: "高齢者の保護時に、ご家族などの登録先へ連絡する手段として活用できます。" },
  { title: "消防・救急", body: "救急対応時に、ご家族などへの連絡を支援します。緊急対応の正式な手順に代わるものではありません。" },
  { title: "高齢者福祉・地域包括支援", body: "地域の見守り活動や、発見後の連絡支援に活用できます。" },
  { title: "金融機関・地域安全", body: "特殊詐欺が疑われる場面で、本人の了承を得てQRコードをスキャンできる場合の連絡支援として活用を検討できます。警察や金融機関への相談に代わるものではありません。" },
  { title: "防災・動物愛護", body: "災害時に保護されたペットと飼い主をつなぐ連絡手段として活用できます。" },
];

const benefits = [
  { title: "発見後の連絡手段を増やせる", paragraphs: ["ご本人が氏名やご家族の連絡先を伝えられない場合でも、身につけたQRコードを通じて登録先への連絡を試みることができます。", "警察や地域の見守り関係者などが、発見時の状況を直接伝えるための新たな手段になります。"] },
  { title: "固定費を抑えて導入を検討できる", paragraphs: ["登録料・月額基本料は無料です。", "サービス利用料は通話成立時に発生するため、実際の利用頻度が予測しにくい見守り事業でも、費用負担を検討しやすい料金設計です。", "※QRコード製品の購入費用は別途必要です。"] },
  { title: "利用状況を把握・管理できる", paragraphs: ["管理者画面では、QRコードの登録数、利用者数、通話成立件数、利用履歴、料金・請求状況などを確認できます。", "事業の運用状況の把握や、利用実績の確認、費用管理に活用できます。", "※自治体ごとの提供範囲や権限は個別相談です。"] },
  { title: "既存の見守り施策を補完できる", paragraphs: ["GPS機器や地域の見守りネットワークとは異なり、発見・保護された後の連絡を支援する仕組みです。", "既存の制度や取り組みと併用することで、地域の見守りに新しい連絡手段を追加できます。"] },
];

const management = [
  "QRコードの登録数・利用者数",
  "通話成立件数・利用日時",
  "QRコードごとの利用履歴",
  "利用料金・請求状況",
];

const implementation = [
  "対象者・配布方法の検討",
  "QRコード製品の準備・配布",
  "利用者やご家族による登録",
  "見守り活動での利用",
  "管理者画面による利用状況の確認",
];

const prices = [
  { label: "登録料", value: "無料" },
  { label: "月額基本料", value: "無料" },
  { label: "一般向け利用料", value: "通話成立時、1セッション880円（税込）" },
  { label: "QRコード製品の購入費用", value: "別途必要" },
  { label: "発見者のサービス利用料", value: "無料" },
  { label: "通常の電話料金", value: "発信者が契約する通信事業者の料金に従う" },
];

const faq = [
  { question: "既存の見守りサービスと併用できますか？", answer: "はい。GPSや地域の見守りネットワークなどと併用し、発見後の連絡手段としてご検討いただけます。" },
  { question: "導入時に必要な費用はありますか？", answer: "QRコード製品の購入費用が必要です。製品の金額や自治体での導入条件については個別にご相談ください。" },
  { question: "サービス利用料は誰が負担しますか？", answer: "自治体負担型と住民負担型のいずれもご相談いただけます。一般向けの利用料は、通話が成立した1セッションにつき880円（税込）です。具体的な負担方法は個別にご案内します。" },
  { question: "管理者画面では何を確認できますか？", answer: "QRコードの登録数や利用者数、通話成立件数・利用日時、QRコードごとの利用履歴、利用料金・請求状況などを確認できます。提供範囲は個別にご相談ください。" },
  { question: "導入前に相談できますか？", answer: "はい。対象者や配布方法、費用負担の方法など、自治体の運用に合わせた導入についてご相談いただけます。" },
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
              高齢者の保護からご家族への連絡まで。<br />地域の見守りに、<span className="text-moss">新しい選択肢</span>を。
            </h1>
            <div className="body-jp mt-8 max-w-2xl space-y-4 text-sm md:text-base">
              <p>認知症高齢者などが保護された際、ご家族への連絡先がすぐにわからないことがあります。</p>
              <p>「つながるQR」は、発見者と登録先が、お互いの電話番号を公開せず直接通話できる連絡サービスです。</p>
              <p>既存の見守り施策を補完する手段として、自治体の運用に合わせた導入をご提案します。</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-deepmoss md:text-sm">
              <li>登録料・月額基本料0円</li><li>管理者画面で利用状況を確認</li><li>既存の見守り施策と併用可能</li>
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
          <SectionHeading en="BENEFITS" title="自治体の見守り施策に、4つのメリット。" id="benefits-title" />
          <div className="body-jp mb-10 max-w-3xl space-y-3 text-base md:mb-12">
            <p>つながるQRは、既存の見守り施策を置き換えるものではありません。</p>
            <p>高齢者が発見・保護された後の連絡手段を加え、地域の実情に合わせた見守り体制づくりを支援します。</p>
          </div>
          <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
            {benefits.map((item, index) => <article key={item.title} className="bg-ivory p-7 md:p-9">
              <span className="font-sans text-base font-medium tabular-nums text-moss">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-serif text-xl leading-relaxed md:text-2xl">{item.title}</h3>
              <div className="body-jp mt-4 space-y-3 text-sm">{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="challenges-title">
        <div className="container-wide">
          <SectionHeading en="CHALLENGES" title="発見・保護された高齢者の連絡先がわからない。" id="challenges-title" />
          <p className="body-jp max-w-3xl text-base">認知症高齢者などが外出先で保護された際、ご本人から必要な情報を聞き取れず、ご家族への連絡に時間を要する場合があります。</p>
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
          <SectionHeading en="USE CASES" title="地域のさまざまな場面で、連絡を支援。" id="use-cases-title" />
          <p className="body-jp mb-9 max-w-3xl text-sm md:text-base">以下は、地域で想定される活用場面です。</p>
          <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
            {useCases.map((item) => <article key={item.title} className="bg-ivory p-7 md:p-9">
              <h3 className="font-serif text-xl leading-relaxed md:text-2xl">{item.title}</h3>
              <p className="body-jp mt-4 text-sm">{item.body}</p>
            </article>)}
          </div>
          <p className="body-jp mt-7 text-sm">公共施設での落とし物や、地域の連絡支援にも活用を検討できます。</p>
          <Link href="/service/#use-cases" className="mt-5 inline-block text-sm text-moss underline underline-offset-4">その他の活用シーンを見る →</Link>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="management-title">
        <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SectionHeading en="MANAGEMENT" title="導入後の利用状況も、管理者画面で確認。" id="management-title" />
            <div className="body-jp space-y-4 text-sm md:text-base">
              <p>管理者画面では、配布したQRコードの登録状況や通話成立件数、利用履歴、料金・請求状況などを確認できます。</p>
              <p>見守り事業の運用状況や利用実績を把握し、費用管理や次年度の予算検討に活用するための情報を確認できます。</p>
              <p>自治体ごとの提供範囲や権限は個別にご相談ください。</p>
            </div>
          </div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-7">
            {management.map((item, index) => <li key={item} className="flex gap-5 py-5 text-sm md:text-base"><span className="font-sans tabular-nums text-moss">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="implementation-title">
        <div className="container-wide">
          <SectionHeading en="IMPLEMENTATION & PRICE" title="地域の実情に合わせた導入方法と料金設計。" id="implementation-title" />
          <h3 className="mb-6 font-serif text-2xl">導入の流れ</h3>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {implementation.map((item, index) => <li key={item} className="border-t border-moss/40 pt-4"><span className="font-sans text-sm tabular-nums text-moss">STEP {String(index + 1).padStart(2, "0")}</span><p className="mt-3 text-sm leading-loose md:text-base">{item}</p></li>)}
          </ol>
          <h3 className="mb-6 mt-12 border-t border-ink/15 pt-9 font-serif text-2xl">費用負担の方法</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div><h4 className="font-serif text-xl">自治体負担型</h4><p className="body-jp mt-3 text-sm">自治体がサービス利用料を負担して住民へ提供する方式です。</p></div>
            <div><h4 className="font-serif text-xl">住民負担型</h4><p className="body-jp mt-3 text-sm">自治体が周知や配布を行い、登録者がサービス利用料を負担する方式です。</p></div>
          </div>
          <p className="body-jp mt-7 text-sm">いずれも具体的な導入条件や自治体での費用負担方法は、対象人数や運用方法に応じて個別にご相談ください。</p>
          <h3 id="price-title" className="mb-6 mt-12 scroll-mt-24 border-t border-ink/15 pt-9 font-serif text-2xl">料金情報</h3>
          <dl className="max-w-4xl divide-y divide-ink/10 border-y border-ink/10">
            {prices.map((item) => <div key={item.label} className="grid gap-1 py-5 sm:grid-cols-[220px_1fr] sm:gap-6"><dt className="text-sm text-ink/65">{item.label}</dt><dd className="font-sans text-base font-medium leading-relaxed text-ink">{item.value}</dd></div>)}
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-ink/65">※通話時間が5秒未満の場合、サービス利用料は発生しません。</p>
          <p className="body-jp mt-7 text-sm">QRコード製品の金額は未定です。料金の詳しい条件は<Link href="/price/#pricing-title" className="ml-1 text-moss underline underline-offset-4">料金のご案内</Link>をご覧ください。</p>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="how-it-works-title">
        <div className="container-wide">
          <SectionHeading en="HOW IT WORKS" title="QRコードから、登録先と直接通話。" id="how-it-works-title" />
          <div className="body-jp max-w-3xl space-y-4 text-base">
            <p>発見者がQRコードをスキャンし、画面から電話をかけることで、プライバシー電話番号を介して登録先へ連絡できます。</p>
            <p>お互いの電話番号は相手に公開されません。</p>
          </div>
          <Link href="/service/" className="mt-8 inline-block text-sm text-moss underline underline-offset-4">サービスの仕組みを見る →</Link>
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
            <p className="body-jp mx-auto mt-7 max-w-2xl text-sm md:text-base">高齢者福祉課、認知症施策担当、地域包括支援センター、地域安全・防災担当部署などからのご相談をお待ちしています。</p>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-10 normal-case">自治体での導入について相談する ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
