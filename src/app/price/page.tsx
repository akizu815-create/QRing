import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import styles from "./CallFlow.module.css";


const heading = "text-3xl font-light leading-relaxed md:text-4xl";
const label = "text-[11px] font-medium tracking-[0.32em] text-ink/60";

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
        src={person === "finder" ? "/images/call-woman.png" : small ? "/images/call-man-callback.png" : "/images/call-man-smartphone.png"}
        alt={person === "finder" ? "スマートフォンを操作する発見者の線画" : "電話で話す登録者の線画"}
        width={person === "finder" ? 362 : small ? 215 : 365}
        height={person === "finder" ? 383 : small ? 262 : 377}
        className={person === "finder" ? styles.finderImage : styles.registrantImage}
      />
    </div>
  );
}

function PrivacyPhoneIllustration() {
  return (
    <div className={styles.privacyIllustration}>
      <Image
        src="/images/call-privacy-phone.png"
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
    description: "同じ相手との再通話・折り返しは、1時間以内なら追加のサービス利用料はかかりません。",
    price: "1セッション 880円（税込）",
  },
  {
    number: "02",
    title: "別の人から電話があったら？",
    image: "/images/session-two-finders.png",
    imageAlt: "登録者と異なる2人の発見者がそれぞれ通話する線画",
    imageWidth: 887,
    imageHeight: 887,
    description: "発見者が異なる場合は、それぞれ別のセッションとして計算されます。",
    price: "880円 × 2セッション ＝ 1,760円（税込）",
  },
  {
    number: "03",
    title: "1時間を過ぎて、また電話したら？",
    image: "/images/session-rescan.png",
    imageAlt: "1時間経過後にQRコードを再スキャンする様子の線画",
    imageWidth: 1774,
    imageHeight: 887,
    description: "QRコードを再スキャンして新たに通話すると、別のセッションになります。",
    price: "880円 × 2セッション ＝ 1,760円（税込）",
  },
] as const;

export const metadata = pageMetadata("price");

export default function PricePage() {
  return (
    <>
      <PageStructuredData page="price" />
      <PageHeader eyebrow="— Price" en="Price" />

      <section className="py-24 md:py-32" aria-labelledby="pricing-title">
        <div className="container-narrow">
          <SectionHeading id="pricing-title" en="PRICE">必要なときだけ、使った分だけ。</SectionHeading>
          <p className="mt-4 text-xs leading-relaxed text-ink/65">※{CONSUMER_SERVICE.notice}</p>
          <div className="mt-12 border-y border-ink/15 md:mt-16">
            <div className="grid gap-7 py-9 sm:grid-cols-2 md:gap-12">
              <div><p className="text-sm text-ink/70">登録料</p><p className="mt-2 font-serif text-4xl text-ink/60">0円</p></div>
              <div><p className="text-sm text-ink/70">月額基本料</p><p className="mt-2 font-serif text-4xl text-ink/60">0円</p></div>
            </div>
            <div className="border-t border-ink/15 py-10 md:py-12">
              <p className="text-sm text-ink/70">つながるQRサービス利用料</p>
              <p className="mt-4 font-serif text-[clamp(3.5rem,9vw,6rem)] font-light leading-none text-moss">880<span className="ml-2 text-[0.45em] text-ink">円（税込）</span></p>
              <p className="mt-4 text-sm font-medium text-ink">1セッションあたり・通話成立時・後払い</p>
            </div>
          </div>
          <p id="charge-conditions" className="body-jp mt-8 scroll-mt-28 text-sm md:text-base">QRコードをスキャンするだけでは、サービス利用料は発生しません。通話が成立した場合、登録者に1セッション880円（税込）が発生します。</p>
          <p className="mt-3 text-xs leading-relaxed text-ink/65">※通話時間が5秒未満の場合、サービス利用料は発生しません。</p>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="session-title">
        <div className="container-narrow">
          <SectionHeading id="session-title" en="SESSION">セッションとは？</SectionHeading>
          <p className="body-jp max-w-3xl text-sm md:text-base">同じ相手との1時間以内の通話を、1セッションとします。1回の通話は最大3分です。</p>
          <p className="mt-4 text-xs leading-relaxed text-ink/65 md:text-sm">1時間はQRコードのスキャン時から数えます。1時間を過ぎると、そのセッションのプライバシー電話番号は利用できなくなります。</p>
          <div className="mt-12 md:mt-16">
            {SESSION_CASES.map((item) => (
              <article key={item.number} className={`grid gap-y-5 border-t border-ink/15 py-8 md:gap-y-3 md:py-10 ${item.number === "02" ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-x-8" : "md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-x-12"}`}>
                <header className="md:col-start-2 md:row-start-1 md:self-end">
                  <p className={label}>CASE {item.number}</p>
                  <h3 id={`session-case-${item.number}`} className="mt-3 scroll-mt-24 font-serif text-2xl font-light leading-relaxed md:scroll-mt-28 md:text-[1.7rem]"><SessionCaseTitle title={item.title} /></h3>
                </header>
                <div className="body-jp text-sm md:col-start-2 md:row-start-2 md:text-base">
                  <p>{item.description}</p>
                </div>
                <div className="md:col-start-2 md:row-start-3 md:self-start">
                  <p className="font-sans text-xl font-medium leading-relaxed tabular-nums text-ink/60 md:text-2xl">{item.price}</p>
                </div>
                <figure className={`mx-auto w-full md:col-start-1 md:row-span-3 md:row-start-1 md:self-center ${item.number === "02" ? "max-w-[520px] overflow-hidden aspect-[5/4]" : "max-w-[420px]"}`}>
                  <Image src={item.image} alt={item.imageAlt} width={item.imageWidth} height={item.imageHeight} sizes={item.number === "02" ? "(min-width: 768px) 520px, 100vw" : "(min-width: 768px) 420px, 100vw"} className={item.number === "02" ? "h-full w-full object-cover object-center mix-blend-darken" : "h-auto w-full mix-blend-darken"} />
                </figure>
              </article>
            ))}
          </div>
          <div className="space-y-2 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink/75 md:text-sm">
            <p>※各ケースには、基本料金欄の<Link href="#charge-conditions" className="underline underline-offset-4">課金・免除条件</Link>が適用されます。</p>
            <p>※CASE 02・03の1,760円は、2つのセッションでそれぞれ課金対象の通話が成立した場合の例です。</p>
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
                    <p>発見者が発信した場合の通話料です。</p>
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
                    <p>課金対象のセッションについて発生します。</p>
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
                <h4 className="font-serif text-xl text-ink">登録者が折り返す場合</h4>
                <p className="body-jp mt-3 text-sm md:text-base">登録者が着信履歴に残ったプライバシー電話番号へ折り返す場合、通常の電話料金は登録者の負担となります。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-labelledby="payment-title">
        <div className="container-narrow">
          <SectionHeading id="payment-title" en="PAYMENT & INFORMATION">お支払いについて</SectionHeading>
          <p className="body-jp text-sm md:text-base">サービス利用料が発生した場合、登録者へSMSとメールでお支払いをご案内します。案内に記載された決済ページから、クレジットカードでお支払いください。</p>
          <p className="mt-6 border-l-2 border-moss pl-4 text-sm leading-relaxed md:text-base">お支払い期限：サービス利用料が発生した通話日の2日後、23時59分まで（日本時間）</p>
          <ol className="mt-12 grid gap-7 border-y border-ink/15 py-8 md:grid-cols-3 md:gap-10">
            {["通話成立", "SMS・メールでお支払い案内", "クレジットカードで決済"].map((step, i) => <li key={step}><span className={label}>STEP 0{i + 1}</span><p className="mt-3 font-serif text-lg">{step}</p></li>)}
          </ol>
          <div id="notes-title" className="mt-8 scroll-mt-28 text-xs leading-relaxed text-ink/65 md:text-sm">
            <ul className="space-y-3">
              <li>QRタグ・シールなどの専用アイテム代金は、サービス利用料には含まれません。</li>
              <li>本サービスの通話機能は、日本国内でのみご利用いただけます。</li>
            </ul>
            <p className="mt-5">利用料金やお支払いに関するご質問は、<a href="https://axb.qring.jp/contact" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-moss">お問い合わせ窓口</a>へご連絡ください。</p>
          </div>
        </div>
      </section>
    </>
  );
}
