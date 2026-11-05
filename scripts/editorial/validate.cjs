// Run the existing TypeScript content validator; never execute author-supplied code.
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), ts = require('typescript');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qring-editorial-'));
try {
    for (const name of ['types', 'publication'])
        fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync(path.join(__dirname, '../../src/lib/columns', name + '.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
    const { validateArticle, selectPublishedArticles } = require(path.join(tmp, 'publication.js'));
    if (process.argv[2] === '--options') {
        const { CATEGORIES, AUDIENCES } = require(path.join(tmp, 'types.js'));
        process.stdout.write(JSON.stringify({ categories: CATEGORIES, audiences: AUDIENCES }));
    } else {
    const data = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (Array.isArray(data))
        selectPublishedArticles(data);
    else
        validateArticle(data);
    process.stdout.write('valid');
    }
}
catch (_) {
    process.stderr.write('Article does not satisfy the existing content contract');
    process.exitCode = 1;
}
finally {
    fs.rmSync(tmp, { recursive: true, force: true });
}
