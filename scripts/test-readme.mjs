import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const readme = await readFile('README.md', 'utf8');
const roadmap = await readFile('docs/roadmap.md', 'utf8');
const pyproject = await readFile('bindings/python/pyproject.toml', 'utf8');
const pypiReadme = await readFile('bindings/python/README.md', 'utf8');
const socialPreview = await readFile('.github/social-preview.png');
const quickStarts = await Promise.all([
  readFile('docs/quick-start-ai-mcp-agent.md', 'utf8'),
  readFile('docs/quick-start-practitioner-crm.md', 'utf8'),
  readFile('docs/quick-start-privacy-web-app.md', 'utf8')
]);

for (const token of [
  `Trạng thái: \`${pkg.version}\``,
  'actions/workflows/ci.yml/badge.svg',
  'releases/latest',
  'https://izendeveloper.github.io/viet-bazi-engine/',
  'Vì sao dự án này tồn tại?',
  'Phù hợp cho',
  'Thử trong 30 giây',
  'npm install viet-bazi-engine@next',
  'npm run benchmark',
  'docs/benchmarks.md',
  'docs/quick-start-ai-mcp-agent.md',
  'docs/quick-start-practitioner-crm.md',
  'docs/quick-start-privacy-web-app.md',
  'https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/LICENSE'
]) {
  if (!readme.includes(token)) throw new Error(`README missing current project metadata: ${token}`);
}
if (/Suite hiện có \d+ test/.test(readme)) throw new Error('README must not contain manually maintained test totals');
if (/\]\((?!https?:|#)/.test(readme)) throw new Error('README contains a relative link that will drift between npm and GitHub');
if (!roadmap.includes('## Phase 4 — Reliability & Adoption')) throw new Error('Roadmap missing Phase 4');
if (!pyproject.includes('readme = { file = "README.md", content-type = "text/markdown" }')) throw new Error('PyPI long description is not configured');
for (const token of ['Node.js 20', 'no Python dependencies', 'metadata.methodology']) {
  if (!pypiReadme.includes(token)) throw new Error(`PyPI README missing runtime/product detail: ${token}`);
}
for (const [index, quickStart] of quickStarts.entries()) {
  if (!quickStart.includes('## 1.') && !quickStart.includes('## Cách A:')) throw new Error(`Quick-start ${index + 1} is missing an executable path`);
}
if (socialPreview.toString('ascii', 1, 4) !== 'PNG') throw new Error('Social preview must be a PNG');
const previewSize = {
  width: socialPreview.readUInt32BE(16),
  height: socialPreview.readUInt32BE(20)
};
if (previewSize.width !== 1280 || previewSize.height !== 640) throw new Error(`Social preview must be 1280x640, received ${previewSize.width}x${previewSize.height}`);

console.log(JSON.stringify({ readmeMetadata: true, version: pkg.version, registryLinksPortable: true, pypiDescription: true, quickStarts: quickStarts.length, socialPreview: previewSize, manualTestTotals: false }));
