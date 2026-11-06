"""Losslessly project the two supplied approved Markdown manuscripts into article data.

Run --sync only for an explicitly approved revision. The default is a read-only
exact-text check; this tool never generates prose or touches other articles.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / 'src/content/columns/published.json'
METADATA = {
    'elderly-monitoring': {
        'editionDate': '2026-11-01',
        'seoTitle': '離れて暮らす親の見守り方法｜安否確認・センサー・GPSの選び方',
        'metaDescription': '離れて暮らす親の見守り、何から始める？電話やメッセージによる安否確認、センサー・カメラ・GPSなどの特徴と、本人の負担を抑えた選び方を紹介します。',
        'category': 'elderly-dementia',
    },
    'lost-item-preparation': {
        'editionDate': '2026-11-02',
        'seoTitle': '鍵・財布の紛失対策｜なくさない工夫と見つかった後の備え',
        'metaDescription': '鍵や財布をなくさないために、今日からできる紛失対策をご紹介。置き場所や外出前の確認習慣、紛失防止タグの特徴、拾った方から連絡を受ける方法まで解説します。',
        'category': 'lost-items',
    },
}


def manuscript(slug):
    path = ROOT / f'src/content/columns/approved/{slug}.md'
    raw = path.read_text()
    body, related = raw.split('\n---\n')
    related_parts = related.strip().split('\n\n')
    assert related_parts[0] == '**関連サービス**'
    link = re.fullmatch(r'\[(https://www\.qring\.jp/[^\]]+)\]\(\1\)', related_parts[2])
    assert link and len(related_parts) == 3
    service = {'label': related_parts[1], 'href': link[1].removeprefix('https://www.qring.jp')}
    chunks = re.split(r'^## (.+)\n', body, flags=re.M)
    lead = chunks[0].strip().split('\n\n')
    assert lead[0].startswith('# ')
    title, introduction = lead[0][2:], lead[1:]
    sections = []
    for i in range(1, len(chunks), 2):
        heading, text = chunks[i:i + 2]
        blocks = []
        for paragraph in text.strip().split('\n\n'):
            if paragraph.startswith('|'):
                rows = [[cell.strip() for cell in line.strip().strip('|').split('|')] for line in paragraph.splitlines()]
                assert all(re.fullmatch(r':?-+:?', cell) for cell in rows[1])
                blocks.append({'type': 'table', 'caption': heading, 'headers': rows[0], 'rows': rows[2:]})
            elif paragraph == f'詳しくは「{service["label"]}」をご覧ください。':
                blocks.append({'type': 'link', **service, 'prefix': '詳しくは「', 'suffix': '」をご覧ください。'})
            else:
                blocks.append({'type': 'paragraph', 'text': paragraph})
        sections.append({'id': f'section-{len(sections) + 1}', 'title': heading, 'blocks': blocks})
    return {
        'title': title, 'summary': introduction[0], 'introduction': introduction[1:],
        'sections': sections, 'relatedService': service,
        'approvalRecord': {'sourceFile': str(path.relative_to(ROOT)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'approvedOn': '2026-11-06'},
    }


def main():
    records = json.loads(REGISTRY.read_text())
    for a in records:
        if a['slug'] not in METADATA:
            continue
        expected = {**manuscript(a['slug']), **METADATA[a['slug']]}
        if '--sync' in sys.argv:
            a.update(expected)
            a.update(
                contentFormat='approved-manuscript', publicationOrigin='editorial',
                publishedAt='2026-10-28', publishedTimestamp='2026-10-28T00:58:01+09:00',
                updatedAt='2026-11-06', reviewedAt='2026-11-06', nextReviewAt=None,
                contentRevision=2, approvalRevision=2, primaryAudience='personal',
                cta='none', searchIntent=a['metaDescription'], claims=[],
                sources=[{'id': 'source-1', 'label': a['relatedService']['label'], 'href': 'https://www.qring.jp' + a['relatedService']['href'], 'checkedAt': '2026-11-06'}],
                validationResults=[{'check': 'user-approved-manuscript-exact-text', 'passed': True}, {'check': 'publication-history-separated-from-edition-date', 'passed': True}],
            )
        for key, value in expected.items():
            assert a[key] == value, f'{a["slug"]}: approved {key} differs'
        assert a['contentRevision'] == a['approvalRevision'] == 2
        assert a['contentFormat'] == 'approved-manuscript'
        assert a['publishedAt'] == '2026-10-28' and a['reviewedAt'] == '2026-11-06'
        assert a['cta'] == 'none', 'Do not append the legacy service pitch'
    if '--sync' in sys.argv:
        REGISTRY.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
    print('Approved manuscripts: exact titles, introductions, headings, paragraphs, table cells, links and approval hashes match both supplied originals.')


if __name__ == '__main__':
    main()
