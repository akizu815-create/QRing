"""承認済み原稿を独立した照合用文字列とコードポイント単位で比較する。"""
import argparse
from pathlib import Path
from html.parser import HTMLParser

TITLE = '東京都中小企業振興公社「中小企業ニューマーケット開拓支援事業」に採択されました'
PARAGRAPHS = [
    '株式会社QRingの「つながるQR」は、公益財団法人東京都中小企業振興公社が実施する「中小企業ニューマーケット開拓支援事業」の支援対象製品として採択されました。',
    'つながるQRは（公財）東京都中小企業振興公社 中小企業ニューマーケット開拓支援事業の支援対象製品です。',
    '※但し、公社は製品の効能効果を保証するものではありません',
]
class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.groups, self.paragraph, self.depth, self.copy_depth, self.text, self.skip = [], None, 0, None, [], 0
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ['script','style']: self.skip += 1
        if tag == 'div':
            self.depth += 1
            if 'data-approved-support-copy' in attrs:
                self.copy_depth = self.depth; self.groups.append([])
        if tag == 'p' and self.copy_depth is not None: self.paragraph = ''
    def handle_endtag(self, tag):
        if tag == 'p' and self.paragraph is not None:
            self.groups[-1].append(self.paragraph); self.paragraph = None
        if tag == 'div':
            if self.depth == self.copy_depth: self.copy_depth = None
            self.depth -= 1
        if tag in ['script','style']: self.skip -= 1
    def handle_data(self, text):
        if not self.skip: self.text.append(text)
        if self.paragraph is not None: self.paragraph += text

ap = argparse.ArgumentParser(); ap.add_argument('--out', default='out'); ap.add_argument('--mode', choices=['news-only','proposals','disabled'], default='news-only'); args=ap.parse_args()
root=Path(args.out)
if args.mode == 'disabled':
    for file in root.rglob('*.html'):
        doc=Document(file.read_text()); text=''.join(doc.text)
        assert not doc.groups, file
        assert all(s not in text for s in [TITLE,*PARAGRAPHS]), file
    assert '/news/newmarket-support/' not in (root/'sitemap.xml').read_text()
    print('PASS: 使用停止時は全HTML・sitemapから対象原稿を除外')
else:
    expected={'news':1,'news/newmarket-support':1,'':0,'service':0,'municipalities':0,'collaboration':0}
    if args.mode=='proposals': expected.update({'':1,'service':1,'municipalities':1,'collaboration':1})
    for route,count in expected.items():
        doc=Document((root/route/'index.html').read_text())
        assert len(doc.groups)==count,(route,len(doc.groups),count)
        for group in doc.groups: assert group==PARAGRAPHS,(route,group)
        if route in ['', 'news','news/newmarket-support']: assert TITLE in ''.join(doc.text),route
    print('PASS: タイトルと全3段落が完全一致、掲載範囲も一致 ('+args.mode+')')
