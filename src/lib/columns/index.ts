// Server entrypoint. Client components import types.ts only, never this registry.
import records from "@/content/columns/published.json";
import { selectPublishedArticles, toArticleCard } from "./publication";
export { toArticleCard } from "./publication";
export function getPublishedArticles() {
  // Only Cloudflare branch previews include approved manuscripts awaiting release.
  const previewPending = process.env.CF_PAGES === "1" && Boolean(process.env.CF_PAGES_BRANCH) && process.env.CF_PAGES_BRANCH !== "main";
  // CI fixes one instant for the whole static build and its export checks.
  // This also permits deterministic, local-only boundary verification.
  const buildAt = process.env.COLUMN_BUILD_AT;
  const now = buildAt ? Date.parse(buildAt) : Date.now();
  if (!Number.isFinite(now) || (buildAt && !/(?:Z|[+-]\d{2}:\d{2})$/.test(buildAt))) {
    throw new Error("COLUMN_BUILD_AT must be an ISO timestamp with an explicit timezone");
  }
  return selectPublishedArticles(records, now, { previewPending });
}
export function getPublishedArticle(slug: string) { return getPublishedArticles().find((a) => a.slug === slug); }
export function getArticleCards() { return getPublishedArticles().map(toArticleCard); }
