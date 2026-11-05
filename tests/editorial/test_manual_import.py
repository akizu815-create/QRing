"""Exercise the authenticated manual import boundary with synthetic text only."""
import copy
import hashlib
import hmac
import http.client
import json
import os
from pathlib import Path
import tempfile
import threading
import time
import unittest
import uuid
from unittest.mock import patch
from scripts.editorial import core
from scripts.editorial.manual import packet, sections
from scripts.editorial.server import make_server

class ManualImportTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = str(Path(self.tmp.name)/'private.sqlite')
        self.db = core.connect(self.path)
        self.public_before = (core.ROOT/'src/content/columns/published.json').read_bytes()
        self.fields = dict(title='防災訓練時の連絡網の整備手順',slug='synthetic-emergency-contacts',summary='検証用の原稿です。',seoTitle='検証用の防災連絡網',metaDescription='実際の制度や事例ではありません。',category='business-safety',primaryAudience='business',searchIntent='施設の防災訓練に備える連絡網の手順',primaryKeyword='防災訓練 連絡網',topicClusterId='emergency-exercise',serviceSpecificationVersion='synthetic-test-v1',body='## 準備\r\n検証用の本文です。\r\n\r\n<script>alert(1)</script>\r\n\r\n## 確認\r\n二つめの節です。',sources=[dict(label='検証専用の資料',href='https://example.org/primary',checkedAt=core.today(),excerpt='Synthetic primary evidence for testing only, not real research.',kind='primary',claim='検証専用の主張です。')])
        env={'QRING_EDITORIAL_PROXY_SECRET':'x'*32,'QRING_EDITORIAL_ROLES':json.dumps({'editor':['editor'],'reader':['viewer'],'reviewer':['reviewer'],'publisher':['publisher']}),'QRING_EDITORIAL_ORIGIN':'https://editorial.example.org'}
        with patch.dict(os.environ,env): self.server=make_server(self.path,0)
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start()
    def tearDown(self):
        self.server.shutdown(); self.server.server_close(); self.thread.join()
        self.assertEqual(self.public_before,(core.ROOT/'src/content/columns/published.json').read_bytes())
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM usage_ledger').fetchone()[0],0)
        self.db.close();self.tmp.cleanup()
    def post(self,data,actor='editor',origin='https://editorial.example.org',signed=True,path='/api/import'):
        body=core.encode(data).encode(); stamp=str(int(time.time()));nonce=str(uuid.uuid4())
        headers={'Content-Type':'application/json','Origin':origin}
        if signed:
            signature=hmac.new(b'x'*32,'\n'.join([actor,stamp,nonce,'POST',path,hashlib.sha256(body).hexdigest()]).encode(),hashlib.sha256).hexdigest()
            headers.update({'X-QRing-Actor':actor,'X-QRing-Time':stamp,'X-QRing-Nonce':nonce,'X-QRing-Signature':signature})
        conn=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
        conn.request('POST',path,body,headers);r=conn.getresponse();status=r.status;data=json.loads(r.read());conn.close();return status,data
    def test_import_is_private_unapproved_and_daily_unique(self):
        status,result=self.post({'fields':self.fields,'retry':False});self.assertEqual(status,201)
        self.assertEqual(result['apiCalls'],0)
        row=core.get(self.db,result['articleId']);a=row['article']
        self.assertEqual(a['status'],'draft');self.assertIsNone(a['approvalRevision']);self.assertIsNone(row['reviewRevision']);self.assertFalse(a['claims'][0]['verified'])
        self.assertEqual(a['sections'][0]['blocks'][1]['text'],'<script>alert(1)</script>')
        self.assertEqual(self.db.execute('SELECT actor FROM editorial_events').fetchone()[0],'editor')
        self.assertEqual(self.post({'fields':self.fields,'retry':False})[0],409)
        self.assertEqual(self.post({'fields':self.fields,'retry':True})[0],409)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM editorial_articles').fetchone()[0],1)
        path='/api/articles/'+a['id']
        self.assertEqual(self.post({'action':'submit','revision':1},path=path)[0],200)
        self.assertEqual(self.post({'action':'approve','revision':1},actor='reviewer',path=path)[0],400)
        self.assertEqual(self.post({'action':'verify','revision':1,'attested':True},actor='reviewer',path=path)[0],200)
        self.assertEqual(self.post({'action':'approve','revision':1},actor='reviewer',path=path)[0],200)
        status,edited=self.post({'action':'save','revision':1,'patch':{'summary':'取込後に修正した検証用の導入文です。'}},path=path)
        self.assertEqual(status,200);self.assertEqual(edited['article']['status'],'draft');self.assertIsNone(edited['article']['approvalRevision'])
    def test_existing_auth_origin_and_roles_are_required(self):
        data={'fields':self.fields,'retry':False}
        self.assertEqual(self.post(data,signed=False)[0],403)
        self.assertEqual(self.post(data,origin='https://attacker.example.org')[0],403)
        for actor in ['reader','reviewer','publisher']: self.assertEqual(self.post(data,actor=actor)[0],403)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM editorial_runs').fetchone()[0],0)
    def test_system_field_injection_and_bad_sources_do_not_save(self):
        for key,value in [('status','published'),('approvalRevision',1),('publishedAt','2020-01-01')]:
            fields={**self.fields,key:value}
            self.assertEqual(self.post({'fields':fields,'retry':False})[0],400)
        for change in [{'href':'javascript:alert(1)'},{'checkedAt':'2099-01-01'},{'excerpt':'short'}]:
            fields=copy.deepcopy(self.fields);fields['sources'][0].update(change)
            self.assertEqual(self.post({'fields':fields,'retry':False})[0],400)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM editorial_articles').fetchone()[0],0)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM editorial_runs').fetchone()[0],0)
    def test_failed_import_requires_explicit_bounded_retry(self):
        fields={**self.fields,'slug':core.published()[0]['slug']}
        self.assertEqual(self.post({'fields':fields,'retry':False})[0],400)
        self.assertEqual(self.post({'fields':self.fields,'retry':False})[0],409)
        status,result=self.post({'fields':self.fields,'retry':True});self.assertEqual(status,201)
        self.assertEqual(self.db.execute('SELECT attempts FROM editorial_runs').fetchone()[0],2)
        self.assertEqual(self.post({'fields':self.fields,'retry':True})[0],409)
    def test_category_options_reuse_existing_contract_and_plain_text(self):
        options=core.content_options();self.assertEqual(len(options['categories']),7);self.assertEqual(len(options['audiences']),3)
        a=packet(self.fields)['article'];core.validate(a)
        self.assertEqual([s['title'] for s in a['sections']],['準備','確認'])
        self.assertEqual(sections('段落1\n\n段落2')[0]['blocks'][1]['text'],'段落2')
        for body in ['', '## 見出しだけ','## ひとつ\n## ふたつ\n本文','本文\n## 空の節']:
            with self.assertRaises(ValueError): sections(body)

if __name__ == '__main__': unittest.main()
