import Link from "next/link";
import { getPublishedArticles } from "@/lib/columns";
import { latestArticles } from "@/lib/columns/navigation";
import RecentColumnLinks from "./RecentColumnLinks";
export default function HomeColumns() {
  const articles = latestArticles(getPublishedArticles());
  return <section id="column" aria-labelledby="home-column-title" className="py-24 md:py-32">
    <div className="container-wide grid gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-4"><p className="eyebrow">COLUMN</p><h2 id="home-column-title" className="mt-6 font-serif text-3xl font-light leading-relaxed md:text-4xl">暮らしと地域の<br />安心を考えるコラム。</h2><p className="body-jp mt-6 text-sm">ご家族の見守りから、地域や施設での備えまで。課題に合った対策を考えるための情報をお届けします。</p><Link href="/column/" className="link-underline mt-8 inline-block py-2 text-sm text-moss">コラム一覧を見る →</Link></div>
      <div className="md:col-span-8"><RecentColumnLinks articles={articles} /></div>
    </div>
  </section>;
}
