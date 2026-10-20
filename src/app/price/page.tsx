import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Price｜料金案内",
  description: "つながるQRの料金案内。通話が成立した1セッションにつき880円（税込）。通常の電話料金は発信した方に別途かかります。",
  alternates: { canonical: "/price/" },
};

const heading = "text-3xl font-light leading-relaxed md:text-4xl";
const label = "text-[11px] font-medium tracking-[0.32em] text-moss";

function SectionHeading({ en, id, children }: { en: string; id: string; children: React.ReactNode }) {
  return (
    <div className="mb-9 md:mb-12">
      <p className={label}>{en}</p>
      <h2 id={id} className={`mt-5 scroll-mt-24 font-serif md:scroll-mt-28 ${heading}`}>{children}</h2>
      <span className="mt-6 block h-px w-12 bg-moss/70" aria-hidden="true" />
    </div>
  );
}

function Arrow() {
  return <span className="shrink-0 text-moss/70" aria-hidden="true">→</span>;
}

function SessionCaseTitle({ title }: { title: string }) {
  const digitIndex = title.indexOf("1");
  if (digitIndex === -1) return title;

  return <>{title.slice(0, digitIndex)}<span className="font-sans font-normal tabular-nums">1</span>{title.slice(digitIndex + 1)}</>;
}

function Phone() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 18h4" /></svg>;
}

const SESSION_CASES = [
  {
    number: "01",
    title: "同じ相手なら、1時間以内は何度でも。",
    image: "/images/session-same-caller.png",
    imageAlt: "同じ相手との通話・再通話・折り返しを表す線画",
    imageWidth: 1774,
    imageHeight: 887,
    description: "同じ相手との再通話や折り返しは、1時間以内なら追加のサービス利用料はかかりません。",
    detail: "",
    price: "1セッション 880円（税込）",
    note: "1回の通話は最大3分です。1時間以内であれば、同じ相手との再通話や折り返しが可能です。",
  },
  {
    number: "02",
    title: "別の人から電話があったら？",
    image: "/images/session-two-finders.png",
    imageAlt: "登録者と異なる2人の発見者がそれぞれ通話する線画",
    imageWidth: 887,
    imageHeight: 887,
    description: "発見者が変わると、別のセッションになります。2人との通話がそれぞれ成立した場合は、合計2セッションです。",
    detail: "",
    price: "880円 × 2セッション ＝ 1,760円（税込）",
    note: "発見者が異なる場合は、1時間以内であってもそれぞれ別のセッションになります。",
  },
  {
    number: "03",
    title: "1時間を過ぎて、また電話したら？",
    image: "/images/session-rescan.png",
    imageAlt: "1時間経過後にQRコードを再スキャンする様子の線画",
    imageWidth: 1774,
    imageHeight: 887,
    description: "1時間が経過すると、そのセッションの電話番号は使えなくなります。もう一度通話するには、QRコードを再スキャンする必要があります。",
    detail: "再スキャン後に通話が成立すると、同じ相手でも新しいセッションとして880円（税込）が発生します。",
    price: "880円 × 2セッション ＝ 1,760円（税込）",
    note: "合計1,760円は、最初の通話と再スキャン後の通話が両方成立した場合の例です。",
  },
] as const;

export default function PricePage() {
  return (
    <>
      <PageHeader eyebrow="— Price" en="Price" />

      <section className="py-24 md:py-32" aria-labelledby="pricing-title">
        <div className="container-narrow">
          <SectionHeading id="pricing-title" en="PRICING">料金のご案内</SectionHeading>
          <p className="font-serif text-xl leading-relaxed md:text-2xl">必要なときだけ、使った分だけ。</p>
          <div className="mt-12 border-y border-ink/15 md:mt-16">
            <div className="grid gap-7 py-9 sm:grid-cols-2 md:gap-12">
              <div><p className="text-sm text-ink/70">登録料</p><p className="mt-2 font-serif text-4xl text-moss">0円</p></div>
              <div><p className="text-sm text-ink/70">月額基本料</p><p className="mt-2 font-serif text-4xl text-moss">0円</p></div>
            </div>
            <div className="border-t border-ink/15 py-10 md:py-12">
              <p className="text-sm text-ink/70">つながるQRサービス利用料</p>
              <p className="mt-4 font-serif text-[clamp(3.5rem,9vw,6rem)] font-light leading-none text-moss">880<span className="ml-2 text-[0.45em] text-ink">円（税込）</span></p>
              <p className="mt-4 text-sm font-medium text-ink">1セッションあたり・通話成立時のみ</p>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-ink/15 py-7">
              <p className="text-sm text-ink/70">通常の電話料金</p><p className="text-xl font-medium text-ink">別途、発信した方が負担</p>
            </div>
          </div>
          <p className="body-jp mt-8 text-sm md:text-base">QRコードを読み取っただけでは、つながるQRのサービス利用料は発生しません。通話が成立した場合に、登録者に料金が発生します。</p>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="session-title">
        <div className="container-narrow">
          <SectionHeading id="session-title" en="SESSION">セッションとは？</SectionHeading>
          <p className="body-jp max-w-3xl text-sm md:text-base">つながるQRでは、同じ相手との1時間以内の通話を「1セッション」と呼びます。1回の通話は最大3分です。</p>
          <p className="mt-5 text-sm font-medium leading-relaxed md:text-base">サービス利用料は、通話が成立した1セッションにつき<span className="font-sans font-medium tabular-nums text-moss">880円（税込）</span>です。</p>
          <div className="mt-12 md:mt-16">
            {SESSION_CASES.map((item) => (
              <article key={item.number} className={`grid gap-y-5 border-t border-ink/15 py-10 md:gap-y-4 md:py-14 ${item.number === "02" ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-x-8" : "md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-x-12"}`}>
                <header className="md:col-start-2 md:row-start-1 md:self-end">
                  <p className={label}>CASE {item.number}</p>
                  <h3 className="mt-3 font-serif text-2xl font-light leading-relaxed md:text-[1.7rem]"><SessionCaseTitle title={item.title} /></h3>
                </header>
                <div className="body-jp text-sm md:col-start-2 md:row-start-2 md:text-base">
                  <p>{item.description}</p>
                  {item.detail && <p className="mt-3">{item.detail}</p>}
                </div>
                <div className="md:col-start-2 md:row-start-3 md:self-start">
                  <p className="font-sans text-xl font-medium leading-relaxed tabular-nums text-moss md:text-2xl">{item.price}</p>
                  <p className="mt-3 text-xs leading-relaxed text-ink/70 md:text-sm">※{item.note}</p>
                </div>
                <figure className={`mx-auto w-full md:col-start-1 md:row-span-3 md:row-start-1 md:self-center ${item.number === "02" ? "max-w-[520px] overflow-hidden aspect-[5/4]" : "max-w-[420px]"}`}>
                  <Image src={item.image} alt={item.imageAlt} width={item.imageWidth} height={item.imageHeight} sizes={item.number === "02" ? "(min-width: 768px) 520px, 100vw" : "(min-width: 768px) 420px, 100vw"} className={item.number === "02" ? "h-full w-full object-cover object-center mix-blend-darken" : "h-auto w-full mix-blend-darken"} />
                </figure>
              </article>
            ))}
          </div>
          <div className="space-y-2 border-t border-ink/15 pt-8 text-xs leading-relaxed text-ink/75 md:text-sm">
            <p>※QRコードを読み取っただけではサービス利用料は発生しません。通話が成立したセッションごとに880円（税込）が発生します。</p>
            <p>※通常の電話料金は別途かかります。発信した方の通信会社・料金プランに応じた通話料が発生します。</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="call-charges-title">
        <div className="container-narrow">
          <SectionHeading id="call-charges-title" en="CALL CHARGES">通常の電話料金について</SectionHeading>
          <p className="body-jp text-sm md:text-base">つながるQRのサービス利用料とは別に、電話をかけた方には、ご契約の通信会社・料金プランに応じた通常の通話料がかかります。</p>
          <div className="mt-12 divide-y divide-ink/15 border-y border-ink/15">
            {[
              { title: "発見者から電話する場合", from: "発見者", to: "登録者", payer: "発見者" },
              { title: "登録者が折り返す場合", from: "登録者", to: "発見者", payer: "登録者" },
            ].map((call) => (
              <div className="py-8" key={call.title}>
                <h3 className="font-serif text-xl">{call.title}</h3>
                <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.5fr)_auto_minmax(0,1fr)] items-stretch gap-1 text-center text-xs leading-snug sm:gap-3 sm:text-sm" aria-label={`${call.from}がプライバシー電話番号を通じて${call.to}に発信`}>
                  <span className="flex min-w-0 flex-col items-center justify-center gap-1 border border-ink/20 px-1 py-3 sm:flex-row sm:px-3"><Phone />{call.from}<span className="text-ink/60">（発信）</span></span><span className="self-center"><Arrow /></span><span className="flex min-w-0 items-center justify-center border border-moss/40 px-1 py-3 text-moss sm:px-3">プライバシー電話番号</span><span className="self-center"><Arrow /></span><span className="flex min-w-0 flex-col items-center justify-center gap-1 border border-ink/20 px-1 py-3 sm:flex-row sm:px-3"><Phone />{call.to}<span className="text-ink/60">（着信）</span></span>
                </div>
                <p className="mt-5 text-sm font-medium">通常の通話料：{call.payer}が負担</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-medium leading-relaxed">つながるQRのサービス利用料880円（税込）／1セッションは、登録者が負担します。</p>
          <p className="body-jp mt-3 text-sm">通話料は、発信した人の通信会社・料金プランに応じて発生します。つながるQRのサービス利用料880円に通常の通話料は含まれません。</p>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="payment-title">
        <div className="container-narrow">
          <SectionHeading id="payment-title" en="PAYMENT">お支払いについて</SectionHeading>
          <p className="body-jp text-sm md:text-base">つながるQRのサービス利用料は、通話成立後に登録者へSMSとメールでご案内します。案内に記載された決済ページから、クレジットカードでお支払いください。</p>
          <p className="mt-6 border-l-2 border-moss pl-4 text-sm leading-relaxed md:text-base">お支払い期限：通話成立日の2日後、23時59分まで（日本時間）</p>
          <ol className="mt-12 grid gap-7 border-y border-ink/15 py-8 md:grid-cols-3 md:gap-10">
            {["通話成立", "SMS・メールでお支払い案内", "クレジットカードで決済"].map((step, i) => <li key={step}><span className={label}>STEP 0{i + 1}</span><p className="mt-3 font-serif text-lg">{step}</p></li>)}
          </ol>
          <p className="mt-6 text-sm text-ink/75">QRコードの読み取りだけでは請求は発生しません。</p>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="notes-title">
        <div className="container-narrow">
          <SectionHeading id="notes-title" en="IMPORTANT NOTES">料金に関するご案内</SectionHeading>
          <ul className="space-y-4 text-sm leading-loose text-ink/80 md:text-base">
            <li>つながるQRのサービス利用料は、通話が成立した場合に登録者に発生します。</li>
            <li>同一セッション内の再通話・折り返しによる、つながるQRのサービス利用料の追加請求はありません。</li>
            <li>通常の電話料金は、電話を発信した人に別途かかります。</li>
            <li>通常の通話料は各通信会社・料金プランにより異なります。</li>
            <li>QRタグ・シールなどの専用アイテム代金は、サービス利用料には含まれません。</li>
          </ul>
          <div className="mt-14 border-t border-ink/15 pt-10">
            <p className="font-serif text-xl">ご不明な点はお問い合わせください</p>
            <a href="https://axb.qring.jp/contact" target="_blank" rel="noopener noreferrer" className="btn-primary mt-7 normal-case">お問い合わせ →</a>
          </div>
        </div>
      </section>
    </>
  );
}
