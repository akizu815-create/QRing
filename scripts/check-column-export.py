"""Verify the exported HTML, RSC, metadata and publication boundary without network access."""
import json, sys
sys.dont_write_bytecode = True
from pathlib import Path
from xml.etree import ElementTree as ET
from importlib.util import spec_from_file_location, module_from_spec
spec=spec_from_file_location('seo_audit',Path(__file__).with_name('seo-audit.py')); mod=module_from_spec(spec);spec.loader.exec_module(mod)
root=Path('out'); records=json.loads(Path('src/content/columns/published.json').read_text())
from column_export_support import published_articles
published=published_articles(records)
existing=[a for a in published if a.get('publicationOrigin')=='existing']
urls=[n.text for n in ET.parse(root/'sitemap.xml').findall('.//{*}loc')]
assert len(urls)==len(set(urls)), 'Duplicate sitemap URLs'
for a in published:
 path='/column/'+a['slug']+'/'
 p=mod.Page((root/path.strip('/')/'index.html').read_text())
 assert p.canonicals==['https://www.qring.jp'+path]
 assert p.titles==[a['seoTitle']]
 assert p.descriptions==[a['metaDescription']]
 assert sum(h['level']==1 for h in p.headings)==1
 assert 'https://www.qring.jp'+path in urls
 for text in a.get('introduction',[]): assert text in ''.join(p.main_text)
 if a.get('image'):
  assert f'property="og:image" content="https://www.qring.jp{a["image"]["src"]}"' in (root/path.strip('/')/'index.html').read_text()
  assert (root/a['image']['src'].lstrip('/')).is_file()
 for s in a['sections']:
  assert s['id'] in p.ids
  for b in s['blocks']:
   values=[b['text']] if b['type']=='paragraph' else b['items'] if b['type']=='list' else [cell for row in b['rows'] for cell in row] if b['type']=='table' else []
   for value in values: assert value in ''.join(p.main_text), f'{a["slug"]}: lost content {value[:30]}'
 nodes=[n for schema in p.schemas for n in schema.get('@graph',[schema])]
 assert sum(n.get('@type')=='Article' for n in nodes)==1
 if a.get('image'): assert next(n for n in nodes if n.get('@type')=='Article')['image']=='https://www.qring.jp'+a['image']['src']
 for node in nodes:
  assert node.get('dateModified') != '2026-11-05', 'Fabricated migration update date'
municipal=mod.Page((root/'column/audience/municipal/index.html').read_text())
assert municipal.canonicals==['https://www.qring.jp/column/audience/municipal/']
assert not any('noindex' in r for r in municipal.robots)
assert 'https://www.qring.jp/column/audience/municipal/' in urls
assert '/column/elderly-monitoring-contact-system/' in municipal.links
for route in ['column','column/audience/municipal', *['column/'+a['slug'] for a in existing]]:
 p=mod.Page((root/route/'index.html').read_text())
 for href in p.links:
  if href.startswith('/'):
   target=href.split('#')[0].split('?')[0].strip('/')
   assert (root/target/'index.html').is_file() or (root/target).is_file(), (route,href)
  if href.startswith('#'): assert href[1:] in p.ids, (route,href)
assert not list(Path('src/app/column').glob('elderly-monitoring/page.tsx'))
assert not list(Path('src/app/column').glob('lost-item-preparation/page.tsx'))
# Canary fixtures are synthetic and never committed. Scan every public text payload, not only HTML.
for file in root.rglob('*'):
 if file.is_file() and file.suffix in {'.html','.txt','.json','.js','.xml'}:
  payload=file.read_text(errors='ignore')
  assert 'PRIVATE_COLUMN_CANARY' not in payload, f'Unpublished content leaked into {file}'
  for a in records:
   if a not in published:
    assert a['title'] not in payload and '/column/'+a['slug']+'/' not in payload, f'Future/held article leaked into {file}: {a["slug"]}'
for a in records:
 if a not in published:
  assert not (root/'column'/a['slug']).exists(), f'Unpublished individual route: {a["slug"]}'
assert not list((root/'column').glob('private-column-canary-*'))
print('Static export: existing URLs/content/metadata/schema/anchors preserved; municipal article listed and listing indexed; unpublished canaries absent from HTML/RSC/JS/XML.')
