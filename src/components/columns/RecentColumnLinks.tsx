import Link from "next/link";
import { articlePath, categoryLabel, formatDate, type Article } from "@/lib/columns/types";
export default function RecentColumnLinks({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15" data-column-article-links>
    {articles.map((a) => <li key={a.id}>
      <Link href={articlePath(a.slug)} className="group block py-6 md:py-7">
        <p className="text-xs leading-7 text-ink/65"><time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time><span className="ml-4">{categoryLabel(a.category)}</span></p>
        <p className="mt-2 font-serif text-lg font-light leading-relaxed transition-colors group-hover:text-moss md:text-xl">{a.title}<span aria-hidden="true" className="ml-3 text-sm text-moss">→</span></p>
      </Link>
    </li>)}
  </ul>;
}
