import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleCards } from "@/lib/columns";
import { COLUMN_PAGE_SIZE, columnListPath, columnPageCount } from "@/lib/columns/navigation";
import { pageMetadata, SEO_PAGES } from "@/lib/seo";
import ArticleList from "./ArticleList";
import { COLUMN_OPERATION_STARTED_ON, formatDate } from "@/lib/columns/types";
import ColumnStructuredData from "./ColumnStructuredData";
export function listingData(municipal: boolean, pageNumber: number) {
  const articles = getArticleCards().filter((a) => !municipal || a.primaryAudience === "municipal");
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > columnPageCount(articles.length)) notFound();
  const base = municipal ? "/column/audience/municipal/" : "/column/";
  const seoKey = municipal ? "municipalColumns" : "guides";
  return { articles, base, path: columnListPath(pageNumber, base), seoKey, seo: SEO_PAGES[seoKey] } as const;
}
export function listingMetadata(municipal: boolean, pageNumber: number, alias = false): Metadata {
  const { articles, path, seoKey, seo } = listingData(municipal, pageNumber);
  const title = pageNumber > 1 ? `${seo.title}｜${pageNumber}ページ目` : seo.title;
  return { ...pageMetadata(seoKey), title: { absolute: title }, alternates: { canonical: path }, openGraph: { title, description: seo.description, url: path, type: "website", locale: "ja_JP" }, robots: { index: !alias && (!municipal || articles.length > 0), follow: true } };
}
export default function ColumnListing({ municipal = false, pageNumber = 1 }: { municipal?: boolean; pageNumber?: number }) {
  const { articles, path, base, seo } = listingData(municipal, pageNumber);
  return <>
    <ColumnStructuredData path={path} title={pageNumber > 1 ? `${seo.title}｜${pageNumber}ページ目` : seo.title} description={seo.description} articles={articles.slice((pageNumber - 1) * COLUMN_PAGE_SIZE, pageNumber * COLUMN_PAGE_SIZE)} />
    <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48"><div className="container-narrow">
      {municipal && <nav aria-label="パンくず" className="text-xs leading-7 text-ink/60"><Link href="/">ホーム</Link> / <Link href="/column/">コラム</Link></nav>}
      <p className={`eyebrow ${municipal ? "mt-8" : ""}`}>{municipal ? "FOR MUNICIPALITIES" : "COLUMN"}</p>
      <h1 className="mt-8 font-serif text-[clamp(30px,4.2vw,52px)] font-light leading-[1.6]">{municipal ? "自治体・公共機関の皆さまへ。" : <>見守りと、暮らしの安心を<br />考えるコラム。</>}</h1>
      <p className="body-jp mt-8 text-sm md:text-base">{municipal ? "地域の見守りや安全、行政DX、実証実験を検討する際に、課題の整理と施策の選択に役立つ情報をお届けします。" : "ご本人とご家族、自治体・公共機関、企業・施設の皆さまへ。見守りや紛失対策、プライバシーについて、課題と備えの選び方をお届けします。"}</p>
      {!municipal && <p className="mt-5 text-xs leading-7 text-ink/60">コラム運用開始日：<time dateTime={COLUMN_OPERATION_STARTED_ON}>{formatDate(COLUMN_OPERATION_STARTED_ON)}</time></p>}
      {municipal ? <p className="body-jp mt-5 text-sm">既存施策の役割比較、発見後の連絡体制、実証の評価項目など、現場での検討に使えるテーマを扱います。</p> : <Link href="/column/audience/municipal/" className="link-underline mt-8 inline-block py-2 text-sm text-moss">自治体・公共機関向けのコラムを読む →</Link>}
    </div></section>
    <section className="py-16 md:py-24" aria-labelledby="column-list"><div className="container-narrow"><h2 id="column-list" className="mb-8 font-serif text-2xl font-light">{municipal ? "地域の課題から考える" : "テーマと読者から探す"}</h2><ArticleList key={`${base}${pageNumber}`} articles={articles} fixedAudience={municipal ? "municipal" : undefined} initialPage={pageNumber} basePath={base} />
      {municipal && <div className="mt-10 flex flex-col items-start gap-5 text-sm text-moss"><Link href="/column/" className="link-underline">すべてのコラムを読む →</Link><Link href="/municipalities/" className="link-underline">自治体向けサービスについて →</Link></div>}
    </div></section>
  </>;
}
