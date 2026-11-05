"use client";
import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, AUDIENCES, categoryLabel, audienceLabel, articlePath, formatDate, type ArticleCard, type Audience } from "@/lib/columns/types";
const PAGE_SIZE = 9;
export default function ArticleList({ articles, fixedAudience }: { articles: ArticleCard[]; fixedAudience?: Audience }) {
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState(fixedAudience ?? "");
  const [page, setPage] = useState(1);
  const filtered = articles.filter((a) => (!category || a.category === category) && (!(fixedAudience || audience) || a.primaryAudience === (fixedAudience || audience)));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const reset = () => { setCategory(""); setAudience(fixedAudience ?? ""); setPage(1); };
  return (
    <div>
      <div className="grid gap-5 border-y border-ink/15 py-7 sm:grid-cols-2">
        <label className="text-sm leading-7">カテゴリー
          <select className="mt-2 block min-h-12 w-full border border-ink/25 bg-ivory px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">すべてのカテゴリー</option>{CATEGORIES.map((c) => <option value={c.id} key={c.id}>{c.label}</option>)}
          </select>
        </label>
        {!fixedAudience && <label className="text-sm leading-7">想定読者
          <select className="mt-2 block min-h-12 w-full border border-ink/25 bg-ivory px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" value={audience} onChange={(e) => { setAudience(e.target.value); setPage(1); }}>
            <option value="">すべての読者</option>{AUDIENCES.map((a) => <option value={a.id} key={a.id}>{a.label}</option>)}
          </select>
        </label>}
      </div>
      <p role="status" aria-live="polite" className="mt-6 text-sm leading-7 text-ink/70">{filtered.length}件の記事{filtered.length > PAGE_SIZE ? ` ・ ${current} / ${pages}ページ` : ""}</p>
      {filtered.length ? <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((a) => <article key={a.id} className="flex flex-col border-t border-ink/20 pt-7">
          <p className="text-xs leading-7 text-ink/65">{categoryLabel(a.category)}<span aria-hidden="true"> ／ </span>{audienceLabel(a.primaryAudience)}</p>
          <h3 className="mt-4 font-serif text-2xl font-light leading-relaxed"><Link className="hover:text-moss" href={articlePath(a.slug)}>{a.title}</Link></h3>
          <p className="body-jp mt-5 flex-1 text-sm">{a.summary}</p>
          <p className="mt-5 text-xs text-ink/60">公開日：<time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time></p>
          <Link className="link-underline mt-6 self-start py-2 text-sm text-moss" href={articlePath(a.slug)}>記事を読む →<span className="sr-only">{a.title}</span></Link>
        </article>)}
      </div> : <div className="py-12"><p className="body-jp text-sm">該当する公開記事はまだありません。</p>{(category || (!fixedAudience && audience)) && <button type="button" className="mt-4 min-h-12 text-sm text-moss underline underline-offset-4" onClick={reset}>絞り込みを解除する</button>}</div>}
      {pages > 1 && <nav aria-label="記事一覧のページ送り" className="mt-12 flex flex-wrap items-center gap-4 text-sm">
        <button type="button" className="min-h-12 border border-ink/25 px-5 disabled:opacity-40" disabled={current === 1} onClick={() => setPage(current - 1)}>前へ</button>
        <span>{current} / {pages}</span>
        <button type="button" className="min-h-12 border border-ink/25 px-5 disabled:opacity-40" disabled={current === pages} onClick={() => setPage(current + 1)}>次へ</button>
      </nav>}
    </div>
  );
}
