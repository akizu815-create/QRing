import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import PageHeader from "@/components/PageHeader";
import FaqAccordion from "./FaqAccordion";


export const metadata = pageMetadata("faq");

export default function FaqPage() {
  return (
    <>
      <PageStructuredData page="faq" />
      <PageHeader eyebrow="— FAQ" en="Frequently Asked Questions" jp="よくあるご質問" />
      <section className="py-24 md:py-32">
        <div className="container-narrow">
          <p className="mb-12 max-w-3xl text-sm leading-loose text-ink/75 md:mb-16 md:text-base">「つながるQR」のサービス内容や使い方、料金、お支払いなどについて、よくあるご質問をまとめました。</p>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
