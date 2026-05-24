import Link from "next/link";

const COL_ABOUT = [
  { label: "Vision / Mission", href: "/about#vision" },
  { label: "代表挨拶", href: "/about#message" },
  { label: "会社概要", href: "/about#company" },
  { label: "特定商取引法表記", href: "/about#legal" },
];

const COL_SERVICE = [
  { label: "サービス紹介", href: "/service" },
  { label: "ご利用方法", href: "/service#how" },
  { label: "ご高齢の方の見守り", href: "/service#senior" },
];

const COL_BUSINESS = [
  { label: "導入のご案内", href: "/contact?type=business" },
  { label: "資料請求", href: "/contact?type=document" },
  { label: "ショップ", href: "/shop" },
];

const COL_CONTACT = [
  { label: "お問い合わせ", href: "/contact" },
  { label: "FAQ", href: "/contact#faq" },
  { label: "ニュース", href: "/news" },
];

function Col({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] tracking-[0.3em] text-moss uppercase mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="text-sm text-ink/70 hover:text-ink link-underline"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-32 bg-cream pt-20 pb-10">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-ink/10">
          <div className="md:col-span-4">
            <Link href="/" className="font-serif text-4xl tracking-wider">
              QRing
            </Link>
            <p className="mt-6 text-sm body-jp">
              電話番号を教えずに、つながる。
              <br />
              特許取得済の通話技術『つながるQR』で、
              <br />
              安心と利便性を両立した新しいコミュニケーションを。
            </p>
            <div className="mt-8 space-y-2 text-sm text-ink/70">
              <p>
                <span className="text-xs tracking-widest text-moss mr-3">TEL</span>
                03-6555-8000
              </p>
              <p className="text-xs text-ink/50">受付時間 10:00 – 18:00（土日祝休）</p>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Col title="About" items={COL_ABOUT} />
            <Col title="Service" items={COL_SERVICE} />
            <Col title="For Business" items={COL_BUSINESS} />
            <Col title="Contact" items={COL_CONTACT} />
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.25em] text-ink/50 uppercase">
            © {new Date().getFullYear()} QRing Inc. All Rights Reserved.
          </p>
          <p className="text-[11px] tracking-[0.25em] text-ink/40">
            特許第7460140号
          </p>
        </div>
      </div>
    </footer>
  );
}
