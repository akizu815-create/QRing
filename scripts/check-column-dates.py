"""Verify public dates/order against the approved registry, keeping approved article dates separate from publication history."""
import datetime as dt
from collections import Counter
import importlib.util
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('seo', Path(__file__).with_name('seo-audit.py'))
seo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seo)
root = Path('out')
now = dt.datetime.now(dt.timezone.utc)
records = json.loads(Path('src/content/columns/published.json').read_text())
from column_export_support import published_articles
articles = published_articles(records)


class Times(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.values = []
        self.current = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag == 'time':
            self.current = [dict(attrs).get('datetime'), '']

    def handle_data(self, data):
        if self.current is not None:
            self.current[1] += data

    def handle_endtag(self, tag):
        if tag == 'time' and self.current is not None:
            self.values.append(self.current)
            self.current = None


def display_date(day):
    d = dt.date.fromisoformat(day)
    return f'{d.year}年{d.month}月{d.day}日'


for a in articles:
    html = (root / 'column' / a['slug'] / 'index.html').read_text()
    p = seo.Page(html)
    article = re.search(r'<article[ >].*?</article>', html, re.S)[0]
    assert '原稿確認日：' not in article
    if a.get('editionDate'):
        assert '記事日：' in article
        assert [a['editionDate'], display_date(a['editionDate'])] in Times(article).values
    published_time = a.get('publishedTimestamp', a['publishedAt'])
    assert [published_time, display_date(a['publishedAt'])] in Times(article).values
    if a['updatedAt']:
        assert [a['updatedAt'], display_date(a['updatedAt'])] in Times(article).values
    graph = [n for schema in p.schemas for n in schema.get('@graph', [schema])]
    ids = [n['@id'] for n in graph if '@id' in n]
    assert len(ids) == len(set(ids)), f'{a["slug"]}: duplicate structured entity'
    node = next(n for n in graph if n.get('@type') == 'Article')
    assert node['datePublished'] == published_time
    assert node.get('dateModified') == a['updatedAt']
    assert f'property="article:published_time" content="{published_time}"' in html
    if a['updatedAt']:
        assert f'property="article:modified_time" content="{a["updatedAt"]}"' in html
    web_page = next(n for n in graph if n.get('@type') == 'WebPage')
    assert web_page['mainEntity']['@id'] == node['@id']
    assert web_page['breadcrumb']['@id'] in ids
    for link in a.get('relatedLinks', []):
        assert link['href'] in p.links

home = (root / 'index.html').read_text()
home_section = re.search(r'<section[^>]*id="column".*?</section>', home, re.S)[0]
home_times = Times(home_section).values
listing = (root / 'column/index.html').read_text()
listing_grid = listing.split('role="status"', 1)[1]
listing_times = Times(listing_grid).values
assert home_times == listing_times[:len(home_times)], 'HOME/list dates or ordering differ'
all_listing_times = list(listing_times)
pages = sorted((p for p in (root / 'column/page').glob('*/index.html') if p.parent.name.isdigit() and int(p.parent.name) > 1), key=lambda p: int(p.parent.name))
for page in pages:
    all_listing_times.extend(Times(page.read_text().split('role="status"', 1)[1]).values)
expected = [[a.get('editionDate', a['publishedAt']), display_date(a.get('editionDate', a['publishedAt']))] for a in articles]
assert Counter(map(tuple, all_listing_times)) == Counter(map(tuple, expected)), 'Missing article or approved article date mismatch'
assert '公開記事' in listing
print(json.dumps({'publicArticles': len(articles), 'publicDateConsistency': 'passed', 'homeAndListingOrder': 'passed', 'articleDatesSeparateFromPublication': 'passed', 'structuredEntityReferences': 'passed'}, ensure_ascii=False))
