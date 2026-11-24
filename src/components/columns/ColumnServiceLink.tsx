"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const ALLOWED = new Set(["/service/", "/service/#privacy-call", "/use-cases/elderly/", "/use-cases/pets/", "/use-cases/belongings/", "/municipalities/", "/collaboration/"]);
type Props = { href: string; slug: string; category: string; placement: string; kind: string; children: ReactNode; className?: string };
export default function ColumnServiceLink({ href, slug, category, placement, kind, children, className }: Props) {
  function track() {
    if (!ALLOWED.has(href)) return;
    const { gtag } = window as Window & { gtag?: (command: "event", name: string, parameters: Record<string, string>) => void };
    if (typeof gtag === "function") gtag("event", "column_service_click", {
      article_slug: slug, article_category: category, destination_page: href, placement, cta_type: kind,
    });
  }
  return <Link href={href} className={className} onClick={track} data-column-service-link={ALLOWED.has(href) ? placement : undefined}>{children}</Link>;
}
