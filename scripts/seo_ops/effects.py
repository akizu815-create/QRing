"""Explicit change snapshots. Comparisons are observational, not causal attribution."""
import datetime as dt
import json
from .analysis import analyze,delta
from .store import utcnow

def record_change(db,articles,article_id,day,before_revision,after_revision):
    before=dt.date.fromisoformat(day)-dt.timedelta(days=1)
    if before_revision==after_revision:raise ValueError('Revision must change')
    if not any(a['id']==article_id for a in articles):raise ValueError('Unknown article')
    baselines={}
    # analyze supports 56 internally as an evaluation window.
    for length in [28,56,90]:
        r=analyze(db,articles,str(length),before.isoformat())
        item=next((a for a in r.get('articles',[]) if a['id']==article_id),None)
        baselines[str(length)]=item['current'] if item else None
    identifier=article_id+':'+after_revision
    with db:db.execute('INSERT INTO changes(id,article_id,changed_at,before_revision,after_revision,baseline_json) VALUES(?,?,?,?,?,?)',(identifier,article_id,day,before_revision,after_revision,json.dumps(baselines,ensure_ascii=False)))
    return identifier

def effect_report(db,articles):
    out=[]
    for row in db.execute('SELECT * FROM changes ORDER BY changed_at'):
        baseline=json.loads(row['baseline_json']);comparisons=[]
        for length in [28,56,90]:
            end=(dt.date.fromisoformat(row['changed_at'])+dt.timedelta(days=length-1)).isoformat()
            r=analyze(db,articles,str(length),end)
            before=baseline[str(length)]
            item=next((a for a in r.get('articles',[]) if a['id']==row['article_id']),None)
            after=item['current'] if item else None
            available=r.get('latestAvailableDate') or '0000'
            ready=bool(end<=available and before and after and before['coverage']==1 and after['coverage']==1)
            comparisons.append({'days':length,'end':end,'state':'comparable' if ready else 'pending','before':before,'after':after,'delta':delta(after['observed'],before['observed']) if ready else None})
        out.append({'articleId':row['article_id'],'changedAt':row['changed_at'],'revision':[row['before_revision'],row['after_revision']],'comparisons':comparisons,'causality':'因果関係は未確定。季節性・アルゴリズム変更・クエリ構成等の影響を別途確認。'})
    return out
