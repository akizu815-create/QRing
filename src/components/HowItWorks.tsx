import Reveal from "@/components/Reveal";

const STEPS = [
  {
    no: "01",
    title: "登録する",
    body: "連絡先を登録し、つながるQRを使いたいものに付けます。",
  },
  {
    no: "02",
    title: "もしものとき",
    body: "発見した人がQRコードを読み取り、画面の案内に沿って操作します。",
  },
  {
    no: "03",
    title: "あなたにつながる",
    body: "発見した人から、登録したご家族や持ち主へ電話がつながります。",
  },
] as const;

function StepIcon({ step }: { step: (typeof STEPS)[number]["no"] }) {
  if (step === "01") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true" className="h-20 w-20">
        <rect x="17" y="12" width="38" height="70" rx="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M30 20h12M31 73h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="49" y="45" width="32" height="32" rx="3" fill="#F7F4EE" stroke="currentColor" strokeWidth="2" />
        <path d="M55 51h7v7h-7zM68 51h7v7h-7zM55 64h7v7h-7zM68 64h3v3h-3zM73 68h3v3h-3z" fill="currentColor" />
      </svg>
    );
  }

  if (step === "02") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true" className="h-20 w-20">
        <circle cx="27" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 62c2-14 9-21 17-21s15 7 17 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="49" y="21" width="33" height="58" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="57" y="36" width="17" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M60 39h4v4h-4zM67 39h4v4h-4zM60 46h4v4h-4zM68 47h3v3h-3zM57 62h17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="h-20 w-20">
      <path d="M31 23c-3 1-8 6-9 10-3 12 7 29 20 42s30 23 42 20c4-1 9-6 10-9 1-2 0-4-2-5l-12-8c-2-1-4-1-6 1l-6 7c-8-3-15-8-22-15S34 52 31 44l7-6c2-2 2-4 1-6l-8-12c-1-2-3-3-5-2Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 22c9 2 14 7 16 16M58 32c4 1 6 3 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-cream py-24 md:scroll-mt-24 md:py-36">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">— How it works</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-7 font-serif text-4xl font-light leading-[1.35] md:text-5xl lg:text-6xl">
              もしものとき、QRからつながる。
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <div className="body-jp mx-auto mt-8 max-w-2xl text-sm md:text-base">
              <p>
                QRコードを読み取り、画面の案内に沿って操作すると、
                <br className="hidden sm:block" />
                発見した人から、ご家族や持ち主へ電話がつながります。
              </p>
              <p className="mt-4">
                専用の中間番号を経由するため、
                <br className="hidden sm:block" />
                お互いの電話番号を明かさずに通話できます。
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-16 md:mt-24">
          <div className="absolute left-[16.67%] right-[16.67%] top-14 hidden h-px bg-moss/25 md:block" />
          <div className="relative grid md:grid-cols-3 md:gap-10">
            {STEPS.map((step, index) => (
              <Reveal key={step.no} delay={240 + index * 100}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-moss/25 bg-ivory text-moss">
                    <StepIcon step={step.no} />
                  </div>
                  <p className="mt-7 font-serif text-sm tracking-[0.2em] text-moss">
                    STEP {step.no}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl md:text-3xl">{step.title}</h3>
                  <p className="body-jp mt-4 max-w-xs text-sm">{step.body}</p>
                  {index < STEPS.length - 1 && (
                    <span className="my-8 block h-12 w-px bg-moss/30 md:hidden" aria-hidden="true" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
