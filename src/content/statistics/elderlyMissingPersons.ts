// 警察庁原資料の凡例・原因動機別表（p.3）と照合済み。
// 年次更新時は values / 公表日 / 出典URL をまとめて照合・更新する。
// 数値は届出が出された者の延べ人数で、実人数ではない。
export const ELDERLY_MISSING_PERSONS = {
  title: "令和7年における行方不明者届受理等の状況",
  publishedAt: "2026-06-25",
  publishedLabel: "2026年6月25日",
  sourceUrl: "https://www.npa.go.jp/news/release/2026/20260625001.html",
  documentUrl: "https://www.npa.go.jp/news/release/2026/R07yukuefumeisha.pdf",
  values: [
    { year: 2021, count: 17636 },
    { year: 2022, count: 18709 },
    { year: 2023, count: 19039 },
    { year: 2024, count: 18121 },
    { year: 2025, count: 17345 },
  ],
} as const;
