"""Production publication boundary shared by static-export verification scripts."""
import datetime as dt
import os


def publication_now():
    value = os.environ.get('COLUMN_BUILD_AT')
    if value:
        now = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        if now.tzinfo is None:
            raise ValueError('COLUMN_BUILD_AT requires an explicit timezone')
        return now
    return dt.datetime.now(dt.timezone.utc)


def published_articles(records):
    now = publication_now()
    return [a for a in records if a.get('status') == 'published'
            and not a.get('publicationPending')
            and a.get('approvalRevision') == a['contentRevision']
            and all(c['verified'] for c in a['claims'])
            and a['validationResults'] and all(c['passed'] for c in a['validationResults'])
            and dt.datetime.fromisoformat(a.get('publishedTimestamp', a['publishedAt']+'T00:00:00+09:00').replace('Z', '+00:00')) <= now]
