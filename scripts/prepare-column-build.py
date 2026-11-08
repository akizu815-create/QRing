"""Start away from the hourly peak; never advance the publication clock."""
import datetime as dt
import json
import os
import time
from pathlib import Path

JST = dt.timezone(dt.timedelta(hours=9))
PREWARM_CRON = '50 22 * * *'


def wait_seconds(now, event, schedule):
    if event != 'schedule' or schedule != PREWARM_CRON:
        return 0
    local = now.astimezone(JST)
    target = local.replace(hour=8, minute=0, second=0, microsecond=0)
    seconds = max(0, (target-local).total_seconds())
    if seconds > 10*60:
        raise ValueError('Prewarm started outside its 07:50–08:00 JST window')
    return seconds


def main():
    event = os.environ.get('GITHUB_EVENT_NAME', 'local')
    schedule = os.environ.get('COLUMN_SCHEDULE', '')
    now = dt.datetime.now(dt.timezone.utc)
    remaining = wait_seconds(now, event, schedule)
    print(json.dumps({'event': event, 'schedule': schedule, 'startedAt': now.isoformat(),
                      'waitSeconds': remaining}), flush=True)
    # Re-read the real clock, including after a clock adjustment. A ten-minute
    # budget prevents a stuck runner monopolising the existing Pages lock.
    deadline = time.monotonic()+10*60+5
    while remaining:
        if time.monotonic() > deadline:
            raise RuntimeError('Timed out waiting for 08:00 JST')
        time.sleep(min(30, remaining))
        remaining = wait_seconds(dt.datetime.now(dt.timezone.utc), event, schedule)
    cutoff = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    for variable, line in [('GITHUB_ENV', f'COLUMN_BUILD_AT={cutoff}\n'),
                           ('GITHUB_OUTPUT', f'cutoff={cutoff}\n')]:
        if os.environ.get(variable):
            with Path(os.environ[variable]).open('a') as out:
                out.write(line)
    print(json.dumps({'event': event, 'schedule': schedule, 'COLUMN_BUILD_AT': cutoff}), flush=True)


if __name__ == '__main__':
    main()
