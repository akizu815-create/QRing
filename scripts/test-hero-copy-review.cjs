const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-hero-review-'));
try {
  const generator = path.resolve('scripts/export-hero-copy-review.cjs');
  fs.mkdirSync(path.join(tmp, 'out'));
  const original = '<html><head><title>HOME</title><script>track()</script></head><body><main><section aria-labelledby="home-hero-title"><h1 id="home-hero-title">コピー</h1><img src="/images/hero.webp"></section><section id="home-solution">説明</section></main></body></html>';
  fs.writeFileSync(path.join(tmp,'out/index.html'),original);
  const run = values => execFileSync(process.execPath,[generator],{cwd:tmp,env:{...process.env,CF_PAGES:'',CF_PAGES_BRANCH:'',QRING_HERO_REVIEW:'',...values}});
  const dest=path.join(tmp,'out/review/hero-copy');
  run({}); assert(!fs.existsSync(dest));
  run({CF_PAGES:'1',CF_PAGES_BRANCH:'review/test'});
  assert(fs.readFileSync(path.join(dest,'hero-a.html'),'utf8').includes('data-hero-review="a"'));
  assert(fs.readFileSync(path.join(dest,'hero-b.html'),'utf8').includes('お互いの電話番号は公開されません。'));
  assert(!fs.readFileSync(path.join(dest,'hero-a.html'),'utf8').includes('<script'));
  assert(fs.readFileSync(path.join(dest,'hero-a.html'),'utf8').includes('noindex,nofollow'));
  assert.equal(fs.readFileSync(path.join(tmp,'out/index.html'),'utf8'),original);
  run({CF_PAGES:'1',CF_PAGES_BRANCH:'main',QRING_HERO_REVIEW:'1'});assert(!fs.existsSync(dest),'main must never emit review snapshots');
  run({QRING_HERO_REVIEW:'1'});assert(fs.existsSync(dest));
  const approved = original.replace('</section>', '<p data-home-hero-purpose>高齢者・ペット・落とし物に。</p></section>');
  fs.writeFileSync(path.join(tmp,'out/index.html'), approved);
  run({CF_PAGES:'1',CF_PAGES_BRANCH:'review/test'});
  assert(!fs.existsSync(dest), 'obsolete A/B snapshots must not duplicate approved HERO copy');
  assert.equal(fs.readFileSync(path.join(tmp,'out/index.html'),'utf8'), approved);
  console.log('HERO comparison: no main export, no root HTML mutation, no scripts, noindex, both candidates passed');
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
