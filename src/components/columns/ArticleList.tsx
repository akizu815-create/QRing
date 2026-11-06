"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, AUDIENCES, articleDisplayDate, categoryLabel, audienceLabel, articlePath, formatDate, type ArticleCard, type Audience } from "@/lib/columns/types";
import { COLUMN_PAGE_SIZE as PAGE_SIZE, columnListPath } from "@/lib/columns/navigation";
export default function ArticleList({ articles, fixedAudience, initialPage = 1, basePath = "/column/" }: { articles: ArticleCard[]; fixedAudience?: Audience; initialPage?: number; basePath?: string }) {
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState(fixedAudience ?? "");
  const [page, setPage] = useState(initialPage);
  const filteredMode = Boolean(category || (!fixedAudience && audience));
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm leading-7 text-ink/70">公開記事{articles.length}件{filteredMode ? `中${filtered.length}件を表示` : ""}{filtered.length > PAGE_SIZE ? ` ・ ${current} / ${pages}ページ` : ""}</p>
        {filteredMode && <button type="button" onClick={reset} className="min-h-12 text-sm text-moss underline underline-offset-4">絞り込みを解除する</button>}
      </div>
      {filtered.length ? <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((a) => <article key={a.id} className="flex flex-col border-t border-ink/20 pt-7">
          {a.image && <Link href={articlePath(a.slug)} tabIndex={-1} aria-hidden="true"><Image src={a.image.src} width={a.image.width} height={a.image.height} alt="" sizes="(max-width: 768px) 100vw, 384px" className="mb-6 h-auto w-full" /></Link>}
          <p className="text-xs leading-7 text-ink/65">{categoryLabel(a.category)}<span aria-hidden="true"> ／ </span>{audienceLabel(a.primaryAudience)}</p>
          <h3 className="mt-4 font-serif text-2xl font-light leading-relaxed"><Link className="hover:text-moss" href={articlePath(a.slug)}>{a.title}</Link></h3>
          <p className="body-jp mt-5 flex-1 text-sm">{a.summary}</p>
          <p className="mt-5 text-xs text-ink/60">記事日：<time dateTime={articleDisplayDate(a)}>{formatDate(articleDisplayDate(a))}</time></p>
          <Link className="link-underline mt-6 self-start py-2 text-sm text-moss" href={articlePath(a.slug)}>記事を読む →<span className="sr-only">{a.title}</span></Link>
        </article>)}
      </div> : <div className="py-12"><p className="body-jp text-sm">該当する公開記事はまだありません。</p></div>}
      {pages > 1 && <nav aria-label="記事一覧のページ送り" className="mt-12 flex flex-wrap items-center gap-4 text-sm">
        {filteredMode ? <button type="button" className="min-h-12 border border-ink/25 px-5 disabled:opacity-40" disabled={current === 1} onClick={() => setPage(current - 1)}>前へ</button> : current > 1 ? <Link href={columnListPath(current - 1, basePath)} onClick={() => setPage(current - 1)} className="inline-flex min-h-12 items-center border border-ink/25 px-5">前へ</Link> : <span className="inline-flex min-h-12 items-center border border-ink/25 px-5 opacity-40">前へ</span>}
        <span>{current} / {pages}</span>
        {filteredMode ? <button type="button" className="min-h-12 border border-ink/25 px-5 disabled:opacity-40" disabled={current === pages} onClick={() => setPage(current + 1)}>次へ</button> : current < pages ? <Link href={columnListPath(current + 1, basePath)} onClick={() => setPage(current + 1)} className="inline-flex min-h-12 items-center border border-ink/25 px-5">次へ</Link> : <span className="inline-flex min-h-12 items-center border border-ink/25 px-5 opacity-40">次へ</span>}
      </nav>}
    </div>
  );
}
