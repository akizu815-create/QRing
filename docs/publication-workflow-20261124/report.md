# GitHub Pages失敗・予約公開経路の調査（2026-11-24）

## 結論と修正

基点main: `a393f3505414c6efddc18e0a36c2ceb69433cf0e`（PR #169マージ後）。直近の失敗はPagesへの転送・公開ではなく、その後のライブ検査の誤判定。HOMEがPR #161で手動ピックアップに変わったのに、`scripts/check-live-columns.py`だけが「最新記事が必ずHOMEに載る」と要求していた。

修正は検査側を現行の表示仕様に合わせる。HOMEのCOLUMNセクション内のリンクを、公開条件を満たす指定3記事・重複除外・不足時の表示日順フォールバックと照合する。最新記事は引き続き一覧、サイトマップ、個別ページで確認する。指定記事の欠落・順序違い・未公開記事の混入を許容する変更ではない。静的出力検査とライブ検査のHOME選定処理を共通化する。表示側・記事データ・公開管理は変更しない。

## 1. 実行ログ

| 実行 | イベント・作成日時（UTC） | 確認結果 |
| --- | --- | --- |
| [45352792736](https://github.com/akizu815-create/QRing/actions/runs/45352792736) | push、11/24 08:03:14 | build成功。deploy-pages成功、ライブ検査失敗。publication-status失敗 |
| [45344952214](https://github.com/akizu815-create/QRing/actions/runs/45344952214) | push、11/24 07:02:45 | 同じ検査ステップで失敗 |
| [45344102978](https://github.com/akizu815-create/QRing/actions/runs/45344102978) | schedule、11/24 06:55:50 | 同じ検査ステップで失敗 |
| [45304891943](https://github.com/akizu815-create/QRing/actions/runs/45304891943) | push、11/24 01:25:08 | PR #160後の最後の確認済み成功 |

最新の[deployジョブログ](https://github.com/akizu815-create/QRing/actions/runs/45352792736/job/138303504134)：

```text
08:04:16.5778658Z Created deployment for a393f350...
08:04:21.8546212Z Reported success!
08:04:23.1435370Z Attempt 1: Latest due article missing from HOME
08:04:34.0282267Z Attempt 2: Latest due article missing from HOME
08:04:44.4720492Z Attempt 3: Latest due article missing from HOME
Evaluated environment url: https://www.qring.jp/
```

PR #161のマージ `d03ab68e...` に対応するrunはcancelled。その次のPR #162マージ後のrun 45304954625から、取得した履歴では失敗が続く。時系列だけで原因を断定せず、同一の現行ビルド成果物に旧検査と修正後検査を実行し、旧検査の同じエラーと修正後の成功を再現した。

## 2. Pagesの設定・権限・環境

- workflowは `contents: read`、`pages: write`、`id-token: write` を指定。実行ログでもContents read、Pages writeを確認。
- environmentは `github-pages`。`actions/deploy-pages@v4`がPages APIへの公開成功を報告し、環境URLは `https://www.qring.jp/`。
- `public/CNAME`も `www.qring.jp`。静的出力 `out/` をupload-pages-artifactからdeploy-pagesへ渡す構成。
- 今回の失敗をPages権限不足・環境承認待ちとする証拠はない。権限や環境保護設定を変更する修正は不要。
- 管理画面のPages Source、カスタムドメイン・HTTPS設定、environment保護ルールの現値は**未確認**。接続ツールは `/pages`・`/environments/github-pages`・`/deployments` を許可対象外として返し、ローカル `gh api .../pages` もForbidden。成功ログをもって管理画面の全項目を確認済みとは扱わない。

## 3. Cloudflareとの役割・予約公開への必要性

既存の `docs/contact-unification-preflight-20261031.md` は、本番をGitHub Pages、Cloudflare Pagesをプレビュー用と記録している。現在のPages成功ログと本番環境URL、CNAMEもこの運用と整合する。過去の公開DNS記録ではwwwはGitHub PagesのIPへ直接解決していた。今回のDNS・本番HTTP再照会は実行環境の接続制限で失敗したため、現在のDNSやCloudflareのカスタムドメイン設定までは確認済みとしない。

Cloudflareアカウントの最新プロジェクト設定・デプロイフック・自動再ビルドは未確認。Cloudflare Pagesのプレビューが存在することと、wwwの本番配信・定時公開がCloudflareで成立していることは別である。

現行は静的サイトなので、日時条件が満たされても、再ビルド・再配信がなければ新記事は出ない。現在確認できた予約公開経路はmainの承認済みデータを、実時計の公開判定でビルドし、GitHub Pagesへ配信してwwwを検査するこのworkflow。したがって**GitHub Pagesを不要と判断できず、停止しない**。

### Cloudflareへ移す場合の代替設計（提案のみ）

1. 本番プロジェクト・wwwの配信先・ビルドコマンド・承認フィルタ・環境変数を確定する。ブランチプレビューと本番を分離する。
2. 現行と同じmain限定スケジューラを残し、実時計08:00 JST以降にcutoffを取得。既存の公開・予約公開テスト、静的出力検査を実行する。
3. 検査済みの同じ `out/` を権限を限定したCloudflareトークンで本番へアップロードする方式を優先。Git連携だけでは新commitのない日の時刻公開は保証されない。Deploy Hook案なら、フック受付で成功とせず実際のビルド・デプロイ完了を監視し、実時計cutoffと本番用承認条件を維持する。
4. デプロイ完了後、wwwの一覧・サイトマップ・最新詳細・HOMEピックアップ・未来記事非表示をキャッシュ回避付きで検査。失敗時はworkflowを失敗とし、08:15/08:45の再試行と手動復旧を維持する。
5. 非本番環境で07:59/08:00の境界、未承認原稿の除外、障害時再試行、重複配信、前日成果物の検出を検証し、切替・DNS・ロールバックの承認を得る。予約公開が実際に成立してから旧Pages経路を廃止する。同時に2系統を本番へ書き込ませない。

今回はトークン、フック、DNS、Cloudflare設定を作成・変更していない。

## 4. publication-statusの連鎖

`needs: [build, deploy]` と `if: always()` により、deployジョブがライブ検査で失敗してもstatusジョブが走る。`DEPLOY_RESULT=failure`なので意図どおりexit 1となる。別の公開障害が同時発生したわけではない。

この失敗通知は維持する。切り分けを容易にするため、今回のworkflow変更ではPages公開ステップとライブ検査ステップのoutcomeを別々にジョブサマリーへ表示する。`continue-on-error`、検査スキップ、失敗の成功扱いは追加しない。

## 5. メール多発・実行回数

取得した直近30実行（他workflowも含む）の範囲では、Deploy to GitHub Pagesは25件。うち成功14件、失敗9件、取消2件。失敗9件はpush 7件・schedule 2件で、短時間の複数マージと定期実行が、残存していた同じ不整合を繰り返し踏んでいた。再試行3回は1つのジョブ内のHTTP検査であり、それぞれ新workflowを作るものではない。

実際の受信メール数、通知購読設定、1実行あたりのメール数は未確認。2ジョブ失敗だから必ずメール2通とは断定しない。通知設定・メール設定は変更しない。

- 毎日07:50・08:15・08:45 JSTのcronは維持。07:50の処理は08:00まで実時計で待ち、未来時刻を偽装しない。後の2回は障害時の取り戻し用。GitHubのスケジュールは遅延し得るため、cron時刻を公開完了時刻の保証とは扱わない。
- main pushはサイト・原稿の更新反映に必要。`concurrency: pages` と `cancel-in-progress: false` を維持し、実行中の公開を途中で取り消さない。GitHubのconcurrencyは実行中1件＋保留1件で、連続pushの全履歴を順番に配信する保証ではない。
- 安全な削減候補：純粋な資料変更のみのpushをpaths-ignoreで除外する案。ただし資料commitを手動公開のトリガーにしている運用がないことを確認し、復旧はworkflow_dispatchへ統一してから採用する。今回は未適用。
- 定期処理の重複配信を省略するなら、最新mainの配信済みrevision、公開cutoffに基づく対象記事集合、実サイト検査の全成功を照合する仕組みが必要。「同じSHA」だけでは日付による公開変化を検出できない。ネットワーク失敗も公開不要と扱ってはいけない。この設計・検証なしにcatch-up cronや公開ジョブを減らさない。

今回まず誤検知の根本原因を修正し、必要な実行の失敗通知を解消する。実行数・通知設定を減らして問題を見えなくする対応ではない。

## 6. 変更範囲・検証

- `scripts/check-live-columns.py`：HOMEの選定ルール・セクション内リンク確認、選定結果をサマリー出力。
- `scripts/column_export_support.py`：既存の表示順比較とHOME公開済みピックアップ選定を共通化。
- `scripts/check-column-navigation.py`：上記共通関数を利用。既存の静的出力検査を維持。
- `.github/workflows/deploy.yml`：Pages公開とライブ検査の結果を分けて表示。トリガー・権限・公開先・失敗判定は維持。
- `.github/workflows/editorial-checks.yml`：検査関連スクリプト・deploy.yml変更時もPR検査を実施し、publicationテストを実行。
- `tests/publication/test_ops.py`：現行HOMEを反映し、最新記事がHOMEになくても公開完了、HOME指定欠落、未公開/削除/重複指定の代替表示、表示日順を追加検証。
- 本資料。

ローカル検証：publication 10テスト、test:columns、test:scheduled-columns、production build、check:column-export、check:column-navigation、SEO監査に成功。公開24記事、一覧3ページ、内部リンク・SEOエラー0。実際の同一out成果物では旧ライブ検査が `Latest due article missing from HOME` で失敗、修正後は最新記事 `/column/phone-number-personal-information/` と指定3記事を確認して成功した。

記事・画像・UI・SEO値・承認状態・公開日時・予約時刻・料金仕様は変更していない。Draftで本番workflowを再実行していないため、修正後の本番ライブ検査成功は承認・マージ後の確認事項。マージ後最初の通常実行で、Pages成功とライブ検査成功が別々にサマリーへ出ることを確認する。新たな失敗は成功扱いにせず、そのログを調査する。
