// Python checks use exactly the same release policy as the Next.js server.
const fs = require('node:fs');
const {selectReleased, timestamp} = require('../src/lib/columns/releasePolicy.js');
try {
  const packet = JSON.parse(fs.readFileSync(0, 'utf8'));
  const selected = new Set(selectReleased(packet.records, timestamp(packet.now)));
  process.stdout.write(JSON.stringify(packet.records.flatMap((a, i) => selected.has(a) ? [i] : [])));
} catch (e) {console.error(e.message); process.exitCode = 1;}
