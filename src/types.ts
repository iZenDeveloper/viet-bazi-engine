export type StemName = 'Giáp'|'Ất'|'Bính'|'Đinh'|'Mậu'|'Kỷ'|'Canh'|'Tân'|'Nhâm'|'Quý';
export type BranchName = 'Tý'|'Sửu'|'Dần'|'Mão'|'Thìn'|'Tỵ'|'Ngọ'|'Mùi'|'Thân'|'Dậu'|'Tuất'|'Hợi';
export type Element = 'Mộc'|'Hỏa'|'Thổ'|'Kim'|'Thủy';
export type Polarity = 'Dương'|'Âm';
export type TenGod = 'Tỷ Kiên'|'Kiếp Tài'|'Thực Thần'|'Thương Quan'|'Thiên Tài'|'Chính Tài'|'Thất Sát'|'Chính Quan'|'Thiên Ấn'|'Chính Ấn';
export type StemCode = 'JIA'|'YI'|'BING'|'DING'|'WU'|'JI'|'GENG'|'XIN'|'REN'|'GUI';
export type BranchCode = 'ZI'|'CHOU'|'YIN'|'MAO'|'CHEN'|'SI'|'WU'|'WEI'|'SHEN'|'YOU'|'XU'|'HAI';
export type ElementCode = 'WOOD'|'FIRE'|'EARTH'|'METAL'|'WATER';
export type PolarityCode = 'YANG'|'YIN';
export type TenGodCode = 'BI_JIAN'|'JIE_CAI'|'SHI_SHEN'|'SHANG_GUAN'|'PIAN_CAI'|'ZHENG_CAI'|'QI_SHA'|'ZHENG_GUAN'|'PIAN_YIN'|'ZHENG_YIN';
export type RelationTypeCode = 'LIU_HE'|'LIU_CHONG'|'LIU_HAI'|'LIU_PO'|'ZI_XING'|'SAN_XING'|'SAN_HE'|'SAN_HUI';
export type ShenShaCode = 'TIAN_YI_GUI_REN'|'TAI_JI_GUI_REN'|'WEN_CHANG'|'LU_SHEN'|'YANG_REN'|'JIN_YU'|'GUO_YIN'|'XUE_TANG'|'TAO_HUA'|'HONG_LUAN'|'TIAN_XI'|'YI_MA'|'HUA_GAI'|'JIANG_XING'|'JIE_SHA'|'WANG_SHEN'|'ZAI_SHA'|'GU_SHEN'|'GUA_SU'|'TIAN_YI'|'TIAN_LUO'|'DI_WANG'|'TIAN_SHE';
export type DayBoundaryConvention = 'early-zi'|'midnight';

export interface BirthInput {
  /** Local civil time in ISO format without a trailing Z, e.g. 1990-05-17T14:30:00. */
  localDateTime: string;
  /** IANA is intentionally avoided offline; pass the numeric UTC offset at birth. */
  timezoneOffsetMinutes: number;
  /** Explicit context for Lưu Niên; required so the entire result is reproducible. */
  asOfYear: number;
  gender: 'male'|'female';
  /** Use a catalog city alone, or provide coordinates for an exact/custom place. */
  location?: { city?: string; latitude?: number; longitude?: number };
  trueSolarTime?: boolean;
  /** Defaults to early-zi: the sexagenary day changes at 23:00. */
  dayBoundary?: DayBoundaryConvention;
}
export interface Stem { index:number; code:StemCode; name:StemName; elementCode:ElementCode; element:Element; polarityCode:PolarityCode; polarity:Polarity }
export interface Branch { index:number; code:BranchCode; name:BranchName; elementCode:ElementCode; element:Element; polarityCode:PolarityCode; polarity:Polarity; hiddenStems: HiddenStem[] }
export interface HiddenStem extends Stem { weight:number; tenGodCode:TenGodCode; tenGod:TenGod }
export interface Pillar { labelCode:'YEAR'|'MONTH'|'DAY'|'HOUR'; label:'Năm'|'Tháng'|'Ngày'|'Giờ'; stem:Stem; branch:Branch; tenGodCode:TenGodCode|'DAY_MASTER'; tenGod:TenGod|'Nhật Chủ' }
export interface ElementScore { elementCode:ElementCode; element:Element; raw:number; percent:number; strength:'khuyết'|'yếu'|'trung bình'|'vượng' }
export interface Relation { typeCode:RelationTypeCode; type:'Lục hợp'|'Lục xung'|'Lục hại'|'Lục phá'|'Tự hình'|'Tam hình'|'Tam hợp'|'Tam hội'; branchCodes:BranchCode[]; branches:BranchName[]; resultElementCode?:ElementCode; resultElement?:Element }
export interface LuckPillar { order:number; startAge:number; startYear:number; stem:Stem; branch:Branch; tenGodCode:TenGodCode; tenGod:TenGod }
export interface AnnualInteraction { withPillarCode:Pillar['labelCode']; withPillar:Pillar['label']; relations:Relation[] }
export interface ActiveLuck { asOfYear:number; order:number|null; pillar:LuckPillar|null }
export interface AnnualAnalysis { year:number; pillar:Pillar; stemTenGodCode:TenGodCode; stemTenGod:TenGod; interactions:AnnualInteraction[]; activeLuckInteraction:{order:number;relations:Relation[]}|null }
export interface AnnualTimelineEntry { year:number; activeLuck:ActiveLuck; analysis:AnnualAnalysis }
export interface ShenSha { code:ShenShaCode; name:string; at:string[]; basis:string }
export interface MetadataFact { code:string; vi:string; confidence:'high'|'medium'; evidence:string[] }
export interface LocalizedFact extends Omit<MetadataFact,'vi'> { text:string }
export interface LocalizedFactsReport { schemaVersion:'1.0'; locale:'vi'|'en'; facts:LocalizedFact[]; warnings:string[] }
export interface MethodologyManifest {
  engineVersion:string; profileCode:'VIET_BAZI_STANDARD_V1';
  calendar:{ yearBoundary:'LI_CHUN'; monthBoundary:'TWELVE_JIE'; dayBoundary:'EARLY_ZI'|'MIDNIGHT'; hourBoundary:'ZI_CENTERED_TWO_HOUR'; solarTermModel:'APPROXIMATE_SOLAR_LONGITUDE' };
  trueSolarTime:{ enabled:boolean; model:'LONGITUDE_PLUS_EQUATION_OF_TIME'|'DISABLED' };
  luckCycle:{ directionRule:'GENDER_AND_YEAR_STEM_POLARITY'; startBoundary:'DIRECTIONAL_JIE'; ageConversion:'THREE_DAYS_PER_YEAR' };
  analysis:{ elementBalance:'WEIGHTED_HEURISTIC_V1'; pattern:'MONTH_QI_HEURISTIC_V1'; shenSha:'CATALOG_V1' };
}
export interface PatternAnalysis {
  primary:string; dayMasterStrength:'thân nhược'|'trung hòa'|'thân vượng';
  favorableElements:Element[]; unfavorableElements:Element[]; summary:string; evidence:string[];
}
export interface BaziResult {
  schemaVersion:'1.7'; input:BirthInput; normalized:{ civilTime:string; solarTime:string; utcTime:string; correctionMinutes:number; dayBoundary:DayBoundaryConvention; location?:{city?:string;latitude:number;longitude:number}; solarTerms:{previousJie:string;nextJie:string;nearestDistanceMinutes:number;nearBoundary:boolean} };
  pillars:{ year:Pillar; month:Pillar; day:Pillar; hour:Pillar };
  dayMaster:Stem; elements:ElementScore[]; relations:Relation[]; tenGods:Record<string,TenGod|'Nhật Chủ'>;
  luck:{ direction:'thuận'|'nghịch'; startAge:number; pillars:LuckPillar[]; active:ActiveLuck };
  annual:Pillar; annualAnalysis:AnnualAnalysis; shenSha:ShenSha[]; pattern:PatternAnalysis;
  metadata:{ locale:'vi'; methodology:MethodologyManifest; facts:MetadataFact[]; supportedShenSha:string[]; warnings:string[] };
}
export interface CompatibilityFactor { code:string; score:number; maxScore:number; vi:string; evidence:string[] }
export interface CompatibilityResult {
  schemaVersion:'1.0'; score:number; grade:'thấp'|'trung bình'|'khá'|'cao'; factors:CompatibilityFactor[];
  sharedElements:Element[]; complementaryElements:Element[];
  metadata:{ methodology:'heuristic-v1'; warning:string };
}
export interface SvgOptions { width?:number; title?:string; showHiddenStems?:boolean; showElementBalance?:boolean; highContrast?:boolean; locale?:'vi'|'en' }
export interface CalculationRuleTrace { ruleCode:string; ruleVersion:string; category:'calendar'|'normalization'|'analysis'|'luck'; descriptionVi:string; inputPaths:string[]; outputPaths:string[] }
export interface BaziAuditReport { schemaVersion:'1.0'; engineVersion:string; chartSchemaVersion:BaziResult['schemaVersion']; methodologyProfile:MethodologyManifest['profileCode']; rules:CalculationRuleTrace[]; warnings:string[] }
export interface CityLocation { id:string; name:string; aliases:readonly string[]; latitude:number; longitude:number; timezoneOffsetMinutes:number }
export interface BatchSuccess { index:number; ok:true; result:BaziResult }
export interface BatchFailure { index:number; ok:false; error:{name:string;message:string} }
export interface BaziBatchResult { schemaVersion:'1.0'; summary:{total:number;succeeded:number;failed:number}; items:(BatchSuccess|BatchFailure)[] }
export interface PillarSnapshot { year:string;month:string;day:string;hour:string }
export interface BirthTimeVariant { firstOffsetMinutes:number;lastOffsetMinutes:number;localDateTime:string;pillars:PillarSnapshot;changedPillars:Pillar['labelCode'][] }
export interface BirthTimeSensitivity { schemaVersion:'1.0';windowMinutes:number;stepMinutes:number;sampleCount:number;stable:boolean;baseline:{localDateTime:string;pillars:PillarSnapshot};variants:BirthTimeVariant[] }
export type EngineFeatureCode='FOUR_PILLARS'|'TRUE_SOLAR_TIME'|'TEN_GODS'|'HIDDEN_STEMS'|'ELEMENT_BALANCE'|'BRANCH_RELATIONS'|'LUCK_CYCLES'|'ANNUAL_ANALYSIS'|'SHEN_SHA'|'PATTERN_ANALYSIS'|'COMPATIBILITY'|'SVG_EXPORT'|'AUDIT_TRACE'|'BATCH'|'BIRTH_TIME_SENSITIVITY'|'WASM_CALENDAR';
export interface EngineCapabilities { schemaVersion:'1.0';engineVersion:string;offline:true;runtimeDependencyCount:0;methodologyProfiles:string[];features:EngineFeatureCode[];bindings:('TYPESCRIPT'|'JSON_CLI'|'PYTHON'|'WASM')[];limits:{batchRecords:number;stdinBytes:number;sensitivityWindowMinutes:number;sensitivitySamples:number;annualTimelineYears:number};schemas:{birthInput:string;baziResult:string;baziAuditReport:string;localizedFactsReport:string;batchInput:string;batchResult:string;birthTimeSensitivity:string;compatibilityInput:string;compatibilityResult:string};conformanceVersion:string }
