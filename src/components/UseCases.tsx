import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const USE_CASES = [
  {
    no: "01",
    title: "ご家族の見守りに",
    body: "外出先での万一に備え、必要なご家族へ連絡できる安心につながります。",
    image: "/images/use-case-family.png",
    imageAlt: "緑道を歩きながら会話する高齢女性と家族",
  },
  {
    no: "02",
    title: "ペットの迷子対策に",
    body: "保護した方がQRコードから連絡できるため、飼い主へスムーズに知らせられます。",
    image: "/images/use-case-pet.png",
    imageAlt: "QRタグを身につけた犬と見つめ合う女性",
  },
  {
    no: "03",
    title: "持ち物の紛失対策に",
    body: "鍵や小物を見つけた方から、持ち主へ連絡しやすくするための備えです。",
    image: "/images/use-case-belongings.png",
    imageAlt: "バッグに取り付けられたQRタグ",
  },
] as const;

function UseCase({ item }: { item: (typeof USE_CASES)[number] }) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/1] overflow-hidden bg-cream">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 31vw, 100vw"
          className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-[1.025]"
        />
      </div>
      <div className="pt-7 md:pt-8">
        <p className="text-[10px] font-medium tracking-[0.32em] text-moss">
          USE CASE {item.no}
        </p>
        <h3 className="mt-4 font-serif text-2xl font-light leading-snug lg:text-[28px]">
          {item.title}
        </h3>
        <p className="body-jp mt-5 text-sm text-ink/70">{item.body}</p>
        {(
          <div className="mt-6 text-right">
            <Link href={item.no === "01" ? "/use-cases/elderly/" : item.no === "02" ? "/use-cases/pets/" : "/use-cases/belongings/"} className="link-underline inline-block text-xs tracking-[0.12em] text-moss transition-colors duration-300 hover:text-ink">
              詳しく見る →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="bg-white py-24 md:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-moss/80">
              Use cases
            </p>
            <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-serif text-[clamp(34px,4vw,58px)] font-light leading-[1.3] tracking-tight">
              こんな「<span className="text-moss">もしも</span>」に、
              <span className="whitespace-nowrap">役立ちます。</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
              見守り、迷子、紛失など、日常の困りごとに備えるための活用例です。
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-16 grid grid-cols-1 gap-y-14 md:mt-20 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-x-10">
            <UseCase item={USE_CASES[0]} />
            <span className="hidden h-full w-px bg-ink/10 lg:block" aria-hidden="true" />
            <UseCase item={USE_CASES[1]} />
            <span className="hidden h-full w-px bg-ink/10 lg:block" aria-hidden="true" />
            <UseCase item={USE_CASES[2]} />
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-16 text-center md:mt-20">
            <Link
              href="/service"
              className="inline-block text-xs tracking-[0.22em] text-ink transition-colors duration-300 hover:text-moss link-underline"
            >
              詳しい活用例を見る →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
