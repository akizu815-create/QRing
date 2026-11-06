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
  const { CATEGORIES, AUDIENCES, articlePublicationDate, articleDisplayDate, comparePublicationDates, articlePublishedTime, articleModifiedTime } = require(path.join(tmp, 'types.js'));
  const records = JSON.parse(fs.readFileSync('src/content/columns/published.json', 'utf8'));
  const suppliedBatch = [
    ['dementia-early-signs', '2026-11-03', 'elderly-dementia'],
    ['senior-care-facility-types', '2026-11-04', 'business-safety'],
    ['school-contact-list-privacy', '2026-11-05', 'privacy-life'],
  ];
  assert.equal(new Set(records.map(a => a.slug)).size, records.length, 'No duplicate registered URLs');
  for (const [slug, editionDate, category] of suppliedBatch) {
    const a = records.find(a => a.slug === slug);
    const source = fs.readFileSync(a.approvalRecord.sourceFile, 'utf8');
    const supplied = source.split('\n').filter(line => line.trim()).map(line => line.replace(/^#{1,3} |^\* /, ''));
    const rendered = [a.title, a.summary, ...a.introduction, ...a.sections.flatMap(s => [s.title, ...s.blocks.flatMap(b => b.type === 'list' ? b.items : [b.type === 'link' ? b.label : b.text])])];
    assert.deepEqual(rendered, supplied, `${slug}: preserve the full manuscript, including reference URLs`);
    assert.equal(require('node:crypto').createHash('sha256').update(source).digest('hex'), a.approvalRecord.sha256);
    assert.equal(a.editionDate, editionDate);
    assert.equal(a.category, category);
    assert.equal(a.cta, 'none');
    assert.equal(a.relatedService, null);
    assert.equal(a.reviewedAt, null, 'No invented representative review date');
    assert.equal(a.approvalRecord.approvedOn, undefined);
    const pending = { ...a, status: 'approved', publicationPending: true };
    assert.equal(selectPublishedArticles([pending], Date.parse('2099-01-01')).length, 0);
    assert.equal(selectPublishedArticles([pending], Date.parse('2026-11-07'), { previewPending: true }).length, 1);
    assert.deepEqual(toArticleCard(a).image, a.image);
  }
  const suppliedDog = records.find(a => a.slug === 'lost-dog-preparation');
  const suppliedDogText = fs.readFileSync(suppliedDog.approvalRecord.sourceFile, 'utf8');
  const suppliedLines = suppliedDogText.split('\n').filter(line => line.trim() && line !== '---').map(line => line.replace(/^#{1,3} |^\* /, ''));
  const dogLines = [suppliedDog.title, suppliedDog.summary, ...suppliedDog.introduction, ...suppliedDog.sections.flatMap(s => [s.title, ...s.blocks.flatMap(b => b.type === 'list' ? b.items : [b.text])]), '関連サービス', suppliedDog.relatedService.label, '参考資料', ...suppliedDog.sources.map(s => s.label)];
  assert.deepEqual(dogLines, suppliedLines, 'Every supplied heading, paragraph, list item and reference must be preserved in order');
  assert.equal(require('node:crypto').createHash('sha256').update(suppliedDogText).digest('hex'), suppliedDog.approvalRecord.sha256);
  assert.equal(suppliedDog.reviewedAt, null, 'Do not fabricate a representative review date');
  assert.equal(suppliedDog.approvalRecord.approvedOn, undefined, 'Only the receipt date is known');
  if (suppliedDog.publicationPending) assert.equal(suppliedDog.publishedTimestamp, undefined, 'The deployment timestamp is not known yet');
  assert.equal(suppliedDog.editionDate, '2026-11-07');
  const pendingDog = { ...suppliedDog, status: 'approved', publicationPending: true };
  assert(!selectPublishedArticles([pendingDog], Date.parse('2099-01-01')).some(a => a.id === suppliedDog.id), 'Awaiting deployment approval stays private even after the planned date');
  assert(selectPublishedArticles([pendingDog], Date.parse('2026-11-06'), { previewPending: true }).some(a => a.id === suppliedDog.id));
  assert(!selectPublishedArticles([{ ...pendingDog, status: 'draft' }], Date.parse('2026-11-06'), { previewPending: true }).length);
  assert.throws(() => selectPublishedArticles([{ ...pendingDog, approvalRevision: null }], Date.parse('2026-11-06'), { previewPending: true }), /approval/);
  const november6 = records.find(a => a.slug === 'elderly-monitoring-contact-system');
  assert.deepEqual(toArticleCard(november6).image, november6.image, 'Illustrations must reach cards regardless of manuscript format');
  assert.deepEqual(toArticleCard(suppliedDog).image, suppliedDog.image);
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
  const future = { ...clone(), publishedAt: '2099-01-01', publishedTimestamp: '2099-01-01T00:00:00+09:00' };
  assert.equal(selectPublishedArticles([future], now).length, 0);
  assert.throws(() => selectPublishedArticles([{ ...clone(), contentRevision: clone().contentRevision + 1 }], now), /approval/);
  const editorial = { ...clone(), id: 'new-article', slug: 'new-article', publicationOrigin: 'editorial', contentRevision: 1, approvalRevision: 1, primaryAudience: 'municipal', validationResults: [{ check: 'manual-review', passed: true }] };
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
  assert.deepEqual(Object.keys(card).sort(), ['id','slug','title','summary','category','primaryAudience','publishedAt','publishedTimestamp','editionDate','image'].sort());
  assert.equal(articlePublicationDate(records[0]), '2026-10-28');
  assert.equal(records[0].publishedAt, '2026-10-28');
  assert.equal(selectPublishedArticles(records, Date.parse('2026-11-06T12:00:00+09:00'))[1].slug, 'lost-item-preparation');
  assert.throws(() => validateArticle({ ...clone(), editionDate: '2026-02-30' }), /edition date/);
  assert.throws(() => validateArticle({ ...clone(), publishedTimestamp: '2026-11-01T00:00:00+09:00' }), /timestamp/);
  validateArticle({ ...clone(), status: 'draft', reviewedAt: null, approvalRevision: null });
  assert.throws(() => validateArticle({ ...clone(), approvalRecord: { ...clone().approvalRecord, approvedOn: '2026-02-30' } }), /approval record/);
  assert.throws(() => validateArticle({ ...clone(), approvalRecord: { ...clone().approvalRecord, sha256: 'invalid' } }), /approval record/);
  assert.equal(articleDisplayDate(card), '2026-11-01');
  assert.equal(articleDisplayDate(records[1]), '2026-11-02');
  const pendingLegacy = { ...clone(), publicationOrigin: 'existing', contentRevision: 1, approvalRevision: null };
  assert.throws(() => selectPublishedArticles([pendingLegacy], now), /approval/);
  const changedEditorialDates = records.map(a => ({ ...a, updatedAt: '2099-01-01' }));
  assert.deepEqual(latestArticles(changedEditorialDates).map(a=>a.id), latestArticles(records).map(a=>a.id), 'Updates must never reorder approved article dates');
  const scheduledTime = { ...clone(), publishedAt: '2026-11-05', publishedTimestamp: '2026-11-05T18:00:00+09:00' };
  assert.equal(selectPublishedArticles([scheduledTime], now).length, 0, 'Known future publication time must not leak');
  assert.equal(articlePublishedTime({ publishedAt: '2026-10-28' }), '2026-10-28', 'Do not invent midnight when no time is known');
  assert.equal(articleModifiedTime({ updatedAt: '2026-11-06' }), '2026-11-06');
  assert(comparePublicationDates({ slug:'early', publishedAt:'2026-11-06',publishedTimestamp:'2026-11-06T09:00:00+09:00' }, { slug:'late', publishedAt:'2026-11-06',publishedTimestamp:'2026-11-06T10:00:00+09:00' }) > 0);
  assert.throws(() => validateArticle({ ...clone(), relatedLinks: [{ href: 'javascript:alert(1)', label: 'bad' }] }), /related links/);
  assert(!('sections' in card) && !('approvalRevision' in card));
  console.log('Column publication guards: all assertions passed (statuses, future date, revision approval, checks, independent audience/category, duplicates, safe content, client projection).');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
