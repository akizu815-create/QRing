import copy
import datetime as dt
import importlib.util
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
import test_ops

ROOT=Path(__file__).resolve().parents[2]
live=test_ops.live
spec=importlib.util.spec_from_file_location('plan_module',ROOT/'scripts/plan-column-publication.py')
plan_module=importlib.util.module_from_spec(spec);spec.loader.exec_module(plan_module)

class RecoveryTests(unittest.TestCase):
    def setUp(self):
        self.stamp='2026-11-28T16:00:00+09:00'
        self.now=dt.datetime.fromisoformat(self.stamp)
        self.records,self.public,self.pages=test_ops.PublicationOps().fixture(self.stamp)
        self.expected={'version':1,'environment':'production','commit':'test-source','contentDigest':'test-content','articles':[{} for a in self.public]}
        self.pages['/publication-state.json']=json.dumps(self.expected)
    def fetch(self,path):
        return live.Response(200,self.pages[path]) if path in self.pages else live.Response(404,'Not found')
    def test_no_public_articles_is_a_valid_empty_state(self):
        pages={'/':'<html></html>','/column/':'<p>No published articles</p>','/sitemap.xml':'<urlset></urlset>'}
        report=live.verify([],self.now,pages.__getitem__,picks=[])
        self.assertEqual(report['publicArticles'],0)
        self.assertIsNone(report['latest'])

    def test_verified_duplicate_runs_are_noops(self):
        before=copy.deepcopy(self.pages)
        for _ in range(2):
            report=plan_module.plan(self.expected,self.records,self.now,self.fetch)
            self.assertEqual(report['action'],'noop')
        self.assertEqual(self.pages,before)
    def test_failed_build_or_deploy_keeps_mismatch_for_next_attempt(self):
        self.pages['/publication-state.json']=json.dumps(dict(self.expected,contentDigest='yesterday'))
        for failure in ['build','deploy']:
            with self.subTest(failure=failure):
                self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch)['action'],'build')
        self.pages['/publication-state.json']=json.dumps(self.expected)
        self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch)['action'],'noop')
    def test_missing_snapshot_wrong_source_and_force_recover(self):
        del self.pages['/publication-state.json']
        self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch)['action'],'build')
        self.pages['/publication-state.json']=json.dumps(dict(self.expected,commit='old-source'))
        self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch)['action'],'build')
        self.pages['/publication-state.json']=json.dumps(self.expected)
        self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch,True)['action'],'build')
    def test_same_snapshot_with_missing_body_still_rebuilds(self):
        a=self.public[-1];path='/column/'+a['slug']+'/'
        self.pages[path]=self.pages[path].replace(a['summary'],'stale body')
        self.assertEqual(plan_module.plan(self.expected,self.records,self.now,self.fetch)['action'],'build')
    def test_future_direct_url_even_soft_200_is_an_error(self):
        a=copy.deepcopy(self.records[0]);a.update(id='future-test',slug='future-test',title='PRIVATE_FUTURE_TEST',status='scheduled',publishedAt='2026-12-01',publishedTimestamp='2026-12-01T08:00:00+09:00')
        records=self.records+[a]
        self.assertEqual(live.verify(records,self.now,self.fetch)['unpublishedURLsChecked'],1)
        self.pages['/column/future-test/']='<h1>404 Not Found</h1>'
        with self.assertRaisesRegex(AssertionError,'direct URL'):live.verify(records,self.now,self.fetch)
    def test_future_sitemap_leak_fails(self):
        a=copy.deepcopy(self.records[0]);a.update(id='future-test',slug='future-test',title='PRIVATE_FUTURE_TEST',status='draft',approvalRevision=None)
        self.pages['/sitemap.xml']=self.pages['/sitemap.xml'].replace('</urlset>','<url><loc>'+live.BASE+'/column/future-test/</loc></url></urlset>')
        with self.assertRaisesRegex(AssertionError,'Future article leaked'):live.verify(self.records+[a],self.now,self.fetch)
    def test_wrong_200_title_noindex_broken_image_and_old_body_fail(self):
        a=self.public[-1];path='/column/'+a['slug']+'/'
        original=self.pages[path]
        for transform in [lambda h:h.replace('<h1>','<h1>Wrong '),lambda h:'<meta name="robots" content="noindex">'+h,lambda h:h.replace(a['summary'],'stale body')]:
            self.pages[path]=transform(original)
            with self.assertRaises(AssertionError):live.verify(self.records,self.now,self.fetch)
        self.pages[path]=original;self.pages[a['image']['src']]='<html>200 error page</html>'
        with self.assertRaisesRegex(AssertionError,'not an image'):live.verify(self.records,self.now,self.fetch)
    def test_historical_draft_snapshot_allows_only_reviewed_release(self):
        from column_revision_support import verify_archived_transition
        drafts=json.loads((ROOT/'src/content/columns/revisions/20261128/unpublished-drafts.json').read_text())
        draft=drafts[0];active=copy.deepcopy(draft)
        active.update(status='scheduled',publicationPending=False,approvalRevision=active['contentRevision'])
        verify_archived_transition(active,draft)
        self.assertEqual(draft['status'],'draft')
        with self.assertRaises(AssertionError):verify_archived_transition(dict(active,approvalRevision=None),draft)
        with self.assertRaises(AssertionError):verify_archived_transition(dict(active,title='Changed without a revision'),draft)

    def test_cache_propagation_retries_then_verifies(self):
        a=self.public[-1];path='/column/'+a['slug']+'/'
        stale=copy.deepcopy(self.pages);stale[path]='stale cached HTML'
        calls=[]
        def factory(base,stamp):
            calls.append(stamp); pages=stale if len(calls)<3 else self.pages
            return lambda p:live.Response(200,pages[p]) if p in pages else live.Response(404,'')
        with patch.object(live.dt,'datetime',wraps=dt.datetime) as clock:
            clock.now.return_value=self.now
            waits=[];report=live.verify_with_retry(self.records,fetch_factory=factory,sleep=waits.append)
        self.assertEqual(report['live'],'passed');self.assertEqual(len(calls),3);self.assertEqual(waits,[10,20])

if __name__=='__main__':unittest.main()
