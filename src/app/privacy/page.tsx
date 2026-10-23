import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import LegalDocument from "@/components/LegalDocument";
import paragraphs from "@/content/legal/privacy.json";


export const metadata = pageMetadata("privacy");

export default function PrivacyPage() {
  return <><PageStructuredData page="privacy" /><LegalDocument englishTitle="Privacy Policy." paragraphs={paragraphs} /></>;
}
