# 既存コラム2記事の承認原稿差し替え

## 対象と原稿

- `/column/elderly-monitoring/`：離れて暮らす親の見守り、何から始める？
- `/column/lost-item-preparation/`：鍵や財布をなくさないために。今日からできる紛失対策

2026年11月6日に利用者から全文提供された承認済み原稿を、`src/content/columns/approved/` のMarkdownに保存した。記事の見出し、本文、表の各セル、関連サービス文言は原稿をそのまま構造化している。概要は承認原稿の冒頭段落をそのまま使用する。本文や比較表の独自生成・要約はしていない。

`python3 scripts/approved-column-manuscripts.py` で、原稿と公開データの完全一致・SHA-256・承認リビジョンを検証する。`--sync` は利用者が承認した原稿を明示的に登録するための操作であり、自動生成や承認を行う機能ではない。

## 公開履歴と日付

| 記録 | 根拠・取り扱い |
| --- | --- |
| 元記事の作成 | `c7a47f8179cb9e3d64cfa65e745811eb7d54178d`、2026年10月27日23:46:30（日本時間）。Gitへの作成日時であり本番公開日時ではない。 |
| 元記事の修正 | `d6d298937b40d862afcb93c5ccd54110f251f74f`、2026年10月28日0:08:29（日本時間）。 |
| 初回main反映 | PR #97、`ad86cbda8d3b8c49bd990b7f02033d7b41f8ec2f`、2026年10月28日0:56:53（日本時間）。 |
| 初回本番デプロイ | GitHub Pages実行 `40536045988` のデプロイアクションが2026年10月28日0:58:01（日本時間）に成功。ジョブ完了は0:58:03。これは配信成功の履歴であり、代表者の監修・承認記録ではない。 |
| 記事日 | 11月1日・2日は `editionDate` に保存する整理用の日付。初回公開日には使用しない。 |
| 初回公開日 | `publishedAt=2026-10-28`、`publishedTimestamp=2026-10-28T00:58:01+09:00`。 |
| 原稿更新・確認日 | 今回の全文受領・差し替え日である2026年11月6日。`updatedAt` と新リビジョンの `reviewedAt` に記録。更新の時刻は不明なので、構造化データの `dateModified` は日付のみとし、午前0時を捏造しない。これは本番への更新デプロイ完了日時ではない。 |
| 旧確認記録 | 旧データの `reviewedAt=2026-10-27` と、そこから算出されていた `nextReviewAt=2027-01-27` は監修根拠に使わない。今回の原稿はrevision 2、approvalRevision 2として明確に区別。次回確認日は未指定のためnull。 |
| 運用開始日 | 2026年11月1日。コラム運用の整理日であり、上記の既存URLの配信履歴を書き換えるものではない。 |

初回公開の証拠：[GitHub Pages実行履歴](https://github.com/akizu815-create/QRing/actions/runs/40536045988)。新しい原稿が後日再修正された場合は、その実際の更新日・承認記録も更新する。

## 本文の表示

承認原稿の記事では、旧原稿由来の参考情報欄、機能確認日、共通のサービス販促CTAを追加しない。原稿内に記載された「関連サービス」とリンクをそのまま表示する。既存の目次、カテゴリー・読者分類、関連記事などのコラムUIは維持する。

11月6日の自治体向け記事は、全データ項目を基点main `fcdfa356e2eaf397890939c7ec4da57cc1dcbaad` と照合する。タイトル・本文・画像・日付・SEO設定を変更しない。関連記事欄のリンク先タイトルは、2記事の改訂を反映する。

## 挿絵：実ファイルの受領待ち

会話には挿絵2点が表示されているが、実行環境にはPNGファイルが届いていない。Windowsの `C:/Users/aiko_/Downloads/` はこのクラウド環境から読めない。再生成や代替画像への差し替えはしない。

| 記事 | 受領待ちのファイル | 指定alt |
| --- | --- | --- |
| 家族の見守り | qring_column_nov01_illustration.png | 離れて暮らす高齢の母親とスマートフォンで連絡を取る女性の水彩イラスト |
| 紛失対策 | qring_column_nov02_illustration.png | 鍵と財布、QRコード付きキーホルダー、持ち物チェックリストの水彩イラスト |

画像未受領の間は存在しない画像URLやOGPを追加しない。原稿画像を受領後、比率を保ってWebP等に最適化し、既存の `image` データに実寸・指定altを登録する。本文画像・Article構造化データ・OGPに加え、承認原稿の記事に限って一覧にも画像を渡す実装を用意している。11月6日の画像表示は変更しない。

## 公開条件

このブランチは本文・日付・SEOの確認用。画像2点の反映と検証が終わるまで完成扱いにしない。管理者の承認前にmainへマージ・本番公開しない。公開データの `status=published` は静的プレビュー出力を許可する既存の仕組みに従うもので、PRのマージ承認を意味しない。

## 変更ファイル一覧

- `src/content/columns/published.json`
- `src/content/columns/approved/elderly-monitoring.md`
- `src/content/columns/approved/lost-item-preparation.md`
- `src/lib/columns/types.ts`
- `src/lib/columns/publication.ts`
- `src/lib/columns/navigation.ts`
- `src/app/column/[slug]/page.tsx`
- `src/components/columns/ColumnArticle.tsx`
- `src/components/columns/ArticleList.tsx`
- `src/components/columns/ColumnListing.tsx`
- `src/components/columns/ColumnStructuredData.tsx`
- `src/components/columns/RecentColumnLinks.tsx`
- `src/lib/seo.ts`（対象2記事のメタ情報のみ）
- `scripts/approved-column-manuscripts.py`
- `scripts/check-column-migration.py`
- `scripts/check-column-navigation.py`
- `scripts/test-column-publication.cjs`
- `tests/editorial/test_workflow.py`（新規記事のテスト用データに旧記事固有の履歴・承認情報を引き継がない）
- `package.json`（原稿一致検証を既存テストに追加）
- `docs/approved-column-revision-20261106.md`

## 検証結果（画像反映前）

- 本番用静的ビルド成功。
- 公開ガード、原稿の全文一致、構造化データ・canonical・sitemap、一覧・関連記事・ナビゲーション検証成功。
- 既存の編集・承認・手動取込テスト20件成功。編集プログラムは変更せず、新規記事のテスト用データに記事固有の履歴を引き継がないよう修正。
- SEO監査20ページ、内部リンク切れ0件、エラー0件。
- 375px・390px・1440pxで2記事をブラウザ確認。原稿の全段落・見出し・表セル・関連リンクを順序どおり保持。横はみ出しと読み込みエラーなし。スマホの比較表は表領域だけで横スクロール可能。
- 一覧の個人・家族／カテゴリーの絞り込み、11月2日→1日の並び順を確認。
- 旧タイトルが公開HTML・RSC・JSに残らず、旧本文が対象2記事に残っていないことを確認。
- 11月6日の自治体向け記事は、全データとレンダリングされたarticle要素が基点と完全一致。
- 挿絵・その画像を使ったOGPの表示検証は未実施（実ファイル待ち）。
