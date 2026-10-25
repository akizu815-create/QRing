"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const SITE_LINKS = [
  { en: "ABOUT", href: "/about/", children: [
    { label: "私たちについて", href: "/about/" },
    { label: "私たちのビジョン", href: "/about/#vision" },
    { label: "代表メッセージ", href: "/about/#message" },
    { label: "会社概要", href: "/about/#company" },
  ] },
  { en: "SERVICE", href: "/service/", children: [
    { label: "サービスについて", href: "/service/" },
    { label: "ご利用方法", href: "/service/#how" },
    { label: "プライバシー電話について", href: "/service/#privacy-call" },
    { label: "活用シーン", href: "/service/#use-cases" },
  ] },
  { en: "PRICE", href: "/price/", children: [
    { label: "料金のご案内", href: "/price/#pricing-title" },
    { label: "セッションについて", href: "/price/#session-title" },
    { label: "通常の電話料金", href: "/price/#call-charges-title" },
    { label: "お支払いについて", href: "/price/#payment-title" },
  ] },
  { en: "INFORMATION", children: [
    { label: "お知らせ", href: "/news/" },
    { label: "よくあるご質問", href: "/faq/" },
  ] },
  { en: "FOR BUSINESS", children: [
    { label: "自治体の方へ", href: "/municipalities/" },
    { label: "お問い合わせ", href: "https://axb.qring.jp/contact" },
  ] },
] as const;

function FooterLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("https://")) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  if (href.includes("#")) {
    return <a href={href} className={className}>{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
}

export default function Footer() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <footer className="relative mt-32 bg-cream pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="container-wide">
        <div className="grid gap-10 border-b border-ink/10 pb-12 md:gap-12 md:pb-16 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
          <div className="lg:col-span-5 lg:row-start-1">
            <Link href="/" aria-label="QRing トップページ" className="inline-block">
              <img src="/images/logo-black.svg" alt="QRing" className="h-7 w-auto md:h-8" />
            </Link>
            <p className="body-jp mt-5 max-w-sm text-sm">
              電話番号を教えずに、つながる。
              <br />
              特許取得済の通話技術『つながるQR』で、
              <br />
              安心と利便性を両立した新しいコミュニケーションを。
            </p>
          </div>

          <nav aria-label="フッターナビゲーション" className="lg:col-span-12 lg:row-start-2">
            <h2 className="eyebrow mb-5">Site</h2>
            <ul className="divide-y divide-ink/10 border-y border-ink/10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,1.3fr)_minmax(0,0.75fr)_minmax(0,0.9fr)] lg:gap-6 lg:divide-y-0 lg:border-0">
              {SITE_LINKS.map((item) => (
                <li key={item.en}>
                  <>
                      <div className="hidden lg:block">
                        {"href" in item ? (
                          <FooterLink href={item.href} className="font-serif text-lg text-ink transition-colors hover:text-moss focus-visible:text-moss">{item.en}</FooterLink>
                        ) : (
                          <p className="font-serif text-sm tracking-[0.04em] text-ink">{item.en}</p>
                        )}
                        <ul className="mt-4 space-y-2">
                          {item.children.map((child) => (
                            <li key={child.href}><FooterLink href={child.href} className="block text-[13px] leading-relaxed text-ink/70 transition-colors hover:text-moss focus-visible:text-moss">{child.label}</FooterLink></li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        aria-expanded={openGroup === item.en}
                        aria-controls={`footer-${item.en.toLowerCase().replace(/\s+/g, "-")}-links`}
                        onClick={() => setOpenGroup(openGroup === item.en ? null : item.en)}
                        className="flex min-h-14 w-full items-center justify-between text-left font-serif text-xl text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss lg:hidden"
                      >
                        {item.en}
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={`h-5 w-5 text-moss transition-transform duration-200 ${openGroup === item.en ? "rotate-180" : ""}`}><path d="m4 7 6 6 6-6" /></svg>
                      </button>
                      <ul id={`footer-${item.en.toLowerCase().replace(/\s+/g, "-")}-links`} hidden={openGroup !== item.en} className="pb-4 pl-4 lg:hidden">
                        {item.children.map((child) => (
                          <li key={child.href}><FooterLink href={child.href} className="flex min-h-11 items-center text-sm text-ink/75 transition-colors hover:text-moss focus-visible:text-moss">{child.label}</FooterLink></li>
                        ))}
                      </ul>
                  </>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <h2 className="eyebrow mb-4">Company</h2>
            <p className="font-serif text-base text-ink">株式会社QRing</p>
            <address className="mt-3 not-italic text-sm leading-7 text-ink/75">
              〒170-0005 東京都豊島区南大塚2丁目37番5号
              <br />
              RENEX Otsuka 10階
            </address>
            <div className="mt-3 text-sm leading-7 text-ink/75">
              <p><span className="mr-3 text-xs tracking-widest text-ink/60">TEL</span><a href="tel:0365558000" className="hover:text-moss">03-6555-8000</a></p>
              <p><span className="mr-3 text-xs tracking-widest text-ink/60">MAIL</span><a href="mailto:info@qring.jp" className="hover:text-moss">info@qring.jp</a></p>
              <p className="text-xs text-ink/60">受付時間 10:00 – 18:00（土日祝休）</p>
            </div>
            <nav aria-label="法務情報" className="mt-5 border-t border-ink/10 pt-4">
              <h3 className="eyebrow mb-2">Legal</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <Link href="/terms/" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">利用規約</Link>
                <Link href="/privacy/" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">プライバシーポリシー</Link>
                <Link href="/law/" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">特定商取引法に基づく表記</Link>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-end md:justify-between md:pt-8">
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.14em] text-ink/60">
              © {new Date().getFullYear()} QRing Inc. All Rights Reserved.
            </p>
            <p className="text-[11px] leading-relaxed text-ink/60">
              ※QRコードは株式会社デンソーウェーブの登録商標です。
            </p>
          </div>
          <p className="text-[11px] tracking-[0.14em] text-ink/60">特許第7460140号</p>
        </div>
      </div>
    </footer>
  );
}
