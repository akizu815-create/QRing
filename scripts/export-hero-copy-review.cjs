// Static comparison documents only. Never emitted by the production main build.
const fs = require('node:fs');
const path = require('node:path');
const env = process.env;
const isBranchPreview = env.CF_PAGES === '1' && Boolean(env.CF_PAGES_BRANCH) && env.CF_PAGES_BRANCH !== 'main';
const enabled = env.CF_PAGES_BRANCH !== 'main' && (isBranchPreview || env.QRING_HERO_REVIEW === '1');
const dest = path.join('out', 'review', 'hero-copy');
const approvedCopyIsLive = fs.readFileSync('out/index.html', 'utf8').includes('data-home-hero-purpose');
if (!enabled || approvedCopyIsLive) {
  fs.rmSync(dest, { recursive: true, force: true });
  console.log('HERO comparison: skipped (not a branch preview/local review, or approved copy is already implemented).');
} else {
  const original = fs.readFileSync('out/index.html', 'utf8');
  const marker = original.indexOf('aria-labelledby="home-hero-title"');
  const end = original.indexOf('</section>', marker) + '</section>'.length;
  if (marker < 0 || end < marker) throw new Error('Cannot locate the existing HOME HERO.');
  const common = '<style>.hero-review-copy{display:none}@media(max-width:767px){.hero-review-copy{display:block;margin:0;padding:0 24px 16px;background:#f7f4ee;color:#4c4840;font-size:14px;line-height:1.8;text-align:center}}</style>';
  const copies = {
    a: '高齢者・ペット・落とし物に。',
    b: '高齢者・ペット・落とし物に。QRコードをスキャンして発信するだけ。お互いの電話番号は公開されません。',
  };
  fs.mkdirSync(dest, { recursive: true });
  for (const [variant, text] of Object.entries(copies)) {
    let html = original.slice(0, end) + `<p class="hero-review-copy" data-hero-review="${variant}">${text}</p>` + original.slice(end);
    // No hydration, analytics or interactive app behaviour in these static review snapshots.
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<link\b[^>]*(?:rel="modulepreload"|as="script")[^>]*>/g, '')
      .replace(/<meta\b[^>]*name="robots"[^>]*>/g, '')
      .replace(/<title>[\s\S]*?<\/title>/, `<title>HOME HERO ${variant.toUpperCase()}案｜比較資料</title>`)
      .replace('</head>', `<meta name="robots" content="noindex,nofollow">${common}</head>`);
    fs.writeFileSync(path.join(dest, `hero-${variant}.html`), html);
  }
  fs.writeFileSync(path.join(dest, 'index.html'), `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>HOME HERO A/B比較</title><style>body{margin:24px;font:14px/1.8 system-ui;color:#1f1a14;background:#f7f4ee}a{color:#3f4f36}button{padding:8px 12px;margin:8px 8px 8px 0;font:inherit}.grid{display:flex;gap:24px;flex-wrap:wrap}.frame{max-width:100%;overflow:auto}iframe{border:1px solid #d7d0c5;width:390px;height:850px;background:white}h1{font-size:24px}h2{font-size:18px}</style></head><body><h1>HOME HERO A/B比較</h1><p>A案を推奨。用途だけを補足し、操作説明は後続セクションに任せます。写真・メインコピー・表示範囲・CTAは変更していません。</p><p>承認前の静的比較資料です。アプリのHEROは変更していません。フォーム・メニュー・計測の動作確認用ではありません。</p><button type="button" onclick="size(390)">390px</button><button type="button" onclick="size(1280)">1280px</button><div class="grid"><section class="frame"><h2>A案：用途だけ</h2><p><a href="hero-a.html">A案を単独で開く</a></p><iframe title="HERO A案" src="hero-a.html"></iframe></section><section class="frame"><h2>B案：説明付き</h2><p><a href="hero-b.html">B案を単独で開く</a></p><iframe title="HERO B案" src="hero-b.html"></iframe></section></div><script>function size(width){document.querySelectorAll('iframe').forEach(frame=>frame.style.width=width+'px')}</script></body></html>`);
  console.log('HERO comparison: emitted under /review/hero-copy/ (noindex, preview-only).');
}
