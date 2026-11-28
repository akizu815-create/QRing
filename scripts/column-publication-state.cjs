const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {selectReleased,timestamp,publicationInstant}=require('../src/lib/columns/releasePolicy.js');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
function inventory(root=process.cwd()) {
 const records=JSON.parse(fs.readFileSync(path.join(root,'src/content/columns/published.json')));
 const held=new Map();const directory=path.join(root,'src/content/columns/revisions');
 if(fs.existsSync(directory))for(const name of fs.readdirSync(directory).sort()){
  const file=path.join(directory,name,'unpublished-drafts.json');
  if(fs.existsSync(file))for(const a of JSON.parse(fs.readFileSync(file)))if(!records.some(r=>r.id===a.id||r.slug===a.slug))held.set(a.slug,a);
 }
 return [...records,...held.values()];
}
function state(records,now,commit,root=process.cwd(),previewPending=false) {
 const articles=selectReleased(records,timestamp(now),previewPending).map(a=>{
  const image=a.image?hash(fs.readFileSync(path.join(root,'public',a.image.src))):null;
  return {slug:a.slug,revision:a.contentRevision,digest:hash(JSON.stringify(a)+'\n'+image)};
 }).sort((a,b)=>a.slug.localeCompare(b.slug));
 return {version:1,environment:previewPending?'preview':'production',commit,buildAt:now,contentDigest:hash(JSON.stringify(articles)),articles};
}
function writeExport(root,out,now,commit,previewPending=false) {
 const records=inventory(root),released=selectReleased(records,timestamp(now),previewPending);
 const future=records.filter(a=>!released.includes(a));
 const textFiles=[];function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(/\.(html|txt|js|json|xml)$/.test(p))textFiles.push(p);}}walk(out);
 const payloads=textFiles.map(file=>({file,data:fs.readFileSync(file,'utf8')}));
 // Detect unpublished identities/records. Shared service prose can legitimately
 // occur in more than one manuscript; do not reject a site for a common sentence.
 // Full body/summary isolation is additionally tested with independent canaries.
 for(const {file,data} of payloads){
  const decoded=data.replace(/\\u([0-9a-f]{4})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16))).replace(/\\"/g,'"');
  for(const a of future){
   const slugField=new RegExp('"slug"\\s*:\\s*"'+a.slug+'"');
   if(decoded.includes('/column/'+a.slug+'/')||slugField.test(decoded)||(!released.some(r=>r.title===a.title)&&decoded.includes(a.title)))throw new Error('Unpublished column leaked into '+path.relative(out,file)+': '+a.slug);
  }
 }
 // Only prune article-owned image copies, never source assets or shared/public images.
 for(const a of future)if(a.image?.src.startsWith('/images/columns/')&&!released.some(r=>r.image?.src===a.image.src)){
  if(payloads.some(p=>p.data.includes(a.image.src)))throw new Error('Unpublished image is referenced by a public page: '+a.slug);
  const file=path.join(out,a.image.src);if(fs.existsSync(file))fs.unlinkSync(file);
 }
 const value=state(records,now,commit,root,previewPending);
 fs.writeFileSync(path.join(out,'publication-state.json'),JSON.stringify(value)+'\n');return value;
}
module.exports={inventory,state,writeExport};
if(require.main===module){const now=process.env.COLUMN_BUILD_AT||new Date().toISOString();console.log(JSON.stringify(state(inventory(),now,process.env.COLUMN_SOURCE_SHA||process.env.GITHUB_SHA||'local')));}
