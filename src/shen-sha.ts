import type { BranchName, Pillar, ShenSha, ShenShaCode, Stem, StemName } from './types.js';

export const SHEN_SHA_CATALOG = [
  'Thiên Ất Quý Nhân','Thái Cực Quý Nhân','Văn Xương','Lộc Thần','Dương Nhận',
  'Kim Dư','Quốc Ấn','Học Đường','Đào Hoa','Hồng Loan','Thiên Hỷ','Dịch Mã',
  'Hoa Cái','Tướng Tinh','Kiếp Sát','Vong Thần','Tai Sát','Cô Thần','Quả Tú',
  'Thiên Y','Thiên La','Địa Võng','Thiên Xá'
] as const;
export const SHEN_SHA_CODES:Record<(typeof SHEN_SHA_CATALOG)[number],ShenShaCode>={
  'Thiên Ất Quý Nhân':'TIAN_YI_GUI_REN','Thái Cực Quý Nhân':'TAI_JI_GUI_REN','Văn Xương':'WEN_CHANG','Lộc Thần':'LU_SHEN','Dương Nhận':'YANG_REN','Kim Dư':'JIN_YU','Quốc Ấn':'GUO_YIN','Học Đường':'XUE_TANG','Đào Hoa':'TAO_HUA','Hồng Loan':'HONG_LUAN','Thiên Hỷ':'TIAN_XI','Dịch Mã':'YI_MA','Hoa Cái':'HUA_GAI','Tướng Tinh':'JIANG_XING','Kiếp Sát':'JIE_SHA','Vong Thần':'WANG_SHEN','Tai Sát':'ZAI_SHA','Cô Thần':'GU_SHEN','Quả Tú':'GUA_SU','Thiên Y':'TIAN_YI','Thiên La':'TIAN_LUO','Địa Võng':'DI_WANG','Thiên Xá':'TIAN_SHE'
};

const TRINES:BranchName[][]=[['Thân','Tý','Thìn'],['Dần','Ngọ','Tuất'],['Hợi','Mão','Mùi'],['Tỵ','Dậu','Sửu']];
const PEACH:BranchName[]=['Dậu','Mão','Tý','Ngọ'];
const HORSE:BranchName[]=['Dần','Thân','Tỵ','Hợi'];
const FLOWER:BranchName[]=['Thìn','Tuất','Mùi','Sửu'];
const GENERAL:BranchName[]=['Tý','Ngọ','Mão','Dậu'];
const ROBBERY:BranchName[]=['Tỵ','Hợi','Thân','Dần'];
const LOSS:BranchName[]=['Hợi','Tỵ','Dần','Thân'];
const DISASTER:BranchName[]=['Ngọ','Tý','Dậu','Mão'];

export function calculateShenSha(ps:Pillar[],day:Stem):ShenSha[] {
  const out:Omit<ShenSha,'code'>[]=[];
  const hitBranch=(name:(typeof SHEN_SHA_CATALOG)[number],target:BranchName,basis:string)=>{const at=ps.filter(p=>p.branch.name===target).map(p=>p.label);if(at.length)out.push({name,at,basis});};
  const hitStem=(name:(typeof SHEN_SHA_CATALOG)[number],target:StemName,basis:string)=>{const at=ps.filter(p=>p.stem.name===target).map(p=>p.label);if(at.length)out.push({name,at,basis});};
  const byDay=<T>(values:readonly T[])=>values[day.index]!;
  const noble:BranchName[][]=[['Sửu','Mùi'],['Tý','Thân'],['Hợi','Dậu'],['Hợi','Dậu'],['Sửu','Mùi'],['Tý','Thân'],['Sửu','Mùi'],['Ngọ','Dần'],['Mão','Tỵ'],['Mão','Tỵ']];
  for(const target of noble[day.index]!) hitBranch('Thiên Ất Quý Nhân',target,`Nhật can ${day.name}`);
  const taiji:BranchName[][]=[['Tý','Ngọ'],['Tý','Ngọ'],['Mão','Dậu'],['Mão','Dậu'],['Thìn','Tuất','Sửu','Mùi'],['Thìn','Tuất','Sửu','Mùi'],['Dần','Hợi'],['Dần','Hợi'],['Tỵ','Thân'],['Tỵ','Thân']];
  for(const target of taiji[day.index]!) hitBranch('Thái Cực Quý Nhân',target,`Nhật can ${day.name}`);
  const literary:BranchName[]=['Tỵ','Ngọ','Thân','Dậu','Thân','Dậu','Hợi','Tý','Dần','Mão'];hitBranch('Văn Xương',byDay(literary),`Nhật can ${day.name}`);
  const lu:BranchName[]=['Dần','Mão','Tỵ','Ngọ','Tỵ','Ngọ','Thân','Dậu','Hợi','Tý'];hitBranch('Lộc Thần',byDay(lu),`Nhật can ${day.name}`);
  const blade:BranchName[]=['Mão','Dần','Ngọ','Tỵ','Ngọ','Tỵ','Dậu','Thân','Tý','Hợi'];hitBranch('Dương Nhận',byDay(blade),`Nhật can ${day.name}`);
  const carriage:BranchName[]=['Thìn','Tỵ','Mùi','Thân','Mùi','Thân','Tuất','Hợi','Sửu','Dần'];hitBranch('Kim Dư',byDay(carriage),`Nhật can ${day.name}`);
  const seal:BranchName[]=['Tuất','Hợi','Sửu','Dần','Sửu','Dần','Thìn','Tỵ','Mùi','Thân'];hitBranch('Quốc Ấn',byDay(seal),`Nhật can ${day.name}`);
  const school:BranchName[]=['Hợi','Hợi','Dần','Dần','Thân','Thân','Tỵ','Tỵ','Thân','Thân'];hitBranch('Học Đường',byDay(school),`Nhật can ${day.name}`);

  for(const base of [ps[0]!.branch.name,ps[2]!.branch.name]) { const g=TRINES.findIndex(s=>s.includes(base)); if(g>=0){const basis=`Chi ${base}`;hitBranch('Đào Hoa',PEACH[g]!,basis);hitBranch('Dịch Mã',HORSE[g]!,basis);hitBranch('Hoa Cái',FLOWER[g]!,basis);hitBranch('Tướng Tinh',GENERAL[g]!,basis);hitBranch('Kiếp Sát',ROBBERY[g]!,basis);hitBranch('Vong Thần',LOSS[g]!,basis);hitBranch('Tai Sát',DISASTER[g]!,basis);} }
  const year=ps[0]!.branch.index;
  const red:BranchName[]=['Mão','Dần','Sửu','Tý','Hợi','Tuất','Dậu','Thân','Mùi','Ngọ','Tỵ','Thìn'];hitBranch('Hồng Loan',red[year]!,`Niên chi ${ps[0]!.branch.name}`);hitBranch('Thiên Hỷ',ps[0]!.branch.index<6?red[year+6]!:red[year-6]!,`Niên chi ${ps[0]!.branch.name}`);
  const lonely:BranchName[]=['Dần','Dần','Tỵ','Tỵ','Tỵ','Thân','Thân','Thân','Hợi','Hợi','Hợi','Dần'];
  const widow:BranchName[]=['Tuất','Tuất','Sửu','Sửu','Sửu','Thìn','Thìn','Thìn','Mùi','Mùi','Mùi','Tuất'];
  hitBranch('Cô Thần',lonely[year]!,`Niên chi ${ps[0]!.branch.name}`);hitBranch('Quả Tú',widow[year]!,`Niên chi ${ps[0]!.branch.name}`);
  hitBranch('Thiên Y',(['Hợi','Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất'] as BranchName[])[ps[1]!.branch.index]!,`Nguyệt chi ${ps[1]!.branch.name}`);
  const branches=ps.map(p=>p.branch.name); if(branches.includes('Thìn')&&branches.includes('Tỵ'))out.push({name:'Thiên La',at:ps.filter(p=>p.branch.name==='Thìn'||p.branch.name==='Tỵ').map(p=>p.label),basis:'Thìn–Tỵ đồng hiện'});
  if(branches.includes('Tuất')&&branches.includes('Hợi'))out.push({name:'Địa Võng',at:ps.filter(p=>p.branch.name==='Tuất'||p.branch.name==='Hợi').map(p=>p.label),basis:'Tuất–Hợi đồng hiện'});
  const month=ps[1]!.branch.index, pardonStems:StemName[]=['Mậu','Giáp','Nhâm','Giáp']; const pardonBranches:BranchName[]=['Dần','Ngọ','Thân','Tý']; const season=Math.floor(((month-2+12)%12)/3);
  if(ps[2]!.stem.name===pardonStems[season]&&ps[2]!.branch.name===pardonBranches[season])out.push({name:'Thiên Xá',at:['Ngày'],basis:`Nhật trụ theo mùa ${season+1}`});
  // Reserved stem matcher keeps the rules API ready for month-based stem stars.
  void hitStem;
  return out.filter((x,i,a)=>a.findIndex(y=>y.name===x.name&&y.at.join()===x.at.join()&&y.basis===x.basis)===i).map(x=>({code:SHEN_SHA_CODES[x.name as (typeof SHEN_SHA_CATALOG)[number]],...x}));
}
