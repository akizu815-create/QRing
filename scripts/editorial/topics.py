"""Editorial candidates, never measured demand or automatic publication instructions."""
from ..seo_ops.actions import similarity

TOPICS = [
    {'id':'telephone-qr-basics','category':'privacy-life','audience':'personal',
     'title':'電話番号QRの作り方・発信の仕組みと番号を掲載する際の注意点',
     'intents':['電話番号をQRコードにする方法','QRコードから電話をかける仕組み','通常の電話番号QRと番号非公開型QRの違い','電話番号を公開しない連絡方法'],
     'existingPages':['/service/'], 'preferExpansion':False},
    {'id':'elderly-qr-preparation','category':'elderly-dementia','audience':'personal',
     'title':'家族が準備する高齢者の見守りQR・シールと外出時の連絡手段',
     'intents':['高齢者向け見守りQRの仕組み','QR見守りシールの活用方法','認知症の方の外出対策'],
     'existingPages':['/use-cases/elderly/','/column/elderly-monitoring/'], 'preferExpansion':True},
    {'id':'municipal-qr-operation','category':'municipal-community','audience':'municipal',
     'title':'自治体のQRコード見守り施策で確認する配布・連絡体制・実証評価',
     'intents':['自治体のQRコード見守り施策'],
     'existingPages':['/municipalities/'], 'preferExpansion':True},
    {'id':'monitoring-contact-comparison','category':'family-care','audience':'personal',
     'title':'GPS型・伝言板型・電話連絡型の役割と限界',
     'intents':['GPS型・伝言板型・電話連絡型の違い'],
     'existingPages':['/column/elderly-monitoring/','/use-cases/elderly/'], 'preferExpansion':True},
]

def candidates(articles, observed):
    result = []
    for topic in TOPICS:
        conflicts = [a['id'] for a in articles if max(similarity(topic['title'],a['title']),*(similarity(intent,a.get('searchIntent','')) for intent in topic['intents'])) >= .35]
        demand = [q for q in observed if q.get('audience') == topic['audience'] and topic['category'] in q.get('categories',[]) and any(similarity(q['query'],intent) >= .35 for intent in topic['intents'])]
        result.append({**topic, 'conflictingArticleIds':conflicts,
                       'action':'review_existing_first' if topic['preferExpansion'] or conflicts else 'research_before_new_article',
                       'demandStatus':'gsc_observed_candidate' if demand else 'not_acquired', 'observations':demand,
                       'generationAuthorized':False})
    return result
