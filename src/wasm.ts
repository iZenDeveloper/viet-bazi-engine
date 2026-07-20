import { calculateBaziWithCalendar } from './engine.js';
import { findJieBoundary,mod } from './calendar.js';
import type { BaziResult,BirthInput } from './types.js';
import type { CalendarOperations } from './engine.js';

export interface WasmCalendarKernel {
  readonly abiVersion:1;
  solarLongitude(unixMilliseconds:number):number;
  equationOfTime(dayOfYear:number):number;
  sexagenaryDayIndex(year:number,month:number,day:number,hour:number):number;
}

interface RawExports {
  abi_version():number; solar_longitude(ms:number):number; equation_of_time(day:number):number;
  sexagenary_day_index(year:number,month:number,day:number,hour:number):number;
}

export async function loadWasmCalendar(source:BufferSource|WebAssembly.Module):Promise<WasmCalendarKernel> {
  const imports={env:{sin:Math.sin,cos:Math.cos}};
  const instance=source instanceof WebAssembly.Module?await WebAssembly.instantiate(source,imports):(await WebAssembly.instantiate(source,imports)).instance;
  const raw=instance.exports as unknown as RawExports;
  if(typeof raw.abi_version!=='function'||raw.abi_version()!==1)throw new Error('WASM calendar ABI không tương thích');
  return {abiVersion:1,solarLongitude:(ms)=>raw.solar_longitude(ms),equationOfTime:(day)=>raw.equation_of_time(day),sexagenaryDayIndex:(year,month,day,hour)=>raw.sexagenary_day_index(year,month,day,hour)};
}

export interface WasmBaziEngine {
  readonly backend:'wasm-calendar-v1'; readonly kernel:WasmCalendarKernel;
  calculateBazi(input:BirthInput):BaziResult;
}

function operations(kernel:WasmCalendarKernel):CalendarOperations {
  const longitude=(date:Date)=>kernel.solarLongitude(date.getTime());
  return {
    baziYear(utc){const y=utc.getUTCFullYear(),lon=longitude(utc);return utc.getUTCMonth()<2&&lon<315?y-1:y;},
    solarMonthIndex(utc){return mod(Math.floor(mod(longitude(utc)-315,360)/30),12);},
    sexagenaryDayIndex(localSolar,dayBoundary){return kernel.sexagenaryDayIndex(localSolar.getUTCFullYear(),localSolar.getUTCMonth()+1,localSolar.getUTCDate(),dayBoundary==='early-zi'?localSolar.getUTCHours():0);},
    solarCorrectionMinutes(utc,locationLongitude,offsetMinutes){const start=Date.UTC(utc.getUTCFullYear(),0,0),day=(utc.getTime()-start)/86400000;return 4*(locationLongitude-offsetMinutes/4)+kernel.equationOfTime(day);},
    findNextJie(utc,direction){return findJieBoundary(utc,direction,longitude);}
  };
}

export async function createWasmBaziEngine(source:BufferSource|WebAssembly.Module):Promise<WasmBaziEngine> {
  const kernel=await loadWasmCalendar(source),calendar=operations(kernel);
  return {backend:'wasm-calendar-v1',kernel,calculateBazi:(input)=>calculateBaziWithCalendar(input,calendar)};
}
