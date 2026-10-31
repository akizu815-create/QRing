# お問い合わせ窓口統一：事前確認と301設定案（切り替え保留）

> 追加調査（2026年10月31日）：DNS管理元と接続先が判明しました。末尾の「追加調査：DNS確定結果と転送方式の選定」を最新の結論としてください。フォーム・本番設定は未変更です。

確認日：2026年10月31日。基準：`4741c16e95e5a591f3cab8528c265f2ea1589837`。

## 現在の判定

**切り替え条件が未達のため、転送を有効にせず、旧フォームを維持する。**

このPRは調査報告のみで、アプリケーション・配信設定・フォーム送信先・検索設定・GA4を変更しない。プレビューも現行ページの表示を維持し、301転送を実装・検証済みとするものではない。

未達項目は次の2点。

1. 統一先の実際の通知先、通知抑制可能なテスト経路、APIからの受付・確認メール・管理者通知の成功を確認できていない。
2. 本番はGitHub Pagesへの静的配信。Cloudflare Pagesはプレビュー用で、本番ホストにHTTP 301を適用する層・設定権限を確認できていない。

対象リポジトリに新フォームのバックエンドは含まれていない。公開フロントエンドにテスト用のdry-run、通知抑制オプションは確認できず、これらの不存在まで証明したものではない。通知先や抑制方法を推測して本番APIへ送信していない。

## 新フォームの動作確認

対象：`https://axb.qring.jp/contact`

| 確認項目 | 結果 |
|---|---|
| 表示 | HTTP 200、ブラウザーでフォーム表示を確認 |
| PC操作 | テストと明記した値の入力・保持、問い合わせ種別の選択を確認 |
| スマートフォン相当幅 | 390×844のiframeで確認。実効幅384px、横はみ出しなし。入力・保持・種別選択・ポリシー表示を確認。実機確認とは異なる |
| 必須項目 | 氏名、メール、問い合わせ内容、プライバシーポリシー同意。会社名・電話は任意 |
| 問い合わせ種別 | サービスについて／法人・自治体での導入／実証実験について／メディア取材／その他。公開JSでは未選択時の検証あり |
| 入力検証 | メール欄に無効なテスト文字列を入力し、HTML validityのtypeMismatchを確認。電話は公開JSで数字・桁数検証あり |
| プライバシーポリシー | リンクを押すとモーダルに本文を表示。PC・スマートフォン幅で確認。同意チェック・フォーム送信は行っていない |
| 送信先の実装 | 公開JSは`POST /prod-api/contact/sendEmail`を呼び出す |
| 送信完了の仕組み | API応答`code === 200`で「送信完了」モーダルを表示し、閉じると公式HOMEへ戻る実装あり |
| 実際の受付・通知先 | メール送信設定、通知先、保存先、管理者、直近成功履歴は未確認 |
| 実送信テスト | 未実施。通知抑制可能なテスト経路が未確認で、業務通知を発生させない条件を満たせないため |

入力操作では明示的なテスト名・テスト文と無効なメール文字列を使用し、同意チェックは外したまま、送信ボタンは押していない。入力値は確認後の再読み込みで消去する。API成功時のモーダルがコードにあることと、実送信・メール配信が成功したことは区別する。

### 法人案内の内容

新フォームの現在の案内は「法人・自治体での導入、実証実験、複数のQRコードのご利用など、お気軽にご相談ください。」で、「API連携・ホワイトラベル展開」は表示されていない。旧ページもPR #107でこの表現に修正済み。

ご指定の「自治体での導入、コラボ商品、カスタムプラン、その他の法人向けご相談」とは表現が異なる。現行案内が未提供APIを訴求している状況ではないため、今回は別アプリ側の文章・問い合わせ種別を変更していない。必要なら新フォームの担当リポジトリで指定文への調整を別途行う。

## 統一前の導線一覧と今回の変更

ビルド済み公開18ページのHTMLとソースを確認した。**問い合わせリンクはすべて`https://axb.qring.jp/contact`で、旧`/contact/`への内部導線は見当たらない。** PC・スマートフォン別DOMの重複を除き、配置単位で整理する。

| ページ・配置 | 現行の問い合わせ導線 | 今回の変更 |
|---|---|---|
| 共通ヘッダー | CONTACT → axb | なし |
| スマートフォンメニュー | CONTACT → axb | なし |
| 共通フッター | お問い合わせ → axb | なし |
| HOME `/` | HERO「お問い合わせはこちら」→ axb | なし |
| SERVICE `/service/` | 「法人・自治体の方はこちら」→ axb | なし |
| PRICE `/price/` | 「お問い合わせ窓口」→ axb | なし |
| ABOUT `/about/` | 共通ヘッダー・メニュー・フッター → axb | なし |
| 自治体 `/municipalities/` | HERO・末尾の導入相談 → axb | なし |
| コラボ `/collaboration/` | HERO・末尾のコラボ相談 → axb | なし |
| 高齢者 `/use-cases/elderly/` | 共通ヘッダー・メニュー・フッター → axb | なし |
| ペット `/use-cases/pets/` | 共通ヘッダー・メニュー・フッター → axb | なし |
| 持ち物 `/use-cases/belongings/` | 共通ヘッダー・メニュー・フッター → axb | なし |
| NEWS `/news/` | 共通ヘッダー・メニュー・フッター → axb | なし |
| FAQ `/faq/` | 法人・実証・複数QRの回答内3リンク、共通導線 → axb | なし |
| `/column/` | 共通導線 → axb | なし |
| `/column/elderly-monitoring/` | 共通導線 → axb | なし |
| `/column/lost-item-preparation/` | 共通導線 → axb | なし |
| `/terms/`・`/privacy/`・`/law/` | 共通導線 → axb | なし |
| 旧`/contact/` | 共通導線はaxb、本文フォームはFormspreeへPOST | 維持。切り替え保留 |

旧本文フォームの送信先は`https://formspree.io/f/xeedwlak`。通知先や受付履歴は管理画面が必要。URLを削除・転送しても、すでに開かれている旧フォームやFormspree自体の受付まで自動停止するわけではない。既存問い合わせデータや通知先は無断変更しない。

## 実際の本番配信と301の実装方法

`.github/workflows/deploy.yml`はmainのpushで`npm ci`・`npm run build`後の`out/`を`actions/deploy-pages`へ送る。`next.config.mjs`は`output: "export"`と`trailingSlash: true`。リポジトリのCLAUDE.mdもGitHub Pagesへの静的配信と明記している。

Cloudflare Pagesの`_redirects`はPagesの配信時に解釈されるが、GitHub Pagesではその転送処理にならない。Next.jsの`redirects`も静的出力では利用できない。したがって、プレビューだけ301になり、本番では旧フォームが残る設定を「実装完了」として追加しない。meta refresh・JavaScript転送もHTTP 301とは区別し、今回代用していない。

### 第一候補：既存の本番配信を維持したエッジでの301

本番ホストがCloudflareのプロキシ配下であることと、対象ゾーンのRedirect Rulesを設定できることを確認できれば、Single Redirectで旧URLだけを転送する。DNS・既存ルールの状態と権限は未確認。新たなDNS変更・権限付与・ホスティング移行は実施していない。

以下は**未適用の設定案**。既存rulesetを置換するリクエストではなく、既存設定を確認後に追加する1ルールの例である。

```json
{
  "description": "QRing contact page permanent redirect (candidate, disabled)",
  "enabled": false,
  "expression": "(http.host in {\"www.qring.jp\" \"qring.jp\"} and http.request.uri.path in {\"/contact\" \"/contact/\" \"/contact/index.html\"})",
  "action": "redirect",
  "action_parameters": {
    "from_value": {
      "status_code": 301,
      "target_url": { "value": "https://axb.qring.jp/contact" },
      "preserve_query_string": true
    }
  }
}
```

ホスト条件にaxbを含めずループを防ぐ。静的ファイルの直接URLも含め、既存クエリを保持する。送信先APIへのPOSTを転送するルールではない。

Cloudflareプロキシ配下でなければ、現在の配信・DNS管理者とHTTP転送を適用できる層を特定する。本番をCloudflare Pagesへ移す方法もあるが、サイト全体の配信先変更になるため、この問い合わせ整理の範囲で無断移行しない。

### Cloudflare Pagesを本番として使用することが確定した場合の案

本番配信方式が確定し、新フォームの受付確認も完了した場合は、静的成果物内の`_redirects`で次を指定できる。ただし現状の本番GitHub Pagesには効かないため、このPRではファイルを追加しない。

```text
/contact https://axb.qring.jp/contact 301
/contact/ https://axb.qring.jp/contact 301
/contact/index.html https://axb.qring.jp/contact 301
```

本番と同じ配信構成のプレビューで、HTTPステータスとLocationを取得し、外部転送・クエリ保持・ループなしを確認してから採用する。

## SEOの現状と切り替え時の変更

| 項目 | 現状 | 受付・配信条件の確認後に必要な対応 |
|---|---|---|
| 旧URL | HTTP 200、旧フォーム表示 | HTTP 301で新URLへ。元フォームHTMLは公開成果物から除去する |
| sitemap | 旧`/contact/`を掲載 | 301有効化と合わせて旧URLを除外。axb側sitemapは別アプリで管理 |
| canonical | 旧URLを自己参照 | 301応答が正規化の主な信号になる。削除したページのWebPage/schema設定・監査対象も整合させる |
| 新URL応答 | HTTP 200 | 転送後のGETが200で安定表示されることを確認 |
| 新URLのindex制御 | 初期HTML・表示後DOMにnoindexは見当たらず、取得応答のX-Robots-Tagもなし | Google URL検査で実際の登録可否・レンダリングを確認 |
| axb robots.txt | HTTP 200だがrobots形式でなくSPAのHTMLを返す | 有効なrobots.txtの配信を別アプリ管理者と確認。現状からクロール禁止や登録済みとは断定しない |
| 新URLのtitle・canonical | 共通title「つながるQR」、専用canonicalは見当たらない | 検索対象にする場合、専用title・description・自己canonical等を担当アプリ側で整備する案 |
| 内部リンク | axbへ統一済み | 既存の正常なリンクは維持 |

旧URLのGoogle登録状況・外部リンク元・検索流入はSearch Console未確認。HTMLの設定だけで登録状況を断定しない。新URLが公開ブラウザーで読めることと、Googlebotからの登録適格性・実際のインデックス登録は別である。

**今回、旧URLのsitemap・canonical・構造化データ・監査対象は変更していない。** 301を未適用のまま旧URLだけ検索対象から外さない。

## GA4の今後の確認

- 公式サイト：`G-M75FF9RHJ6`を`layout.tsx`で使用。
- axb：初期HTML、公開コア・フォームJS、表示後DOMにGA4測定ID／GTMの実装は確認できない。サーバー側計測・別経路のタグ・GA4管理画面は未確認。
- 主な問い合わせCTAは別タブ＋`rel="noopener noreferrer"`。noreferrerは参照元を送らない指定。親ドメインが同じことだけで流入元・セッション継続は保証しない。両側のタグ、Cookie範囲、必要なドメイン設定を今後照合する。
- 送信完了を検知できる場所は、現行APIの成功応答でモーダルを出す処理。これを実際の受付成功と照合してから、完了計測を別作業で設計する。クリック・フォームへの到達・送信操作を完了と混同しない。
- 今回は新規計測イベント、キーイベント、ドメイン設定、CTAのrel属性を変更していない。

## 切り替えを再開する条件・公開後の検証

1. 正しい通知先・管理方法と、通知を抑制できるテスト環境／テストモードを確認する。抑制できない場合は、担当者が了承した最小限のテスト方法を確定してから実送信する。テスト文字列だけでは通知抑制にならない。
2. API受付・利用者確認メール・管理者通知・失敗時表示を確認し、取りこぼしがないことを確認する。
3. 本番ホストのHTTP 301を適用する管理層と権限を確認する。既存ルール・DNSを無断で置換しない。
4. この条件が揃った段階で、旧フォームの除去、301、sitemap・schema・監査設定の更新を同時に実装したPRを作成する。
5. 本番と同じ配信構成で`/contact`・`/contact/`・直接HTML・クエリ付きURLをテストし、301、Location、転送先200、ループなし、主要ページのリンクを確認する。
6. 公開後に同じHTTP確認と、Search ConsoleのURL検査・移行後の検索流入を確認する。既存データ・通知設定を無断削除しない。

## ビルド・確認結果

- `npm run build`成功（25ルートの静的出力）。
- `python3 scripts/seo-audit.py --json /tmp/qring-unify-preflight-seo.json --check`成功（公開18ページ、内部リンク・アンカー切れなし）。
- アプリケーションコード・配信設定の変更なし。変更ファイルはこの報告書のみ。
- Cloudflareプレビューは現行ページを維持するもの。301転送の成功を確認するプレビューではない。

公式資料：
- Next.js 15 静的出力の制限：https://nextjs.org/docs/15/app/guides/static-exports
- Cloudflare Pages redirects：https://developers.cloudflare.com/pages/configuration/redirects/
- Cloudflare Single Redirects：https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/


## 追加調査：DNS確定結果と転送方式の選定

### 1. 新フォームの送信先・通知先

公開HTML、コアJS `/assets/index-CMuWCVyS.js`、フォームJS `/assets/Inquiry-wlpVkjwM.js` を再確認した。

| 項目 | 追加確認結果 |
|---|---|
| フォーム画面 | `https://axb.qring.jp/contact`、GETはHTTP 200 |
| API送信先 | 公開コードのbaseURL `/prod-api` と `/contact/sendEmail` から、`POST https://axb.qring.jp/prod-api/contact/sendEmail` と特定。POSTは未実行 |
| 成功の判定場所 | 応答の `code === 200` で「送信完了」モーダルを表示する実装 |
| 管理者宛のTo/Cc/Bcc | バックエンド設定を参照できず未特定 |
| 利用者向け確認メール | フロントエンドには確認メールを送った旨の表示があるが、実際の配信・送信先の決定処理は未確認 |
| 管理権限 | 公式サイトリポジトリは参照・更新可能。接続済みコード検索で新フォームのバックエンド処理は見つからなかった。バックエンド配備環境・メール管理・Xserverの管理設定を閲覧できる接続は確認できていない |
| 実送信 | 今回の追加指示に従い未実施。送信先・通知先・保存データも未変更 |

画面に表示された会社のメールアドレス、SMTPの送信アカウント、DNSのMXだけから、問い合わせの通知先を推測してはいけない。通知先はサーバー側で決まるためである。

**通知先特定のために必要な画面・確認手順**

1. axbアプリの管理者が、稼働中のバックエンドのリポジトリ／配備管理画面を開く。対象は公式サイトのNext.jsリポジトリではない。
2. ルート `/contact/sendEmail` を処理するコードを検索し、管理者通知と利用者確認メールの処理を分けて追う。管理者通知のTo/Cc/Bccが固定値、設定キー、DBのどこから取得されるか特定する。
3. 本番の配備管理画面にある環境変数・設定ファイル・アプリ設定管理を参照し、そのキーの**本番適用値**と処理が利用する値を照合する。画面名・URLはバックエンド管理元が未特定のため断定できない。SMTPパスワードやAPIキーの共有・公開は不要。
4. メール配信サービスの管理画面またはSMTP送信ログで、既存の問い合わせの配信日時・Message ID・宛先・配信結果を閲覧し、上記To/Cc/Bccと一致するか確認する。DNSの管理元がXserverでも、メール配信元がXserverとは限らない。
5. 通知先が会社の意図した窓口か管理責任者と照合する。必要な実送信テストは別途許可を得てから行う。今回、受信確認のための問い合わせ送信はしていない。

### 2. DNS・本番配信の確定事項

Google Public DNSのJSON APIでNS・SOA・CNAME・A・AAAAを照会し、Cloudflare Public DNSのJSON APIでもNS・www CNAME・Aを照合した。両リゾルバーの結果は一致した。

| 項目 | 確認結果 |
|---|---|
| 権威ネームサーバー | `ns1.xserver.jp` ～ `ns5.xserver.jp` |
| SOA | `ns1.xserver.jp` |
| DNS提供元 | Xserver。契約アカウント・管理担当者・ドメイン登録事業者は別途未確認 |
| www CNAME | `www.qring.jp → akizu815-create.github.io` |
| wwwの解決先IPv4 | `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`（GitHub Pagesの公式案内と一致） |
| wwwの解決先IPv6 | `2606:50c0:8000::153` ～ `2606:50c0:8003::153` |
| Cloudflareプロキシ | 公開DNSではGitHub Pagesへ直接解決。通常のCloudflareプロキシ経由を示す構成ではない |
| 本番デプロイ | main push → GitHub Actions → `npm run build` → `out/` → GitHub Pages |
| Cloudflare Pages | プレビュー用。プレビューの転送設定は現在のwwwの配信には適用されない |
| axbの公開Aレコード | `203.143.123.26`。このIPだけからバックエンドの契約先・管理画面・メール通知先は特定できない |

旧ページは引き続きHTTP 200で、応答にGitHubのリクエストIDがあった。実行環境の中継がServerヘッダーを変更するため、Serverヘッダーだけで配信事業者を断定せず、DNS・ワークフローと合わせて判断した。

**設定画面での最終照合（すべて読み取り）**

- Xserver契約管理者：対象サービスの「DNSレコード設定」→ `qring.jp` → `www` のCNAMEを確認する。サーバー契約の場合はサーバーパネルの同項目。編集・保存はしない。
- GitHub管理者：`akizu815-create/QRing → Settings → Pages` で、公開元・Custom domain・HTTPS設定を閲覧する。今回、この管理画面の現値までは閲覧していない。`public/CNAME` にはwww.qring.jpがあるが、カスタムActions配信ではこのファイルだけを設定値の根拠にしない。
- Cloudflare：Pagesのプレビュープロジェクトと、本番ホストをプロキシするDNSゾーンは別物。現在のwwwは直接GitHub Pagesへ解決するため、プレビューの管理権限があることだけで本番301を設定できるわけではない。

### 3. A/B比較と採用案

| 比較 | A：HTTP 301 | B：ページ内の自動転送 |
|---|---|---|
| 返す応答 | サーバー／エッジから301＋Location | 旧URLはHTTP 200のHTML。HTMLが新URLへ案内する |
| 推奨実装 | 本番通信を処理するエッジで旧contactのパスだけ転送 | 旧フォームを案内文＋通常リンクに置換し、出力HTMLのheadへ0秒meta refresh |
| 必要な権限 | 対象ホストのエッジ／サーバー設定権限。現在は新しい配信層・DNS接続の検討も必要 | QRingリポジトリのコード更新・レビュー・公開権限 |
| 現在の条件での実施 | DNS・本番ホスティングを一切変えず、リポジトリだけの変更では実現できない | GitHub Pagesを維持し、旧ページと関連SEO設定だけで実装可能 |
| JavaScript無効時 | 転送できる | meta refreshはJavaScript不要。常時表示する通常リンクでも移動できる |
| SEO | Googleが優先する恒久移転方法 | 0秒meta refreshはGoogleでは恒久移転の信号として扱われる。ただしHTTP 301ではなく、すべてのクライアントで301と同じ動作になるわけではない |
| 既存サイトへの影響 | パスの条件を限定できるが、今の構成ではwww全体の入口となる配信層を変える必要がある | 旧contactページを中心に限定可能。他ページの本文・デザイン・問い合わせリンクは維持 |
| URLパラメーター | エッジで保持できる | 固定meta refreshでは元クエリの自動引き継ぎを保証できない。必要性を確認し、補助JSで許可したパラメーターだけを扱う案を別途検討 |
| 今回の状態 | 未実装・未適用 | 実装案のみ。旧フォームは維持 |

**採用方針：現在の「DNS・本番ホスティングを変えない」条件ではBを推奨する。AをDNS無変更で有効化できる構成ではない。** 将来、エッジの導入・配信方式変更を別途行う場合はAを優先する。今回はどちらも公開・有効化していない。

CloudflareのSingle/Bulk Redirectsは、対象ホストの通信がCloudflareにプロキシされることが必要。XserverのDNSにパス単位のレコードを追加することはできず、Xserver側へ.htaccessを置いても、GitHub Pagesへ直接向かう現在のwwwには効かない。301だけのためにDNSやサイト全体の配信設定を無断で変えない。

**Bの実装仕様（未実装）**

- `src/app/contact/page.tsx` から旧フォームを除き、既存の共通デザインを利用した短い案内と、`https://axb.qring.jp/contact` への通常のaリンクを置く。
- ビルド後の `out/contact/index.html` のheadに、次のmeta refreshと転送先canonicalが確実に1つずつ存在するようにする。必要なら対象HTMLだけを処理するビルド補助スクリプトを使い、他ページには作用させない。Next.jsのサーバーredirectsは使わない。
- 移動リンクはnoscript内だけでなく常時表示する。JavaScriptやmeta refreshを利用しない環境でも、リンクで移動できる。
- 旧フォームのHTML・RSCにも送信フォームが残らないようソース段階で除去する。Formspreeの既存データ・通知先は変更しない。
- sitemapから旧contactを除外し、構造化データ・SEO監査では通常の本文ページから転送ページの検査へ変更する。新フォームのURL・API送信処理は変更しない。
- JSあり／なしの両条件、外部からの直接アクセス、転送先、ループなし、通常リンクをプレビューで確認する。HTTP 200の転送ページであることを報告し、301成功と表記しない。

```html
<!-- 旧ページの出力HTMLのhead。実装時は重複を検査する -->
<meta http-equiv="refresh" content="0; url=https://axb.qring.jp/contact">
<link rel="canonical" href="https://axb.qring.jp/contact">
<!-- body内には既存デザインに合わせた説明と常時利用可能なリンク -->
<a href="https://axb.qring.jp/contact">新しいお問い合わせ窓口へ移動する</a>
```

### 4. 今回の作業範囲と未確認事項

- 今回は調査報告の追記・方式案の確定まで。コード、DNS、本番ホスティング、送信先、通知設定、GA4は変更していない。問い合わせの実送信もしていない。
- 未確認：管理者通知の実メール宛先、利用者確認メールの配信処理、本番のメール設定・配信ログ、バックエンド管理画面のURLと担当者、Xserver契約の管理者、GitHub Pages管理画面の現値。
- Bを実装する前にも、新フォームが意図した窓口に届くことの確認が必要。実送信は今回許可されていないため、既存ログ・コード・本番設定の読み取りを先に行う。

追加参照：
- DNS照会：Google Public DNS JSON API、Cloudflare Public DNS JSON API（qring.jp NS、www.qring.jp CNAME/Aを照合）
- Xserver DNSレコード設定：https://www.xserver.ne.jp/manual/man_domain_dns_setting.php
- GitHub Pagesカスタムドメイン：https://docs.github.com/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site
- Cloudflareのプロキシ要件：https://developers.cloudflare.com/rules/url-forwarding/
- Googleの転送方式と即時meta refresh：https://developers.google.com/search/docs/crawling-indexing/301-redirects
