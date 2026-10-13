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
                800<span className="ml-1 text-[0.44em]">円／回</span>
              </p>
              <p className="mt-3 text-[10px] tracking-[0.18em] text-ink/50 md:text-xs">
                （後払い）
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-2xl text-center md:mt-14">
          <Reveal delay={300}>
            <p className="font-serif text-xl font-light leading-relaxed md:text-2xl">
              はじめに必要なのは、専用アイテムの購入費用だけ。
            </p>
          </Reveal>
          <Reveal delay={360}>
            <p className="body-jp mt-5 text-xs text-ink/55 md:text-sm">
              ※専用アイテム代金は別途必要です。通話が成立した場合に
              <span className="whitespace-nowrap">1回800円</span>
              の利用料が発生します。
            </p>
          </Reveal>
          <Reveal delay={420}>
            <Link
              href="/shop"
              className="btn-primary mt-10 normal-case tracking-[0.16em] md:mt-12"
            >
              アイテムを見る →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
