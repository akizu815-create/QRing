---
version: alpha
name: QRing
description: Premium minimalism — quiet earth tones, serif gravitas, slow reveal motion
colors:
  ivory: "#F7F4EE"
  cream: "#EFE9DD"
  sand: "#E2D7C2"
  ink: "#1F1A14"
  moss: "#5B6E4F"
  deepmoss: "#3F4F36"
  gold: "#B8954B"
  softgold: "#D6B97A"
typography:
  display:
    fontFamily: Cormorant Garamond, Noto Serif JP, serif
    fontSize: 5.5rem
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-italic:
    fontFamily: Cormorant Garamond, serif
    fontSize: 5.5rem
    fontWeight: 300
    fontStyle: italic
  h2-section:
    fontFamily: Cormorant Garamond, Noto Serif JP, serif
    fontSize: 2.5rem
    fontWeight: 300
    lineHeight: 1.2
  eyebrow:
    fontFamily: Noto Sans JP, system-ui, sans-serif
    fontSize: 0.6875rem
    fontWeight: 500
    letterSpacing: 0.3em
    textTransform: uppercase
  body-jp:
    fontFamily: Noto Sans JP, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 2
  label-caps:
    fontFamily: Noto Sans JP, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 500
    letterSpacing: 0.2em
    textTransform: uppercase
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 96px
  section: 160px
rounded:
  none: 0px
containers:
  wide: 1280px
  narrow: 960px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 16px 32px
    transitionDuration: 500ms
  button-primary-hover:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.ivory}"
  button-ghost:
    backgroundColor: transparent
    borderColor: "rgba(31,26,20,0.3)"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    padding: 16px 32px
    transitionDuration: 500ms
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
  feature-card:
    backgroundColor: "{colors.ivory}"
    borderTopColor: "rgba(31,26,20,0.1)"
    padding: 40px
    transitionDuration: 700ms
  feature-card-hover:
    borderTopColor: "{colors.moss}"
  service-card:
    backgroundColor: "{colors.ivory}"
    padding: 40px
    transitionDuration: 700ms
  service-card-hover:
    backgroundColor: "{colors.cream}"
  cta-banner:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    accentColor: "{colors.softgold}"
---

## Overview

QRing の視覚言語は「静かに、確かに、つなぐ」を体現する **プレミアム・ミニマリズム**。
低彩度のアースパレット、和文 × ラテンセリフの二層タイポグラフィ、スローモーションの
フェードインで、主張せず「そこにある」ブランド体験を構築する。彩度は極限まで抑え、
余白とディテールで上質さを語る。

## Colors

和紙・苔・土を想起させるアーストーン。鮮やかな色は一切使わない。

- **ivory (#F7F4EE):** すべての基底背景。純白より温かい生成り色
- **cream (#EFE9DD):** セクション背景。ivory との微差で面を切り替える
- **sand (#E2D7C2):** より沈んだ補助背景・テクスチャ
- **ink (#1F1A14):** 本文テキスト、プライマリボタン背景、CTA バナー。純黒を避けた墨色
- **moss (#5B6E4F):** 唯一の主役アクセント。アイブロウ、ホバー、強調語に限定使用
- **deepmoss (#3F4F36):** moss のホバー深化
- **gold / softgold (#B8954B / #D6B97A):** ハイライト。CTA バナーの放射グロー、限定的な装飾

色で意味を持たせるのは moss（アクション・強調）のみ。それ以外は中立トーンで構成する。

## Typography

和文の余韻とラテンセリフのエレガンスを共存させる二層構造。weight は軽く（300 中心）、
トラッキングは広く取り、ラグジュアリーな静けさを生む。

- **display:** Cormorant Garamond + Noto Serif JP、weight 300、leading 1.15。ヒーロー・大見出し
- **display-italic:** Cormorant Garamond italic。英語の表情語（`connect.` 等）に使用
- **h2-section:** セクション見出し。serif 300
- **eyebrow:** 11px、tracking 0.3em、uppercase、moss 色。各セクション冒頭のラベル（`— Concept`）
- **body-jp:** Noto Sans JP、leading 2.0、ink/80（20% 透過）。和文本文は行間を広く
- **label-caps:** ボタン・リンクの英字ラベル。tracking 0.2em、uppercase

`font-feature-settings: "palt"` で和文の詰めを最適化、`antialiased` を全面適用する。

## Layout

8px を基本単位とするスケール。セクション間は 96〜160px と大きく取り、余白で呼吸させる。

- **container-wide (1280px):** 標準コンテンツ幅。px-6 / md:px-10 / lg:px-16
- **container-narrow (960px):** 読み物・集中させたいコピー
- グリッドは 12 カラム。カード群は `gap-px bg-ink/10` で 1px のヘアラインを引いて区切る

## Components

すべて角丸なし（`rounded: 0`）の直線的フォルム。ホバーは 500〜700ms のゆったりした遷移。

- **button-primary:** ink 背景 → hover で moss。ivory テキスト、tracking 0.2em
- **button-ghost:** border ink/30 → hover で ink 塗りつぶし + ivory テキスト
- **feature-card:** 上辺ボーダー ink/10 → hover で moss。番号は serif の moss
- **service-card:** ivory → hover で cream。1px グリッドギャップで区切る
- **cta-banner:** ink 背景、softgold の放射グローを 20% 不透明度で重ねる
- **link-underline:** `scaleX(0→1)`、origin right→left の下線アニメーション（500ms）
- **hairline:** 幅 48px / 高さ 1px / moss/60 の区切り装飾

## Motion & Texture

控えめでスロー。要素は「現れる」のであって「飛び込まない」。

- **fade-up:** translateY(24px)→0、1.2s ease-out。主要要素の登場
- **fade-in:** opacity 0→1、1.6s ease-out
- **slow-zoom:** scale 1.08→1.0、14s ease-out。ヒーロービジュアルの背景
- **Reveal:** IntersectionObserver でビューイン時に fade-up。`delay = i × 80〜120ms` の段階表示
- **grain:** opacity 0.08 / mix-blend-mode multiply の 3px ドットでテクスチャを付与
- selection: moss/20、scroll-behavior: smooth
