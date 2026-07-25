export const RELEASE_VERSION_PATTERN=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|[a-zA-Z-][0-9a-zA-Z-]*))*))?$/;

export function assertReleaseVersion(version){
  if(!RELEASE_VERSION_PATTERN.test(version))throw new Error(`Invalid SemVer release version: ${version}`);
  return version;
}

export function isPrerelease(version){
  assertReleaseVersion(version);
  return version.includes('-');
}

export function pythonNormalizedVersion(version){
  assertReleaseVersion(version);
  const match=/^(\d+\.\d+\.\d+)-rc\.(\d+)$/.exec(version);
  return match?`${match[1]}rc${match[2]}`:version;
}
