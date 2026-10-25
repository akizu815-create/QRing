import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import Image from "next/image";
import Link from "next/link";

const contactUrl = "https://axb.qring.jp/contact";
const sectionClass = "scroll-mt-24 py-20 md:scroll-mt-28 md:py-28";
const linkClass = "link-underline inline-block text-sm leading-7 text-moss transition-colors duration-300 hover:text-ink";

function SectionHeading({ en, title, id }: { en: string; title: string; id: string }) {
  return <div className="mb-10 md:mb-14"><p className="eyebrow">{en}</p><h2 id={id} className="mt-6 max-w-4xl font-serif text-[clamp(28px,3.5vw,46px)] font-light leading-[1.6]">{title}</h2></div>;
}
const challenges = [
  "高齢者を保護しても、ご家族への連絡先がすぐにわからない",
  "ご家族への連絡や関係機関との調整が必要になる",
  "既存の見守り施策だけでは、発見後の連絡を十分に支援できない場合がある",
];
const benefits = [
  { title: "発見後の連絡・調整を支援", body: "発見者からご家族などの登録先へ直接連絡できる手段を用意することで、連絡先の確認や関係機関との調整を支援します。" },
  { title: "既存の見守り施策を補完", body: "SOSネットワークやGPS、地域の見守り活動など、すでに実施している施策を活かしながら、発見後の連絡手段を追加できます。" },
  { title: "利用状況を把握し、施策の検証に活用", body: "登録状況や通話実績などを把握することで、試験導入後の利用状況の確認や施策の評価に役立てることを目指します。", note: "管理機能の提供範囲・確認できる項目・権限は個別にご確認ください。" },
  { title: "住民に寄り添う自治体の姿勢を示す", body: "認知症高齢者やご家族の不安に目を向け、地域の助け合いを支える新たな取り組みとして、住民サービスの充実につなげます。" },
];
const steps = [
  { title: "QRコードをスキャン", body: "発見者が、身につけたQRコードをスマートフォンで読み取ります。" },
  { title: "登録先へ電話", body: "画面の案内から、ご家族などの登録先へ発信します。" },
  { title: "電話番号を公開せず通話", body: "登録先が応答すると、プライバシー電話番号を通じて通話できます。" },
];
const complements = [
  { title: "見守りネットワーク", body: "関係機関が連携する仕組みに、発見後の連絡という選択肢を加えます。" },
  { title: "GPS", body: "位置を確認する手段と、発見後に登録先へ連絡する手段を組み合わせて備えられます。" },
  { title: "地域の見守り活動", body: "地域の方が声をかけた後、必要な登録先へ連絡できる手段を用意します。" },
];
const management = ["登録QRコード数", "利用者数", "通話成立件数・履歴", "利用料金・請求状況"];
const prices = [
  { label: "登録料", value: "無料" },
  { label: "月額基本料", value: "無料" },
  { label: "通話成立時", value: "1セッション880円（税込・一般向け料金）" },
  { label: "QRコード製品代", value: "別途" },
  { label: "発見者のサービス利用料", value: "無料" },
  { label: "通常の電話料金", value: "発信者負担" },
];

const faq = [
  { question: "既存の見守りサービスと併用できますか？", answer: "はい。GPSや地域の見守りネットワークを置き換えるのではなく、発見後の連絡手段として補完します。既存施策との運用上の連携方法は個別にご相談ください。" },
  { question: "登録は自治体職員が行いますか？住民自身が行いますか？", answer: "登録を担当する方や住民への案内方法は、地域の運用に合わせて確認する事項です。現時点で一律の登録方式を定めてご案内するものではありません。" },
  { question: "費用は誰が負担しますか？", answer: "自治体負担・住民負担など、ご希望の運用をお聞かせください。採用できる方式、費用負担の範囲、契約条件は個別に確認・ご案内します。" },
  { question: "管理者画面では何を確認できますか？", answer: "登録QRコード数、利用者数、通話成立件数・履歴、利用料金・請求状況について、必要な管理項目をお聞かせください。利用できる項目と実装・提供状況、権限の範囲は、導入相談時に個別にご確認ください。" },
];

export const metadata = pageMetadata("municipalities");

export default function MunicipalitiesPage() {
  return (
    <>
      <PageStructuredData page="municipalities" />
      <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48" aria-labelledby="municipalities-title">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow">FOR MUNICIPALITIES</p>
            <h1 id="municipalities-title" className="mt-8 font-serif text-[clamp(32px,4vw,56px)] font-light leading-[1.6] tracking-tight">地域の見守りに、<br /><span className="text-moss">つながる仕組みを。</span></h1>
            <p className="body-jp mt-8 text-base text-ink/80">高齢者の見守りに、発見後の連絡という新たな選択肢を。</p>
            <p className="body-jp mt-5 text-sm text-ink/70 md:text-base">「つながるQR」は、地域の善意を連絡という行動につなぎ、自治体の見守り施策を補完するサービスです。</p>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-9 normal-case">自治体での導入を相談する</a>
          </div>
          <div className="lg:col-span-6"><Image src="/images/municipalities-hero.png" alt="屋外を一緒に歩く高齢女性と若い女性。高齢女性のバッグにQRコードのタグが付いている" width={1672} height={941} priority sizes="(min-width: 1024px) 48vw, 100vw" className="h-auto w-full" /></div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="challenges-title">
        <div className="container-wide"><SectionHeading en="CHALLENGES" title="見守りの現場に、こんな課題はありませんか。" id="challenges-title" />
          <ol className="grid gap-6 md:grid-cols-3">{challenges.map((item, i) => <li key={item} className="border-t border-moss/30 pt-6"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-5 font-serif text-xl font-light leading-relaxed md:text-2xl">{item}</h3></li>)}</ol>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="benefits-title">
        <div className="container-wide"><SectionHeading en="BENEFITS" title="自治体の見守りを、もっと円滑に。" id="benefits-title" />
          <div className="grid gap-6 md:grid-cols-2">{benefits.map((item, i) => <article key={item.title} className="bg-ivory p-7 md:p-10"><p className="text-xs tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-5 font-serif text-2xl font-light leading-relaxed text-moss">{item.title}</h3><p className="body-jp mt-5 text-sm text-ink/75">{item.body}</p>{item.note && <p className="body-jp mt-4 text-xs text-ink/55">※{item.note}</p>}</article>)}</div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="connection-title">
        <div className="container-wide"><SectionHeading en="HOW IT CONNECTS" title="発見した方から、ご家族などの登録先へ。" id="connection-title" />
          <ol className="grid gap-7 md:grid-cols-3">{steps.map((item, i) => <li key={item.title} className="border-t border-moss/30 py-6"><p className="text-xs tracking-[0.2em] text-moss">STEP 0{i + 1}</p><h3 className="mt-5 font-serif text-2xl font-light leading-relaxed">{item.title}</h3><p className="body-jp mt-4 text-sm text-ink/70">{item.body}</p></li>)}</ol>
          <Link href="/service/" className={`${linkClass} mt-6`}>サービスの仕組みを見る →</Link>
        </div>
      </section>

      <section className={`${sectionClass} bg-ivory`} aria-labelledby="complements-title">
        <div className="container-wide"><SectionHeading en="WORKING TOGETHER" title="いまある見守りに、連絡の選択肢を。" id="complements-title" />
          <div className="grid gap-6 md:grid-cols-3">{complements.map((item) => <article key={item.title} className="border-t border-moss/30 py-6"><h3 className="font-serif text-2xl font-light text-moss">{item.title}</h3><p className="body-jp mt-5 text-sm text-ink/70">{item.body}</p></article>)}</div>
          <p className="body-jp mt-6 max-w-3xl text-sm text-ink/65">従来の取り組みを置き換えるものではありません。新たな連絡手段としての併用を想定し、既存システムとの接続や情報連携の可否は個別に確認します。</p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="management-title">
        <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5"><SectionHeading en="MANAGEMENT & OPERATION" title="導入前に、管理と運用を確かめる。" id="management-title" /><p className="body-jp text-sm text-ink/70">地域で必要な管理項目と、提供可能な機能・権限の範囲を確認しながら、導入・運用方法をご相談いただけます。</p></div>
          <div className="md:col-span-7"><h3 className="text-sm font-medium text-moss">管理機能の確認・相談項目</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{management.map((item) => <li key={item} className="bg-cream p-5 text-sm leading-7">{item}</li>)}</ul><p className="body-jp mt-5 text-xs text-ink/60">※上記すべての実装・提供を確約するものではありません。利用できる項目、提供時期、閲覧権限は導入相談時に確認します。</p>
          <h3 className="mt-9 text-sm font-medium text-moss">あわせて確認する運用事項</h3><ul className="body-jp mt-4 space-y-2 text-sm text-ink/70"><li>登録を担当する方と、住民への案内・問い合わせ対応</li><li>QRコードの配布方法と登録情報の管理</li><li>既存施策との役割分担、費用負担と契約条件</li></ul></div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="implementation-title">
        <div className="container-wide"><SectionHeading en="IMPLEMENTATION & PRICE" title="地域に合う運用と、費用の考え方。" id="implementation-title" />
          <p className="body-jp max-w-3xl text-sm text-ink/70">自治体負担・住民負担など、ご希望の費用負担方式をお聞かせください。採用できる方式や具体的な負担範囲、契約条件は個別に確認します。</p>
          <h3 id="price-title" className="mb-6 mt-10 scroll-mt-24 border-t border-ink/15 pt-8 font-serif text-2xl font-light">料金の目安</h3>
          <dl className="max-w-4xl divide-y divide-ink/10 border-y border-ink/10">{prices.map((item) => <div key={item.label} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6"><dt className="text-sm text-ink/65">{item.label}</dt><dd className="font-sans text-base font-medium leading-relaxed text-ink">{item.value}</dd></div>)}</dl>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink/70">※サービス利用料は通話成立時のみ発生します。QRコードのスキャンだけ、または通話時間が5秒未満の場合は発生しません。通常の電話料金は別途発信者が負担します。QRコード製品の価格は未定です。</p>
          <Link href="/price/#pricing-title" className={`${linkClass} mt-6`}>料金について詳しく見る →</Link>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="faq-title">
        <div className="container-narrow"><SectionHeading en="FAQ" title="導入・運用に関するご質問" id="faq-title" />
          <div className="divide-y divide-ink/10 border-y border-ink/10">{faq.map((item) => <details key={item.question} className="group py-1"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-sm font-medium leading-relaxed marker:hidden md:text-base [&::-webkit-details-marker]:hidden"><span>{item.question}</span><span aria-hidden="true" className="shrink-0 text-xl font-light text-moss group-open:rotate-45">＋</span></summary><p className="body-jp pb-5 pr-8 text-sm text-ink/70">{item.answer}</p></details>)}</div>
          <Link href="/faq/" className={`${linkClass} mt-7`}>すべてのよくあるご質問を見る →</Link>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`} aria-labelledby="contact-title">
        <div className="container-narrow text-center"><p className="eyebrow">CONTACT</p><h2 id="contact-title" className="mt-7 font-serif text-[clamp(28px,3.5vw,46px)] font-light leading-relaxed">地域の見守りに合うか、<br />まずはご相談ください。</h2><a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-9 normal-case">自治体での導入を相談する</a></div>
      </section>
    </>
  );
}
