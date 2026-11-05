"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CONTACT = "https://axb.qring.jp/contact";
const MY_PAGE = "https://axb.qring.jp/";
const NAV = [
  { label: "SERVICE", jp: "サービス", href: "/service/" },
  { label: "PRICE", jp: "料金", href: "/price/" },
  { label: "COLUMN", jp: "コラム", href: "/column/" },
  { label: "ABOUT", jp: "会社情報", href: "/about/" },
  { label: "FOR BUSINESS", jp: "自治体・法人向け", href: "/#for-business" },
];
const AUXILIARY = [
  { label: "よくあるご質問", href: "/faq/" },
  { label: "お知らせ", href: "/news/" },
];
const focusStyle = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const controls = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href],button") ?? []);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (!window.matchMedia("(min-width: 1280px)").matches) toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 bg-ivory transition-shadow ${scrolled || open ? "border-b border-ink/10" : ""}`}>
      <div className="container-wide flex h-20 items-center justify-between gap-3 md:h-24 md:gap-5">
        <Link href="/" onClick={() => setOpen(false)} className={`shrink-0 ${focusStyle}`}>
          <img src="/images/logo-black.svg" alt="QRing トップページ" className="h-5 w-auto min-[375px]:h-6 md:h-7" />
        </Link>
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`flex min-h-12 flex-col items-center justify-center gap-1 whitespace-nowrap transition-colors hover:text-moss ${focusStyle}`}>
              <span className="text-[10px] tracking-[0.16em] text-ink/60">{item.label}</span>
              <span className="text-[13px] text-ink">{item.jp}</span>
            </Link>
          ))}
          <a href={CONTACT} className={`inline-flex min-h-12 items-center border border-moss/50 px-4 text-sm text-deepmoss hover:bg-moss/5 ${focusStyle}`} aria-label="CONTACT お問い合わせ">お問い合わせ</a>
          <a href={MY_PAGE} className={`inline-flex min-h-12 items-center bg-ink px-4 text-sm text-ivory ${focusStyle}`}>マイページ</a>
        </nav>
        <div className="flex items-center gap-2 md:gap-3 xl:hidden">
          <a href={MY_PAGE} className={`inline-flex min-h-12 items-center whitespace-nowrap text-xs text-ink md:text-sm ${focusStyle}`}>マイページ</a>
          <button ref={toggleRef} type="button" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className={`flex h-12 w-12 flex-col items-center justify-center gap-1.5 ${focusStyle}`}>
            <span className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      <div ref={panelRef} id="mobile-navigation" role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label="サイトメニュー" aria-hidden={!open} inert={!open} hidden={!open} className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto overscroll-contain bg-ivory md:top-24 xl:hidden">
        <div className="container-wide max-w-2xl pb-10 pt-3">
          <div className="flex items-center justify-between border-b border-ink/15">
            <span className="text-xs tracking-widest text-ink/60">MENU</span>
            <button type="button" onClick={() => setOpen(false)} className={`min-h-12 px-3 text-sm ${focusStyle}`}>閉じる ×</button>
          </div>
          <nav aria-label="モバイルナビゲーション">
            {NAV.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex min-h-16 items-center justify-between gap-4 border-b border-ink/10 py-3 ${focusStyle}`}><span className="text-base">{item.jp}</span><span className="text-[10px] tracking-widest text-ink/55">{item.label}</span></Link>)}
            <a href={CONTACT} onClick={() => setOpen(false)} className={`mt-6 flex min-h-12 items-center justify-center border border-moss/50 text-sm text-deepmoss ${focusStyle}`}>お問い合わせ →</a>
          </nav>
          <nav aria-label="補助ナビゲーション" className="mt-5 flex gap-6 border-t border-ink/10 pt-3">
            {AUXILIARY.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`inline-flex min-h-12 items-center text-sm text-ink/75 ${focusStyle}`}>{item.label}</Link>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
