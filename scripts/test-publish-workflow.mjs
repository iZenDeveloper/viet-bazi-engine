import { readFile } from 'node:fs/promises';

const workflow=await readFile('.github/workflows/publish.yml','utf8');
for(const token of ['workflow_dispatch:','tag:','default: v1.0.0-rc.2','contents: read','id-token: write','environment: registry-publish','node-version: 24','package-manager-cache: false','npm run release:check','Verify requested tag','npm publish --access public --tag "$dist_tag"','dist_tag=next','python -m pip wheel','pypa/gh-action-pypi-publish@release/v1','packages-dir: dist-pypi/'])if(!workflow.includes(token))throw new Error(`Publish workflow missing ${token}`);
if(/NODE_AUTH_TOKEN|TWINE_PASSWORD|UV_PUBLISH_TOKEN/.test(workflow))throw new Error('Publish workflow must use OIDC instead of long-lived registry tokens');
if(/on:\s*\n\s+push:/.test(workflow))throw new Error('Registry publish must require an explicit workflow dispatch');
console.log(JSON.stringify({manualDispatch:true,environmentApproval:true,oidc:true,npmDistTagGuard:true,pypiTrustedPublisher:true,longLivedTokens:false}));
