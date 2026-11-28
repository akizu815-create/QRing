"""Editorial review assistance, not entity recognition or publication authorization.

Only public-facing fields are scanned. Internal research excerpts may name a
company, but that does not authorize copying its name/URL into a public article.
"""
import re
import unicodedata
from urllib.parse import urlsplit

VERSION = 'column-naming-policy-20261128-v1'
CHECK = 'human-third-party-names-images-and-incident-facts-v1'
PUBLIC_FIELDS = ('title','seoTitle','metaDescription','summary','introduction','sections',
                 'sources','relatedLinks','relatedService','image','tags','openGraph','structuredData')
RESTRICTED = ('Google','Apple','Android','iPhone','iOS','LINE','AirTag','Tile','MAMORIO',
              'ChatGPT','OpenAI','Gemini','Claude','Anthropic','Microsoft','Amazon',
              'Facebook','Instagram','TikTok','デンソーウェーブ','デンソー','ソフトバンク',
              'NTTドコモ','KDDI','楽天','PHP研究所')
CONDITIONAL = ('NHK','日本郵便','郵便局','NTT','JR','Suica')
PRIVATE_HOSTS = ('google.com','apple.com','line.me','qrcode.com','denso-wave.com',
                 'openai.com','anthropic.com','microsoft.com','amazon.co.jp','amazon.com',
                 'mamorio.jp','tile.com','softbank.jp','docomo.ne.jp','docomo.jp','kddi.com')
CONDITIONAL_HOSTS = ('nhk.or.jp','japanpost.jp','ntt-east.co.jp','ntt-west.co.jp',
                     'jreast.co.jp','jr-central.co.jp','westjr.co.jp','jrkyushu.co.jp')
INCIDENT_WORDS = ('脆弱性','サイバー攻撃','不正アクセス','情報漏えい','個人情報漏洩',
                  '個人情報漏えい','サービス停止','システム障害')
GENERATION_RULES = '''特定の民間企業・商品・サービス・ホテル・スマートタグ・GPS機器・AI/通信/ITサービスを名指しで紹介・評価・宣伝・批判する記事は原則制作しない。主題は社会課題、生活上の疑問、科学、技術、制度、文化、心理、プライバシー等にする。国・行政・自治体・公的機関・大学・研究機関・法令・行政制度・公共サービス・公共性の高い社会インフラ、PHPやQRコード等の技術/規格名称、株式会社QRing・つながるQRは掲載可能。NHK・日本郵便・郵便局・NTT・JR・Suica等は公共性の高い事業の説明に必要な範囲だけ。一般の民間サービスを公共インフラと自己判断しない。協業先・実証先も代表者の個別承認なしに公開しない。民間企業の公式発表は内部の事実確認に利用できるが、その社名・サービス名・URLを公開出典へ自動転載しない。公的機関・大学・研究機関・公式技術文書・原著論文を優先するが、企業の公式技術文書であることだけで名称/URLの公開を許可しない。公開できる出典がない主張は意味を歪めず修正するか掲載しない。時事では脆弱性の存在/実悪用/不正アクセス/漏えい確認/漏えい可能性/調査中/予防停止/被害による停止/通常障害を厳格に区別し、公式資料にない因果関係を推測しない。企業の被害を批判や自社優位性の材料にしない。この方針は本文だけでなくタイトル・見出し・SEO・概要・参考資料・内外リンク・画像内文字/ロゴ・alt・OGP・構造化データにも適用する。個別判断は承認せずレビューへ回す。'''

def under(host, domain):
    return host == domain or host.endswith('.'+domain)

def public_host(host):
    return under(host,'pref.okayama.jp') or under(host,'qring.jp') or any(
        host.endswith('.'+suffix) for suffix in ('go.jp','lg.jp','ac.jp','edu','gov','gov.uk','gov.au'))

def strings(value, path):
    if isinstance(value,str): yield path,value
    elif isinstance(value,list):
        for i,v in enumerate(value): yield from strings(v,f'{path}[{i}]')
    elif isinstance(value,dict):
        for k,v in value.items(): yield from strings(v,f'{path}.{k}')

def term_in(term, text):
    term=unicodedata.normalize('NFKC',term).casefold()
    if term.isascii(): return bool(re.search(r'(?<![a-z0-9])'+re.escape(term)+r'(?![a-z0-9])',text))
    return term in text

def scan(article, related=()):
    findings=[]
    values=[(p,s) for key in PUBLIC_FIELDS for p,s in strings(article.get(key),key)]
    for i,a in enumerate(related):
        if a['id'] in article.get('relatedArticleIds',[]): values.append((f'relatedArticleIds[{i}].title',a['title']))
    for field,raw in values:
        text=unicodedata.normalize('NFKC',raw).casefold()
        # An internal asset path/URL is not a claim that a brand is absent in pixels.
        if field.endswith('.src') and raw.startswith('/'): continue
        urls=re.findall(r'https?://[^\s<>\"\)]+',raw)
        for url in urls:
            host=(urlsplit(url).hostname or '').lower()
            if any(under(host,d) for d in PRIVATE_HOSTS): kind='private-source'
            elif any(under(host,d) for d in CONDITIONAL_HOSTS): kind='public-infrastructure-context'
            elif public_host(host): continue
            else: kind='source-owner-review'
            findings.append({'kind':kind,'field':field,'value':url})
        if raw.startswith(('https://','http://')): continue
        for name in RESTRICTED:
            if term_in(name,text): findings.append({'kind':'restricted-name','field':field,'value':name})
        for name in CONDITIONAL:
            if term_in(name,text): findings.append({'kind':'public-infrastructure-context','field':field,'value':name})
        own_removed=text.replace('株式会社qring','').replace('株式会社 qring','')
        if re.search(r'株式会社|有限会社|合同会社',own_removed):
            findings.append({'kind':'company-owner-review','field':field,'value':raw[:180]})
        if any(w in raw for w in INCIDENT_WORDS):
            findings.append({'kind':'incident-facts-review','field':field,'value':raw[:180]})
    return {'policyVersion':VERSION,'humanReviewRequired':True,'findings':findings,
            'limits':['Known-name/domain matches only; not exhaustive entity recognition',
                      'Image pixels/logos, live redirects, factual causality and public-interest necessity require human review',
                      'OGP/JSON-LD generated from article metadata and shared layout require rendered-output review']}

def review_record(article, attested, note='', representative_reference='', related=()):
    if not isinstance(note,str) or not isinstance(representative_reference,str) or max(len(note),len(representative_reference))>2000: raise ValueError('Invalid policy review record')
    if attested is not True: raise ValueError('Explicit naming-policy, image/logo and incident-fact review required')
    report=scan(article,related)
    if report['findings'] and not note.strip(): raise ValueError('Record the naming-policy review and source/context decisions')
    restricted=any(f['kind'] in ('restricted-name','private-source','company-owner-review','source-owner-review') for f in report['findings'])
    if restricted and not representative_reference.strip():
        raise ValueError('Remove restricted public names/URLs or record representative individual approval reference')
    return {'policyVersion':VERSION,'revision':article['contentRevision'],'note':note.strip(),
            'representativeApprovalReference':representative_reference.strip(),'findings':report['findings'],
            'authorizationNotice':'Human reviewer records the evidence reference; this is not authenticated representative approval'}


def restricted_topic(text):
    return any(f['kind'] in ('restricted-name','company-owner-review','private-source') for f in scan({'title':text})['findings'])
