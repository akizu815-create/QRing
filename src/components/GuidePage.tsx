import type { ReactNode } from "react";
import Link from "next/link";
import PageStructuredData from "@/components/PageStructuredData";
import { CONSUMER_SERVICE } from "@/config/consumerService";

export function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 border-t border-ink/15 py-10 md:py-14">
      <h2 id={`${id}-heading`} className="font-serif text-2xl font-light leading-relaxed md:text-3xl">{title}</h2>
      <div className="body-jp mt-6 space-y-5 text-sm md:text-base">{children}</div>
    </section>
  );
}

export default function GuidePage({
  page, title, introduction, children, relatedHref, relatedLabel, sources,
}: {
  page: "elderlyGuide" | "belongingsGuide";
  title: string;
  introduction: string;
  children: ReactNode;
  relatedHref: string;
  relatedLabel: string;
  sources: readonly { label: string; href: string }[];
}) {
  return (
    <>
      <PageStructuredData page={page} />
      <article>
        <header className="bg-cream pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="container-narrow">
            <nav aria-label="パンくず" className="text-xs leading-7 text-ink/60">
              <Link href="/" className="hover:text-moss">ホーム</Link><span aria-hidden="true"> / </span><Link href="/column/" className="hover:text-moss">見守り・紛失対策の選び方</Link>
            </nav>
            <p className="eyebrow mt-8">GUIDE</p>
            <h1 className="mt-7 font-serif text-[clamp(28px,4.2vw,48px)] font-light leading-[1.6]">{title}</h1>
            <p className="body-jp mt-8 text-sm md:text-base">{introduction}</p>
            <p className="mt-7 text-xs leading-7 text-ink/60">株式会社QRing　掲載日：<time dateTime="2026-10-27">2026年10月27日</time></p>
          </div>
        </header>
        <div className="container-narrow py-8 md:py-12">{children}</div>
        <section className="bg-cream py-14 md:py-20" aria-labelledby="guide-sources">
          <div className="container-narrow">
            <h2 id="guide-sources" className="font-serif text-2xl font-light">参考にした公式情報</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-moss">
              {sources.map(({ href, label }) => <li key={href}><a href={href} className="underline underline-offset-4 hover:text-ink">{label}</a></li>)}
            </ul>
            <p className="mt-6 text-xs leading-7 text-ink/60">機能・提供状況の確認日：2026年10月27日。最新の条件は各サービスの公式案内をご確認ください。</p>
          </div>
        </section>
      </article>
      <section className="py-20 md:py-28" aria-labelledby="guide-next">
        <div className="container-narrow">
          <h2 id="guide-next" className="font-serif text-2xl font-light leading-relaxed md:text-3xl">発見した方から、電話番号を公開せず連絡。</h2>
          <p className="body-jp mt-6 text-sm md:text-base">つながるQRは、見つけた方とご家族・持ち主が、番号を公開せず通話できる連絡サービスです。</p>
          <div className="mt-8 flex flex-col items-start gap-5 text-sm text-moss">
            <Link href={relatedHref} className="link-underline leading-7">{relatedLabel} →</Link>
            <Link href="/price/" className="link-underline">料金・利用条件を見る →</Link>
          </div>
          <p className="mt-8 text-xs leading-7 text-ink/65">{CONSUMER_SERVICE.notice} {CONSUMER_SERVICE.announcement}</p>
          <Link href={CONSUMER_SERVICE.cta.href} className="link-underline mt-4 text-sm text-moss">{CONSUMER_SERVICE.cta.label}</Link>
        </div>
      </section>
    </>
  );
}
