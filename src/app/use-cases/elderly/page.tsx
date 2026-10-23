import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";

export const metadata = pageMetadata("elderly");

const linkClass = "link-underline inline-block text-sm leading-7 tracking-[0.08em] text-moss transition-colors duration-300 hover:text-ink";
const headingClass = "font-serif text-2xl font-light leading-relaxed md:text-4xl";
const preparations = [
  { title: "本人が連絡先を伝えられない場合", body: "名前や電話番号をうまく伝えられないときにも、周囲の方が連絡先を確認できる備えを。" },
  { title: "GPSなどの機器を持っていない場合", body: "位置を確認する機器の有無にかかわらず、発見後に家族へ連絡する手段を考えておきましょう。" },
  { title: "発見者が家族へ連絡する必要がある場合", body: "声をかけてくださった方が、必要な連絡先へつなげられるようにしておきましょう。" },
];
const methods = [
  ["GPS", "位置を確認する手段"],
  ["地域の見守りネットワーク", "地域の関係者が発見・保護を支援する取り組み"],
  ["QRコード", "発見・保護された後の連絡を支援する手段"],
];
const steps = ["本人がQRコードを身につける", "発見者がスキャンする", "登録先と通話する"];
const features = ["専用アプリ不要", "お互いの電話番号は非公開", "発見後に登録先へ直接通話", "日本国内限定"];
const questions = [
  { q: "GPS機能はありますか？", a: "つながるQRにGPSによる位置追跡機能はありません。発見者がQRコードをスキャンし、登録先へ連絡するためのサービスです。" },
  { q: "本人が操作する必要はありますか？", a: "QRコードを身につけるご本人が、発見時にスマートフォンを操作する必要はありません。発見者がスキャンして登録先へ電話し、登録先の方が着信に応答する仕組みです。" },
  { q: "発見者にサービス利用料はかかりますか？", a: "つながるQRのサービス利用料は登録者が負担します。発見者にサービス利用料はかかりませんが、発信者には通常の電話料金が別途かかる場合があります。" },
  { q: "一般向けサービスは現在利用できますか？", a: CONSUMER_SERVICE.faq.answer },
];

export default function ElderlyPage() {
  return (
    <>
      <PageStructuredData page="elderly" />
      <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48">
        <div className="container-narrow">
          <p className="eyebrow">— Family Care</p>
          <h1 className="mt-8 font-serif text-3xl font-light leading-[1.6] md:text-5xl">
            認知症高齢者の見守りに。外出時の連絡先をどう備える？
          </h1>
          <p className="mt-10 font-serif text-xl font-light leading-relaxed md:text-2xl">もしも、ご家族が外出先で困っていたら。</p>
          <p className="body-jp mt-6 text-sm text-ink/70 md:text-base">外出先で本人が連絡先を伝えられない場合に備えて、家族につながる連絡手段を用意しておくことが大切です。</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-wide">
          <h2 className={headingClass}>見守りで備えたいこと</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {preparations.map((item) => (
              <article key={item.title} className="bg-cream p-7 md:p-8">
                <h3 className="font-serif text-xl font-light leading-relaxed">{item.title}</h3>
                <p className="body-jp mt-5 text-sm text-ink/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-28">
        <div className="container-narrow">
          <h2 className={headingClass}>見守り方法は、役割に合わせて。</h2>
          <p className="body-jp mt-6 text-sm text-ink/70">GPS、地域の見守り、QRコードは競合するものではありません。位置の確認、発見・保護、その後の連絡と、役割の異なる対策として組み合わせて考えられます。</p>
          <table className="mt-10 w-full table-fixed border-collapse text-left text-sm leading-7">
            <caption className="sr-only">見守り方法と主な役割の比較</caption>
            <thead><tr className="border-b border-ink/20"><th scope="col" className="w-2/5 py-4 pr-4 font-medium text-moss">方法</th><th scope="col" className="py-4 font-medium text-moss">主な役割</th></tr></thead>
            <tbody>{methods.map(([method, role]) => <tr key={method} className="border-b border-ink/10"><th scope="row" className="py-5 pr-4 font-medium">{method}</th><td className="py-5 text-ink/70">{role}</td></tr>)}</tbody>
          </table>
          <p className="body-jp mt-6 text-xs text-ink/60">地域の取り組みや利用条件は地域によって異なります。お住まいの自治体の案内をご確認ください。</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-wide">
          <h2 className={headingClass}>QRコードによる連絡の仕組み</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => <li key={step} className="border-t border-moss/30 py-6"><p className="text-sm tracking-[0.2em] text-moss">0{i + 1}</p><h3 className="mt-4 font-serif text-xl font-light leading-relaxed">{step}</h3></li>)}
          </ol>
          <p className="body-jp mt-6 max-w-3xl text-sm text-ink/70">つながるQRでは、お互いの電話番号を相手に公開せずに通話できます。発見後の連絡を支援する仕組みであり、自動的に発見したり、必ず連絡が成立したりするものではありません。</p>
          <div className="mt-7"><Link href="/service/" className={linkClass}>サービスの仕組みを詳しく見る →</Link></div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-narrow">
          <h2 className={headingClass}>つながるQRの特徴</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">{features.map((feature) => <li key={feature} className="bg-white p-6 text-sm leading-7 text-moss">{feature}</li>)}</ul>
          <p className="body-jp mt-6 text-xs text-ink/60">本サービスの通話機能は、日本国内でのみご利用いただけます。</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <h2 className={headingClass}>よくある質問</h2>
          <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {questions.map(({ q, a }) => <article key={q} className="py-7"><h3 className="text-base font-medium leading-7">{q}</h3><p className="body-jp mt-4 text-sm text-ink/70">{a}</p></article>)}
          </div>
          <div className="mt-7"><Link href="/faq/" className={linkClass}>よくあるご質問をもっと見る →</Link></div>
          <div className="mt-10 border-t border-ink/10 pt-8"><p className="body-jp text-sm text-ink/70">自治体での導入をご検討の方には、導入情報を別ページでご案内しています。</p><Link href="/municipalities/" className={`${linkClass} mt-4`}>自治体向けの導入情報を見る →</Link></div>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-28">
        <div className="container-narrow text-center">
          <h2 className={headingClass}>一般向けサービスの提供について</h2>
          <p className="body-jp mt-7 text-sm text-ink/70">{CONSUMER_SERVICE.notice}</p>
          <p className="body-jp mt-4 text-sm text-ink/70">{CONSUMER_SERVICE.announcement}</p>
          <Link href={CONSUMER_SERVICE.cta.href} className={`${linkClass} mt-8`}>{CONSUMER_SERVICE.cta.label}</Link>
        </div>
      </section>
    </>
  );
}
