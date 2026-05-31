import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News",
  description: "QRingからの最新のお知らせ、リリース情報、イベント情報。",
};

const NEWS = [
  {
    date: "2026.05.31",
    cat: "NEWS",
    title: "サービスサイトをリニューアルいたしました",
    body: "ブランドコンセプトに合わせて、サービスサイト全体のデザインを一新しました。",
  },
  {
    date: "2026.05.12",
    cat: "NEWS",
    title: "TIB SHOP期間限定出店のお知らせ",
    body: "2026年6月5日（金）から8月4日（火）までの期間、TIB SHOPへ期間限定で出店いたします。\n\n本出店は、5月12日（火）に開催された「第24回TIB PITCH（SHOPコース）」での審査を経て、採択企業として選出されたことに伴うものです。ピッチコンテスト当日の様子や採択結果については、主催者の公式記事をご参照ください。\n\n【出店期間】2026年6月5日（金）〜 8月4日（火）\n\n皆様のお越しを心よりお待ちしております。",
  },
  {
    date: "2026.04.14",
    cat: "EVENT",
    title:
      "【出展告知】Start up JAPAN EXPO 2026に出展いたします（4/15-16 幕張メッセ）",
    body: "幕張メッセにて開催されるStart up JAPAN EXPO 2026に出展いたします。デモブースにて『つながるQR』の実演をご覧いただけます。",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="— News"
        en="News & Updates."
        jp="お知らせ・更新情報"
      />

      <section className="py-24 md:py-32">
        <div className="container-wide max-w-5xl">
          <ul>
            {NEWS.map((n, i) => (
              <Reveal as="li" key={n.title} delay={i * 60}>
                <article className="grid md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-12 border-t border-ink/10 last:border-b">
                  <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-3 items-baseline md:items-start">
                    <p className="font-serif text-base text-ink/60">{n.date}</p>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-moss">
                      {n.cat}
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <h2 className="font-serif text-xl md:text-2xl leading-tight">
                      {n.title}
                    </h2>
                    <p className="mt-4 body-jp text-sm md:text-base">{n.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
