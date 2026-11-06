export const CATEGORIES = [
  { id: "elderly-dementia", label: "高齢者・認知症" },
  { id: "family-care", label: "家族の見守り・介護" },
  { id: "lost-items", label: "落とし物・紛失対策" },
  { id: "pets", label: "ペット・迷子対策" },
  { id: "municipal-community", label: "自治体・地域課題" },
  { id: "business-safety", label: "企業・施設の安全対策" },
  { id: "privacy-life", label: "暮らしの安心・プライバシー" },
] as const;
export const AUDIENCES = [
  { id: "personal", label: "個人・家族" },
  { id: "municipal", label: "自治体・公共機関" },
  { id: "business", label: "企業・施設" },
] as const;
export type Category = typeof CATEGORIES[number]["id"];
export type Audience = typeof AUDIENCES[number]["id"];
export type ArticleStatus = "draft" | "review" | "approved" | "scheduled" | "published" | "needs_revision" | "archived";
export type Block =
  | { type: "paragraph"; text: string; small?: boolean }
  | { type: "list"; items: string[] }
  | { type: "link"; href: string; label: string; prefix?: string; suffix?: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] };
export type Article = {
  id: string; slug: string; title: string; summary: string; seoTitle: string; metaDescription: string;
  introduction?: string[];
  image?: { src: string; width: number; height: number; alt: string };
  category: Category; primaryAudience: Audience; tags: string[]; status: ArticleStatus;
  publicationOrigin: "existing" | "editorial";
  editionDate?: string;
  publishedTimestamp?: string;
  contentFormat?: "approved-manuscript";
  approvalRecord?: { sourceFile: string; sha256: string; approvedOn: string };
  publishedAt: string; updatedAt: string | null; reviewedAt: string | null; nextReviewAt: string | null;
  serviceSpecificationVersion: string; contentRevision: number; approvalRevision: number | null;
  relatedLinks?: { href: string; label: string }[];
  relatedArticleIds: string[]; relatedService: { href: string; label: string } | null;
  sources: { id: string; label: string; href: string; checkedAt: string }[];
  sections: { id: string; title: string; blocks: Block[] }[];
  cta: "none" | "contextual" | "municipal";
  searchIntent: string; primaryKeyword: string; topicClusterId: string;
  claims: { text: string; sourceIds: string[]; verified: boolean }[];
  validationResults: { check: string; passed: boolean }[];
  generationRunId: string | null; promptVersion: string | null;
};
// Only this projection crosses the server/client boundary. Never pass full records to the list.
export type ArticleCard = Pick<Article, "id" | "slug" | "title" | "summary" | "category" | "primaryAudience" | "publishedAt" | "publishedTimestamp" | "image">;
export const categoryLabel = (id: Category) => CATEGORIES.find((c) => c.id === id)!.label;
export const audienceLabel = (id: Audience) => AUDIENCES.find((a) => a.id === id)!.label;
export const articlePath = (slug: string) => `/column/${slug}/`;
export const formatDate = (value: string) => new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" }).format(new Date(value));

// Issue dates are for editorial organization, never substitutes for publication history.
export const COLUMN_OPERATION_STARTED_ON = "2026-11-01";
export const articlePublicationDate = (a: Pick<Article, "publishedAt">) => a.publishedAt;
export function comparePublicationDates(a: Pick<Article, "publishedAt" | "publishedTimestamp" | "slug">, b: Pick<Article, "publishedAt" | "publishedTimestamp" | "slug">) {
  const byDate = b.publishedAt.localeCompare(a.publishedAt);
  const byTime = a.publishedTimestamp && b.publishedTimestamp ? Date.parse(b.publishedTimestamp) - Date.parse(a.publishedTimestamp) : 0;
  const byKnownTime = Number(Boolean(b.publishedTimestamp)) - Number(Boolean(a.publishedTimestamp));
  return byDate || byKnownTime || byTime || a.slug.localeCompare(b.slug);
}
export const articlePublishedTime = (a: Pick<Article, "publishedAt" | "publishedTimestamp">) => a.publishedTimestamp ?? a.publishedAt;
export const articleModifiedTime = (a: Article) => a.updatedAt ?? undefined;
