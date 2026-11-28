"""Read-only convergence check: rebuild only when source/public content is stale."""
import datetime as dt
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('live',ROOT/'scripts/check-live-columns.py')
live=importlib.util.module_from_spec(spec);sys.modules['live']=live;spec.loader.exec_module(live)

def inventory():
    records=json.loads((ROOT/'src/content/columns/published.json').read_text())
    for file in sorted((ROOT/'src/content/columns/revisions').glob('*/unpublished-drafts.json')):
        for a in json.loads(file.read_text()):
            if not any(r['id']==a['id'] or r['slug']==a['slug'] for r in records):records.append(a)
    return records

def expected_state(sha,now):
    r=subprocess.run(['node','scripts/column-publication-state.cjs'],cwd=ROOT,
        env=dict(os.environ,COLUMN_BUILD_AT=now.isoformat(),COLUMN_SOURCE_SHA=sha),capture_output=True,text=True,check=True)
    return json.loads(r.stdout)

def decide(expected,remote,force=False):
    if force:return 'build','manual recovery requested'
    if not isinstance(remote,dict) or remote.get('version')!=expected['version'] or remote.get('environment')!=expected.get('environment'):return 'build','publication snapshot missing or invalid'
    if remote.get('commit')!=expected['commit']:return 'build','main commit changed'
    if remote.get('contentDigest')!=expected['contentDigest']:return 'build','due article set/content changed'
    return 'verify','snapshot matches; verify actual content before skipping build'

def plan(expected,records,now,fetch,force=False):
    try:
        response=fetch('/publication-state.json')
        remote=json.loads(response.text) if response.status==200 else None
    except Exception:remote=None
    action,reason=decide(expected,remote,force)
    verification=None
    if action=='verify':
        try:
            verification=live.verify(records,now,fetch)
            action,reason='noop','snapshot and all publication surfaces verified'
        except Exception as e:action,reason='build','live verification failed: '+str(e)
    return {'action':action,'reason':reason,'source':expected['commit'],'cutoff':now.isoformat(),
            'publicArticles':len(expected['articles']),'contentDigest':expected['contentDigest'],'verification':verification}

def main():
    sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
    now=dt.datetime.now(dt.timezone.utc)
    origin=os.environ.get('COLUMN_SITE_ORIGIN',live.BASE)
    if origin!=live.BASE:raise ValueError('Production planning origin must be the canonical site')
    report=plan(expected_state(sha,now),inventory(),now,live.http_fetch(origin,str(now.timestamp())),os.environ.get('COLUMN_FORCE_REBUILD')=='true')
    for var in ['GITHUB_OUTPUT']:
        if os.environ.get(var):
            with Path(os.environ[var]).open('a') as out:
                for key in ['action','source','cutoff']:out.write(key+'='+report[key]+'\n')
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with Path(os.environ['GITHUB_STEP_SUMMARY']).open('a') as out:out.write('### Publication plan\n\n```json\n'+json.dumps(report,ensure_ascii=False)+'\n```\n')
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':main()
