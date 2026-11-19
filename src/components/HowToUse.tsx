import Image from "next/image";

const REGISTER_STEPS = [
  {
    no: "①",
    title: "電話番号を登録",
    body: "連絡先となる電話番号を入力します。",
    alt: "電話番号を登録する画面",
    image: "/images/how-to-phone-register.png",
  },
  {
    no: "②",
    title: "アカウント情報を設定",
    body: "パスワードやメールアドレスなど、必要事項を入力します。",
    alt: "アカウント情報を設定する画面",
    image: "/images/how-to-account-register.png",
  },
  {
    no: "③",
    title: "登録完了",
    body: "登録が完了すると、マイページへ進めます。",
    alt: "登録完了画面",
    image: "/images/how-to-registration-complete.png",
  },
] as const;


export default function HowToUse() {
  return (
    <section id="how" className="bg-cream py-24 md:py-40">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium tracking-[0.38em] text-ink/60">
            How to Use
          </p>
          <h2 className="mt-7 font-serif text-3xl font-light leading-[1.35] md:text-5xl">
            ご利用方法
          </h2>
          <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
            ご利用になる方に合わせて、操作方法をご確認いただけます。
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl md:mt-16">
          <section aria-labelledby="how-to-register-heading">
            <h3 id="how-to-register-heading" className="font-serif text-2xl font-light md:text-3xl">
              登録する方
            </h3>
            <p className="body-jp mt-5 text-sm text-ink/75 md:text-base">
              QRコードをスキャンし、『登録者の方』を選択して登録します。
            </p>
            <ol className="mt-9 grid items-start gap-10 md:grid-cols-3 md:gap-8">
              {REGISTER_STEPS.map((step) => (
                <li key={step.no} className="min-w-0 text-center">
                  <p className="text-base font-semibold text-ink/60">{step.no}</p>
                  <h4 className="mt-3 font-serif text-xl font-light leading-relaxed md:min-h-[3.4rem]">
                    {step.title}
                  </h4>
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={941}
                    height={1672}
                    sizes="220px"
                    className="mx-auto mt-3 h-auto w-full max-w-[220px]"
                  />
                  <p className="body-jp mx-auto mt-4 max-w-[15rem] text-sm text-ink/70">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <aside aria-labelledby="how-to-login-heading" className="mt-10 text-sm text-ink/70 md:mt-12">
            <h3 id="how-to-login-heading" className="font-medium text-ink">
              登録済みの方
            </h3>
            <p className="body-jp mt-2">マイページから登録情報を確認・変更できます。</p>
            <a href="https://axb.qring.jp/" className="mt-3 inline-block text-moss underline underline-offset-4 hover:text-ink">
              マイページにログインする
            </a>
          </aside>

          <section aria-labelledby="how-to-finder-heading" className="mt-16 md:mt-24">
            <h3 id="how-to-finder-heading" className="font-serif text-2xl font-light md:text-3xl">
              発見した方
            </h3>
            <p className="body-jp mt-5 text-sm text-ink/75 md:text-base">
              QRコードをスキャンし、画面の『電話をかける』をタップすると、登録先につながります。
            </p>
            <p className="body-jp mt-3 text-sm text-ink/70">
              専用アプリや、発見した方による電話番号の手入力は不要です。
            </p>
            <ol className="mt-9 grid items-start gap-10 md:grid-cols-2 md:gap-12">
              <li className="min-w-0 text-center">
                <p className="text-base font-semibold text-ink/60">①</p>
                <h4 className="mt-3 font-serif text-xl font-light leading-relaxed">QRコードをスキャン</h4>
                <div className="mx-auto mt-5 flex min-h-[330px] max-w-[300px] items-center justify-center">
                  <Image
                    src="/images/how-it-works-step-02.png"
                    alt="身につけたQRタグをスマートフォンでスキャンするイメージ"
                    width={420}
                    height={330}
                    sizes="300px"
                    className="h-auto w-full"
                  />
                </div>
              </li>
              <li className="min-w-0 text-center">
                <p className="text-base font-semibold text-ink/60">②</p>
                <h4 className="mt-3 font-serif text-xl font-light leading-relaxed">「電話をかける」をタップ</h4>
                <Image
                  src="/images/how-to-app-screen.png"
                  alt="発見者の方が電話をかける操作画面"
                  width={1024}
                  height={1536}
                  sizes="220px"
                  className="mx-auto mt-5 h-auto w-full max-w-[220px]"
                />
              </li>
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}
