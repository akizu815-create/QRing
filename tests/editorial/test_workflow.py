import copy
import hashlib
import hmac
import http.client
import json
import os
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest.mock import patch
from scripts.editorial import core
from scripts.editorial.generate import generate
from scripts.editorial.cli import import_external, export_release, reconcile
from scripts.editorial.server import authenticate, make_server

class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.path = str(Path(self.tmp.name)/'private'/'test.sqlite'); self.db = core.connect(self.path)
        a = copy.deepcopy(core.published()[0]); a.update(id='fixture-editorial',slug='fixture-editorial',title='防災訓練における連絡網の整備手順',searchIntent='施設の防災訓練で緊急連絡網を整備する担当者向けの手順',primaryKeyword='防災訓練 連絡網',topicClusterId='emergency-exercise',publicationOrigin='editorial',publishedAt=core.today(),sources=[{'id':'fixture-source','href':'https://example.org/primary','label':'Synthetic evidence','checkedAt':core.today()}],claims=[{'text':'Synthetic claim for tests only','sourceIds':['fixture-source'],'verified':False}],relatedArticleIds=[])
        self.article = a; self.evidence = [{'sourceId':'fixture-source','url':'https://example.org/primary','checkedAt':core.today(),'excerpt':'Synthetic primary source excerpt, not a real researched statement.','kind':'primary'}]
        self.public_before = (core.ROOT/'src/content/columns/published.json').read_bytes()
    def tearDown(self):
        self.assertEqual(self.public_before,(core.ROOT/'src/content/columns/published.json').read_bytes())
        self.db.close(); self.tmp.cleanup()
    def draft(self): return core.create_draft(self.db,self.article,self.evidence,'editor')
    def approved(self):
        a=self.draft(); self.step('submit'); self.step('verify',attested=True); return self.step('approve')
    def step(self,action,**kwargs):
        a=core.get(self.db,self.article['id'])['article']; return core.transition(self.db,a['id'],a['contentRevision'],action,'reviewer',**kwargs)
    def test_revision_approval_history_and_stale_save(self):
        a=self.approved(); self.assertEqual(a['approvalRevision'],1)
        a=core.update(self.db,a['id'],1,{'title':'防災訓練時の連絡先を整備する実務手順'},'editor')
        self.assertEqual(a['contentRevision'],2); self.assertIsNone(a['approvalRevision']); self.assertEqual(a['status'],'draft'); self.assertFalse(a['claims'][0]['verified'])
        with self.assertRaises(core.Conflict): core.update(self.db,a['id'],1,{'title':'overwrite'},'editor')
        with self.assertRaises(ValueError): self.step('approve')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM editorial_events').fetchone()[0],5)
    def test_no_approval_without_review_or_status_injection(self):
        self.draft()
        with self.assertRaises(ValueError): self.step('approve')
        with self.assertRaises(ValueError): core.update(self.db,self.article['id'],1,{'status':'published'},'editor')
        self.step('submit')
        with self.assertRaises(ValueError): self.step('verify',attested=False)
    def test_missing_source_and_overlap_hold(self):
        self.draft(); self.step('submit')
        with self.db: self.db.execute('UPDATE editorial_articles SET evidence_json=?',('[]',))
        with self.assertRaises(ValueError): self.step('verify',attested=True)
        a=copy.deepcopy(self.article); a['id']='other'; a['slug']='other'; core.create_draft(self.db,a,self.evidence,'editor')
        self.assertIn('other',core.check_conflicts(self.db,self.article))
    def test_publish_snapshot_separate_from_article_approval(self):
        self.draft()
        with self.assertRaises(ValueError): core.prepare_release(self.db,'publisher',[{'id':self.article['id'],'revision':1}])
        self.step('submit'); self.step('verify',attested=True); self.step('approve')
        r=core.prepare_release(self.db,'publisher',[{'id':self.article['id'],'revision':1}])
        self.assertFalse(r['deploymentApproved']); self.assertEqual(len(core.published()),2)
        export=export_release(self.db,r['id'],'operator'); self.assertTrue(Path(export['path']).is_file())
        snap=json.loads(Path(export['path']).read_text()); self.assertEqual(len(snap),3); self.assertEqual(snap[:2],core.published())
        self.step('return',note='Source needs recheck')
        with self.assertRaises(ValueError): export_release(self.db,r['id'],'operator')
    def test_existing_fork_does_not_change_public(self):
        a=core.published()[0]; fork=core.fork(self.db,a['id'],'editor'); self.assertEqual(fork['contentRevision'],a['contentRevision']+1); self.assertEqual(fork['status'],'draft')
    def test_external_daily_import_no_api_or_duplicate(self):
        result=import_external(self.db,{'article':self.article,'evidence':self.evidence},'operator')
        self.assertEqual(result['apiCalls'],0)
        with self.assertRaises(ValueError): import_external(self.db,{'article':self.article},'operator')
    def packet(self): return {'keyword':'防災訓練 連絡網','sources':self.article['sources'],'evidence':self.evidence,'serviceSpecification':{'version':'fixture-v1'}}
    def response(self):
        g={k:self.article[k] for k in ['slug','title','summary','seoTitle','metaDescription','searchIntent','primaryKeyword','topicClusterId']}
        g.update(sections=[{'id':'preparation','title':'手順','paragraphs':['Synthetic article paragraph.']}],claims=[{'text':'Synthetic claim','sourceIds':['fixture-source']}],internalLinks=[{'href':'/service/','label':'サービス'}])
        return {'status':'completed','usage':{'input_tokens':100,'output_tokens':200},'output':[{'content':[{'type':'output_text','text':json.dumps(g)}]}]}
    def ai_env(self): return patch.dict(os.environ,{'QRING_COLUMN_AI_ENABLED':'true','QRING_COLUMN_AI_APPROVAL_ID':'fixture-approval','QRING_COLUMN_PRODUCER':'pipeline','QRING_COLUMN_CUTOVER_APPROVAL_ID':'fixture-cutover','QRING_SEO_AI_MONTH_USD':'5','QRING_SEO_AI_DAY_USD':'1'})
    def test_ai_disabled_and_old_scheduler_guard(self):
        with patch.dict(os.environ,{},clear=True):
            self.assertEqual(generate(self.db,{},'worker')['state'],'disabled')
            with patch.dict(os.environ,{'QRING_COLUMN_AI_ENABLED':'true','QRING_COLUMN_AI_APPROVAL_ID':'x'}): self.assertEqual(generate(self.db,{},'worker')['state'],'disabled')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM usage_ledger').fetchone()[0],0)
    def test_ai_draft_token_cost_and_daily_idempotency(self):
        calls=[]
        with self.ai_env():
            r=generate(self.db,self.packet(),'worker',send=lambda p:(calls.append(p) or self.response()))
            self.assertEqual(r['state'],'draft'); self.assertEqual(len(calls),1)
            a=core.get(self.db,r['articleId'])['article']; self.assertEqual(a['status'],'draft'); self.assertIsNone(a['approvalRevision']); self.assertFalse(a['claims'][0]['verified'])
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:self.fail('duplicate charged'))
        entries=core.usage(self.db)['entries']; self.assertEqual(entries[0]['input_tokens'],100); self.assertEqual(entries[0]['output_tokens'],200); self.assertEqual(entries[0]['state'],'settled')
    def test_timeout_reserves_budget_and_prevents_retry(self):
        with self.ai_env():
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:(_ for _ in ()).throw(TimeoutError()))
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:self.fail('retried uncertain billing'),retry=True)
        row=self.db.execute('SELECT * FROM usage_ledger').fetchone(); self.assertEqual(row['state'],'unknown'); self.assertIsNone(row['actual_usd']); self.assertGreater(core.usage(self.db)['reservedUsd'],0)
    def test_unknown_usage_requires_explicit_reconciliation(self):
        with self.ai_env():
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:(_ for _ in ()).throw(TimeoutError()))
        run_id=self.db.execute('SELECT id FROM editorial_runs').fetchone()[0]
        with self.assertRaises(ValueError): reconcile(self.db,run_id,10,20,'operator','')
        result=reconcile(self.db,run_id,10,20,'operator','provider-request-fixture')
        self.assertEqual(result['state'],'invalid'); self.assertFalse(result['automaticRetry']); self.assertEqual(core.usage(self.db)['reservedUsd'],0)
    def test_shared_budget_prevents_api_call(self):
        day=core.today()
        with self.db: self.db.execute('INSERT INTO usage_ledger VALUES(?,?,?,?,?,?,?,?)',('prior',day[:7],day,'seo:prior',1,1,'settled',core.utcnow()))
        with self.ai_env():
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:self.fail('over budget'))
    def test_invalid_billed_result_is_settled_bounded_retry(self):
        def bad(p): return {**self.response(),'output':[]}
        with self.ai_env():
            for _ in range(2):
                with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=bad,retry=True)
            with self.assertRaises(ValueError): generate(self.db,self.packet(),'worker',send=lambda p:self.fail('third attempt'),retry=True)
        self.assertEqual(self.db.execute('SELECT attempts FROM editorial_runs').fetchone()[0],2)
        self.assertTrue(all(r['state']=='settled' for r in core.usage(self.db)['entries']))
    def test_proxy_signed_identity(self):
        secret='x'*32; now=int(time.time()); nonce='random-test'; actor='known'; body=b'{}'; path='/api/releases'
        message='\n'.join([actor,str(now),nonce,'POST',path,hashlib.sha256(body).hexdigest()])
        headers={'X-QRing-Actor':actor,'X-QRing-Time':str(now),'X-QRing-Nonce':nonce,'X-QRing-Signature':hmac.new(secret.encode(),message.encode(),hashlib.sha256).hexdigest()}
        self.assertEqual(authenticate(headers,'POST',path,body,secret,{actor:['viewer']})[1],{'viewer'})
        for method,content,stamp in [('GET',body,now),('POST',b'{"bad":true}',now),('POST',body,now+120)]:
            with self.assertRaises(PermissionError): authenticate(headers,method,path,content,secret,{actor:['viewer']},now=stamp)
        with self.assertRaises(PermissionError): authenticate(headers,'POST',path,body,secret,{'other':['reviewer']})
    def test_server_requires_auth_origin_and_role(self):
        with patch.dict(os.environ,{},clear=True):
            with self.assertRaises(ValueError): make_server(self.path,0)
        env={'QRING_EDITORIAL_PROXY_SECRET':'x'*32,'QRING_EDITORIAL_ROLES':json.dumps({'reader':['viewer']}),'QRING_EDITORIAL_ORIGIN':'https://editorial.example.org'}
        with patch.dict(os.environ,env): server=make_server(self.path,0)
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        try:
            conn=http.client.HTTPConnection('127.0.0.1',server.server_port)
            conn.request('GET','/api/bootstrap'); response=conn.getresponse();self.assertEqual(response.status,403);response.read()
            stamp=str(int(time.time())); get_path='/api/bootstrap'
            signature=hmac.new(b'x'*32,'\n'.join(['reader',stamp,'get-once','GET',get_path,hashlib.sha256(b'').hexdigest()]).encode(),hashlib.sha256).hexdigest()
            conn.request('GET',get_path,headers={'X-QRing-Actor':'reader','X-QRing-Time':stamp,'X-QRing-Nonce':'get-once','X-QRing-Signature':signature})
            response=conn.getresponse(); self.assertEqual(response.status,200); self.assertEqual(response.getheader('Cache-Control'),'no-store')
            data=json.loads(response.read()); self.assertEqual(data['roles'],['viewer']); self.assertEqual(len(data['articles']),2); self.assertEqual(data['articles'][0]['publicRevision'],1)
            body=b'{}';stamp=str(int(time.time()));nonce='one';path='/api/releases'
            sig=hmac.new(b'x'*32,'\n'.join(['reader',stamp,nonce,'POST',path,hashlib.sha256(body).hexdigest()]).encode(),hashlib.sha256).hexdigest()
            headers={'X-QRing-Actor':'reader','X-QRing-Time':stamp,'X-QRing-Nonce':nonce,'X-QRing-Signature':sig,'Content-Type':'application/json','Origin':'https://editorial.example.org'}
            conn.request('POST',path,body,headers);response=conn.getresponse();self.assertEqual(response.status,403);response.read()
            conn.request('POST',path,body,headers);response=conn.getresponse();self.assertEqual(response.status,403);response.read()
            headers['Origin']='https://attacker.example.org';conn.request('POST',path,body,headers);response=conn.getresponse();self.assertEqual(response.status,403);response.read();conn.close()
        finally: server.shutdown();server.server_close();thread.join()

if __name__=='__main__': unittest.main()
