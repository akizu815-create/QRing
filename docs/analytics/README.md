# SEO・AIO監査とGA4成果計測の実装準備

監査更新日: 2026-11-19。基点: main `d87cb89`。ブランチ: `feat/analytics-ai-audit`。
この変更はDraft PR用。mainへのマージ、本番公開、問い合わせ・登録、Google側の設定変更は行わない。

## A. 監査結果

最初の基点 `f559333` から、再開時に最新mainを取り込んだ。PR #123は2026-11-06にマージ済み。再開時の未完了PRは #134（11/20〜30の下書き）で、記事・画像・公開処理には触れない。#136・#139の既存改善も維持する。

|対象・現行ファイル|分類|実装済み内容・確認結果|今回の対応|
|---|---|---|---|
|`src/lib/seo.ts`、各page metadata|正常 / 重要設定は変更禁止|title・description・canonical・OGPの共通管理。SERVICEの実績あるメタ情報を維持|変更なし|
|HOME、SERVICE、PRICE、3用途、自治体、企業向け|正常|主要本文は静的HTMLに出力。H1・見出し階層・画像alt・内部リンクを既存監査で検証|本文・画像・HERO変更なし|
|`PageStructuredData.tsx`、`ColumnStructuredData.tsx`|正常|Organization・WebSite・BreadcrumbList・Service・Articleと既存のID参照あり|追加・重複実装なし|
|`src/app/sitemap.ts`、`robots.ts`|正常|正規www URL。公開判定済み記事だけをサイトマップへ追加。旧SHOPの扱いを維持|変更なし|
|`src/lib/columns/publication.ts`、`index.ts`、`navigation.ts`|正常 / 公開フロー変更禁止|承認・改訂・検証・日時の共通判定。HOME・一覧・関連表示で再利用|変更なし|
|19記事の一覧・関連記事・CTA|正常|全記事の設定を[CSV](column-cta-audit.csv)へ記録。関連サービス・自治体向け導線を既に保持|新しいCTAは追加しない|
|`src/components/columns/ColumnArticle.tsx`|正常|承認原稿の関連サービスは本文後、関連記事はその後。municipal/contextual CTAも既存実装|変更なし|
|`src/app/service/page.tsx`|改善候補|仕組み・番号非公開・操作・料金・相談・準備中案内あり。ペット・持ち物の専用ページへはHOME経由|既存説明の下へ3用途の短いリンクだけを追加|
|`src/app/contact/page.tsx`|正常 / 本番応答は要確認|headの0秒meta refresh、canonicalとOG URLは正式窓口 `https://axb.qring.jp/contact`。フォールバックリンクあり。HTML転送でありHTTP301ではない|既存方式維持|
|www / 非www / HTTP / HTTPS / 末尾スラッシュ|要確認|静的構成はtrailingSlash、canonicalはwww。配信側の実HTTP応答は通信制限で未取得|ドメイン・Cloudflare設定変更なし|
|`src/app/layout.tsx`|正常 / アプリ側は要確認|`G-M75FF9RHJ6`のgtagローダー・configは各1つ。成果イベントの既存送信なし|新しいタグは追加しない|
|問い合わせ・登録アプリ|要確認|このリポジトリに実フォーム・登録処理のソースなし。axb側の測定ID、成功条件、同意・Cookie・セッションは未確認|独立した参照コードと組み込み条件を用意|
|既存Googleスプレッドシート|正常 / 拡張は要確認|既存6集計タブのほか「シート1」。AI Assistantチャネルあり、source/medium列とAI別タブなし|読み取りのみ。既存更新を上書きしない|
|Apps Script `updateQringReports()`|要確認|バインドされたスクリプト本文・既存トリガーは取得できていない。リポジトリにもなし|接続せず追加ファイルと手順を用意|
|CWV・実測速度・Search Console|要確認|HERO・画像・フォント・読み込み設定は変更なし。実ユーザーLCP/CLS/INP、GSC基準値、GA4管理画面への認証なし|数値や改善効果を推測しない|

### コード・生成HTML・公開サイトの区別

最新mainの生成HTMLで38ページを監査し、内部リンク切れ・メタ情報・見出し・構造化データの検査エラーは0。19記事の公開制御・日付・関連導線も検査する。コードや生成HTMLの正常性は、本番配信の同一性を保証しない。

公開サイトはWeb閲覧でSERVICE・COLUMNを取得できたが、取得結果はキャッシュで、COLUMNは旧7件の状態だった。最新の本番配信状態と断定しない。直接HTTP検証はプロキシで403/Tunnel拒否となり、www統一・転送チェーン・クエリ維持・axbの現在の応答は未確認。サイト自身の403や404と判定していない。

11/1・11/2は承認済みの記事日、技術上の初回公開日は既存記録の10/28として区別されている。日付表示・JSON-LD整合の既存検査が成功しており、今回の日付変更はない。19件は今回の監査時点のmainでの件数で、#134の未承認記事を含まない。

### スプレッドシートの観察（読み取りのみ）

指定シートの2026-11-13取得時点: `GSC_日別`、`GSC_検索語`、`GSC_ページ`、`GA4_流入`、`GA4_ページ`、`更新状況`を確認。更新状況は11/13 09:15:33 JST、GA4最終取得日は11/12。90日分のチャネル集計にAI Assistantが存在したが、サービス別の参照元ドメインはこのタブから確認できない。現時点の値として流用しない。生データや認証情報はこのPRへ保存しない。

## B. 最小改修案・変更前後

|変更ファイル|変更前 → 変更後|理由・影響|
|---|---|---|
|`src/app/service/page.tsx`|HOME活用シーンへのリンク → それを維持して3用途への短いテキストリンクも配置|専用ページへ直接到達。既存本文・title・description・H1・canonical・機能は維持|
|`integrations/apps-script/qring-ai-traffic.gs`|未存在 → デフォルト無効の独立集計コード|既存更新関数とトリガーは変更しない。サイトには読み込まれない|
|`integrations/ga4/completion-events.mjs`|未存在 → 成功フック接続前のイベント参照コード|公式サイトからimportしない。クリックを成果にしない|
|`tests/analytics/*`、`package.json`|未存在 → 17件のモック検証と実行コマンド|実送信・外部アクセスなし|
|`.github/workflows/editorial-checks.yml`|既存検査 → 追加コード変更時にも準備コードの検査を実施|PR検証のみ。定時公開の`deploy.yml`は変更しない|
|`docs/analytics/*`|未存在 → 監査・記事設定・接続手順・検証記録|非公開状態や未確認事項を明示|

## C. 計測実装案

- **公式サイトで完結:** 既存タグ・SEO・公開制御の監査、SERVICEのリンク補完。成果を送信する変更はない。
- **問い合わせ・登録アプリ側:** [成功イベントの組み込み条件](ga4-completion-integration.md)。ソース・成功条件・権限確認後に別途接続が必要。
- **Google Apps Script側:** [AI流入集計の組み込み手順](apps-script-integration.md)。既存コード確認・設定承認前は無効のまま。

## D. Draft PR

本ブランチをmain向けDraft PRとする。承認済み記事・公開フロー・既存SEO重要設定は維持。外部設定への反映、mainマージ、本番デプロイは未実施。

## E. 検証と残作業

機械検査・表示確認の結果は[検証記録](validation.md)に記載。準備コードの単体テストと実GA4・実Apps Script統合テストは区別する。

残作業: 問い合わせ・登録アプリのリポジトリと担当者の確認、既存Apps Script本文の確認、数値GA4プロパティID・権限・タイムゾーンの確認、同意・PII・成功フック確認、ステージングでのRealtime/DebugView、キーイベント設定、既存トリガーへの接続承認。本番の実問い合わせや登録はテストしていない。

### AIOに関する一次資料

[GoogleのAI検索機能ガイド](https://developers.google.com/search/docs/appearance/ai-features)に従い、通常の内部リンク、索引可能なHTMLテキスト、表示内容と整合する構造化データを優先する。専用AIマークアップや新しいファイルは追加しない。AI検索への掲載・引用・順位上昇は保証しない。Google検索のAI概要・AIモードの流入を、すべてGA4 AI Assistantチャネルへ割り当てる設計にはしない。
