import { describe,expect,it } from 'vitest';
import { solarMonthIndex,solarTermBoundary } from './calendar.js';
import { JIE_2026_FIXTURES } from './conformance.js';

// National Astronomical Observatory of Japan, Reki Yoko 2026 (JCST converted to UTC).
// https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html.en
describe('2026 official Jie ephemeris fixtures',()=>{
  it.each(JIE_2026_FIXTURES)('$name boundary stays within fifteen minutes',fixture=>{const delta=Math.abs(solarTermBoundary(2026,fixture.longitude).getTime()-Date.parse(fixture.utc));expect(delta).toBeLessThanOrEqual(15*60000);});
  it.each(JIE_2026_FIXTURES)('$name changes the Bazi month on the correct side',fixture=>{const official=Date.parse(fixture.utc);expect(solarMonthIndex(new Date(official-15*60000))).toBe((fixture.monthIndex+11)%12);expect(solarMonthIndex(new Date(official+15*60000))).toBe(fixture.monthIndex);});
});
