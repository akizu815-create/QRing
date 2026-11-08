"""Five real static builds at the requested JST publication boundaries; no deploy."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import datetime as dt

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('live', ROOT/'scripts/check-live-columns.py')
live = importlib.util.module_from_spec(spec)
spec.loader.exec_module(live)
CASES = [('2026-11-09T07:59:00+09:00', 8), ('2026-11-09T08:00:00+09:00', 9),
         ('2026-11-10T07:59:00+09:00', 9), ('2026-11-10T08:00:00+09:00', 10),
         ('2026-11-15T08:00:00+09:00', 15)]


def main():
    records = json.loads((ROOT/'src/content/columns/published.json').read_text())
    with tempfile.TemporaryDirectory(prefix='qring-matrix-') as tmp:
        for stamp, count in CASES:
            env = dict(os.environ, COLUMN_BUILD_AT=stamp, NEXT_TELEMETRY_DISABLED='1')
            log = Path(tmp)/(stamp[:16].replace(':', '-')+'.log')
            commands = [['npm','run','build'], ['npm','run','check:column-export'],
                        ['npm','run','check:column-navigation']]
            for command in commands:
                with log.open('a') as out:
                    result = subprocess.run(command,cwd=ROOT,env=env,stdout=out,stderr=subprocess.STDOUT)
                if result.returncode:
                    print(log.read_text())
                    raise SystemExit(result.returncode)
            def fetch(path):
                file = ROOT/'out'/path.lstrip('/')
                return (file/'index.html' if path.endswith('/') else file).read_text()
            report = live.verify(records, dt.datetime.fromisoformat(stamp), fetch)
            assert report['publicArticles']==count
            print(json.dumps({'cutoff':stamp,**report},ensure_ascii=False),flush=True)
    print('All five real-build boundaries passed: export, navigation, HOME, related links, sitemap, individual pages, and future exclusions.',flush=True)


if __name__ == '__main__':
    main()
