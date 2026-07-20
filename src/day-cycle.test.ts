import { describe,expect,it } from 'vitest';
import { sexagenaryDayIndex } from './calendar.js';
import { SEXAGENARY_DAY_FIXTURES } from './conformance.js';

// NAOJ Japanese Calendar Database, Gregorian conversion with Eto of Day.
// https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/caldb_en.cgi
describe('official sexagenary-day fixtures',()=>{
  it.each(SEXAGENARY_DAY_FIXTURES)('$date is $eto',fixture=>{expect(sexagenaryDayIndex(new Date(`${fixture.date}T12:00:00Z`))).toBe(fixture.index);});
  it.each(SEXAGENARY_DAY_FIXTURES)('$date follows the configured early-Zi boundary',fixture=>{expect(sexagenaryDayIndex(new Date(`${fixture.date}T22:59:00Z`))).toBe(fixture.index);expect(sexagenaryDayIndex(new Date(`${fixture.date}T23:00:00Z`))).toBe((fixture.index+1)%60);});
});
