import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { assertReleaseVersion, isPrerelease, pythonNormalizedVersion } from './release-version.mjs';

const pkg=JSON.parse(await readFile('package.json','utf8')),pyproject=await readFile('bindings/python/pyproject.toml','utf8'),engine=await readFile('src/engine.ts','utf8'),changelog=await readFile('CHANGELOG.md','utf8'),schemaManifest=JSON.parse(await readFile('schemas/manifest.json','utf8'));
const version=pkg.version,pythonVersion=/^version = "([^"]+)"/m.exec(pyproject)?.[1],engineVersion=/ENGINE_VERSION='([^']+)'/.exec(engine)?.[1];
assertReleaseVersion(version);
if(pythonVersion!==version||engineVersion!==version)throw new Error(`Version drift: npm=${version}, python=${pythonVersion}, engine=${engineVersion}`);
if(!changelog.includes(`## ${version}`))throw new Error(`CHANGELOG missing ${version}`);
if(schemaManifest.formatVersion!==1||schemaManifest.count!==Object.keys(schemaManifest.schemas).length||schemaManifest.count<1)throw new Error('Schema manifest invalid');
const packed=JSON.parse(execFileSync('npm',['pack','--dry-run','--json'],{encoding:'utf8'}))[0],paths=new Set(packed.files.map(file=>file.path));
for(const path of ['api/public-api.snapshot.json','benchmarks/history.json','dist/index.js','dist/index.d.ts','dist/mcp-server.js','dist/mcp.js','dist/wasm/calendar.wasm','schemas/manifest.json','schemas/interpretation-prompt-bundle-1.0.json','fixtures/v1/manifest.json','fixtures/v1/jie-multi-year.json','fixtures/v1/jpl-lichun-multi-century.json','fixtures/v1/timezone-boundaries.json','docs/ai-integration.md','docs/mcp.md','docs/compatibility-policy.md','docs/public-api-audit.md','policy/compatibility-policy.json','examples/interpretation-pipeline.mjs','examples/interpretation-envelope.schema.json','README.md','CHANGELOG.md','LICENSE'])if(!paths.has(path))throw new Error(`npm tarball missing ${path}`);
console.log(JSON.stringify({releaseReady:true,version,prerelease:isPrerelease(version),pythonNormalizedVersion:pythonNormalizedVersion(version),schemaArtifacts:schemaManifest.count,packageFiles:packed.entryCount}));
