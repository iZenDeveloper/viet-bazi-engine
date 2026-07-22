import { describe,expect,it } from 'vitest';
import { getEngineCapabilities } from './capabilities.js';

describe('engine capability discovery',()=>{
  it('is deterministic and returns isolated manifests',()=>{const a=getEngineCapabilities(),b=getEngineCapabilities();expect(a).toEqual(b);expect(a).not.toBe(b);a.features.pop();expect(b.features).toContain('WASM_CALENDAR');});
  it('advertises actual public limits and schemas',()=>{const value=getEngineCapabilities();expect(value).toMatchObject({schemaVersion:'1.0',engineVersion:'0.27.0',offline:true,runtimeDependencyCount:0,limits:{batchRecords:1000,stdinBytes:10485760,sensitivitySamples:289,annualTimelineYears:201}});expect(Object.values(value.schemas).every(id=>id.startsWith('https://viet-bazi.dev/schema/'))).toBe(true);expect(value.schemas.compatibilityResult).toContain('compatibility-result-1.0');expect(value.schemas.baziAuditReport).toContain('bazi-audit-report-1.0');expect(value.features).toContain('AUDIT_TRACE');});
});
