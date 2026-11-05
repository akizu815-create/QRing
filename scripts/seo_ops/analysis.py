"""Deterministic metrics and cautious candidates; no external calls or publishing."""
import calendar
import datetime as dt
import json
import re
import statistics
import unicodedata
from urllib.parse import urlsplit
from .store import DATASETS

BRANDS=['qring','キューリング','つながるqr','つながるキューアール']
def normalized(s): return re.sub(r'[\W_]+','',unicodedata.normalize('NFKC',s).casefold())
def is_brand(query,aliases=None): return any(normalized(a) in normalized(query) for a in (aliases or BRANDS))
def days_between(start,end): return [(start+dt.timedelta(days=i)).isoformat() for i in range((end-start).days+1)]
def period_bounds(end,period):
    if period in ('3m','6m'):
        months=int(period[0]); offset=end.year*12+end.month-1-months
        prior=dt.date(offset//12,offset%12+1,min(end.day,calendar.monthrange(offset//12,offset%12+1)[1]))
        start=prior+dt.timedelta(days=1)
    else: start=end-dt.timedelta(days=int(period)-1)
    count=(end-start).days+1
    return start,end,start-dt.timedelta(days=count),start-dt.timedelta(days=1)

def metrics(rows):
    if not rows: return None
    impressions=sum(r['impressions'] for r in rows); clicks=sum(r['clicks'] for r in rows)
    return {'impressions':impressions,'clicks':clicks,'ctr':clicks/impressions if impressions else None,'position':sum(r['position']*r['impressions'] for r in rows)/impressions if impressions else None}
def delta(current,previous):
    if current is None or previous is None: return None
    return {k:({'absolute':current[k]-previous[k],'relative':(current[k]-previous[k])/previous[k] if previous[k] else None} if current.get(k) is not None and previous.get(k) is not None else None) for k in ['clicks','impressions','ctr','position']}
def canonical_page(url):
    p=urlsplit(url)
    if p.hostname not in ['qring.jp','www.qring.jp'] or p.scheme not in ['https','http']: return None
    return '/'+p.path.strip('/')+'/' if p.path.strip('/') else '/'

def analyze(db,articles,period='28',end=None,aliases=None):
    if period not in ['7','28','56','90','3m','6m']: raise ValueError('Unsupported period')
    rows=db.execute('SELECT * FROM gsc_slices WHERE property=? ORDER BY day',('sc-domain:qring.jp',)).fetchall()
    slices={(r['day'],r['dataset']):{**dict(r),'rows':json.loads(r['rows_json'])} for r in rows}
    available=[day for (day,dataset),s in slices.items() if dataset=='site' and s['rows'] and not s['capped']]
    latest=max(available) if available else None
    if not latest: return {'state':'not_acquired','latestAvailableDate':None,'site':None,'articles':[],'period':period,'notice':'未取得。認証・初回同期が必要です。未取得をゼロ扱いしません。'}
    end=dt.date.fromisoformat(end or latest)
    start,end,prev_start,prev_end=period_bounds(end,period)
    current_days=days_between(start,end); previous_days=days_between(prev_start,prev_end)
    def select(dataset,days,page=None):
        selected=[]; complete=0; missing=[]; capped=False
        for day in days:
            s=slices.get((day,dataset))
            if not s or not s['rows']: missing.append(day);continue
            capped=capped or bool(s['capped']); complete+=not s['capped']
            selected.extend(r for r in s['rows'] if page is None or canonical_page(r['keys'][0])==page)
        return {'observed':metrics(selected),'coverage':complete/len(days),'missingDates':missing,'capped':capped,'rows':selected,'completeDays':complete}
    current=select('site',current_days); previous=select('site',previous_days)
    # Published-day totals are kept separate from query totals; anonymous queries are not non-brand.
    queries=select('query',current_days)
    brand=metrics([r for r in queries['rows'] if is_brand(r['keys'][0],aliases)])
    nonbrand=metrics([r for r in queries['rows'] if not is_brand(r['keys'][0],aliases)])
    query_metrics=queries['observed']; site=current['observed']
    unknown={k:max(0,site[k]-(query_metrics[k] if query_metrics else 0)) for k in ['clicks','impressions']} if site and current['coverage']==1 and queries['coverage']==1 and not queries['capped'] else None
    def compact(s): return {k:v for k,v in s.items() if k!='rows'}
    items=[]
    for a in articles:
        if a.get('status')!='published' or a.get('publishedAt','9999')>end.isoformat(): continue
        path='/column/'+a['slug']+'/'
        now_stats=select('page',current_days,path); old_stats=select('page',previous_days,path)
        q=select('page_query',current_days,path)
        grouped={}
        for r in q['rows']: grouped.setdefault(r['keys'][1],[]).append(r)
        top=sorted([{'query':query,**metrics(rs),'brand':is_brand(query,aliases)} for query,rs in grouped.items()],key=lambda q:q['clicks'],reverse=True)[:20]
        age=(end-dt.date.fromisoformat(a['publishedAt'])).days
        compare=delta(now_stats['observed'],old_stats['observed']) if now_stats['coverage']==1 and old_stats['coverage']==1 else None
        items.append({'id':a['id'],'title':a['title'],'path':path,'category':a['category'],'audience':a['primaryAudience'],'publishedAt':a['publishedAt'],'updatedAt':a.get('updatedAt'),'keyword':a.get('primaryKeyword'),'ageDays':age,'cohort':'new' if age<28 else 'established','current':compact(now_stats),'previous':compact(old_stats),'delta':compare,'queries':top,'candidate':{'classes':[],'state':'pending','reasons':[]},'history':[{ 'date':day, 'metrics':metrics([r for r in slices.get((day,'page'),{}).get('rows',[]) if canonical_page(r['keys'][0])==path])} for day in current_days]})
    for item in items:
        c=item['current']; m=c['observed']; p=item['previous']['observed']; result=item['candidate']
        if item['ageDays']<28 or c['coverage']<0.8 or not m or m['impressions']<100 or c['capped']:
            result['reasons']=['公開直後・取得不足・表示回数不足のため判断保留。表示が少ない原因やインデックス状況は未確認です。']
            if item['ageDays']>=56 and c['coverage']==1 and m and m['impressions']<100 and not c['capped']:result['classes']=['C']
            continue
        result['state']='evaluated'
        pos=m['position'] or 100
        band=lambda n: 0 if n<=3 else 1 if n<=10 else 2 if n<=20 else 3
        peers=[x['current']['observed'] for x in items if x['id']!=item['id'] and x['category']==item['category'] and x['current']['coverage']>=.8 and x['current']['observed'] and x['current']['observed']['impressions']>=100 and band(x['current']['observed']['position'] or 100)==band(pos)]
        if len(peers)>=3 and m['impressions']>=200 and m['ctr']<statistics.median(x['ctr'] for x in peers)*.6:
            result['classes'].append('A');result['reasons'].append('同カテゴリー・同順位帯の比較対象よりCTRが低い候補。デバイスや検索意図の違いを確認。')
        if item['delta'] and p and item['ageDays']>=56:
            if pos>10 and item['delta'].get('position') and abs(item['delta']['position']['absolute'])<2:
                result['classes'].append('B');result['reasons'].append('前期間から平均順位が大きく変わらない候補。順位だけで品質を判定しません。')
            if p['clicks']>=10 and m['clicks']<p['clicks']*.7:
                result['classes'].append('D');result['reasons'].append('クリック減少候補。季節性・クエリ構成・制度変更等の原因は未検証。')
            if m['clicks']>=10 and m['clicks']>p['clicks']*1.2:
                result['classes'].append('E');result['reasons'].append('クリック増加候補。成功要因と因果関係は未検証。')
        if not result['classes']: result['reasons'].append('現時点で優先的な改善根拠なし。比較対象不足ではCTRの優劣を断定しません。')
    def group_by(key):
        out=[]
        for value in sorted(set(a[key] for a in items)):
            members=[a for a in items if a[key]==value]; ms=[a['current']['observed'] for a in members if a['current']['observed']]
            out.append({'group':value,'articleCount':len(members),'observed':metrics(ms),'note':'ページ単位の観測値の合計。サイト全体と集計単位が異なります。'})
        return out
    daily=[{'date':day,'metrics':metrics(slices.get((day,'site'),{}).get('rows',[]))} for day in current_days]
    device=select('device',current_days); device_groups={}
    for r in device['rows']: device_groups.setdefault(r['keys'][0],[]).append(r)
    site_query_groups={}
    for r in queries['rows']: site_query_groups.setdefault(r['keys'][0],[]).append(r)
    site_queries=sorted([{'query':q,**metrics(rs),'brand':is_brand(q,aliases)} for q,rs in site_query_groups.items()],key=lambda q:q['impressions'],reverse=True)[:100]
    last_run=db.execute('SELECT status,finished_at,error_code FROM gsc_runs ORDER BY finished_at DESC LIMIT 1').fetchone()
    return {'state':'ready' if current['coverage']==1 else 'partial','period':period,'start':start.isoformat(),'end':end.isoformat(),'previousStart':prev_start.isoformat(),'previousEnd':prev_end.isoformat(),'dateTimezone':'America/Los_Angeles','latestAvailableDate':latest,'lastRun':dict(last_run) if last_run else None,'site':{'current':compact(current),'previous':compact(previous),'delta':delta(current['observed'],previous['observed']) if current['coverage']==1 and previous['coverage']==1 else None,'brand':brand,'nonbrand':nonbrand,'unclassified':unknown,'queryCoverage':compact(queries)},'siteQueries':site_queries,'daily':daily,'devices':[{'device':k,**metrics(v)} for k,v in device_groups.items()],'articles':items,'categories':group_by('category'),'audiences':group_by('audience'),'cohorts':group_by('cohort'),'notice':'数値は観測値。未取得日をゼロ扱いせず、クエリ秘匿・上位行制限を含みます。順位のみで品質や因果関係を判定しません。'}
