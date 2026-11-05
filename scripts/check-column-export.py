"""Verify the exported HTML, RSC, metadata and publication boundary without network access."""
import json, sys
sys.dont_write_bytecode = True
from pathlib import Path
from xml.etree import ElementTree as ET
from importlib.util import spec_from_file_location, module_from_spec
spec=spec_from_file_location('seo_audit',Path(__file__).with_name('seo-audit.py')); mod=module_from_spec(spec);spec.loader.exec_module(mod)
root=Path('out'); records=json.loads(Path('src/content/columns/published.json').read_text())
existing=[a for a in records if a.get('status')=='published' and a.get('publicationOrigin')=='existing']
urls=[n.text for n in ET.parse(root/'sitemap.xml').findall('.//{*}loc')]
assert len(urls)==len(set(urls)), 'Duplicate sitemap URLs'
for a in existing:
 path='/column/'+a['slug']+'/'
 p=mod.Page((root/path.strip('/')/'index.html').read_text())
 assert p.canonicals==['https://www.qring.jp'+path]
 assert p.titles==[a['seoTitle']]
 assert p.descriptions==[a['metaDescription']]
 assert sum(h['level']==1 for h in p.headings)==1
 assert 'https://www.qring.jp'+path in urls
 for s in a['sections']:
  assert s['id'] in p.ids
  for b in s['blocks']:
   values=[b['text']] if b['type']=='paragraph' else b['items'] if b['type']=='list' else [cell for row in b['rows'] for cell in row] if b['type']=='table' else []
   for value in values: assert value in ''.join(p.main_text), f'{a["slug"]}: lost content {value[:30]}'
 nodes=[n for schema in p.schemas for n in schema.get('@graph',[schema])]
 assert sum(n.get('@type')=='Article' for n in nodes)==1
 for node in nodes:
  assert node.get('dateModified') != '2026-11-05', 'Fabricated migration update date'
municipal=mod.Page((root/'column/audience/municipal/index.html').read_text())
assert municipal.canonicals==['https://www.qring.jp/column/audience/municipal/']
assert any('noindex' in r for r in municipal.robots)
assert 'https://www.qring.jp/column/audience/municipal/' not in urls
assert '該当する公開記事はまだありません。' in ''.join(municipal.main_text)
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
  assert 'PRIVATE_COLUMN_CANARY' not in file.read_text(errors='ignore'), f'Unpublished content leaked into {file}'
assert not list((root/'column').glob('private-column-canary-*'))
print('Static export: existing URLs/content/metadata/schema/anchors preserved; empty municipal listing noindex and excluded from sitemap; unpublished canaries absent from HTML/RSC/JS/XML.')
