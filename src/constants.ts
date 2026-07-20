import type { BranchCode, BranchName, Element, ElementCode, Polarity, PolarityCode, StemCode, StemName, TenGod, TenGodCode } from './types.js';

export const STEMS: readonly {code:StemCode;name:StemName;elementCode:ElementCode;element:Element;polarityCode:PolarityCode;polarity:Polarity}[] = [
  {code:'JIA',name:'Giáp',elementCode:'WOOD',element:'Mộc',polarityCode:'YANG',polarity:'Dương'},{code:'YI',name:'Ất',elementCode:'WOOD',element:'Mộc',polarityCode:'YIN',polarity:'Âm'},
  {code:'BING',name:'Bính',elementCode:'FIRE',element:'Hỏa',polarityCode:'YANG',polarity:'Dương'},{code:'DING',name:'Đinh',elementCode:'FIRE',element:'Hỏa',polarityCode:'YIN',polarity:'Âm'},
  {code:'WU',name:'Mậu',elementCode:'EARTH',element:'Thổ',polarityCode:'YANG',polarity:'Dương'},{code:'JI',name:'Kỷ',elementCode:'EARTH',element:'Thổ',polarityCode:'YIN',polarity:'Âm'},
  {code:'GENG',name:'Canh',elementCode:'METAL',element:'Kim',polarityCode:'YANG',polarity:'Dương'},{code:'XIN',name:'Tân',elementCode:'METAL',element:'Kim',polarityCode:'YIN',polarity:'Âm'},
  {code:'REN',name:'Nhâm',elementCode:'WATER',element:'Thủy',polarityCode:'YANG',polarity:'Dương'},{code:'GUI',name:'Quý',elementCode:'WATER',element:'Thủy',polarityCode:'YIN',polarity:'Âm'}
];
const E:Record<Element,ElementCode>={Mộc:'WOOD',Hỏa:'FIRE',Thổ:'EARTH',Kim:'METAL',Thủy:'WATER'};
const P:Record<Polarity,PolarityCode>={Dương:'YANG',Âm:'YIN'};
const branchData:readonly [BranchCode,BranchName,Element,Polarity,[number,number][]][]=[
  ['ZI','Tý','Thủy','Dương',[[9,1]]],['CHOU','Sửu','Thổ','Âm',[[5,.6],[9,.3],[7,.1]]],['YIN','Dần','Mộc','Dương',[[0,.6],[2,.3],[4,.1]]],['MAO','Mão','Mộc','Âm',[[1,1]]],
  ['CHEN','Thìn','Thổ','Dương',[[4,.6],[1,.3],[9,.1]]],['SI','Tỵ','Hỏa','Âm',[[2,.6],[4,.3],[6,.1]]],['WU','Ngọ','Hỏa','Dương',[[3,.7],[5,.3]]],['WEI','Mùi','Thổ','Âm',[[5,.6],[3,.3],[1,.1]]],
  ['SHEN','Thân','Kim','Dương',[[6,.6],[8,.3],[4,.1]]],['YOU','Dậu','Kim','Âm',[[7,1]]],['XU','Tuất','Thổ','Dương',[[4,.6],[7,.3],[3,.1]]],['HAI','Hợi','Thủy','Âm',[[8,.7],[0,.3]]]
];
export const BRANCHES=branchData.map(([code,name,element,polarity,hidden])=>({code,name,elementCode:E[element],element,polarityCode:P[polarity],polarity,hidden}));
export const BRANCH_CODES=Object.fromEntries(BRANCHES.map(x=>[x.name,x.code])) as Record<BranchName,BranchCode>;
export const ELEMENTS: readonly Element[] = ['Mộc','Hỏa','Thổ','Kim','Thủy'];
export const ELEMENT_CODES:Record<Element,ElementCode>=E;
export const TEN_GOD_CODES:Record<TenGod,TenGodCode>={'Tỷ Kiên':'BI_JIAN','Kiếp Tài':'JIE_CAI','Thực Thần':'SHI_SHEN','Thương Quan':'SHANG_GUAN','Thiên Tài':'PIAN_CAI','Chính Tài':'ZHENG_CAI','Thất Sát':'QI_SHA','Chính Quan':'ZHENG_GUAN','Thiên Ấn':'PIAN_YIN','Chính Ấn':'ZHENG_YIN'};
export const GENERATES: Record<Element,Element> = {Mộc:'Hỏa',Hỏa:'Thổ',Thổ:'Kim',Kim:'Thủy',Thủy:'Mộc'};
export const CONTROLS: Record<Element,Element> = {Mộc:'Thổ',Thổ:'Thủy',Thủy:'Hỏa',Hỏa:'Kim',Kim:'Mộc'};
