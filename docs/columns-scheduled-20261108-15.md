# 2026年11月8日〜15日 コラム・画像登録と予約公開

基準main: `75100f5`。PR #130の8原稿とPR #129の定時デプロイ案を統合したレビュー用PR。mainへのマージ・本番公開・Actionsの手動実行は行っていない。

## 登録一覧

すべて2026年、Asia/Tokyo 08:00。URLは `https://www.qring.jp` 以下。画像は `public/images/columns/` 以下。

| 日付 | タイトル | URL | 添付元 → 登録画像 | 寸法 | 容量 |
|---|---|---|---|---|---|
| 11/8 | 要支援？要介護？いったい何が違うの？ | /column/care-levels/ | 1-写真1.jpg → care-levels.webp | 1280×853 | 237,674 B |
| 11/9 | お財布を落としたら？ | /column/lost-wallet/ | 2-写真2.jpg → lost-wallet.webp | 1280×720 | 190,446 B |
| 11/10 | 認知症と物忘れ、何が違う？ | /column/dementia-forgetfulness/ | 3-写真3.jpg → dementia-forgetfulness.webp | 1280×720 | 181,040 B |
| 11/11 | 忘れ物はいつまで保管する？ | /column/lost-property-retention/ | 4-写真4.jpg → lost-property-retention.webp | 1280×720 | 187,252 B |
| 11/12 | 写真の位置情報、大丈夫？ | /column/photo-location-privacy/ | 5-写真5.jpg → photo-location-privacy.webp | 1280×720 | 201,922 B |
| 11/13 | 身元不明の高齢者、どう探す？ | /column/unidentified-elderly/ | 6-写真6.jpg → unidentified-elderly.webp | 1280×720 | 211,342 B |
| 11/14 | 犬のマイクロチップって何？ | /column/dog-microchip/ | 7-写真7.jpg → dog-microchip.webp | 1280×720 | 191,982 B |
| 11/15 | 介護保険って何歳から？ | /column/care-insurance-age/ | 8-写真8.jpg → care-insurance-age.webp | 1280×720 | 193,126 B |

本文・画像は8件すべて登録済み。記事本文の新規執筆・画像生成は行っていない。11/11の該当2文のみ、ユーザーの修正指示に基づき変更した。

## 原稿・画像の扱い

- staging原稿はPR #130を基準とし、11/11の該当2文のみユーザーの修正指示に基づき、速やかな返還・提出義務と1週間を過ぎた場合の権利喪失が区別できる表現に修正。その他はバイト列を維持。approvedにも同じ原稿をコピーし、SHA-256で登録元を記録。11/8は完成原稿の段落・認定区分表・番号付き手順・関連記事・参考資料をすべて維持。
- `scripts/register-november-columns.py` は当該8件だけを変換する。通常実行は検査、`--sync` は登録を同期。メタディスクリプションは原稿の導入文、SEOタイトルは原稿タイトルを使用し、別の文章を生成しない。
- カテゴリー・読者・関連記事・関連サービスリンク・出典URL・alt・公開日時を付与。本文の段落や表のセルを独立したテストで原稿と照合する。
- 添付JPEGを寸法維持・WebP品質90で再符号化。切り抜き・色調補正・加筆なし。11/8のみ元画像の約3:2を維持し、説明・顔・サービス例を切らないことを優先。他7枚は16:9。
- 既存の一覧・記事は `h-auto w-full` のため比率を維持。レイアウト・画像表示仕様は変更なし。
- 既存7記事のデータ・SEO、重要ページのソースは変更なし。記事増加で初めて生成される一覧2ページ目のdescriptionにはページ番号を付け、1ページ目との重複を防止。1ページ目の既存メタ情報は維持。

## 出典確認

原稿の出典URL不足は、本文を補完せず参考資料・メタデータとして補った。

| 記事 | 照合した主な根拠 |
|---|---|
| 11/8 | 厚生労働省の[要介護認定](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/kaigo_koureisha/nintei/gaiyo2.html)、[介護サービス情報公表制度](https://www.mhlw.go.jp/stf/kaigo-kouhyou.html)、[介護保険の案内](https://www.mhlw.go.jp/content/12300000/000362938.pdf)。7区分、認定過程、利用者負担を照合。原則30日は[自治体公式案内](https://www.city.okazaki.lg.jp/kenko/kourei/1003886/1012323/1003950/1003955.html)でも確認 |
| 11/9 | [警察庁の遺失物案内](https://www.npa.go.jp/bureau/soumu/ishitsubutsu/otoshimono/)。報労金5〜20%、施設内の扱い、3か月、引取期間・個人情報物件の例外 |
| 11/10 | [日本老年医学会](https://www.jpn-geriat-soc.or.jp/tool/tool_02)。HDS-Rの9項目・30点・20点以下・6〜10分、単独で診断を確定しないこと |
| 11/11 | 警察庁と[石川県警の施設占有者向け案内](https://www2.police.pref.ishikawa.lg.jp/information/information04/information010.html)。1週間・24時間・報労金の扱い。法令上の義務は速やかな返還・提出であり、1週間は権利喪失にも関係する期限。石川県警の同一ページ内「施設占有者の方へ」「提出書」で両方を確認済み。ユーザーの修正指示に基づき、本文でも両者を区別する2文に修正済み。確認事項は解消 |
| 11/12 | [IPAの写真位置情報解説](https://www.ipa.go.jp/security/10threats/ps6vr7000000auzz-att/yougoyashikumi_2022.pdf)と[岡山県の教材](https://www.pref.okayama.jp/uploaded/attachment/233419.pdf)。Exif/GPSと背景からの推測、SNSごとの差 |
| 11/13 | [警察庁統計](https://www.npa.go.jp/news/release/2026/20260625001.html)、[国家公安委員会会見](https://www.npsc.go.jp/pressconf_2026/06_25.htm)で17,345人・約95%を確認。[岡山県](https://www.pref.okayama.jp/page/407947.html)で2025/11/1時点9人・いずれも認知症またはその疑いなし、[岐阜県](https://www.pref.gifu.lg.jp/page/13791.html)で2025年12月末3人、[千葉県](https://www.pref.chiba.lg.jp/koufuku/shien/ninchishou/mimotohumei.html)で2026/9/1時点0人を照合。対象定義と調査時点は異なる |
| 11/14 | [日本愛玩動物協会報告p.6](https://www.jpc.or.jp/pdf/r7_02_report.pdf)で2,331件・48.0%・9.2%・42.7%を確認。[環境白書](https://www.env.go.jp/policy/hakusyo/r07/html/hj25020205.html)で2024年度末190万頭超、[環境省制度案内](https://www.env.go.jp/nature/dobutsu/aigo/pickup/chip.html)で制度・変更登録を確認。全国の犬だけの装着率とは区別 |
| 11/15 | 厚生労働省の介護保険案内と[第9期保険料資料](https://www.mhlw.go.jp/stf/newpage_40211.html)。月額6,225円は2024〜2026年度の全国加重平均基準額。年74,700円と負担例は原稿の計算どおり |

既存原稿との外部照合はPR #130を基準とした。別のChatGPT会話にある未提供版との同一性は確認できない。

## 予約公開の仕組みと制約

- `publishedTimestamp` を各日 `T08:00:00+09:00` として登録。UTCでは前日の23:00。例：11/8 08:00 JST = 11/7 23:00 UTC。
- 現行の公開セレクターは `status: published` でも時刻前は返さない。この既存方式を使うため、別途当日にJSONを書き換える処理は不要。
- ビルド時刻で公開対象を絞り、一覧・個別ルート・トップ最新記事・関連サービス/関連記事・sitemapが同じ公開集合を使用する。
- CIは `COLUMN_BUILD_AT` をUTCの実行時刻に固定し、Next.js生成とPythonの生成HTML検査で共有。時刻境界をまたぐ検査のずれを避ける。ローカルの日時シミュレーションにも使用する。タイムゾーンなし・不正値は拒否する。
- 定時処理は08:00、08:15、08:45 JST。main pushと手動実行も維持。main以外ではPagesビルド/公開ジョブを実行しない。
- cronはmainに入って初めて有効。GitHub Actionsの遅延・実行漏れ、ビルド・配信反映時間があるため08:00ちょうどの閲覧開始は保証できない。再実行もbest effort。
- 失敗時はActionsログを確認し、承認後にmainのworkflow_dispatchで再実行する。スケジュール実行の無効化（公開リポジトリの長期無活動等）にも注意。mainが未マージなら予約公開は始まらない。予定時刻後にマージした場合は、次のビルドで期限到来済みの記事がまとめて公開対象になる。
- 将来の本文は静的サイトのHTML/RSC/JS/XMLには含めない。公開GitHubリポジトリの原稿・public画像は秘密ではない。

## 検証

- `npm run test:columns`：既存原稿・公開ガード。
- `npm run test:scheduled-columns`：8本の全文、画像、各日08:00の1ms前/ちょうど/1ms後、UTC換算、未来記事と保留状態の除外、既存7件の不変。
- 時刻を固定した実ビルド：11/7公開前（既存7件）、11/8 08:00（8件）、11/15 08:00（15件）。
- 各生成物に `check:column-export`・`check:column-navigation`・静的SEO監査を実施。未来記事は個別HTMLもなく、全HTML/RSC/JS/XMLにタイトル・記事URLが出ないことを検査。
- 最終公開後は一覧が2ページになり、新旧記事がページ送りから到達できることも確認する。
- Chromiumによるスマートフォン・PC検査と画像寸法の確認を行う。本番への登録・公開操作は行わない。

## 2026-11-08 手動再デプロイ

2026-11-08 08:00 JSTの予約公開記事が本番で確認できないとの報告を受け、mainへのドキュメント更新pushによってGitHub Pagesの再ビルド・再デプロイを要求する。記事本文・画像・公開日時は変更しない。実際の公開完了はGitHub Actionsの成功および本番URLの確認が必要。
