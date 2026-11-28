// All scheduled records must be ready before their deadline, not only once due.
const fs=require('node:fs');const {checkPacket}=require('./column-month.cjs');
const records=JSON.parse(fs.readFileSync('src/content/columns/published.json'));
require('../src/lib/columns/releasePolicy.js').selectReleased(records,Date.parse('9999-12-31T23:59:59Z'));
const groups=new Map();
for(const a of records.filter(a=>a.status==='scheduled')){const month=a.publishedAt.slice(0,7);if(!groups.has(month))groups.set(month,[]);groups.get(month).push(a);}
for(const [month,articles]of groups)checkPacket(articles,month,records.filter(a=>!articles.includes(a)),process.cwd(),false);
console.log('Registered scheduled articles: '+[...groups.values()].reduce((n,a)=>n+a.length,0)+'; future approvals, JST times, metadata, image files and receipts checked. Drafts remain excluded.');
