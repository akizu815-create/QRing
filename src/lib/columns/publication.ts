import { CATEGORIES, AUDIENCES, type Article, type ArticleCard } from "./types";

const legacySlugs = new Set(["elderly-monitoring", "lost-item-preparation"]);
const reservedSlugs = new Set(["audience", "category", "page"]);
const statuses = new Set(["draft", "review", "approved", "scheduled", "published", "needs_revision", "archived"]);
const dateIsValid = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const safeHref = (s: unknown): s is string => typeof s === "string" && (/^\/(?!\/)[a-zA-Z0-9/#?=&._-]*$/.test(s) || /^https:\/\//.test(s));
function requireValue(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(`Column content: ${message}`); }
function text(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }

/** Validates structured content, never evaluates HTML/JSX supplied by an author or generator. */
export function validateArticle(value: unknown): asserts value is Article {
  requireValue(value && typeof value === "object", "article must be an object");
  const a = value as Article;
  for (const key of ["id", "slug", "title", "summary", "seoTitle", "metaDescription", "serviceSpecificationVersion"] as const) requireValue(text(a[key]), `missing ${key}`);
  requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug) && !reservedSlugs.has(a.slug), `invalid/reserved slug ${a.slug}`);
  requireValue(a.introduction === undefined || (Array.isArray(a.introduction) && a.introduction.every(text)), `${a.slug}: introduction`);
  if (a.image) requireValue(/^\/images\/[a-zA-Z0-9/_.-]+$/.test(a.image.src) && text(a.image.alt) && Number.isInteger(a.image.width) && a.image.width > 0 && Number.isInteger(a.image.height) && a.image.height > 0, `${a.slug}: image`);
  requireValue(CATEGORIES.some((c) => c.id === a.category), `${a.slug}: category`);
  requireValue(AUDIENCES.some((r) => r.id === a.primaryAudience), `${a.slug}: audience`);
  requireValue(statuses.has(a.status), `${a.slug}: status`);
  requireValue(a.publicationOrigin === "existing" || a.publicationOrigin === "editorial", `${a.slug}: origin`);
  requireValue(a.publicationOrigin !== "existing" || legacySlugs.has(a.slug), `${a.slug}: legacy exception is restricted to the two existing URLs`);
  requireValue(dateIsValid(a.publishedAt), `${a.slug}: publication date`);
  for (const d of [a.updatedAt, a.reviewedAt, a.nextReviewAt]) requireValue(d === null || dateIsValid(d), `${a.slug}: review/update date`);
  requireValue(Number.isInteger(a.contentRevision) && a.contentRevision > 0, `${a.slug}: revision`);
  requireValue(["none", "contextual", "municipal"].includes(a.cta), `${a.slug}: CTA`);
  requireValue(Array.isArray(a.tags) && a.tags.every(text) && Array.isArray(a.relatedArticleIds) && a.relatedArticleIds.every(text), `${a.slug}: tags/related articles`);
  requireValue(a.relatedService === null || (safeHref(a.relatedService.href) && text(a.relatedService.label)), `${a.slug}: service link`);
  requireValue(Array.isArray(a.sources) && a.sources.length > 0, `${a.slug}: sources`);
  const sourceIds = new Set<string>();
  for (const s of a.sources) {
    requireValue(text(s.id) && !sourceIds.has(s.id) && text(s.label) && /^https:\/\//.test(s.href) && dateIsValid(s.checkedAt), `${a.slug}: source`);
    sourceIds.add(s.id);
  }
  requireValue(Array.isArray(a.claims) && a.claims.every((c) => text(c.text) && typeof c.verified === "boolean" && Array.isArray(c.sourceIds) && c.sourceIds.length > 0 && c.sourceIds.every((id) => sourceIds.has(id))), `${a.slug}: claim sources`);
  requireValue(Array.isArray(a.validationResults) && a.validationResults.every((r) => text(r.check) && typeof r.passed === "boolean"), `${a.slug}: checks`);
  requireValue(Array.isArray(a.sections) && a.sections.length > 0, `${a.slug}: sections`);
  const ids = new Set(["article-toc", "article-sources", "article-related", "article-next"]);
  for (const s of a.sections) {
    requireValue(/^[a-z][a-z0-9-]*$/.test(s.id) && !ids.has(s.id) && text(s.title) && Array.isArray(s.blocks) && s.blocks.length, `${a.slug}: section`);
    ids.add(s.id);
    for (const b of s.blocks) {
      switch (b.type) {
        case "paragraph": requireValue(text(b.text), `${a.slug}: paragraph`); break;
        case "list": requireValue(Array.isArray(b.items) && b.items.length && b.items.every(text), `${a.slug}: list`); break;
        case "link": requireValue(safeHref(b.href) && text(b.label) && (b.prefix === undefined || text(b.prefix)) && (b.suffix === undefined || text(b.suffix)), `${a.slug}: link`); break;
        case "table": requireValue(text(b.caption) && Array.isArray(b.headers) && b.headers.length && b.headers.every(text) && Array.isArray(b.rows) && b.rows.length && b.rows.every((r) => Array.isArray(r) && r.length === b.headers.length && r.every(text)), `${a.slug}: table`); break;
        default: throw new Error(`${a.slug}: unsupported block`);
      }
    }
  }
}

/** Build-time allowlist: this is a guard, NOT an authenticated approval mechanism. */
export function selectPublishedArticles(records: readonly unknown[], now = Date.now()): Article[] {
  const published: Article[] = [];
  const slugs = new Set<string>(); const ids = new Set<string>();
  for (const value of records) {
    const candidate = value as Partial<Article> | null;
    // Inactive records are never passed on to routes, metadata, sitemap or client components.
    if (!candidate || candidate.status !== "published") continue;
    validateArticle(value);
    requireValue(!slugs.has(value.slug) && !ids.has(value.id), `duplicate article ${value.slug}`);
    slugs.add(value.slug); ids.add(value.id);
    if (Date.parse(`${value.publishedAt}T00:00:00+09:00`) > now) continue;
    if (value.publicationOrigin !== "existing" || value.contentRevision !== 1) {
      requireValue(value.approvalRevision === value.contentRevision, `${value.slug}: missing/stale revision approval`);
      requireValue(value.claims.every((c) => c.verified) && value.validationResults.length > 0 && value.validationResults.every((r) => r.passed), `${value.slug}: unresolved quality checks`);
    }
    published.push(value);
  }
  return published.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
}
export function toArticleCard(a: Article): ArticleCard {
  return { id: a.id, slug: a.slug, title: a.title, summary: a.summary, category: a.category, primaryAudience: a.primaryAudience, publishedAt: a.publishedAt };
}
