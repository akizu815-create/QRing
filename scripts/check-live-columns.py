"""Read-only verification of the deployed publication surfaces (no form/JS execution)."""
import datetime as dt
import json
import os
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
from column_export_support import published_articles, home_column_picks

BASE = 'https://www.qring.jp'


class HomeColumnLinks(HTMLParser):
    """Read links only in the HOME COLUMN section, not unrelated navigation."""
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section':
            if self.depth or attrs.get('id') == 'column':
                self.depth += 1
        if self.depth and tag == 'a':
            self.links.append(attrs.get('href'))

    def handle_endtag(self, tag):
        if tag == 'section' and self.depth:
            self.depth -= 1


def verify(records, now, fetch, picks=None):
    # The live expectation uses verification time, so a build just before a
    # deadline cannot silently pass after that deadline with yesterday's export.
    original = os.environ.get('COLUMN_BUILD_AT')
    try:
        os.environ['COLUMN_BUILD_AT'] = now.isoformat()
        public = published_articles(records)
    finally:
        if original is None:
            os.environ.pop('COLUMN_BUILD_AT', None)
        else:
            os.environ['COLUMN_BUILD_AT'] = original
    public.sort(key=lambda a: a.get('publishedTimestamp', a['publishedAt']), reverse=True)
    paths = {a['id']: '/column/'+a['slug']+'/' for a in records}
    home, listing, sitemap = fetch('/'), fetch('/column/'), fetch('/sitemap.xml')
    locations = {n.text for n in ET.fromstring(sitemap).findall('.//{*}loc')}
    for article in public:
        assert BASE+paths[article['id']] in locations, f'Missing due sitemap entry: {article["slug"]}'
    # Follow the currently indexed list pages instead of assuming a fixed count.
    lists = listing + ''.join(fetch(url.removeprefix(BASE)) for url in sorted(locations)
                             if url.startswith(BASE+'/column/page/'))
    for article in public:
        assert paths[article['id']] in lists, f'Missing due list entry: {article["slug"]}'
    if picks is None:
        picks = json.loads(Path('src/config/homeColumnPicks.json').read_text())
    selected = home_column_picks(public, picks)
    home_links = HomeColumnLinks()
    home_links.feed(home)
    assert home_links.links == ['/column/', *[paths[a['id']] for a in selected]], 'HOME column picks/fallback/order mismatch'
    if public:
        latest = public[0]
        path = paths[latest['id']]
        html = fetch(path)
        assert latest['title'] in html, 'Latest due individual page missing/wrong'
        for related in public:
            if related['id'] in latest['relatedArticleIds']:
                assert paths[related['id']] in html, 'Due related link missing'
    else:
        html = ''
    for article in records:
        if article not in public:
            path = paths[article['id']]
            assert BASE+path not in locations and path not in home+lists+html, f'Future article leaked: {article["slug"]}'
    return {'verifiedAt': now.isoformat(), 'publicArticles': len(public),
            'homePicks': [a['slug'] for a in selected],
            'latest': paths[public[0]['id']] if public else None, 'live': 'passed'}


def main():
    records = json.loads(Path('src/content/columns/published.json').read_text())
    errors = []
    for attempt in range(1, 4):
        stamp = str(time.time_ns())
        def fetch(path):
            request = Request(BASE+path+'?publication_check='+stamp,
                              headers={'Cache-Control': 'no-cache', 'User-Agent': 'QRing-publication-verifier'})
            with urlopen(request, timeout=15) as response:
                return response.read().decode('utf-8')
        try:
            report = verify(records, dt.datetime.now(dt.timezone.utc), fetch)
            print(json.dumps(report, ensure_ascii=False))
            if os.environ.get('GITHUB_STEP_SUMMARY'):
                with Path(os.environ['GITHUB_STEP_SUMMARY']).open('a') as out:
                    out.write('### Live publication verified\n\n```json\n'+json.dumps(report,ensure_ascii=False)+'\n```\n')
            return
        except Exception as error:
            errors.append(f'Attempt {attempt}: {error}')
            print(errors[-1], file=sys.stderr)
            if attempt < 3:
                time.sleep(10)
    print('::error::Live publication verification failed; inspect logs and the next scheduled retry.', file=sys.stderr)
    raise SystemExit(1)


if __name__ == '__main__':
    main()
