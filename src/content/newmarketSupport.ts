// 公社承認済み原稿。句読点・記号・空白を含め、掲載承認なしに変更しない。
export const NEWMARKET_SUPPORT = {
  enabled: true,
  publishedOn: "2026-11-04",
  // 支援期間は未確定（最大2年間）。開始日・終了日を推測で設定しない。
  endsOn: null as string | null,
  path: "/news/newmarket-support/",
  title: "東京都中小企業振興公社「中小企業ニューマーケット開拓支援事業」に採択されました",
  paragraphs: [
    "株式会社QRingの「つながるQR」は、公益財団法人東京都中小企業振興公社が実施する「中小企業ニューマーケット開拓支援事業」の支援対象製品として採択されました。",
    "つながるQRは（公財）東京都中小企業振興公社 中小企業ニューマーケット開拓支援事業の支援対象製品です。",
    "※但し、公社は製品の効能効果を保証するものではありません",
  ],
  placements: [
    { id: "news-index", path: "/news/", status: "approved" },
    { id: "news-detail", path: "/news/newmarket-support/", status: "approved" },
    { id: "home-news", path: "/", status: "approved-news-list" },
    { id: "home-support", path: "/", status: "additional-approval-required" },
    { id: "service-support", path: "/service/", status: "additional-approval-required" },
    { id: "municipalities-support", path: "/municipalities/", status: "additional-approval-required" },
    { id: "collaboration-support", path: "/collaboration/", status: "additional-approval-required" },
  ],
} as const;

export function isNewmarketSupportActive(now = new Date()): boolean {
  const todayJst = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
  return NEWMARKET_SUPPORT.enabled && (!NEWMARKET_SUPPORT.endsOn || todayJst <= NEWMARKET_SUPPORT.endsOn);
}
