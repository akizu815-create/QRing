import type { Metadata } from "next";

export const SITE_URL = "https://www.qring.jp";

// 公開する正規URL・メタ情報を共有し、canonical / sitemap / JSON-LD を一致させる。
export const SEO_PAGES = {
  "home": {
    "path": "/",
    "title": "つながるQR｜高齢者・ペットの見守りと落とし物対策｜番号非公開で通話",
    "description": "高齢者の外出時の見守り、犬・猫の迷子、鍵・財布などの紛失への備えに。つながるQRは、見つけた方がQRコードを読み取り、電話番号をお互いに公開せず、ご家族・飼い主・持ち主と通話できるサービスです。専用アプリ不要。一般向けは正式リリース準備中です。"
  },
  "belongings": {
    "path": "/use-cases/belongings/",
    "title": "落とし物・忘れ物対策にQRタグ｜番号を公開せず通話｜つながるQR",
    "description": "鍵・財布・バッグの紛失や置き忘れへの備えに。つながるQRは、持ち物のQRコードを拾った方が読み取り、持ち主と電話番号をお互いに公開せず通話できるサービスです。位置を探すタグとの違い、使い方、料金をご案内します。"
  },
  "pets": {
    "path": "/use-cases/pets/",
    "title": "犬・猫の迷子対策｜電話番号を公開しないQRコード迷子札｜つながるQR",
    "description": "犬や猫の迷子に備えるための連絡方法をご紹介。迷子札に電話番号を書くことへの不安や、マイクロチップとの役割の違いを解説。QRコードで飼い主と直接通話できる、つながるQRの活用例です。"
  },
  "elderly": {
    "path": "/use-cases/elderly/",
    "title": "高齢者の外出見守り・認知症の迷子対策に｜つながるQR",
    "description": "認知症のあるご家族など、外出先での迷子・行方不明に備える連絡手段。つながるQRは、身につけたQRコードを発見者がスキャンし、お互いの電話番号を公開せずご家族と通話できるサービスです。仕組みやGPS見守りとの違いをご紹介します。"
  },
  "about": {
    "path": "/about/",
    "title": "会社概要・企業理念｜株式会社QRing",
    "description": "人の善意を、行動につなぐ。株式会社QRingの企業理念、つながるQRを通じた取り組み、代表取締役 木津愛子の挨拶、会社概要をご紹介します。"
  },
  "service": {
    "path": "/service/",
    "title": "QRコードで電話番号を公開せず通話する仕組み｜つながるQR",
    "description": "QRコードを見つけた方と登録先を、プライバシー電話番号でつなぐ「つながるQR」。お互いの番号を公開せず通話する仕組み、登録者・発見者の使い方、料金をご案内します。日本国内向け。一般向けは正式リリース準備中です。"
  },
  "guides": {
    "path": "/column/",
    "title": "高齢者の見守り・落とし物対策の選び方｜つながるQR",
    "description": "高齢者の見守りや、鍵・財布の紛失対策を検討する方へ。室内の安否確認、GPSやタグによる位置確認、QRコードを使った発見後の連絡について、役割と選ぶ際の確認点を解説します。"
  },
  "elderlyGuide": {
    "path": "/column/elderly-monitoring/",
    "title": "高齢者の見守り方法の選び方｜自宅・外出時の備えを比較｜つながるQR",
    "description": "離れて暮らす親や、一人暮らしの高齢者の見守りを考える方へ。室内のカメラ・センサー、外出時のGPS、QRコードで家族へ連絡する方法の違いと、費用・通信環境・使いやすさの確認点をご紹介します。"
  },
  "belongingsGuide": {
    "path": "/column/lost-item-preparation/",
    "title": "物をよくなくす方の紛失対策｜位置確認と発見後の連絡｜つながるQR",
    "description": "鍵や財布をよくなくす方へ。置き忘れへの備え、タグによる位置確認、拾得後の通知、QRコードで持ち主へ連絡する方法を役割別に解説。電話番号をタグに書きたくない場合の選び方もご紹介します。"
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
  "collaboration": {
    "path": "/collaboration/",
    "title": "企業向けコラボ・カスタム商品開発｜つながるQR｜QRing",
    "description": "つながるQRをバッグ、キーホルダー、ペット用品などの商品に組み合わせる企業向け協業のご案内。コラボプランとカスタムプランをご紹介します。"
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
