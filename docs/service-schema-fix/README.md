# SERVICE構造化データの不一致調査・最小修正

調査日2026-11-24。main `54404e66a4ecba7e0591ca7003118642ddd874bc`（#160〜#165反映済み）基点。open #149/#144は資料、#140は計測準備、#134は将来原稿。取り込み・マージ・本番公開は行わない。

## 1. 判定されたJSON-LD

生成元 `src/components/PageStructuredData.tsx`、SERVICEの`@type: Service`、`@id: https://www.qring.jp/service/#service` の `description`：

> つながるQRは、QRコードを通じて、お互いの電話番号を公開せずに通話できるサービスです。

対象はmeta descriptionやWebPage.descriptionではなく、Service.description。JSONの構文エラーではない。

## 2. 比較対象となる画面本文

`src/app/service/page.tsx` のプライバシー通話セクション（`#privacy-call`）には次が表示される。

> 発見した方は登録者の電話番号を、登録者は発見した方の電話番号を知る必要がありません。

> プライバシー電話番号が通話をつなぎ、双方の電話番号を相手へ公開せずに、直接会話できます。

> 専用アプリや、発見者による電話番号・IDの入力は不要です。

QRコードから通話する手順はINTROと使い方でも説明されている。CIは上記の特定段落だけを比較するものではなく、ページのmain内の初期HTMLテキスト全体を対象にする。

## 3. 差分・原因

|観点|旧Service.description|表示本文|
|---|---|---|
|説明の入口|「つながるQRは」「QRコードを通じて」|「プライバシー電話番号が通話をつなぎ」|
|番号非公開|「お互いの電話番号を公開せずに」|「双方の電話番号を相手へ公開せずに」|
|利用価値|「通話できるサービスです」|「直接会話できます」|

内容上、番号を相手に公開せず通話できるという説明は一致し、矛盾する仕様は確認されない。本文が#158等で改修された一方、別のファイルにある古い固定文が残っていた。

`scripts/seo-audit.py` の条件は `node.get('description') not in p['initialMainText']`。つまりdescriptionの**文章全体が、表示テキストにそのまま含まれるか**という文字列包含検査である。mainの修正前出力で、43公開ページ・内部リンク切れ0件・エラー1件 `service: Service must match visible content` を再現した。

## 4. SEO上の評価

[Googleの構造化データ一般ガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=ja)（2026-11-24閲覧）は、内容の正確性、ページとの関連性、利用者に表示する内容との整合を求める。このdescriptionと可視本文を一字一句同じ文章にするという一般要件は示していない。

今回のCI条件は、言い換えによる同義性まで評価せず文字列で確認する、Googleの一般的な意味の整合要件より厳しい独自の安全確認である。旧文と本文の意味は一致しており、このエラーだけを根拠にGoogleのポリシー違反、検索順位低下、手動対策があるとは断定しない。Search Consoleの手動対策・外部のRich Results Test・Googleが現在認識する本番HTMLは未確認。

## 5. 採用する最小修正

Service.descriptionだけを次の**既存表示文**に置き換える。

> プライバシー電話番号が通話をつなぎ、双方の電話番号を相手へ公開せずに、直接会話できます。

Service.nameは既存の「つながるQR」で、記述対象は明確。QRコードからの利用は同じページの既存説明と手順で確認できる。未確認の技術・特許・料金・安全保証は追加しない。検索エンジン用に本文を足したり、CIに合わせて自然な表示文を不自然に書き換えたりしない。CIの比較条件も維持する。

再発防止として、既存SEO検査ワークフローの対象パスへ `src/components/PageStructuredData.tsx` と `src/app/service/page.tsx` の2件だけを追加。これまでは、この2ファイルだけの変更で既存検査が起動する設定になっていなかった。チェック内容・判定基準・公開処理は変更しない。

変更ファイル：PageStructuredData.tsxの1値、.github/workflows/editorial-checks.ymlの対象パス2行、本資料とvalidation.json。表示本文・SEO title・meta description・OG・canonical・Serviceの他プロパティ・他ページJSON-LD・画像・記事・法的文書・承認公開管理は変更しない。

## 検証

修正前後の静的HTMLから全JSON-LDをparseし、構文、Service数、descriptionと表示文の一致、その他プロパティ・他ページschemaの維持を確認。SERVICEの可視mainテキスト/見出し/リンク/画像/ID、title/description/canonicalを前後比較する。結果はvalidation.json。

`npm run build`、`python3 scripts/seo-audit.py --json ... --check`、`node scripts/test-seo-foundation.mjs`、`npm run test:columns`、`npm run test:scheduled-columns`、`npm run check:column-export`、`npm run check:column-navigation`を実施する。GitHubの既存チェックも本PRから実行する。スクリーンショットは作成しない。
