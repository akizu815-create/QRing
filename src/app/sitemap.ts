import type { MetadataRoute } from "next";
import { SEO_PAGES, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // 本文更新日を正確に管理する仕組みがないため、任意項目lastModifiedは出力しない。
  return Object.values(SEO_PAGES).map((page) => ({ url: `${SITE_URL}${page.path}` }));
}
