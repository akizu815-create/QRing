"""Compare every original paragraph, list, link, table and source with migrated data."""
import json, re, subprocess
from pathlib import Path
records = json.loads(Path('src/content/columns/published.json').read_text())
checked = 0
for a in records:
    if a.get('publicationOrigin') != 'existing':
        continue
    checked += 1
    old = subprocess.check_output(['git', 'show', f'60ceb5c:src/app/column/{a["slug"]}/page.tsx'], text=True)
    original_sections = re.findall(r'<GuideSection id="([^"]+)" title="([^"]+)">(.*?)</GuideSection>', old, re.S)
    assert [(s['id'], s['title']) for s in a['sections']] == [(i,t) for i,t,_ in original_sections]
    methods = json.loads('[' + re.search(r'const methods = \[(.*?)\n\];',old,re.S).group(1).rstrip().rstrip(',') + ']')
    for (_,_,body), section in zip(original_sections,a['sections']):
        assert re.findall(r'<p(?: [^>]*)?>(.*?)</p>',body,re.S) == [b['text'] for b in section['blocks'] if b['type']=='paragraph']
        assert re.findall(r'<li>(.*?)</li>',body,re.S) == [i for b in section['blocks'] if b['type']=='list' for i in b['items']]
        assert re.findall(r'<Link href="([^"]+)"[^>]*>(.*?)</Link>',body,re.S) == [(b['href'],b['label']) for b in section['blocks'] if b['type']=='link']
        for b in section['blocks']:
            if b['type']=='table':
                assert b['rows']==methods
                assert b['headers']==re.findall(r'<th scope="col"[^>]*>(.*?)</th>',body)
    assert [(s['label'],s['href']) for s in a['sources']] == re.findall(r'\{ label: "([^"]+)", href: "([^"]+)" \}',old)
    assert a['title'] == re.search(r'\btitle="([^"]+)"',old).group(1)
    assert a['summary'] == re.search(r'\bintroduction="([^"]+)"',old).group(1)
print(f'Unrevised legacy records: {checked} checked against their historical source. Approved revisions are checked separately against supplied manuscripts.')
