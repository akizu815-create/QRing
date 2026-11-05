import Link from "next/link";
import { pageMetadata, SEO_PAGES } from "@/lib/seo";
import ColumnStructuredData from "@/components/columns/ColumnStructuredData";
import ArticleList from "@/components/columns/ArticleList";
import { getArticleCards } from "@/lib/columns";
export const metadata = pageMetadata("guides");
export default function ColumnPage() {
  const articles = getArticleCards();
  return <>
    <ColumnStructuredData path="/column/" title={SEO_PAGES.guides.title} description={SEO_PAGES.guides.description} articles={articles} />
    <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48"><div className="container-narrow">
      <p className="eyebrow">COLUMN</p>
      <h1 className="mt-8 font-serif text-[clamp(30px,4.2vw,52px)] font-light leading-[1.6]">見守りと、暮らしの安心を<br />考えるコラム。</h1>
      <p className="body-jp mt-8 text-sm md:text-base">ご本人とご家族、自治体・公共機関、企業・施設の皆さまへ。見守りや紛失対策、プライバシーについて、課題と備えの選び方をお届けします。</p>
      <Link href="/column/audience/municipal/" className="link-underline mt-8 inline-block py-2 text-sm text-moss">自治体・公共機関向けのコラムを読む →</Link>
    </div></section>
    <section className="py-16 md:py-24" aria-labelledby="column-list"><div className="container-narrow"><h2 id="column-list" className="mb-8 font-serif text-2xl font-light">テーマと読者から探す</h2><ArticleList articles={articles} /></div></section>
  </>;
}
