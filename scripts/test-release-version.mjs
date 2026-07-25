import { assertReleaseVersion, isPrerelease, pythonNormalizedVersion } from './release-version.mjs';

for(const version of ['0.53.0','1.0.0-rc.1','1.0.0-beta.2','2.1.3-alpha'])assertReleaseVersion(version);
for(const version of ['1','1.0','01.0.0','1.0.0-rc..1','v1.0.0']){
  try{assertReleaseVersion(version);throw new Error(`Accepted invalid version: ${version}`);}catch(error){
    if(error.message.startsWith('Accepted invalid'))throw error;
  }
}
if(!isPrerelease('1.0.0-rc.1')||isPrerelease('1.0.0')||pythonNormalizedVersion('1.0.0-rc.1')!=='1.0.0rc1')throw new Error('Prerelease normalization failed');

console.log(JSON.stringify({semverRelease:true,prerelease:true,pythonNormalization:'1.0.0rc1'}));
