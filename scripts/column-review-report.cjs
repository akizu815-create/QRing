// Local editorial inventory only; no network calls, edits, generation or publication.
const fs = require('node:fs');
const args = process.argv.slice(2);
const value = (flag) => { const i = args.indexOf(flag); return i < 0 ? undefined : args[i + 1]; };
const asOf = value('--as-of') ?? new Date().toISOString().slice(0,10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !Number.isFinite(Date.parse(asOf))) throw new Error('Invalid --as-of date');
const serviceVersion = value('--service-version');
const articles = JSON.parse(fs.readFileSync('src/content/columns/published.json', 'utf8'));
const report = articles.filter(a => a.status === 'published').map(a => {
  const reasons=[];
  if (!a.nextReviewAt || a.nextReviewAt <= asOf) reasons.push('定期確認期限');
  if (serviceVersion && a.serviceSpecificationVersion !== serviceVersion) reasons.push('サービス仕様版の差分');
  if (a.sources.some(s => !s.checkedAt || Date.parse(asOf) - Date.parse(s.checkedAt) >= 90 * 86400000)) reasons.push('出典の再確認期限（90日）');
  return { id:a.id, url:`/column/${a.slug}/`, audience:a.primaryAudience, nextReviewAt:a.nextReviewAt, reasons };
});
console.log(JSON.stringify({ asOf, serviceVersion:serviceVersion ?? '未指定', note:'制度改正・統計改定・リンク切れの自動検知は第2段階。出典確認日が新しいことは内容の最新性を保証しません。', needsReview: report.filter(r=>r.reasons.length), totalPublished:report.length },null,2));
