"""Audit Next.js static exports using Python's standard library (no network calls)."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET

ROUTES = ['', 'about', 'service', 'price', 'news', 'faq', 'municipalities', 'contact', 'terms', 'privacy', 'law', 'use-cases/elderly', 'use-cases/pets', 'use-cases/belongings']
BASE = 'https://www.qring.jp'

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.titles, self.descriptions, self.canonicals, self.robots = [], [], [], []
        self.headings, self.images, self.links, self.ids, self.schemas = [], [], [], set(), []
        self.main_text = []
        self.in_main = self.in_title = False
        self.heading = None
        self.script = None
        self.script_text = ''
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'main': self.in_main = True
        if tag == 'title': self.in_title = True; self.titles.append('')
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name == 'description': self.descriptions.append(a.get('content', ''))
            if name == 'robots': self.robots.append(a.get('content', ''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'a': self.links.append(a.get('href', ''))
        if tag == 'img': self.images.append({'src': a.get('src'), 'alt': a.get('alt')})
        if tag == 'script': self.script = a.get('type', 'other'); self.script_text = ''
        if self.in_main and re.fullmatch('h[1-6]', tag):
            self.heading = {'level': int(tag[1]), 'text': ''}; self.headings.append(self.heading)
    def handle_endtag(self, tag):
        if tag == 'main': self.in_main = False
        if tag == 'title': self.in_title = False
        if self.heading and tag == 'h' + str(self.heading['level']): self.heading = None
        if tag == 'script':
            if self.script == 'application/ld+json': self.schemas.append(json.loads(self.script_text))
            self.script = None
    def handle_data(self, text):
        if self.script is not None: self.script_text += text; return
        if self.in_title: self.titles[-1] += text
        if self.in_main: self.main_text.append(text)
        if self.heading is not None: self.heading['text'] += text


def audit(root):
    pages = {}
    for route in ROUTES + ['shop']:
        file = root / route / 'index.html'
        p = Page(file.read_text())
        pages[route] = {'title': p.titles, 'description': p.descriptions, 'canonical': p.canonicals,
            'robots': p.robots, 'headings': p.headings, 'images': p.images,
            'structuredData': p.schemas, 'initialMainText': ' '.join(p.main_text), 'htmlBytes': file.stat().st_size}
    broken = []
    cache = {}
    for route in ROUTES:
        p = Page((root / route / 'index.html').read_text())
        for href in set(p.links):
            u = urlsplit(href)
            if u.scheme or u.netloc or not href: continue
            target = unquote(u.path) if u.path else '/' + route + ('/' if route else '')
            target = target.lstrip('/')
            file = root / target
            if not file.suffix: file /= 'index.html'
            if not file.is_file(): broken.append({'page': route or '/', 'href': href, 'reason': 'missing file'}); continue
            if u.fragment:
                if file not in cache: cache[file] = Page(file.read_text())
                if unquote(u.fragment) not in cache[file].ids: broken.append({'page': route or '/', 'href': href, 'reason': 'missing anchor'})
    sitemap = ET.parse(root / 'sitemap.xml')
    urls = [n.text for n in sitemap.findall('.//{*}loc')]
    result = {'pages': pages, 'brokenInternalLinks': broken, 'sitemap': urls,
        'sitemapHasLastModified': bool(sitemap.findall('.//{*}lastmod')),
        'robotsTxt': (root / 'robots.txt').read_text() if (root / 'robots.txt').exists() else None,
        'has404': (root / '404.html').exists()}
    return result

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--out', default='out'); ap.add_argument('--json', required=True); ap.add_argument('--check', action='store_true'); args = ap.parse_args()
    result = audit(Path(args.out)); Path(args.json).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    errors = []
    if args.check:
        expected = [BASE + '/' + r + ('/' if r else '') for r in ROUTES]
        if set(result['sitemap']) != set(expected): errors.append('sitemap routes differ from public canonical routes')
        if result['sitemapHasLastModified']: errors.append('lastModified must not be a fabricated build date')
        if not result['robotsTxt'] or BASE + '/sitemap.xml' not in result['robotsTxt']: errors.append('robots.txt/sitemap declaration missing')
        if result['brokenInternalLinks']: errors.append('broken internal links')
        all_ids = []
        for route, canonical in zip(ROUTES, expected):
            p = result['pages'][route]
            if len(p['title']) != 1 or len(p['description']) != 1: errors.append(route + ': metadata count')
            if p['canonical'] != [canonical]: errors.append(route + ': canonical')
            if sum(h['level'] == 1 for h in p['headings']) != 1: errors.append(route + ': H1 count')
            if any('noindex' in x for x in p['robots']): errors.append(route + ': public page noindex')
            if any(img['alt'] is None for img in p['images']): errors.append(route + ': missing alt')
            nodes = [n for s in p['structuredData'] for n in s.get('@graph', [s])]
            ids = [n.get('@id') for n in nodes if n.get('@id')]
            if len(ids) != len(set(ids)): errors.append(route + ': duplicate schema ids')
            if sum(n.get('@type') == 'WebPage' for n in nodes) != 1: errors.append(route + ': WebPage schema')
            if not p['initialMainText'].strip(): errors.append(route + ': empty main HTML')
            previous_level = 0
            for h in p['headings']:
                if h['level'] > previous_level + 1: errors.append(route + ': heading hierarchy skip')
                previous_level = h['level']
            all_ids.extend(ids)
        if len(all_ids) != len(set(all_ids)): errors.append('duplicate schema entity ids across pages')
        if len({tuple(p['title']) for r,p in result['pages'].items() if r in ROUTES}) != len(ROUTES): errors.append('duplicate page titles')
        if not any('noindex' in x for x in result['pages']['shop']['robots']): errors.append('old shop route must remain noindex')
        if not result['has404']: errors.append('404.html missing')
    print(json.dumps({'publicPages': len(ROUTES), 'brokenInternalLinks': result['brokenInternalLinks'], 'errors': errors}, ensure_ascii=False))
    raise SystemExit(1 if errors else 0)
