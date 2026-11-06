import { relatedArticles } from "@/lib/columns/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ColumnArticle from "@/components/columns/ColumnArticle";
import { getPublishedArticles, getPublishedArticle } from "@/lib/columns";
import { articlePublishedTime, articleModifiedTime, articlePath } from "@/lib/columns/types";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return getPublishedArticles().map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getPublishedArticle((await params).slug);
  if (!a) notFound();
  return { ...(a.publicationPending ? { robots: { index: false, follow: false } } : {}), title: { absolute: a.seoTitle }, description: a.metaDescription, alternates: { canonical: articlePath(a.slug) }, openGraph: { title: a.seoTitle, description: a.metaDescription, url: articlePath(a.slug), type: "article", locale: "ja_JP", ...(a.image ? { images: [{ url: a.image.src, width: a.image.width, height: a.image.height, alt: a.image.alt }] } : {}), ...(!a.publicationPending ? { publishedTime: articlePublishedTime(a) } : {}), ...(a.updatedAt ? { modifiedTime: articleModifiedTime(a) } : {}) } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getPublishedArticle((await params).slug);
  if (!a) notFound();
  return <ColumnArticle article={a} related={relatedArticles(a, getPublishedArticles())} />;
}
