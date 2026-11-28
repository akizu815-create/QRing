// Exercise the real selectors at every JST/UTC boundary, without a new dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-schedule-'));
try {
  for (const name of ['types', 'publication', 'navigation']) {
    fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync('src/lib/columns/' + name + '.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
  }
fs.copyFileSync('src/lib/columns/releasePolicy.js', path.join(tmp, 'releasePolicy.js'));
  const {selectPublishedArticles, validateArticle} = require(path.join(tmp,'publication.js'));
  const {latestArticles, relatedArticles, columnPageCount} = require(path.join(tmp,'navigation.js'));
  const records = JSON.parse(fs.readFileSync('src/content/columns/published.json','utf8'));
  // Preserve publication history and image data; reviewed prose is checked against its revision receipt.
  const protectedKeys = ["id", "slug", "image", "editionDate", "publishedAt", "publishedTimestamp", "status", "publicationPending"];
  const protectedRecords = records.slice(0,7).map(a => Object.fromEntries(protectedKeys.filter(k => k in a).map(k => [k,a[k]])));
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(protectedRecords)).digest('hex'), '95d7d270d07ab93358fb1a50baec2c3ff8057e2369e3f75f2d9f0c8f81b385e3', 'Publication history and images must remain unchanged');
  require('node:child_process').execFileSync('python3', ['scripts/column_revision_support.py'], {stdio:'inherit'});
  const batch = records.filter(a=>a.publishedTimestamp?.match(/^2026-11-(?:0[89]|1[0-5])T/));
  assert.equal(batch.length,8);
  for (let i=0;i<8;i++) {
    const article=batch[i]; const day=8+i;
    assert.equal(article.publishedAt,`2026-11-${String(day).padStart(2,'0')}`);
    const expectedUtc = day===11 ? '2026-11-10T15:03:38.000Z' : day===12 ? '2026-11-11T20:52:51.000Z' : day===13 ? '2026-11-12T22:46:47.000Z' : day===14 ? '2026-11-13T17:22:05.000Z' : day===15 ? '2026-11-14T15:30:27.000Z' : `2026-11-${String(day-1).padStart(2,'0')}T23:00:00.000Z`;
    assert.equal(new Date(article.publishedTimestamp).toISOString(),expectedUtc);
    validateArticle(article);
    const raw=fs.readFileSync(article.approvalRecord.sourceFile,'utf8');
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), article.approvalRecord.sha256);
    assert(fs.existsSync('public'+article.image.src));
    assert(fs.statSync('public'+article.image.src).size<300000);
    assert.equal(article.image.width,1280);
    assert.equal(article.image.height,720);
    const at=Date.parse(article.publishedTimestamp);
    const before=selectPublishedArticles(records,at-1);
    assert(!before.some(a=>a.id===article.id));
    assert(!latestArticles(before).some(a=>a.id===article.id));
    for(const a of before)assert(!relatedArticles(a,before).some(a=>a.id===article.id));
    const due=selectPublishedArticles(records,at);
    assert.equal(article.status,'published');
    assert(due.some(a=>a.id===article.id));
    assert.equal(latestArticles(due)[0].id,article.id);
    assert.equal(selectPublishedArticles([article],at-1).length,0);
    assert.equal(selectPublishedArticles([article],at).length,1);
    assert.equal(selectPublishedArticles([article],at+1).length,1);
    const held={...article,status:'needs_revision',approvalRevision:null};
    assert.equal(selectPublishedArticles([held],Date.parse('2099-01-01'),{previewPending:true}).length,0);
  }
  assert.equal(selectPublishedArticles(records,Date.parse('2026-11-07T22:59:59Z')).length,7);
  assert.equal(selectPublishedArticles(records,Date.parse('2026-11-14T23:00:00Z')).length,15);
  assert.equal(columnPageCount(15),2);
  console.log('Scheduled batch: 8 JST/UTC boundaries; before/at/after; future/held exclusions; latest/related selection; images; publication history unchanged; amended text verified.');
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
