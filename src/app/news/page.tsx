import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News",
  description: "QRingからの最新のお知らせ、リリース情報、イベント情報。",
};

const NEWS = [
  {
    date: "2026.04.14",
    cat: "EVENT",
    title:
      "【出展告知】Start up JAPAN EXPO 2026に出展いたします（4/15-16 幕張メッセ）",
    body: "幕張メッセにて開催されるStart up JAPAN EXPO 2026に出展いたします。デモブースにて『つながるQR』の実演をご覧いただけます。",
  },
  {
    date: "2026.03.25",
    cat: "PRESS",
    title: "『つながるQR』に関する技術特許（第7460140号）を取得しました",
    body: "QRコードに暗号化された電話番号情報を埋め込み、クラウドPBXシステム上で復号する独自方式について、特許を取得いたしました。",
  },
  {
    date: "2026.02.10",
    cat: "NEWS",
    title: "ご高齢の方の見守り向けサービスの先行受付を開始しました",
    body: "ご家族の見守り需要に特化したパッケージプランのご案内を開始しました。詳細はお問い合わせください。",
  },
  {
    date: "2026.01.20",
    cat: "PRESS",
    title: "メディア掲載のお知らせ",
    body: "プライバシー保護領域での新サービスとして、複数の業界メディアにご紹介いただきました。",
  },
  {
    date: "2025.12.05",
    cat: "NEWS",
    title: "サービスサイトをリニューアルいたしました",
    body: "ブランドコンセプトに合わせて、サービスサイト全体のデザインを一新しました。",
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
