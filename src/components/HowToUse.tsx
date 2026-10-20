"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

type Tab = "register" | "finder";

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

function RegistrationPanel() {
  return (
    <div role="tabpanel" id="how-to-register-panel" aria-labelledby="how-to-register-tab">
      <details className="group mx-auto max-w-4xl border-y border-ink/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="mr-4 text-[11px] font-medium tracking-[0.24em] text-moss">
              01
            </span>
            <span className="font-serif text-xl font-light md:text-2xl">新規登録</span>
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 stroke-moss transition-transform duration-300 group-open:rotate-180"
            fill="none"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>

        <div className="pb-9 pt-2 md:pb-11">
          <p className="body-jp text-sm text-ink/75 md:text-base">
            QRコードをスキャンし、「登録者の方」を選択すると登録を始められます。
          </p>

          <div className="mt-9 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4 lg:gap-6">
            {REGISTER_STEPS.map((step, index) => (
              <div key={step.no} className="contents">
                <article className="min-w-0 text-center">
                  <p className="text-base font-semibold text-moss">{step.no}</p>
                  <h4 className="mt-3 min-h-0 font-serif text-xl font-light leading-relaxed md:min-h-[3.4rem]">
                    {step.title}
                  </h4>
                  <div className="relative mx-auto mt-3 h-[295px] w-full max-w-[190px] md:h-[330px]">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="190px"
                      className="object-contain"
                    />
                  </div>
                  <p className="body-jp mx-auto mt-3 max-w-[15rem] text-sm text-ink/70">
                    {step.body}
                  </p>
                </article>

                {index < REGISTER_STEPS.length - 1 && (
                  <span
                    className="self-center justify-self-center rotate-90 text-xl font-light text-moss/45 md:rotate-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="group mx-auto max-w-4xl border-b border-ink/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="mr-4 text-[11px] font-medium tracking-[0.24em] text-moss">
              02
            </span>
            <span className="font-serif text-xl font-light md:text-2xl">
              マイページログイン
            </span>
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 stroke-moss transition-transform duration-300 group-open:rotate-180"
            fill="none"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>

        <div className="mx-auto max-w-xl pb-7 pt-2 text-center md:pb-8">
          <p className="body-jp text-left text-sm text-ink/75 md:text-base">
            登録済みのQRコードをスキャンし、「登録者の方」からログインできます。マイページでは登録情報の確認・変更ができます。
          </p>
          <div className="relative mx-auto mt-5 aspect-[2/3] w-full max-w-[210px]">
            <Image
              src="/images/how-to-app-screen.png"
              alt="登録者がマイページへログインする画面"
              fill
              sizes="210px"
              className="object-contain"
            />
          </div>
        </div>
      </details>
    </div>
  );
}

function FinderPanel() {
  return (
    <div
      role="tabpanel"
      id="how-to-finder-panel"
      aria-labelledby="how-to-finder-tab"
      className="mx-auto max-w-4xl"
    >
      <article className="mx-auto max-w-xl px-0 py-4 text-center md:py-6">
        <p className="body-jp text-left text-sm text-ink/75 md:text-base">
          QRコードをスキャンし、表示された「電話をかける」を押すと、登録者へ電話をかけられます。
        </p>
        <div className="relative mx-auto mt-5 aspect-[2/3] w-full max-w-[225px]">
          <Image
            src="/images/how-to-app-screen.png"
            alt="発見者の方が電話をかける操作画面"
            fill
            sizes="225px"
            className="object-contain"
          />
        </div>
      </article>
    </div>
  );
}

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState<Tab>("register");

  return (
    <section id="how" className="bg-cream py-24 md:py-40">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium tracking-[0.38em] text-moss">
              How to Use
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-7 font-serif text-3xl font-light leading-[1.35] md:text-5xl">
              ご利用方法
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
              ご利用になる方に合わせて、操作方法をご確認いただけます。
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mx-auto mt-12 max-w-5xl md:mt-16">
            <div
              className="grid grid-cols-2 border-b border-ink/20"
              role="tablist"
              aria-label="ご利用方法"
            >
              <button
                id="how-to-register-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === "register"}
                aria-controls="how-to-register-panel"
                onClick={() => setActiveTab("register")}
                className={`relative px-4 py-5 text-sm tracking-[0.12em] transition-colors duration-300 md:text-base ${
                  activeTab === "register"
                    ? "font-medium text-moss after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-moss"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                登録する方
              </button>
              <button
                id="how-to-finder-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === "finder"}
                aria-controls="how-to-finder-panel"
                onClick={() => setActiveTab("finder")}
                className={`relative px-4 py-5 text-sm tracking-[0.12em] transition-colors duration-300 md:text-base ${
                  activeTab === "finder"
                    ? "font-medium text-moss after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-moss"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                発見した方
              </button>
            </div>

            <div className="min-h-[32rem] pt-10 md:pt-12">
              {activeTab === "register" ? <RegistrationPanel /> : <FinderPanel />}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
