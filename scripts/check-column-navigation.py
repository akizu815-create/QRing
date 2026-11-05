"""Check crawlable HTML paths, newest-article selection, reciprocal links and orphans."""
import datetime as dt
import importlib.util
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
sys.dont_write_bytecode=True
spec=importlib.util.spec_from_file_location('seo',Path(__file__).with_name('seo-audit.py'));seo=importlib.util.module_from_spec(spec);spec.loader.exec_module(seo)
root=Path('out')
records=json.loads(Path('src/content/columns/published.json').read_text())
today=dt.datetime.now(dt.timezone(dt.timedelta(hours=9))).date().isoformat()
articles=[a for a in records if a.get('status')=='published' and a['publishedAt']<=today and (a.get('publicationOrigin')=='existing' and a['contentRevision']==1 or a.get('approvalRevision')==a['contentRevision'])]
articles.sort(key=lambda a:(-dt.date.fromisoformat(a['publishedAt']).toordinal(),a['slug']))
path=lambda a:'/column/'+a['slug']+'/'
html=lambda route:(root/route.strip('/')/'index.html').read_text()
parsed=lambda route:seo.Page(html(route))
sitemap=[n.text for n in ET.parse(root/'sitemap.xml').findall('.//{*}loc')]

def reachable_articles(base):
    todo=[base];seen=set();found=set()
    while todo:
        page=todo.pop()
        if page in seen:continue
        seen.add(page)
        p=parsed(page)
        for href in p.links:
            target=urlsplit(href).path
            if target in {path(a) for a in articles}:found.add(target)
            if re.fullmatch(re.escape(base)+r'page/[1-9][0-9]*/',target) and target not in seen:todo.append(target)
    return found,seen

found,pages=reachable_articles('/column/')
assert {path(a) for a in articles}<=found,'Orphaned article: not reachable through server-rendered list pagination'
municipal=[a for a in articles if a['primaryAudience']=='municipal']
found_m,pages_m=reachable_articles('/column/audience/municipal/')
assert {path(a) for a in municipal}<=found_m,'Municipal article missing from municipal list pagination'
for a in articles:
    p=parsed(path(a));assert 'https://www.qring.jp'+path(a) in sitemap
    explicit=[r for r in articles if r['id']!=a['id'] and r['id'] in a['relatedArticleIds']]
    incoming=[r for r in articles if r['id']!=a['id'] and r['id'] not in a['relatedArticleIds'] and a['id'] in r['relatedArticleIds']]
    related=(explicit+incoming)[:3]
    assert all(path(r) in p.links for r in related),'Related article link missing'
    if a['relatedService']:assert a['relatedService']['href'] in p.links,'Missing service return link'
    if a['primaryAudience']=='municipal':assert 'data-municipal-article-return' in html(path(a))
    for r in related:assert path(a) in parsed(path(r)).links,'Nonreciprocal authored related link'
for page in pages|pages_m:
    for href in parsed(page).links:
        u=urlsplit(href)
        if not u.scheme and u.path.startswith('/'):
            target=root/u.path.strip('/')
            assert target.is_file() or (target/'index.html').is_file(),f'Broken HTML link {page} → {href}'

home=html('/')
block=re.search(r'<section[^>]*id="column".*?</section>',home,re.S)
assert block,'Home COLUMN section missing'
assert seo.Page('<main>'+block[0]+'</main>').links==['/column/',*[path(a) for a in articles[:3]]],'Home newest articles/order or empty cards'
assert home.index('id="for-business"')<block.start()<home.index('最新のお知らせ'),'Incorrect HOME section placement'
for label in ['メインナビゲーション','モバイルナビゲーション']:
    nav=re.search(r'<nav[^>]*aria-label="'+label+r'".*?</nav>',home,re.S)[0]
    nav_links=[href.rstrip('/') for href in seo.Page(nav).links]
    assert nav_links.index('/price')<nav_links.index('/column')<nav_links.index('/news')
    assert 'https://axb.qring.jp/contact' in nav and '/municipalities/' in nav and 'https://axb.qring.jp/' in nav
footer=re.search(r'<nav[^>]*aria-label="フッターナビゲーション".*?</nav>',home,re.S)[0]
assert 'COLUMN' in footer and 'コラム' in footer and '見守り・紛失対策の選び方' not in footer
for slug in ['elderly','belongings','pets']:
    related=[a for a in articles if a.get('relatedService') and a['relatedService']['href']==f'/use-cases/{slug}/'][:3]
    view=html('/use-cases/'+slug+'/')
    if related:assert all(path(a) in parsed('/use-cases/'+slug+'/').links for a in related)
    else:assert f'id="{slug}-columns"' not in view,'Empty related section'
city=html('/municipalities/')
assert all(path(a) in parsed('/municipalities/').links for a in municipal[:3])
for alias in ['/column/page/1/','/column/audience/municipal/page/1/']:
    assert any('noindex' in r for r in parsed(alias).robots)
    assert 'https://www.qring.jp'+alias not in sitemap
for a in records:
    if a not in articles:
        assert not (root/'column'/a['slug']/'index.html').exists(),'Unpublished article exported'
print(json.dumps({'publicArticles':len(articles),'generalListPages':len(pages),'municipalListPages':len(pages_m),'orphanArticles':[],'navigation':'passed','newestArticles':'passed','reciprocalLinks':'passed'},ensure_ascii=False))
