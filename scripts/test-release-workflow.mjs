import { readFile } from 'node:fs/promises';
const workflow=await readFile('.github/workflows/release.yml','utf8'),docs=await readFile('docs/releasing.md','utf8');
for(const token of ["tags: ['v*']",'contents: write','npm test','test:python-wheel','GITHUB_REF_NAME','npm pack','pip wheel','sha256sum','actions/upload-artifact@v4','gh release create','github.token'])if(!workflow.includes(token))throw new Error(`Release workflow missing ${token}`);
if(/npm publish|twine upload/.test(workflow))throw new Error('Release workflow must not publish registries without explicit credentials');
if(!docs.includes('không tự publish lên npm/PyPI'))throw new Error('Release documentation must state registry boundary');
console.log(JSON.stringify({tagGated:true,checksums:true,githubRelease:true,registryPublish:false}));
