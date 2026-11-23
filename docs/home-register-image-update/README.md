# HOME 登録者STEP 01・02画像更新

基点main `db34e53`（PR #156マージ済み）。登録者の2画像だけを最新の提供原本へ変更する。Draftで確認し、承認なくマージ・本番公開しない。

| 対象 | 旧参照 | 新参照 | 新しい原本 |
| --- | --- | --- | --- |
| 登録STEP 01 | `how-register-scan-a870f12eb6ca.jpg` | `how-register-scan-479d85a78ee1.jpg` | `1-写真1.jpg`、1280×853、64,700 bytes |
| 登録STEP 02 | `how-register-account-4226bab9bcda.jpg` | `how-register-account-9a67a5009767.jpg` | `2-写真2.jpg`、1280×853、74,128 bytes |

保存先はすべて `public/images/`。mainの旧ファイルは保持し、新しい内容ハッシュ付きファイル名により旧キャッシュと区別する。添付原本のコピーのみで、生成・加工・色調変更・トリミング・形式変換・圧縮はしない。

今回の2枚はいずれも1280×853の原本。既存の共通表示枠と `object-fit: contain` で比率を保持し、被写体を切り取らない。他3画像・文章・alt・CSS・SERVICE・SEO・仕様は変更しない。実装ファイルは画像URL2箇所のみであることをmainとの差分で確認する。

## 検証

- build / test:columns / test:scheduled-columns / check:column-export / check:column-navigation 成功。
- 320/375/390/430/768/1280pxで指定5画像の対応、読み込み、縦／横並び、contain、横スクロールなしを確認。
- 添付原本と追加2ファイルのバイト一致を確認。
- 全静的HTMLの比較で、HOME使い方以外のmain DOM、SERVICE等の他ページ、SEO title・description・canonical・構造化データを維持。
- [390px全体](screenshots/how-390.jpg) ／ [1280px全体](screenshots/how-1280.jpg)。ローカル静的出力で撮影。外部Webフォントは遮断して既存フォールバックを使用。外部への計測通信は遮断。

詳細は `validation.json`。プレビューURLはDraft PR本文へ記録。
