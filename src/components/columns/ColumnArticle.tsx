import ColumnServiceLink from "./ColumnServiceLink";
import { additionalServiceCta, articleCtaKind } from "@/lib/columns/serviceCta";
import Link from "next/link";
import PetSurveyLink from "@/components/PetSurveyLink";
import { SITE_URL } from "@/lib/seo";
import Image from "next/image";
import { CONSUMER_SERVICE } from "@/config/consumerService";
import { GuideSection } from "@/components/GuidePage";
import ColumnStructuredData from "./ColumnStructuredData";
import { getPublishedArticles } from "@/lib/columns";
import { visibleArticleSections } from "@/lib/columns/navigation";
import { articlePath, articleDisplayDate, articlePublishedTime, audienceLabel, categoryLabel, formatDate, type Article, type Block } from "@/lib/columns/types";
function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": return <h3 className="pt-3 font-serif text-xl font-light leading-relaxed md:text-2xl">{block.text}</h3>;
    case "paragraph": return <p className={[block.small ? "text-xs text-ink/65" : "", block.text.startsWith("https://") ? "break-all" : ""].filter(Boolean).join(" ") || undefined}>{block.text}</p>;
    case "list": return <ul className="list-disc space-y-3 pl-5">{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    case "link": {
      const link = <Link href={block.href} className="link-underline text-moss">{block.label}</Link>;
      return block.prefix || block.suffix ? <p>{block.prefix}{link}{block.suffix}</p> : link;
    }
    case "table": return <div>{block.headers.length > 2 && <p className="mb-3 text-sm text-ink/70 md:hidden">表は横にスクロールして確認できます。</p>}<div className="overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" role="region" aria-label={block.caption} tabIndex={0}>
      <table className={`w-full ${block.headers.length > 2 ? "min-w-[640px] " : ""}border-collapse text-left text-sm leading-7`}>
        <caption className="sr-only">{block.caption}</caption>
        <thead><tr className="border-y border-ink/20">{block.headers.map((h) => <th scope="col" key={h} className="p-4 font-medium">{h}</th>)}</tr></thead>
        <tbody>{block.rows.map((row, i) => <tr key={i} className="border-b border-ink/10">{row.map((cell, j) => j === 0 ? <th scope="row" key={j} className="p-4 font-medium">{cell}</th> : <td key={j} className="p-4">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div></div>;
  }
}
export default function ColumnArticle({ article: a, related }: { article: Article; related: Article[] }) {
  const sections = visibleArticleSections(a, getPublishedArticles());
  const additionalCta = additionalServiceCta(a);
  const bodyLinks = new Set(sections.flatMap(s => s.blocks.flatMap(b => b.type === "link" ? [b.href.replace(/^https:\/\/www\.qring\.jp/, "")] : [])));
  const footerRelated = related.filter(r => !bodyLinks.has(articlePath(r.slug)));
  const footerLinks = a.relatedLinks?.filter(l => !bodyLinks.has(l.href) && !related.some(r => articlePath(r.slug) === l.href));
  const serviceLink = (href: string, label: string, placement: string, className = "link-underline text-moss") => <ColumnServiceLink href={href} slug={a.slug} category={a.category} placement={placement} kind={articleCtaKind(a)} className={className}>{label}</ColumnServiceLink>;
  return <>
    <ColumnStructuredData path={articlePath(a.slug)} title={a.seoTitle} description={a.metaDescription} article={a} />
    <article data-approved-manuscript={a.contentFormat === "approved-manuscript" ? a.approvalRecord?.sha256 : undefined}>
      <header className="bg-cream pb-16 pt-36 md:pb-24 md:pt-48"><div className="container-narrow">
        <nav aria-label="パンくず" className="text-xs leading-7 text-ink/65"><Link href="/" className="hover:text-moss">ホーム</Link><span aria-hidden="true"> / </span><Link href="/column/" className="hover:text-moss">コラム</Link></nav>
        <p className="eyebrow mt-8">COLUMN</p>
        <p className="mt-5 text-xs leading-7 text-ink/65">{categoryLabel(a.category)} ／ {a.primaryAudience === "municipal" ? <Link href="/column/audience/municipal/" className="underline underline-offset-4">{audienceLabel(a.primaryAudience)}</Link> : (a.audienceDescription ?? audienceLabel(a.primaryAudience))}</p>
        <h1 className="mt-7 font-serif text-[clamp(28px,4.2vw,48px)] font-light leading-[1.6]">{a.title}</h1>
        <p data-approved-introduction={a.contentFormat === "approved-manuscript" ? true : undefined} className="body-jp mt-8 text-sm md:text-base">{a.summary}</p>
        {a.introduction?.map((text, i) => <p key={i} data-approved-introduction={a.contentFormat === "approved-manuscript" ? true : undefined} className="body-jp mt-6 text-sm md:text-base">{text}</p>)}
        {a.image && <Image src={a.image.src} width={a.image.width} height={a.image.height} alt={a.image.alt} className="mt-10 h-auto w-full rounded-sm" sizes="(max-width: 768px) 100vw, 768px" priority />}
        <p className="mt-7 text-xs leading-7 text-ink/65"><Link href="/about/" className="underline underline-offset-4">株式会社QRing</Link>　{a.editionDate && <>記事日：<time dateTime={articleDisplayDate(a)}>{formatDate(articleDisplayDate(a))}</time>　</>}{a.publicationPending ? <>公開前プレビュー</> : <>公開日：<time dateTime={articlePublishedTime(a)}>{formatDate(a.publishedAt)}</time></>}{a.updatedAt && <>　更新日：<time dateTime={a.updatedAt}>{formatDate(a.updatedAt)}</time></>}</p>
      </div></header>
      <div className="container-narrow py-8 md:py-12">
        <nav aria-labelledby="article-toc" className="pb-10 pt-3"><h2 id="article-toc" className="font-serif text-xl font-light">この記事の内容</h2><ol className="mt-5 space-y-3 text-sm leading-7 text-moss">{a.sections.map((s) => <li key={s.id}><a className="underline underline-offset-4" href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav>
        {sections.map((s) => <GuideSection id={s.id} title={s.title} key={s.id}>{s.blocks.map((block, i) => <ContentBlock key={i} block={block} />)}</GuideSection>)}
      </div>
      {a.contentFormat !== "approved-manuscript" && <section className="bg-cream py-14 md:py-20" aria-labelledby="article-sources"><div className="container-narrow">
        <h2 id="article-sources" className="font-serif text-2xl font-light">参考にした公式情報</h2>
        <ul className="mt-6 space-y-4 text-sm leading-7 text-moss">{a.sources.map((s) => <li key={s.id}><a href={s.href} className="underline underline-offset-4 hover:text-ink">{s.label}</a><span className="mt-1 block text-xs text-ink/65">確認日：<time dateTime={s.checkedAt}>{formatDate(s.checkedAt)}</time></span></li>)}</ul>
        <p className="mt-6 text-xs leading-7 text-ink/65">最新の条件は各サービスの公式案内をご確認ください。</p>
      </div></section>}
      {a.contentFormat === "approved-manuscript" && a.relatedService && <section className="container-narrow border-t border-ink/15 py-10" data-approved-related-service>
        <p className="text-sm"><strong>関連サービス</strong></p>
        <p className="mt-5 text-sm leading-7">{serviceLink(a.relatedService.href, a.relatedService.label, "related-service")}</p>
        {!a.manuscriptReferences && <p className="mt-3 break-all text-sm leading-7">{serviceLink(a.relatedService.href, SITE_URL + a.relatedService.href, "related-service-url", "underline underline-offset-4 text-moss")}</p>}
      </section>}
      {a.manuscriptReferences && <section className="container-narrow border-t border-ink/15 py-10" aria-labelledby="article-sources"><h2 id="article-sources" className="font-serif text-2xl font-light">参考資料</h2><ul className="mt-6 space-y-4 text-sm leading-7 text-moss">{a.sources.map((source) => <li key={source.id}><a className="underline underline-offset-4" href={source.href}>{source.label}</a></li>)}</ul></section>}
    </article>
    {additionalCta && <aside className="container-narrow border-t border-ink/15 py-8" aria-label="関連するサービス" data-column-service-cta>
      <ColumnServiceLink href={additionalCta.href} slug={a.slug} category={a.category} placement="article-end" kind={additionalCta.kind} className="link-underline inline-flex min-h-12 items-center py-2 text-sm leading-7 text-moss">{additionalCta.label}</ColumnServiceLink>
    </aside>}
    {!a.publicationPending && ["lost-dog-preparation", "dog-microchip"].includes(a.slug) && <aside className="container-narrow border-t border-ink/15 py-8 text-sm leading-7 text-ink/70" aria-label="ペット向け商品アンケート" data-pet-survey>
      <p>つながるQRでは、ペット向け商品についてのアンケートを実施しています。皆さまのご意見をぜひお聞かせください。</p>
      <PetSurveyLink placement="column" className="link-underline mt-2 inline-block py-2 text-moss hover:text-ink">ペット向けアンケートはこちら</PetSurveyLink>
    </aside>}
    {a.primaryAudience === "municipal" && a.cta !== "municipal" && <div className="container-narrow py-8" data-municipal-article-return><Link href="/municipalities/" className="link-underline inline-block py-2 text-sm text-moss">自治体向けサービスについて →</Link></div>}
    {(footerRelated.length > 0 || Boolean(footerLinks?.length)) && <section className="py-14 md:py-20" aria-labelledby="article-related"><div className="container-narrow"><h2 id="article-related" className="font-serif text-2xl font-light">あわせて読む</h2><ul className="mt-6 space-y-4 text-sm leading-7 text-moss">{footerRelated.map((r) => <li key={r.id}><Link className="underline underline-offset-4" href={articlePath(r.slug)}>{r.title}</Link></li>)}{footerLinks?.map((link) => <li key={link.href}>{serviceLink(link.href, link.label, "related-links", "underline underline-offset-4")}</li>)}</ul></div></section>}
    {a.cta === "municipal" && <section className="border-t border-ink/15 py-16" aria-labelledby="article-next" data-municipal-article-return><div className="container-narrow"><h2 id="article-next" className="font-serif text-2xl font-light">自治体・公共機関の皆さまへ</h2><p className="body-jp mt-6 text-sm">地域の見守りや実証実験に関するご相談を受け付けています。</p><div className="mt-6 flex flex-col items-start gap-5 text-sm text-moss"><a href="https://axb.qring.jp/contact" className="link-underline">見守り・実証実験について相談する →</a><Link href="/municipalities/" className="link-underline">自治体向けサービスについて →</Link></div></div></section>}
    {a.cta === "contextual" && <section className="py-20 md:py-28" aria-labelledby="article-next"><div className="container-narrow">
      <h2 id="article-next" className="font-serif text-2xl font-light leading-relaxed md:text-3xl">発見した方から、電話番号を公開せず連絡。</h2>
      <p className="body-jp mt-6 text-sm md:text-base">つながるQRは、見つけた方とご家族・持ち主が、番号を公開せず通話できる連絡サービスです。</p>
      <div className="mt-8 flex flex-col items-start gap-5 text-sm text-moss">{a.relatedService && serviceLink(a.relatedService.href, a.relatedService.label + " →", "contextual", "link-underline leading-7")}<Link href="/price/" className="link-underline">料金・利用条件を見る →</Link></div>
      <p className="mt-8 text-xs leading-7 text-ink/65">{CONSUMER_SERVICE.notice} {CONSUMER_SERVICE.announcement}</p><Link href={CONSUMER_SERVICE.cta.href} className="link-underline mt-4 text-sm text-moss">{CONSUMER_SERVICE.cta.label}</Link>
    </div></section>}
  </>;
}
