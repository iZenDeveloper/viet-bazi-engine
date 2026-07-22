import { readFile } from 'node:fs/promises';
const workflow=await readFile('.github/workflows/pages.yml','utf8');
for(const token of ['workflow_dispatch','pages: write','id-token: write','npm test','prepare-pages.mjs','test-pages-artifact.mjs','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','test-pages-live.mjs','page_url'])if(!workflow.includes(token))throw new Error(`Pages workflow missing ${token}`);
if(/^\s+push:/m.test(workflow))throw new Error('Pages deployment must remain manual until explicitly enabled');
console.log(JSON.stringify({pagesManual:true,oidc:true,deployAction:true}));
