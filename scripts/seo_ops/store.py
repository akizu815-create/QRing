"""Private durable SEO store. Never imported from Next.js or copied to out/."""
import datetime as dt
import json
import os
import sqlite3
from pathlib import Path

DATASETS = {'site': [], 'device': ['device'], 'page': ['page'], 'query': ['query'], 'page_query': ['page','query'], 'page_device': ['page','device']}

def connect(path):
    path=Path(path).resolve()
    root=Path(__file__).resolve().parents[2]
    for unsafe in ['src','public','out']:
        if path.is_relative_to(root/unsafe): raise ValueError('Private database must be outside static source/output')
    path.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
    if path.parent.stat().st_mode & 0o077: raise ValueError('Private SEO directory must be restricted to its owner')
    db=sqlite3.connect(path,timeout=15)
    db.row_factory=sqlite3.Row
    db.execute('PRAGMA journal_mode=WAL')
    db.executescript('''
    CREATE TABLE IF NOT EXISTS schema_version(version INTEGER PRIMARY KEY);
    INSERT OR IGNORE INTO schema_version VALUES(1);
    CREATE TABLE IF NOT EXISTS gsc_runs(id TEXT PRIMARY KEY, started_at TEXT NOT NULL, finished_at TEXT NOT NULL, status TEXT NOT NULL, error_code TEXT);
    CREATE TABLE IF NOT EXISTS gsc_slices(property TEXT NOT NULL, day TEXT NOT NULL, dataset TEXT NOT NULL, aggregation TEXT NOT NULL, fetched_at TEXT NOT NULL, run_id TEXT NOT NULL, capped INTEGER NOT NULL, rows_json TEXT NOT NULL, PRIMARY KEY(property,day,dataset));
    CREATE TABLE IF NOT EXISTS article_snapshots(id TEXT PRIMARY KEY, captured_at TEXT NOT NULL, snapshot_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS proposals(cache_key TEXT PRIMARY KEY, article_id TEXT NOT NULL, generated_at TEXT NOT NULL, input_json TEXT NOT NULL, output_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'review', revision INTEGER NOT NULL DEFAULT 1, approval_revision INTEGER);
    CREATE TABLE IF NOT EXISTS usage_ledger(id TEXT PRIMARY KEY, month TEXT NOT NULL, day TEXT NOT NULL, purpose TEXT NOT NULL, reserved_usd REAL NOT NULL, actual_usd REAL, state TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS changes(id TEXT PRIMARY KEY, article_id TEXT NOT NULL, changed_at TEXT NOT NULL, before_revision TEXT NOT NULL, after_revision TEXT NOT NULL, baseline_json TEXT NOT NULL, external_factors_json TEXT NOT NULL DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY, kind TEXT NOT NULL, period_start TEXT NOT NULL, period_end TEXT NOT NULL, generated_at TEXT NOT NULL, data_json TEXT NOT NULL);
    ''')
    os.chmod(path,0o600)
    return db

def utcnow(): return dt.datetime.now(dt.timezone.utc).isoformat()

def import_bundle(db,bundle):
    if bundle.get('property')!='sc-domain:qring.jp': raise ValueError('Unexpected property')
    slices=bundle.get('slices',[])
    if not slices: raise ValueError('No completed slices; existing data retained')
    days={s['day'] for s in slices}
    for day in days:
        dt.date.fromisoformat(day)
        group=[s for s in slices if s['day']==day]
        if {s['dataset'] for s in group}!=set(DATASETS) or len(group)!=len(DATASETS): raise ValueError('Incomplete daily bundle; existing data retained')
        for s in group:
            name=s['dataset']; expected='byPage' if 'page' in DATASETS[name] else 'byProperty'
            if s['aggregation']!=expected: raise ValueError('Aggregation mismatch')
            keys=set()
            for r in s['rows']:
                if not isinstance(r.get('keys'),list) or len(r['keys'])!=len(DATASETS[name]) or not all(isinstance(k,str) for k in r['keys']): raise ValueError('Dimension mismatch')
                if any(not isinstance(r.get(k),(int,float)) or isinstance(r.get(k),bool) or not __import__('math').isfinite(r[k]) or r[k]<0 for k in ['clicks','impressions','position']): raise ValueError('Invalid metrics')
                if r['clicks']>r['impressions']: raise ValueError('Clicks exceed impressions')
                key=tuple(r['keys'])
                if key in keys: raise ValueError('Duplicate dimension row')
                keys.add(key)
    with db:
        db.execute('INSERT INTO gsc_runs VALUES(?,?,?,?,?)',(bundle['runId'],bundle['startedAt'],utcnow(),'success',None))
        for s in slices:
            db.execute('INSERT OR REPLACE INTO gsc_slices VALUES(?,?,?,?,?,?,?,?)',(bundle['property'],s['day'],s['dataset'],s['aggregation'],bundle['fetchedAt'],bundle['runId'],int(s['capped']),json.dumps(s['rows'],ensure_ascii=False)))

def record_failure(db,run_id,started,error_code):
    with db: db.execute('INSERT OR REPLACE INTO gsc_runs VALUES(?,?,?,?,?)',(run_id,started,utcnow(),'failed',error_code))
