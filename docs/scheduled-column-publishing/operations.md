# 月次運用と障害対応

## 月次登録：翌月分を一度レビューする

1. 最新mainから専用ブランチを作る。原稿・SEO・出典・イラストを制作し、内容・サービス仕様・画像の権利と対応をレビューする。生成やファクトチェックをこの登録ツールが代行するわけではない。
2. イラストの完成ファイルを `public/images/columns/` へ配置する。英数字・ハイフンの固有ファイル名を使い、既存ファイルを上書きしない。JSONにパス・実寸・altを記録する。登録検査はPNG／JPEG／WebPのヘッダーを読み、記載寸法との一致を確認する。画像加工はしない。
3. 月次packetはArticle配列のJSON。既存の `src/lib/columns/types.ts` と構造化ブロック形式を使用する。承認済み本文を登録し、表やリンクをHTML文字列として挿入しない。
4. レビューが済んだ版について、packet内で `status: "scheduled"`、`publicationPending: false`、`approvalRevision: contentRevision` を指定する。品質確認結果・出典を記録する。これらは**フィールドであり本人認証された承認ではない**。ツールは承認を付与せず、代表者のPRレビュー・マージ承認が必要。
5. 以下で確認し、必要ならローカルのレジストリへ適用する。`--apply`もコミット・push・公開・日付変更は行わない。

```sh
node scripts/column-month.cjs --month 2026-12 --file /path/to/reviewed-december.json
node scripts/column-month.cjs --month 2026-12 --file /path/to/reviewed-december.json --apply
npm run test:columns
npm run test:scheduled-columns
python3 -m unittest discover -s tests/publication -v
npm run build
npm run check:column-export
npm run check:column-navigation
```

6. 月次のDraft PRを作り、画像・日時・内容をまとめて確認する。承認後に一度mainへマージすれば、公開日は毎日の手動マージ・フラグ変更なしで判定される。再度同じpacketを適用すると重複エラーで停止し、記事を二重登録しない。

2026年12月は1〜31日すべての日付を用意する。1日に複数件を設定することもできる。月次packet検査は対象月の欠落日を指摘する。後で意図的に1記事を保留にすることまで禁止しないため、通常CIの予約レジストリ検査は各記事の準備状態を確認し、月の欠落日を強制補充しない。

## 設定する主なフィールド

| 内容 | フィールド・設定 |
|---|---|
| 識別子・URL | `id`、`slug`。既存と重複させない。公開後に変更しない |
| タイトル・概要 | `title`、`summary`、任意の `introduction` |
| 本文 | `sections` のid・見出し・paragraph／heading／list／link／table |
| 予定日時 | `publishedAt: "2026-12-01"`、`publishedTimestamp: "2026-12-01T08:00:00+09:00"`。記事ごとの時刻を設定できる |
| 表示上の記事日 | `editionDate` を使う場合は意図した日を指定。公開判定の起点にはしない |
| カテゴリ等 | `category`、`primaryAudience`、`tags`、検索意図・キーワード・クラスター |
| SEO | `seoTitle`、`metaDescription`。本文と一致させる |
| 画像 | `image.src`、`width`、`height`、`alt` |
| 参考資料 | `sources` のid・名称・URL・確認日、根拠が必要な `claims` と出典ID |
| 関連記事・サービス | `relatedArticleIds`、`relatedLinks`、`relatedService`、`cta`。未来記事の本文リンクは既存の公開フィルターが抑制する |
| 更新日 | 未公開の原稿では `updatedAt: null`。公開後に実質更新したときだけ更新日を設定 |
| 確認・承認 | `reviewedAt`、`contentRevision`、`approvalRevision`、`validationResults`、`serviceSpecificationVersion` |
| 原稿の受領記録 | `contentFormat: "approved-manuscript"` を使う場合、既存の `approvalRecord` と実在するMarkdown・SHA256を一致させる |

`published.json`は名称を維持した全体レジストリで、`scheduled`の記事も同じ形式で格納する。新しいDBや独自管理画面は作らない。

## 公開前の確認

```sh
npm run test:publication-matrix
```

隔離コピーとテスト用記事で公開時刻の直前・ちょうどを実ビルドし、ローカルHTTPを検査する。本番の記事日時は変更しない。

特定の予定時点の自分の原稿を確認する場合は、**デプロイしない隔離コピー**で `COLUMN_BUILD_AT` を指定してビルドする。生成した未来出力を本番へアップロードしない。workflow_dispatchには任意日時入力を用意していない。

Cloudflareブランチプレビューでも通常のscheduled記事は実際の日時まで非表示。内容レビューは原稿や隔離ローカル出力で行う。GitHubリポジトリ自体は公開されているため、GitHubの原稿・履歴を完全に秘匿することはできない。公開サイトの本文・JS・JSON・XML・個別URLと、公開リポジトリの閲覧可能性を区別する。

## 正常時に行うこと

毎日のコミット・公開フラグ変更・手動デプロイは不要。GitHub Actionsの `Deploy to GitHub Pages` を開くと、planのsummaryに `noop` または `build` と理由が記録される。反映済みのno-opも、実際の全公開面を検査してから成功とする。

`publication-state.json`は公開済み記事だけの識別子・版・ハッシュ・元commit・ビルド時刻を持つ。未公開予定一覧・本文・秘密情報は含まない。公開元commitと実際の配信内容を照合するために使用する。

公開予定時刻と、ビルド・配信が完了した実時刻は別。予定時刻は記事の既存メタデータ、実際の完了時刻はworkflowログと検証summaryで確認する。GitHub scheduleの性質により厳密な時刻保証はしない。

## 障害時の復旧

1. Actionsの失敗runを開き、plan／build／deploy／publication-statusのどこで止まったか確認する。watchdog失敗は公開workflowの成功が120分以上ないことを示す。
2. ビルドなら最初の失敗テスト・原稿・画像・版を修正する。検査を無効にしない。権限エラーならPages／environment／Actions設定を確認する。通知停止で解決したことにしない。
3. `main changed during the build` は、古い版の上書きを防止して配信を止めた状態。次回は最新mainを取得する。
4. 自然復旧を待てない場合、Actions → **Deploy to GitHub Pages** → **Run workflow** → branch **main**。必要なら **force_rebuild** を有効にする。
5. 手動実行も実時計・承認版・品質結果で再判定する。未来記事や未承認下書きを公開しない。
6. `publication-status` と本番照合まで成功したことを確認する。HTTP200だけやPagesアップロードだけでは復旧完了としない。

通信・キャッシュ反映の検査は1run内で最大3回再試行。それでも失敗した場合、次の定時実行が公開漏れも含め再判定・再配信する。原稿・レジストリ・commitを自動変更しない。

## 予定変更・保留・記事修正

- **予定変更**：branchで `publishedAt` と `publishedTimestamp` の日付を整合させ、時差 `+09:00` を維持。既に承認した版を変える場合は版を更新し、再レビューする。マージ前に実際の日時を過ぎていれば、次回処理で対象になる。
- **未公開原稿の修正**：mainにマージする前に本文・SEO・画像・出典を確認する。承認した原稿を修正したら `contentRevision` を増やし、旧承認をそのまま流用しない。未承認のscheduled記事をmainへ入れるとCIが停止する。
- **公開保留**：対象をdraft／review／needs_revision等へ戻し、pendingや承認版も適切に整理する。未承認状態で予約を続けたことにしない。期限が近ければ変更の承認・main反映を急ぐ。
- **公開済み記事の修正**：URL・公開履歴を維持してbranch上で改訂し、旧原稿・版・根拠を残す。内容改訂に伴う更新日だけ変更し、レビュー後にPRを承認・マージする。公開中のmainへ未承認版を直接書かない。
- **29・30日分**：過去の未公開原稿の受領記録を保存している。公開承認後は同じ内容・日時であれば承認版と公開状態を設定できる。本文や日時を変える場合は版を増やしてレビューする。履歴ファイル自体を公開済みに書き換えたり削除したりしない。

## 通知・監視の確認

GitHubのリポジトリ／Actions通知設定で、workflow失敗を受け取れることを確認する。個人アカウントのメール設定は本作業では確認・変更していない。正常時の独自メールやIssueは作らない。

watchdogもGitHub Actions上で動くため、GitHub全体停止・両workflow無効化・公開リポジトリの長期無活動によるschedule停止を完全に外部から検出できない。Actionsを使わない独立監視が必要な場合は別途承認を得る。月次のmain登録時にはworkflow有効状態と通知を確認する。
