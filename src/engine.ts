import { BRANCH_CODES, BRANCHES, CONTROLS, ELEMENT_CODES, ELEMENTS, GENERATES, STEMS, TEN_GOD_CODES } from './constants.js';
import { baziYear, findNextJie, mod, parseLocalIso, sexagenaryDayIndex, solarCorrectionMinutes, solarMonthIndex, toUtc } from './calendar.js';
import { analyzePattern } from './pattern.js';
import { calculateShenSha, SHEN_SHA_CATALOG } from './shen-sha.js';
import { resolveLocation } from './cities.js';
import type { ActiveLuck, AnnualAnalysis, AnnualTimelineEntry, BaziResult, BirthInput, Branch, BranchName, DayBoundaryConvention, Element, ElementScore, LuckPillar, MetadataFact, MethodologyManifest, Pillar, Relation, RelationTypeCode, Stem, TenGod } from './types.js';

export const ENGINE_VERSION='0.34.0' as const;
export function getMethodologyManifest(dayBoundary:DayBoundaryConvention,trueSolarTime:boolean):MethodologyManifest {
  return {engineVersion:ENGINE_VERSION,profileCode:'VIET_BAZI_STANDARD_V1',calendar:{yearBoundary:'LI_CHUN',monthBoundary:'TWELVE_JIE',dayBoundary:dayBoundary==='early-zi'?'EARLY_ZI':'MIDNIGHT',hourBoundary:'ZI_CENTERED_TWO_HOUR',solarTermModel:'APPROXIMATE_SOLAR_LONGITUDE'},trueSolarTime:{enabled:trueSolarTime,model:trueSolarTime?'LONGITUDE_PLUS_EQUATION_OF_TIME':'DISABLED'},luckCycle:{directionRule:'GENDER_AND_YEAR_STEM_POLARITY',startBoundary:'DIRECTIONAL_JIE',ageConversion:'THREE_DAYS_PER_YEAR'},analysis:{elementBalance:'WEIGHTED_HEURISTIC_V1',pattern:'MONTH_QI_HEURISTIC_V1',shenSha:'CATALOG_V1'}};
}

const stem=(i:number):Stem=>({index:mod(i,10),...STEMS[mod(i,10)]!});
function tenGod(day:Stem,other:Stem):TenGod {
  const same=day.polarity===other.polarity;
  if(other.element===day.element) return same?'Tỷ Kiên':'Kiếp Tài';
  if(GENERATES[day.element]===other.element) return same?'Thực Thần':'Thương Quan';
  if(CONTROLS[day.element]===other.element) return same?'Thiên Tài':'Chính Tài';
  if(CONTROLS[other.element]===day.element) return same?'Thất Sát':'Chính Quan';
  return same?'Thiên Ấn':'Chính Ấn';
}
function branch(i:number,day:Stem):Branch {
  const x=BRANCHES[mod(i,12)]!;
  return {index:mod(i,12),code:x.code,name:x.name,elementCode:x.elementCode,element:x.element,polarityCode:x.polarityCode,polarity:x.polarity,hiddenStems:x.hidden.map(([si,weight])=>{const god=tenGod(day,stem(si));return {...stem(si),weight,tenGodCode:TEN_GOD_CODES[god],tenGod:god};})};
}
function pillar(label:Pillar['label'],si:number,bi:number,day:Stem):Pillar { const s=stem(si),god=label==='Ngày'?'Nhật Chủ':tenGod(day,s);const labelCode={Năm:'YEAR',Tháng:'MONTH',Ngày:'DAY',Giờ:'HOUR'} as const;return {labelCode:labelCode[label],label,stem:s,branch:branch(bi,day),tenGodCode:god==='Nhật Chủ'?'DAY_MASTER':TEN_GOD_CODES[god],tenGod:god}; }
const RELATION_CODES:Record<Relation['type'],RelationTypeCode>={'Lục hợp':'LIU_HE','Lục xung':'LIU_CHONG','Lục hại':'LIU_HAI','Lục phá':'LIU_PO','Tự hình':'ZI_XING','Tam hình':'SAN_XING','Tam hợp':'SAN_HE','Tam hội':'SAN_HUI'};
const makeRelation=(type:Relation['type'],branches:BranchName[],resultElement?:Element):Relation=>({typeCode:RELATION_CODES[type],type,branchCodes:branches.map(x=>BRANCH_CODES[x]),branches,...(resultElement?{resultElementCode:ELEMENT_CODES[resultElement],resultElement}:{})});
function relations(names:BranchName[]):Relation[] {
  const out:Relation[]=[]; const has=(...x:BranchName[])=>x.every(n=>names.includes(n));
  const pairs:[Relation['type'],BranchName,BranchName][]=[
    ['Lục hợp','Tý','Sửu'],['Lục hợp','Dần','Hợi'],['Lục hợp','Mão','Tuất'],['Lục hợp','Thìn','Dậu'],['Lục hợp','Tỵ','Thân'],['Lục hợp','Ngọ','Mùi'],
    ['Lục xung','Tý','Ngọ'],['Lục xung','Sửu','Mùi'],['Lục xung','Dần','Thân'],['Lục xung','Mão','Dậu'],['Lục xung','Thìn','Tuất'],['Lục xung','Tỵ','Hợi'],
    ['Lục hại','Tý','Mùi'],['Lục hại','Sửu','Ngọ'],['Lục hại','Dần','Tỵ'],['Lục hại','Mão','Thìn'],['Lục hại','Thân','Hợi'],['Lục hại','Dậu','Tuất'],
    ['Lục phá','Tý','Dậu'],['Lục phá','Sửu','Thìn'],['Lục phá','Dần','Hợi'],['Lục phá','Mão','Ngọ'],['Lục phá','Tỵ','Thân'],['Lục phá','Mùi','Tuất']];
  for(const [type,a,b] of pairs) if(has(a,b)) out.push(makeRelation(type,[a,b]));
  for(const n of ['Thìn','Ngọ','Dậu','Hợi'] as BranchName[]) if(names.filter(x=>x===n).length>1) out.push(makeRelation('Tự hình',[n,n]));
  const punishments:BranchName[][]=[['Dần','Tỵ','Thân'],['Sửu','Mùi','Tuất'],['Tý','Mão']];
  for(const bs of punishments) if(has(...bs))out.push(makeRelation('Tam hình',bs));
  const triples:[Relation['type'],BranchName[],Element][]=[['Tam hợp',['Thân','Tý','Thìn'],'Thủy'],['Tam hợp',['Hợi','Mão','Mùi'],'Mộc'],['Tam hợp',['Dần','Ngọ','Tuất'],'Hỏa'],['Tam hợp',['Tỵ','Dậu','Sửu'],'Kim'],['Tam hội',['Hợi','Tý','Sửu'],'Thủy'],['Tam hội',['Dần','Mão','Thìn'],'Mộc'],['Tam hội',['Tỵ','Ngọ','Mùi'],'Hỏa'],['Tam hội',['Thân','Dậu','Tuất'],'Kim']];
  for(const [type,bs,e] of triples) if(has(...bs)) out.push(makeRelation(type,bs,e)); return out;
}
function elementScores(ps:Pillar[]):ElementScore[] {
  const score=Object.fromEntries(ELEMENTS.map(e=>[e,0])) as Record<Element,number>;
  for(const p of ps){ score[p.stem.element]+=1; score[p.branch.element]+=.7; for(const h of p.branch.hiddenStems)score[h.element]+=.8*h.weight; }
  // Month branch carries seasonal qi.
  score[ps[1]!.branch.element]+=1.5; const total=Object.values(score).reduce((a,b)=>a+b,0);
  return ELEMENTS.map(element=>{const percent=Math.round(score[element]/total*1000)/10;return {elementCode:ELEMENT_CODES[element],element,raw:Math.round(score[element]*100)/100,percent,strength:percent<5?'khuyết':percent<15?'yếu':percent>=28?'vượng':'trung bình'};});
}
function annualPillar(year:number,day:Stem):Pillar { const idx=mod(year-1984,60);return pillar('Năm',idx%10,idx%12,day); }
function luckPillars(month:Pillar,birthYear:number,startAge:number,direction:1|-1,day:Stem):LuckPillar[]{ const base=month.stem.index;const bb=month.branch.index;return Array.from({length:8},(_,k)=>{const order=k+1,s=stem(base+direction*order),god=tenGod(day,s);return {order,startAge:Math.round((startAge+k*10)*10)/10,startYear:birthYear+Math.ceil(startAge)+k*10,stem:s,branch:branch(bb+direction*order,day),tenGodCode:TEN_GOD_CODES[god],tenGod:god};}); }
function activeLuck(luckList:LuckPillar[],year:number):ActiveLuck {const current=luckList.find(p=>year>=p.startYear&&year<p.startYear+10)??null;return {asOfYear:year,order:current?.order??null,pillar:current};}
function analyzeAnnual(day:Stem,natal:Pillar[],luckList:LuckPillar[],year:number):AnnualAnalysis {const annual=annualPillar(year,day),god=annual.tenGod as TenGod,active=activeLuck(luckList,year);return {year,pillar:annual,stemTenGodCode:TEN_GOD_CODES[god],stemTenGod:god,interactions:natal.map(p=>({withPillarCode:p.labelCode,withPillar:p.label,relations:relations([annual.branch.name,p.branch.name])})),activeLuckInteraction:active.pillar?{order:active.pillar.order,relations:relations([annual.branch.name,active.pillar.branch.name])}:null};}

export function calculateAnnualTimeline(chart:BaziResult,fromYear:number,toYear:number):AnnualTimelineEntry[] {if(!Number.isInteger(fromYear)||!Number.isInteger(toYear)||fromYear<1600||toYear>2400||fromYear>toYear)throw new RangeError('Khoảng Lưu Niên phải là năm nguyên, tăng dần, trong 1600..2400');if(toYear-fromYear>200)throw new RangeError('Một timeline hỗ trợ tối đa 201 năm');const natal=Object.values(chart.pillars);return Array.from({length:toYear-fromYear+1},(_,i)=>{const year=fromYear+i;return {year,activeLuck:activeLuck(chart.luck.pillars,year),analysis:analyzeAnnual(chart.dayMaster,natal,chart.luck.pillars,year)};});}

type LegacyBirthInput=Omit<BirthInput,'asOfYear'>;
export interface CalendarOperations {
  baziYear(utc:Date):number; findNextJie(utc:Date,direction:1|-1):Date;
  sexagenaryDayIndex(localSolar:Date,dayBoundary:DayBoundaryConvention):number; solarMonthIndex(utc:Date):number;
  solarCorrectionMinutes(utc:Date,longitude:number,offsetMinutes:number):number;
}
const JS_CALENDAR:CalendarOperations={baziYear,findNextJie,sexagenaryDayIndex,solarMonthIndex,solarCorrectionMinutes};
export function calculateBazi(input:BirthInput):BaziResult;
/** @deprecated Put asOfYear inside input so serialized input is self-contained. */
export function calculateBazi(input:LegacyBirthInput,asOfYear:number):BaziResult;
export function calculateBazi(input:BirthInput|LegacyBirthInput,legacyAsOfYear?:number):BaziResult {
  return calculateCore(input,legacyAsOfYear,JS_CALENDAR);
}
export function calculateBaziWithCalendar(input:BirthInput,calendar:CalendarOperations):BaziResult {
  return calculateCore(input,undefined,calendar);
}
function calculateCore(input:BirthInput|LegacyBirthInput,legacyAsOfYear:number|undefined,calendar:CalendarOperations):BaziResult {
  const asOfYear='asOfYear' in input?input.asOfYear:legacyAsOfYear;
  if(!Number.isInteger(asOfYear)||asOfYear!<1600||asOfYear!>2400)throw new RangeError('asOfYear phải là số nguyên trong 1600..2400');
  const dayBoundary=input.dayBoundary??'early-zi',normalizedInput:BirthInput={...input,asOfYear:asOfYear!,dayBoundary};
  if(!Number.isInteger(input.timezoneOffsetMinutes)||Math.abs(input.timezoneOffsetMinutes)>14*60)throw new RangeError('timezoneOffsetMinutes không hợp lệ');
  const civil=parseLocalIso(input.localDateTime),utc=toUtc(civil,input.timezoneOffsetMinutes);
  const resolvedLocation=input.trueSolarTime?resolveLocation(input.location):undefined;
  const correction=resolvedLocation?calendar.solarCorrectionMinutes(utc,resolvedLocation.longitude,input.timezoneOffsetMinutes):0;
  const solar=new Date(civil.getTime()+correction*60000),year=calendar.baziYear(utc),yi=mod(year-1984,60),mi=calendar.solarMonthIndex(utc),di=calendar.sexagenaryDayIndex(solar,dayBoundary);
  const day=stem(di%10); const hourBranch=mod(Math.floor((solar.getUTCHours()+1)/2),12); const hourStem=mod(day.index*2+hourBranch,10);
  const yearP=pillar('Năm',yi%10,yi%12,day),monthBranch=mod(mi+2,12),monthStem=mod((yi%10)*2+2+mi,10);
  const monthP=pillar('Tháng',monthStem,monthBranch,day),dayP=pillar('Ngày',di%10,di%12,day),hourP=pillar('Giờ',hourStem,hourBranch,day),ps=[yearP,monthP,dayP,hourP];
  const isYangYear=yearP.stem.polarity==='Dương',forward=(input.gender==='male')===isYangYear,direction=forward?1:-1;
  const previousJie=calendar.findNextJie(utc,-1),nextJie=calendar.findNextJie(utc,1),boundary=direction===1?nextJie:previousJie;
  const nearestDistanceMinutes=Math.round(Math.min(utc.getTime()-previousJie.getTime(),nextJie.getTime()-utc.getTime())/60000),nearBoundary=nearestDistanceMinutes<=120;
  const startAge=Math.round(Math.abs(boundary.getTime()-utc.getTime())/86400000/3*10)/10;
  const elements=elementScores(ps), strongest=[...elements].sort((a,b)=>b.percent-a.percent)[0]!; const dm=elements.find(e=>e.element===day.element)!;
  const facts:MetadataFact[]=[{code:'DAY_MASTER',vi:`Nhật Chủ là ${day.name} ${day.element}.`,confidence:'high',evidence:['pillars.day.stem']},{code:'SEASON',vi:`Sinh trong tháng ${monthP.branch.name}, khí mùa thiên về ${monthP.branch.element}.`,confidence:'high',evidence:['pillars.month.branch']},{code:'ELEMENT_BALANCE',vi:`${strongest.element} nổi trội nhất (${strongest.percent}%), ${day.element} của Nhật Chủ ở mức ${dm.strength}.`,confidence:'medium',evidence:['elements']},...(nearBoundary?[{code:'NEAR_SOLAR_TERM',vi:`Thời điểm sinh cách ranh tiết gần nhất khoảng ${nearestDistanceMinutes} phút; cần đặc biệt kiểm tra dữ liệu đầu vào.`,confidence:'high' as const,evidence:['normalized.solarTerms']}]:[])];
  const luckList=luckPillars(monthP,year,startAge,direction,day),active=activeLuck(luckList,asOfYear!),annualAnalysis=analyzeAnnual(day,ps,luckList,asOfYear!),annual=annualAnalysis.pillar;
  return {schemaVersion:'1.7',input:normalizedInput,normalized:{civilTime:civil.toISOString().replace('Z',''),solarTime:solar.toISOString().replace('Z',''),utcTime:utc.toISOString(),correctionMinutes:Math.round(correction*100)/100,dayBoundary,...(resolvedLocation?{location:resolvedLocation}:{}),solarTerms:{previousJie:previousJie.toISOString(),nextJie:nextJie.toISOString(),nearestDistanceMinutes,nearBoundary}},pillars:{year:yearP,month:monthP,day:dayP,hour:hourP},dayMaster:day,elements,relations:relations(ps.map(p=>p.branch.name)),tenGods:Object.fromEntries(ps.map(p=>[p.label,p.tenGod])),luck:{direction:forward?'thuận':'nghịch',startAge,pillars:luckList,active},annual,annualAnalysis,shenSha:calculateShenSha(ps,day),pattern:analyzePattern(day,monthP,elements),metadata:{locale:'vi',methodology:getMethodologyManifest(dayBoundary,Boolean(input.trueSolarTime)),facts,supportedShenSha:[...SHEN_SHA_CATALOG],warnings:['Kết quả phục vụ nghiên cứu văn hóa/tham khảo, không phải cơ sở cho quyết định y tế, pháp lý hoặc tài chính.',`Quy ước đổi trụ Ngày: ${dayBoundary==='early-zi'?'đầu giờ Tý (23:00)':'nửa đêm (00:00)'}.`,'Khởi vận dùng quy ước 3 ngày = 1 năm; các trường phái có thể dùng quy ước khác.','Dụng/hỷ/kỵ hành hiện là heuristic cân bằng, chưa thay thế thẩm định cách cục chuyên sâu.',...(nearBoundary?['Sinh sát ranh tiết khí; sai số phút trong giờ sinh hoặc múi giờ có thể đổi trụ Tháng/Năm.']:[])]}};
}
