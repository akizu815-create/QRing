import datetime as dt
import importlib.util
import json
import os
from pathlib import Path
import sys
import subprocess
import tempfile
import contextlib
import io
import html
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT/'scripts'))


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), ROOT/'scripts'/f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


prepare = load('prepare-column-build')
live = load('check-live-columns')
from column_export_support import published_articles, home_column_picks


class PublicationOps(unittest.TestCase):
    def test_prepare_writes_real_cutoff_to_actions_outputs(self):
        with tempfile.TemporaryDirectory() as directory:
            env_file, output_file = Path(directory)/'env', Path(directory)/'output'
            before = dt.datetime.now(dt.timezone.utc)-dt.timedelta(seconds=1)
            subprocess.run([sys.executable, str(ROOT/'scripts/prepare-column-build.py')],
                           env=dict(os.environ,GITHUB_EVENT_NAME='push',COLUMN_SCHEDULE='',
                                    GITHUB_ENV=str(env_file),GITHUB_OUTPUT=str(output_file)),
                           check=True,capture_output=True,text=True)
            cutoff = env_file.read_text().strip().split('=',1)[1]
            self.assertLessEqual(before, dt.datetime.fromisoformat(cutoff))
            self.assertLessEqual(dt.datetime.fromisoformat(cutoff), dt.datetime.now(dt.timezone.utc))
            self.assertEqual(output_file.read_text(), f'cutoff={cutoff}\n')

    def test_prewarm_waits_without_advancing_date(self):
        for stamp, expected in [('2026-11-08T22:50:00+00:00', 600),
                                ('2026-11-08T22:59:59+00:00', 1),
                                ('2026-11-08T23:00:00+00:00', 0),
                                ('2026-11-09T01:54:40+00:00', 0)]:
            self.assertEqual(prepare.wait_seconds(dt.datetime.fromisoformat(stamp), 'schedule', prepare.PREWARM_CRON), expected)
        before = dt.datetime.fromisoformat('2026-11-08T22:55:00+00:00')
        self.assertEqual(prepare.wait_seconds(before, 'push', ''), 0)
        self.assertEqual(prepare.wait_seconds(before, 'schedule', '15,45 23 * * *'), 0)
        with self.assertRaises(ValueError):
            prepare.wait_seconds(before.replace(hour=21), 'schedule', prepare.PREWARM_CRON)

    def fixture(self, stamp):
        records = json.loads((ROOT/'src/content/columns/published.json').read_text())
        with patch.dict(os.environ, COLUMN_BUILD_AT=stamp):
            public = published_articles(records)
        public.sort(key=lambda a: a.get('publishedTimestamp', a['publishedAt']), reverse=True)
        paths = ['/column/'+a['slug']+'/' for a in public]
        picks = json.loads((ROOT/'src/config/homeColumnPicks.json').read_text())
        selected = home_column_picks(public, picks)
        home = '<section id="column"><a href="/column/">All</a>'+''.join(
            '<a href="/column/'+a['slug']+'/">'+a['title']+'</a>' for a in selected)+'</section>'
        pages = {'/': home, '/column/': ''.join('<a href="'+p+'">Article</a>' for p in paths),
                 '/sitemap.xml': '<urlset>'+''.join('<url><loc>'+live.BASE+p+'</loc></url>' for p in paths)+'</urlset>'}
        for article in public:
            texts=[article['summary'],*article.get('introduction',[])]
            for section in article['sections']:
                texts.append(section['title'])
                for b in section['blocks']:
                    texts.extend([b['text']] if b['type'] in ('paragraph','heading') else b['items'] if b['type']=='list' else [v for row in [b['headers'],*b['rows']] for v in row] if b['type']=='table' else [])
            node={'@type':'Article','headline':article['title'],'datePublished':article.get('publishedTimestamp',article['publishedAt'])}
            markup='<title>'+html.escape(article['seoTitle'])+'</title><link rel="canonical" href="'+live.BASE+'/column/'+article['slug']+'/"><h1>'+html.escape(article['title'])+'</h1>'
            markup+='<meta name="description" content="'+html.escape(article['metaDescription'],quote=True)+'"><meta property="og:title" content="'+html.escape(article['seoTitle'],quote=True)+'"><meta property="og:type" content="article">'
            markup+=''.join('<p>'+html.escape(t)+'</p>' for t in texts)+''.join('<a href="'+p+'">Related</a>' for p in paths)
            if article.get('image'):
                image=article['image'];markup+='<meta property="og:image" content="'+live.BASE+image['src']+'"><img src="'+image['src']+'" alt="'+html.escape(image['alt'],quote=True)+'">'
                pages[image['src']]=(ROOT/'public'/image['src'].lstrip('/')).read_bytes()
            pages['/column/'+article['slug']+'/']=markup+'<script type="application/ld+json">'+json.dumps(node)+'</script>'
        return records, public, pages

    def test_required_boundaries_and_live_surfaces(self):
        cases = [('2026-11-09T07:59:00+09:00', 8, 'lost-wallet', False),
                 ('2026-11-09T08:00:00+09:00', 9, 'lost-wallet', True),
                 ('2026-11-10T07:59:00+09:00', 9, 'dementia-forgetfulness', False),
                 ('2026-11-10T08:00:00+09:00', 10, 'dementia-forgetfulness', True),
                 ('2026-11-15T08:00:00+09:00', 15, 'care-insurance-age', True)]
        for stamp, count, slug, due in cases:
            with self.subTest(stamp=stamp):
                records, public, pages = self.fixture(stamp)
                self.assertEqual(len(public), count)
                self.assertEqual(any(a['slug']==slug for a in public), due)
                report = live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)
                self.assertEqual(report['publicArticles'], count)

    def test_stale_deployment_and_future_leak_fail(self):
        before = '2026-11-09T07:59:00+09:00'
        after = '2026-11-09T08:00:00+09:00'
        records, _, stale = self.fixture(before)
        with self.assertRaisesRegex(AssertionError, 'Missing due sitemap'):
            live.verify(records, dt.datetime.fromisoformat(after), stale.__getitem__)
        stale['/'] += '/column/lost-wallet/'
        with self.assertRaisesRegex(AssertionError, 'Future article leaked'):
            live.verify(records, dt.datetime.fromisoformat(before), stale.__getitem__)

    def test_newest_article_need_not_be_a_home_pick_but_must_be_published(self):
        stamp = '2026-11-24T12:00:00+09:00'
        records, public, pages = self.fixture(stamp)
        newest = '/column/'+public[0]['slug']+'/'
        self.assertNotIn(newest, pages['/'])
        report = live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)
        self.assertEqual(report['homePicks'], ['elderly-monitoring', 'lost-dog-preparation', 'lost-item-preparation'])
        self.assertEqual(report['latest'], newest)
        pages['/column/'] = pages['/column/'].replace(newest, '')
        with self.assertRaisesRegex(AssertionError, 'Missing due list entry'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)

    def test_home_pick_must_appear_in_column_section_not_elsewhere(self):
        stamp = '2026-11-24T12:00:00+09:00'
        records, _, pages = self.fixture(stamp)
        pages['/'] = pages['/'].replace('href="/column/elderly-monitoring/"', 'href="/column/lost-wallet/"')
        pages['/'] += '<a href="/column/elderly-monitoring/">Other section</a>'
        with self.assertRaisesRegex(AssertionError, 'HOME column picks'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)

    def test_unavailable_and_duplicate_picks_fall_back_without_future_exposure(self):
        stamp = '2026-11-09T07:59:00+09:00'
        records, public, pages = self.fixture(stamp)
        picks = ['lost-wallet', 'deleted-slug', 'elderly-monitoring', 'elderly-monitoring']
        # On this boundary, lost-wallet is not due; the next two display dates
        # after the explicit pick are Nov 8 and Nov 7.
        expected = ['elderly-monitoring', 'care-levels', 'lost-dog-preparation']
        pages['/'] = '<section id="column"><a href="/column/">All</a>'+''.join(
            '<a href="/column/'+slug+'/">Article</a>' for slug in expected)+'</section>'
        report = live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__, picks=picks)
        self.assertEqual(report['homePicks'], expected)
        # A revised display date affects only HOME fallback, not eligibility.
        eligible = [dict(a) for a in public]
        oldest = min(eligible, key=lambda a: a['publishedAt'])
        oldest['editionDate'] = '2026-12-01'
        self.assertEqual(home_column_picks(eligible, [])[0]['id'], oldest['id'])

    def test_wrong_latest_page_and_missing_related_fail(self):
        stamp = '2026-11-15T08:00:00+09:00'
        records, public, pages = self.fixture(stamp)
        latest = public[0]
        path = '/column/'+latest['slug']+'/'
        pages[path] = pages[path].replace('href="/column/'+latest['relatedArticleIds'][0]+'/"','href="/column/missing/"')
        with self.assertRaisesRegex(AssertionError, 'Due related link missing'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)
        pages[path] = 'wrong page'
        with self.assertRaisesRegex(AssertionError, 'individual page'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)

    def test_workflow_has_all_day_recovery_and_main_guard(self):
        workflow = (ROOT/'.github/workflows/deploy.yml').read_text()
        self.assertIn('cron: "50 22 * * *"', workflow)
        self.assertIn('cron: "13,43 * * * *"', workflow)
        self.assertIn("if: github.ref == 'refs/heads/main'", workflow)
        self.assertIn('cancel-in-progress: false', workflow)
        self.assertIn('run: python3 scripts/check-live-columns.py', workflow)
        self.assertIn('if: always()', workflow)
        self.assertIn('needs.plan.outputs.source', workflow)
        self.assertIn('main changed during the build', workflow)

    def test_live_network_failure_retries_and_fails_job(self):
        with patch.object(live,'urlopen',side_effect=OSError('unreachable')) as request, \
             patch.object(live.time,'sleep') as sleep, contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit) as error:
                live.main()
            self.assertEqual(error.exception.code,1)
            self.assertEqual(request.call_count,3)
            self.assertEqual(sleep.call_count,2)


if __name__ == '__main__':
    unittest.main()
