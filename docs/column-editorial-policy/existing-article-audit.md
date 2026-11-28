# 既存コラムの名称・出典・画像監査

基点main：`662337682c8680280d192faa2c72a0e97bba10d0`。2026-11-28時点の公開28件＋承認済み予約2件を、公開前のソースと画像原本で点検。本文・SEO・出典・画像・版・日時は変更していない。現在の本番を再クロールした調査ではなく、同じmainからのソース／静的出力の監査。

## 直接の名称・出典候補（変更・例外承認は未実施）

| 記事 | 該当箇所 | 推奨するレビュー |
|---|---|---|
| [写真の位置情報、大丈夫？](https://www.qring.jp/column/photo-location-privacy/) | 本文のiPhone／Android／Google、参考資料のGoogle・AppleとURL | 位置情報・EXIFの仕組みを公的資料で説明する案、または必要な端末別説明の個別判断。サービス固有の設定を一律の手順へ置換しない。 |
| [スマホの緊急SOS機能、使ったことある？もしものときの備え方](https://www.qring.jp/column/smartphone-emergency-sos/) | SEO title・description・見出し・本文・tags・参考資料のiPhone／Android／Apple／GoogleとURL | 一般の緊急連絡と事前準備を主題に再設計するか、端末別操作を残す必要性を個別判断。誤操作につながる機械的な名称削除はしない。OGPとJSON-LD descriptionにも現SEOの製品名が反映される。 |
| [電話番号から個人情報はどこまでわかる？知られたときのリスクと対策](https://www.qring.jp/column/phone-number-personal-information/) | 本文のLINE、参考資料名とLINEのURL | 特定サービスのアドレス帳照合を普遍的な仕様と断定しない。公開可能な公的根拠で説明できる範囲へ改訂する案を別途レビューする。 |
| [QRコードって、そもそも誰が発明したの？日本生まれの技術の歴史](https://www.qring.jp/column/qr-code-inventor/) | 概要・本文のデンソー／デンソーウェーブ、参考資料名とqrcode.com URL | 開発の歴史の正確性を維持しつつ、技術史として必要な開発企業の記載を個別判断する。特許庁資料があるだけで企業名の掲載が自動許可されるわけではない。 |
| [QRコードをスキャンすると、何が起きているの？仕組みをやさしく解説](https://www.qring.jp/column/qr-code-scan-mechanism/) | 参考資料のデンソーウェーブ、qrcode.com URL | 公開可能な技術資料・公的資料で同じ主張を示せるか確認。根拠の確認前に出典だけ削除・置換しない。 |

## 区分の確認が必要な資料・共通表示

- `dementia-early-signs`・`dementia-forgetfulness`：日本老年医学会の学術資料。学会は民間企業の宣伝とは異なるが、「公的機関」と自動的に同一視しない。研究／専門機関資料としての掲載区分を代表者へ報告。
- `dog-microchip`：日本愛玩動物協会の資料。公益法人という属性だけで掲載可と断定せず、資料の必要性・区分を代表者が判断する。
- `disaster-family-contact`：NTT東日本の171／web171は災害時の公共的な連絡手段を説明する文脈であり、今回の条件付き許容に対応する構成。一般の通信サービス比較へ拡張していない。恒久的な全NTTサービス許可とは扱わない。
- 共通フッター：`※QRコードは株式会社デンソーウェーブの登録商標です。` がコラム全体にも表示される。技術名と帰属表示の扱いは代表者の個別判断事項。記事の広告・評価とは区別し、法的帰属表示を無断で削除しない。
- Organization／publisherは株式会社QRing。現在のArticle JSON-LDにcitation欄はなく、他社URLがJSON-LD citationへ出ているとは報告しない。今後追加する場合は必須検査に含める。

## 全30件の点検状況

以下の「未検出」は適合の自動認定ではない。既知名称・URLの文字検査、本文／出典の確認、全30画像の原本目視と生成経路の確認を行った。未知の名称や判読困難な小さい文字の不在まで保証しない。

| slug | 名称／出典の点検 | 画像／OGP画像 |
|---|---|---|
| elderly-monitoring | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| lost-item-preparation | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| elderly-monitoring-contact-system | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| lost-dog-preparation | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| dementia-early-signs | 資料の掲載区分を要確認 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| senior-care-facility-types | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| school-contact-list-privacy | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| care-levels | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| lost-wallet | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| dementia-forgetfulness | 資料の掲載区分を要確認 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| lost-property-retention | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| photo-location-privacy | 直接の名称／企業出典候補 | 小さなマーク等を要確認 |
| unidentified-elderly | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| dog-microchip | 資料の掲載区分を要確認 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| care-insurance-age | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| unknown-calls | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| dog-owner-voice | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| young-onset-dementia | 既知名称／URLの候補は未検出 | 小さなマーク等を要確認 |
| wallet-contents-safety | 既知名称／URLの候補は未検出 | 券面の小さな文字等を要確認 |
| qr-code-inventor | 直接の名称／企業出典候補 | 小さなマーク等を要確認 |
| cat-owner-memory | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| elderly-fall-prevention | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| smartphone-emergency-sos | 直接の名称／企業出典候補 | 小さなマーク等を要確認 |
| phone-number-personal-information | 直接の名称／企業出典候補 | 小さなマーク等を要確認 |
| pets-earthquake-prediction | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| monitoring-and-surveillance | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| qr-code-scan-mechanism | 直接の名称／企業出典候補 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| disaster-family-contact | 公共インフラの文脈を確認 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| why-we-misplace-things | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |
| number-private-calls | 既知名称／URLの候補は未検出 | 明示的な他社名・識別可能な商用ロゴは観察せず |

## 画像・内部リンク・最終出力の範囲

- [画像原本の目視記録・SHA256](image-review.json)：30点を無加工で確認。`photo-location-privacy`、`smartphone-emergency-sos`、`phone-number-personal-information`、`wallet-contents-safety`、`young-onset-dementia`、`qr-code-inventor` は外観や小さなマーク／文字の追加確認を要する。判読不能な文字を特定のAIサービス名等と断定しない。
- 画像の新規制作・編集・変換・差し替えは行っていない。OGPの画像は各記事の同じimageを使う。
- 内部リンクは表示ラベル・明示関連記事のタイトルを確認した。上記5記事へリンクする元記事についても、リンク先の改訂が決まった後に整合性を再確認する。元記事のリンクは無断削除しない。
- 現在の公開28件の静的出力について、title／description／OGP／JSON-LDと共通商標表示を別途確認した。[生成済みメタデータの点検記録](rendered-metadata-review.json) に保存。予約2件は予定前なので個別HTMLを出力しておらず、原稿データと共通の生成経路で確認した。
- OGP title／descriptionとArticle JSON-LD descriptionは記事のSEO情報、headlineは記事タイトル、imageは記事画像から生成される。したがって本文だけの修正では完結しない。共通のQRing名・ロゴは自社表記として許容範囲。
- 時事の9区分に関する新しいニュース記事や、個別企業の被害を題材とした主張は本作業では制作していない。将来の記述を許可したことにはしない。

機械検査の全指摘箇所は [scan-results.json](scan-results.json) を参照。既存記事の改稿・個別例外の採否は、この監査のマージとは別に代表者の確認を受ける。
