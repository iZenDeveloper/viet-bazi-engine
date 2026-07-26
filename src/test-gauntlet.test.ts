import { execFileSync,spawnSync } from 'node:child_process';
import { describe,expect,it } from 'vitest';

describe('test gauntlet CLI',()=>{
  it('publishes a machine-readable quick plan',()=>{
    const output=execFileSync(process.execPath,['scripts/test-gauntlet.mjs','--profile','quick','--list','--json'],{encoding:'utf8'});
    const plan=JSON.parse(output);
    expect(plan).toMatchObject({tool:'viet-bazi-test-gauntlet',version:1,profile:'quick',failFast:true});
    expect(plan.gates.map((gate:{id:string})=>gate.id)).toEqual(['build','unit','property','mutation']);
    expect(plan.layers.find((layer:{name:string})=>layer.name==='property')).toMatchObject({covered:true});
    expect(plan.layers.find((layer:{name:string})=>layer.name==='acceptance')).toMatchObject({covered:false});
  });
  it('covers all six quality layers in the full plan',()=>{
    const output=execFileSync(process.execPath,['scripts/test-gauntlet.mjs','--profile','full','--list','--json'],{encoding:'utf8'});
    const plan=JSON.parse(output);
    expect(plan.layers).toHaveLength(6);
    expect(plan.layers.every((layer:{covered:boolean})=>layer.covered)).toBe(true);
    expect(plan.gates.map((gate:{id:string})=>gate.id)).toContain('browser-acceptance');
  });
  it('rejects unknown profiles',()=>{
    const result=spawnSync(process.execPath,['scripts/test-gauntlet.mjs','--profile','unknown','--list'],{encoding:'utf8'});
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Unknown profile');
  });
});
