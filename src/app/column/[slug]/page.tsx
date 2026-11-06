import { relatedArticles } from "@/lib/columns/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ColumnArticle from "@/components/columns/ColumnArticle";
import { getPublishedArticles, getPublishedArticle } from "@/lib/columns";
import { articlePath } from "@/lib/columns/types";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return getPublishedArticles().map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getPublishedArticle((await params).slug);
  if (!a) notFound();
  return { title: { absolute: a.seoTitle }, description: a.metaDescription, alternates: { canonical: articlePath(a.slug) }, openGraph: { title: a.seoTitle, description: a.metaDescription, url: articlePath(a.slug), type: "article", locale: "ja_JP", ...(a.image ? { images: [{ url: a.image.src, width: a.image.width, height: a.image.height, alt: a.image.alt }] } : {}), publishedTime: `${a.publishedAt}T00:00:00+09:00`, ...(a.updatedAt ? { modifiedTime: `${a.updatedAt}T00:00:00+09:00` } : {}) } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getPublishedArticle((await params).slug);
  if (!a) notFound();
  return <ColumnArticle article={a} related={relatedArticles(a, getPublishedArticles())} />;
}
