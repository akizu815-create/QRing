// Deterministic release simulations only; never persist an approval into the registry.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-late-november-'));
try {
  for (const name of ['types', 'publication', 'navigation']) {
    fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync('src/lib/columns/' + name + '.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
  }
  const {selectPublishedArticles, validateArticle} = require(path.join(tmp, 'publication.js'));
  const {visibleArticleSections, relatedArticles, latestArticles} = require(path.join(tmp, 'navigation.js'));
  const records = JSON.parse(fs.readFileSync('src/content/columns/published.json', 'utf8'));
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(records.slice(0,16))).digest('hex'),
    '58ba5a6fb07c9e0df8be7c8ef7fb502fb68887a138ee77c40b20c42a135c89f0', 'All 16 existing articles remain byte-for-byte equivalent as data');
  const batch = records.slice(16);
  assert.equal(batch.length, 14);
  assert.equal(new Set(records.map(a => a.slug)).size, records.length);
  assert.equal(new Set(records.map(a => a.id)).size, records.length);
  const ids = new Set(records.map(a => a.id));
  for (let i = 0; i < batch.length; i++) {
    const a = batch[i];
    validateArticle(a);
    assert.equal(a.publishedTimestamp, `2026-11-${17+i}T08:00:00+09:00`);
    assert.equal(new Date(a.publishedTimestamp).toISOString(), `2026-11-${16+i}T23:00:00.000Z`);
    assert.equal(a.status, 'draft');
    assert.equal(a.publicationPending, true);
    assert.equal(a.approvalRevision, null);
    if (i<5) {
      assert.equal(a.image.src, `/images/columns/${a.slug}.webp`);
      assert.equal(a.image.width,1280); assert.equal(a.image.height,720);
      assert(fs.existsSync('public'+a.image.src));
      assert(a.image.alt.length>15);
      assert(fs.statSync('public'+a.image.src).size<300000);
    } else assert.equal(a.image, undefined, 'No substituted or invented artwork');
    assert.equal(a.validationResults.find(c=>c.check==='image-supplied').passed, i<5);
    assert.equal(a.validationResults.find(c=>c.check==='release-approved').passed, false);
    for (const id of a.relatedArticleIds) assert(ids.has(id), `${a.slug}: missing related id ${id}`);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(a.approvalRecord.sourceFile)).digest('hex'), a.approvalRecord.sha256);
    assert.equal(a.updatedAt, null, 'No invented post-publication update date');
  }
  for (const previewPending of [false, true]) {
    assert.equal(selectPublishedArticles(records, Date.parse('2027-01-01T00:00:00Z'), {previewPending}).length, 16, 'Held drafts remain private even in branch previews');
  }
  const simulated = records.map(a=>batch.includes(a) ? {...a,status:'published',publicationPending:false,approvalRevision:a.contentRevision,claims:a.claims.map(c=>({...c,verified:true})),validationResults:[{check:'LOCAL-SIMULATION-ONLY',passed:true}]} : a);
  for (const a of batch) {
    const at = Date.parse(a.publishedTimestamp);
    for (const now of [at-1, at, at+1, at+3600000]) {
      const published = selectPublishedArticles(simulated, now);
      assert.equal(published.some(b=>b.id===a.id), now>=at);
      assert.equal(new Set(published.map(b=>b.id)).size, published.length);
      const paths = new Set(published.map(b=>`/column/${b.slug}/`));
      for (const b of published) {
        for (const s of visibleArticleSections(b,published)) {
          for (const link of s.blocks.filter(c=>c.type==='link' && c.href.startsWith('/column/'))) assert(paths.has(link.href));
        }
        for (const related of relatedArticles(b,published)) assert(paths.has(`/column/${related.slug}/`));
      }
      if (now>=at) assert.equal(latestArticles(published)[0].id,a.id);
    }
  }
  assert.equal(selectPublishedArticles(simulated, Date.parse('2026-11-30T08:00:00+09:00')).length,30);
  console.log('14 held drafts; all JST/UTC before/at/after boundaries; no early body/related links; duplicate-free repeat builds; source hashes: passed.');
} finally {fs.rmSync(tmp, {recursive:true,force:true});}
