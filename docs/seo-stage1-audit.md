# QRing SEO・AIO 第1段階 監査結果

調査日: 2026-10-23 UTC / 基準main: `e4641f57db3e69c087d560d68f529bd1e72856b6`

対象はHOME / ABOUT / SERVICE / PRICE / NEWS / FAQ / 自治体向け / CONTACT / 利用規約 / プライバシーポリシー / 特商法表記の11ページ。静的エクスポートHTMLを修正前・修正後に比較した。本番・Search Consoleの変更操作は行っていない。

## 修正済み

| 項目 | 修正前 | 修正後 |
|---|---|---|
| HOMEのH1 | PC/SPの2個 | 画面外に同内容の意味上のH1を1個配置。既存の見える2つは同じクラスのpにし、支援技術から重複を除外。見た目の文章・位置は維持 |
| 見出し階層 | SERVICEのご利用方法がH2→H4 | 登録手順をH3に変更。全11ページでH1は1個、主コンテンツに階層飛びなし |
| メタ情報 | About / Service / News / Contactなど汎用的なtitle | 既存内容に沿う日本語titleへ。詳細は下表 |
| canonical | HOME / ABOUT / SERVICE / NEWS / CONTACT / 特商法の6ページが未設定 | 全11ページがhttps://www.qring.jpの自己参照canonical。末尾スラッシュも統一 |
| OGP | 自治体以外は共通の汎用情報が中心 | ページごとのtitle / description / url / siteNameに整合 |
| 構造化データ | 自治体ページだけWebPageと入れ子Organization | HOMEにOrganizationとWebSiteを各1実体、各ページにWebPageを1つずつ。同じ@idで参照。元の自治体スクリプトは置換し重複なし |
| robots.txt | 未提供 | 静的生成。全体をクロール許可し、正規sitemap.xmlを宣言。robots.txtで/shop/を拒否せず、既存noindexを読める状態を維持 |
| sitemap | 公開11URL、毎回ビルド時刻をlastModifiedに設定 | 同じ公開11URLのみ。正確な本文更新日を管理していないため任意項目lastModifiedを省略。メタ情報と同じ設定から生成 |
| 検証手段 | サイト横断の静的検査なし | `scripts/seo-audit.py` を追加。メタ・見出し・canonical・schema・alt・内部リンク・sitemap・robots・旧shop・404を検査 |

構造化データは既存の正式会社名・URL・ページ内容だけを使用した。レビュー、評価、導入実績、架空の商品やオファー、FAQPage、検索アクション、llms.txtは追加していない。表示やランキングの向上・リッチリザルトを保証するものではない。

## titleの変更前後（ブラウザーに出力される最終値）

| ページ | 変更前 | 変更後 |
|---|---|---|
| / | QRing｜つながるQR｜電話番号を教えずに、つながる。 | QRing｜つながるQR｜電話番号を教えずに、つながる。 |
| /about/ | About｜QRing | 会社概要・企業理念｜株式会社QRing |
| /service/ | Service｜QRing | つながるQRの仕組みと使い方｜株式会社QRing |
| /price/ | Price｜料金案内｜QRing | つながるQRの料金案内｜株式会社QRing |
| /news/ | News｜QRing | お知らせ・メディア掲載情報｜株式会社QRing |
| /faq/ | よくあるご質問｜FAQ｜QRing | つながるQRのよくあるご質問｜株式会社QRing |
| /municipalities/ | 自治体向け認知症高齢者の見守り・QRコード連絡サービス｜つながるQR | 自治体向け認知症高齢者の見守り・QRコード連絡サービス｜つながるQR |
| /contact/ | Contact｜QRing | お問い合わせ｜株式会社QRing |
| /terms/ | つながるQR 利用規約｜QRing | つながるQR 利用規約｜株式会社QRing |
| /privacy/ | つながるQR プライバシーポリシー｜QRing | つながるQR プライバシーポリシー｜株式会社QRing |
| /law/ | 特定商取引法に基づく表記｜QRing | 特定商取引法に基づく表記｜株式会社QRing |

## meta descriptionの変更前後

| ページ | 変更前 | 変更後 |
|---|---|---|
| / | 株式会社QRingは、お互いの電話番号を相手に表示せずに音声通話ができる『つながるQR』を提供します。専用アプリ不要。QRコードをスキャンするだけで、安心の連絡手段を用意できます。 | 電話番号を相手に公開せず、QRコードから通話できる「つながるQR」。株式会社QRingが提供する日本国内向けのサービスです。ご家族の見守り、ペットの迷子、持ち物の紛失時の連絡に。一般向けサービスは正式リリースに向けて準備中です。 |
| /about/ | つながるQRを社会インフラへ。株式会社QRingのビジョン、代表メッセージ、会社概要をご紹介します。 | つながるQRを社会インフラへ。株式会社QRingのビジョン、代表メッセージ、会社概要をご紹介します。 |
| /service/ | つながるQRの仕組みと、ご利用方法、活用シーンをご紹介します。 | 電話番号を相手に公開せず、QRコードを通じて声でつながる「つながるQR」。仕組み、使い方、活用場面、日本国内での利用条件をご案内します。一般向けサービスは正式リリースに向けて準備中です。 |
| /price/ | つながるQRの料金案内。通話が成立した1セッションにつき880円（税込）。通常の電話料金は発信した方に別途かかります。通話時間が5秒未満の場合、サービス利用料は発生しません。 | つながるQRの料金案内。通話が成立した1セッションにつき880円（税込）。通常の電話料金は発信した方に別途かかります。通話時間が5秒未満の場合、サービス利用料は発生しません。 |
| /news/ | QRingからの最新のお知らせ、リリース情報、イベント情報。 | QRingからの最新のお知らせ、リリース情報、イベント情報。 |
| /faq/ | つながるQRのサービス内容や使い方、料金、お支払いなどについて、よくあるご質問をまとめました。 | つながるQRのサービス内容や使い方、料金、お支払いなどについて、よくあるご質問をまとめました。 |
| /municipalities/ | 認知症高齢者の見守りや発見後の家族への連絡を支援する「つながるQR」。電話番号を公開せず直接通話でき、管理者画面で利用状況も確認可能。自治体での導入や費用負担方法をご相談いただけます。 | 認知症高齢者の見守りや発見後の家族への連絡を支援する「つながるQR」。電話番号を公開せず直接通話でき、管理者画面で利用状況も確認可能。自治体での導入や費用負担方法をご相談いただけます。 |
| /contact/ | 株式会社QRingへのお問い合わせ、つながるQRのサービスや法人・自治体でのご利用に関するご相談窓口です。 | 株式会社QRingへのお問い合わせ、つながるQRのサービスや法人・自治体でのご利用に関するご相談窓口です。 |
| /terms/ | 株式会社QRingが提供する「つながるQR」の利用規約です。 | 株式会社QRingが提供する「つながるQR」の利用規約です。 |
| /privacy/ | 株式会社QRingが提供する「つながるQR」のプライバシーポリシーです。 | 株式会社QRingが提供する「つながるQR」のプライバシーポリシーです。 |
| /law/ | 株式会社QRingの特定商取引法に基づく表記です。 | 株式会社QRingの特定商取引法に基づく表記です。 |

descriptionの実質変更はHOME・SERVICEのみ。他9ページのdescriptionは維持した。title・メタ情報は `src/lib/seo.ts` に集約。HOMEの既存titleと自治体ページの既存titleは維持した。

## 初期HTML・AIOの確認

JavaScriptを実行する前の各index.htmlから、scriptを除いたmain内テキストを抽出して確認した。

| 確認項目 | 初期HTML内の掲載先 | 結果 |
|---|---|---|
| サービス概要 | HOME / SERVICE | 電話番号を知らせずQRコードから通話する説明あり |
| 正式な会社情報 | ABOUT、全ページの共通フッター | 株式会社QRingの会社情報あり |
| 日本国内での利用 | HOME / SERVICE / PRICE / FAQ | 指定の国内限定文言あり |
| 料金 | HOME / PRICE / FAQ / 特商法 | 880円・登録料/月額基本料・短時間通話の免除注釈あり。本文は未変更 |
| 通話・セッション条件 | PRICE / FAQ / SERVICE | 1時間・最大3分・再通話/折り返し等の既存説明あり |
| 主な活用場面 | HOME / SERVICE / 自治体向け | 家族・ペット・持ち物・自治体の既存説明あり |
| 一般向け正式リリース前 | HOME / PRICE / FAQ / SERVICE末尾 | 準備中とNEWS案内あり |

FAQの回答は閉じた状態でも初期HTMLに含まれる。SERVICEの「発見した方」タブはクリック後に生成されるため、そのタブ固有の操作説明を単独で抽出する用途には制約がある。ただし今回確認した重要情報は初期HTMLにあり、機能・表示を変えるタブの改修はしていない。Revealは初期HTMLを含むが、視覚表示はJavaScriptのIntersectionObserverで行う。JavaScript無効時の見え方の改善は別途の表示方針として扱う。

## 画像alt・内部リンク・インデックス

- 全11ページのimgにalt属性あり。SERVICE冒頭の補助写真1点は空altで、周囲にサービス説明がある装飾的な画像として現状維持。意味のある図解・操作画面は説明altあり。
- ローカル内部リンク先とアンカーの欠落は0件。CONTACT・マイページなど外部サービスの実画面は環境のアクセス制限で未確認。
- 公開11ページの初期HTMLにnoindexなし。旧 `/shop/` は引き続きnoindex + `/price/` canonical + meta refresh。sitemapには含めない。
- `out/404.html` の生成とnoindexを確認。独自404は追加していない。実ホスティングでの存在しないURLのHTTP 404応答は公開後に要確認。
- 公開URLを構成する11ルートは変更なし。新規コンテンツページ・料金本文・法務本文・画像は追加変更していない。

## PC・スマートフォンの速度とレイアウト

以下は本番PageSpeed InsightsやCrUXの値ではない。Chromiumでローカル静的サイトを条件ごとに1回測定したラボ参考値。キャッシュ無効、外部フォント・解析タグは除外、ページload後1.6秒待機。PCは1440×900 / 10Mbps / 40ms / CPU等倍、SPは390×844 / 1.6Mbps / 150ms / CPU4倍低速化。回線・実機・CDN・フォントの条件が異なるため本番値と比較できず、改善前後の速度差も主張しない。

| ページ | PC LCP(s) | SP LCP(s) | PC load(s) | SP load(s) | PC/SPのCLS |
|---|---:|---:|---:|---:|---|
| / | 4.56 | 24.04 | 4.49 | 25.21 | 0.0001 / 0.0000 |
| /about/ | 2.02 | 4.92 | 2.90 | 16.56 | 0.0004 / 0.0000 |
| /service/ | 2.37 | 4.98 | 2.33 | 13.25 | 0.0004 / 0.0000 |
| /price/ | 0.52 | 2.03 | 1.83 | 3.43 | 0.0004 / 0.0000 |
| /news/ | 0.42 | 1.41 | 0.61 | 2.93 | 0.0004 / 0.0000 |
| /faq/ | 0.38 | 1.57 | 0.58 | 3.03 | 0.0004 / 0.0000 |
| /municipalities/ | 3.76 | 13.36 | 3.70 | 13.30 | 0.0000 / 0.0000 |
| /contact/ | 0.87 | 1.26 | 1.00 | 2.90 | 0.0004 / 0.0000 |
| /terms/ | 0.40 | 1.75 | 0.66 | 3.21 | 0.0004 / 0.0000 |
| /privacy/ | 0.42 | 1.44 | 0.60 | 2.96 | 0.0004 / 0.0000 |
| /law/ | 0.55 | 1.33 | 0.73 | 2.91 | 0.0007 / 0.0000 |

全11ページ×PC/SPの22条件でload完了、横はみ出しなし、main内H1が1つであることを確認した。FAQの料金回答の展開・表示も確認済み。

## 修正提案（今回は未実施）

1. **画像配信の改善**：HOMEはHTML内画像の合計が約15MB、初期読み込みで約5MBのリソースが発生。大きなPNGの圧縮・WebP/AVIF化・適切なサイズ配信を検討。今回は画像変更禁止のため未実施。
2. **HEROの端末別読み込み**：PC/SPの2つのImageがいずれもpriorityで、CSSで非表示側も先読みされる構成。単一picture等による端末別配信を別途検討。レイアウト・画像の表示比較が必要なため、今回のH1修正とは分離した。
3. **フォントとアニメーション**：Google Fontsへの依存、Revealの表示待ちを測定して改善余地を検討。フォントの自己ホストや表示タイミングはデザイン・配信方針として別途扱う。
4. **旧shopの恒久リダイレクト**：静的meta refreshは現状維持。GitHub Pagesだけでは任意のHTTP 301/308ルールを追加できないため、ホスティング側の方法・移行方針を決めてから実装する。
5. **英字のページ主見出し**：ABOUT/SERVICE等の見えるH1は既存の英字デザインを維持。日本語の主題をより前面に出す場合は、見た目の変更案として別途検討する。

## 要確認

- 本番のHTTPレスポンスヘッダー、非www→www、HTTP→HTTPS、スラッシュ有無の転送、404応答、外部サービスへのリンク動作。今回ホスティング設定は変更していない。
- Cloudflareのプレビューは本番と異なるURL。本番canonicalを指すのは意図した設定で、プレビューの検索対象外ヘッダーも公開前に確認する。プレビューURLをSearch Consoleに送信しない。
- CONTACTはサイト内 `/contact/` にFormspreeフォームがあり、主要ナビのCONTACTは `https://axb.qring.jp/contact` に接続する。どちらを主たる窓口としてインデックスさせるかは運用確認が必要。機能やnoindexは勝手に変更していない。
- 実際の検索掲載状況・Googleが選択したcanonical・インデックス登録・本番のCore Web VitalsはSearch Console/CrUXで要確認。今回はアカウント操作・送信をしていない。
- Google Rich Results Test / Schema Markup Validatorによる本番チェックは未実施。ローカルではJSON構文、WebPage数、@idの重複、URLの整合を確認した。

## Search Consoleで必要な手順（未実施）

1. 本番公開の承認・デプロイ後、https://www.qring.jp/ の正しいプロパティを開く。
2. 本番 `/robots.txt` と `/sitemap.xml` が取得でき、公開ページにnoindexや誤ったX-Robots-Tagがないことを確認する。
3. 「サイトマップ」で `https://www.qring.jp/sitemap.xml` を送信する。すでに登録済みの場合は取得結果とエラーを確認する。
4. HOME / ABOUT / SERVICEなど代表ページをURL検査し、ユーザー指定・Google選択canonicalとレンダリング結果を確認する。必要に応じてインデックス登録をリクエストする。
5. ページのインデックス登録、Core Web Vitals、検索パフォーマンスを継続確認する。送信や構造化データ追加は掲載・順位・AI検索での引用を保証しない。

## 検証コマンド

```sh
npm run build
python3 scripts/seo-audit.py --json /tmp/qring-seo-audit.json --check
```

標準ライブラリだけで静的出力を検査するため、Python 3が必要。法務本文JSONは未変更で、HOMEの見えないH1追加を除く主コンテンツの文言は修正前後で一致することも確認した。

## 参照した公式資料

- [Google: Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google: 構造化データの一般ガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: sitemap作成と送信（lastmodの正確性）](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: canonicalの統一](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
