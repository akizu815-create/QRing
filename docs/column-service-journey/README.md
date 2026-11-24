# コラムのサービス導線・HOMEピックアップ・計測

2026-11-24。main `6051e94` 基点。料金・特許・販売前案内のPR #160とは別のDraft。mainへのマージ・公開はしない。

## 現状と変更

- 公開24記事。カテゴリは7種類、`relatedService` / `relatedLinks` / `cta` と承認原稿の区分を既に保持。本文の承認・公開条件を変えず、表示するリンクだけ共通部品に整理する。
- `ColumnServiceLink.tsx`：既存記事末の関連サービス・関連リンクのアンカーを共通化。承認済みのリンク文言・URLは維持。通常の関連記事リンクは計測しない。
- `serviceCta.ts`：高齢者／ペット／落とし物／プライバシーの4種類を共通定義。既存のサービス導線や自治体CTAがある記事には重ねない。未分類、公開前プレビュー、自治体・法人記事には追加しない。歴史・緊急機能の説明は無理に販売へ誘導しない。今回補うのは既存末尾サービス案内がない「学校の連絡網」「知らない番号からの電話」の2記事。いずれも番号を公開しない連絡手段との関連があり、本文の外に短いリンクだけを追加。
- HOMEは `homeColumnPicks.json` のslug配列で3件を管理。既存の公開フィルタを通った記事のみ対象。プレビュー専用の未公開記事も除外。指定なし・削除・重複・不足は公開済み最新記事で補完。記事カード画像や一般一覧の最新順は維持。
- ピックアップ：`elderly-monitoring`（離れて暮らす親の見守り）、`lost-dog-preparation`（愛犬の迷子への備え）、`lost-item-preparation`（鍵・財布の紛失対策）。テーマが3活用シーンと一致し、本文に備えの行動・関連サービス導線がある公開済み記事を選んだ。CTRや成果が最高という未検証の理由では選んでいない。

## GA4計測

既存gtagへ `column_service_click` を送信する。新たなGAタグや外部サービスは追加しない。パラメータは `article_slug` / `article_category` / `destination_page` / `placement` / `cta_type`。

遷移先はコード内の固定許可リストに限定。URLクエリや任意URL・氏名・電話・メール・QR識別情報をイベントに取り込まない。既存末尾リンクは設置箇所ごとにplacementを区別。同じクリックのイベント送信は共通コンポーネントのonClick一度のみ。documentへの計測リスナーは加えない。GA未読込・無効ならイベントを送らずリンクは機能する。GA4拡張計測の内部ページ遷移/page_viewは別イベントであり、このイベントを再送しない。

プライバシーポリシーには利用状況分析・Cookie・外部送信の説明がある。既存のGA4・PetSurveyLink方式を使用するが、同意モードの制御は現ソースに見当たらない。GA4管理画面の受信・パラメータのカスタム定義、アクセス解析の同意運用と外部送信表示の十分性は未確認。ポリシーは独自に改変しない。イベント実受信・問い合わせ完了・売上を計測済みとは扱わない。必要ならGA4で上記パラメータをイベントスコープで登録し、slug×遷移先×設置箇所を探索する（設定は未変更）。

## 変更対象・競合

アプリ：ColumnArticle / HomeColumns / 新ColumnServiceLink、homeColumnPicks.json、homePicks.ts、serviceCta.ts。
検証：check-column-dates.py / check-column-navigation.py はHOMEだけピックアップ設定を期待するように更新。一般一覧の全記事・順序・孤立・未公開除外検査は維持。新test-column-journey.cjsで無効・重複slugの代替、空配列、既存CTAとの重複排除、未分類・非公開の除外を確認。

既存PR #160の変更コンポーネントとは別。#140とは今回のアプリファイルに重複なし。#134は将来原稿の追加を含むが、記事データや公開ロジックを変更していないので取り込まない。#149/#144も変更しない。

## 検証

`npm run build`、`npm run test:columns`、`npm run test:scheduled-columns`、`npm run check:column-export`、`npm run check:column-navigation`、`node scripts/test-column-journey.cjs`を実施。
390/1280pxで既存3テーマ・追加CTA対象・プライバシー・除外記事を確認。本文テキスト・SEO/JSON-LD・記事画像を変更前と比較し、クリックをモックgtagで検証する。結果はvalidation.json。スクリーンショットは作成しない。

画像・SEO値・日付・承認履歴・原稿・公開処理・料金・法的文書は変更しない。HOMEの3件だけ最新順ではなく意図したピックアップ順になる。
