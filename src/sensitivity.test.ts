import { describe,expect,it } from 'vitest';
import { analyzeBirthTimeSensitivity } from './sensitivity.js';

describe('birth-time sensitivity',()=>{
  it('finds pillar changes around a solar-term boundary',()=>{const result=analyzeBirthTimeSensitivity({localDateTime:'2026-02-04T03:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'},15,5);expect(result.stable).toBe(false);expect(result.variants.some(x=>x.changedPillars.includes('YEAR'))).toBe(true);expect(result.variants.some(x=>x.changedPillars.includes('MONTH'))).toBe(true);expect(result.sampleCount).toBe(7);});
  it('reports a stable interval away from all pillar boundaries',()=>{const result=analyzeBirthTimeSensitivity({localDateTime:'2000-01-07T12:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'},20,5);expect(result.stable).toBe(true);expect(result.variants).toHaveLength(1);expect(result.variants[0]?.changedPillars).toEqual([]);});
  it('bounds sampling cost',()=>{const input={localDateTime:'2000-01-07T12:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male' as const};expect(()=>analyzeBirthTimeSensitivity(input,720,1)).toThrow('289');expect(()=>analyzeBirthTimeSensitivity(input,0,1)).toThrow('windowMinutes');});
});
