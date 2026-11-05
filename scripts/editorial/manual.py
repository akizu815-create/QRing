"""Convert explicitly entered fields to the existing private import packet. No AI/network."""
import re
import uuid
from . import core

FIELDS = {'title', 'slug', 'summary', 'seoTitle', 'metaDescription', 'category', 'primaryAudience',
          'searchIntent', 'primaryKeyword', 'topicClusterId', 'serviceSpecificationVersion', 'body', 'sources'}

def text(data, key, limit=20000):
    value = data.get(key)
    if not isinstance(value, str) or not value.strip() or len(value) > limit:
        raise ValueError('Required text field is missing or too long')
    return value.strip()

def sections(body):
    """Only ## headings and blank-line paragraphs; all other input remains literal text."""
    result = []; title = '本文'; paragraphs = []; heading_seen = False
    def flush():
        if not any(p.strip() for p in paragraphs): return
        blocks = [{'type':'paragraph','text':p.strip()} for p in re.split(r'\n\s*\n', '\n'.join(paragraphs)) if p.strip()]
        result.append({'id':'section-'+str(len(result)+1), 'title':title, 'blocks':blocks})
    for line in body.replace('\r\n','\n').replace('\r','\n').split('\n'):
        if line.startswith('## ') and line[3:].strip():
            if heading_seen and not any(p.strip() for p in paragraphs): raise ValueError('Heading has no body')
            flush(); title = line[3:].strip(); paragraphs = []; heading_seen = True
        else: paragraphs.append(line)
    flush()
    if not result or not result[-1]['blocks'] or not paragraphs or not any(p.strip() for p in paragraphs):
        raise ValueError('Body text required for every heading')
    return result

def packet(data):
    if not isinstance(data, dict) or set(data) != FIELDS: raise ValueError('Unexpected or missing manual fields')
    values = {k:text(data,k,100000 if k == 'body' else 20000) for k in FIELDS-{'sources'}}
    sources = data['sources']
    if not isinstance(sources,list) or not 1 <= len(sources) <= 20: raise ValueError('One to twenty sources required')
    article_sources = []; evidence = []; claims = []
    for i, source in enumerate(sources,1):
        if not isinstance(source,dict) or set(source) != {'label','href','checkedAt','excerpt','kind','claim'}: raise ValueError('Invalid source fields')
        s = {k:text(source,k) for k in source}
        if s['kind'] not in ['primary','trusted'] or len(s['excerpt']) < 20: raise ValueError('Source evidence required')
        source_id = 'source-'+str(i)
        article_sources.append({'id':source_id, **{k:s[k] for k in ['label','href','checkedAt']}})
        evidence.append({'sourceId':source_id,'url':s['href'],'checkedAt':s['checkedAt'],'excerpt':s['excerpt'],'kind':s['kind']})
        claims.append({'text':s['claim'],'sourceIds':[source_id],'verified':False})
    article = {k:v for k,v in values.items() if k != 'body'}
    article.update(id='manual-'+str(uuid.uuid4()), status='draft', publicationOrigin='editorial',
        publishedAt=core.today(),updatedAt=None,reviewedAt=None,nextReviewAt=None,contentRevision=1,
        approvalRevision=None,tags=[],relatedArticleIds=[],relatedService=None,cta='none',
        sources=article_sources,claims=claims,sections=sections(values['body']),validationResults=[],
        generationRunId=None,promptVersion=None)
    return {'article':article,'evidence':evidence}
