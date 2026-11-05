// Server entrypoint. Client components import types.ts only, never this registry.
import records from "@/content/columns/published.json";
import { selectPublishedArticles, toArticleCard } from "./publication";
export { toArticleCard } from "./publication";
export function getPublishedArticles() { return selectPublishedArticles(records); }
export function getPublishedArticle(slug: string) { return getPublishedArticles().find((a) => a.slug === slug); }
export function getArticleCards() { return getPublishedArticles().map(toArticleCard); }
