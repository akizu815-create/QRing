# 検証結果

検証基点: main `d87cb89`。2026-11-19の公開判定で実施。サイトの公開条件を変える環境変数は設定していない。

|検査|結果|
|---|---|
|本番相当のNext.js静的ビルド|成功（`NEXT_TELEMETRY_DISABLED=1 npm run build`）。最初のsandbox実行はホーム配下のテレメトリ書込制限で失敗し、テレメトリを無効化して再実行成功。サイト設定の変更なし|
|`npm run test:analytics-prep`|17件成功。AI集計11件、成果イベント6件。実API・実シート・実フォームへの接続なし|
|`npm run test:columns`|公開条件・承認改訂・安全なクライアント投影・承認原稿完全一致の検証成功|
|`npm run test:scheduled-columns`|既存8記事のJST/UTC公開境界・保留・未来日付・関連表示検証成功|
|`npm run test:seo-ops`|18件成功|
|`npm run test:editorial`|20件成功。最初のsandbox実行はローカルHTTPソケット制限で失敗し、ネットワーク許可内で再実行成功|
|`python3 -m unittest discover -s tests/publication -v`|7件成功。既存定時公開・再試行・公開境界・将来記事漏洩防止|
|`npm run check:column-export`|19記事。承認原稿・メタ情報・HTML日付・JSON-LD・非公開canary除外が成功|
|`npm run check:column-navigation`|19記事、通常一覧3ページ、自治体一覧1ページ、孤立記事0。最新表示・相互関連記事成功|
|`node scripts/test-seo-foundation.mjs`|成功。未取得データと0、実測/ラボ指標、スコープ制限等の既存検証|
|`python3 scripts/seo-audit.py --check`|38公開ページ、内部リンク切れ0、検査エラー0。問い合わせ・旧SHOPも既存条件を維持|
|mainとの生成HTML比較|43ページでtitle・description・canonical・見出し・画像・JSON-LDが同一。SERVICEの3リンク以外の本文を維持。その他ページの本文・リンクも同一。robots.txt・sitemap.xmlも同一|
|PC・スマートフォン|9ページ × 6幅 = 54ケース。375/390/430/1280/1440/1920pxで横はみ出し0、各main H1は1つ|
|GA4タグのブラウザ検査|各ケースでgtagローダー1、config1。完了イベント0。実GAへの通信は遮断したため受信検証とは異なる|
|HEROの維持|同じmainの比較ビルドと6幅でスクリーンショットの画素一致。HERO・画像・フォント・スタイルのソース差分なし|
|`git diff --check`|成功|

機械読取用の記録: [ブラウザ検査](browser-validation.json)、[生成HTML比較](static-comparison.json)、[メタ情報一覧](page-seo-audit.csv)、[記事別CTA一覧](column-cta-audit.csv)。ブラウザはローカル静的出力で検証し、問い合わせフォーム・登録アプリにはアクセス/送信しない。外部解析通信を遮断した。Google Fontsのブラウザ直接読込が確認できなかったため、公式CSS・フォントを一時領域に取得してテストブラウザへ供給し、Noto Sans JPの読込を確認して54ケースを再検証した。サイト側のフォント定義・画像は変更しない。

## 未実施・未確認

- 実GA4 Data API・Apps Script・既存トリガーとの統合実行。ローカルのモック結果を実接続成功とは扱わない。
- 実アプリの成功フック、GA4 Realtime/DebugView、キーイベント、クロスサブドメイン計測、SDK自動付与項目のPII検証。
- 公開サイトの正確な現在の配信内容・HTTP転送。プロキシ制限により直接応答を取得できず、Web閲覧結果もキャッシュのため、未確認。
- Search Consoleの実績値、GA4実測値、CrUXのLCP/CLS/INP。新しい分析サービスを導入していない。順位・AI引用効果は未計測。
- GitHub CIの実行結果はDraft PR作成後に確認する。ローカル成功とCI成功は区別する。

`.github/workflows/deploy.yml`、記事原稿・画像、公開レジストリ、SEO共通定義、HERO、料金・通話仕様はmainから変更していない。問い合わせ・登録・設定変更・本番デプロイ・mainへのマージは行っていない。
