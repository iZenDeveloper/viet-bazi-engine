import { describe, expect, it } from 'vitest';
import { calculateAnnualTimeline,calculateBazi } from './engine.js';
import { SHEN_SHA_CATALOG } from './shen-sha.js';
import { solarTermBoundary } from './calendar.js';
import { calculateAnnualTimelineFromJson,calculateBaziBatch,calculateBaziBatchFromJson,calculateBaziFromJson,localizeAnnualTimelineFromJson,validateBirthInput } from './json.js';
import { findCity } from './cities.js';
import { getCoreLabels } from './localization.js';

describe('calculateBazi',()=>{
  it('is deterministic and returns four known pillars for a Jia-Zi reference day',()=>{
    const input={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,gender:'male' as const};
    const a=calculateBazi(input,2026),b=calculateBazi(input,2026);
    expect(a).toEqual(b); expect(a.pillars.day.stem.name).toBe('Giáp'); expect(a.pillars.day.branch.name).toBe('Tý');
    expect(Object.keys(a.pillars)).toHaveLength(4); expect(a.elements.reduce((s,x)=>s+x.percent,0)).toBeCloseTo(100,1);
    expect(a.schemaVersion).toBe('1.7');expect(a.metadata.supportedShenSha).toEqual(SHEN_SHA_CATALOG);
    expect(a.metadata.methodology).toMatchObject({engineVersion:'0.44.0',profileCode:'VIET_BAZI_STANDARD_V1',calendar:{dayBoundary:'EARLY_ZI'}});
    expect(a.pillars.day.stem.code).toBe('JIA');expect(a.pillars.day.branch.code).toBe('ZI');expect(a.pillars.day.tenGodCode).toBe('DAY_MASTER');
    expect(a.pattern.evidence.length).toBeGreaterThan(0);
    expect(a.luck.pillars.every(p=>p.tenGodCode.length>0)).toBe(true);expect(a.annualAnalysis.interactions).toHaveLength(4);
    expect(a.annualAnalysis.interactions.find(x=>x.withPillarCode==='DAY')?.relations.some(x=>x.typeCode==='LIU_CHONG')).toBe(true);
    expect(a.shenSha.every(x=>/^[A-Z_]+$/.test(x.code))).toBe(true);
    expect(a.luck.active.pillar?.order).toBe(a.luck.active.order);expect(a.annualAnalysis.activeLuckInteraction?.order).toBe(a.luck.active.order);
  });
  it('records selected methodology conventions',()=>{const r=calculateBazi({localDateTime:'2000-01-07T23:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male',dayBoundary:'midnight',trueSolarTime:true,location:{city:'Hà Nội'}});expect(r.metadata.methodology.calendar.dayBoundary).toBe('MIDNIGHT');expect(r.metadata.methodology.trueSolarTime).toEqual({enabled:true,model:'LONGITUDE_PLUS_EQUATION_OF_TIME'});});
  it('applies longitude and equation-of-time correction',()=>{
    const r=calculateBazi({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,gender:'female',trueSolarTime:true,location:{city:'Hà Nội',latitude:21.0285,longitude:105.8542}},2026);
    expect(Math.abs(r.normalized.correctionMinutes)).toBeGreaterThan(0);expect(r.luck.pillars).toHaveLength(8);
  });
  it('resolves Vietnamese city names offline with or without diacritics',()=>{
    expect(findCity('Sai Gon')?.name).toBe('Hồ Chí Minh');expect(findCity('ha noi')?.longitude).toBeCloseTo(105.8542);
    const r=calculateBazi({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,gender:'female',trueSolarTime:true,location:{city:'Hanoi'}},2026);
    expect(Math.abs(r.normalized.correctionMinutes)).toBeGreaterThan(0);expect(r.normalized.location?.city).toBe('Hà Nội');
  });
  it('rejects ambiguous timezone-bearing input',()=>expect(()=>calculateBazi({localDateTime:'2000-01-01T00:00:00Z',timezoneOffsetMinutes:420,gender:'male'})).toThrow());
  it('requires an explicit annual context instead of reading the system clock',()=>expect(()=>calculateBazi({localDateTime:'2000-01-01T00:00:00',timezoneOffsetMinutes:420,gender:'male'} as never)).toThrow('asOfYear'));
  it('supports both early-Zi and midnight day-boundary conventions',()=>{const base={localDateTime:'2000-01-07T23:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male' as const};const early=calculateBazi({...base,dayBoundary:'early-zi'}),midnight=calculateBazi({...base,dayBoundary:'midnight'});expect(early.pillars.day.stem.code).toBe('YI');expect(midnight.pillars.day.stem.code).toBe('JIA');expect(early.normalized.dayBoundary).toBe('early-zi');expect(midnight.normalized.dayBoundary).toBe('midnight');});
  it('matches the official 2026 Lichun ephemeris within ten minutes',()=>{
    // NAOJ: 2026-02-04 05:02 JST = 2026-02-03 20:02 UTC.
    const actual=solarTermBoundary(2026,315).getTime(),official=Date.parse('2026-02-03T20:02:00Z');
    expect(Math.abs(actual-official)).toBeLessThanOrEqual(10*60000);
  });
  it('exposes precise neighboring Jie and flags a near-boundary birth',()=>{
    const r=calculateBazi({localDateTime:'2026-02-04T03:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'});
    expect(r.normalized.solarTerms.nearBoundary).toBe(true);expect(r.normalized.solarTerms.nearestDistanceMinutes).toBeLessThan(10);
    expect(r.metadata.facts.some(f=>f.code==='NEAR_SOLAR_TERM')).toBe(true);
  });
  it('validates untyped JSON at the public boundary',()=>{
    const json='{"localDateTime":"2000-01-07T12:00:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"male"}';
    expect(calculateBaziFromJson(json).pillars.day.stem.name).toBe('Giáp');
    expect(()=>validateBirthInput({localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'unknown'})).toThrow('gender');
  });
  it('keeps runtime input validation aligned with the public schema',()=>{const base={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'};expect(()=>validateBirthInput({...base,unknown:true})).toThrow('property không hỗ trợ');expect(()=>validateBirthInput({...base,timezoneOffsetMinutes:420.5})).toThrow('-840..840');expect(()=>validateBirthInput({...base,location:{city:'Hà Nội',latitude:21}})).toThrow('đủ latitude');expect(()=>validateBirthInput({...base,location:{}})).toThrow('location cần');expect(()=>validateBirthInput({...base,trueSolarTime:true})).toThrow('trueSolarTime cần location');});
  it('calculates batches without failing valid siblings',()=>{const valid={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'};const batch=calculateBaziBatch([valid,{...valid,gender:'unknown'},valid]);expect(batch.summary).toEqual({total:3,succeeded:2,failed:1});expect(batch.items.map(x=>x.ok)).toEqual([true,false,true]);expect(batch.items[1]).toMatchObject({index:1,ok:false,error:{name:'TypeError',code:'GENDER'}});expect(JSON.stringify(batch)).not.toContain('stack');expect(calculateBaziBatchFromJson('[]').summary.total).toBe(0);expect(()=>calculateBaziBatch(Array.from({length:1001}))).toThrow('1000');});
  it('keeps machine codes stable while labels can be localized',()=>{
    const en=getCoreLabels('en'),vi=getCoreLabels('vi');
    expect(en.stems.JIA).toBe('Jia');expect(vi.stems.JIA).toBe('Giáp');expect(en.tenGods.ZHENG_GUAN).toBe('Direct Officer');
    expect(en.relations.LIU_CHONG).toBe('Six Clash');expect(en.shenSha.TIAN_YI_GUI_REN).toBe('Heavenly Noble');expect(vi.shenSha.TAO_HUA).toBe('Đào Hoa');
  });
  it('builds a reusable annual timeline without recalculating the natal chart',()=>{
    const chart=calculateBazi({localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'}),timeline=calculateAnnualTimeline(chart,2025,2027);
    expect(timeline.map(x=>x.year)).toEqual([2025,2026,2027]);expect(timeline[1]!.analysis.pillar.branch.code).toBe('WU');expect(timeline[1]!.activeLuck.order).toBe(chart.luck.active.order);
    expect(()=>calculateAnnualTimeline(chart,2027,2025)).toThrow();
  });
  it('exposes annual timeline through the strict JSON bridge',()=>{const timeline=calculateAnnualTimelineFromJson('{"localDateTime":"2000-01-07T12:00:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"male"}',2025,2027);expect(timeline).toHaveLength(3);expect(timeline[1]!.analysis.pillar.branch.code).toBe('WU');expect(()=>calculateAnnualTimelineFromJson('{bad',2025,2027)).toThrow('JSON input');});
  it('exposes localized annual timeline through the strict JSON bridge',()=>{const report=localizeAnnualTimelineFromJson('{"localDateTime":"2000-01-07T12:00:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"male"}',2025,2027,'en');expect(report).toMatchObject({locale:'en',fromYear:2025,toYear:2027});expect(report.entries[1]?.annual.branch).toBe('Horse');});
});
