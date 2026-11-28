// Separate trigger detects missing/failed publisher runs. It cannot detect an
// outage of GitHub Actions itself; that requires an independent monitor.
function checkHeartbeat(runs, now, maxAgeMinutes=120) {
 const recent=runs.filter(r=>r.path==='.github/workflows/deploy.yml' && r.head_branch==='main' && ['schedule','push','workflow_dispatch'].includes(r.event));
 const good=recent.filter(r=>r.conclusion==='success').sort((a,b)=>Date.parse(b.updated_at)-Date.parse(a.updated_at))[0];
 if(!good || (now-Date.parse(good.updated_at))/60000>maxAgeMinutes)throw new Error('No successful publication reconciliation in the last '+maxAgeMinutes+' minutes. Check scheduling, queued jobs, failures and workflow_dispatch recovery.');
 return {lastVerifiedRun:good.id,lastVerifiedAt:good.updated_at};
}
module.exports={checkHeartbeat};
