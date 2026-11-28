import copy
import json
import unittest
import subprocess
import tempfile
from unittest.mock import patch
import scripts.editorial.generate as generator
from pathlib import Path
from scripts.editorial import naming_policy as policy
import test_workflow as fixtures

class NamingPolicyTests(unittest.TestCase):
    def test_own_technical_and_public_names_are_not_private_brands(self):
        a={'title':'株式会社QRingとつながるQR、PHPとQRコードの技術','summary':'警察庁・東京大学の資料','sources':[{'href':'https://www.npa.go.jp/primary'}]}
        self.assertEqual(policy.scan(a)['findings'],[])
        self.assertTrue(policy.scan(a)['humanReviewRequired'])
        self.assertEqual(policy.scan({'title':'inline outline'})['findings'],[])
        self.assertTrue(policy.scan({'title':'Ａｐｐｌｅの製品'})['findings'])
    def test_all_public_fields_links_and_generated_metadata_are_scanned(self):
        a={'seoTitle':'iPhoneの操作','metaDescription':'ChatGPTを評価','summary':'LINEの説明',
           'sections':[{'title':'Googleの機能','blocks':[{'type':'link','href':'https://support.apple.com/help','label':'説明'}]}],
           'image':{'alt':'AirTagを持つ人','src':'/images/own.png'},
           'sources':[{'label':'デンソーウェーブ','href':'https://www.qrcode.com/about/'}],
           'relatedArticleIds':['other'],'openGraph':{'title':'Gemini'},'structuredData':{'citation':'https://help.line.me/line/'}}
        result=policy.scan(a,[{'id':'other','title':'Claudeの使い方'}])
        fields={f['field'] for f in result['findings']}
        for prefix in ['seoTitle','metaDescription','summary','sections','image.alt','sources','relatedArticleIds','openGraph','structuredData']:
            self.assertTrue(any(f.startswith(prefix) for f in fields),prefix)
    def test_internal_research_is_not_publication_permission(self):
        self.assertEqual(policy.scan({'researchNotes':'Apple https://apple.com/','title':'一般的な生活課題'})['findings'],[])
        with self.assertRaisesRegex(ValueError,'representative'):
            policy.review_record({'contentRevision':2,'sources':[{'href':'https://www.apple.com/jp/'}]},True,'確認した')
    def test_domains_and_infrastructure_require_context_not_blanket_permission(self):
        report=policy.scan({'title':'NTTの災害用伝言とSuica','sources':[{'href':'https://www.ntt-east.co.jp/saigai/'}]})
        self.assertTrue(all(f['kind']=='public-infrastructure-context' for f in report['findings']))
        with self.assertRaisesRegex(ValueError,'source/context'):
            policy.review_record({'contentRevision':1,'sources':[{'href':'https://university.example.org/paper'}]},True)
        spoof=policy.scan({'sources':[{'href':'https://agency.go.jp.evil.example/info'}]})
        self.assertEqual(spoof['findings'][0]['kind'],'source-owner-review')
        self.assertTrue(any(f['kind']=='restricted-name' for f in policy.scan({'title':'NTTドコモの通信サービス'})['findings']))
    def test_incident_word_is_review_not_proof_of_breach(self):
        r=policy.scan({'summary':'脆弱性が報告され、予防的にサービス停止。漏えいは調査中。'})
        self.assertTrue(any(f['kind']=='incident-facts-review' for f in r['findings']))
        self.assertFalse(any('confirmedBreach' in f for f in r['findings']))
    def test_audit_report_cannot_overwrite_input(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'packet.json'
            text=json.dumps([{'slug':'fixture','title':'一般的な疑問','status':'draft','contentRevision':1}]);p.write_text(text)
            result=subprocess.run(['python3','-m','scripts.editorial.audit_policy','--file',str(p),'--output',str(p)],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0);self.assertEqual(p.read_text(),text)

    def test_exception_reference_is_record_not_automatic_authorization(self):
        a={'contentRevision':3,'title':'特定ホテルの実証先を掲載する株式会社テストの説明'}
        with self.assertRaises(ValueError):policy.review_record(a,False,'review','representative-decision')
        with self.assertRaises(ValueError):policy.review_record(a,True,'review')
        r=policy.review_record(a,True,'対象版の実際の承認を人が確認したというテスト用記録','synthetic-decision-reference')
        self.assertEqual(r['revision'],3)
        self.assertIn('not authenticated',r['authorizationNotice'])
        with self.assertRaises(ValueError):policy.review_record(a,True,None)

class PolicyIntegrationTests(unittest.TestCase):
    setUp=fixtures.WorkflowTests.setUp
    tearDown=fixtures.WorkflowTests.tearDown
    draft=fixtures.WorkflowTests.draft
    step=fixtures.WorkflowTests.step
    def test_review_requires_separate_policy_attestation_and_audits_revision(self):
        self.draft();self.step('submit')
        with self.assertRaises(ValueError):self.step('verify',attested=True)
        self.step('verify',attested=True,policy_attested=True,policy_note='Synthetic source ownership and all image/metadata checks reviewed.',representative_approval='synthetic-source-classification-decision')
        a=self.step('approve')
        self.assertTrue(any(c['check']==policy.CHECK for c in a['validationResults']))
        detail=json.loads(self.db.execute("SELECT detail_json FROM editorial_events WHERE action='verify'").fetchone()[0])
        self.assertEqual(detail['namingPolicyReview']['revision'],1)
        edited=__import__('scripts.editorial.core',fromlist=['update']).update(self.db,a['id'],1,{'title':'防災訓練の連絡体制を見直す具体的な手順'},'editor')
        self.assertEqual(edited['validationResults'],[])
    def test_known_private_reference_needs_individual_approval_record(self):
        self.article['sources'][0]['href']='https://support.apple.com/example'
        self.evidence[0]['url']=self.article['sources'][0]['href']
        self.draft();self.step('submit')
        with self.assertRaisesRegex(ValueError,'representative'):
            self.step('verify',attested=True,policy_attested=True,policy_note='Needs representative decision')
        self.assertEqual(self.db.execute("SELECT count(*) FROM editorial_events WHERE action='verify'").fetchone()[0],0)

    def test_generated_check_flags_cannot_supply_human_attestation(self):
        self.article['validationResults']=[{'check':policy.CHECK,'passed':True}]
        self.draft();self.step('submit')
        a=__import__('scripts.editorial.core',fromlist=['get']).get(self.db,self.article['id'])['article']
        self.assertEqual(a['validationResults'],[])
        with self.assertRaises(ValueError):self.step('verify',attested=True)
    def test_old_review_cannot_prepare_release_without_new_policy_check(self):
        import scripts.editorial.core as core
        self.draft();self.step('submit')
        self.step('verify',attested=True,policy_attested=True,policy_note='Synthetic owner and full surface review',representative_approval='synthetic-reference')
        a=self.step('approve');a['validationResults']=[r for r in a['validationResults'] if r['check']!=policy.CHECK]
        with self.db:self.db.execute('UPDATE editorial_articles SET article_json=? WHERE id=?',(core.encode(a),a['id']))
        with self.assertRaises(ValueError):core.prepare_release(self.db,'publisher',[{'id':a['id'],'revision':1}])

    def test_planning_defers_private_brand_queries_without_rewriting_search_data(self):
        observations=[{'audience':'personal','categories':['privacy-life'],'query':'AirTagの比較'},
                      {'audience':'personal','categories':['privacy-life'],'query':'個人情報の保護と連絡方法'}]
        with patch.object(generator,'AUDIENCE_ROTATION',['personal']*10),patch.object(generator,'seo_context',return_value={'actions':{'nextArticles':observations}}):
            r=generator.plan(self.db,'2026-11-28')
        self.assertEqual(r['keyword'],observations[1]['query']);self.assertEqual(r['namingPolicyCandidatesDeferred'],1)
        self.assertEqual(r['seo']['nextArticles'],observations)
    def test_brand_topic_is_rejected_before_api_or_budget_reservation(self):
        packet={'keyword':'ChatGPTのサービス比較','sources':self.article['sources'],'evidence':self.evidence,'serviceSpecification':{'version':'fixture'}}
        with fixtures.WorkflowTests.ai_env(self),patch.object(generator,'plan',return_value={'keyword':None}):
            with self.assertRaisesRegex(ValueError,'general theme'):
                generator.generate(self.db,packet,'synthetic-worker',send=lambda _:self.fail('Unapproved topic must not call paid API'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM usage_ledger').fetchone()[0],0)
