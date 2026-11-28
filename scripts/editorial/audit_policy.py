"""Read-only inventory of public naming-policy review candidates; no publication changes."""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
from .naming_policy import scan, VERSION

ROOT=Path(__file__).resolve().parents[2]

def audit(records):
    return {'policyVersion':VERSION,'checkedAt':dt.datetime.now(dt.timezone.utc).isoformat(),
            'records':len(records),'humanReviewRequired':True,'articles':[
                {'slug':a['slug'],'title':a['title'],'status':a['status'],'revision':a['contentRevision'],
                 **scan(a,records),'imageReview':'required: open original file and inspect text/logos',
                 'metadataReview':'OGP title/description/image and Article JSON-LD use these fields; shared layout needs separate review'} for a in records]}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--file',type=Path,default=ROOT/'src/content/columns/published.json')
    p.add_argument('--output',type=Path)
    args=p.parse_args();records=json.loads(args.file.read_text())
    if not isinstance(records,list):raise ValueError('Expected an Article array')
    report=audit(records);report['inputSha256']=hashlib.sha256(args.file.read_bytes()).hexdigest()
    text=json.dumps(report,ensure_ascii=False,indent=2)+'\n'
    if args.output:
        target=args.output.resolve()
        protected=[ROOT/name for name in ['src','public','scripts','.github']]
        if target==args.file.resolve() or any(target.is_relative_to(root) for root in protected):
            raise ValueError('Report output must not overwrite input or protected source/publication files')
        args.output.write_text(text)
    else:print(text,end='')

if __name__=='__main__':main()
