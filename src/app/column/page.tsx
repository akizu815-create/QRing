import Link from "next/link";
import { pageMetadata, SEO_PAGES } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";

export const metadata = pageMetadata("guides");

const guides = [
  { page: SEO_PAGES.elderlyGuide, title: "高齢者の見守り方法の選び方", description: "自宅での安否確認、外出時のGPS、QRコードによる家族への連絡。それぞれの役割と、導入前に確認したいことをご紹介します。" },
  { page: SEO_PAGES.belongingsGuide, title: "物をよくなくす方の紛失対策", description: "鍵・財布の置き忘れへの備えから、位置確認タグ、拾得後の通知、QRによる連絡まで。それぞれの役割と確認点を解説します。" },
] as const;

export default function GuidesPage() {
  return (
    <>
      <PageStructuredData page="guides" />
      <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-48">
        <div className="container-narrow">
          <p className="eyebrow">GUIDES</p>
          <h1 className="mt-8 font-serif text-[clamp(30px,4.2vw,52px)] font-light leading-[1.6]">高齢者の見守りと、<br />落とし物対策の選び方。</h1>
          <p className="body-jp mt-8 text-sm md:text-base">ご家族や持ち物に、どのような備えが合うでしょうか。困っている場面ごとに、対策の役割と確認点をご紹介します。</p>
        </div>
      </section>
      <section className="py-20 md:py-28" aria-labelledby="guide-list">
        <div className="container-narrow">
          <h2 id="guide-list" className="font-serif text-2xl font-light">悩みに合わせて読む</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {guides.map(({ page, title, description }) => (
              <article key={page.path} className="flex flex-col border-t border-ink/20 pt-8">
                <h3 className="font-serif text-2xl font-light leading-relaxed"><Link href={page.path} className="hover:text-moss">{title}</Link></h3>
                <p className="body-jp mt-5 flex-1 text-sm">{description}</p>
                <Link href={page.path} className="link-underline mt-6 self-start text-sm text-moss">{title}を読む →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
