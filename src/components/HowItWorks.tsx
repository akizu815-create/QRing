import Link from "next/link";
import Image from "next/image";

type Step = { title: string; detail?: string; image: string; alt: string };

const REGISTER_STEPS: Step[] = [
  { title: "QRコードをスキャン", detail: "「登録者の方」を選択", image: "/images/how-register-scan-479d85a78ee1.jpg", alt: "手に持った丸型QRタグをスマートフォンで読み取る登録操作のイメージ" },
  { title: "必要事項を登録", detail: "電話番号・アカウント情報など", image: "/images/how-register-account-9a67a5009767.jpg", alt: "新規登録の入力欄と登録ボタンを操作するスマートフォンのイメージ" },
  { title: "取り付ける", detail: "バッグや身近な持ち物などに取り付けます。", image: "/images/how-it-works-step-01.png", alt: "バッグに丸型QRキーホルダーが取り付けられているイラスト" },
];
const FINDER_STEPS: Step[] = [
  { title: "QRコードをスキャン", image: "/images/how-it-works-step-02.png", alt: "持ち物に付いたQRタグをスマートフォンでスキャンする発見者の操作イメージ" },
  { title: "「電話をかける」をタップ", detail: "登録先へ電話をかけられます。", image: "/images/how-it-works-step-03.png", alt: "スマートフォンを持つ女性と通話先の人物を描いたイラスト" },
];

function StepList({ steps }: { steps: Step[] }) {
  return <ol className={`mt-6 grid gap-6 md:gap-8 lg:mt-0 ${steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
    {steps.map((step, index) => <li key={step.title} className="min-w-0 text-center">
      <p className="text-[11px] leading-5 tracking-[0.24em] text-moss" aria-hidden="true">STEP {String(index + 1).padStart(2, "0")}</p>
      <div className="relative mx-auto mt-2 h-40 w-full max-w-[250px] md:h-44">
        <Image src={step.image} alt={step.alt} fill sizes="250px" className="object-contain" />
      </div>
      <div className="mt-2 min-w-0">
        <p className="text-balance font-serif text-lg font-light leading-relaxed md:text-xl">{step.title}</p>
        {step.detail && <p className="mx-auto mt-2 max-w-xs text-[13px] leading-6 text-ink/65">{step.detail}</p>}
      </div>
    </li>)}
  </ol>;
}

export default function HowItWorks() {
  return <section id="how-it-works" className="scroll-mt-20 bg-white py-12 md:scroll-mt-24 md:py-24" aria-labelledby="home-how-heading">
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

      <p className="mt-4 text-center text-xs leading-7 text-ink/60">イラストは操作のイメージです。</p>
      <p className="mt-3 text-center"><Link href="/service/#how" className="link-underline inline-flex min-h-11 items-center py-2 text-sm text-moss">詳しい使い方を見る</Link></p>
    </div>
  </section>;
}
