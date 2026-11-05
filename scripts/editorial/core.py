"""Private editing service. Public Next.js code must never import this package."""
import datetime as dt
from functools import lru_cache
import hashlib
import json
import os
import re
import subprocess
import uuid
from pathlib import Path
from ..seo_ops.store import connect as seo_connect, utcnow
from ..seo_ops.actions import action_queue, similarity
from ..seo_ops.analysis import analyze
from ..seo_ops.cli import export_report

ROOT = Path(__file__).resolve().parents[2]
JST = dt.timezone(dt.timedelta(hours=9))
EDITABLE = {'title', 'summary', 'seoTitle', 'metaDescription', 'category', 'primaryAudience', 'tags',
            'publishedAt', 'nextReviewAt', 'serviceSpecificationVersion', 'relatedArticleIds',
            'relatedService', 'sources', 'sections', 'cta', 'searchIntent', 'primaryKeyword', 'topicClusterId'}

class Conflict(ValueError): pass

def today(): return dt.datetime.now(JST).date().isoformat()
def encode(value): return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
def digest(value): return hashlib.sha256(encode(value).encode()).hexdigest()
def published(): return json.loads((ROOT/'src/content/columns/published.json').read_text())

def connect(path=None):
    db = seo_connect(path or os.environ.get('QRING_SEO_DB', str(ROOT/'.qring-private/seo.sqlite')))
    db.executescript('''
    CREATE TABLE IF NOT EXISTS editorial_articles(id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, revision INTEGER NOT NULL, status TEXT NOT NULL, article_json TEXT NOT NULL, evidence_json TEXT NOT NULL, review_revision INTEGER, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS editorial_events(id INTEGER PRIMARY KEY AUTOINCREMENT, article_id TEXT, actor TEXT NOT NULL, action TEXT NOT NULL, revision INTEGER, created_at TEXT NOT NULL, detail_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS editorial_runs(id TEXT PRIMARY KEY, day TEXT NOT NULL UNIQUE, state TEXT NOT NULL, attempts INTEGER NOT NULL, article_id TEXT, error_code TEXT, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS editorial_usage(run_id TEXT PRIMARY KEY, ledger_id TEXT NOT NULL, model TEXT NOT NULL, input_tokens INTEGER, output_tokens INTEGER, price_version TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS editorial_releases(id TEXT PRIMARY KEY, actor TEXT NOT NULL, created_at TEXT NOT NULL, snapshot_json TEXT NOT NULL, base_hash TEXT NOT NULL, snapshot_hash TEXT NOT NULL, status TEXT NOT NULL);
    ''')
    return db

def audit(db, actor, action, article=None, detail=None):
    if not isinstance(actor, str) or not actor.strip(): raise ValueError('Actor required')
    db.execute('INSERT INTO editorial_events(article_id,actor,action,revision,created_at,detail_json) VALUES(?,?,?,?,?,?)',
               (article.get('id') if article else None, actor, action, article.get('contentRevision') if article else None, utcnow(), encode(detail or {})))

@lru_cache(maxsize=1)
def content_options():
    result = subprocess.run(['node', str(ROOT/'scripts/editorial/validate.cjs'), '--options'],
                            text=True, capture_output=True, cwd=ROOT, timeout=30, check=True)
    return json.loads(result.stdout)

def validate(article):
    result = subprocess.run(['node', str(ROOT/'scripts/editorial/validate.cjs')], input=encode(article), text=True, capture_output=True, cwd=ROOT, timeout=30)
    if result.returncode: raise ValueError('Article does not satisfy the existing content contract')
    for key in ['searchIntent', 'primaryKeyword', 'topicClusterId']:
        if not isinstance(article.get(key), str) or not article[key].strip(): raise ValueError('Search intent, keyword and cluster required')
    if len(article['seoTitle']) > 120 or len(article['metaDescription']) > 320: raise ValueError('SEO text too long')
    links = {('/column/'+a['slug']+'/') for a in published() if a['publishedAt'] <= today()}
    links.update('/'+str(p.parent.relative_to(ROOT/'src/app')).strip('/')+'/' for p in (ROOT/'src/app').rglob('page.tsx') if '[' not in str(p))
    for section in article['sections']:
        for block in section['blocks']:
            if block['type'] == 'link' and block['href'].startswith('/') and block['href'] not in links: raise ValueError('Internal link must target an existing public page')
    if article['relatedService'] and article['relatedService']['href'] not in links: raise ValueError('Unknown service link')
    if not set(article['relatedArticleIds']) <= {a['id'] for a in published()}: raise ValueError('Related article is not public')
    for source in article['sources']:
        from urllib.parse import urlsplit
        url = urlsplit(source['href'])
        if url.scheme != 'https' or not url.hostname or url.username or url.password: raise ValueError('Invalid source URL')
        if source['checkedAt'] > today(): raise ValueError('Future source check')

def get(db, article_id):
    row = db.execute('SELECT * FROM editorial_articles WHERE id=?', (article_id,)).fetchone()
    if not row: raise ValueError('Article not found')
    return {'article': json.loads(row['article_json']), 'evidence': json.loads(row['evidence_json']), 'reviewRevision': row['review_revision']}

def all_articles(db):
    private = [json.loads(r[0]) for r in db.execute('SELECT article_json FROM editorial_articles ORDER BY updated_at DESC')]
    return private + [a for a in published() if a['id'] not in {p['id'] for p in private}]

def check_conflicts(db, article):
    return [a['id'] for a in all_articles(db) if a['id'] != article['id'] and
            (a['slug'] == article['slug'] or max(similarity(a['title'], article['title']), similarity(a.get('searchIntent',''), article['searchIntent'])) >= .65)]

def create_draft(db, article, evidence, actor):
    a = json.loads(encode(article))
    a.update(status='draft', publicationOrigin='editorial', contentRevision=1, approvalRevision=None,
             reviewedAt=None, updatedAt=None, validationResults=[], claims=[{**c, 'verified': False} for c in a.get('claims', [])])
    validate(a)
    if any(p['id'] == a['id'] or p['slug'] == a['slug'] for p in published()): raise ValueError('Existing published article requires explicit revision fork')
    with db:
        db.execute('INSERT INTO editorial_articles VALUES(?,?,?,?,?,?,?,?)', (a['id'], a['slug'], 1, 'draft', encode(a), encode(evidence), None, utcnow()))
        audit(db, actor, 'draft_created', a, {'snapshot': a, 'evidence': evidence})
    return a

def fork(db, article_id, actor):
    a = next((a for a in published() if a['id'] == article_id), None)
    if not a: raise ValueError('Published article not found')
    a = json.loads(encode(a)); a.update(status='draft', publicationOrigin='editorial', contentRevision=a['contentRevision']+1, approvalRevision=None, validationResults=[], reviewedAt=None)
    a['claims'] = [{**c, 'verified': False} for c in a['claims']]
    with db:
        db.execute('INSERT INTO editorial_articles VALUES(?,?,?,?,?,?,?,?)', (a['id'], a['slug'], a['contentRevision'], 'draft', encode(a), '[]', None, utcnow()))
        audit(db, actor, 'revision_forked', a, {'snapshot': a})
    return a

def locked(db, article_id, expected):
    if type(expected) is not int or expected < 1: raise ValueError('Integer revision required')
    row = get(db, article_id); a = row['article']
    if a['contentRevision'] != expected: raise Conflict('Article changed; reload before saving')
    return row, a

def update(db, article_id, expected, patch, actor):
    if not set(patch) <= EDITABLE | {'claims', 'evidence'}: raise ValueError('System-managed fields cannot be edited')
    db.execute('BEGIN IMMEDIATE')
    try:
        row, a = locked(db, article_id, expected)
        a.update({k: v for k, v in patch.items() if k != 'evidence'})
        a.update(status='draft', contentRevision=expected+1, approvalRevision=None, reviewedAt=None, updatedAt=today(), validationResults=[])
        a['claims'] = [{**c, 'verified': False} for c in a['claims']]
        validate(a)
        evidence = patch.get('evidence', row['evidence'])
        db.execute('UPDATE editorial_articles SET article_json=?,evidence_json=?,revision=?,status=?,review_revision=NULL,updated_at=? WHERE id=?', (encode(a), encode(evidence), a['contentRevision'], a['status'], utcnow(), article_id))
        audit(db, actor, 'edited', a, {'snapshot': a, 'evidence': evidence})
        db.commit(); return a
    except Exception: db.rollback(); raise

def quality(db, a, evidence):
    errors = []
    if check_conflicts(db, a): errors.append('検索意図が近い記事があります。テーマを見直してください。')
    if not a['claims']: errors.append('根拠確認が必要な主張を登録してください。')
    if not isinstance(evidence, list): return errors + ['出典資料の形式を確認してください。']
    for source in a['sources']:
        entries = [e for e in evidence if isinstance(e, dict) and e.get('sourceId') == source['id'] and e.get('url') == source['href'] and e.get('checkedAt') == source['checkedAt']]
        if len(entries) != 1 or not isinstance(entries[0].get('excerpt'), str) or len(entries[0]['excerpt'].strip()) < 20 or entries[0].get('kind') not in ['primary','trusted']:
            errors.append('出典の確認日・URL・抜粋・一次情報／信頼資料の区分を確認してください。')
        elif (dt.date.fromisoformat(today())-dt.date.fromisoformat(source['checkedAt'])).days > 90:
            errors.append('90日を超えた出典を再確認してください。')
    return errors

def transition(db, article_id, expected, action, actor, note='', attested=False):
    db.execute('BEGIN IMMEDIATE')
    try:
        row, a = locked(db, article_id, expected)
        validate(a)
        if action == 'submit':
            if a['status'] not in ['draft', 'needs_revision']: raise ValueError('Only drafts can be submitted')
            a['status'] = 'review'
        elif action == 'verify':
            if a['status'] != 'review' or not attested: raise ValueError('Explicit source, claim and service-specification review required')
            errors = quality(db, a, row['evidence'])
            if errors: raise ValueError(' / '.join(errors))
            a['claims'] = [{**c, 'verified': True} for c in a['claims']]
            a['validationResults'] = [{'check': 'human-sources-claims-service-specification', 'passed': True}]
            a['reviewedAt'] = today()
            db.execute('UPDATE editorial_articles SET review_revision=? WHERE id=?', (expected, article_id))
        elif action == 'approve':
            if a['status'] != 'review' or row['reviewRevision'] != expected or quality(db, a, row['evidence']): raise ValueError('Current revision must pass explicit human review')
            a.update(status='approved', approvalRevision=expected)
        elif action == 'return':
            if not note.strip(): raise ValueError('Revision reason required')
            a.update(status='needs_revision', approvalRevision=None, validationResults=[], reviewedAt=None)
            a['claims'] = [{**c, 'verified': False} for c in a['claims']]
            db.execute('UPDATE editorial_articles SET review_revision=NULL WHERE id=?', (article_id,))
        else: raise ValueError('Unknown transition')
        db.execute('UPDATE editorial_articles SET status=?,article_json=?,updated_at=? WHERE id=?', (a['status'], encode(a), utcnow(), article_id))
        audit(db, actor, action, a, {'note': note[:2000], 'snapshot': a})
        db.commit(); return a
    except Exception: db.rollback(); raise

def seo_context(db):
    articles = published(); report = analyze(db, articles)
    if report['state'] == 'not_acquired': report = export_report(db, articles, '28')
    return {'analysis': report, 'actions': action_queue(report, articles)}

def usage(db, month=None):
    month = month or today()[:7]
    rows = [dict(r) for r in db.execute('SELECT l.*,u.run_id,u.model,u.input_tokens,u.output_tokens,u.price_version FROM usage_ledger l LEFT JOIN editorial_usage u ON u.ledger_id=l.id WHERE l.month=? ORDER BY l.created_at DESC', (month,))]
    return {'month': month, 'currency': 'USD', 'settledUsd': sum(r['actual_usd'] or 0 for r in rows),
            'reservedUsd': sum(r['reserved_usd'] for r in rows if r['actual_usd'] is None), 'entries': rows,
            'notice': '既存SEO分析と生成の共通台帳。実請求額・税・為替は請求元で確認。旧ChatGPTタスクの利用量は取得対象外。'}

def prepare_release(db, actor, selections):
    """Publisher-only caller. Returns private immutable snapshot; never changes public JSON/Git."""
    if not selections or len({s['id'] for s in selections}) != len(selections): raise ValueError('Explicit unique article revisions required')
    db.execute('BEGIN IMMEDIATE')
    try:
        base = published(); merged = {a['id']: a for a in base}; now = today()
        for selection in selections:
            row, a = locked(db, selection['id'], selection['revision'])
            if a['status'] != 'approved' or a['approvalRevision'] != a['contentRevision'] or row['reviewRevision'] != a['contentRevision'] or quality(db, a, row['evidence']): raise ValueError('Only current verified approvals may be prepared')
            if a['publishedAt'] > now: raise ValueError('Publication date has not arrived')
            a['status'] = 'published'; merged[a['id']] = a
        snapshot = list(merged.values())
        result = subprocess.run(['node', str(ROOT/'scripts/editorial/validate.cjs')], input=encode(snapshot), text=True, capture_output=True, cwd=ROOT, timeout=30)
        if result.returncode: raise ValueError('Public snapshot validation failed')
        release_id = digest({'base': digest(base), 'snapshot': digest(snapshot)})
        db.execute('INSERT OR IGNORE INTO editorial_releases VALUES(?,?,?,?,?,?,?)', (release_id, actor, utcnow(), encode(snapshot), digest(base), digest(snapshot), 'prepared'))
        audit(db, actor, 'release_prepared', detail={'releaseId': release_id, 'revisions': selections, 'deploymentApproved': False})
        db.commit(); return {'id': release_id, 'status': 'prepared', 'snapshotHash': digest(snapshot), 'deploymentApproved': False}
    except Exception: db.rollback(); raise
