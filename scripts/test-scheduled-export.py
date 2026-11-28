"""Real static builds in an isolated copy with synthetic articles; no deployment."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import threading

ROOT=Path(__file__).resolve().parents[1]

def main():
    reports=[]
    with tempfile.TemporaryDirectory(prefix='qring-schedule-matrix-') as directory:
        target=Path(directory)
        for name in ['src','scripts','public']:
            shutil.copytree(ROOT/name,target/name,ignore=shutil.ignore_patterns('__pycache__'))
        for name in ['package.json','package-lock.json','next.config.mjs','tsconfig.json','tailwind.config.ts','postcss.config.mjs','next-env.d.ts']:
            if (ROOT/name).exists():shutil.copy2(ROOT/name,target/name)
        (target/'node_modules').symlink_to(ROOT/'node_modules',target_is_directory=True)
        records=json.loads((target/'src/content/columns/published.json').read_text())
        synthetic=[]
        for index in range(3):
            a=copy.deepcopy(records[0]);a.pop('contentFormat',None);a.pop('approvalRecord',None)
            a.update(id='schedule-test-'+str(index),slug='schedule-test-'+str(index),title='PRIVATE_SCHEDULE_TITLE_'+str(index),seoTitle='PRIVATE_SCHEDULE_TITLE_'+str(index),
                     summary='PRIVATE_SCHEDULE_SUMMARY_'+str(index),introduction=[],sections=[{'id':'test','title':'Schedule test','blocks':[{'type':'paragraph','text':'PRIVATE_SCHEDULE_BODY_'+str(index)}]}],
                     status='scheduled' if index<2 else 'draft',publishedAt='2026-12-01',publishedTimestamp='2026-12-01T08:00:00+09:00',editionDate='2026-12-01',
                     contentRevision=1,approvalRevision=1 if index<2 else None,publicationPending=index==2,updatedAt=None,claims=[],validationResults=[{'check':'synthetic-fixture','passed':True}],
                     relatedArticleIds=[],relatedLinks=[],relatedService=None,manuscriptReferences=False)
            if index==2:
                original=target/'public'/a['image']['src'].lstrip('/')
                private=target/'public/images/columns/private-schedule-image.jpg';shutil.copy2(original,private)
                a['image']['src']='/images/columns/private-schedule-image.jpg'
            synthetic.append(a)
        (target/'src/content/columns/published.json').write_text(json.dumps(records+synthetic,ensure_ascii=False))
        class Handler(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        for stamp,synthetic_due in [('2026-12-01T07:59:59+09:00',False),('2026-12-01T08:00:00+09:00',True)]:
            selection=subprocess.run(['node','scripts/column-release-indices.cjs'],cwd=target,input=json.dumps({'records':records,'now':stamp}),text=True,capture_output=True,check=True)
            count=len(json.loads(selection.stdout))+(2 if synthetic_due else 0)
            env=dict(os.environ,COLUMN_BUILD_AT=stamp,NEXT_TELEMETRY_DISABLED='1',CF_PAGES='0',COLUMN_SOURCE_SHA='synthetic-test-only')
            # Simulated future clocks must never escape into later workflow steps.
            for key in ['GITHUB_ENV','GITHUB_OUTPUT','GITHUB_STEP_SUMMARY']:env.pop(key,None)
            log=target/'test-build.log'
            for cmd in [['npm','run','build'],['npm','run','check:column-export'],['npm','run','check:column-navigation']]:
                with log.open('a') as out:r=subprocess.run(cmd,cwd=target,env=env,stdout=out,stderr=subprocess.STDOUT)
                if r.returncode:raise RuntimeError(log.read_text()[-20000:])
            with http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(target/'out'))) as server:
                thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
                code="""import datetime as dt, importlib.util, json, pathlib, sys
sys.path.insert(0,'scripts')
s=importlib.util.spec_from_file_location('verification','scripts/check-live-columns.py');m=importlib.util.module_from_spec(s);sys.modules[s.name]=m;s.loader.exec_module(m)
r=json.loads(pathlib.Path('src/content/columns/published.json').read_text())
for f in pathlib.Path('src/content/columns/revisions').glob('*/unpublished-drafts.json'):
 r.extend(a for a in json.loads(f.read_text()) if not any(x['id']==a['id'] for x in r))
print(json.dumps(m.verify(r,dt.datetime.fromisoformat(sys.argv[1]),m.http_fetch(sys.argv[2],'test'))))
"""
                result=subprocess.run(['python3','-c',code,stamp,'http://127.0.0.1:'+str(server.server_port)],cwd=target,env=env,text=True,capture_output=True)
                server.shutdown();thread.join()
                if result.returncode:raise RuntimeError(result.stderr)
                report=json.loads(result.stdout);assert report['publicArticles']==count
                assert not (target/'out/images/columns/private-schedule-image.jpg').exists()
                for index in [0,1]:assert (target/'out/column'/('schedule-test-'+str(index))/'index.html').exists()==synthetic_due
                assert not (target/'out/column/schedule-test-2').exists()
                hidden=[2] if synthetic_due else [0,1,2]
                for file in (target/'out').rglob('*'):
                    if file.is_file() and file.suffix in ['.html','.txt','.js','.json','.xml']:
                        text=file.read_text(errors='ignore')
                        for index in hidden:
                            assert 'PRIVATE_SCHEDULE_BODY_'+str(index) not in text
                            assert 'PRIVATE_SCHEDULE_SUMMARY_'+str(index) not in text
                reports.append(dict(cutoff=stamp,**report));print(json.dumps(reports[-1]),flush=True)
    output=os.environ.get('COLUMN_MATRIX_REPORT')
    if output:Path(output).write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
    print('Two real static builds + HTTP verification passed: scheduled before/exactly due, two simultaneous articles, draft hold, direct 404, no future payload/image; original registry untouched.')
if __name__=='__main__':main()
