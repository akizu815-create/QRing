# 中小企業ニューマーケット開拓支援事業：掲載管理

## 承認と公開の分離

承認済みは提出済みNEWS原稿とその掲載イメージ。NEWS詳細 `/news/newmarket-support/`、NEWS一覧、HOMEのNEWS一覧に掲載する。HOMEのNEWS一覧は記事への入口で、独立した実績紹介エリアとは区別する。

HOMEの実績紹介、SERVICE、自治体向け、法人コラボ向けの掲載方法は追加承認待ち。`preview/newmarket-placement-proposals` ブランチだけで制作し、本番用NEWSのPRには含めない。プレビューはURLを知る人が閲覧できる共有用で、承認済み本番掲載を意味しない。

## 原稿・管理設定

- 原稿・公開日・全掲載箇所：`src/content/newmarketSupport.ts`
- 本文3段落の表示：`src/components/NewmarketSupportCopy.tsx`
- 公開日：実際のNEWS公開日（日本時間）を `publishedOn` に設定。別日に公開する場合は公開前に更新して再ビルドする。
- 使用期限：ユーザー確認では最大2年間だが、現時点で期間は未確定。`endsOn` は未設定。公開日を支援開始日とみなさず、2年後を自動設定しない。
- 原稿にtrim・句読点補正・要約を適用しない。注意書きは本文と一緒に表示する。

## 支援終了時の対応

1. `NEWMARKET_SUPPORT.enabled` を `false` にする。
2. 本番ブランチだけでなく、掲載案ブランチにも同じ変更を反映する。
3. 再ビルド・デプロイする（静的HTMLなので、設定変更だけでは公開済みページは消えない）。
4. NEWS詳細は404、NEWS一覧の該当記事・HOMEのNEWS一覧・追加実績掲載は非表示、sitemapから記事URLを除外する。
5. 下記の検証を実行する。過去のCloudflareプレビューデプロイや、確認用に渡した画像にも文言が残るため、必要に応じてプレビューデプロイ削除・共有停止・検索キャッシュ対応を行う。

期限が確定したら `endsOn` に最終使用可能日（YYYY-MM-DD、日本時間）を設定できる。ただし期限による判定もビルド時だけ。期限後の再ビルド・デプロイは別途必要で、自動更新ジョブは今回設定していない。

## 掲載箇所一覧

| 区分 | URL | 内容 | 承認状態 |
|---|---|---|---|
| NEWS詳細 | /news/newmarket-support/ | タイトル・本文3段落・日付 | 承認済み |
| NEWS一覧 | /news/ | タイトル・本文3段落・詳細リンク | 承認済みNEWS |
| HOME NEWS一覧 | / | タイトル・日付・記事リンク | NEWS掲載の入口 |
| HOME実績紹介案 | / | FOR BUSINESSの直後に本文3段落 | 追加承認待ち |
| SERVICE掲載案 | /service/ | 最後のCTA手前に本文3段落 | 追加承認待ち |
| 自治体向け掲載案 | /municipalities/ | 最後の相談CTA手前に本文3段落 | 追加承認待ち |
| 法人コラボ向け掲載案 | /collaboration/ | 最後の問い合わせセクション手前に本文3段落 | 追加承認待ち |

追加掲載の承認後は掲載位置・表示方法を確認し、該当箇所だけ本番用PRへ移す。未承認箇所をまとめてマージしない。

## 検証

```sh
npm run build
python3 scripts/seo-audit.py --json /tmp/qring-seo.json --check
python3 scripts/check-newmarket-copy.py --mode news-only
# 掲載案ブランチは --mode proposals
# enabled:falseでの再ビルド後は --mode disabled
```

承認原稿の独立した照合文字列と、各HTMLの表示段落を比較する。全角括弧、半角スペース、注意書き末尾の句点がない点も比較対象とする。
