import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const readme = await readFile('README.md', 'utf8');
const roadmap = await readFile('docs/roadmap.md', 'utf8');

for (const token of [
  `Trạng thái: \`${pkg.version}\``,
  'actions/workflows/ci.yml/badge.svg',
  'releases/latest',
  'npm run benchmark',
  'docs/benchmarks.md'
]) {
  if (!readme.includes(token)) throw new Error(`README missing current project metadata: ${token}`);
}
if (/Suite hiện có \d+ test/.test(readme)) throw new Error('README must not contain manually maintained test totals');
if (!roadmap.includes('## Phase 4 — Reliability & Adoption')) throw new Error('Roadmap missing Phase 4');

console.log(JSON.stringify({ readmeMetadata: true, version: pkg.version, manualTestTotals: false }));
