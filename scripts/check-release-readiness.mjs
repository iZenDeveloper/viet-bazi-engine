import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { assertReleaseVersion, pythonNormalizedVersion } from './release-version.mjs';

const pkg=JSON.parse(await readFile('package.json','utf8'));
const ciWorkflow=await readFile('.github/workflows/ci.yml','utf8');
const candidateIndex=process.argv.indexOf('--candidate');
const candidate=assertReleaseVersion(candidateIndex<0?'1.0.0-rc.1':process.argv[candidateIndex+1]??'');
const command=(file,args)=>spawnSync(file,args,{encoding:'utf8'});
const git=command('git',['status','--porcelain']);
const preflight=command(process.execPath,['scripts/release-preflight.mjs']);
const api=command(process.execPath,['scripts/audit-public-api.mjs']);
const npmIdentity=command('npm',['whoami']);
const pypiCredential=Boolean(process.env.TWINE_PASSWORD||process.env.UV_PUBLISH_TOKEN);

const gates={
  cleanWorktree:git.status===0&&git.stdout.trim()==='',
  releasePreflight:preflight.status===0,
  publicApiSnapshot:api.status===0,
  hostedBrowserWorkflowConfigured:ciWorkflow.includes('browser-e2e:')&&ciWorkflow.includes('npm run test:e2e'),
  npmAuthenticated:npmIdentity.status===0,
  pypiCredentialConfigured:pypiCredential
};
const blockers=Object.entries(gates).filter(([,ready])=>!ready).map(([name])=>name);

console.log(JSON.stringify({
  formatVersion:1,
  currentVersion:pkg.version,
  candidateVersion:candidate,
  pythonNormalizedCandidate:pythonNormalizedVersion(candidate),
  gates,
  readyForRcTag:blockers.length===0,
  blockers
}));
