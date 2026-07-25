import { localizeChartSummary, localizeFacts, localizeMethodology } from './localization-report.js';
import { createBaziAuditReport, localizeBaziAuditReport } from './traceability.js';
import type { BaziResult, InterpretationFocus, InterpretationPromptBundle, InterpretationPromptOptions } from './types.js';

export const INTERPRETATION_PROMPT_VERSION='1.0.0' as const;

const focusText:Record<'vi'|'en',Record<InterpretationFocus,string>>={
  vi:{overview:'tổng quan có cân bằng',elements:'Ngũ Hành và sức mạnh Nhật Chủ',career:'khuynh hướng công việc dưới góc nhìn văn hóa',relationships:'khuynh hướng quan hệ dưới góc nhìn văn hóa',timing:'Đại Vận và Lưu Niên đang hoạt động'},
  en:{overview:'a balanced overview',elements:'Five Elements and Day Master strength',career:'career tendencies as cultural interpretation',relationships:'relationship tendencies as cultural interpretation',timing:'active luck cycle and annual context'}
};

/** Build deterministic, provider-neutral LLM messages grounded only in engine output. */
export function createInterpretationPrompt(chart:BaziResult,options:InterpretationPromptOptions={}):InterpretationPromptBundle {
  const locale=options.locale??'vi',focus=options.focus??'overview';
  const grounding={
    summary:localizeChartSummary(chart,locale),
    facts:localizeFacts(chart,locale),
    methodology:localizeMethodology(chart.metadata.methodology,locale),
    audit:localizeBaziAuditReport(createBaziAuditReport(chart),locale)
  };
  const system=locale==='vi'
    ?'Bạn là người diễn giải dữ liệu Bát Tự có kiểm chứng. Chỉ dùng payload GROUNDING; không tự tính lại hoặc thêm dữ kiện. Phân biệt rõ dữ kiện engine với diễn giải văn hóa. Mỗi nhận định quan trọng phải dẫn stable code và evidence/path trong ngoặc vuông. Nêu bất định, heuristic và cảnh báo gần ranh. Không đưa lời khuyên y tế, pháp lý, tài chính hoặc khẳng định định mệnh.'
    :'You interpret verified Bazi data. Use only the GROUNDING payload; do not recalculate or invent facts. Clearly separate engine facts from cultural interpretation. Cite stable codes and evidence/paths in brackets for every material claim. Preserve uncertainty, heuristics, and boundary warnings. Do not give medical, legal, or financial advice or deterministic predictions.';
  const request=locale==='vi'
    ?`Hãy viết ${focusText.vi[focus]}. Cấu trúc: Dữ kiện đã tính; Diễn giải tham khảo; Giới hạn và điều cần xác minh.`
    :`Write ${focusText.en[focus]}. Structure: Calculated facts; Cultural interpretation; Limitations and items to verify.`;
  const user=`${request}\n\nGROUNDING_JSON:\n${JSON.stringify(grounding)}`;
  return {schemaVersion:'1.0',templateCode:'GROUNDED_BAZI_INTERPRETATION',templateVersion:INTERPRETATION_PROMPT_VERSION,locale,focus,messages:[{role:'system',content:system},{role:'user',content:user}],grounding};
}
