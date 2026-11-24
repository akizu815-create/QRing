const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-journey-'));
try {
  for (const name of ['types', 'navigation', 'homePicks', 'serviceCta']) fs.writeFileSync(path.join(tmp, name+'.js'),ts.transpileModule(fs.readFileSync('src/lib/columns/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText);
  const {homeColumnPicks}=require(path.join(tmp,'homePicks.js'));
  const {additionalServiceCta}=require(path.join(tmp,'serviceCta.js'));
  const records=JSON.parse(fs.readFileSync('src/content/columns/published.json','utf8'));
  const picked=homeColumnPicks(records,['missing',records[0].slug,records[0].slug]);
  assert.equal(picked.length,3);assert.equal(new Set(picked.map(a=>a.id)).size,3);assert.equal(picked[0].slug,records[0].slug);
  assert.deepEqual(homeColumnPicks([],['missing']),[]);
  const article={...records[0],relatedService:null,relatedLinks:[],cta:'none',category:'lost-items',primaryAudience:'personal'};
  assert.equal(additionalServiceCta(article).href,'/use-cases/belongings/');
  assert.equal(additionalServiceCta({...article,publicationPending:true}),null);
  assert.equal(additionalServiceCta({...article,primaryAudience:'municipal'}),null);
  assert.equal(additionalServiceCta({...article,relatedService:{href:'/service/'}}),null);
  assert.equal(additionalServiceCta({...article,relatedLinks:[{href:'/use-cases/belongings/'}]}),null);
  assert.equal(additionalServiceCta({...article,category:'business-safety'}),null);
  assert.equal(additionalServiceCta({...article,slug:'smartphone-emergency-sos',category:'privacy-life'}),null);
  console.log('Column picks and nonduplicating service guidance: passed');
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
