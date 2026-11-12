"""Lossless registration of the eight PR #130 manuscripts. No prose generation.

Default: verify the registration. --sync: update only this batch's records/copies.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / 'src/content/columns/published.json'
STAGING = ROOT / 'src/content/columns/staging'
CHECKED = '2026-11-07'
MHLW = ('厚生労働省｜介護保険制度について', 'https://www.mhlw.go.jp/content/12300000/000362938.pdf')
LOST = ('警察庁｜落とし物・忘れ物', 'https://www.npa.go.jp/bureau/soumu/ishitsubutsu/otoshimono/')
BATCH = [
    dict(day=8, file='care-levels', slug='care-levels', category='family-care', audience='personal',
         alt='要支援・要介護の認定区分とサービス例を、高齢の夫婦に説明する女性の水彩イラスト',
         service='/use-cases/elderly/', related=[],
         sources=[('厚生労働省｜要介護認定はどのように行われるか', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/kaigo_koureisha/nintei/gaiyo2.html'), ('厚生労働省｜介護サービス情報公表システム', 'https://www.mhlw.go.jp/stf/kaigo-kouhyou.html'), MHLW]),
    dict(day=9, file='lost-wallet', slug='lost-wallet', category='lost-items', audience='personal',
         alt='なくした財布を思い浮かべ、警察への相談を考える高齢男性の水彩イラスト',
         service='/use-cases/belongings/', related=['lost-item-preparation'], sources=[LOST]),
    dict(day=10, file='dementia', slug='dementia-forgetfulness', category='elderly-dementia', audience='personal',
         alt='認知症や物忘れについて、診察室で医師に相談する高齢女性の水彩イラスト',
         service='/use-cases/elderly/', related=['dementia-early-signs'],
         sources=[('日本老年医学会｜認知機能の評価法と認知症の診断', 'https://www.jpn-geriat-soc.or.jp/tool/tool_02')]),
    dict(day=11, file='lost-property', slug='lost-property-retention', category='lost-items', audience='business',
         # User explicitly approved immediate publication on Nov 11, before 08:00 JST.
         publishedTimestamp='2026-11-11T00:03:38+09:00',
         alt='店舗の遺失物取扱所で、担当者と忘れ物の届出を確認する高齢女性の水彩イラスト',
         service='/use-cases/belongings/', related=['lost-wallet'],
         sources=[LOST, ('石川県警察｜落とし物・忘れ物（施設占有者の方へ）', 'https://www2.police.pref.ishikawa.lg.jp/information/information04/information010.html')]),
    dict(day=12, file='photo-location', slug='photo-location-privacy', category='privacy-life', audience='personal',
         # User requested immediate publication on Nov 12.
         publishedTimestamp='2026-11-12T05:52:51+09:00',
         alt='スマートフォンの写真に写った電柱や街並みから撮影場所が推測されることを示す水彩イラスト',
         service='/service/', related=['school-contact-list-privacy'],
         sources=[('IPA｜情報セキュリティ10大脅威 用語と仕組み（写真の位置情報）', 'https://www.ipa.go.jp/security/10threats/ps6vr7000000auzz-att/yougoyashikumi_2022.pdf'), ('岡山県｜写真をSNSにアップしてもいいですか？', 'https://www.pref.okayama.jp/uploaded/attachment/233419.pdf')]),
    dict(day=13, file='unidentified-elderly', slug='unidentified-elderly', category='municipal-community', audience='municipal',
         # User requested immediate publication on Nov 13.
         publishedTimestamp='2026-11-13T07:46:47+09:00',
         alt='身元を確認するため、高齢男性に警察官と女性が声をかける水彩イラスト',
         service='/municipalities/', related=['elderly-monitoring-contact-system'],
         sources=[('警察庁｜令和7年における行方不明者届受理等の状況', 'https://www.npa.go.jp/news/release/2026/20260625001.html'), ('国家公安委員会｜2026年6月25日記者会見要旨', 'https://www.npsc.go.jp/pressconf_2026/06_25.htm'), ('厚生労働省｜行方のわからない認知症高齢者等をお探しの方へ', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000052978.html'), ('岡山県｜身元不明の認知症高齢者等に関する情報', 'https://www.pref.okayama.jp/page/407947.html'), ('岐阜県｜身元不明で保護されている高齢者等に関する情報', 'https://www.pref.gifu.lg.jp/page/13791.html'), ('千葉県｜認知症と思われる身元不明者について', 'https://www.pref.chiba.lg.jp/koufuku/shien/ninchishou/mimotohumei.html')]),
    dict(day=14, file='dog-microchip', slug='dog-microchip', category='pets', audience='personal',
         alt='犬をなでる女性と、マイクロチップおよび専用読み取り機を示す水彩イラスト',
         service='/use-cases/pets/', related=['lost-dog-preparation'],
         sources=[('日本愛玩動物協会｜令和7年度全国愛玩動物飼養管理士の日の活動結果報告', 'https://www.jpc.or.jp/pdf/r7_02_report.pdf'), ('環境省｜犬と猫のマイクロチップ情報登録について', 'https://www.env.go.jp/nature/dobutsu/aigo/pickup/chip.html'), ('環境省｜令和7年版環境白書 第2部第2章第5節', 'https://www.env.go.jp/policy/hakusyo/r07/html/hj25020205.html')]),
    dict(day=15, file='care-insurance', slug='care-insurance-age', category='family-care', audience='personal',
         alt='介護サービスの利用の流れについて、窓口の担当者に相談する高齢女性の水彩イラスト',
         service='/use-cases/elderly/', related=['care-levels', 'senior-care-facility-types'],
         sources=[MHLW, ('厚生労働省｜第9期介護保険の第1号保険料等', 'https://www.mhlw.go.jp/stf/newpage_40211.html')]),
]


def registration(meta):
    source = STAGING / f'2026-11-{meta["day"]:02}-{meta["file"]}.md'
    chunks = re.split(r'^## (.+)\n', source.read_text(), flags=re.M)
    lead = chunks[0].strip().split('\n\n')
    assert lead[0].startswith('# ')
    title, intro = lead[0][2:], lead[1:]
    source_links = dict(meta['sources'])
    sections = []
    for i in range(1, len(chunks), 2):
        heading, text = chunks[i:i+2]
        blocks = []
        for para in text.strip().split('\n\n'):
            if para == '---':
                continue
            if para.startswith('|'):
                rows = [[c.strip() for c in line.strip().strip('|').split('|')] for line in para.splitlines()]
                assert all(re.fullmatch(r':?-+:?', c) for c in rows[1])
                blocks.append(dict(type='table', caption=heading, headers=rows[0], rows=rows[2:]))
            elif heading == '参考資料':
                for line in para.splitlines():
                    label = line.removeprefix('- ')
                    blocks.append(dict(type='link', label=label, href=source_links[label]))
            elif heading == '関連記事':
                assert para == '老人ホームって種類が多すぎ！何が違うの？'
                blocks.append(dict(type='link', label=para, href='/column/senior-care-facility-types/'))
            elif re.match(r'^\d+\. ', para):
                blocks.extend(dict(type='paragraph', text=line) for line in para.splitlines())
            else:
                blocks.append(dict(type='paragraph', text=para))
        assert blocks
        sections.append(dict(id=f'section-{len(sections)+1}', title=heading, blocks=blocks))
    date = f'2026-11-{meta["day"]:02}'
    approved = ROOT / f'src/content/columns/approved/{meta["slug"]}.md'
    sources = [dict(id=f'source-{i+1}', label=label, href=href, checkedAt=CHECKED) for i, (label, href) in enumerate(meta['sources'])]
    return dict(id=meta['slug'], slug=meta['slug'], title=title, summary=intro[0], introduction=intro[1:],
                seoTitle=title, metaDescription=intro[0], category=meta['category'], primaryAudience=meta['audience'], tags=[],
                status='published', publicationOrigin='editorial',
                publishedAt=date, editionDate=date, publishedTimestamp=meta.get('publishedTimestamp', date+'T08:00:00+09:00'), publicationPending=False,
                updatedAt=None, reviewedAt=None, nextReviewAt=None, serviceSpecificationVersion='2026-10-27',
                contentRevision=2 if meta['day']==11 else 1, approvalRevision=2 if meta['day']==11 else 1, contentFormat='approved-manuscript',
                approvalRecord=dict(sourceFile=str(approved.relative_to(ROOT)), sha256=hashlib.sha256(source.read_bytes()).hexdigest(), receivedOn=CHECKED),
                image=dict(src=f'/images/columns/{meta["slug"]}.webp', width=1280, height=853 if meta['day']==8 else 720, alt=meta['alt']),
                relatedArticleIds=meta['related'], relatedService=None,
                relatedLinks=[dict(href=meta['service'], label='つながるQRの関連サービスを見る')],
                **({} if meta['day']==8 else dict(manuscriptReferences=True)),
                sources=sources, sections=sections, cta='none', searchIntent=intro[0], primaryKeyword=title,
                topicClusterId=meta['category'], claims=[],
                validationResults=[dict(check='supplied-pr130-manuscript-exact-text',passed=True),dict(check='source-review-complete',passed=True)],
                generationRunId=None,promptVersion=None)


def main():
    records = json.loads(REGISTRY.read_text())
    expected = [registration(meta) for meta in BATCH]
    if '--sync' in sys.argv:
        for meta, article in zip(BATCH,expected):
            source = STAGING / f'2026-11-{meta["day"]:02}-{meta["file"]}.md'
            (ROOT / article['approvalRecord']['sourceFile']).write_bytes(source.read_bytes())
        batch_ids = {a['id'] for a in expected}
        records = [a for a in records if a['id'] not in batch_ids] + expected
        REGISTRY.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
    for article in expected:
        actual = next(a for a in records if a['id']==article['id'])
        assert actual == article, f'{article["slug"]}: registration differs'
        assert hashlib.sha256((ROOT/article['approvalRecord']['sourceFile']).read_bytes()).hexdigest()==article['approvalRecord']['sha256']
    print('PR #130: all eight titles, paragraphs, tables, numbered steps and references registered from supplied text and the authorized Nov 11 correction; all eight ready for scheduled builds after merge approval.')


if __name__ == '__main__':
    main()
