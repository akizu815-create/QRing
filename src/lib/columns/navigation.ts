import { compareArticleDates, type Article, type Audience } from "./types";
export const COLUMN_PAGE_SIZE = 9;
export function columnPageCount(total: number) { return Math.max(1, Math.ceil(total / COLUMN_PAGE_SIZE)); }
export function columnListPath(page: number, base = "/column/") { return page === 1 ? base : `${base}page/${page}/`; }
export function latestArticles(articles: Article[], options: { audience?: Audience; serviceHref?: string; limit?: number } = {}) {
  return articles.filter((a) => (!options.audience || a.primaryAudience === options.audience) && (!options.serviceHref || (a.relatedService?.href === options.serviceHref || a.relatedLinks?.some((link) => link.href === options.serviceHref))))
    .sort(compareArticleDates)
    .slice(0, options.limit ?? 3);
}
/** Explicit outgoing links plus reverse links make authored related-article edges reciprocal. */
export function relatedArticles(article: Article, published: Article[]) {
  const explicit = published.filter((a) => a.id !== article.id && article.relatedArticleIds.includes(a.id));
  const incoming = published.filter((a) => a.id !== article.id && !article.relatedArticleIds.includes(a.id) && a.relatedArticleIds.includes(article.id));
  return [...explicit, ...incoming].slice(0, 3);
}

/** A future related article must not become a body link before its own release. */
export function visibleArticleSections(article: Article, published: Article[]) {
  const paths = new Set(published.map((a) => `/column/${a.slug}/`));
  return article.sections.map((section) => ({ ...section, blocks: section.blocks.filter((block) => {
    if (block.type !== "link") return true;
    const path = block.href.replace(/^https:\/\/www\.qring\.jp/, "").split(/[?#]/)[0];
    return !/^\/column\/[^/]+\/$/.test(path) || paths.has(path);
  }) }));
}
