import { readFile } from 'node:fs/promises';
import { createWasmBaziEngine,loadWasmCalendar } from '../dist/wasm.js';
import { calculateBazi } from '../dist/engine.js';
import { equationOfTime,solarLongitude } from '../dist/calendar.js';

const bytes=await readFile(new URL('../dist/wasm/calendar.wasm',import.meta.url));
const kernel=await loadWasmCalendar(bytes);
const longitude=kernel.solarLongitude(Date.parse('2026-02-03T20:02:00Z'));
if(Math.abs(longitude-315)>0.01)throw new Error(`Unexpected Lichun longitude: ${longitude}`);
if(kernel.sexagenaryDayIndex(2000,1,7,12)!==0)throw new Error('Sexagenary reference day mismatch');
if(kernel.sexagenaryDayIndex(2000,1,7,23)!==1)throw new Error('Early-Zi boundary mismatch');
for(const [year,month,day,index] of [[1900,1,1,10],[1950,6,15,17],[1984,2,2,2],[2000,1,7,0],[2026,7,21,32],[2099,12,31,38]])if(kernel.sexagenaryDayIndex(year,month,day,12)!==index)throw new Error(`WASM Eto mismatch at ${year}-${month}-${day}`);
for(const iso of ['1900-01-01T00:00:00Z','2000-06-21T12:00:00Z','2026-02-03T20:02:00Z','2099-12-31T23:59:00Z']){
  const ms=Date.parse(iso),difference=Math.abs(kernel.solarLongitude(ms)-solarLongitude(new Date(ms)));
  if(difference>1e-9)throw new Error(`Solar-longitude parity mismatch at ${iso}: ${difference}`);
}
for(const day of [1,81,172,266,365]){const date=new Date(Date.UTC(2026,0,day));const difference=Math.abs(kernel.equationOfTime(day)-equationOfTime(date));if(difference>1e-9)throw new Error(`Equation-of-time parity mismatch on day ${day}: ${difference}`);}
const engine=await createWasmBaziEngine(bytes);
const fixtures=[
  {localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'},
  {localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'female',trueSolarTime:true,location:{city:'Hà Nội'}},
  {localDateTime:'2026-02-04T02:59:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'}
];
for(const input of fixtures){const js=calculateBazi(input),wasm=engine.calculateBazi(input);if(JSON.stringify(js)!==JSON.stringify(wasm))throw new Error(`Full-output WASM parity mismatch for ${input.localDateTime}`);}
console.log(JSON.stringify({abiVersion:kernel.abiVersion,lichunLongitude:longitude,referenceDayIndex:0}));
