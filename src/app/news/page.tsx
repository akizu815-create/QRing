import type { Metadata } from "next";
import Image from "next/image";
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
  images?: string[];
};

const NEWS: NewsItem[] = [
  {
    date: "2026.08.03",
    cat: "EVENT",
    title: "【開催報告】Women Leaders TIB Lounge",
    body: "2026年8月3日（月）、Tokyo Innovation Base（TIB）にて「Women Leaders TIB Lounge」が開催され、Lead Sisterとして参加いたしました。\n\n起業に至った経緯や「つながるQR」に込めた思い、今後の展望などについて、参加者のみなさまと和やかにお話しさせていただきました。\n\nご参加いただいたみなさま、誠にありがとうございました。",
    link: {
      label: "Women Leaders TIB Lounge",
      url: "https://peatix.com/event/5084611",
    },
    images: ["/images/S__349110274.jpg"],
  },
  {
    date: "2026.07.22",
    cat: "EVENT",
    title: "【イベント出展のお知らせ】フィガロジャポン Business with Attitude ピッチコンテスト2026にブース出展いたしました",
    body: "2026年7月22日（水）、Tokyo Innovation Base（TIB）にて開催された「フィガロジャポン Business with Attitude（BWA）ピッチコンテスト2026」に、ブース出展企業として参加いたしました。\n\n本イベントは、カルチュア・コンビニエンス・クラブ株式会社（CCC）運営「TIB SHOP」の連携企画として開催され、当日は電話番号を明かさずに安心・安全なやり取りができる「つながるQR」をご紹介いたしました。\n\n今後も様々な場を通じて「つながるQR」を発信してまいります。",
    link: {
      label: "CCC運営の「TIB SHOP」、「フィガロジャポン Business with Attitude（BWA）ピッチコンテスト2026」に連携参画",
      url: "https://prtimes.jp/main/html/rd/p/000001676.000018760.html",
    },
    images: ["/images/S__347521038.jpg", "/images/S__349126659.jpg"],
  },
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
    images: ["/images/S__349126658.jpg"],
  },
  {
    date: "2026.04.14",
    cat: "EVENT",
    title:
      "【出展告知】Start up JAPAN EXPO 2026に出展いたします（4/15-16 幕張メッセ）",
    body: "株式会社QRingは、「日本最大級のスタートアップ展示会」に参加いたします。会場では、電話番号を非開示にしたまま音声通話が可能な『つながるQR』のデモを実施する予定です。\n\n【開催日時】2026年4月15日（水）〜16日（木）10:00〜17:00\n【会場】幕張メッセ国際展示場7・8ホール\n【小間番号】16-31\n【主催】Eight（Sansan株式会社）\n\nご来場は事前登録制となっております。下記よりお申し込みください。",
    link: {
      label: "参加申込はこちら →",
      url: "https://eight-event.8card.net/lp/startup-japan/2026/?code=sj_sp_pk&utm_source=sp",
    },
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
                    {n.images && n.images.length > 0 && (
                      <div className="mt-6 flex flex-col gap-4">
                        {n.images.map((src, idx) => (
                          <div key={idx} className="relative aspect-[4/3] max-w-lg overflow-hidden">
                            <Image
                              src={src}
                              alt={`${n.title} ${idx + 1}`}
                              fill
                              sizes="(min-width: 768px) 512px, 100vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
