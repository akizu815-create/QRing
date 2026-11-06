import { articleDisplayDate, type Article, type Audience } from "./types";
export const COLUMN_PAGE_SIZE = 9;
export function columnPageCount(total: number) { return Math.max(1, Math.ceil(total / COLUMN_PAGE_SIZE)); }
export function columnListPath(page: number, base = "/column/") { return page === 1 ? base : `${base}page/${page}/`; }
export function latestArticles(articles: Article[], options: { audience?: Audience; serviceHref?: string; limit?: number } = {}) {
  return articles.filter((a) => (!options.audience || a.primaryAudience === options.audience) && (!options.serviceHref || a.relatedService?.href === options.serviceHref))
    .sort((a, b) => articleDisplayDate(b).localeCompare(articleDisplayDate(a)) || a.slug.localeCompare(b.slug))
    .slice(0, options.limit ?? 3);
}
/** Explicit outgoing links plus reverse links make authored related-article edges reciprocal. */
export function relatedArticles(article: Article, published: Article[]) {
  const explicit = published.filter((a) => a.id !== article.id && article.relatedArticleIds.includes(a.id));
  const incoming = published.filter((a) => a.id !== article.id && !article.relatedArticleIds.includes(a.id) && a.relatedArticleIds.includes(article.id));
  return [...explicit, ...incoming].slice(0, 3);
}
