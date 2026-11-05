import { getPublishedArticles } from "@/lib/columns";
import { latestArticles } from "@/lib/columns/navigation";
import RecentColumnLinks from "./RecentColumnLinks";
export default function RelatedServiceColumns({ serviceHref, id }: { serviceHref: string; id: string }) {
  const articles = latestArticles(getPublishedArticles(), { serviceHref });
  if (!articles.length) return null;
  return <section className="py-16 md:py-24" aria-labelledby={id}><div className="container-narrow"><p className="eyebrow">COLUMN</p><h2 id={id} className="mt-6 font-serif text-2xl font-light leading-relaxed md:text-3xl">関連するコラム</h2><RecentColumnLinks articles={articles} /></div></section>;
}
