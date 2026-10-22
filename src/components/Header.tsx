"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 外部リンク配置
const EXTERNAL_URLS = {
  CONTACT: "https://axb.qring.jp/contact",
  MY_PAGE: "https://axb.qring.jp/",
} as const;

const NAV = [
  { label: "ABOUT", href: "/about", jp: "私たちについて" },
  { label: "SERVICE", href: "/service", jp: "サービス" },
  { label: "PRICE", href: "/price", jp: "料金案内" },
  { label: "NEWS", href: "/news", jp: "お知らせ" },
  { label: "FAQ", href: "/faq/", jp: "よくあるご質問" },
  { label: "CONTACT", href: EXTERNAL_URLS.CONTACT, jp: "お問い合わせ", external: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false); 
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${open
          ? "bg-ivory border-b border-ink/10"
          : scrolled
            ? "bg-ivory border-b border-ink/10 shadow-[0_1px_0_rgba(31,26,20,0.04)]"
            : "bg-ivory"
        }`}
    >
      <div className="container-wide flex items-center justify-between h-20 md:h-24">
        <Link
          href="/"
          className="flex items-center group"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo-black.svg"
            alt="QRing"
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-8">
          {NAV.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-[11px] tracking-[0.3em] text-ink group-hover:text-moss transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[9px] tracking-widest text-ink/40 group-hover:text-moss/70 transition-colors duration-300">
                  {item.jp}
                </span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-[11px] tracking-[0.3em] text-ink group-hover:text-moss transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[9px] tracking-widest text-ink/40 group-hover:text-moss/70 transition-colors duration-300">
                  {item.jp}
                </span>
              </Link>
            )
          ))}
          <Link
            href="/municipalities/"
            className="inline-flex shrink-0 items-center justify-center border border-moss/50 px-3 py-3 text-[11px] font-medium tracking-[0.08em] text-deepmoss transition-colors duration-300 hover:border-moss hover:bg-moss/10 xl:px-4"
          >
            自治体の方へ
          </Link>
          <a
            href={EXTERNAL_URLS.MY_PAGE}
            className="ml-0 inline-flex items-center gap-2 bg-ink px-5 py-3 text-[11px] tracking-[0.25em] text-ivory xl:ml-2"
          >
            マイページ
          </a>
        </nav>

        <button
          type="button"
          aria-label="menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-ink"
        >
          <span
            className={`block h-px w-7 bg-current transition-all duration-300 ${open ? "translate-y-[5px] rotate-45" : ""
              }`}
          />
          <span
            className={`block h-px w-7 bg-current transition-all duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={`lg:hidden fixed inset-x-0 top-20 bottom-0 overflow-y-auto overscroll-contain bg-ivory md:top-24 transition-all duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <nav aria-label="モバイルナビゲーション" className="container-wide py-12 flex flex-col gap-8">
          {NAV.map((item, i) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-ink/10 pb-4"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="font-serif text-2xl tracking-wider text-ink group-hover:text-moss transition-colors">
                  {item.label}
                </span>
                <span className="text-xs tracking-widest text-ink/50">
                  {item.jp}
                </span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-ink/10 pb-4"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="font-serif text-2xl tracking-wider text-ink group-hover:text-moss transition-colors">
                  {item.label}
                </span>
                <span className="text-xs tracking-widest text-ink/50">
                  {item.jp}
                </span>
              </Link>
            )
          ))}
          <Link
            href="/municipalities/"
            onClick={() => setOpen(false)}
            className="inline-flex shrink-0 items-center justify-center border border-moss/50 px-3 py-3 text-sm font-medium tracking-[0.08em] text-deepmoss transition-colors duration-300 hover:border-moss hover:bg-moss/10"
          >
            自治体の方へ
          </Link>
          <a
            href={EXTERNAL_URLS.MY_PAGE}
            onClick={() => setOpen(false)}
            className="btn-primary mt-6"
          >
            マイページ
          </a>
        </nav>
      </div>
    </header>
  );
}
