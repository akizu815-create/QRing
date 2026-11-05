'use strict';
let state, current, busy = false;
const labels = { draft: '下書き', review: '承認待ち', approved: '承認済み・公開準備待ち', published: '公開用データあり', needs_revision: '要修正' };
const $ = id => document.getElementById(id);
function el(tag, text, parent) { const node = document.createElement(tag); if (text !== undefined)
    node.textContent = text; if (parent)
    parent.append(node); return node; }
function button(text, action, parent, disabled = false) { const b = el('button', text, parent); b.type = 'button'; b.disabled = disabled; b.onclick = action; return b; }
function message(text) { $('message').textContent = text; }
async function api(path, data) { const r = await fetch(path, { method: data ? 'POST' : 'GET', headers: data ? { 'Content-Type': 'application/json' } : {}, body: data ? JSON.stringify(data) : undefined, credentials: 'same-origin', cache: 'no-store' }); const result = await r.json(); if (!r.ok)
    throw Error(result.error || '操作に失敗しました'); return result; }
async function perform(action) {
    if (busy) return;
    busy = true;
    const buttons = [...document.querySelectorAll('button')].map(button => [button, button.disabled]);
    buttons.forEach(([button]) => button.disabled = true);
    try {
        await action();
        await load(false);
        if (current) await openArticle(current.article.id, false);
    } catch (error) {
        message(error.message + '\n入力内容は保持しています。必要なら内容を控えてから最新版を読み直してください。');
        buttons.forEach(([button, disabled]) => button.disabled = disabled);
    } finally {
        busy = false;
    }
}

function link(source, parent) { const a = el('a', source.label || source.href || source.url, parent); const href = source.href || source.url; try {
    const u = new URL(href, location.origin);
    if (u.protocol === 'https:' || u.origin === location.origin) {
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
    }
}
catch (_) { } return a; }
function field(label, value, parent, multi = false) { const l = el('label', label, parent); const input = el(multi ? 'textarea' : 'input', undefined, l); input.value = value || ''; return input; }
function dump(label, value, parent) { const d = el('details', undefined, parent); el('summary', label, d); el('pre', JSON.stringify(value, null, 2), d); }
async function load(reset = true) { state = await api('/api/bootstrap'); $('identity').textContent = state.actor + (state.development ? ' ／ ローカル開発用' : ''); const list = $('list'); list.replaceChildren(); el('h2', '記事一覧', list); const filter = el('select', undefined, list); filter.setAttribute('aria-label', '記事の状態'); for (const [v, t] of [['all', 'すべて'], ...Object.entries(labels)]) {
    const o = el('option', t, filter);
    o.value = v;
} const cards = el('div', undefined, list); function draw() { cards.replaceChildren(); for (const a of state.articles.filter(a => filter.value === 'all' || (filter.value === 'published' ? a.publicRevision !== null : a.status === filter.value))) {
    const c = el('div', undefined, cards);
    c.className = 'card';
    el('span', labels[a.status] || a.status, c).className = 'badge';
    el('h3', a.title, c);
    el('small', `編集中の版 ${a.contentRevision} ／ 公開用の版 ${a.publicRevision ?? 'なし'} ／ ${{personal:'個人・家族',municipal:'自治体・公共機関',business:'企業・施設'}[a.primaryAudience]}`, c);
    button('全文を確認', () => openArticle(a.id), c);
} if (!cards.childNodes.length)
    el('p', '該当する記事はありません。', cards); } filter.onchange = draw; draw(); const ops = $('operations'); ops.replaceChildren(); el('h2', '運用状況', ops); el('p', `今月の推定利用額 $${state.usage.settledUsd.toFixed(4)} ／ 予約額 $${state.usage.reservedUsd.toFixed(4)}`, ops); el('small', state.usage.notice, ops); dump('トークン数・費用台帳', state.usage.entries, ops); dump('生成履歴・エラー', state.runs, ops); dump('GSCからの編集候補（既存分析を利用）', state.seoActions, ops); dump('公開準備履歴（本番反映は別途承認）', state.releases, ops); if (reset)
    message(''); }
async function openArticle(id, scroll = true) {
    try {
        current = await api('/api/articles/' + encodeURIComponent(id));
        const { article: a } = current;
        const root = $('detail');
        root.hidden = false;
        root.replaceChildren();
        button('一覧へ', () => { current = null; root.hidden = true; $('list').scrollIntoView(); }, root);
        button('最新版を読み直す', () => openArticle(id, false), root);
        el('h2', a.title, root);
        el('p', `${labels[a.status]} ／ リビジョン ${a.contentRevision}`, root);
        el('p', current.publication.notice, root);
        el('p', `公開用リビジョン：${current.publication.revision ?? 'なし'} ／ 編集中：${a.contentRevision}`, root);
        el('p', a.summary, root);
        for (const section of a.sections) {
            el('h3', section.title, root);
            for (const b of section.blocks) {
                if (b.type === 'paragraph')
                    el('p', b.text, root);
                if (b.type === 'list') {
                    const ul = el('ul', undefined, root);
                    b.items.forEach(i => el('li', i, ul));
                }
                if (b.type === 'link')
                    link(b, el('p', undefined, root));
                if (b.type === 'table') {
                    const t = el('table', undefined, root);
                    el('caption', b.caption, t);
                    const head = el('tr', undefined, el('thead', undefined, t));
                    b.headers.forEach(h => el('th', h, head));
                    const body = el('tbody', undefined, t);
                    b.rows.forEach(row => { const tr = el('tr', undefined, body); row.forEach(c => el('td', c, tr)); });
                }
            }
        }
        el('h3', '出典確認', root);
        for (const s of a.sources) {
            const p = el('p', undefined, root);
            link(s, p);
            el('small', ` ／ 確認日 ${s.checkedAt}`, p);
        }
        for (const proof of current.evidence) {
            el('p', proof.excerpt, root);
            el('small', `${proof.kind === 'primary' ? '一次情報' : '信頼資料'} ／ ${proof.checkedAt}`, root);
        }
        el('h3', '確認対象の主張', root);
        a.claims.forEach(claim => el('p', `${claim.verified ? '確認済み' : '未確認'}：${claim.text}`, root));
        dump('検査結果', current.checks, root);
        dump('修正・承認履歴（旧版の全文を含む）', current.history, root);
        if (current.readOnly) {
            button('改訂用の下書きを作成', () => perform(async () => { await api('/api/articles/' + encodeURIComponent(id), { action: 'fork' }); message('公開用データを維持し、非公開の改訂下書きを作成しました。'); }), root, !state.roles.includes('editor'));
        }
        else {
            const editor = el('details', undefined, root);
            el('summary', '本文・SEO情報を修正', editor);
            const title = field('記事タイトル', a.title, editor), seo = field('SEOタイトル', a.seoTitle, editor), meta = field('メタディスクリプション', a.metaDescription, editor, true), summary = field('導入文', a.summary, editor, true);
            const sourceEditors = a.sources.map(source => {
                const proof = current.evidence.find(e => e.sourceId === source.id) || {};
                const section = el('section', undefined, editor);
                el('h3', '出典と根拠の修正', section);
                const label = field('資料名', source.label, section);
                const href = field('出典URL', source.href, section);
                const date = field('出典確認日', source.checkedAt, section); date.type = 'date';
                const excerpt = field('原文から確認した抜粋', proof.excerpt, section, true);
                const kindLabel = el('label', '資料の区分', section);
                const kind = el('select', undefined, kindLabel);
                for (const [value, text] of [['primary', '一次情報'], ['trusted', '信頼できる資料']]) {
                    const option = el('option', text, kind); option.value = value;
                }
                kind.value = proof.kind || 'primary';
                return { source, label, href, date, excerpt, kind };
            });
            const claimEditors = a.claims.map(claim => ({ claim, input: field('根拠を確認する主張', claim.text, editor, true) }));
            const sectionInputs = [];
            a.sections.forEach(s => { const heading = field('見出し', s.title, editor); const blocks = s.blocks.map(b => b.type === 'paragraph' ? field('本文', b.text, editor, true) : null); sectionInputs.push({ heading, blocks }); });
            const advanced = el('details', undefined, editor);
            el('summary', '出典・主張・分類・表・リンク等の詳細設定', advanced);
            const patch = {};
            for (const k of ['category', 'primaryAudience', 'tags', 'publishedAt', 'nextReviewAt', 'serviceSpecificationVersion', 'relatedArticleIds', 'relatedService', 'sources', 'cta', 'searchIntent', 'primaryKeyword', 'topicClusterId', 'claims'])
                patch[k] = a[k];
            patch.evidence = current.evidence;
            const config = field('詳細設定（JSON）', JSON.stringify(patch, null, 2), advanced, true);
            const configOriginal = config.value;
            const sections = field('本文構造（リスト・表・リンクの編集、JSON）', JSON.stringify(a.sections, null, 2), advanced, true);
            const original = sections.value;
            button('修正を保存', () => perform(async () => { const changed = JSON.parse(config.value);
                if (config.value === configOriginal) {
                    changed.sources = sourceEditors.map(e => ({ ...e.source, label: e.label.value, href: e.href.value, checkedAt: e.date.value }));
                    changed.evidence = sourceEditors.map(e => ({ sourceId: e.source.id, url: e.href.value, checkedAt: e.date.value, excerpt: e.excerpt.value, kind: e.kind.value }));
                    changed.claims = claimEditors.map(e => ({ ...e.claim, text: e.input.value }));
                }
                let blocks = JSON.parse(sections.value); if (sections.value === original)
                blocks = structuredClone(a.sections).map((s, i) => ({ ...s, title: sectionInputs[i].heading.value, blocks: s.blocks.map((b, j) => b.type === 'paragraph' ? { ...b, text: sectionInputs[i].blocks[j].value } : b) })); await api('/api/articles/' + encodeURIComponent(id), { action: 'save', revision: a.contentRevision, patch: { ...changed, title: title.value, seoTitle: seo.value, metaDescription: meta.value, summary: summary.value, sections: blocks } }); message('保存しました。変更後の版は再確認・再承認が必要です。'); }), editor, !state.roles.includes('editor'));
            const attestation = el('label', undefined, root);
            const check = el('input', undefined, attestation);
            check.type = 'checkbox';
            attestation.append(document.createTextNode('出典原文、本文の主張、サービス仕様、重複テーマを確認しました。'));
            const note = field('差し戻し理由', '', root, true);
            const actions = el('div', undefined, root);
            actions.className = 'actions';
            const act = (action, extra = {}) => perform(async () => { await api('/api/articles/' + encodeURIComponent(id), { action, revision: a.contentRevision, ...extra }); message('操作を記録しました。本番には反映していません。'); });
            button('確認依頼', () => act('submit'), actions, !state.roles.includes('editor') || !['draft', 'needs_revision'].includes(a.status));
            button('確認を記録', () => act('verify', { attested: check.checked }), actions, !state.roles.includes('reviewer') || a.status !== 'review');
            button('差し戻し', () => act('return', { note: note.value }), actions, !state.roles.includes('reviewer'));
            button('記事を承認', () => act('approve'), actions, !state.roles.includes('reviewer') || a.status !== 'review' || current.reviewRevision !== a.contentRevision || current.checks.length > 0).className = 'primary';
            if (a.status === 'approved')
                button('公開用スナップショットを準備', () => perform(async () => { const r = await api('/api/releases', { selections: [{ id: a.id, revision: a.contentRevision }] }); message('公開準備を記録しました。ID: ' + r.id + '\n本番反映には、この版を検証したうえで別途デプロイ承認が必要です。'); }), root, !state.roles.includes('publisher'));
        }
        if (scroll)
            root.scrollIntoView({ behavior: 'smooth' });
    }
    catch (e) {
        message(e.message);
    }
}
load().catch(e => message(e.message));
