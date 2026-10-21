import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import styles from "./CallFlow.module.css";

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

function SessionCaseTitle({ title }: { title: string }) {
  const digitIndex = title.indexOf("1");
  if (digitIndex === -1) return title;

  return <>{title.slice(0, digitIndex)}<span className="font-sans font-normal tabular-nums">1</span>{title.slice(digitIndex + 1)}</>;
}

function CallFlowArrow() {
  return (
    <div aria-hidden="true" className={styles.arrow}>
      <svg className={styles.arrowVertical} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 3v27m-8-8 8 8 8-8" /></svg>
      <svg className={styles.arrowHorizontal} viewBox="0 0 180 32" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h172m-12-10 12 10-12 10" /></svg>
    </div>
  );
}

function CallPortrait({ person, small = false }: { person: "finder" | "registrant"; small?: boolean }) {
  return (
    <div className={`${styles.portrait} ${small ? styles.portraitSmall : ""}`}>
      <Image
        src="/images/how-it-works-step-03.png"
        alt={person === "finder" ? "スマートフォンを操作する発見者の線画" : "電話で話す登録者の線画"}
        width={446}
        height={315}
        className={person === "finder" ? styles.finderImage : styles.registrantImage}
      />
    </div>
  );
}

function PrivacyPhoneIllustration() {
  return (
    <div className={styles.privacyIllustration}>
      <Image
        src="/images/privacy-call.png"
        alt="プライバシー電話番号を表す受話器の線画"
        fill
        sizes="184px"
        className={styles.privacyImage}
      />
    </div>
  );
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
          <p className="body-jp mt-8 text-sm md:text-base">QRコードをスキャンしただけでは、つながるQRのサービス利用料は発生しません。通話が成立した場合に、登録者に料金が発生します。</p>
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
                  <h3 id={`session-case-${item.number}`} className="mt-3 scroll-mt-24 font-serif text-2xl font-light leading-relaxed md:scroll-mt-28 md:text-[1.7rem]"><SessionCaseTitle title={item.title} /></h3>
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
            <p>※QRコードをスキャンしただけではサービス利用料は発生しません。通話が成立したセッションごとに880円（税込）が発生します。</p>
            <p>※通常の電話料金は別途かかります。発信した方の通信会社・料金プランに応じた通話料が発生します。</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="call-charges-title">
        <div className="mx-auto w-full max-w-[1360px] px-6 md:px-10 xl:px-12">
          <SectionHeading id="call-charges-title" en="CALL CHARGES">通常の電話料金について</SectionHeading>
          <p className="body-jp max-w-4xl text-sm md:text-base">つながるQRのサービス利用料とは別に、電話をかけた方には、ご契約の通信会社・料金プランに応じた通常の通話料がかかります。</p>

          <div className="mt-12 border-y border-ink/15 py-10 md:mt-16 md:py-14">
            <h3 className="text-center font-serif text-2xl font-light leading-relaxed text-ink md:text-3xl">通話時の費用のかかり方</h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-ink/65">発見者から登録者へ電話をかける場合</p>

            <div className={styles.flow}>
              <div className={styles.role}>
                <p className={styles.roleLabel}>発見者</p>
                <p className={styles.roleDescription}>QRコードをスキャンした人</p>
                <div className={styles.roleIllustration}><CallPortrait person="finder" /></div>
              </div>

              <div className={styles.charge}>
                <div className={styles.chargeSpacer} aria-hidden="true" />
                <div className={styles.chargeBody}>
                  <CallFlowArrow />
                  <div className={`${styles.chargeCard} ${styles.callCharge}`}>
                    <h4 className={styles.chargeTitle}>通常の電話料金</h4>
                    <p>発信者の通信会社・料金プランに応じて発生します。</p>
                    <p className={`${styles.payer} ${styles.callerPayer}`}>発信者負担</p>
                  </div>
                </div>
              </div>

              <div className={styles.role}>
                <p className={styles.roleLabel}>プライバシー電話番号</p>
                <p className={styles.roleDescription}>お互いの電話番号を知らせずにつながる番号</p>
                <div className={styles.roleIllustration}><PrivacyPhoneIllustration /></div>
              </div>

              <div className={styles.charge}>
                <div className={styles.chargeSpacer} aria-hidden="true" />
                <div className={styles.chargeBody}>
                  <CallFlowArrow />
                  <div className={`${styles.chargeCard} ${styles.serviceCharge}`}>
                    <h4 className={styles.chargeTitle}>つながるQR<br />サービス利用料</h4>
                    <p>通話が成立した場合、1セッションにつき<span className="font-sans font-semibold tabular-nums">880円（税込）</span>が発生します。</p>
                    <p className={`${styles.payer} ${styles.registrantPayer}`}>登録者負担</p>
                  </div>
                </div>
              </div>

              <div className={styles.role}>
                <p className={styles.roleLabel}>登録者</p>
                <p className={styles.roleDescription}>QRコードを登録した人</p>
                <div className={styles.roleIllustration}><CallPortrait person="registrant" /></div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6 border-t border-dashed border-moss/40 bg-cream/40 px-6 py-8 md:flex-row md:gap-10 md:px-10">
              <div className="shrink-0"><CallPortrait person="registrant" small /></div>
              <div className="min-w-0">
                <h4 className="font-serif text-xl text-deepmoss">登録者が折り返す場合</h4>
                <p className="body-jp mt-3 text-sm md:text-base">登録者が着信履歴に残ったプライバシー電話番号へ折り返す場合、通常の電話料金は登録者の負担となります。</p>
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-3 rounded-2xl bg-white/50 px-6 py-7 text-sm leading-relaxed text-ink/80 md:px-10 md:text-base">
            <li>・QRコードをスキャンしただけでは、サービス利用料は発生しません。</li>
            <li>・発見者が電話をかける際の通常の電話料金は、発見者の負担です。</li>
            <li>・通話が成立した場合、登録者に1セッション<span className="font-sans font-medium tabular-nums">880円（税込）</span>のサービス利用料が発生します。</li>
            <li>・登録者が折り返す場合、通常の電話料金は登録者の負担です。</li>
          </ul>
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
          <p className="mt-6 text-sm text-ink/75">QRコードのスキャンだけでは請求は発生しません。</p>
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
