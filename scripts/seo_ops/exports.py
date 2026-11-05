"""Import existing GSC CSV exports without inventing page×date×query intersections."""
import csv
import hashlib
import io
import json
from .store import utcnow
HEADERS={'日付':'date','Date':'date','ページ':'page','上位のページ':'page','Top pages':'page','検索キーワード':'query','上位のクエリ':'query','Top queries':'query','クエリ':'query','Query':'query','クリック数':'clicks','Clicks':'clicks','表示回数':'impressions','Impressions':'impressions','掲載順位':'position','平均掲載順位':'position','Position':'position','CTR':'ctr'}
def import_csv(db,content,start,end,page_filter=None):
    import datetime as dt
    if dt.date.fromisoformat(start)>dt.date.fromisoformat(end):raise ValueError('Invalid date interval')
    reader=csv.DictReader(io.StringIO(content.lstrip('\ufeff')))
    headers=[HEADERS.get(k,k) for k in (reader.fieldnames or [])]
    dim=next((k for k in ['date','page','query'] if k in headers),None)
    if not dim or not {'clicks','impressions','position'}.issubset(headers):raise ValueError('Unsupported GSC CSV headers')
    rows=[]; seen=set()
    for original in reader:
        row={HEADERS.get(k,k):v for k,v in original.items()}
        out={'keys':[row[dim]],**{k:float(row[k].replace(',','')) for k in ['clicks','impressions','position']}}
        if any(v<0 or not __import__('math').isfinite(v) for k,v in out.items() if k!='keys'):raise ValueError('Invalid CSV metrics')
        if out['clicks']>out['impressions']:raise ValueError('Invalid clicks')
        if dim=='date' and (not start<=row['date']<=end or dt.date.fromisoformat(row['date']).isoformat()!=row['date']):raise ValueError('CSV date outside declared interval')
        key=tuple(out['keys'])
        if key in seen:raise ValueError('Duplicate CSV dimension')
        seen.add(key);rows.append(out)
    db.execute('CREATE TABLE IF NOT EXISTS gsc_exports(id TEXT PRIMARY KEY,start_date TEXT,end_date TEXT,dimension TEXT,page_filter TEXT,imported_at TEXT,rows_json TEXT)')
    key=hashlib.sha256(json.dumps([start,end,dim,page_filter,rows],ensure_ascii=False).encode()).hexdigest()
    with db:db.execute('INSERT OR IGNORE INTO gsc_exports VALUES(?,?,?,?,?,?,?)',(key,start,end,dim,page_filter,utcnow(),json.dumps(rows,ensure_ascii=False)))
    return {'state':'imported','id':key,'dimension':dim,'rows':len(rows),'interval':[start,end],'pageFilter':page_filter,'note':'期間別集計を保持。日別×ページ×クエリへの架空の展開はしません。'}
