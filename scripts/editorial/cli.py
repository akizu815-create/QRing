"""Private operator commands. No command pushes, merges or deploys."""
import argparse
import json
import os
import sys
import uuid
from . import core
from .generate import generate, plan

def import_external(db, packet, actor, retry=False):
    day = core.today(); run_id = 'external-'+str(uuid.uuid4())
    article = packet['article']
    core.validate({**article,'status':'draft','publicationOrigin':'editorial','contentRevision':1,'approvalRevision':None,'validationResults':[]})
    db.execute('BEGIN IMMEDIATE')
    try:
        prior = db.execute('SELECT * FROM editorial_runs WHERE day=?',(day,)).fetchone()
        if prior:
            if not retry or prior['state'] != 'import_failed' or prior['attempts'] >= 2: raise core.Conflict('本日の取込・生成履歴が既にあります。既存の下書きを確認してください。失敗時の再試行は合計2回までです。')
            run_id = prior['id']; attempts = prior['attempts']+1
        else: attempts = 1
        db.execute('INSERT OR REPLACE INTO editorial_runs VALUES(?,?,?,?,?,?,?)',(run_id,day,'running',attempts,None,None,core.utcnow()))
        db.commit()
    except Exception: db.rollback(); raise
    try:
        article = {**article,'generationRunId':run_id,'promptVersion':'external-import-v1'}
        a = core.create_draft(db, article, packet.get('evidence',[]), actor)
        with db: db.execute('UPDATE editorial_runs SET state=?,article_id=?,updated_at=? WHERE id=?',('draft',a['id'],core.utcnow(),run_id))
        return {'state':'draft','articleId':a['id'],'runId':run_id,'apiCalls':0}
    except Exception:
        with db: db.execute('UPDATE editorial_runs SET state=?,error_code=?,updated_at=? WHERE id=?',('import_failed','invalid_external_packet',core.utcnow(),run_id))
        raise

def export_release(db, release_id, actor):
    row = db.execute('SELECT * FROM editorial_releases WHERE id=?',(release_id,)).fetchone()
    if not row: raise ValueError('Release not found')
    if core.digest(core.published()) != row['base_hash']: raise core.Conflict('Public snapshot changed; prepare again')
    snapshot = json.loads(row['snapshot_json']); base = {a['id']:a for a in core.published()}
    changed = [a for a in snapshot if base.get(a['id']) != a]
    # Revalidate active approval at export time; a withdrawn/edited approval invalidates old releases.
    checked = core.prepare_release(db, actor, [{'id':a['id'],'revision':a['contentRevision']} for a in changed])
    if checked['id'] != release_id or core.digest(snapshot) != row['snapshot_hash']: raise core.Conflict('Prepared release is stale')
    db_file = db.execute('PRAGMA database_list').fetchone()['file']
    directory = __import__('pathlib').Path(db_file).parent/'releases'
    directory.mkdir(mode=0o700,exist_ok=True)
    target = directory/(release_id+'.json')
    # Always use the private DB directory; no arbitrary source/output path argument.
    if target.exists():
        if core.digest(json.loads(target.read_text())) != row['snapshot_hash']: raise ValueError('Existing export differs')
    else:
        fd = os.open(target,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
        with os.fdopen(fd,'w') as f: f.write(core.encode(snapshot)+'\n')
    with db: core.audit(db,actor,'release_exported',detail={'releaseId':release_id,'deploymentApproved':False})
    return {'state':'private_export','path':str(target),'snapshotHash':row['snapshot_hash'],'deploymentApproved':False}


def reconcile(db, run_id, input_tokens, output_tokens, actor, reference):
    """Explicit operator billing reconciliation; never retries a request."""
    from ..seo_ops.ai import INPUT_RATE, OUTPUT_RATE
    if type(input_tokens) is not int or type(output_tokens) is not int or min(input_tokens, output_tokens) < 0 or not reference or not reference.strip():
        raise ValueError('Verified provider usage and reconciliation reference required')
    db.execute('BEGIN IMMEDIATE')
    try:
        run = db.execute('SELECT * FROM editorial_runs WHERE id=?', (run_id,)).fetchone()
        if not run or run['state'] not in ['running', 'unknown']: raise ValueError('No unresolved run')
        entry = db.execute("SELECT l.id FROM usage_ledger l JOIN editorial_usage u ON u.ledger_id=l.id WHERE u.run_id=? AND l.state IN ('reserved','unknown')", (run_id+':'+str(run['attempts']),)).fetchone()
        if not entry: raise ValueError('Unresolved ledger entry not found')
        article = next((json.loads(r[0]) for r in db.execute('SELECT article_json FROM editorial_articles') if json.loads(r[0]).get('generationRunId') == run_id), None)
        db.execute('UPDATE usage_ledger SET actual_usd=?,state=? WHERE id=?', (input_tokens*INPUT_RATE+output_tokens*OUTPUT_RATE, 'settled', entry['id']))
        db.execute('UPDATE editorial_usage SET input_tokens=?,output_tokens=? WHERE ledger_id=?', (input_tokens, output_tokens, entry['id']))
        state = 'draft' if article else 'invalid'
        db.execute('UPDATE editorial_runs SET state=?,article_id=?,error_code=NULL,updated_at=? WHERE id=?', (state,article['id'] if article else None,core.utcnow(),run_id))
        core.audit(db,actor,'billing_reconciled',detail={'runId':run_id,'reference':reference[:300],'inputTokens':input_tokens,'outputTokens':output_tokens,'automaticRetry':False})
        db.commit(); return {'state':state,'automaticRetry':False}
    except Exception: db.rollback(); raise

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('command',choices=['plan','generate','import','usage','runs','export','reconcile'])
    p.add_argument('--db'); p.add_argument('--actor',required=True); p.add_argument('--release-id'); p.add_argument('--retry',action='store_true'); p.add_argument('--run-id'); p.add_argument('--input-tokens',type=int); p.add_argument('--output-tokens',type=int); p.add_argument('--reference')
    args = p.parse_args(); db = core.connect(args.db)
    try:
        if args.command == 'plan': result = plan(db,core.today())
        elif args.command == 'generate': result = generate(db,json.load(sys.stdin),args.actor,retry=args.retry)
        elif args.command == 'import': result = import_external(db,json.load(sys.stdin),args.actor,retry=args.retry)
        elif args.command == 'reconcile': result = reconcile(db,args.run_id,args.input_tokens,args.output_tokens,args.actor,args.reference)
        elif args.command == 'usage': result = core.usage(db)
        elif args.command == 'runs': result = [dict(r) for r in db.execute('SELECT * FROM editorial_runs ORDER BY day DESC')]
        else: result = export_release(db,args.release_id,args.actor)
        print(json.dumps(result,ensure_ascii=False,indent=2))
    except Exception:
        # Avoid echoing provider bodies, author drafts or secrets in terminal/CI logs.
        print('Private editorial operation failed. Inspect private history and input; no deployment performed.',file=sys.stderr)
        raise SystemExit(1)
    finally: db.close()

if __name__ == '__main__': main()
