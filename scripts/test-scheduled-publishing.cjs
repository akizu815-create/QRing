const assert=require('node:assert/strict'),fs=require('node:fs');
const {selectReleased,publicationInstant,timestamp}=require('../src/lib/columns/releasePolicy.js');
const {checkPacket,monthlyInventory}=require('./column-month.cjs');
const {checkHeartbeat}=require('./check-publication-watchdog.cjs');
const existing=JSON.parse(fs.readFileSync('src/content/columns/published.json'));
for(const a of existing)if(a.image){
 const actual=require('./column-image-size.cjs')(fs.readFileSync('public'+a.image.src));
 assert.deepEqual(actual,[a.image.width,a.image.height],a.slug+': stored illustration dimensions');
}
function article(day,index=day){const a=structuredClone(existing[0]);delete a.contentFormat;delete a.approvalRecord;
 return {...a,id:'private-schedule-test-'+index,slug:'private-schedule-test-'+index,title:'PRIVATE_SCHEDULE_TEST_'+index,seoTitle:'PRIVATE_SCHEDULE_TEST_'+index,
 summary:'PRIVATE_SCHEDULE_SUMMARY_'+index,introduction:[],sections:[{id:'test',title:'Test-only fixture',blocks:[{type:'paragraph',text:'PRIVATE_SCHEDULE_BODY_'+index}]}],
 status:'scheduled',publicationPending:false,publishedAt:`2026-12-${String(day).padStart(2,'0')}`,publishedTimestamp:`2026-12-${String(day).padStart(2,'0')}T08:00:00+09:00`,editionDate:`2026-12-${String(day).padStart(2,'0')}`,updatedAt:null,
 contentRevision:1,approvalRevision:1,relatedArticleIds:[],relatedLinks:[],relatedService:null,claims:[],validationResults:[{check:'test-fixture-only',passed:true}]};}
for(const instant of ['2026-12-01T08:00:00+09:00','2027-01-01T00:00:00+09:00','2026-12-01T00:00:00+09:00','2026-12-01T00:00:00Z']){
 const a={...article(1),publishedAt:instant.slice(0,10),publishedTimestamp:instant};const at=timestamp(instant);
 for(const delta of [-86400000,-1,0,1])assert.equal(selectReleased([a],at+delta).length,delta<0?0:1,instant+' '+delta);
 assert.equal(selectReleased([{...a,status:'draft',approvalRevision:null}],at+86400000).length,0);
 assert.equal(selectReleased([{...a,publicationPending:true}],at+86400000).length,0);
 assert.throws(()=>selectReleased([{...a,approvalRevision:null}],at),/approval/);
 assert.throws(()=>selectReleased([{...a,validationResults:[{check:'bad',passed:false}]}],at),/quality/);
}
assert.throws(()=>timestamp('2026-12-01'),/timezone/);
assert.throws(()=>publicationInstant({...article(1),publishedTimestamp:'2026-12-01T08:00:00'}),/timezone/);
assert.throws(()=>publicationInstant({...article(1),publishedAt:'2026-02-30',publishedTimestamp:undefined}),/date/);
assert.equal(selectReleased([],Date.now()).length,0);
const previewOnly={...article(1),status:'approved',publicationPending:true};
assert.equal(selectReleased([previewOnly],timestamp('2026-11-28T00:00:00Z')).length,0);
assert.equal(selectReleased([previewOnly],timestamp('2026-11-28T00:00:00Z'),true).length,1);
assert.equal(selectReleased([{...article(1),publicationPending:true}],timestamp('2026-12-02T00:00:00Z'),true).length,0,'Scheduled holds are not preview approvals');
assert.equal(selectReleased([article(1)],timestamp('2026-11-28T00:00:00Z'),true).length,0,'Scheduled dates remain gated in preview');
const {state}=require('./column-publication-state.cjs');
assert.equal(state([previewOnly],'2026-11-28T00:00:00Z','test').articles.length,0);
assert.equal(state([previewOnly],'2026-11-28T00:00:00Z','test',process.cwd(),true).environment,'preview');
const two=[article(1),article(1,99)];assert.equal(selectReleased(two,timestamp('2026-12-01T08:00:00+09:00')).length,2);
assert.equal(selectReleased([article(1)],timestamp('2026-12-02T09:00:00+09:00')).length,1,'Catch yesterday\'s missed article');
assert.throws(()=>selectReleased([article(1),article(1)],Date.parse('2027-01-01')),/duplicate/);
const month=Array.from({length:31},(_,i)=>article(i+1));
assert.deepEqual(checkPacket(month,'2026-12',existing),{month:'2026-12',articles:31,dates:31,images:31,uniqueImages:1,approvedArticles:31,scheduledArticles:31,missingDates:[],duplicateDates:[],missingTimestamps:[],duplicateTimestamps:[],nonDefaultTimes:[],reviewFieldsConsistent:true});
assert.throws(()=>checkPacket([{...month[0],image:{...month[0].image,width:1}},...month.slice(1)],'2026-12',existing),/Image dimensions/);
assert.throws(()=>checkPacket(month.slice(1),'2026-12',existing),/Missing scheduled/);
assert.throws(()=>checkPacket([{...month[0],status:'draft'},...month.slice(1)],'2026-12',existing),/scheduled/);
assert.throws(()=>checkPacket([{...month[0],approvalRevision:null},...month.slice(1)],'2026-12',existing),/Unapproved/);
assert.throws(()=>checkPacket([month[0],...month],'2026-12',existing),/Duplicate/);
assert.throws(()=>checkPacket([...month,article(1,99)],'2026-12',existing),/duplicate\/non-08:00/);
assert.throws(()=>checkPacket([{...month[0],publishedTimestamp:'2026-12-01T09:00:00+09:00'},...month.slice(1)],'2026-12',existing),/non-08:00/);
const inventory=monthlyInventory([{...month[0],image:undefined,approvalRevision:null,publicationPending:true,publishedTimestamp:undefined},...month.slice(1)],'2026-12');
assert.equal(inventory.images,30);assert.equal(inventory.approvedArticles,30);assert.equal(inventory.scheduledArticles,30);assert.equal(inventory.missingTimestamps.length,1);
const now=Date.parse('2026-12-01T01:00:00Z');const run={id:1,path:'.github/workflows/deploy.yml',head_branch:'main',event:'schedule',conclusion:'success',updated_at:'2026-12-01T00:30:00Z'};
assert.equal(checkHeartbeat([run],now).lastVerifiedRun,1);
for(const runs of [[],[{...run,conclusion:'failure'}],[{...run,head_branch:'other'}],[{...run,updated_at:'2026-11-30T01:00:00Z'}]])assert.throws(()=>checkHeartbeat(runs,now),/No successful/);
console.log('Scheduled publishing: JST/UTC/day/month/year boundaries, two same-day articles, catch-up, holds, invalid clocks/approvals, complete December packet and watchdog passed. No real article was created or published.');
