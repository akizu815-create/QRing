import Link from "next/link";
import { getArticleCards } from "@/lib/columns";
import ArticleList from "@/components/columns/ArticleList";
import ColumnStructuredData from "@/components/columns/ColumnStructuredData";
import { pageMetadata, SEO_PAGES } from "@/lib/seo";
export function generateMetadata() {
  return { ...pageMetadata("municipalColumns"), robots: { index: getArticleCards().some((a) => a.primaryAudience === "municipal"), follow: true } };
}
export default function MunicipalColumnsPage() {
  const articles = getArticleCards().filter((a) => a.primaryAudience === "municipal");
  return <>
    <ColumnStructuredData path="/column/audience/municipal/" title={SEO_PAGES.municipalColumns.title} description={SEO_PAGES.municipalColumns.description} articles={articles} />
    <section className="bg-cream pb-16 pt-36 md:pb-24 md:pt-48"><div className="container-narrow">
      <nav aria-label="パンくず" className="text-xs leading-7 text-ink/60"><Link href="/">ホーム</Link> / <Link href="/column/">コラム</Link></nav>
      <p className="eyebrow mt-8">FOR MUNICIPALITIES</p>
      <h1 className="mt-8 font-serif text-[clamp(30px,4.2vw,48px)] font-light leading-[1.6]">自治体・公共機関の皆さまへ。</h1>
      <p className="body-jp mt-8 text-sm md:text-base">地域の見守りや安全、行政DX、実証実験を検討する際に、課題の整理と施策の選択に役立つ情報をお届けします。</p>
      <p className="body-jp mt-5 text-sm">既存施策の役割比較、発見後の連絡体制、実証の評価項目など、現場での検討に使えるテーマを扱います。</p>
    </div></section>
    <section className="py-16 md:py-24" aria-labelledby="municipal-column-list"><div className="container-narrow"><h2 id="municipal-column-list" className="mb-8 font-serif text-2xl font-light">地域の課題から考える</h2><ArticleList articles={articles} fixedAudience="municipal" /><div className="mt-10 flex flex-col items-start gap-5 text-sm text-moss"><Link href="/column/" className="link-underline">すべてのコラムを読む →</Link><Link href="/municipalities/" className="link-underline">自治体向けサービスについて →</Link></div></div></section>
  </>;
}
