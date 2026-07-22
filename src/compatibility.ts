import { CONTROLS, GENERATES } from './constants.js';
import { calculateBazi } from './engine.js';
import type { BaziResult, BirthInput, BranchName, CompatibilityFactor, CompatibilityResult, Element } from './types.js';

const COMBINE:Record<BranchName,BranchName>={Tý:'Sửu',Sửu:'Tý',Dần:'Hợi',Hợi:'Dần',Mão:'Tuất',Tuất:'Mão',Thìn:'Dậu',Dậu:'Thìn',Tỵ:'Thân',Thân:'Tỵ',Ngọ:'Mùi',Mùi:'Ngọ'};
const CLASH:Record<BranchName,BranchName>={Tý:'Ngọ',Ngọ:'Tý',Sửu:'Mùi',Mùi:'Sửu',Dần:'Thân',Thân:'Dần',Mão:'Dậu',Dậu:'Mão',Thìn:'Tuất',Tuất:'Thìn',Tỵ:'Hợi',Hợi:'Tỵ'};
const HARM:Record<BranchName,BranchName>={Tý:'Mùi',Mùi:'Tý',Sửu:'Ngọ',Ngọ:'Sửu',Dần:'Tỵ',Tỵ:'Dần',Mão:'Thìn',Thìn:'Mão',Thân:'Hợi',Hợi:'Thân',Dậu:'Tuất',Tuất:'Dậu'};

export function compareBaziCharts(a:BaziResult,b:BaziResult):CompatibilityResult {
  const factors:CompatibilityFactor[]=[]; const ae=a.dayMaster.element,be=b.dayMaster.element;
  const supportive=ae===be||GENERATES[ae]===be||GENERATES[be]===ae;
  const controlling=CONTROLS[ae]===be||CONTROLS[be]===ae;
  factors.push({code:'DAY_MASTER',score:supportive?25:controlling?8:15,maxScore:25,vi:supportive?'Nhật Chủ đồng hành hoặc tương sinh.':controlling?'Nhật Chủ tạo quan hệ tương khắc, cần cân bằng.':'Quan hệ Nhật Chủ trung tính.',evidence:['a.dayMaster','b.dayMaster']});
  const ap=Object.fromEntries(a.elements.map(e=>[e.element,e.percent])) as Record<Element,number>,bp=Object.fromEntries(b.elements.map(e=>[e.element,e.percent])) as Record<Element,number>;
  const aNeeds=a.pattern.favorableElements,bNeeds=b.pattern.favorableElements;
  const suppliedA=aNeeds.filter(e=>bp[e]>=18),suppliedB=bNeeds.filter(e=>ap[e]>=18); const complement=[...new Set([...suppliedA,...suppliedB])];
  const compScore=Math.min(25,Math.round((suppliedA.length+suppliedB.length)/Math.max(1,aNeeds.length+bNeeds.length)*25));
  factors.push({code:'ELEMENT_COMPLEMENT',score:compScore,maxScore:25,vi:`Hai lá số bổ trợ ${complement.length} hành đang cần.`,evidence:['a.pattern.favorableElements','b.pattern.favorableElements','elements']});
  const aBranches=Object.values(a.pillars).map(p=>p.branch.name),bBranches=Object.values(b.pillars).map(p=>p.branch.name);let combines=0,clashes=0,harms=0;
  for(const x of aBranches)for(const y of bBranches){if(COMBINE[x]===y)combines++;if(CLASH[x]===y)clashes++;if(HARM[x]===y)harms++;}
  const branchScore=Math.max(0,25+Math.min(combines,3)*4-Math.min(clashes,3)*4-Math.min(harms,2)*3);
  factors.push({code:'BRANCH_INTERACTION',score:Math.min(35,branchScore),maxScore:35,vi:`Tương tác chéo: ${combines} hợp, ${clashes} xung, ${harms} hại.`,evidence:['pillars.*.branch']});
  const polarity=a.dayMaster.polarity!==b.dayMaster.polarity?15:10;
  factors.push({code:'YIN_YANG',score:polarity,maxScore:15,vi:polarity===15?'Âm Dương Nhật Chủ bổ sung nhau.':'Nhật Chủ cùng tính Âm/Dương.',evidence:['a.dayMaster.polarity','b.dayMaster.polarity']});
  const score=Math.max(0,Math.min(100,factors.reduce((n,f)=>n+f.score,0))); const grade=score>=80?'cao':score>=65?'khá':score>=45?'trung bình':'thấp';
  const shared=a.elements.filter(e=>e.percent>=18&&bp[e.element]>=18).map(e=>e.element);
  return {schemaVersion:'1.0',score,grade,factors,sharedElements:shared,complementaryElements:complement,metadata:{methodology:'heuristic-v1',warning:'Điểm tương hợp là heuristic minh bạch để tham khảo văn hóa, không dự đoán chất lượng hay tương lai của một mối quan hệ.'}};
}

export function compareBirthInputs(a:BirthInput,b:BirthInput):CompatibilityResult {return compareBaziCharts(calculateBazi(a),calculateBazi(b));}
