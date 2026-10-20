import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function PriceSection() {
  return (
    <section id="price" className="bg-cream py-24 md:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-moss/80">
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
              必要なときだけ、使った分だけ。
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] border-y border-ink/10 md:mt-16">
            <div className="flex min-w-0 flex-col items-center justify-center px-3 py-10 text-center md:px-10 md:py-12">
              <p className="min-h-10 text-[11px] leading-relaxed tracking-[0.08em] text-ink/60 md:min-h-0 md:text-sm">
                登録料・月額基本料
              </p>
              <p className="mt-4 font-serif text-[clamp(58px,8vw,104px)] font-light leading-none tracking-tight text-moss">
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
                1セッションあたり
              </p>
              <p className="mt-2 text-[10px] tracking-[0.18em] text-ink/50 md:text-xs">
                通話成立時・後払い
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-2xl text-center md:mt-14">
          <Reveal delay={300}>
            <p className="font-serif text-xl font-light leading-relaxed md:text-2xl">
              QRコードをスキャンするだけでは、利用料はかかりません。
            </p>
          </Reveal>
          <Reveal delay={360}>
            <p className="body-jp mt-5 text-xs text-ink/55 md:text-sm">
              通話が成立した場合、登録者に1セッション880円（税込）の利用料が発生します。通常の電話料金は発信した方に別途かかります。
            </p>
          </Reveal>
          <Reveal delay={420}>
            <Link
              href="/price"
              className="btn-primary mt-10 normal-case tracking-[0.16em] md:mt-12"
            >
              料金について詳しく見る →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
