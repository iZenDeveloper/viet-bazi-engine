import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const before=await readFile('package.json','utf8');
const output=execFileSync(process.execPath,['scripts/prepare-release-version.mjs','--to','1.0.0-rc.1'],{encoding:'utf8'});
const report=JSON.parse(output);
const after=await readFile('package.json','utf8');

if(before!==after||report.mode!=='dry-run'||report.currentVersion!=='0.53.0'||report.targetVersion!=='1.0.0-rc.1'||report.pythonNormalizedTarget!=='1.0.0rc1'||report.files.length!==10||report.occurrences!==14)throw new Error('Release version dry-run contract failed');
console.log(JSON.stringify({releaseVersionDryRun:true,target:report.targetVersion,files:report.files.length,workspaceUnchanged:true}));
