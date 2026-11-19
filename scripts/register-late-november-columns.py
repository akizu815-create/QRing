"""Register the supplied Nov 17–30 manuscripts as held drafts; preserve the explicitly authorized Nov 17 release.

The checked-in source, edited Markdown and unified diffs make every edit reviewable.
Default mode checks the deterministic projection; --sync updates only this batch.
"""
import difflib
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / 'docs/columns-november-17-30'
REGISTRY = ROOT / 'src/content/columns/published.json'
CHECKED = '2026-11-16'

SOURCES = {
    'dog': ('Gábor et al. (2022)｜The acoustic bases of human voice identity processing in dogs（Animal Cognition）', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9334438/'),
    'young': ('厚生労働省｜主な認知症施策について（若年性認知症施策）', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000076236_00006.html'),
    'young-support': ('厚生労働省｜若年性認知症のガイドライン・取組事例', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000167853.html'),
    'card': ('金融庁｜あなたのキャッシュカードが狙われています', 'https://www.fsa.go.jp/ordinary/card/'),
    'lost': ('警察庁｜遺失届とは？遺失届のポイント', 'https://www.npa.go.jp/bureau/soumu/ishitsubutsu/otoshimono/loss.html'),
    'history': ('デンソーウェーブ｜QRコードの道のり', 'https://www.qrcode.com/history/'),
    'cat': ('Saito & Shinozuka (2013)｜Vocal recognition of owners by domestic cats (Felis catus)', 'https://pubmed.ncbi.nlm.nih.gov/23525707/'),
    'cat-uni': ('東京大学｜ツレない猫、答えないけど飼い主の声聞き分ける', 'https://www.u-tokyo.ac.jp/focus/ja/press/p01_250327_02.html'),
    'fall': ('消費者庁｜高齢者の事故を防ぐために', 'https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_055/'),
    'fall-check': ('国立長寿医療研究センター｜高齢者のための転倒防止セルフチェック', 'https://www.ncgg.go.jp/hospital/tento/'),
    'apple': ('Apple｜SOSを使ってiPhoneで緊急通報サービスに連絡する', 'https://support.apple.com/ja-jp/guide/iphone/iph3c99374c/ios'),
    'android': ('Google｜Androidスマートフォンを使用して緊急時に助けを求める', 'https://support.google.com/android/answer/9319337?hl=ja'),
    'sos-news': ('Apple｜日本での衛星経由の緊急SOS提供開始と緊急通報の基本操作', 'https://www.apple.com/jp/newsroom/2024/07/emergency-sos-via-satellite-available-today/'),
    'sms': ('IPA｜情報セキュリティ安心相談窓口の相談状況（2025年第1四半期）', 'https://www.ipa.go.jp/security/anshin/reports/2025q1outline.html'),
    'privacy': ('個人情報保護委員会｜携帯電話番号やクレジットカード番号は個人識別符号に該当しますか', 'https://www.ppc.go.jp/all_faq_index/faq1-q1-25/'),
    'contacts': ('LINEヘルプセンター｜アドレス帳の情報の利用について', 'https://help.line.me/line/?contentId=10002423&lang=ja'),
    'quake': ('気象庁｜地震予知について', 'https://www.jma.go.jp/jma/kishou/know/faq/faq24.html'),
    'pets-disaster': ('環境省｜ペットの災害対策', 'https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html'),
    'consent': ('厚生労働省｜認知症の人の日常生活・社会生活における意思決定支援ガイドライン', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000212395.html'),
    'qr': ('デンソーウェーブ｜QRコードとは？', 'https://www.qrcode.com/about/'),
    'qr-safety': ('警視庁｜QRコードを利用する時の注意点', 'https://www.keishicho.metro.tokyo.lg.jp/kurashi/cyber/notes/qrcord.html'),
    '171': ('NTT東日本｜災害用伝言ダイヤル（171）概要とご提供のしくみ', 'https://www.ntt-east.co.jp/saigai/voice171s/intro.html'),
    'web171': ('NTT東日本｜災害用伝言板（web171）', 'https://www.ntt-east.co.jp/saigai/web171/'),
    'memory': ('Craik et al. (1996)｜The effects of divided attention on encoding and retrieval processes in human memory', 'https://macal.missouri.edu/assets/doc/pubs/EffectsDividedAttentionEncodingRetrieval.pdf'),
    'memory-health': ('米国国立医学図書館 MedlinePlus｜Memory loss', 'https://www.medlineplus.gov/ency/article/003257.htm'),
    'service': ('株式会社QRing｜つながるQR サービス紹介', 'https://www.qring.jp/service/'),
}

# Slugs are fixed editorial identifiers. Related ids may reference future drafts;
# both the existing related selector and the body-link renderer filter them at build time.
BATCH = [
    dict(day=17, slug='dog-owner-voice', category='pets', keyword='犬 飼い主 声 聞き分け',
         tags=['犬の聴覚', '声の認識'], sources=['dog'], related=['cat-owner-memory', 'dog-microchip', 'lost-dog-preparation'], service='pets',
         lead=['犬は声の特徴を手がかりに、飼い主とほかの人を聞き分けられると考えられています。同じ呼びかけでも、誰が話すかで反応が違って見えるのは、顔やにおい以外の情報も使っているからです。',
               '声を覚えることと、言葉の意味を理解することは同じではありません。研究でわかったことと、日々の接し方を分けて見ていきます。'],
         ending='声かけを日々のやり取りに生かす', overlap='既存の迷子対策・マイクロチップとは異なる動物の声認識。猫記事とは種と研究を分ける。'),
    dict(day=18, slug='young-onset-dementia', category='elderly-dementia', keyword='若年性認知症 何歳から',
         tags=['65歳未満', '認知症 相談'], sources=['young', 'young-support'], related=['dementia-early-signs', 'dementia-forgetfulness', 'monitoring-and-surveillance'], service='elderly',
         lead=['認知症は65歳未満でも発症することがあり、その場合は「若年性認知症」と呼ばれます。何歳なら心配ない、と年齢だけで判断することはできません。',
               '働いている時期の発症では、医療に加えて仕事や家計、家族の生活への支援も必要になります。以前との変化が続くときの相談先を整理します。'],
         ending='年齢だけで判断せず相談する', overlap='既存の初期症状・物忘れ記事に対し、65歳未満の就労・生活支援と相談先が中心。'),
    dict(day=19, slug='wallet-contents-safety', category='lost-items', keyword='財布 入れてはいけないもの',
         tags=['財布 紛失', '暗証番号 管理'], sources=['card', 'lost'], related=['lost-wallet', 'lost-item-preparation', 'why-we-misplace-things'], service='belongings',
         lead=['財布をなくすと、現金だけでなく、カードや本人確認書類の手続きにも追われます。特にキャッシュカードと暗証番号のメモを一緒に持ち歩くことは避けたい組み合わせです。',
               '現金、クレジットカード、身分証明書、ポイントカード。毎日必要なものと、使わないまま入れているものを分けることが、紛失したときの被害を抑える備えになります。'],
         ending='紛失した後の負担を減らす整理', overlap='11/9は紛失直後の対応、本記事は持ち歩く前の中身整理。'),
    dict(day=20, slug='qr-code-inventor', category='privacy-life', keyword='QRコード 発明者',
         tags=['QRコード 歴史', 'QRコード 1994年'], sources=['history', 'qr', 'service'], related=['qr-code-scan-mechanism', 'number-private-calls'], service='service',
         lead=['QRコードは1994年、デンソーの原昌宏氏らの開発チームが生み出した日本発の技術です。始まりは、自動車部品などの製造現場で情報を効率よく扱いたいという課題でした。',
               '買い物の決済、レストランのメニュー、イベントのチケット。いま目にする使い道から少し離れて、発明の背景をたどります。'],
         ending='製造現場から暮らしの中へ', overlap='SERVICEの使い方ではなく発明史。11/27はスキャン処理を担当。'),
    dict(day=21, slug='cat-owner-memory', category='pets', keyword='猫 飼い主 何日 覚えている',
         tags=['猫 記憶', '猫 飼い主の声'], sources=['cat', 'cat-uni'], related=['dog-owner-voice'], service='pets',
         lead=['猫が飼い主を何日で忘れるのか、すべての猫に当てはまる日数はわかっていません。旅行や出張のあとにそっけなく見えても、それだけで忘れられたとは判断できません。',
               '一方、飼い主の声を聞き分ける反応は研究されています。記憶が続く期間と、目の前の反応を区別して考えてみます。'],
         ending='再会は猫のペースに合わせる', overlap='猫の記憶期間への疑問と声認識。犬記事や迷子時の行動解説と区別。'),
    dict(day=22, slug='elderly-fall-prevention', category='family-care', keyword='高齢者 転倒 原因 予防',
         tags=['家庭内 転倒', '転倒予防'], sources=['fall', 'fall-check'], related=['elderly-monitoring', 'monitoring-and-surveillance'], service='elderly',
         lead=['高齢者の転倒には、筋力やバランス能力の変化だけでなく、床の段差、照明、体調や薬など複数の要因が関わります。年齢だけの問題として片付けず、住環境と身体の状態を合わせて確認する必要があります。',
               '「何もないところでつまずく」「以前より歩くのが不安そう」。こうした変化に気づいたら、声をかけるだけでなく家の中も見直してみてください。'],
         ending='住まいと身体の両面から備える', overlap='既存の見守り手段選びに対し、身体・住環境の転倒要因が中心。'),
    dict(day=23, slug='smartphone-emergency-sos', category='privacy-life', keyword='スマホ 緊急SOS 設定',
         tags=['iPhone 緊急SOS', 'Android 緊急情報'], sources=['apple', 'android', 'sos-news'], related=['disaster-family-contact'], service=None,
         lead=['緊急SOSは、スマートフォンから緊急通報につなげるための機能です。機種やOS、地域によって操作や通知の条件が違うため、自分の端末の設定を事前に確認しておく必要があります。',
               '事故や急病のときに使う機能だからこそ、普段のうちに知っておきたいもの。ただし、確認のために実際の緊急通報を発信することは避けてください。'],
         ending='通報せずに設定と条件を確認する', overlap='11/28の災害時の家族連絡とは、緊急通報・端末設定という目的を分ける。'),
    dict(day=24, slug='phone-number-personal-information', category='privacy-life', keyword='電話番号 個人情報 住所 名前',
         tags=['電話番号 特定', '連絡先 プライバシー'], sources=['privacy', 'contacts', 'sms', 'service'], related=['unknown-calls', 'photo-location-privacy', 'number-private-calls'], service='service',
         lead=['電話番号だけで、誰でも契約者の住所や氏名を正確に調べられるわけではありません。ただし、ウェブサイトやSNSなどで公開した情報と番号が結びついていれば、名前や活動内容を知る手がかりになります。',
               '初対面の相手に番号を伝える前に、何がわかり得るのか、何には直結しないのかを整理しておきましょう。'],
         ending='番号と公開情報の結び付きを見直す', overlap='11/16は不審な着信への対応、本記事は番号と公開情報の関連付け。11/30やSERVICEとの重複に注意し、通話手順の説明を増やさない。'),
    dict(day=25, slug='pets-earthquake-prediction', category='pets', keyword='犬 猫 地震 予知 根拠',
         tags=['ペット 防災', '地震 動物 行動'], sources=['quake', 'pets-disaster'], related=['dog-microchip', 'lost-dog-preparation', 'disaster-family-contact'], service='pets',
         lead=['犬や猫の行動から地震の発生を確実に予測する方法は、科学的に確立されていません。「地震の前に犬が吠えた」「猫が急に隠れた」という体験談と、予知に使える根拠は分けて考える必要があります。',
               '動物の感覚への関心を、防災の判断そのものに置き換えることはできません。研究上の限界を確認し、飼い主ができる備えを見ていきます。'],
         ending='予知に頼らず避難の準備をする', overlap='動物の予知の科学的限界とペット防災。11/28は人の連絡手段。'),
    dict(day=26, slug='monitoring-and-surveillance', category='family-care', keyword='見守り 監視 違い',
         tags=['高齢者 プライバシー', '見守り 本人の意思'], sources=['consent', 'privacy', 'service'], related=['elderly-monitoring', 'elderly-monitoring-contact-system', 'young-onset-dementia'], service='elderly',
         lead=['見守りと監視は、機器の種類だけでは分けられません。何のために、誰が、どこまで情報を確認するのか。その目的や使い方、本人の受け止め方によって意味が変わります。',
               '離れて暮らす親や、帰宅が遅い子どもを心配する気持ちは自然です。その安心のために、本人にどんな負担が生じるかも考えておきたいところです。'],
         ending='本人と共有する情報の範囲を決める', overlap='既存の見守り比較記事に対し、本人の意思・共有範囲を中心とする編集的な整理。法的な定義として断定しない。'),
    dict(day=27, slug='qr-code-scan-mechanism', category='privacy-life', keyword='QRコード スキャン 仕組み',
         tags=['QRコード URL', 'QRコード 安全'], sources=['qr', 'qr-safety', 'service'], related=['qr-code-inventor', 'number-private-calls'], service='service',
         lead=['QRコードをスキャンすると、スマートフォンが模様に記録された文字列やURLなどを取り出します。コード自体が通信しているのではなく、取り出したURLを端末が開くことでウェブサイトにアクセスします。',
               'あの四角い模様に何が入っているのか。スキャンの流れを知ると、便利さだけでなく、リンク先を確認する理由も見えてきます。'],
         ending='スキャン後の表示を確かめる', overlap='11/20の歴史と分け、読み取りからURLを開く過程と安全確認に限定。SERVICEの通話操作記事と分担。'),
    dict(day=28, slug='disaster-family-contact', category='family-care', keyword='災害 家族 連絡 取れない 171',
         tags=['災害 安否確認', 'web171'], sources=['171', 'web171'], related=['smartphone-emergency-sos', 'pets-earthquake-prediction'], service=None,
         lead=['災害時に家族へ電話がつながらない場合に備え、災害用伝言ダイヤル171や災害用伝言板など、複数の安否確認方法を知っておきましょう。どれを使うか、連絡できないときにどこへ避難するかは、平時に家族で決めておくと動きやすくなります。',
               '大きな地震のあとには、通信の集中や設備の被害、停電で電話が使いにくくなることがあります。ふだんの電話だけに頼らない準備を整理します。'],
         ending='連絡方法と避難先を平時に共有する', overlap='11/23の端末による緊急通報に対し、家族の伝言・安否確認・避難先が中心。'),
    dict(day=29, slug='why-we-misplace-things', category='lost-items', keyword='物をなくす 注意 記憶 置き忘れ',
         tags=['忘れ物 予防', '注意と記憶'], sources=['memory', 'memory-health'], related=['wallet-contents-safety', 'lost-item-preparation', 'dementia-forgetfulness'], service='belongings',
         lead=['物をなくす理由は、記憶力の低下だけとは限りません。置いた瞬間に別のことへ注意が向いていて、場所を十分に覚えていないこともあります。',
               '「さっきまで持っていた鍵が見つからない」「スマートフォンをどこに置いたかわからない」。身近な置き忘れを、注意と記憶の関係から考えます。'],
         ending='置くときの注意と定位置を習慣にする', overlap='既存の紛失対策とは原因の理解が中心。11/19は財布の収納、本記事は注意・記銘。認知症と直結させない。'),
    dict(day=30, slug='number-private-calls', category='privacy-life', keyword='電話番号 教えず 通話',
         tags=['プライバシー電話番号', 'QRコード 通話'], sources=['service'], related=['phone-number-personal-information', 'qr-code-scan-mechanism', 'lost-wallet'], service='service',
         lead=['個人の電話番号を相手に表示せずに、声で連絡する方法があります。つながるQRは、プライバシー電話番号を介して、QRコードをスキャンした発見者と登録者の通話をつなぐサービスです。',
               '落とし物の連絡など、その場で話したくても個人の連絡先を直接交換したくない場面があります。相手への非開示と、サービス提供者による番号の取り扱いを分けて確認します。'],
         ending='相手への非開示と利用条件を確認する', overlap='SERVICEとの検索意図重複が最も高い。中心ページは/service/のまま、当記事は利用場面・非開示と事業者取扱いの違いを説明する補助記事。承認時に要確認。'),
]

SUPPLIED_IMAGES = {
    17: dict(src="/images/columns/dog-owner-voice.webp", width=1280, height=720, alt="公園で声をかける飼い主の女性と、その声に耳を傾けるゴールデンレトリバーの水彩イラスト"),
    18: dict(src="/images/columns/young-onset-dementia.webp", width=1280, height=720, alt="認知症の説明資料を手にした女性と、テーブルを挟んで話す眼鏡の男性の水彩イラスト"),
    19: dict(src="/images/columns/wallet-contents-safety.webp", width=1280, height=720, alt="財布のカード類と暗証番号を書いたメモを確認して整理する女性の水彩イラスト"),
    20: dict(src="/images/columns/qr-code-inventor.webp", width=1280, height=720, alt="設計図や自動車部品のある設計室で、QRコードの模様を検討する技術者の水彩イラスト"),
    21: dict(src="/images/columns/cat-owner-memory.webp", width=1280, height=720, alt="帰宅した飼い主の女性が差し出す手に顔を寄せる猫の水彩イラスト"),
    23: dict(src="/images/columns/smartphone-emergency-sos.webp", width=1280, height=720, alt="救急用品や充電器を用意したテーブルで、スマートフォンの緊急通報設定を確認する女性の水彩イラスト"),
    24: dict(src="/images/columns/phone-number-personal-information.webp", width=1280, height=720, alt="連絡先のプライバシーについて考えながらスマートフォンを見る女性の水彩イラスト"),
    25: dict(src="/images/columns/pets-earthquake-prediction.webp", width=1280, height=720, alt="揺れる照明に反応する犬と猫を、室内で見つめる高齢の夫婦の水彩イラスト"),
    26: dict(src="/images/columns/monitoring-and-surveillance.webp", width=1280, height=720, alt="タブレットを一緒に見ながら見守りについて話す高齢女性と家族の水彩イラスト"),
    27: dict(src="/images/columns/qr-code-scan-mechanism.webp", width=1280, height=720, alt="店頭のQRコードをスマートフォンでスキャンし、情報ページを確認する女性の水彩イラスト"),
    28: dict(src="/images/columns/disaster-family-contact.webp", width=1280, height=720, alt="防災用品や地図をそろえ、スマートフォンとメモで家族の連絡方法を確認する女性の水彩イラスト"),
    29: dict(src="/images/columns/why-we-misplace-things.webp", width=1280, height=720, alt="鍵とスマートフォンの置き場所を思い出そうとして室内を探す男性の水彩イラスト"),
    30: dict(src="/images/columns/number-private-calls.webp", width=1280, height=720, alt="バッグのQRタグをスキャンする女性と、電話で応じる高齢女性を描いた水彩イラスト"),
    22: dict(src="/images/columns/elderly-fall-prevention.webp", width=1280, height=720, alt="室内の段差でつまずきそうになり、壁の手すりにつかまる高齢女性の水彩イラスト"),
}

SERVICE_PATHS = {k: f'/use-cases/{k}/' for k in ['pets', 'elderly', 'belongings']}
SERVICE_PATHS['service'] = '/service/'
SERVICE_LABELS = {'pets': 'ペットの迷子への備え', 'elderly': '高齢者の見守りへの活用', 'belongings': '落とし物への備え', 'service': 'つながるQRのサービスと利用条件'}


def merge_paragraphs(text):
    """Join adjacent one-sentence paragraphs; keep lists and subheads as real blocks."""
    out, pending = [], ''
    for part in text.strip().split('\n\n'):
        part = part.strip()
        if not part:
            continue
        if part.startswith(('- ', '**')):
            if pending:
                out.append(pending)
                pending = ''
            out.append(part)
        else:
            pending += part.replace('\n', '')
            if len(pending) >= 85:
                out.append(pending)
                pending = ''
    if pending:
        out.append(pending)
    return out


def build(meta, titles):
    day, slug = meta['day'], meta['slug']
    original = (DOC / f'originals/2026-11-{day}.md').read_text()
    title = re.search(r'^# (.+)$', original, re.M)[1]
    seo = re.search(r'^\*\*SEOタイトル：\*\* (.+)$', original, re.M)[1]
    desc = re.search(r'^\*\*メタディスクリプション：\*\* (.+)$', original, re.M)[1]
    chunks = re.split(r'^### (.+)\n', original.split('**参考資料：**')[0], flags=re.M)
    sections = []
    for i in range(1, len(chunks), 2):
        heading, text = chunks[i:i + 2]
        heading = meta['ending'] if heading == 'まとめ' else heading
        # Prefer the live specification over a potentially stale button label.
        text = text.replace('「発信」をタップ', '通話ボタンをタップ')
        if day == 21:
            text = text.replace('結論からいうと、', '')
        paragraphs = merge_paragraphs(text)
        blocks = []
        for p in paragraphs:
            if p.startswith('- '):
                blocks.append(dict(type='list', items=[line[2:] for line in p.splitlines()]))
            elif p.startswith('**') and p.endswith('**'):
                blocks.append(dict(type='heading', text=p[2:-2]))
            else:
                blocks.append(dict(type='paragraph', text=p))
        sections.append(dict(id=f'section-{len(sections)+1}', title=heading, blocks=blocks))
    # Place authored, contextual links inside relevant sections, not only in a footer.
    ids = meta['related'][:]
    for j, target in enumerate(ids[:2]):
        section = sections[min(j, len(sections) - 1)]
        label = titles[target]
        section['blocks'].append(dict(type='link', href=f'/column/{target}/', label=label,
                                      prefix='関連する内容として「', suffix='」も参考になります。'))
    if meta['service'] and day in [20, 24, 26, 27, 30]:
        sections[-2]['blocks'].append(dict(type='link', href=SERVICE_PATHS[meta['service']],
                                          label=SERVICE_LABELS[meta['service']], prefix='利用条件は「', suffix='」で確認できます。'))
    # The review copy includes every displayed body block, including added links.
    edited = [f'# {title}', *meta['lead']]
    for section in sections:
        edited.append('## ' + section['title'])
        for block in section['blocks']:
            if block['type'] == 'list':
                edited.append('\n'.join('- ' + item for item in block['items']))
            elif block['type'] == 'heading':
                edited.append('### ' + block['text'])
            elif block['type'] == 'link':
                edited.append(block.get('prefix', '') + f'[{block["label"]}]({block["href"]})' + block.get('suffix', ''))
            else:
                edited.append(block['text'])
    edited += ['## 参考資料', *[f'[{SOURCES[k][0]}]({SOURCES[k][1]})' for k in meta['sources']]]
    edited_text = '\n\n'.join(edited) + '\n'
    file = f'src/content/columns/approved/{slug}.md'
    sources = [dict(id=k, label=SOURCES[k][0], href=SOURCES[k][1], checkedAt=CHECKED)
               for k in meta['sources']]
    article = dict(id=slug, slug=slug, title=title, summary=meta['lead'][0], introduction=meta['lead'][1:],
                seoTitle=seo, metaDescription=desc, category=meta['category'], primaryAudience='personal', tags=meta['tags'],
                status='draft', publicationOrigin='editorial', publishedAt=f'2026-11-{day}', editionDate=f'2026-11-{day}',
                publishedTimestamp=f'2026-11-{day}T08:00:00+09:00', publicationPending=True,
                updatedAt=None, reviewedAt=CHECKED, nextReviewAt=None, serviceSpecificationVersion='2026-10-27',
                contentRevision=1, approvalRevision=None, contentFormat='approved-manuscript',
                approvalRecord=dict(sourceFile=file, sha256=hashlib.sha256(edited_text.encode()).hexdigest(), receivedOn=CHECKED),
                relatedArticleIds=[id for id in ids if id in {b['slug'] for b in BATCH}],
                relatedService=(dict(href=SERVICE_PATHS[meta['service']], label=SERVICE_LABELS[meta['service']]) if meta['service'] else None),
                relatedLinks=[dict(href=f'/column/{id}/', label=titles[id]) for id in ids if id not in {b['slug'] for b in BATCH}][:1],
                manuscriptReferences=True, sources=sources, sections=sections, cta='none',
                searchIntent=meta['keyword'], primaryKeyword=meta['keyword'], topicClusterId=meta['slug'],
                claims=[dict(text=meta['lead'][0], sourceIds=meta['sources'], verified=day not in [23, 29])],
                validationResults=[dict(check='source-review-complete', passed=day not in [23, 29]),
                                   dict(check='image-supplied', passed=False), dict(check='release-approved', passed=False)],
                generationRunId=None, promptVersion=None)
    if day in SUPPLIED_IMAGES:
        article["image"] = SUPPLIED_IMAGES[day].copy()
        next(c for c in article["validationResults"] if c["check"] == "image-supplied")["passed"] = True
    # Nov 17 was explicitly authorized for immediate release by the user.
    if day in [17, 18, 19]:
        article.update(status='published', publicationPending=False, approvalRevision=1,
                       publishedTimestamp={17: '2026-11-17T05:57:38+09:00', 18: '2026-11-18T00:53:05+09:00'}.get(day, article['publishedTimestamp']))
        next(c for c in article['validationResults'] if c['check'] == 'release-approved')['passed'] = True
    return article, edited_text


def main():
    sync = '--sync' in sys.argv
    records = json.loads(REGISTRY.read_text())
    titles = {a['id']: a['title'] for a in records}
    for meta in BATCH:
        raw = (DOC / f'originals/2026-11-{meta["day"]}.md').read_text()
        titles[meta['slug']] = re.search(r'^# (.+)$', raw, re.M)[1]
    generated = []
    for meta in BATCH:
        article, edited = build(meta, titles)
        file = ROOT / article['approvalRecord']['sourceFile']
        original = DOC / f'originals/2026-11-{meta["day"]}.md'
        patch = ''.join(difflib.unified_diff(original.read_text().splitlines(True), edited.splitlines(True),
                                            fromfile=str(original.relative_to(ROOT)), tofile=str(file.relative_to(ROOT)), n=0))
        diff_file = DOC / f'edits/2026-11-{meta["day"]}.diff'
        if sync:
            file.write_text(edited)
            diff_file.write_text(patch)
        else:
            assert file.read_text() == edited
            assert diff_file.read_text() == patch
            assert next(a for a in records if a['id'] == article['id']) == article
        generated.append(article)
    if sync:
        ids = {a['id'] for a in generated}
        REGISTRY.write_text(json.dumps([a for a in records if a['id'] not in ids] + generated, ensure_ascii=False, indent=2) + '\n')
    print('Nov 17–30: 14 supplied manuscripts projected; Nov 17–19 releases preserved, remaining 11 held drafts; no images substituted.')


if __name__ == '__main__':
    main()
