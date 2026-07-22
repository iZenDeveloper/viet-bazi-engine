import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const pkg=JSON.parse(await readFile('package.json','utf8')),pyproject=await readFile('bindings/python/pyproject.toml','utf8'),engine=await readFile('src/engine.ts','utf8'),changelog=await readFile('CHANGELOG.md','utf8'),schemaManifest=JSON.parse(await readFile('schemas/manifest.json','utf8'));
const version=pkg.version,pythonVersion=/^version = "([^"]+)"/m.exec(pyproject)?.[1],engineVersion=/ENGINE_VERSION='([^']+)'/.exec(engine)?.[1];
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error(`Invalid package version: ${version}`);
if(pythonVersion!==version||engineVersion!==version)throw new Error(`Version drift: npm=${version}, python=${pythonVersion}, engine=${engineVersion}`);
if(!changelog.includes(`## ${version}`))throw new Error(`CHANGELOG missing ${version}`);
if(schemaManifest.formatVersion!==1||schemaManifest.count!==Object.keys(schemaManifest.schemas).length||schemaManifest.count<1)throw new Error('Schema manifest invalid');
const packed=JSON.parse(execFileSync('npm',['pack','--dry-run','--json'],{encoding:'utf8'}))[0],paths=new Set(packed.files.map(file=>file.path));
for(const path of ['dist/index.js','dist/index.d.ts','dist/wasm/calendar.wasm','schemas/manifest.json','fixtures/v1/manifest.json','README.md','CHANGELOG.md','LICENSE'])if(!paths.has(path))throw new Error(`npm tarball missing ${path}`);
console.log(JSON.stringify({releaseReady:true,version,schemaArtifacts:schemaManifest.count,packageFiles:packed.entryCount}));
