// Regression coverage for the authorized November revision, not a publish bypass.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
execFileSync('python3', ['scripts/column_revision_support.py'], { stdio: 'inherit' });
const records = JSON.parse(fs.readFileSync('src/content/columns/published.json', 'utf8'));
const draftFile = 'src/content/columns/revisions/20261128/unpublished-drafts.json';
const drafts = JSON.parse(fs.readFileSync(draftFile, 'utf8'));
const revisions = JSON.parse(fs.readFileSync('src/content/columns/revisions/20261128/manifest.json', 'utf8')).articles;
for (const a of [...records.filter(a => revisions.some(r => r.slug === a.slug)), ...drafts]) {
  assert.equal(a.sections.filter(s => s.title === '参考資料').length, 0, 'References have one dedicated footer');
  assert(a.sources.length > 0);
  const intro = [a.summary, ...(a.introduction || [])];
  assert.equal(new Set(intro).size, intro.length, a.slug + ': duplicate lead paragraph');
  assert.equal(new Set(a.sections.map(s => s.id)).size, a.sections.length, 'No duplicate section anchors');
  for (const s of a.sections) for (const b of s.blocks) {
    if (b.type === 'table') assert(b.rows.every(row => row.length === b.headers.length));
    if (b.type === 'link' && a.relatedService) assert.notEqual(b.href, a.relatedService.href, 'No repeated service link');
  }
}
const unknown = records.find(a => a.slug === 'unknown-calls');
assert(!unknown.introduction.some(t => unknown.summary.includes(t)), 'Nov16 summary/introduction duplication must not recur');
const retention = records.find(a => a.slug === 'lost-property-retention');
assert(retention.sections.some(s => JSON.stringify(s.blocks).includes('公告後3か月')));
assert.equal(retention.seoTitle, '忘れ物はいつまで保管する？店舗・警察の扱いと届出のルール');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-revisions-'));
try {
  for (const name of ['types', 'publication', 'navigation', 'serviceCta']) fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync('src/lib/columns/' + name + '.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
fs.copyFileSync('src/lib/columns/releasePolicy.js', path.join(tmp, 'releasePolicy.js'));
  const {selectPublishedArticles, validateArticle} = require(path.join(tmp, 'publication.js'));
  const {additionalServiceCta} = require(path.join(tmp, 'serviceCta.js'));
  for (const a of drafts) {
    validateArticle(a);
    for (const date of ['2026-11-28T23:00:00+09:00', '2026-11-30T09:00:00+09:00', '2099-01-01']) {
      assert.equal(selectPublishedArticles([a], Date.parse(date)).length, 0);
      assert.equal(selectPublishedArticles([a], Date.parse(date), {previewPending: true}).length, 0);
    }
    const active = records.find(p => p.slug === a.slug);
    if (active && ['published','scheduled'].includes(active.status)) {
      assert.equal(active.publicationPending, false);
      assert.equal(active.approvalRevision, active.contentRevision);
    }
  }
  for (const slug of ['dog-owner-voice', 'cat-owner-memory', 'pets-earthquake-prediction', 'disaster-family-contact', 'dementia-forgetfulness']) {
    const a = records.find(a => a.slug === slug);
    assert.equal(a.relatedService, null);
    assert.equal(additionalServiceCta(a), null, 'Do not reinsert a generic sales CTA into research/medical/emergency content');
  }
  assert.equal(revisions.length, 30);
} finally {fs.rmSync(tmp, {recursive: true, force: true});}
console.log('November quality: duplicate lead, reference/service deduplication, legal metadata, tables, stable anchors, draft guards and contextual CTA regressions passed.');
