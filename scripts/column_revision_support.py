"""Explicit, reviewable amendments to immutable supplied manuscripts.

Historical registration checks still compute their originals independently. The
amendment must match that original before it can supply a revised expectation.
No publish status or eligibility logic is changed here.
"""
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVISION_DIR = ROOT / 'src/content/columns/revisions/20261128'
MANIFEST = json.loads((REVISION_DIR / 'manifest.json').read_text())
REVISIONS = {r['slug']: r for r in MANIFEST['articles']}


def reviewed_expected(slug, expected, *, full=False):
    result = copy.deepcopy(expected)
    revision = REVISIONS.get(slug)
    if not revision:
        return result
    for key, change in revision['changes'].items():
        if key in expected or full:
            assert expected.get(key) == change['before'], f'{slug}: historical {key} changed before amendment'
            result[key] = copy.deepcopy(change['after'])
    return result


def manuscript_text(a):
    parts = ['# ' + a['title'], a['summary'], *a.get('introduction', [])]
    for section in a['sections']:
        parts.append('## ' + section['title'])
        for b in section['blocks']:
            if b['type'] == 'paragraph': parts.append(b['text'])
            elif b['type'] == 'heading': parts.append('### ' + b['text'])
            elif b['type'] == 'list': parts.append('\n'.join('- ' + item for item in b['items']))
            elif b['type'] == 'link': parts.append(b.get('prefix', '') + '[' + b['label'] + '](' + b['href'] + ')' + b.get('suffix', ''))
            elif b['type'] == 'table':
                rows = [b['headers'], ['---'] * len(b['headers']), *b['rows']]
                parts.append('\n'.join('| ' + ' | '.join(row) + ' |' for row in rows))
            else: raise AssertionError('Unrecognized manuscript block')
    if a.get('relatedService'):
        link = a['relatedService']
        parts.extend(['## 関連サービス', '[' + link['label'] + '](' + link['href'] + ')'])
    if a.get('manuscriptReferences'):
        parts.extend(['## 参考資料', *('[' + s['label'] + '](' + s['href'] + ')' for s in a['sources'])])
    return '\n\n'.join(parts) + '\n'


def verify_revision(a):
    r = REVISIONS[a['slug']]
    assert hashlib.sha256((ROOT / r['baseSourceFile']).read_bytes()).hexdigest() == r['baseSha256'], a['slug'] + ': historical receipt changed'
    for key, value in r['protected'].items():
        assert a.get(key) == value, f'{a["slug"]}: protected {key} changed'
    assert a['contentRevision'] == r['baseRevision'] + 1
    for key, change in r['changes'].items():
        assert a.get(key) == change['after'], f'{a["slug"]}: unrecorded revision of {key}'
    path = ROOT / a['approvalRecord']['sourceFile']
    assert path == ROOT / ('src/content/columns/approved/' + a['slug'] + '-reviewed.md')
    assert path.read_text() == manuscript_text(a), a['slug'] + ': manuscript text differs from structured content'
    assert hashlib.sha256(path.read_bytes()).hexdigest() == a['approvalRecord']['sha256']
    if a['status'] == 'draft':
        assert a['publicationPending'] is True and a['approvalRevision'] is None
        assert a['updatedAt'] is None
    else:
        assert a['status'] == 'published' and a['approvalRevision'] == a['contentRevision']
        assert a['updatedAt'] == '2026-11-28'
    assert a['reviewedAt'] == '2026-11-28'


def verify_archived_transition(active, draft):
    """A historical held snapshot must not permanently forbid an approved release.

    This validates fields/receipts, not human authorization; the release still
    requires the repository's review/merge approval. Never mutate either record.
    """
    assert active['id'] == draft['id'] and active['slug'] == draft['slug']
    assert active['contentRevision'] >= draft['contentRevision']
    if active['contentRevision'] == draft['contentRevision']:
        for key in ['title', 'summary', 'introduction', 'sections', 'seoTitle',
                    'metaDescription', 'image', 'publishedAt', 'publishedTimestamp']:
            assert active.get(key) == draft.get(key), f'{active["slug"]}: revise before changing {key}'
    if active['status'] in ['published', 'scheduled']:
        assert active['approvalRevision'] == active['contentRevision']
        assert active.get('publicationPending') is False
        receipt = active['approvalRecord']
        assert hashlib.sha256((ROOT / receipt['sourceFile']).read_bytes()).hexdigest() == receipt['sha256']


def main():
    public = json.loads((ROOT / 'src/content/columns/published.json').read_text())
    drafts = json.loads((REVISION_DIR / 'unpublished-drafts.json').read_text())
    assert len(drafts) == 2
    reviewed_public = [a for a in public if a['slug'] in REVISIONS and REVISIONS[a['slug']]['protected']['status'] == 'published']
    assert len(reviewed_public) == 28
    for draft in drafts:
        active = next((a for a in public if a['id'] == draft['id']), None)
        if active is not None: verify_archived_transition(active, draft)
    assert {a['slug'] for a in reviewed_public + drafts} == set(REVISIONS)
    for a in reviewed_public + drafts: verify_revision(a)
    print('November revision receipts, exact manuscript text, protected history/images and archived draft transitions: passed (30 reviewed records).')


if __name__ == '__main__': main()
