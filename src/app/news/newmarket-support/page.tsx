import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import NewmarketSupportCopy from "@/components/NewmarketSupportCopy";
import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";

export const metadata = isNewmarketSupportActive()
  ? pageMetadata("newmarket")
  : { title: "お知らせ", robots: { index: false } };

export default function NewmarketSupportNews() {
  if (!isNewmarketSupportActive()) notFound();
  return (
    <>
      <PageStructuredData page="newmarket" />
      <article data-newmarket-article className="pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="container-narrow">
          <p className="eyebrow">NEWS</p>
          <time dateTime={NEWMARKET_SUPPORT.publishedOn} className="mt-7 block text-sm text-ink/60">{NEWMARKET_SUPPORT.publishedOn.replaceAll("-", ".")}</time>
          <h1 className="mt-7 font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.7]">{NEWMARKET_SUPPORT.title}</h1>
          <div className="mt-10 border-t border-ink/10 pt-10 md:mt-14 md:pt-12"><NewmarketSupportCopy /></div>
          <Link href="/news/" className="link-underline mt-12 inline-block text-sm text-moss">お知らせ一覧へ戻る →</Link>
        </div>
      </article>
    </>
  );
}
