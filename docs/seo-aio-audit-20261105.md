# SEO・AIO基盤点検と不足項目の補完

2026年11月5日。対象: PR #112 `feat/column-navigation`。既存の統合計画・導線整備を維持し、本番公開は未実施。

## 確認結果

「整備済」は確認した範囲での判定。Google登録・検索順位・実ユーザー性能の合格を意味しない。

| 対象 | 現状（補完後） | 確認できた問題・制約 | 改善内容／必要な対応のみ | 優先度 |
|---|---|---|---|---|
| HOME | 整備済 | title/description/H1/canonical正常。COLUMN・公開済み最新2本・Organization/WebSiteあり | 変更不要。既存COLUMNを維持 | 中 |
| SERVICE | 整備済 | サービス定義は本文に存在するがServiceの構造化データがなかった | 本文と同じ定義・日本国内・提供会社のみ追加。架空価格・実績・評価なし | 中 |
| PRICE / ABOUT / 自治体 / 企業協業 | 整備済 | WebPageは既存。一般ページにBreadcrumbListがなかった | HOME→当該ページの構造化パンくずを共通部品に追加。本文・レイアウト維持 | 中 |
| 高齢者 / ペット / 落とし物の活用シーン | 整備済 | 固有メタ情報・H1あり。一般ページのパンくず不足 | 同じ共通部品で補完。関連記事との相互導線維持 | 中 |
| コラム一覧・個別記事 | 整備済 | 公開2本。自治体記事0本の一覧はnoindexでサイトマップ外 | 既存Article・BreadcrumbList・公開判定・ページ送りを再利用。変更不要 | 高 |
| robots / sitemap / canonical / noindex | 整備済 | 18正規公開ページの集合とサイトマップ一致。未公開記事やpage/1別名を除外 | 適切な設定を維持 | 高 |
| 内部リンク・孤立ページ | 整備済 | 相対リンクだけでなく同一ホスト絶対URLも検査対象にする必要 | 絶対URL検査とHOMEからの到達性検査を既存監査に追加。リンク切れ0・孤立公開ページ0 | 高 |
| JavaScriptなしの本文 | 要改善→修正済 | RevealがサーバーHTMLにopacity-0を出力し、JS未実行時は本文が透明 | HTMLは表示状態。IntersectionObserver/Web Animations対応時に動きを追加。非対応・動きを減らす設定では通常表示 | 高 |
| FAQ | 整備済（本文） | サービス定義、料金、3分、1時間、折返し、国内限定等の回答あり。FAQPageは未追加 | 任意の候補として維持。FAQの大幅追記やリッチリザルト目的の重複マークアップは不要 | 低 |
| 404 / URL正規化 / 旧問い合わせ | 整備済（下記実測範囲） | 不存在URLはHTTP404。正規ホスト・HTTPS・末尾/へ到達。旧問い合わせは意図されたHTTP200 HTML転送 | URL・転送方式・DNS・ホスティング設定を変更しない。新たな301が必要となるURL移設は今回なし | 高 |
| GSC登録・Google選択canonical・クロール日時 | 未確認 | 既存GSC環境は利用中。ただし今回の実行環境にはGoogle認証の設定なし | 既存gsc-reportに読み取り専用 --inspect を追加。既存認証で確認後に判定 | 高 |
| LCP / INP / CLS | 未確認 | PSI取得を試行したが失敗。実ユーザー測定値なし | 既存PSIツールにmobile/desktop・lab/field区別・未取得nullを追加。GSC CWV/CrUXで補完 | 中 |
| 画像・JS | 要検討 | Nextのimages.unoptimized。表示画像に約2MBのPNGがある。共有JSはビルド表示約102kB | 画像容量を性能悪化の実測と混同しない。画質比較とLCP測定後に圧縮対象を選ぶ。今回は画像・デザインを変更しない | 中 |
| 外部資料のリンク切れ・制度最新性 | 未確認（網羅点検） | 内部リンク監査は外部ページの内容の正確性・到達を保証しない | 既存の記事更新・出典確認運用で継続確認。未確認を不具合と扱わない | 中 |

## 実装と検証

- `PageStructuredData`: 一般ページのBreadcrumbList、SERVICEにService。既存のOrganization/WebSite/Articleと重複させない。JSONをパースし、ID・パンくず順序・正規URL・Service説明の本文一致を検査。
- `Reveal`: 本文を静的HTMLから読める状態にする。今回のブラウザーではHOMEの対象26要素に非表示クラスなし、先頭要素opacity=1。SERVICEのPC表示とJSON-LDを確認。スマートフォンのCOLUMN操作は同PRの導線検証を継承（今回その操作・ブレークポイントは変更なし）。実機スマートフォンの速度は未確認。
- `seo-audit.py`: 既存のtitle、description、見出し階層、alt、canonical、noindex、robots、サイトマップ、404ファイル、問い合わせ転送、構造化データの検査に、説明文重複・構造化パンくず・Service・同一ホスト絶対リンク・全正規公開ページへの到達性を追加。
- `gsc-report.mjs --inspect`: 既存GoogleAuth/read-only scopeを再利用。Sitemaps listとURL Inspectionを明示した最大20URLだけ実行。自動再試行なし、各20秒上限。失敗はunavailableとして区別、既存SEOデータベースは更新・削除しない。検索結果に保存された版の確認であり、ライブURLテストやインデックス登録要求ではない。
- `pagespeed-check.mjs`: 既存キーがあればサーバー側で利用。キーがなければ公開APIを1回実行。55秒上限・再試行なし。LighthouseのLCP/CLS/TBTとページ・オリジン別のfield値を分離。TBTからINPを作らない。PSIにfield値がなくてもゼロ扱いしない。
- `test-seo-foundation.mjs`: 対象ホスト・20URL制限、重複除外、403/429の部分失敗、再試行なし、未取得null、lab/field区分をモックで確認。実Google接続の成功とは別。

検証コマンド:

```sh
npm run build
npm run test:columns
npm run check:column-export
npm run check:column-navigation
python3 scripts/seo-audit.py --json /tmp/qring-seo-audit.json --check
node scripts/test-seo-foundation.mjs
git diff --check
```

上記は成功。18正規公開ページ、既存2記事、未公開除外、静的ルート、相互導線を確認。

本番への読み取り確認: robots.txt/sitemap.xmlはHTTP200、監査用不存在URLはHTTP404。`https://qring.jp/` と `http://www.qring.jp/` は最終的に `https://www.qring.jp/`、`/service` は `/service/` へ到達。これは到達先の実測であり、途中の全転送ステータスを記録したものではない。`/contact/` は意図されたHTTP200。PRの変更は本番未反映。

## 管理者側の確認事項

新しいGoogle分析ツールの導入や有料契約は不要。既存の認証を実行環境に安全に設定し、`sc-domain:qring.jp` の閲覧権限・Search Console APIの利用可否を確認する。鍵・トークンをGitHub、公開サイト、NEXT_PUBLIC変数、コメントに貼らない。

```sh
# 既存の安全な認証設定があるサーバー/管理端末で実行
node scripts/gsc-report.mjs --inspect https://www.qring.jp/ https://www.qring.jp/service/ https://www.qring.jp/column/ https://www.qring.jp/column/elderly-monitoring/ https://www.qring.jp/column/lost-item-preparation/
node scripts/pagespeed-check.mjs https://www.qring.jp/ --mobile
node scripts/pagespeed-check.mjs https://www.qring.jp/service/ --desktop
```

結果には、サイトマップの最終処理・エラー、Googleが選択したcanonical、カバレッジ・最終クロール等が取得可能な範囲で含まれる。未取得・403・429は未確認として扱う。全ページの取得を日次ジョブに加えず、変更のあった主要URLだけ手動点検する。サイトマップがGSCの一覧にないことだけで記事が未登録と断定しない。

Core Web Vitalsは既存GSCのウェブに関する主な指標から確認。PSIのfield提供がない場合はCrUX等が必要で、別途の認証/API有効化が必要なら管理者に提示する。API課金設定変更は行っていない。新規月額サービス・AI従量呼び出し・新規依存パッケージの追加なし。

## サービスとコラムの役割（キーワード競合対策）

| テーマ | サービス・活用シーンの役割 | コラムの役割 |
|---|---|---|
| 高齢者・認知症 | `/use-cases/elderly/`: 発見後の連絡手段・使い方 | 家族が比較する見守り方法、外出時の備え |
| 家族の見守り・介護 | 活用シーンと`/service/`: QRingが担う範囲 | 介護者の準備・連絡体制・サービス選択の疑問 |
| ペットの迷子・脱走 | `/use-cases/pets/`: QR迷子札の仕組み | 脱走への備え、発見後の連絡、既存施策の役割 |
| 落とし物・紛失物 | `/use-cases/belongings/`: QRタグと使い方 | 紛失予防・位置確認と発見後の連絡の比較 |
| 自治体の見守り | `/municipalities/`: 導入相談・併用の考え方 | 公的施策、連絡責任分担、実証評価と一次資料 |
| 企業・施設 | `/collaboration/`: 協業・製品への組み込み | 施設での紛失対応、安全・運用上の検討 |
| 個人情報・電話番号 | `/service/#privacy-call` と `/privacy/`: 仕様・取扱方針 | 読者が連絡方法を選ぶ際の確認点と制約 |

同じテーマでも検索意図・読者・役割が違えば併存。既存のSEO提案処理で重複意図と関連リンクを確認し、順位低下だけで統合・削除しない。統合やURL変更は別途承認対象。

## 記事生成・承認との接続

SEOタイトル、説明、slug、カテゴリ、読者、公開/更新日、関連サービス/記事は既存データを正とする。canonicalは公開slugから導出し、パンくず・Article・サイトマップは同じ公開レジストリから生成。下書き・承認待ち・未来公開・承認revision不一致を除外する既存検査を維持。本文H1と見出しは既存レンダラーで構築。日時をビルド日に置換しない。

AI生成・認証付きスマートフォン承認画面など、既存計画で未実装の段階を今回実装済みとは扱わない。既存の提案は記事を無断で上書き・公開しない。GSC/PSI取得がなくてもビルド・公開判定は独立して動作する。認証付き管理画面や本番公開にこの調査CLIを組み込まない。

AIOではサービスの定義、スキャン→発信タップ→登録先への通話、番号非公開、国内限定、料金と利用条件を既存本文・FAQから読み取れる。GPSや自動異常検知を実装済みとして追記しない。自治体の採用・推奨、未実施の効果、レビューを作らない。特別なAIO用のキーワード、llms.txt、架空の構造化実績は追加しない。AIによる引用・検索表示を保証しない。

## 公式参照

- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- BreadcrumbList: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- URL Inspection（Google保存版のみ）: https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
- Sitemaps list: https://developers.google.com/webmaster-tools/v1/sitemaps/list
- PSIとfield提供の制約: https://developers.google.com/speed/docs/insights/v5/get-started
- Core Web Vitals（fieldとlabを区別）: https://web.dev/articles/vitals
