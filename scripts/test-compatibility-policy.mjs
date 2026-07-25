import { readFile } from 'node:fs/promises';

const policy=JSON.parse(await readFile('policy/compatibility-policy.json','utf8'));
const pkg=JSON.parse(await readFile('package.json','utf8'));
const docs=await readFile('docs/compatibility-policy.md','utf8');
const readme=await readFile('README.md','utf8');
const contributing=await readFile('CONTRIBUTING.md','utf8');

if(policy.formatVersion!==1||policy.status!=='pre-1.0'||policy.semver!==true)throw new Error('Compatibility policy identity drift');
const nodeMajor=Number(/\d+/.exec(pkg.engines?.node??'')?.[0]);
if(policy.minimumNodeMajor!==nodeMajor)throw new Error('Compatibility policy Node floor differs from package engines');
if(policy.deprecation.minimumMinorReleases<2||!policy.deprecation.requiresReplacement||!policy.deprecation.requiresChangelog||!policy.deprecation.requiresMigrationGuideBeforeRemoval)throw new Error('Deprecation window or notice requirements weakened');
for(const [name,value] of Object.entries({packageRootExports:'public',cli:'public',python:'public',mcp:'public',jsonSchemaIds:'immutable',stableCodes:'immutable-meaning'}))if(policy.contracts[name]!==value)throw new Error(`Public contract policy drift: ${name}`);
for(const token of ['BREAKING','hai minor releases','`$id` là immutable','Stable code không được tái sử dụng','docs/migrations/'])if(!docs.includes(token))throw new Error(`Compatibility documentation missing: ${token}`);
if(!readme.includes('docs/compatibility-policy.md'))throw new Error('README does not link compatibility policy');
if(!contributing.includes('compatibility-policy.md')||!contributing.includes('patch`, `additive`, `deprecated` hoặc `breaking'))throw new Error('Contributing guide does not enforce change classification');
console.log(JSON.stringify({compatibilityPolicy:true,status:policy.status,nodeMajor,deprecationMinorReleases:policy.deprecation.minimumMinorReleases,contracts:Object.keys(policy.contracts).length}));
