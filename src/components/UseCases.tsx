import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const USE_CASES = [
  {
    no: "01",
    title: "外出先で家族が道に迷ったとき。",
    body: "声をかけてくれた方から、家族に連絡してもらうには。",
    linkLabel: "高齢者の見守り・迷子対策を見る",
    image: "/images/use-case-family.png",
    imageAlt: "緑道を歩きながら会話する高齢女性と家族",
  },
  {
    no: "02",
    title: "迷子のペットを保護してもらえたとき。",
    body: "飼い主に連絡してほしい。でも、迷子札に電話番号は書きたくない。",
    linkLabel: "電話番号を公開しないQR迷子札を見る",
    image: "/images/use-case-pet.png",
    imageAlt: "QRタグを身につけた犬と見つめ合う女性",
  },
  {
    no: "03",
    title: "大切な鍵や財布を落としたとき。",
    body: "拾ってくれた方が、持ち主に連絡できる手段があったら。",
    linkLabel: "落とし物・忘れ物対策を見る",
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
        <p className="text-[10px] font-medium tracking-[0.32em] text-ink/60">
          USE CASE {item.no}
        </p>
        <h3 className="mt-4 font-serif text-2xl font-light leading-snug lg:text-[28px]">
          {item.title}
        </h3>
        <p className="body-jp mt-5 text-sm text-ink/70">{item.body}</p>
        {(
          <div className="mt-6 text-right">
            <Link href={item.no === "01" ? "/use-cases/elderly/" : item.no === "02" ? "/use-cases/pets/" : "/use-cases/belongings/"} className="link-underline inline-block text-xs tracking-[0.12em] text-moss transition-colors duration-300 hover:text-ink">
              {item.linkLabel} →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-24 bg-white py-16 md:py-24" aria-labelledby="home-concerns-heading">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-ink/60">
              In your everyday life
            </p>
            <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2 id="home-concerns-heading" className="mt-8 font-serif text-[clamp(32px,4vw,54px)] font-light leading-[1.5] tracking-tight">
              こんな心配、<span className="inline-block">ありませんか？</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="body-jp mx-auto mt-7 max-w-2xl text-sm text-ink/70 md:text-base">
              大切な人やペット、持ち物のこと。<br />「見つかったあと、連絡がついたら」と思う場面があります。
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-10 grid grid-cols-1 gap-y-14 md:mt-12 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-x-10">
            <UseCase item={USE_CASES[0]} />
            <span className="hidden h-full w-px bg-ink/10 lg:block" aria-hidden="true" />
            <UseCase item={USE_CASES[1]} />
            <span className="hidden h-full w-px bg-ink/10 lg:block" aria-hidden="true" />
            <UseCase item={USE_CASES[2]} />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
