import { describe,expect,it } from 'vitest';
import { isJieEphemerisVerified,solarMonthIndex,solarTermBoundary } from './calendar.js';
import { JIE_2026_FIXTURES,JIE_MULTI_YEAR_FIXTURES,JPL_LICHUN_MULTI_CENTURY_FIXTURES } from './conformance.js';

// National Astronomical Observatory of Japan, Reki Yoko 2026 (JCST converted to UTC).
// https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html.en
describe('2026 official Jie ephemeris fixtures',()=>{
  it.each(JIE_2026_FIXTURES)('$name boundary stays within three minutes',fixture=>{const delta=Math.abs(solarTermBoundary(2026,fixture.longitude).getTime()-Date.parse(fixture.utc));expect(delta).toBeLessThanOrEqual(3*60000);});
  it.each(JIE_2026_FIXTURES)('$name changes the Bazi month on the correct side',fixture=>{const official=Date.parse(fixture.utc);expect(solarMonthIndex(new Date(official-15*60000))).toBe((fixture.monthIndex+11)%12);expect(solarMonthIndex(new Date(official+15*60000))).toBe(fixture.monthIndex);});
});

describe('apparent solar-longitude model',()=>{
  it.each(JIE_MULTI_YEAR_FIXTURES)('$year $name stays within fifteen minutes of NAOJ',fixture=>{
    const delta=Math.abs(solarTermBoundary(fixture.year,fixture.longitude,'apparent').getTime()-Date.parse(fixture.utc));
    expect(delta).toBeLessThanOrEqual(15*60000);
  });
  it.each(JPL_LICHUN_MULTI_CENTURY_FIXTURES.points)('$year Lichun stays within seven minutes of JPL',fixture=>{
    const delta=Math.abs(solarTermBoundary(fixture.year,315,'apparent').getTime()-Date.parse(fixture.utc));
    expect(delta).toBeLessThanOrEqual(7*60000);
  });
  it('keeps legacy available explicitly',()=>expect(solarTermBoundary(1600,315,'apparent').getTime()).not.toBe(solarTermBoundary(1600,315,'legacy').getTime()));
});

describe('Jie ephemeris table',()=>{
  it.each(JIE_MULTI_YEAR_FIXTURES)('$year $name stays within three minutes of NAOJ',fixture=>{
    const delta=Math.abs(solarTermBoundary(fixture.year,fixture.longitude,'ephemeris').getTime()-Date.parse(fixture.utc));
    expect(delta).toBeLessThanOrEqual(3*60000);
  });
  it.each(JPL_LICHUN_MULTI_CENTURY_FIXTURES.points.filter(point=>point.year<=2100))('$year Lichun stays within three minutes of JPL',fixture=>{
    const delta=Math.abs(solarTermBoundary(fixture.year,315,'ephemeris').getTime()-Date.parse(fixture.utc));
    expect(delta).toBeLessThanOrEqual(3*60000);
  });
  it('is the default in the verified range and falls back to apparent outside it',()=>{
    expect(solarTermBoundary(2026,315).getTime()).toBe(solarTermBoundary(2026,315,'ephemeris').getTime());
    expect(solarTermBoundary(2200,315,'ephemeris').getTime()).toBe(solarTermBoundary(2200,315,'apparent').getTime());
    expect(solarTermBoundary(2026,0,'ephemeris').getTime()).toBe(solarTermBoundary(2026,0,'apparent').getTime());
    expect(isJieEphemerisVerified(new Date('1600-01-01T00:00:00Z'))).toBe(true);
    expect(isJieEphemerisVerified(new Date('2101-01-01T00:00:00Z'))).toBe(false);
  });
});
