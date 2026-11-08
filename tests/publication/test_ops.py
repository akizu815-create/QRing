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
from column_export_support import published_articles


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
        pages = {'/': ''.join(paths[:3]), '/column/': ''.join(paths),
                 '/sitemap.xml': '<urlset>'+''.join('<url><loc>'+live.BASE+p+'</loc></url>' for p in paths)+'</urlset>'}
        for article in public:
            pages['/column/'+article['slug']+'/'] = article['title']+''.join(paths)
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

    def test_wrong_latest_page_and_missing_related_fail(self):
        stamp = '2026-11-15T08:00:00+09:00'
        records, public, pages = self.fixture(stamp)
        latest = public[0]
        path = '/column/'+latest['slug']+'/'
        pages[path] = latest['title']
        with self.assertRaisesRegex(AssertionError, 'Due related link missing'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)
        pages[path] = 'wrong page'
        with self.assertRaisesRegex(AssertionError, 'individual page'):
            live.verify(records, dt.datetime.fromisoformat(stamp), pages.__getitem__)

    def test_workflow_keeps_three_daily_attempts_and_main_guard(self):
        workflow = (ROOT/'.github/workflows/deploy.yml').read_text()
        self.assertIn('cron: "50 22 * * *"', workflow)
        self.assertIn('cron: "15,45 23 * * *"', workflow)
        self.assertNotIn('cron: "0 23 * * *"', workflow)
        self.assertIn("if: github.ref == 'refs/heads/main'", workflow)
        self.assertIn('cancel-in-progress: false', workflow)
        self.assertIn('run: python3 scripts/check-live-columns.py', workflow)
        self.assertIn('if: always()', workflow)

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
