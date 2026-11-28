// Fix one real instant for Next.js and its public snapshot. Never advance time.
const {execFileSync}=require('node:child_process');
const {inventory,state,writeExport}=require('./column-publication-state.cjs');
const path=require('node:path');
const explicit=process.env.COLUMN_BUILD_AT;
const preview=process.env.CF_PAGES==='1' && !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH!=='main';
const commit=process.env.COLUMN_SOURCE_SHA||process.env.GITHUB_SHA||process.env.CF_PAGES_COMMIT_SHA||'local';
for(let attempt=0;attempt<2;attempt++){
 const cutoff=explicit||new Date().toISOString();
 execFileSync(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{stdio:'inherit',env:{...process.env,COLUMN_BUILD_AT:cutoff}});
 const result=writeExport(process.cwd(),path.join(process.cwd(),'out'),cutoff,commit,preview);
 if(explicit||preview||state(inventory(),new Date().toISOString(),commit).contentDigest===result.contentDigest){
  if(!explicit && process.env.GITHUB_ENV)require('node:fs').appendFileSync(process.env.GITHUB_ENV,'COLUMN_BUILD_AT='+cutoff+'\n');
  break;
 }
 if(attempt===1)throw new Error('A publication deadline crossed both builds; the next schedule will retry.');
}
