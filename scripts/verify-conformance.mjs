import { readFileSync } from 'node:fs';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { solarMonthIndex,solarTermBoundary } from '../dist/calendar.js';
import { sexagenaryDayIndex } from '../dist/calendar.js';
import { calculateBazi } from '../dist/engine.js';
import { CONFORMANCE_VERSION,JIE_2026_FIXTURES,JIE_MULTI_YEAR_FIXTURES,SEXAGENARY_DAY_FIXTURES,TIMEZONE_BOUNDARY_FIXTURES } from '../dist/conformance.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=name=>JSON.parse(readFileSync(resolve(root,'fixtures/v1',name),'utf8'));
const jie=load('jie-2026.json'),multiYearJie=load('jie-multi-year.json'),days=load('sexagenary-days.json'),timezoneBoundaries=load('timezone-boundaries.json');
const manifest=load('manifest.json');
if(manifest.fixtureVersion!==CONFORMANCE_VERSION)throw new Error('Conformance manifest version differs from TypeScript export');
if(JSON.stringify(jie)!==JSON.stringify(JIE_2026_FIXTURES))throw new Error('Jie JSON differs from TypeScript fixtures');
if(JSON.stringify(multiYearJie)!==JSON.stringify(JIE_MULTI_YEAR_FIXTURES))throw new Error('Multi-year Jie JSON differs from TypeScript fixtures');
if(JSON.stringify(days)!==JSON.stringify(SEXAGENARY_DAY_FIXTURES))throw new Error('Day JSON differs from TypeScript fixtures');
if(JSON.stringify(timezoneBoundaries)!==JSON.stringify(TIMEZONE_BOUNDARY_FIXTURES))throw new Error('Timezone/boundary JSON differs from TypeScript fixtures');
let maxSolarTermErrorMinutes=0;
for(const f of jie){
  const official=Date.parse(f.utc),error=Math.abs(solarTermBoundary(2026,f.longitude).getTime()-official)/60000;
  maxSolarTermErrorMinutes=Math.max(maxSolarTermErrorMinutes,error);
  if(error>15)throw new Error(`${f.name}: solar-term error ${error.toFixed(2)} minutes`);
  if(solarMonthIndex(new Date(official+15*60000))!==f.monthIndex)throw new Error(`${f.name}: wrong month after boundary`);
}
for(const f of multiYearJie){
  const official=Date.parse(f.utc),error=Math.abs(solarTermBoundary(f.year,f.longitude).getTime()-official)/60000;
  maxSolarTermErrorMinutes=Math.max(maxSolarTermErrorMinutes,error);
  if(error>15)throw new Error(`${f.year} ${f.name}: solar-term error ${error.toFixed(2)} minutes`);
  if(solarMonthIndex(new Date(official+15*60000))!==f.monthIndex)throw new Error(`${f.year} ${f.name}: wrong month after boundary`);
}
for(const f of days)if(sexagenaryDayIndex(new Date(`${f.date}T12:00:00Z`))!==f.index)throw new Error(`${f.date}: wrong sexagenary day`);
const code=pillar=>`${pillar.stem.code}-${pillar.branch.code}`,sameUtcGroups=new Map();
for(const f of timezoneBoundaries){
  const chart=calculateBazi({localDateTime:f.localDateTime,timezoneOffsetMinutes:f.timezoneOffsetMinutes,asOfYear:2026,gender:'male',dayBoundary:f.dayBoundary});
  if(chart.normalized.utcTime!==f.utc)throw new Error(`${f.id}: UTC normalization drift`);
  for(const key of ['year','month','day','hour'])if(code(chart.pillars[key])!==f[key])throw new Error(`${f.id}: ${key} pillar drift`);
  if(f.group.startsWith('same-utc-')){const values=sameUtcGroups.get(f.group)??[];values.push(chart);sameUtcGroups.set(f.group,values);}
}
for(const [group,charts] of sameUtcGroups){
  if(new Set(charts.map(chart=>chart.normalized.utcTime)).size!==1)throw new Error(`${group}: normalized UTC differs`);
  if(new Set(charts.map(chart=>code(chart.pillars.year))).size!==1||new Set(charts.map(chart=>code(chart.pillars.month))).size!==1)throw new Error(`${group}: year/month differs for one UTC instant`);
}
console.log(JSON.stringify({fixtureVersion:CONFORMANCE_VERSION,solarTerms:jie.length+multiYearJie.length,solarTermYears:[...new Set([2026,...multiYearJie.map(f=>f.year)])].sort(),sexagenaryDays:days.length,timezoneBoundaries:timezoneBoundaries.length,timezoneInvariantGroups:sameUtcGroups.size,maxSolarTermErrorMinutes:Math.round(maxSolarTermErrorMinutes*100)/100}));
