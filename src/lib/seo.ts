import type { Metadata } from "next";

export const SITE_URL = "https://www.qring.jp";

// 公開する正規URL・メタ情報を共有し、canonical / sitemap / JSON-LD を一致させる。
export const SEO_PAGES = {
  "home": {
    "path": "/",
    "title": "QRing｜つながるQR｜電話番号を教えずに、つながる。",
    "description": "電話番号を相手に公開せず、QRコードから通話できる「つながるQR」。株式会社QRingが提供する日本国内向けのサービスです。ご家族の見守り、ペットの迷子、持ち物の紛失時の連絡に。一般向けサービスは正式リリースに向けて準備中です。"
  },
  "elderly": {
    "path": "/use-cases/elderly/",
    "title": "認知症高齢者の見守りと外出時の連絡対策｜つながるQR",
    "description": "認知症のあるご家族や高齢の親の外出に備える連絡対策を紹介。GPS・地域の見守り・QRコードの役割の違いと、電話番号を公開せず家族へ通話できるつながるQRの仕組みを案内します。一般向けサービスは正式リリース準備中です。"
  },
  "about": {
    "path": "/about/",
    "title": "会社概要・企業理念｜株式会社QRing",
    "description": "つながるQRを社会インフラへ。株式会社QRingのビジョン、代表メッセージ、会社概要をご紹介します。"
  },
  "service": {
    "path": "/service/",
    "title": "つながるQRの仕組みと使い方｜株式会社QRing",
    "description": "電話番号を相手に公開せず、QRコードを通じて声でつながる「つながるQR」。仕組み、使い方、活用場面、日本国内での利用条件をご案内します。一般向けサービスは正式リリースに向けて準備中です。"
  },
  "price": {
    "path": "/price/",
    "title": "つながるQRの料金案内｜株式会社QRing",
    "description": "つながるQRの料金案内。通話が成立した1セッションにつき880円（税込）。通常の電話料金は発信した方に別途かかります。通話時間が5秒未満の場合、サービス利用料は発生しません。"
  },
  "news": {
    "path": "/news/",
    "title": "お知らせ・メディア掲載情報｜株式会社QRing",
    "description": "QRingからの最新のお知らせ、リリース情報、イベント情報。"
  },
  "faq": {
    "path": "/faq/",
    "title": "つながるQRのよくあるご質問｜株式会社QRing",
    "description": "つながるQRのサービス内容や使い方、料金、お支払いなどについて、よくあるご質問をまとめました。"
  },
  "municipalities": {
    "path": "/municipalities/",
    "title": "自治体向け認知症高齢者の見守り・QRコード連絡サービス｜つながるQR",
    "description": "認知症高齢者の見守りや発見後の家族への連絡を支援する「つながるQR」。電話番号を公開せず直接通話でき、管理者画面で利用状況も確認可能。自治体での導入や費用負担方法をご相談いただけます。"
  },
  "contact": {
    "path": "/contact/",
    "title": "お問い合わせ｜株式会社QRing",
    "description": "株式会社QRingへのお問い合わせ、つながるQRのサービスや法人・自治体でのご利用に関するご相談窓口です。"
  },
  "terms": {
    "path": "/terms/",
    "title": "つながるQR 利用規約｜株式会社QRing",
    "description": "株式会社QRingが提供する「つながるQR」の利用規約です。"
  },
  "privacy": {
    "path": "/privacy/",
    "title": "つながるQR プライバシーポリシー｜株式会社QRing",
    "description": "株式会社QRingが提供する「つながるQR」のプライバシーポリシーです。"
  },
  "law": {
    "path": "/law/",
    "title": "特定商取引法に基づく表記｜株式会社QRing",
    "description": "株式会社QRingの特定商取引法に基づく表記です。"
  }
} as const;

export type SeoPage = keyof typeof SEO_PAGES;

export function pageMetadata(key: SeoPage): Metadata {
  const page = SEO_PAGES[key];
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      siteName: "株式会社QRing｜つながるQR",
      locale: "ja_JP",
      type: "website",
    },
  };
}
