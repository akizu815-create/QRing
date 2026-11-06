// Exercise the real pure TS guards without adding a test runtime dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-column-test-'));
try {
  for (const name of ['types', 'publication', 'navigation']) {
    fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync(path.join('src/lib/columns', name + '.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
  }
  const { selectPublishedArticles, toArticleCard, validateArticle } = require(path.join(tmp, 'publication.js'));
  const { latestArticles, columnPageCount, columnListPath, relatedArticles } = require(path.join(tmp, 'navigation.js'));
  assert.equal(columnPageCount(23), 3);
  assert.equal(columnListPath(1), '/column/');
  assert.equal(columnListPath(2), '/column/page/2/');
  assert.equal(columnListPath(2, '/column/audience/municipal/'), '/column/audience/municipal/page/2/');
  const { CATEGORIES, AUDIENCES } = require(path.join(tmp, 'types.js'));
  const records = JSON.parse(fs.readFileSync('src/content/columns/published.json', 'utf8'));
  assert.equal(latestArticles(records, { serviceHref: '/use-cases/pets/' }).length, 0);
  assert.deepEqual(latestArticles(records, { audience: 'municipal' }).map(a => a.slug), ['elderly-monitoring-contact-system']);
  assert.equal(relatedArticles(records[0], records)[0].id, records[1].id);
  const now = Date.parse('2026-11-05T12:00:00+09:00');
  assert(selectPublishedArticles(records, Date.parse('2026-11-06T12:00:00+09:00')).some(a => a.slug === 'elderly-monitoring-contact-system'));
  const clone = () => structuredClone(records[0]);
  assert.equal(CATEGORIES.length, 7); assert.equal(AUDIENCES.length, 3);
  assert.deepEqual(new Set(selectPublishedArticles(records, now).map(a => a.slug)), new Set(['elderly-monitoring', 'lost-item-preparation']));
  for (const status of ['draft', 'review', 'approved', 'scheduled', 'needs_revision', 'archived']) {
    const a = { ...clone(), id: status, slug: status, status };
    assert.equal(selectPublishedArticles([a], now).length, 0, status);
  }
  const future = { ...clone(), publishedAt: '2099-01-01' };
  assert.equal(selectPublishedArticles([future], now).length, 0);
  assert.throws(() => selectPublishedArticles([{ ...clone(), contentRevision: 2 }], now), /approval/);
  const editorial = { ...clone(), id: 'new-article', slug: 'new-article', publicationOrigin: 'editorial', approvalRevision: 1, primaryAudience: 'municipal', validationResults: [{ check: 'manual-review', passed: true }] };
  assert.equal(selectPublishedArticles([editorial], now).length, 1);
  assert.equal(selectPublishedArticles([editorial], now)[0].category, 'elderly-dementia', 'municipal selection is independent of category');
  assert.throws(() => selectPublishedArticles([{ ...editorial, approvalRevision: null }], now), /approval/);
  assert.throws(() => selectPublishedArticles([{ ...editorial, contentRevision: 2 }], now), /approval/);
  assert.throws(() => selectPublishedArticles([{ ...editorial, validationResults: [{ check: 'sources', passed: false }] }], now), /quality/);
  assert.throws(() => selectPublishedArticles([{ ...editorial, claims: [{ text: 'unverified', sourceIds: ['source-1'], verified: false }] }], now), /quality/);
  assert.throws(() => selectPublishedArticles([records[0], records[0]], now), /duplicate/);
  assert.throws(() => validateArticle({ ...clone(), category: 'bad' }), /category/);
  assert.throws(() => validateArticle({ ...clone(), slug: 'audience' }), /slug/);
  assert.throws(() => validateArticle({ ...clone(), publishedAt: '2026-02-30' }), /date/);
  const unsafe = clone(); unsafe.sections[0].blocks.push({ type: 'link', href: 'javascript:alert(1)', label: 'bad' });
  assert.throws(() => validateArticle(unsafe), /link/);
  const card = toArticleCard(records[0]);
  assert.deepEqual(Object.keys(card).sort(), ['id','slug','title','summary','category','primaryAudience','publishedAt'].sort());
  assert(!('sections' in card) && !('approvalRevision' in card));
  console.log('Column publication guards: all assertions passed (statuses, future date, revision approval, checks, independent audience/category, duplicates, safe content, client projection).');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
