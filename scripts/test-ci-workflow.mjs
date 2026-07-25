import { readFile } from 'node:fs/promises';

const workflow=await readFile('.github/workflows/ci.yml','utf8');
for(const token of [
  'workflow_dispatch:',
  'browser-e2e:',
  'npx playwright install --with-deps chromium firefox webkit',
  'npm run test:e2e',
  'reference-benchmark:',
  "if: github.event_name == 'workflow_dispatch'",
  'node scripts/benchmark-reference.mjs',
  'actions/upload-artifact@v4',
  'benchmark-node20-linux-${{ github.sha }}'
])if(!workflow.includes(token))throw new Error(`CI workflow missing ${token}`);

console.log(JSON.stringify({hostedBrowserE2e:true,referenceBenchmarkDispatch:true,nodeMajor:20,benchmarkArtifact:true}));
