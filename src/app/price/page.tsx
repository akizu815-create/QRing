import type { Metadata } from "next";
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
      <h2 id={id} className={`mt-5 font-serif ${heading}`}>{children}</h2>
      <span className="mt-6 block h-px w-12 bg-moss/70" aria-hidden="true" />
    </div>
  );
}

function Arrow() {
  return <span className="shrink-0 text-moss/70" aria-hidden="true">→</span>;
}

function Phone() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 18h4" /></svg>;
}

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
          <SectionHeading id="session-title" en="SESSION">1セッションとは？</SectionHeading>
          <p className="body-jp max-w-3xl text-sm md:text-base">1セッションとは、QRコードが読み取られてから1時間の通話利用をまとめた単位です。1回の通話は最大3分ですが、同じ1時間以内なら再通話や折り返しができます。通話が成立した場合のサービス利用料は、通話回数にかかわらず1セッションにつき880円（税込）です。</p>
          <div className="mt-12 flex flex-col gap-5 border-y border-ink/15 py-8 md:flex-row md:items-center md:gap-7 md:py-10" aria-label="QRコード読み取りから1時間のセッション終了まで">
            <div className="md:w-1/4"><p className={label}>START</p><p className="mt-2 font-serif text-lg">QRコード読み取り</p><p className="mt-2 text-xs text-ink/65">読み取りだけでは料金は発生しません</p></div>
            <Arrow />
            <div className="border-l border-moss/50 pl-5 md:min-w-0 md:flex-1"><p className={label}>1 HOUR</p><p className="mt-2 font-serif text-xl">1時間のセッション</p><ul className="mt-3 space-y-1 text-sm leading-relaxed text-ink/75"><li>1回の通話は最大3分</li><li>再通話・折り返しが可能</li><li>同じセッション内の追加サービス利用料なし</li></ul></div>
            <Arrow />
            <div className="md:w-1/4"><p className={label}>END</p><p className="mt-2 font-serif text-lg">1時間経過で終了</p></div>
          </div>
          <p className="mt-7 font-medium leading-relaxed">1時間以内に何度通話しても、つながるQRのサービス利用料は1セッション分の880円（税込）のみです。</p>
          <p className="mt-2 text-sm text-ink/75">通常の通話料は別途かかります。</p>
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
