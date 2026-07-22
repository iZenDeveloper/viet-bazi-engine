import { calculateAnnualTimeline, calculateBazi } from './engine.js';
import { analyzeBirthTimeSensitivity } from './sensitivity.js';
import { parseLocalIso } from './calendar.js';
import { compareBirthInputs } from './compatibility.js';
import { renderBaziSvg } from './svg.js';
import { createBaziAuditReport } from './traceability.js';
import { localizeFacts, localizeMethodology } from './localization-report.js';
import type { AnnualTimelineEntry, BaziAuditReport, BaziBatchResult, BaziResult, BirthInput, BirthTimeSensitivity, CompatibilityResult, SvgOptions } from './types.js';

const assertKnownKeys=(value:Record<string,unknown>,allowed:readonly string[],path:string)=>{const unknown=Object.keys(value).filter(key=>!allowed.includes(key));if(unknown.length)throw new TypeError(`${path} chứa property không hỗ trợ: ${unknown.join(', ')}`);};

export function validateBirthInput(value:unknown,legacyAsOfYear?:number):BirthInput {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Input phải là JSON object');
  const x=value as Record<string,unknown>;
  assertKnownKeys(x,['localDateTime','timezoneOffsetMinutes','asOfYear','gender','location','trueSolarTime','dayBoundary'],'Input');
  if(typeof x.localDateTime!=='string')throw new TypeError('localDateTime phải là string');
  parseLocalIso(x.localDateTime);
  if(typeof x.timezoneOffsetMinutes!=='number'||!Number.isInteger(x.timezoneOffsetMinutes)||Math.abs(x.timezoneOffsetMinutes)>840)throw new RangeError('timezoneOffsetMinutes phải là số nguyên trong -840..840');
  const asOfYear=x.asOfYear??legacyAsOfYear;if(typeof asOfYear!=='number'||!Number.isInteger(asOfYear)||asOfYear<1600||asOfYear>2400)throw new RangeError('asOfYear phải là số nguyên trong 1600..2400');
  if(x.gender!=='male'&&x.gender!=='female')throw new TypeError('gender phải là male hoặc female');
  if(x.trueSolarTime!==undefined&&typeof x.trueSolarTime!=='boolean')throw new TypeError('trueSolarTime phải là boolean');
  if(x.dayBoundary!==undefined&&x.dayBoundary!=='early-zi'&&x.dayBoundary!=='midnight')throw new TypeError('dayBoundary phải là early-zi hoặc midnight');
  let location:BirthInput['location'];
  if(x.location!==undefined){if(!x.location||typeof x.location!=='object'||Array.isArray(x.location))throw new TypeError('location phải là object');const l=x.location as Record<string,unknown>;assertKnownKeys(l,['city','latitude','longitude'],'location');if(l.latitude!==undefined&&(typeof l.latitude!=='number'||!Number.isFinite(l.latitude)||l.latitude < -90||l.latitude > 90))throw new RangeError('latitude không hợp lệ');if(l.longitude!==undefined&&(typeof l.longitude!=='number'||!Number.isFinite(l.longitude)||l.longitude < -180||l.longitude > 180))throw new RangeError('longitude không hợp lệ');if((l.latitude===undefined)!==(l.longitude===undefined))throw new RangeError('Phải truyền đủ latitude và longitude');if(l.city!==undefined&&(typeof l.city!=='string'||l.city.length<1))throw new TypeError('city phải là string không rỗng');if(l.city===undefined&&l.latitude===undefined)throw new RangeError('location cần city hoặc cặp latitude/longitude');location={...(typeof l.latitude==='number'?{latitude:l.latitude}:{}),...(typeof l.longitude==='number'?{longitude:l.longitude}:{}),...(typeof l.city==='string'?{city:l.city}:{})};}
  if(x.trueSolarTime===true&&!location)throw new RangeError('trueSolarTime cần location');
  return {localDateTime:x.localDateTime,timezoneOffsetMinutes:x.timezoneOffsetMinutes,asOfYear,gender:x.gender,...(x.trueSolarTime===undefined?{}:{trueSolarTime:x.trueSolarTime}),...(x.dayBoundary===undefined?{}:{dayBoundary:x.dayBoundary}),...(location?{location}:{})};
}

export function calculateBaziFromJson(json:string,asOfYear?:number):BaziResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw new SyntaxError('JSON input không hợp lệ');}
  return calculateBazi(validateBirthInput(parsed,asOfYear));
}

export function calculateBaziBatch(values:readonly unknown[]):BaziBatchResult {
  if(!Array.isArray(values))throw new TypeError('Batch input phải là JSON array');
  if(values.length>1000)throw new RangeError('Batch hỗ trợ tối đa 1000 records');
  const items:BaziBatchResult['items']=values.map((value,index)=>{try{return {index,ok:true as const,result:calculateBazi(validateBirthInput(value))};}catch(error){return {index,ok:false as const,error:{name:error instanceof Error?error.name:'Error',message:error instanceof Error?error.message:String(error)}};}});
  const succeeded=items.filter(item=>item.ok).length;
  return {schemaVersion:'1.0',summary:{total:items.length,succeeded,failed:items.length-succeeded},items};
}

export function calculateBaziBatchFromJson(json:string):BaziBatchResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw new SyntaxError('JSON batch input không hợp lệ');}
  if(!Array.isArray(parsed))throw new TypeError('Batch input phải là JSON array');
  return calculateBaziBatch(parsed);
}

export function analyzeBirthTimeSensitivityFromJson(json:string,windowMinutes=120,stepMinutes=5,asOfYear?:number):BirthTimeSensitivity {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw new SyntaxError('JSON sensitivity input không hợp lệ');}
  return analyzeBirthTimeSensitivity(validateBirthInput(parsed,asOfYear),windowMinutes,stepMinutes);
}

export function compareBirthInputsFromJson(json:string):CompatibilityResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw new SyntaxError('JSON compatibility input không hợp lệ');}
  if(!Array.isArray(parsed)||parsed.length!==2)throw new TypeError('Compatibility input phải là array đúng 2 birth inputs');
  return compareBirthInputs(validateBirthInput(parsed[0]),validateBirthInput(parsed[1]));
}

export function renderBaziSvgFromJson(json:string,options:SvgOptions={}):string {return renderBaziSvg(calculateBaziFromJson(json),options);}
export function createBaziAuditReportFromJson(json:string,asOfYear?:number):BaziAuditReport {return createBaziAuditReport(calculateBaziFromJson(json,asOfYear));}
export function calculateAnnualTimelineFromJson(json:string,fromYear:number,toYear:number,asOfYear?:number):AnnualTimelineEntry[] {return calculateAnnualTimeline(calculateBaziFromJson(json,asOfYear),fromYear,toYear);}
export function localizeFactsFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number) { return localizeFacts(calculateBaziFromJson(json,asOfYear),locale); }
export function localizeMethodologyFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number) { return localizeMethodology(calculateBaziFromJson(json,asOfYear).metadata.methodology,locale); }
