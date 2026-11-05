import copy
import datetime as dt
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from scripts.seo_ops.store import connect,import_bundle,record_failure,DATASETS
from scripts.seo_ops.analysis import analyze,is_brand,metrics,period_bounds
from scripts.seo_ops.actions import action_queue
from scripts.seo_ops.exports import import_csv
from scripts.seo_ops.cli import export_report
from scripts.seo_ops.ai import generate
from scripts.seo_ops.effects import record_change,effect_report

class SeoOperations(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.db=connect(Path(self.tmp.name)/'private/seo.sqlite')
        self.articles=json.loads(Path('src/content/columns/published.json').read_text())
        self.articles[0]['publishedAt']='2026-01-01'
    def tearDown(self):self.db.close();self.tmp.cleanup()
    def bundle(self,days=60):
        end=dt.date(2026,11,1);slices=[]
        for n in range(days):
            day=(end-dt.timedelta(days=n)).isoformat();page='https://www.qring.jp/column/'+self.articles[0]['slug']+'/'
            row=lambda keys,c,i,p=12:{'keys':keys,'clicks':c,'impressions':i,'position':p}
            values={'site':[row([],10,100)],'device':[row(['MOBILE'],10,100)],'query':[row(['QRing'],2,20),row(['高齢者 見守り 防災'],4,40)],'page':[row([page],5 if n<28 else 10,100)],'page_query':[row([page,'高齢者 見守り 防災'],4,40)],'page_device':[row([page,'MOBILE'],5,100)]}
            for dataset in DATASETS:slices.append({'day':day,'dataset':dataset,'aggregation':'byPage' if 'page' in DATASETS[dataset] else 'byProperty','capped':False,'rows':values[dataset]})
        return {'property':'sc-domain:qring.jp','runId':'synthetic-1','startedAt':'2026-11-05T00:00:00Z','fetchedAt':'2026-11-05T00:01:00Z','slices':slices}
    def test_missing_is_not_zero(self):
        r=analyze(self.db,self.articles);self.assertIsNone(r['site']);self.assertEqual(r['state'],'not_acquired')
    def test_metrics_and_brand(self):
        self.assertTrue(is_brand('つながる ＱＲ 料金'));self.assertTrue(is_brand('Q R i n g'))
        self.assertFalse(is_brand('自治体 見守り'))
        m=metrics([{'clicks':1,'impressions':10,'position':2},{'clicks':2,'impressions':100,'position':10}])
        self.assertAlmostEqual(m['ctr'],3/110);self.assertAlmostEqual(m['position'],1020/110)
    def test_atomic_import_and_failure_preservation(self):
        import_bundle(self.db,self.bundle(2));count=self.db.execute('SELECT COUNT(*) FROM gsc_slices').fetchone()[0]
        b=self.bundle(1);b['runId']='broken';b['slices'].pop()
        with self.assertRaises(ValueError):import_bundle(self.db,b)
        record_failure(self.db,'failed','2026-11-06','google_http_429')
        self.assertEqual(count,self.db.execute('SELECT COUNT(*) FROM gsc_slices').fetchone()[0])
    def test_comparison_and_anonymous_queries(self):
        import_bundle(self.db,self.bundle())
        r=analyze(self.db,self.articles)
        self.assertEqual(r['latestAvailableDate'],'2026-11-01')
        self.assertEqual(r['site']['nonbrand']['clicks'],112)
        self.assertEqual(r['site']['unclassified']['clicks'],112)
        a=r['articles'][0];self.assertIn('D',a['candidate']['classes']);self.assertEqual(a['delta']['clicks']['relative'],-.5)
    def test_incomplete_days_and_fresh_article_hold(self):
        import_bundle(self.db,self.bundle(7));r=analyze(self.db,self.articles)
        self.assertEqual(r['state'],'partial');self.assertIsNone(r['site']['delta']);self.assertIsNone(r['site']['unclassified'])
        self.assertEqual(r['articles'][0]['candidate']['state'],'pending')
    def test_unknown_brand_coverage_is_not_nonbrand(self):
        b=self.bundle(28)
        for s in b['slices']:
            if s['dataset']=='query':s['capped']=True
        import_bundle(self.db,b);r=analyze(self.db,self.articles)
        self.assertIsNone(r['site']['unclassified']);self.assertEqual(r['site']['nonbrand']['clicks'],112)
    def test_calendar_month_windows(self):
        start,end,_,_=period_bounds(dt.date(2026,11,1),'6m');self.assertEqual(start,dt.date(2026,5,2))
    def test_overlap_and_no_public_changes(self):
        import_bundle(self.db,self.bundle());r=analyze(self.db,self.articles);before=json.dumps(self.articles)
        q=action_queue(r,self.articles)
        self.assertTrue(q['nextArticles'] or q['overlapWarnings']);self.assertIn('never stops',q['newArticleGeneration'])
        self.assertEqual(before,json.dumps(self.articles));self.assertTrue(all(not i['publishedContentChanged'] for i in q['improveArticles']))
    def test_csv_no_fabricated_daily_query_intersections(self):
        import_csv(self.db,'上位のページ,クリック数,表示回数,CTR,掲載順位\nhttps://www.qring.jp/column/elderly-monitoring/,10,100,10%,8\n','2026-10-05','2026-11-01')
        r=export_report(self.db,self.articles,'28');self.assertEqual(r['state'],'export_snapshot')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM gsc_slices').fetchone()[0],0)
        self.assertEqual(r['articles'][0]['queries'],[]);self.assertEqual(r['articles'][0]['history'],[])
    def test_ai_disabled_without_approval(self):
        with patch.dict(os.environ,{'QRING_SEO_AI_ENABLED':'false'},clear=True):
            self.assertEqual(generate(self.db,self.articles[0],{})['state'],'disabled')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM usage_ledger').fetchone()[0],0)
    def fake_response(self,payload):
        proposal={k:([] if v['type']=='array' else 'synthetic proposal') for k,v in payload['text']['format']['schema']['properties'].items()}
        return {'status':'completed','usage':{'input_tokens':500,'output_tokens':500},'output':[{'content':[{'type':'output_text','text':json.dumps(proposal)}]}]}
    def test_ai_cache_budget_and_review_only(self):
        with patch.dict(os.environ,{'QRING_SEO_AI_ENABLED':'true','QRING_SEO_AI_APPROVAL_ID':'synthetic-test'},clear=True):
            result=generate(self.db,self.articles[0],{'metric':'synthetic'},self.fake_response)
            self.assertEqual(result['state'],'review');self.assertFalse(result['publishedContentChanged'])
            self.assertEqual(generate(self.db,self.articles[0],{'metric':'synthetic'},lambda p:self.fail('Cache must avoid a call'))['state'],'cached')
        self.assertEqual(self.db.execute('SELECT status FROM proposals').fetchone()[0],'review')
        with patch.dict(os.environ,{'QRING_SEO_AI_ENABLED':'true','QRING_SEO_AI_APPROVAL_ID':'test','QRING_SEO_AI_MONTH_USD':'.01','QRING_SEO_AI_DAY_USD':'.01'},clear=True):
            with self.assertRaisesRegex(ValueError,'limit'):generate(self.db,self.articles[0],{'changed':True},lambda p:self.fail('No API call past cap'))
    def test_uncertain_ai_billing_blocks_retry(self):
        def fail(_):raise TimeoutError()
        with patch.dict(os.environ,{'QRING_SEO_AI_ENABLED':'true','QRING_SEO_AI_APPROVAL_ID':'synthetic'},clear=True):
            with self.assertRaises(ValueError):generate(self.db,self.articles[0],{'timeout':1},fail)
            with self.assertRaisesRegex(ValueError,'uncertain'):generate(self.db,self.articles[0],{'timeout':1},lambda p:self.fail('No automatic retry'))
    def test_effects_wait_for_data(self):
        import_bundle(self.db,self.bundle())
        record_change(self.db,self.articles,self.articles[0]['id'],'2026-11-02','1','2')
        r=effect_report(self.db,self.articles);self.assertTrue(all(c['state']=='pending' for c in r[0]['comparisons']))
        self.assertIn('因果関係は未確定',r[0]['causality'])
    def test_low_exposure_is_investigation_not_quality_verdict(self):
        b=self.bundle(60)
        for slice in b['slices']:
            if slice['dataset']=='page':
                for row in slice['rows']:row.update(clicks=0,impressions=2)
        import_bundle(self.db,b);a=analyze(self.db,self.articles)['articles'][0]
        self.assertEqual(a['candidate']['classes'],['C']);self.assertEqual(a['candidate']['state'],'pending')
    def test_no_invented_ctr_benchmark(self):
        import_bundle(self.db,self.bundle(60));a=analyze(self.db,self.articles)['articles'][0]
        self.assertNotIn('A',a['candidate']['classes'])
    def test_export_period_end_is_not_latest_measured_day(self):
        import_csv(self.db,'上位のクエリ,クリック数,表示回数,掲載順位\n自治体 見守り,10,100,8\n','2026-10-05','2026-11-01')
        r=export_report(self.db,self.articles,'28');self.assertIsNone(r['latestAvailableDate'])
        queue=action_queue(r,self.articles);self.assertEqual(queue['dateBasis'],'gsc_csv_period');self.assertTrue(queue['nextArticles'])
    def test_effect_comparison_requires_complete_windows(self):
        import_bundle(self.db,self.bundle(120));record_change(self.db,self.articles,self.articles[0]['id'],'2026-10-01','1','2')
        comparisons=effect_report(self.db,self.articles)[0]['comparisons']
        self.assertEqual(comparisons[0]['state'],'comparable');self.assertEqual(comparisons[1]['state'],'pending')
    def test_no_static_database(self):
        with self.assertRaises(ValueError):connect(Path('out/private-test.sqlite'))
if __name__=='__main__':unittest.main()
