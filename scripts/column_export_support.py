"""Production publication boundary shared by static-export verification scripts."""
import datetime as dt
import os
from functools import cmp_to_key


def publication_order(a, b):
    """Match compareArticleDates in src/lib/columns/types.ts (display order)."""
    da, db = a.get('editionDate', a['publishedAt']), b.get('editionDate', b['publishedAt'])
    if da != db:
        return -1 if da > db else 1
    if a['publishedAt'] != b['publishedAt']:
        return -1 if a['publishedAt'] > b['publishedAt'] else 1
    if bool(a.get('publishedTimestamp')) != bool(b.get('publishedTimestamp')):
        return -1 if a.get('publishedTimestamp') else 1
    if a.get('publishedTimestamp') and b.get('publishedTimestamp'):
        ta = dt.datetime.fromisoformat(a['publishedTimestamp'].replace('Z', '+00:00'))
        tb = dt.datetime.fromisoformat(b['publishedTimestamp'].replace('Z', '+00:00'))
        if ta != tb:
            return -1 if ta > tb else 1
    return (a['slug'] > b['slug']) - (a['slug'] < b['slug'])


def home_column_picks(public, slugs, limit=3):
    """Match homeColumnPicks.ts; only already publication-filtered input is eligible."""
    selected = []
    ordered = sorted(public, key=cmp_to_key(publication_order))
    for slug in slugs:
        article = next((a for a in public if a['slug'] == slug), None)
        if article and all(a['id'] != article['id'] for a in selected):
            selected.append(article)
        if len(selected) >= limit:
            return selected
    for article in ordered:
        if all(a['id'] != article['id'] for a in selected):
            selected.append(article)
        if len(selected) >= limit:
            break
    return selected


def publication_now():
    value = os.environ.get('COLUMN_BUILD_AT')
    if value:
        now = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        if now.tzinfo is None:
            raise ValueError('COLUMN_BUILD_AT requires an explicit timezone')
        return now
    return dt.datetime.now(dt.timezone.utc)


def published_articles(records):
    # A single JS policy defines dates, scheduled/published eligibility and approval.
    # Node is available on the site's build and deployment runners; no npm install
    # or TypeScript compiler is needed for this read-only call.
    import json
    import subprocess
    from pathlib import Path
    script = Path(__file__).with_name('column-release-indices.cjs')
    result = subprocess.run(['node', str(script)], input=json.dumps({
        'records': records, 'now': publication_now().isoformat()
    }), text=True, capture_output=True, check=True)
    return [records[i] for i in json.loads(result.stdout)]
