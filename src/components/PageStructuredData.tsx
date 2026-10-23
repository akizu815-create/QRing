import { SEO_PAGES, SITE_URL, type SeoPage } from "@/lib/seo";

export default function PageStructuredData({ page: key }: { page: SeoPage }) {
  const page = SEO_PAGES[key];
  const url = `${SITE_URL}${page.path}`;
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const graph: Record<string, unknown>[] = [];
  // Organization / WebSite の実体はHOMEだけに定義し、各ページから同じ@idを参照する。
  if (key === "home") {
    graph.push(
      { "@type": "Organization", "@id": organizationId, name: "株式会社QRing", legalName: "株式会社QRing", url: `${SITE_URL}/` },
      { "@type": "WebSite", "@id": websiteId, name: "株式会社QRing｜つながるQR", url: `${SITE_URL}/`, inLanguage: "ja-JP", publisher: { "@id": organizationId } },
    );
  }
  graph.push({
    "@type": "WebPage", "@id": `${url}#webpage`, url,
    name: page.title, description: page.description, inLanguage: "ja-JP",
    isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
  });
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
