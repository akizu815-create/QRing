import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import paragraphs from "@/content/legal/terms.json";

export const metadata: Metadata = {
  title: "つながるQR 利用規約",
  description: "株式会社QRingが提供する「つながるQR」の利用規約です。",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return <LegalDocument englishTitle="Terms of Service." paragraphs={paragraphs} />;
}
