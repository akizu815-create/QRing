import Link from "next/link";
import Reveal from "@/components/Reveal";
import PetSurveyLink from "@/components/PetSurveyLink";
import { CONSUMER_SERVICE } from "@/config/consumerService";

export default function PriceSection() {
  return (
    <section id="price" className="bg-cream py-16 md:py-24">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-ink/60">
              Price
            </p>
            <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-serif text-[clamp(34px,4vw,58px)] font-light leading-[1.3] tracking-tight">
              備えるだけなら、<span className="whitespace-nowrap text-moss">月額0円。</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 text-sm tracking-[0.12em] text-ink/70 md:text-base">
              ベーシックプランは、通話が成立したときに登録者が支払う仕組みです。
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] border-y border-ink/10 md:mt-12">
            <div className="flex min-w-0 flex-col items-center justify-center px-3 py-10 text-center md:px-10 md:py-12">
              <p className="min-h-10 text-[11px] leading-relaxed tracking-[0.08em] text-ink/60 md:min-h-0 md:text-sm">
                登録料・月額基本料
              </p>
              <p className="mt-4 font-serif text-[clamp(58px,8vw,104px)] font-light leading-none tracking-tight text-ink/60">
                0<span className="ml-1 text-[0.42em] text-ink">円</span>
              </p>
            </div>

            <span className="h-full w-px bg-ink/10" aria-hidden="true" />

            <div className="flex min-w-0 flex-col items-center justify-center px-3 py-10 text-center md:px-10 md:py-12">
              <p className="min-h-10 text-[11px] leading-relaxed tracking-[0.08em] text-ink/60 md:min-h-0 md:text-sm">
                通話が成立したとき
              </p>
              <p className="mt-5 whitespace-nowrap font-serif text-[clamp(38px,5.8vw,76px)] font-light leading-none tracking-tight text-ink">
                880<span className="ml-1 text-[0.38em]">円（税込）</span>
              </p>
              <p className="mt-3 text-[10px] tracking-[0.12em] text-ink/60 md:text-xs">
                1回のご利用（1セッション）につき
              </p>
              <p className="mt-2 text-[10px] tracking-[0.18em] text-ink/50 md:text-xs">
                通話成立時・後払い
              </p>
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-ink/70">QRタグ・シールなどの商品代金は別途必要です。サービス利用料には含まれません。</p>

        <div className="mx-auto mt-8 max-w-2xl text-center md:mt-10">
          <Reveal delay={300}>
            <p className="font-serif text-xl font-light leading-relaxed md:text-2xl">
              QRコードのスキャンだけでは、サービス利用料はかかりません。
            </p>
          </Reveal>
          <Reveal delay={360}>
            <p className="body-jp mt-5 text-xs text-ink/55 md:text-sm">
              通話が成立した場合、登録者に1回のご利用（1セッション）につき880円（税込）のサービス利用料が発生します。発見者にはサービス利用料はかかりません。
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/70">QRコードのスキャンから1時間以内は、同じ登録者と発見者の組み合わせで再通話・折り返しができます。同一セッション内では追加のサービス利用料はかかりません。1回の通話は最大3分です。</p>
            <p className="mt-3 text-xs leading-relaxed text-ink/55">※通話時間が5秒未満の場合、登録者のサービス利用料は発生しません。</p>
            <p className="mt-3 text-sm leading-7 text-ink/70">電話をかける方には、ご契約の通信会社・料金プランに応じた通常の通話料が別途かかります。上記の5秒未満の免除は、通常の通話料には適用されません。</p>
          </Reveal>
          <Reveal delay={420}>
            <Link
              href="/price"
              className="btn-primary mt-10 normal-case tracking-[0.16em] md:mt-12"
            >
              料金について詳しく見る →
            </Link>
          </Reveal>
          <p className="mt-5"><Link href="/faq/" className="link-underline inline-flex min-h-12 items-center text-sm text-ink/65 hover:text-moss focus-visible:text-moss focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss">料金・お支払いのよくあるご質問 →</Link></p>
          <div className="mt-8 border-t border-ink/15 pt-6 md:mt-10 md:pt-8" aria-labelledby="home-personal-contact">
            <h3 id="home-personal-contact" className="font-serif text-xl font-light leading-relaxed md:text-2xl">商品の入手・利用開始について</h3>
            <p className="body-jp mt-4 text-sm text-ink/70">専用QRタグ・シールなどの入手方法や、利用開始についてのご質問は、お問い合わせ窓口へご相談ください。</p>
            <p className="mt-4 text-sm leading-7 text-ink/70">{CONSUMER_SERVICE.notice} 開始のお知らせは<Link href="/news/" className="link-underline text-moss">NEWS</Link>でご案内します。</p>
            <a href="https://axb.qring.jp/contact" className="mt-5 inline-flex min-h-12 items-center justify-center border border-moss/40 px-6 py-3 text-sm text-moss transition-colors hover:bg-moss/10">利用について問い合わせる</a>
          </div>
          <div className="mt-8 text-xs leading-7 text-ink/65" data-pet-survey>
            <p>ペット向け商品について、皆さまのご意見を募集しています。</p>
            <PetSurveyLink placement="home" className="link-underline mt-1 inline-flex min-h-11 items-center py-2 text-ink/65 hover:text-moss focus-visible:text-moss focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss">ペット向けアンケートに回答する</PetSurveyLink>
          </div>
        </div>
      </div>
    </section>
  );
}
