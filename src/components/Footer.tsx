import Link from "next/link";

const SITE_LINKS = [
  { en: "HOME", jp: "トップ", href: "/" },
  { en: "SERVICE", jp: "サービス", href: "/service" },
  { en: "PRICE", jp: "料金案内", href: "/price" },
  { en: "ABOUT", jp: "私たちについて", href: "/about" },
  { en: "NEWS", jp: "お知らせ", href: "/news" },
  { en: "CONTACT", jp: "お問い合わせ", href: "https://axb.qring.jp/contact", external: true },
] as const;

export default function Footer() {
  return (
    <footer className="relative mt-32 bg-cream pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="container-wide">
        <div className="grid gap-10 border-b border-ink/10 pb-12 md:gap-12 md:pb-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
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

          <nav aria-label="フッターナビゲーション" className="lg:col-span-3">
            <h2 className="eyebrow mb-4">Site</h2>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1 sm:max-w-md lg:grid-cols-1">
              {SITE_LINKS.map((item) => (
                <li key={item.en}>
                  {"external" in item ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-11 items-center gap-2 text-sm text-ink/80 transition-colors hover:text-moss focus-visible:text-moss">
                      <span className="tracking-[0.12em]">{item.en}</span>
                      <span className="text-[11px] text-ink/55 group-hover:text-moss/80">{item.jp}</span>
                    </a>
                  ) : (
                    <Link href={item.href} className="group flex min-h-11 items-center gap-2 text-sm text-ink/80 transition-colors hover:text-moss focus-visible:text-moss">
                      <span className="tracking-[0.12em]">{item.en}</span>
                      <span className="text-[11px] text-ink/55 group-hover:text-moss/80">{item.jp}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <h2 className="eyebrow mb-4">Company</h2>
            <p className="font-serif text-base text-ink">株式会社QRing</p>
            <address className="mt-3 not-italic text-sm leading-7 text-ink/75">
              〒170-0005 東京都豊島区南大塚2丁目37番5号
              <br />
              RENEX Otsuka 10階
            </address>
            <div className="mt-3 text-sm leading-7 text-ink/75">
              <p><span className="mr-3 text-xs tracking-widest text-moss">TEL</span><a href="tel:0365558000" className="hover:text-moss">03-6555-8000</a></p>
              <p><span className="mr-3 text-xs tracking-widest text-moss">MAIL</span><a href="mailto:info@qring.jp" className="hover:text-moss">info@qring.jp</a></p>
              <p className="text-xs text-ink/60">受付時間 10:00 – 18:00（土日祝休）</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-ink/10 pt-4 text-sm">
              <Link href="/about#company" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">会社概要</Link>
              <Link href="/contact#faq" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">よくあるご質問</Link>
              <Link href="/law" className="inline-flex min-h-11 items-center text-ink/75 hover:text-moss">特定商取引法に基づく表記</Link>
            </div>
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
