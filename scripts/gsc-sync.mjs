// Private incremental input adapter for the EXISTING gsc-report.mjs.
// No browser credentials, no static output, no AI calls, no deployment hooks.
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { GoogleAuth } from 'google-auth-library';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1];};
const days=Number(arg('--days','7'));
if(!Number.isInteger(days)||days<1||days>400)throw new Error('--days must be 1..400');
const db=path.resolve(process.env.QRING_SEO_DB ?? path.join(root,'.qring-private/seo.sqlite'));
for(const dir of ['src','public','out'])if(db.startsWith(path.join(root,dir)+path.sep))throw new Error('Unsafe private DB path');
fs.mkdirSync(path.dirname(db),{recursive:true,mode:0o700});
const lock=db+'.sync.lock';
const maxCalls=Number(arg('--max-calls','120'));
if(!Number.isInteger(maxCalls)||maxCalls<1||maxCalls>2500)throw new Error('Invalid --max-calls');
let fd;
try{fd=fs.openSync(lock,'wx',0o600);}catch{throw new Error('Sync already running or stale lock. Inspect before removing it.');}
const runId=crypto.randomUUID();const startedAt=new Date().toISOString();
const persist=(bundle,failed=false)=>{
 const r=spawnSync('python3',['-m','scripts.seo_ops.cli',failed?'failure':'import','--db',db],{cwd:root,input:JSON.stringify(bundle),encoding:'utf8',maxBuffer:2e6});
 if(r.status!==0)throw new Error('Private data store rejected import; existing data retained');
};
const subtract=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')-n*86400000).toISOString().slice(0,10);
// GSC calendar dates are Pacific time, not UTC/Japan time.
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dimensions={site:[],device:['device'],page:['page'],query:['query'],page_query:['page','query'],page_device:['page','device']};
let calls=0;
try{
 const auth=new GoogleAuth({scopes:['https://www.googleapis.com/auth/webmasters.readonly']});const client=await auth.getClient();
 const request=async(data)=>{
  for(let attempt=0;attempt<3;attempt++){
   if(++calls>maxCalls)throw new Error('call_limit');
   try{const r=await client.request({url:'https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aqring.jp/searchAnalytics/query',method:'POST',data:{type:'web',dataState:'final',...data},retry:false,timeout:30000});return r.data;}
   catch(e){const status=e.response?.status;if(attempt===2||!(status===429||status>=500))throw e;await new Promise(r=>setTimeout(r,1000*2**attempt));}
  }
 };
 const probe=await request({startDate:subtract(today,10),endDate:today,dimensions:['date'],aggregationType:'byProperty',rowLimit:100});
 const dates=(probe.rows??[]).map(r=>r.keys[0]).sort();const latest=dates.at(-1);
 if(!latest)throw new Error('no_final_data');
 const cache=spawnSync('python3',['-m','scripts.seo_ops.cli','coverage','--db',db],{cwd:root,encoding:'utf8'});
 if(cache.status!==0)throw new Error('cache_read_failed');const cached=new Set(JSON.parse(cache.stdout));
 const slices=[];
 for(let n=days-1;n>=0;n--){
  const day=subtract(latest,n);
  if(n>=3&&cached.has(day))continue; // Retry recent final dates, do not refetch 6 months every day.
  const daily=[];
  for(const [dataset,dims] of Object.entries(dimensions)){
   const rows=[];let responseAggregation;let capped=false;
   for(let startRow=0;startRow<50000;startRow+=25000){
    const r=await request({startDate:day,endDate:day,dimensions:dims,aggregationType:dims.includes('page')?'byPage':'byProperty',rowLimit:25000,startRow});
    responseAggregation=r.responseAggregationType??responseAggregation;
    const part=r.rows??[];rows.push(...part);
    if(part.length<25000)break;
    if(startRow===25000)capped=true;
   }
   daily.push({day,dataset,aggregation:responseAggregation??(dims.includes('page')?'byPage':'byProperty'),capped,rows});
  }
  slices.push(...daily);
 }
 if(slices.length)persist({property:'sc-domain:qring.jp',runId,startedAt,fetchedAt:new Date().toISOString(),slices});
 console.log(JSON.stringify({state:'success',latestAvailableDate:latest,dateTimezone:'America/Los_Angeles',daysImported:slices.length/6,apiCalls:calls}));
}catch(e){
 const status=e.response?.status;const code=status?`google_http_${status}`:['call_limit','no_final_data','cache_read_failed'].includes(e.message)?e.message:'auth_or_sync_failed';
 try{persist({runId,startedAt,errorCode:code},true);}catch{}
 console.error(JSON.stringify({state:'failed',errorCode:code,existingDataRetained:true,apiCalls:calls}));process.exitCode=1;
}finally{if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock);}}
