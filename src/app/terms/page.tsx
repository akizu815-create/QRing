import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import LegalDocument from "@/components/LegalDocument";
import paragraphs from "@/content/legal/terms.json";


export const metadata = pageMetadata("terms");

export default function TermsPage() {
  return <><PageStructuredData page="terms" /><LegalDocument englishTitle="Terms of Service." paragraphs={paragraphs} /></>;
}
