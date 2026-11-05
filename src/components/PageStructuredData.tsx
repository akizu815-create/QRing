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
  if (key !== "home") {
    // Reflect the existing HOME → page navigation, without inventing parent URLs.
    const breadcrumbId = `${url}#breadcrumb`;
    graph[graph.length - 1].breadcrumb = { "@id": breadcrumbId };
    graph.push({
      "@type": "BreadcrumbList", "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HOME", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: page.title.split("｜")[0], item: url },
      ],
    });
  }
  if (key === "service") {
    graph[0].mainEntity = { "@id": `${url}#service` };
    graph.push({
      "@type": "Service", "@id": `${url}#service`, name: "つながるQR", url,
      description: "つながるQRは、QRコードを通じて、お互いの電話番号を公開せずに通話できるサービスです。",
      provider: { "@id": organizationId }, areaServed: { "@type": "Country", name: "日本" },
    });
  }
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
