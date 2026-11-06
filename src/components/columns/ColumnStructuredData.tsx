import { SITE_URL } from "@/lib/seo";
import { articlePublishedTime, articleModifiedTime, articlePath, type Article, type ArticleCard } from "@/lib/columns/types";
export default function ColumnStructuredData({ path, title, description, article, articles = [] }: { path: string; title: string; description: string; article?: Article; articles?: ArticleCard[] }) {
  const url = `${SITE_URL}${path}`;
  const graph: Record<string, unknown>[] = [{ "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "ja-JP", isPartOf: { "@id": `${SITE_URL}/#website` }, publisher: { "@id": `${SITE_URL}/#organization` } }];
  const crumbs = [{ name: "ホーム", path: "/" }, ...(path !== "/column/" ? [{ name: "コラム", path: "/column/" }] : []), { name: article?.title ?? title, path }];
  graph[0].breadcrumb = { "@id": `${url}#breadcrumbs` };
  if (article) graph[0].mainEntity = { "@id": `${url}#article` };
  else if (articles.length) graph[0].mainEntity = { "@id": `${url}#articles` };
  graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.path}` })) });
  if (article) graph.push({ "@type": "Article", "@id": `${url}#article`, headline: article.title, description, ...(article.image ? { image: `${SITE_URL}${article.image.src}` } : {}), mainEntityOfPage: { "@id": `${url}#webpage` }, datePublished: articlePublishedTime(article), ...(article.updatedAt ? { dateModified: articleModifiedTime(article) } : {}), author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "株式会社QRing" }, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "ja-JP" });
  else if (articles.length) graph.push({ "@type": "ItemList", "@id": `${url}#articles`, itemListElement: articles.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${articlePath(a.slug)}`, name: a.title })) });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
