// Shared by Next.js, export checks and the dependency-free deployment verifier.
// No wall-clock reads here: callers pass one explicit instant for each operation.
const zonedTimestamp = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
function timestamp(value) {
  if (typeof value !== 'string' || !zonedTimestamp.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value.slice(0,10)).toISOString().slice(0,10) !== value.slice(0,10)) throw new Error('Publication timestamp requires an explicit timezone');
  return Date.parse(value);
}
function publicationInstant(article) {
  const day = article.publishedAt;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day)) || new Date(day).toISOString().slice(0, 10) !== day) throw new Error('Invalid publication date');
  if (article.publishedTimestamp && !article.publishedTimestamp.startsWith(day + 'T')) throw new Error('Publication timestamp/date mismatch');
  return timestamp(article.publishedTimestamp || day + 'T00:00:00+09:00');
}
function eligibleState(article, previewPending = false) {
  return !!article && (article.status === 'published' || article.status === 'scheduled' || (previewPending && article.status === 'approved' && article.publicationPending === true));
}
function selectReleased(records, now, previewPending = false) {
  if (!Number.isFinite(now)) throw new Error('Invalid publication clock');
  const result = [], ids = new Set(), slugs = new Set();
  for (const article of records) {
    if (!eligibleState(article, previewPending)) continue;
    if (!article.id || !article.slug || ids.has(article.id) || slugs.has(article.slug)) throw new Error('duplicate or invalid article identity');
    ids.add(article.id); slugs.add(article.slug);
    const due = publicationInstant(article);
    const approvedPreview = previewPending && article.status === 'approved' && article.publicationPending === true;
    if (article.publicationPending && !approvedPreview) continue;
    if (!approvedPreview && due > now) continue;
    if (!Number.isInteger(article.contentRevision) || article.contentRevision < 1 || article.approvalRevision !== article.contentRevision) throw new Error(article.slug + ': missing/stale revision approval');
    if (!Array.isArray(article.claims) || !article.claims.every(c => c.verified === true) || !Array.isArray(article.validationResults) || !article.validationResults.length || !article.validationResults.every(c => c.passed === true)) throw new Error(article.slug + ': unresolved quality checks');
    result.push(article);
  }
  return result;
}
module.exports = { timestamp, publicationInstant, eligibleState, selectReleased };
