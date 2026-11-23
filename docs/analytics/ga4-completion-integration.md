# GA4成果イベント: 別アプリへの組み込み準備

**このPRでは実アプリへ接続していない。** `integrations/ga4/completion-events.mjs`は参照実装で、公式サイトからimportしない。実問い合わせ・登録操作、GA4管理設定変更は行わない。

## 確認できたこと・不足するもの

- 公式サイトの測定IDは`G-M75FF9RHJ6`。ローダーとconfigは各1つ。新しいタグは不要。
- 公式サイトの`/contact/`は正式窓口`https://axb.qring.jp/contact`へのHTML転送で、成功イベントの発火場所にはできない。
- 既存の10月末監査には`/prod-api/contact/sendEmail`と業務コード200の観察記録がある。ただし過去の公開JSの記録であり、現行ソース・送達保証・登録仕様として扱わない。
- 問い合わせと登録アプリのリポジトリは特定できていない。axb側のGA4タグ、初回アカウント作成と追加QR登録の区別、業務成功レスポンス、同意管理、再送制御を確認する必要がある。
- GA4の数値プロパティID、ストリーム、キーイベント、Cookie・参照元・セッション引き継ぎ、Realtime/DebugViewは未確認。

## 接続する位置

問い合わせは、サーバーが送信処理の成功を返し、アプリ側でも成功を確定した箇所から`contactCompleted()`を呼ぶ。フォーム表示、ボタンクリック、HTTP200だけ、入力エラー、業務エラー、通信エラーでは呼ばない。

登録は、**初回アカウントの作成成功**を確認した箇所から`accountCreated()`を呼ぶ。追加QR登録・プロフィール更新・ログイン・NEWSリンクは対象外。SPAの表示や成功ページへの直接アクセスを成功の根拠にしない。

```js
// 実アプリの成功契約・既存同意・gtag準備を確認してから接続する例。
// この例自体はページへ追加していない。
const reporter = createCompletionReporter({
  storage: window.sessionStorage,
  canTrack: () => confirmedAnalyticsConsentAndTagReady(),
  send: (event, params) => window.gtag('event', event, params),
});
// UUIDは1回の業務操作につき1つ生成・保持する。再描画や再通知で作り直さない。
// 電話番号・ユーザーID・QR識別子は使わない。
reporter.contactCompleted({ businessSuccess: true, attemptToken });
reporter.accountCreated({ businessSuccess: true, registrationKind: 'first_account', attemptToken });
```

`businessSuccess: true`をどのレスポンスから作るかは、実アプリのソース確認後に決める。参照実装だけではサーバー成功を証明できない。UUIDの生成・保持も実アプリの責務で、成功画面のレンダーごとに新規生成すると重複防止にならない。

## 重複・プライバシー

同一イベント・同一操作のUUIDを送信前にローカル予約し、再通知・再描画・同じstorageを使う再作成で二重送信を防ぐ。storageが使えない場合や同意・タグ準備が未確認なら送らない。送信結果不明時も自動再試行しない。`queued`はクライアント側キュー投入であり、GA4受信済みではない。タブをまたぐ同一操作・端末をまたぐ処理は実アプリ側の成功・冪等性設計も確認する。

参照コードのイベントパラメータは`generate_lead: {}`、`sign_up: {method: 'web'}`だけ。UUID・電話・メール・QR識別子は渡さない。ただし**GA4が自動付与するpage_location、page_referrer、既存user_properties等はこの関数だけでは制御できない**。登録URLや参照元にQR固有ID・個人情報が含まれるかを確認し、既存タグの自動収集も匿名化できたことを確認するまで接続しない。参照コードの単体テスト成功を、実アプリ全体のPII非送信確認とは報告しない。

## 管理者が行う検証・設定（今回未実施）

1. 実アプリのソースとステージング環境、GA4管理者または必要な閲覧・編集権限を確認する。測定ID・プロパティ・ストリームを公式サイトと照合する。
2. 同意条件、既存GTM/gtag、成功イベントの別送信がないことを確認。タグを二重追加しない。同じ親ドメインのサブドメインだからという理由だけでlinker設定を追加しない。
3. ブラウザのCookieとネットワークでCookieドメイン、同一セッション、self-referralを確認。必要な場合だけ設定案を作り、承認後に変更する。
4. ステージングとモックの正常応答で、成功1回・入力エラー0回・通信エラー0回・業務失敗0回・再描画/再読込0回追加を検証する。初回登録のみ1回、追加QR・設定更新は0回。
5. DebugView・Realtimeで受信を確認し、送信payloadと自動付与フィールドに個人情報がないことを確認。実環境での問い合わせや新規登録は別途明示承認が必要。
6. 管理画面で検証済みの`generate_lead`・`sign_up`をキーイベントに設定。`form_submit`やリンククリックを完了成果にしない。キーイベントのカウント方式も記録する。
7. トラフィック獲得でsession source/mediumと成果を比較。権限のない設定や未取得データを完了・0件と記録しない。

一次資料: [推奨イベント](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)、[DebugView](https://support.google.com/analytics/answer/7201382)、[クロスドメイン測定](https://support.google.com/analytics/answer/10071811)。実プロパティの現在の設定を確認してから適用する。
