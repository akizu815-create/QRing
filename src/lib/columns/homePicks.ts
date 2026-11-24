import type { Article } from "./types";
import { latestArticles } from "./navigation";

/** Input is the existing publication-filtered registry; unavailable picks never bypass it. */
export function homeColumnPicks(published: Article[], slugs: readonly string[], limit = 3) {
  const selected: Article[] = [];
  for (const slug of slugs) {
    const article = published.find((a) => a.slug === slug);
    if (article && !selected.some((a) => a.id === article.id)) selected.push(article);
    if (selected.length >= limit) return selected;
  }
  for (const article of latestArticles(published, { limit: published.length })) {
    if (!selected.some((a) => a.id === article.id)) selected.push(article);
    if (selected.length >= limit) break;
  }
  return selected;
}
