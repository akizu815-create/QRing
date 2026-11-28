// Validate/apply a reviewed monthly packet locally. No generation, approval,
// commit, push, workflow dispatch, network access or production changes.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const {selectReleased,publicationInstant}=require('../src/lib/columns/releasePolicy.js');
function checkPacket(articles,month,existing,root=process.cwd(),requireCoverage=true) {
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))throw new Error('Use --month YYYY-MM');
 if(!Array.isArray(articles)||!articles.length)throw new Error('Packet must be a nonempty Article array');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qring-month-'));
 try{
  for(const name of ['types','publication'])fs.writeFileSync(path.join(tmp,name+'.js'),ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/lib/columns',name+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
  fs.copyFileSync(path.join(__dirname,'../src/lib/columns/releasePolicy.js'),path.join(tmp,'releasePolicy.js'));
  const {validateArticle}=require(path.join(tmp,'publication.js'));
  const ids=new Set(existing.map(a=>a.id)),slugs=new Set(existing.map(a=>a.slug));
  for(const a of articles){
   validateArticle(a);
   if(ids.has(a.id)||slugs.has(a.slug))throw new Error('Duplicate/existing article: '+a.slug);
   ids.add(a.id);slugs.add(a.slug);
   if(a.status!=='scheduled'||a.publicationPending!==false||a.publicationOrigin!=='editorial')throw new Error('Monthly articles require scheduled / publicationPending=false / editorial');
   if(!a.publishedAt.startsWith(month+'-')||!a.publishedTimestamp?.endsWith('+09:00'))throw new Error('Scheduled time must use the requested month and +09:00');
   publicationInstant(a);
   if(a.approvalRevision!==a.contentRevision||!a.validationResults.length||a.validationResults.some(r=>!r.passed)||a.claims.some(c=>!c.verified))throw new Error('Unapproved revision or unresolved review: '+a.slug);
   if(!a.image||!a.image.src.startsWith('/images/columns/'))throw new Error('An article image and alt/dimensions are required');
   const image=fs.readFileSync(path.join(root,'public',a.image.src));
   const dimensions=require('./column-image-size.cjs')(image);
   if(dimensions[0]!==a.image.width||dimensions[1]!==a.image.height)throw new Error('Image dimensions differ from metadata: '+a.slug);
   if(a.approvalRecord){const raw=fs.readFileSync(path.join(root,a.approvalRecord.sourceFile));if(crypto.createHash('sha256').update(raw).digest('hex')!==a.approvalRecord.sha256)throw new Error('Manuscript receipt mismatch: '+a.slug);}
  }
  const days=new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5)),0)).getUTCDate();
  if(requireCoverage)for(let day=1;day<=days;day++)if(!articles.some(a=>a.publishedAt===month+'-'+String(day).padStart(2,'0')))throw new Error('Missing scheduled date: '+month+'-'+day);
  selectReleased([...existing,...articles],Date.parse(month+'-01T00:00:00+09:00'));
  // Check all approvals, even for articles whose planned date is still ahead.
  selectReleased(articles,Date.parse('9999-12-31T23:59:59Z'));
  return {month,articles:articles.length,dates:days,reviewFieldsConsistent:true};
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
module.exports={checkPacket};
if(require.main===module){try{
 const arg=k=>{const i=process.argv.indexOf(k);return i<0?undefined:process.argv[i+1]};
 const month=arg('--month'),file=arg('--file');if(!file||!month)throw new Error('Usage: node scripts/column-month.cjs --month 2026-12 --file /path/to/reviewed-packet.json [--apply]');
 const registry=path.join(process.cwd(),'src/content/columns/published.json');const original=fs.readFileSync(registry,'utf8');
 const existing=JSON.parse(original),packet=JSON.parse(fs.readFileSync(file));const report=checkPacket(packet,month,existing);
 if(process.argv.includes('--apply')){if(fs.readFileSync(registry,'utf8')!==original)throw new Error('Registry changed while validating');fs.writeFileSync(registry,JSON.stringify([...existing,...packet],null,2)+'\n');}
 console.log(JSON.stringify({...report,applied:process.argv.includes('--apply')},null,2));
 }catch(e){console.error(e.message);process.exitCode=1;}}
