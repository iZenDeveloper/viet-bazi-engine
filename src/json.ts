import { calculateAnnualTimeline, calculateBazi } from './engine.js';
import { analyzeBirthTimeSensitivity, localizeBirthTimeSensitivity } from './sensitivity.js';
import { parseLocalIso } from './calendar.js';
import { compareBirthInputs, localizeCompatibility } from './compatibility.js';
import { renderBaziSvg } from './svg.js';
import { createBaziAuditReport, localizeBaziAuditReport } from './traceability.js';
import { localizeAnnualTimeline, localizeChartSummary, localizeFacts, localizeMethodology } from './localization-report.js';
import type { AnnualTimelineEntry, BaziAuditReport, BaziBatchResult, BaziResult, BirthInput, BirthTimeSensitivity, CompatibilityResult, LocalizedAnnualTimelineReport, LocalizedAuditReport, LocalizedBirthTimeSensitivityReport, SvgOptions } from './types.js';
import { baziError, toBaziErrorPayload } from './errors.js';

const assertKnownKeys=(value:Record<string,unknown>,allowed:readonly string[],path:string)=>{const unknown=Object.keys(value).filter(key=>!allowed.includes(key));if(unknown.length)throw baziError('UNKNOWN_PROPERTY','TypeError',`${path} chứa property không hỗ trợ: ${unknown.join(', ')}`,`${path} contains unsupported properties: ${unknown.join(', ')}`);};

export function validateBirthInput(value:unknown,legacyAsOfYear?:number):BirthInput {
  if(!value||typeof value!=='object'||Array.isArray(value))throw baziError('INPUT_NOT_OBJECT','TypeError','Input phải là JSON object','Input must be a JSON object');
  const x=value as Record<string,unknown>;
  assertKnownKeys(x,['localDateTime','timezoneOffsetMinutes','asOfYear','gender','location','trueSolarTime','dayBoundary'],'Input');
  if(typeof x.localDateTime!=='string')throw baziError('LOCAL_DATETIME_TYPE','TypeError','localDateTime phải là string','localDateTime must be a string');
  try{parseLocalIso(x.localDateTime);}catch{throw baziError('LOCAL_DATETIME_FORMAT','RangeError','localDateTime không đúng định dạng hoặc không hợp lệ','localDateTime has an invalid format or value');}
  if(typeof x.timezoneOffsetMinutes!=='number'||!Number.isInteger(x.timezoneOffsetMinutes)||Math.abs(x.timezoneOffsetMinutes)>840)throw baziError('TIMEZONE_OFFSET','RangeError','timezoneOffsetMinutes phải là số nguyên trong -840..840','timezoneOffsetMinutes must be an integer in -840..840');
  const asOfYear=x.asOfYear??legacyAsOfYear;if(typeof asOfYear!=='number'||!Number.isInteger(asOfYear)||asOfYear<1600||asOfYear>2400)throw baziError('AS_OF_YEAR','RangeError','asOfYear phải là số nguyên trong 1600..2400','asOfYear must be an integer in 1600..2400');
  if(x.gender!=='male'&&x.gender!=='female')throw baziError('GENDER','TypeError','gender phải là male hoặc female','gender must be male or female');
  if(x.trueSolarTime!==undefined&&typeof x.trueSolarTime!=='boolean')throw baziError('TRUE_SOLAR_TIME_TYPE','TypeError','trueSolarTime phải là boolean','trueSolarTime must be a boolean');
  if(x.dayBoundary!==undefined&&x.dayBoundary!=='early-zi'&&x.dayBoundary!=='midnight')throw baziError('DAY_BOUNDARY','TypeError','dayBoundary phải là early-zi hoặc midnight','dayBoundary must be early-zi or midnight');
  let location:BirthInput['location'];
  if(x.location!==undefined){if(!x.location||typeof x.location!=='object'||Array.isArray(x.location))throw baziError('LOCATION_TYPE','TypeError','location phải là object','location must be an object');const l=x.location as Record<string,unknown>;assertKnownKeys(l,['city','latitude','longitude'],'location');if(l.latitude!==undefined&&(typeof l.latitude!=='number'||!Number.isFinite(l.latitude)||l.latitude < -90||l.latitude > 90))throw baziError('LATITUDE','RangeError','latitude không hợp lệ','latitude must be in -90..90');if(l.longitude!==undefined&&(typeof l.longitude!=='number'||!Number.isFinite(l.longitude)||l.longitude < -180||l.longitude > 180))throw baziError('LONGITUDE','RangeError','longitude không hợp lệ','longitude must be in -180..180');if((l.latitude===undefined)!==(l.longitude===undefined))throw baziError('LOCATION_COORDINATES_REQUIRED','RangeError','Phải truyền đủ latitude và longitude','Both latitude and longitude are required');if(l.city!==undefined&&(typeof l.city!=='string'||l.city.length<1))throw baziError('CITY_TYPE','TypeError','city phải là string không rỗng','city must be a non-empty string');if(l.city===undefined&&l.latitude===undefined)throw baziError('LOCATION_REQUIRED','RangeError','location cần city hoặc cặp latitude/longitude','location requires a city or latitude/longitude pair');location={...(typeof l.latitude==='number'?{latitude:l.latitude}:{}),...(typeof l.longitude==='number'?{longitude:l.longitude}:{}),...(typeof l.city==='string'?{city:l.city}:{})};}
  if(x.trueSolarTime===true&&!location)throw baziError('TRUE_SOLAR_LOCATION_REQUIRED','RangeError','trueSolarTime cần location','trueSolarTime requires location');
  return {localDateTime:x.localDateTime,timezoneOffsetMinutes:x.timezoneOffsetMinutes,asOfYear,gender:x.gender,...(x.trueSolarTime===undefined?{}:{trueSolarTime:x.trueSolarTime}),...(x.dayBoundary===undefined?{}:{dayBoundary:x.dayBoundary}),...(location?{location}:{})};
}

export function calculateBaziFromJson(json:string,asOfYear?:number):BaziResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw baziError('INVALID_JSON','SyntaxError','JSON input không hợp lệ','Invalid JSON input');}
  return calculateBazi(validateBirthInput(parsed,asOfYear));
}

export function calculateBaziBatch(values:readonly unknown[]):BaziBatchResult {
  if(!Array.isArray(values))throw baziError('BATCH_NOT_ARRAY','TypeError','Batch input phải là JSON array','Batch input must be a JSON array');
  if(values.length>1000)throw baziError('BATCH_LIMIT','RangeError','Batch hỗ trợ tối đa 1000 records','Batch supports at most 1000 records');
  const items:BaziBatchResult['items']=values.map((value,index)=>{try{return {index,ok:true as const,result:calculateBazi(validateBirthInput(value))};}catch(error){return {index,ok:false as const,error:toBaziErrorPayload(error)};}});
  const succeeded=items.filter(item=>item.ok).length;
  return {schemaVersion:'1.1',summary:{total:items.length,succeeded,failed:items.length-succeeded},items};
}

export function calculateBaziBatchFromJson(json:string):BaziBatchResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw baziError('INVALID_JSON','SyntaxError','JSON batch input không hợp lệ','Invalid JSON batch input');}
  if(!Array.isArray(parsed))throw baziError('BATCH_NOT_ARRAY','TypeError','Batch input phải là JSON array','Batch input must be a JSON array');
  return calculateBaziBatch(parsed);
}

export function analyzeBirthTimeSensitivityFromJson(json:string,windowMinutes=120,stepMinutes=5,asOfYear?:number):BirthTimeSensitivity {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw baziError('INVALID_JSON','SyntaxError','JSON sensitivity input không hợp lệ','Invalid JSON sensitivity input');}
  return analyzeBirthTimeSensitivity(validateBirthInput(parsed,asOfYear),windowMinutes,stepMinutes);
}
export function localizeBirthTimeSensitivityFromJson(json:string,windowMinutes=120,stepMinutes=5,locale:'vi'|'en'='vi',asOfYear?:number):LocalizedBirthTimeSensitivityReport {return localizeBirthTimeSensitivity(analyzeBirthTimeSensitivityFromJson(json,windowMinutes,stepMinutes,asOfYear),locale);}

export function compareBirthInputsFromJson(json:string):CompatibilityResult {
  let parsed:unknown;try{parsed=JSON.parse(json);}catch{throw baziError('INVALID_JSON','SyntaxError','JSON compatibility input không hợp lệ','Invalid JSON compatibility input');}
  if(!Array.isArray(parsed)||parsed.length!==2)throw baziError('COMPATIBILITY_ARITY','TypeError','Compatibility input phải là array đúng 2 birth inputs','Compatibility input must be an array of exactly 2 birth inputs');
  return compareBirthInputs(validateBirthInput(parsed[0]),validateBirthInput(parsed[1]));
}
export function localizeCompatibilityFromJson(json:string,locale:'vi'|'en'='vi') { return localizeCompatibility(compareBirthInputsFromJson(json),locale); }

export function renderBaziSvgFromJson(json:string,options:SvgOptions={}):string {return renderBaziSvg(calculateBaziFromJson(json),options);}
export function createBaziAuditReportFromJson(json:string,asOfYear?:number):BaziAuditReport {return createBaziAuditReport(calculateBaziFromJson(json,asOfYear));}
export function localizeBaziAuditReportFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number):LocalizedAuditReport {return localizeBaziAuditReport(createBaziAuditReportFromJson(json,asOfYear),locale);}
export function calculateAnnualTimelineFromJson(json:string,fromYear:number,toYear:number,asOfYear?:number):AnnualTimelineEntry[] {return calculateAnnualTimeline(calculateBaziFromJson(json,asOfYear),fromYear,toYear);}
export function localizeAnnualTimelineFromJson(json:string,fromYear:number,toYear:number,locale:'vi'|'en'='vi',asOfYear?:number):LocalizedAnnualTimelineReport {return localizeAnnualTimeline(calculateAnnualTimelineFromJson(json,fromYear,toYear,asOfYear),locale);}
export function localizeFactsFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number) { return localizeFacts(calculateBaziFromJson(json,asOfYear),locale); }
export function localizeMethodologyFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number) { return localizeMethodology(calculateBaziFromJson(json,asOfYear).metadata.methodology,locale); }
export function localizeChartSummaryFromJson(json:string,locale:'vi'|'en'='vi',asOfYear?:number) {return localizeChartSummary(calculateBaziFromJson(json,asOfYear),locale);}
