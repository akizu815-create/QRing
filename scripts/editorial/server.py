"""Loopback service behind a configured, authenticated, signing reverse proxy.
No identity provider is created. --development is local test access only.
"""
import argparse
import hashlib
import hmac
import json
import os
import secrets
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
from . import core

ASSETS = core.ROOT/'scripts/editorial/ui'
ROLES = {'viewer','editor','reviewer','publisher'}

def authenticate(headers, method, path, body, secret, roles, now=None):
    actor = headers.get('X-QRing-Actor',''); stamp = headers.get('X-QRing-Time',''); nonce = headers.get('X-QRing-Nonce','')
    if len(actor) > 200 or not nonce or len(nonce) > 128: raise PermissionError('Authentication required')
    try:
        if abs((now or time.time())-int(stamp)) > 60: raise PermissionError('Expired identity assertion')
    except ValueError: raise PermissionError('Invalid identity assertion') from None
    message = '\n'.join([actor, stamp, nonce, method, path, hashlib.sha256(body).hexdigest()])
    expected = hmac.new(secret.encode(),message.encode(),hashlib.sha256).hexdigest()
    if not hmac.compare_digest(headers.get('X-QRing-Signature',''), expected): raise PermissionError('Invalid identity assertion')
    assigned = roles.get(actor, [])
    if not isinstance(assigned, list) or not assigned or not set(assigned) <= ROLES: raise PermissionError('Actor is not authorized')
    return actor, set(assigned), nonce

class Handler(BaseHTTPRequestHandler):
    server_version = 'QRingEditorial'
    def log_message(self, *args): pass  # Do not log article bodies, auth assertions, or query strings.
    def respond(self, status, data, content_type='application/json; charset=utf-8'):
        raw = data if isinstance(data,bytes) else core.encode(data).encode()
        self.send_response(status)
        for k,v in {'Content-Type':content_type,'Content-Length':str(len(raw)),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"}.items(): self.send_header(k,v)
        self.end_headers(); self.wfile.write(raw)
    def do_GET(self): self.handle_request()
    def do_POST(self): self.handle_request()
    def handle_request(self):
        db = None
        try:
            if self.headers.get('Transfer-Encoding'): raise ValueError('Transfer encoding not accepted')
            length = int(self.headers.get('Content-Length','0'))
            if not 0 <= length <= 1000000: raise ValueError('Request too large')
            self.connection.settimeout(15)
            body = self.rfile.read(length)
            if len(body) != length: raise ValueError('Incomplete request')
            if self.command == 'POST':
                if self.headers.get('Origin') != self.server.origin or self.headers.get('Content-Type','').split(';')[0] != 'application/json': raise PermissionError('Same-origin JSON request required')
            if self.server.development: actor, roles, nonce = 'local-development', ROLES, None
            else: actor, roles, nonce = authenticate(self.headers,self.command,self.path,body,self.server.secret,self.server.roles)
            db = core.connect(self.server.db_path)
            if nonce:
                db.execute('CREATE TABLE IF NOT EXISTS editorial_assertions(nonce TEXT PRIMARY KEY, seen_at INTEGER NOT NULL)')
                try:
                    with db:
                        db.execute('DELETE FROM editorial_assertions WHERE seen_at<?',(int(time.time())-120,))
                        db.execute('INSERT INTO editorial_assertions VALUES(?,?)',(nonce,int(time.time())))
                except __import__('sqlite3').IntegrityError: raise PermissionError('Identity assertion already used') from None
            path = urlsplit(self.path).path
            if self.command == 'GET':
                if path in ['/', '/app.js', '/style.css']:
                    filename, content_type = {'/':('index.html','text/html; charset=utf-8'),'/app.js':('app.js','text/javascript; charset=utf-8'),'/style.css':('style.css','text/css; charset=utf-8')}[path]
                    return self.respond(200,(ASSETS/filename).read_bytes(),content_type)
                if path == '/api/bootstrap':
                    return self.respond(200,{'actor':actor,'roles':sorted(roles),'development':self.server.development,'articles':[{**{k:a[k] for k in ['id','title','status','slug','contentRevision','approvalRevision','primaryAudience']}, 'publicRevision':next((p['contentRevision'] for p in core.published() if p['id']==a['id']),None)} for a in core.all_articles(db)],
                        'usage':core.usage(db),'runs':[dict(r) for r in db.execute('SELECT * FROM editorial_runs ORDER BY day DESC LIMIT 31')],
                        'releases':[{k:r[k] for k in ['id','actor','created_at','snapshot_hash','status']} for r in db.execute('SELECT * FROM editorial_releases ORDER BY created_at DESC LIMIT 20')],
                        'seoActions':core.seo_context(db)['actions']})
                if path.startswith('/api/articles/'):
                    article_id = unquote(path.removeprefix('/api/articles/'))
                    try: row = core.get(db,article_id)
                    except ValueError:
                        a = next((a for a in core.published() if a['id'] == article_id),None)
                        if not a: raise ValueError('Article not found')
                        row = {'article':a,'evidence':[],'readOnly':True}
                    current = next((a for a in core.published() if a['id'] == article_id),None)
                    return self.respond(200,{**row,'checks':[] if row.get('readOnly') else core.quality(db,row['article'],row['evidence']),
                        'publication':{'state':'public_snapshot' if current else 'not_public','revision':current['contentRevision'] if current else None,'notice':'リポジトリの公開用スナップショットです。本番デプロイの実測状況は未取得です。'},
                        'history':[{**dict(r),'detail':json.loads(r['detail_json'])} for r in db.execute('SELECT id,actor,action,revision,created_at,detail_json FROM editorial_events WHERE article_id=? ORDER BY id DESC LIMIT 100',(article_id,))]})
                return self.respond(404,{'error':'Not found'})
            data = json.loads(body)
            if path == '/api/releases':
                if 'publisher' not in roles: raise PermissionError('Publisher permission required')
                return self.respond(200,core.prepare_release(db,actor,data['selections']))
            if path.startswith('/api/articles/'):
                article_id = unquote(path.removeprefix('/api/articles/')); action = data['action']
                required = 'reviewer' if action in ['verify','approve','return'] else 'editor'
                if required not in roles: raise PermissionError('Editorial permission required')
                if action == 'fork': result = core.fork(db,article_id,actor)
                elif action == 'save': result = core.update(db,article_id,data['revision'],data['patch'],actor)
                else: result = core.transition(db,article_id,data['revision'],action,actor,data.get('note',''),data.get('attested') is True)
                return self.respond(200,{'article':result})
            self.respond(404,{'error':'Not found'})
        except PermissionError as e: self.respond(403,{'error':str(e)})
        except core.Conflict as e: self.respond(409,{'error':str(e)})
        except (ValueError, KeyError, TypeError): self.respond(400,{'error':'入力または操作を確認してください。更新競合時は再読込し、出典確認・状態・リビジョンを確認してください。'})
        except Exception: self.respond(500,{'error':'Private editorial operation failed; no deployment performed'})
        finally:
            if db: db.close()

def make_server(db_path, port=8765, development=False):
    secret = os.environ.get('QRING_EDITORIAL_PROXY_SECRET','')
    roles = json.loads(os.environ.get('QRING_EDITORIAL_ROLES','{}'))
    origin = os.environ.get('QRING_EDITORIAL_ORIGIN',f'http://127.0.0.1:{port}' if development else '')
    parsed = urlsplit(origin)
    if parsed.path or parsed.query or parsed.fragment or parsed.username or not parsed.netloc: raise ValueError('Exact origin required')
    if not development and (len(secret) < 32 or not roles or parsed.scheme != 'https'): raise ValueError('Configure existing authenticated proxy, signing secret, HTTPS origin and actor roles first')
    server = ThreadingHTTPServer(('127.0.0.1',port),Handler)
    server.db_path = db_path; server.development = development; server.secret = secret; server.roles = roles
    server.origin = f'http://127.0.0.1:{server.server_port}' if development and not os.environ.get('QRING_EDITORIAL_ORIGIN') else origin
    return server

def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--db',default=str(core.ROOT/'.qring-private/seo.sqlite')); parser.add_argument('--port',type=int,default=8765); parser.add_argument('--development',action='store_true')
    args = parser.parse_args(); server = make_server(args.db,args.port,args.development)
    print('Private editorial service listening on loopback. '+('LOCAL DEVELOPMENT ONLY.' if args.development else 'Authenticated proxy required.'))
    server.serve_forever()

if __name__ == '__main__': main()
