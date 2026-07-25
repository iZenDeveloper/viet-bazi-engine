import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { assertReleaseVersion, pythonNormalizedVersion } from './release-version.mjs';

const pkg=JSON.parse(await readFile('package.json','utf8'));
const current=assertReleaseVersion(pkg.version);
const targetIndex=process.argv.indexOf('--to');
const target=assertReleaseVersion(targetIndex<0?'1.0.0-rc.1':process.argv[targetIndex+1]??'');
const write=process.argv.includes('--write');
if(target===current)throw new Error(`Target version already active: ${target}`);

const replacements=[
  {path:'package.json',count:1},
  {path:'package-lock.json',count:2},
  {path:'README.md',count:1},
  {path:'bindings/python/pyproject.toml',count:1},
  {path:'bindings/python/tests/test_client.py',count:2},
  {path:'docs/releasing.md',count:7},
  {path:'scripts/test-benchmark.mjs',count:1},
  {path:'src/capabilities.test.ts',count:1},
  {path:'src/engine.test.ts',count:1},
  {path:'src/engine.ts',count:1}
];

const prepared=[];
for(const item of replacements){
  const source=await readFile(item.path,'utf8');
  const actual=source.split(current).length-1;
  if(actual!==item.count)throw new Error(`${item.path}: expected ${item.count} occurrences of ${current}, found ${actual}`);
  prepared.push({...item,source});
}

if(write){
  const status=execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim();
  if(status)throw new Error('Refusing version write on a dirty worktree');
  const changelog=await readFile('CHANGELOG.md','utf8');
  if(!changelog.includes(`## ${target}`))throw new Error(`CHANGELOG missing candidate section: ## ${target}`);
  for(const item of prepared)await writeFile(item.path,item.source.replaceAll(current,target));
}

console.log(JSON.stringify({
  versionPreparation:true,
  mode:write?'write':'dry-run',
  currentVersion:current,
  targetVersion:target,
  pythonNormalizedTarget:pythonNormalizedVersion(target),
  files:replacements.map(item=>item.path),
  occurrences:replacements.reduce((total,item)=>total+item.count,0),
  nextSteps:write?['npm run sync:python','npm run release:check','npm run test:e2e']:['add CHANGELOG candidate section','rerun with --write']
}));
