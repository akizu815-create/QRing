import Link from "next/link";

type Step = { title: string; detail?: string };

const REGISTER_STEPS: Step[] = [
  { title: "QRコードをスキャン", detail: "「登録者の方」を選択" },
  { title: "必要事項を登録", detail: "電話番号・アカウント情報など" },
  { title: "取り付ける" },
];
const FINDER_STEPS: Step[] = [
  { title: "QRコードをスキャン" },
  { title: "「電話をかける」をタップ" },
];

function StepList({ steps }: { steps: Step[] }) {
  return <ol className={`mt-6 grid gap-5 md:gap-8 lg:mt-0 ${steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
    {steps.map((step, index) => <li key={step.title} className="flex min-w-0 items-start gap-4 md:block">
      <p className="font-serif text-3xl font-light leading-none tabular-nums text-moss/80 md:text-4xl" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
      <div className="min-w-0 md:mt-4">
        <p className="text-balance font-serif text-lg font-light leading-relaxed md:text-xl">{step.title}</p>
        {step.detail && <p className="mt-2 text-xs leading-7 text-ink/60">{step.detail}</p>}
      </div>
    </li>)}
  </ol>;
}

export default function HowItWorks() {
  return <section id="how-it-works" className="scroll-mt-20 bg-ivory py-12 md:scroll-mt-24 md:py-24" aria-labelledby="home-how-heading">
    <div className="container-wide">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-ink/60">How it works</p>
        <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
        <h2 id="home-how-heading" className="mt-7 font-serif text-[clamp(28px,3.8vw,48px)] font-light leading-[1.5] tracking-tight">
          <span className="inline-block">登録も、使い方も。</span><span className="inline-block text-moss">かんたん。</span>
        </h2>
      </div>

      <div className="mx-auto mt-8 max-w-6xl md:mt-12">
        <section className="py-6 md:py-8 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10" aria-labelledby="home-register-heading">
          <div>
            <h3 id="home-register-heading" className="font-serif text-2xl font-light leading-relaxed">登録する方</h3>
            <p className="body-jp mt-3 text-sm text-ink/70">最初に設定して、備えておくだけ。</p>
          </div>
          <StepList steps={REGISTER_STEPS} />
        </section>

        <section className="border-t border-ink/15 py-6 md:py-8 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10" aria-labelledby="home-finder-heading">
          <div>
            <h3 id="home-finder-heading" className="font-serif text-2xl font-light leading-relaxed">見つけた方</h3>
            <p className="body-jp mt-3 text-sm text-ink/70">専用アプリ不要。電話番号やIDの入力も不要。</p>
          </div>
          <StepList steps={FINDER_STEPS} />
        </section>
      </div>

      <p className="mt-6 text-center"><Link href="/service/#how" className="link-underline inline-flex min-h-11 items-center py-2 text-sm text-moss">詳しい使い方を見る</Link></p>
    </div>
  </section>;
}
