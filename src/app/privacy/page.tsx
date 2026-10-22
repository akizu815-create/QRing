import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import paragraphs from "@/content/legal/privacy.json";

export const metadata: Metadata = {
  title: "つながるQR プライバシーポリシー",
  description: "株式会社QRingが提供する「つながるQR」のプライバシーポリシーです。",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return <LegalDocument englishTitle="Privacy Policy." paragraphs={paragraphs} />;
}
