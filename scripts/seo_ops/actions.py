"""A small action queue to plug into the existing editorial review flow, not a GSC replacement."""
import hashlib
import json
import re
from .analysis import normalized
from .store import utcnow

KEYWORDS={'elderly-dementia':['高齢','認知症','行方不明','見守り'],'family-care':['介護','家族','親'],'lost-items':['紛失','落とし物','忘れ物','鍵','財布'],'pets':['ペット','犬','猫','迷子札'],'municipal-community':['自治体','地域','実証','行政'],'business-safety':['施設','ホテル','企業'],'privacy-life':['プライバシー','電話番号','個人情報','電話 qr','電話 QR','QRコードから電話','qrコード 電話']}
def similarity(a,b):
    a=normalized(a);b=normalized(b)
    if not a or not b:return 0
    if a in b or b in a:return 1
    aa={a[i:i+2] for i in range(len(a)-1)};bb={b[i:i+2] for i in range(len(b)-1)}
    return len(aa&bb)/len(aa|bb) if aa|bb else 0

def action_queue(report,articles):
    from pathlib import Path
    published=[a for a in articles if a.get('status')=='published' and a.get('publishedAt','9999') <= (report.get('end') or report.get('latestAvailableDate') or '0000')]
    improvements=[]; topics=[]; seen=set(); observations=[]
    for a in report.get('articles',[]):
        c=a['candidate']
        improvements.append({'articleId':a['id'],'title':a['title'],'status':'hold' if c['state']=='pending' else 'review' if c['classes'] else 'monitor','classes':c['classes'],'reason':c['reasons'],'observedMetrics':a['current']['observed'],'queries':a['queries'],'evidenceDate':report.get('latestAvailableDate'),'aiAnalysis':'not_generated','publishedContentChanged':False})
        observations.extend((q,a['audience']) for q in a['queries'])
    observations.extend((q,None) for q in report.get('siteQueries',[]))
    root=Path(__file__).resolve().parents[2]
    for q,audience in observations:
        if q['brand'] or q['impressions']<5:continue
        key=normalized(q['query'])
        if key in seen:continue
        seen.add(key)
        categories=[cat for cat,words in KEYWORDS.items() if any(w in q['query'] for w in words)]
        if not categories:continue
        conflicts=[old['id'] for old in published if max(similarity(q['query'],old['title']),similarity(q['query'],old.get('primaryKeyword','')))>=.35]
        links=[{'articleId':old['id'],'path':'/column/'+old['slug']+'/','reason':'同じ課題に関連する公開記事'} for old in published if old['category'] in categories]
        target_audience=audience or ('municipal' if 'municipal-community' in categories else 'business' if 'business-safety' in categories else 'personal')
        for target in (['/municipalities/'] if target_audience=='municipal' else ['/service/']):
            if (root/'src/app'/target.strip('/')/'page.tsx').is_file(): links.append({'path':target,'reason':'関連する公式サービス案内'})
        topics.append({'query':q['query'],'observedImpressions':q['impressions'],'observedClicks':q['clicks'],'demand':'GSCの観測値。市場全体の月間検索数は未取得','categories':categories,'audience':target_audience,'audienceStatus':'inferred_editorial_target' if audience is None else 'article_target','conflictingArticleIds':conflicts,'action':'revise_existing' if conflicts else 'research_new_topic','proposedInternalLinks':links,'externalResearchRequired':True,'source':'gsc_observed_query'})
    topics.sort(key=lambda t:t['observedImpressions'],reverse=True)
    return {'state':report['state'],'latestAvailableDate':report.get('latestAvailableDate'),'periodEnd':report.get('end'),'dateBasis':'gsc_csv_period' if report['state']=='export_snapshot' else 'gsc_final_day','nextArticles':[t for t in topics if t['action']=='research_new_topic'][:10],'improveArticles':improvements,'overlapWarnings':[t for t in topics if t['conflictingArticleIds']],'newArticleGeneration':'unchanged; revision queue never stops the daily new-article job','notice':'SEOの集計画面はGSCを継続利用。これは編集アクション用の入力です。需要・競合・因果関係は未調査なら未確認と表示します。'}

def save_report(db,kind,report,queue):
    key=hashlib.sha256(json.dumps({'kind':kind,'start':report.get('start'),'end':report.get('end'),'data':queue},sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    with db:db.execute('INSERT OR IGNORE INTO reports VALUES(?,?,?,?,?,?)',(key,kind,report.get('start',''),report.get('end',''),utcnow(),json.dumps({'analysis':report,'actions':queue},ensure_ascii=False)))
    return key

def markdown(queue):
    date_line=(f'CSV集計期間の末日：{queue.get("periodEnd")}（最終実績日は日別データがある場合のみ確認可能）' if queue.get('dateBasis')=='gsc_csv_period' else f'取得可能な最新日：{queue.get("latestAvailableDate") or "未取得"}（GSC日付：米国太平洋時間）')
    lines=['# QRing SEO・次の編集アクション','',date_line,'', '## 次に作るべき記事','']
    if not queue['nextArticles']:lines.append('判断保留：十分な検索データまたは重複しないテーマの根拠がありません。毎日の新規記事生成を停止する指示ではありません。')
    for t in queue['nextArticles']:lines+=['- '+t['query']+f'：観測表示 {t["observedImpressions"]}、クリック {t["observedClicks"]}。外部調査後に企画化。']
    lines+=['','## 改善すべき記事・改善理由','']
    if not queue['improveArticles']:lines+=['未取得のため記事の改善判定は保留です。']
    for a in queue['improveArticles']:
        lines+=['### '+a['title'],'',f'状態：{a["status"]} ／ 判定区分：{", ".join(a["classes"]) or "未判定"}','',*['- '+r for r in a['reason']],'']
    lines+=['## 確認事項','',queue['notice'],'','既存記事の修正・公開は管理者の承認後に行います。']
    return '\n'.join(lines)+'\n'
