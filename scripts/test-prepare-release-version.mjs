import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { pythonNormalizedVersion } from './release-version.mjs';

const before=await readFile('package.json','utf8'),current=JSON.parse(before).version;
const rc=/^1\.0\.0-rc\.(\d+)$/.exec(current),target=rc?`1.0.0-rc.${Number(rc[1])+1}`:'1.0.0-rc.1';
const output=execFileSync(process.execPath,['scripts/prepare-release-version.mjs','--to',target],{encoding:'utf8'});
const report=JSON.parse(output);
const after=await readFile('package.json','utf8');

if(before!==after||report.mode!=='dry-run'||report.currentVersion!==current||report.targetVersion!==target||report.pythonNormalizedTarget!==pythonNormalizedVersion(target)||report.files.length!==10||report.occurrences!==19)throw new Error('Release version dry-run contract failed');
console.log(JSON.stringify({releaseVersionDryRun:true,target:report.targetVersion,files:report.files.length,workspaceUnchanged:true}));
