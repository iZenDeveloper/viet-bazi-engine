import { readFileSync } from 'node:fs';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { solarMonthIndex,solarTermBoundary } from '../dist/calendar.js';
import { sexagenaryDayIndex } from '../dist/calendar.js';
import { CONFORMANCE_VERSION,JIE_2026_FIXTURES,SEXAGENARY_DAY_FIXTURES } from '../dist/conformance.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=name=>JSON.parse(readFileSync(resolve(root,'fixtures/v1',name),'utf8'));
const jie=load('jie-2026.json'),days=load('sexagenary-days.json');
const manifest=load('manifest.json');
if(manifest.fixtureVersion!==CONFORMANCE_VERSION)throw new Error('Conformance manifest version differs from TypeScript export');
if(JSON.stringify(jie)!==JSON.stringify(JIE_2026_FIXTURES))throw new Error('Jie JSON differs from TypeScript fixtures');
if(JSON.stringify(days)!==JSON.stringify(SEXAGENARY_DAY_FIXTURES))throw new Error('Day JSON differs from TypeScript fixtures');
let maxSolarTermErrorMinutes=0;
for(const f of jie){
  const official=Date.parse(f.utc),error=Math.abs(solarTermBoundary(2026,f.longitude).getTime()-official)/60000;
  maxSolarTermErrorMinutes=Math.max(maxSolarTermErrorMinutes,error);
  if(error>15)throw new Error(`${f.name}: solar-term error ${error.toFixed(2)} minutes`);
  if(solarMonthIndex(new Date(official+15*60000))!==f.monthIndex)throw new Error(`${f.name}: wrong month after boundary`);
}
for(const f of days)if(sexagenaryDayIndex(new Date(`${f.date}T12:00:00Z`))!==f.index)throw new Error(`${f.date}: wrong sexagenary day`);
console.log(JSON.stringify({fixtureVersion:CONFORMANCE_VERSION,solarTerms:jie.length,sexagenaryDays:days.length,maxSolarTermErrorMinutes:Math.round(maxSolarTermErrorMinutes*100)/100}));
