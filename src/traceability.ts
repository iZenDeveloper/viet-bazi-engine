import type { BaziAuditReport, BaziResult, CalculationRuleTrace, LocalizedAuditReport } from './types.js';

const rule=(ruleCode:string,ruleVersion:string,category:CalculationRuleTrace['category'],descriptionVi:string,inputPaths:string[],outputPaths:string[]):CalculationRuleTrace=>({ruleCode,ruleVersion,category,descriptionVi,inputPaths,outputPaths});

/** Build a deterministic, machine-readable map from calculation rules to result fields. */
export function createBaziAuditReport(chart:BaziResult):BaziAuditReport {
  const rules:CalculationRuleTrace[]=[
    rule('CALENDAR_YEAR_LI_CHUN','1.0','calendar','Trụ Năm đổi tại Lập Xuân.',['input.localDateTime','input.timezoneOffsetMinutes'],['pillars.year','normalized.solarTerms']),
    rule('CALENDAR_MONTH_TWELVE_JIE','1.0','calendar','Trụ Tháng đổi tại 12 Tiết khí (Jie).',['input.localDateTime','input.timezoneOffsetMinutes'],['pillars.month','normalized.solarTerms']),
    rule(`CALENDAR_DAY_${chart.normalized.dayBoundary==='early-zi'?'EARLY_ZI':'MIDNIGHT'}`,'1.0','calendar',chart.normalized.dayBoundary==='early-zi'?'Ngày Can Chi đổi lúc 23:00 giờ địa phương đã hiệu chỉnh.':'Ngày Can Chi đổi lúc 00:00 giờ địa phương đã hiệu chỉnh.',['input.localDateTime','input.dayBoundary'],['pillars.day','normalized.dayBoundary']),
    rule('CALENDAR_HOUR_ZI_CENTERED','1.0','calendar','Mỗi giờ Chi dài hai giờ và giờ Tý được đặt tâm tại nửa đêm.',['input.localDateTime'],['pillars.hour']),
    rule('TEN_GODS_DAY_MASTER','1.0','analysis','Thập Thần được suy từ sinh khắc Ngũ Hành và âm dương so với Nhật Chủ.',['pillars.day.stem'],['tenGods','pillars','annualAnalysis.stemTenGodCode']),
    rule('ELEMENT_WEIGHTED_BALANCE','1.0','analysis','Điểm Ngũ Hành cộng Can, Chi, Tàng Can và khí mùa theo trọng số cố định.',['pillars'],['elements']),
    rule('BRANCH_RELATION_CATALOG','1.0','analysis','Quan hệ Chi được đối chiếu bằng catalog hợp, xung, hình, hại và phá.',['pillars.*.branch'],['relations','annualAnalysis.interactions']),
    rule('LUCK_GENDER_YEAR_POLARITY','1.0','luck','Chiều Đại Vận dựa trên giới tính và âm dương Can Năm; ba ngày quy đổi một tuổi.',['input.gender','pillars.year.stem','normalized.solarTerms'],['luck']),
    rule('SHEN_SHA_CATALOG','1.0','analysis','Thần Sát được tra bằng catalog quy tắc phiên bản 1.',['pillars'],['shenSha']),
    rule('PATTERN_MONTH_QI_HEURISTIC','1.0','analysis','Cách cục cơ bản dùng heuristic khí Tháng và độ mạnh Nhật Chủ.',['pillars.month','dayMaster','elements'],['pattern'])
  ];
  if(chart.metadata.methodology.trueSolarTime.enabled)rules.splice(2,0,rule('TRUE_SOLAR_TIME_LONGITUDE_EOT','1.0','normalization','Giờ dân sự được hiệu chỉnh theo kinh độ và phương trình thời gian.',['input.localDateTime','input.timezoneOffsetMinutes','input.location'],['normalized.solarTime','normalized.correctionMinutes','normalized.location']));
  const warnings=[...chart.metadata.warnings,...(chart.normalized.solarTerms.nearBoundary?['Thời điểm sinh gần ranh Tiết khí; hãy kiểm tra độ chính xác của giờ sinh và múi giờ.']:[])];
  return {schemaVersion:'1.0',engineVersion:chart.metadata.methodology.engineVersion,chartSchemaVersion:chart.schemaVersion,methodologyProfile:chart.metadata.methodology.profileCode,rules,warnings:[...new Set(warnings)]};
}

const descriptionsEn:Record<string,string>={
  CALENDAR_YEAR_LI_CHUN:'The Year Pillar changes at the Start of Spring solar term.',
  CALENDAR_MONTH_TWELVE_JIE:'The Month Pillar changes at the twelve Jie solar terms.',
  CALENDAR_DAY_EARLY_ZI:'The sexagenary day changes at 23:00 corrected local time.',
  CALENDAR_DAY_MIDNIGHT:'The sexagenary day changes at 00:00 corrected local time.',
  CALENDAR_HOUR_ZI_CENTERED:'Each Earthly Branch hour spans two hours, with the Zi hour centered on midnight.',
  TRUE_SOLAR_TIME_LONGITUDE_EOT:'Civil time is corrected using longitude and the equation of time.',
  TEN_GODS_DAY_MASTER:'Ten Gods are derived from Five Element generation/control and polarity relative to the Day Master.',
  ELEMENT_WEIGHTED_BALANCE:'Five Element scores combine stems, branches, hidden stems, and seasonal qi with fixed weights.',
  BRANCH_RELATION_CATALOG:'Branch relations are matched against the combination, clash, punishment, harm, and destruction catalog.',
  LUCK_GENDER_YEAR_POLARITY:'Luck-cycle direction uses gender and Year Stem polarity; three days convert to one year of age.',
  SHEN_SHA_CATALOG:'Symbolic stars are matched using the version 1 rule catalog.',
  PATTERN_MONTH_QI_HEURISTIC:'The basic pattern uses a Month qi and Day Master strength heuristic.'
};
const warningEn=(warning:string):string=>warning.includes('gần ranh Tiết khí')?'Birth time is near a solar-term boundary; verify birth time and timezone accuracy.':warning.includes('tham khảo văn hóa')?'This result is for cultural reference and should not be the sole basis for medical, legal, or financial decisions.':warning.includes('đổi ngày')?'Review the selected sexagenary day-boundary convention.':warning.includes('ba ngày')?'Luck-cycle starting age uses the three-days-per-year conversion.':warning.includes('heuristic')?'Favorable-element and pattern results use a documented heuristic.':'Review this calculation warning before interpretation.';

/** Localize human-readable audit text while preserving stable rule identity and paths. */
export function localizeBaziAuditReport(report:BaziAuditReport,locale:'vi'|'en'='vi'):LocalizedAuditReport {
  return {schemaVersion:'1.0',locale,engineVersion:report.engineVersion,chartSchemaVersion:report.chartSchemaVersion,methodologyProfile:report.methodologyProfile,rules:report.rules.map(({descriptionVi,...stable})=>({...stable,text:locale==='vi'?descriptionVi:descriptionsEn[stable.ruleCode]??`Calculation rule ${stable.ruleCode}.`})),warnings:locale==='vi'?[...report.warnings]:[...new Set(report.warnings.map(warningEn))]};
}
