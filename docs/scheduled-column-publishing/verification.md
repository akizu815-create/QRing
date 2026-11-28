# 検証結果

2026年11月28日。基点は `387b827`。本番デプロイ、main変更、本番記事の日時変更は行っていない。

## 自動検査

| 検査 | 結果・確認した内容 |
|---|---|
| `npm run test:columns` | 既存公開記事・移行・承認原稿・版の回帰検査が成功 |
| `npm run test:scheduled-columns` | 既存11月予約記録、共有ポリシー、月次packet、画像実寸・将来承認、watchdogの検査が成功 |
| `python3 -m unittest discover -s tests/publication -v` | 20テスト成功。重複実行のno-op、欠落本文の再ビルド、旧commit・欠落スナップショット・force、ビルド／配信失敗後の再判定、キャッシュ遅延の3回試行、未来URLのsoft404拒否・XML混入、誤タイトル・noindex・壊れた画像、空の公開対象、過去の下書きから承認版への正当な遷移を検査 |
| `npm run test:publication-matrix` | 隔離コピーでNext.jsの実ビルド2回とローカルHTTP検査が成功。下表参照 |
| `npm run build` | 静的生成・TypeScript検査が成功。公開28記事を維持 |
| `npm run check:column-export` | 出力本文・画像・日付・未公開除外の検査が成功 |
| `npm run check:column-navigation` | 一覧・カテゴリ・ページ送り・関連記事・固定HOME3件の検査が成功 |
| `node scripts/test-seo-foundation.mjs` / `python3 scripts/seo-audit.py --check` | 既存SEO・canonical・構造化データ・内部リンクの検査が成功 |
| `npm run test:editorial` / `npm run test:seo-ops` | 既存編集20テスト・SEO運用18テストが成功 |
| YAML・差分 | 3workflowの構文を確認。`git diff --check`成功。`src/content/columns`・`public`の差分なし |

ローカルの最終ビルドは `NEXT_TELEMETRY_DISABLED=1` を指定した。指定なしでは、この作業環境の読み取り専用HOMEへのNext.jsテレメトリー設定書き込みが拒否されたため。サイトのコード不具合や本番エラーとして扱わず、テレメトリー以外の検査を省略していない。

## 実際の静的出力とHTTP検証

テスト専用記事2件を同じ予定日時で登録し、別の下書き1件も追加した**一時コピー**を使用。実際の原稿・画像・公開日は変更しない。実装は既存記事数を固定せず、その時点のレジストリから期待数を計算するため、翌月の正当な追加後も動作する。

| 固定したテスト時計（JST） | 公開件数 | 直接非公開URL検査 |
|---|---:|---:|
| 2026-12-01 07:59:59 | 28 | 5件すべて404 |
| 2026-12-01 08:00:00 | 30 | 3件すべて404 |

両方で、全記事のH1・本文各ブロック・画像内容とalt・SEO・OGP・Article JSON-LD・canonical・noindex不在・一覧・カテゴリ・関連記事・XMLを照合。HTTP200だけでは成功にしない。未来のテスト本文・概要がHTML／TXT／JS／JSON／XMLにないこと、専用の未公開画像コピーが出力にないことも検査した。原本画像は加工しない。

純粋関数テストでは前日・直前1ms・同時刻・直後1ms、JST日付変更、UTC日付変更、月末、年末、同日複数、対象なし、前日分の追いつき、未承認・保留・不正な日時と承認版を検査。12月1〜31日の合成packet全件が受け入れられ、欠落日・未承認・重複・画像寸法不整合は拒否された。合成packetはメモリー／一時領域だけで、実際の12月記事は制作・登録していない。

ビルド・配信障害、二重起動、キャッシュ遅延はテストデータと通信adapterで再現した。実際のGitHub Pagesを故意に失敗させたり、本番に未来記事を出す試験はしていない。

## 確認範囲の限界

- 新workflowのGitHub定時実行、Pagesへの配信、watchdogの本番通知配送は承認後の確認事項。
- 本番HTTPへの今回の直接接続は、作業環境のプロキシでCONNECTが拒否された。ローカルHTTPの成功と過去のGitHubログ上の本番成功を区別する。
- Pages管理画面・Cloudflare設定・DNS/CDNの現値、アカウントの通知／課金設定は未取得。
- scheduleはGitHubにより遅延・欠落し得る。厳密な公開時刻や復旧所要時間を保証しない。
- 公開リポジトリに保存した原稿・画像・履歴はGitHubから閲覧可能。公開サイト出力の非公開制御はリポジトリの秘匿を意味しない。
- 29・30日の原稿は依然未承認。今回も公開・予約登録せず、別途の公開承認が必要。

承認後の本番確認・手動復旧手順は [README](README.md#6-本番反映前の作業と未確認事項) と [運用手順](operations.md) を参照。
