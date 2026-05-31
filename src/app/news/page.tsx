import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News",
  description: "QRingからの最新のお知らせ、リリース情報、イベント情報。",
};

type NewsItem = {
  date: string;
  cat: string;
  title: string;
  body: string;
  link?: { label: string; url: string };
};

const NEWS: NewsItem[] = [
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
    link: {
      label: "第24回TIB PITCH（SHOPコース）開催報告 | Tokyo Innovation Base",
      url: "https://tib.metro.tokyo.lg.jp/posts/tibpitch024_3",
    },
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
                <details className="group border-t border-ink/10 last:border-b">
                  <summary className="grid md:grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 cursor-pointer list-none items-baseline">
                    <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-3 items-baseline md:items-start">
                      <p className="font-serif text-base text-ink/60">{n.date}</p>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-moss">
                        {n.cat}
                      </span>
                    </div>
                    <div className="md:col-span-8 flex items-baseline gap-4">
                      <h2 className="font-serif text-xl md:text-2xl leading-tight text-ink group-hover:text-moss transition-colors duration-300">
                        {n.title}
                      </h2>
                    </div>
                    <div className="md:col-span-1 flex justify-end items-center">
                      <span className="font-serif text-2xl text-moss transition-transform duration-500 group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <div className="md:col-span-9 md:ml-[25%] pb-8 pr-6 md:pr-10">
                    <p className="body-jp text-sm md:text-base whitespace-pre-line">{n.body}</p>
                    {n.link && (
                      <a
                        href={n.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm text-moss link-underline"
                      >
                        {n.link.label} →
                      </a>
                    )}
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
