"""Verify actual publication content, every due route, and direct future-route denial."""
import datetime as dt
import hashlib
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET
from column_export_support import published_articles, home_column_picks, publication_order
from functools import cmp_to_key

BASE = 'https://www.qring.jp'

@dataclass
class Response:
    status: int
    body: object
    headers: object = None
    @property
    def text(self):
        return self.body.decode('utf-8', errors='replace') if isinstance(self.body, bytes) else self.body

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.h1=[]; self.title=[]; self.canonicals=[]; self.robots=[]; self.links=[]; self.images=[]
        self.meta={}; self.visible=[]; self.scripts=[]; self._h1=0; self._title=0; self._script=0; self._style=0
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='h1': self._h1+=1
        if tag=='title': self._title+=1
        if tag=='script': self._script+=1
        if tag=='style': self._style+=1
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='img': self.images.append(a)
        if tag=='link' and a.get('rel')=='canonical': self.canonicals.append(a.get('href'))
        if tag=='meta':
            self.meta[a.get('property',a.get('name',''))]=a.get('content','')
            if a.get('name','').lower() in ('robots','googlebot'): self.robots.append(a.get('content','').lower())
    def handle_endtag(self, tag):
        if tag=='h1': self._h1=max(0,self._h1-1)
        if tag=='title': self._title=max(0,self._title-1)
        if tag=='script': self._script=max(0,self._script-1)
        if tag=='style': self._style=max(0,self._style-1)
    def handle_data(self, text):
        if self._h1: self.h1.append(text)
        if self._title: self.title.append(text)
        if self._script: self.scripts.append(text)
        elif not self._style: self.visible.append(text)

class HomeColumnLinks(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth=0; self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='section' and (self.depth or a.get('id')=='column'): self.depth+=1
        if self.depth and tag=='a': self.links.append(a.get('href'))
    def handle_endtag(self,tag):
        if tag=='section' and self.depth: self.depth-=1

def compact(text): return re.sub(r'\s+','',text)

def public_at(records, now):
    original=os.environ.get('COLUMN_BUILD_AT')
    try:
        os.environ['COLUMN_BUILD_AT']=now.isoformat()
        return sorted(published_articles(records),key=cmp_to_key(publication_order))
    finally:
        if original is None: os.environ.pop('COLUMN_BUILD_AT',None)
        else: os.environ['COLUMN_BUILD_AT']=original

def verify(records, now, fetch, picks=None):
    public=public_at(records,now)
    paths={a['id']:'/column/'+a['slug']+'/' for a in records}
    cache={}
    def get(path):
        if path not in cache:
            try: value=fetch(path)
            except (KeyError,FileNotFoundError): value=Response(404,'') # local fixture adapters only
            cache[path]=Response(200,value) if isinstance(value,(str,bytes)) else value
        return cache[path]
    for path in ['/', '/column/', '/sitemap.xml']:
        assert get(path).status==200,f'Publication surface unavailable: {path}'
    home, listing, sitemap=(get(p).text for p in ['/', '/column/', '/sitemap.xml'])
    locations={n.text for n in ET.fromstring(sitemap).findall('.//{*}loc')}
    list_paths=sorted(url.removeprefix(BASE) for url in locations if url.startswith(BASE+'/column/page/'))
    targets=set(list_paths)|{paths[a['id']] for a in records}|{a['image']['src'] for a in public if a.get('image')}
    # Parallel reads, bounded to eight workers; each URL is fetched at most once per attempt.
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(get,sorted(targets)))
    lists=listing
    for path in list_paths:
        assert get(path).status==200,f'List pagination unavailable: {path}'
        lists+=get(path).text
    for a in public:
        path=paths[a['id']]
        assert BASE+path in locations,f'Missing due sitemap entry: {a["slug"]}'
        assert path in Page(lists).links,f'Missing due list entry: {a["slug"]}'
    if picks is None: picks=json.loads(Path('src/config/homeColumnPicks.json').read_text())
    selected=home_column_picks(public,picks); home_links=HomeColumnLinks();home_links.feed(home)
    expected_home=['/column/',*[paths[a['id']] for a in selected]]
    assert home_links.links==expected_home or (not selected and not home_links.links),'HOME column picks/fallback/order mismatch'
    for a in public:
        path=paths[a['id']];response=get(path)
        assert response.status==200,f'Due individual page unavailable: {a["slug"]}'
        page=Page(response.text)
        assert ''.join(page.h1)==a['title'],f'Due individual page title missing/wrong: {a["slug"]}'
        assert ''.join(page.title)==a['seoTitle'],f'SEO title mismatch: {a["slug"]}'
        assert page.canonicals==[BASE+path],f'Canonical mismatch: {a["slug"]}'
        assert page.meta.get('description')==a['metaDescription'],f'Description mismatch: {a["slug"]}'
        assert page.meta.get('og:title')==a['seoTitle'] and page.meta.get('og:type')=='article',f'OGP mismatch: {a["slug"]}'
        assert not any('noindex' in r or re.search(r'\bnone\b',r) for r in page.robots),f'Unexpected noindex: {a["slug"]}'
        headers={str(k).lower():str(v).lower() for k,v in (response.headers or {}).items()}
        assert not re.search(r'\b(?:noindex|none)\b',headers.get('x-robots-tag','')),f'HTTP noindex: {a["slug"]}'
        visible=compact(''.join(page.visible))
        for text in [a['summary'],*a.get('introduction',[])]:
            assert compact(text) in visible,f'Article lead missing/stale: {a["slug"]}'
        for section in a['sections']:
            assert compact(section['title']) in visible,f'Article section missing: {a["slug"]}'
            for b in section['blocks']:
                texts=[b['text']] if b['type'] in ('paragraph','heading') else b['items'] if b['type']=='list' else [v for row in [b['headers'],*b['rows']] for v in row] if b['type']=='table' else []
                assert all(compact(t) in visible for t in texts),f'Article body missing/stale: {a["slug"]}'
        schemas=[]
        for script in page.scripts:
            try: parsed=json.loads(script)
            except (ValueError,TypeError): continue
            if isinstance(parsed,dict): schemas.extend(parsed.get('@graph',[parsed]))
        articles=[n for n in schemas if isinstance(n,dict) and n.get('@type')=='Article']
        assert len(articles)==1 and articles[0].get('headline')==a['title'],f'Article JSON-LD mismatch: {a["slug"]}'
        assert articles[0].get('datePublished')==a.get('publishedTimestamp',a['publishedAt']),f'Article publication time mismatch: {a["slug"]}'
        if a.get('image'):
            image=a['image'];assert page.meta.get('og:image')==BASE+image['src'],f'OGP image mismatch: {a["slug"]}'
            assert any(i.get('src')==image['src'] and i.get('alt')==image['alt'] for i in page.images),f'Article image markup missing: {a["slug"]}'
            payload=get(image['src']);assert payload.status==200,f'Article image unavailable: {a["slug"]}'
            raw=payload.body if isinstance(payload.body,bytes) else payload.body.encode()
            assert raw.startswith((b'\x89PNG\r\n\x1a\n',b'\xff\xd8')) or (raw.startswith(b'RIFF') and raw[8:12]==b'WEBP'),f'Image response is not an image: {a["slug"]}'
        explicit=[r for r in public if r['id']!=a['id'] and r['id'] in a['relatedArticleIds']]
        incoming=[r for r in public if r['id']!=a['id'] and r['id'] not in a['relatedArticleIds'] and a['id'] in r['relatedArticleIds']]
        for related in (explicit+incoming)[:3]:
            assert paths[related['id']] in page.links,f'Due related link missing: {a["slug"]}'
    payloads=[response.text for path,response in cache.items() if not path.startswith('/images/') and response.status==200]
    for a in records:
        if a not in public:
            path=paths[a['id']]
            assert BASE+path not in locations and all(path not in text and a['title'] not in text for text in payloads),f'Future article leaked: {a["slug"]}'
            assert get(path).status in (404,410),f'Future article direct URL is accessible: {a["slug"]}'
    return {'verifiedAt':now.isoformat(),'publicArticles':len(public),'homePicks':[a['slug'] for a in selected],
            'latest':paths[public[0]['id']] if public else None,'individualPagesChecked':len(public),
            'unpublishedURLsChecked':len(records)-len(public),'live':'passed'}

def http_fetch(base, stamp):
    def fetch(path):
        request=Request(base.rstrip('/')+path+'?publication_check='+stamp,headers={'Cache-Control':'no-cache','User-Agent':'QRing-publication-verifier'})
        try:
            with urlopen(request,timeout=15) as r: return Response(r.status,r.read(),dict(r.headers))
        except HTTPError as error:
            if error.code in (404,410): return Response(error.code,error.read(),dict(error.headers))
            raise
    return fetch

def verify_with_retry(records, base=BASE, attempts=3, sleep=None, fetch_factory=None):
    if not re.fullmatch(r'https://[a-zA-Z0-9.-]+(?::\d+)?',base) and not re.fullmatch(r'http://127\.0\.0\.1:\d+',base): raise ValueError('Invalid verification origin')
    sleep = sleep or time.sleep
    for attempt in range(1,attempts+1):
        try:
            fetch=(fetch_factory or http_fetch)(base,str(time.time_ns()))
            return verify(records,dt.datetime.now(dt.timezone.utc),fetch)
        except Exception as error:
            print(f'Attempt {attempt}: {error}',file=sys.stderr)
            if attempt==attempts: raise
            sleep(10*attempt)

def main():
    records=json.loads(Path('src/content/columns/published.json').read_text())
    for file in sorted(Path('src/content/columns/revisions').glob('*/unpublished-drafts.json')):
        for a in json.loads(file.read_text()):
            if not any(r['id']==a['id'] or r['slug']==a['slug'] for r in records):records.append(a)
    try: report=verify_with_retry(records,os.environ.get('COLUMN_SITE_ORIGIN',BASE))
    except Exception:
        print('::error::Live publication verification failed; next scheduled run can rebuild and retry.',file=sys.stderr)
        raise SystemExit(1)
    print(json.dumps(report,ensure_ascii=False))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with Path(os.environ['GITHUB_STEP_SUMMARY']).open('a') as out: out.write('### Publication content verified\n\n```json\n'+json.dumps(report,ensure_ascii=False)+'\n```\n')

if __name__=='__main__': main()
