import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path
from .store import connect,import_bundle,record_failure,utcnow,DATASETS
from .analysis import analyze,metrics,delta,is_brand,canonical_page
from .actions import action_queue,save_report,markdown
ROOT=Path(__file__).resolve().parents[2]
def main():
    p=argparse.ArgumentParser(description='Existing GSC → private editorial actions (no publication)')
    p.add_argument('command',choices=['import','failure','coverage','actions','analyze-ai','import-csv','record-change','effects'])
    p.add_argument('--db',default=os.environ.get('QRING_SEO_DB',str(ROOT/'.qring-private/seo.sqlite')))
    p.add_argument('--period',choices=['7','28','90','3m','6m'],default='28')
    p.add_argument('--format',choices=['json','md'],default='json');p.add_argument('--kind',choices=['daily','weekly','monthly'],default='daily')
    p.add_argument('--article');p.add_argument('--csv');p.add_argument('--start');p.add_argument('--end');p.add_argument('--page-filter')
    p.add_argument('--changed-at');p.add_argument('--before-revision');p.add_argument('--after-revision')
    args=p.parse_args();db=connect(args.db)
    try:
        if args.command=='import':
            import_bundle(db,json.load(sys.stdin)); result={'state':'imported'}
        elif args.command=='failure':
            b=json.load(sys.stdin);record_failure(db,b['runId'],b['startedAt'],b['errorCode']);result={'state':'logged'}
        elif args.command=='coverage':
            result=[r[0] for r in db.execute('SELECT day FROM gsc_slices GROUP BY day HAVING COUNT(DISTINCT dataset)=6')]
        elif args.command=='import-csv':
            if not args.csv or not args.start or not args.end:raise ValueError('--csv, --start, --end required; use the actual GSC export filter period')
            from .exports import import_csv
            result=import_csv(db,Path(args.csv).read_text(encoding='utf-8-sig'),args.start,args.end,args.page_filter)
        else:
            articles=json.loads((ROOT/'src/content/columns/published.json').read_text())
            if args.command=='record-change':
                from .effects import record_change
                if not all([args.article,args.changed_at,args.before_revision,args.after_revision]):raise ValueError('Change metadata required')
                print(json.dumps({'id':record_change(db,articles,args.article,args.changed_at,args.before_revision,args.after_revision)}));return
            if args.command=='effects':
                from .effects import effect_report
                print(json.dumps(effect_report(db,articles),ensure_ascii=False,indent=2));return
            report=analyze(db,articles,args.period)
            # Prefer daily API input. A period CSV fallback never fabricates daily records.
            if report['state']=='not_acquired':report=export_report(db,articles,args.period)
            queue=action_queue(report,articles)
            if args.command=='analyze-ai':
                if not args.article:raise ValueError('--article required')
                item=next((a for a in report.get('articles',[]) if a['id']==args.article),None)
                if not item or item['candidate']['state']=='pending':result={'state':'hold','reason':'データ不足のため有料AIを実行しません。'}
                else:
                    from .ai import generate
                    result=generate(db,next(a for a in articles if a['id']==args.article),item)
            else:
                key=save_report(db,args.kind,report,queue)
                if args.format=='md':print(markdown(queue));return
                result={'reportId':key,'actions':queue,'analysis':report}
        print(json.dumps(result,ensure_ascii=False,indent=2))
    except Exception as e:
        # No raw Google/OpenAI HTTP responses, keys, or credential paths in logs.
        if isinstance(e,(ValueError,KeyError)):print(json.dumps({'state':'failed','reason':str(e),'publishedContentChanged':False},ensure_ascii=False),file=sys.stderr)
        else:print(json.dumps({'state':'failed','reason':'Private SEO processing failed; existing data retained'},ensure_ascii=False),file=sys.stderr)
        raise SystemExit(1)
    finally:db.close()

def export_report(db,articles,period):
    exists=db.execute("SELECT 1 FROM sqlite_master WHERE name='gsc_exports'").fetchone()
    if not exists:return {'state':'not_acquired','latestAvailableDate':None,'articles':[]}
    exports=[{**dict(r),'rows':json.loads(r['rows_json'])} for r in db.execute('SELECT * FROM gsc_exports ORDER BY imported_at DESC')]
    from .analysis import period_bounds,days_between
    latest=max((r['end_date'] for r in exports),default=None)
    if not latest:return {'state':'not_acquired','latestAvailableDate':None,'articles':[]}
    start,end,ps,pe=period_bounds(dt.date.fromisoformat(latest),period)
    matching=lambda dim,s,e,pf=None:next((r for r in exports if r['dimension']==dim and r['start_date']==s.isoformat() and r['end_date']==e.isoformat() and r['page_filter']==pf),None)
    pages=matching('page',start,end);previous=matching('page',ps,pe);query=matching('query',start,end)
    items=[]
    for a in articles:
        if a['status']!='published' or a['publishedAt']>end.isoformat():continue
        path='/column/'+a['slug']+'/'
        get=lambda source:metrics([r for r in source['rows'] if canonical_page(r['keys'][0])==path]) if source else None
        m=get(pages);old=get(previous);age=(end-dt.date.fromisoformat(a['publishedAt'])).days
        own_query=matching('query',start,end,'https://www.qring.jp'+path)
        # Export rows can be truncated; absence of a row is not a measured zero.
        c={'observed':m,'coverage':None,'capped':bool(pages and len(pages['rows'])>=1000),'source':'gsc_csv_period'}
        top=[{'query':r['keys'][0],**metrics([r]),'brand':is_brand(r['keys'][0])} for r in own_query['rows']] if own_query else []
        state='pending' if age<28 or not m or m['impressions']<100 or c['capped'] else 'evaluated'
        classes=[];reasons=['CSVの期間集計を利用。日別データや原因は未確認。']
        if state=='pending':reasons.append('公開時期またはデータ不足のため判断保留。')
        elif old and old['clicks']>=10 and m['clicks']<old['clicks']*.7:classes=['D'];reasons.append('前期間比でクリック減少。原因・因果関係は未確認。')
        items.append({'id':a['id'],'title':a['title'],'path':path,'category':a['category'],'audience':a['primaryAudience'],'publishedAt':a['publishedAt'],'updatedAt':a.get('updatedAt'),'keyword':a.get('primaryKeyword'),'ageDays':age,'current':c,'previous':{'observed':old},'delta':delta(m,old),'queries':top,'history':[],'candidate':{'state':state,'classes':classes,'reasons':reasons}})
    date_export=matching('date',start,end)
    actual_latest=max((r['keys'][0] for r in date_export['rows']),default=None) if date_export else None
    return {'state':'export_snapshot','period':period,'start':start.isoformat(),'end':end.isoformat(),'latestAvailableDate':actual_latest,'articles':items,'siteQueries':[{'query':r['keys'][0],**metrics([r]),'brand':is_brand(r['keys'][0])} for r in query['rows']] if query else [],'notice':'既存GSC CSVの期間別集計。最新API取得日ではなく、入力した集計期間の末日です。未提供の内訳は未取得。'}
if __name__=='__main__':main()
