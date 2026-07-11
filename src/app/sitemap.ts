import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://www.qring.jp";

const ROUTES = ["", "about", "service", "shop", "news", "law", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}/${route}${route ? "/" : ""}`,
    lastModified: new Date(),
  }));
}
