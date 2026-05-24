"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "ABOUT", href: "/about", jp: "私たちについて" },
  { label: "SERVICE", href: "/service", jp: "サービス" },
  { label: "SHOP", href: "/shop", jp: "ショップ" },
  { label: "NEWS", href: "/news", jp: "お知らせ" },
  { label: "CONTACT", href: "/contact", jp: "お問い合わせ" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-ivory/95 backdrop-blur-md border-b border-ink/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-20 md:h-24">
        <Link
          href="/"
          className="flex items-baseline gap-2 group"
          onClick={() => setOpen(false)}
        >
          <span className="font-serif text-2xl md:text-3xl tracking-wider text-ink group-hover:text-moss transition-colors duration-500">
            QRing
          </span>
          <span className="hidden sm:inline text-[10px] tracking-[0.3em] text-ink/50 uppercase">
            tsunagaru qr
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((item) => (
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
          ))}
          <Link
            href="/contact"
            className="ml-4 inline-flex items-center gap-2 px-5 py-3 bg-ink text-ivory text-[11px] tracking-[0.25em] hover:bg-moss transition-colors duration-500"
          >
            資料請求
          </Link>
        </nav>

        <button
          type="button"
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-ink"
        >
          <span
            className={`block h-px w-7 bg-current transition-all duration-300 ${
              open ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-7 bg-current transition-all duration-300 ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 bottom-0 bg-ivory transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-wide py-12 flex flex-col gap-8">
          {NAV.map((item, i) => (
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
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 btn-primary"
          >
            資料請求 / お問い合わせ
          </Link>
        </div>
      </div>
    </header>
  );
}
