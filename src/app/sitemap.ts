import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";
import type { MetadataRoute } from "next";
import { SEO_PAGES, SITE_URL } from "@/lib/seo";
import { getPublishedArticles } from "@/lib/columns";
import { articlePath } from "@/lib/columns/types";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  // Article URLs come from the publication allowlist, never the legacy SEO registry.
  const staticPages = Object.entries(SEO_PAGES).filter(([key, page]) =>
    key !== "elderlyGuide" && key !== "belongingsGuide" &&
    (key !== "municipalColumns" || articles.some((a) => a.primaryAudience === "municipal")) &&
    (page.path !== NEWMARKET_SUPPORT.path || isNewmarketSupportActive())
  ).map(([, page]) => ({ url: `${SITE_URL}${page.path}` }));
  // Preserve the existing omission of lastModified; no fabricated build dates.
  return [...staticPages, ...articles.map((a) => ({ url: `${SITE_URL}${articlePath(a.slug)}` }))];
}
