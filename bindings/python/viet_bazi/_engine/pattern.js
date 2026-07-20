import { CONTROLS, ELEMENTS, GENERATES } from './constants.js';
export function analyzePattern(day, month, elements) {
    const resource = ELEMENTS.find(e => GENERATES[e] === day.element);
    const support = new Set([day.element, resource]);
    const supportScore = elements.filter(e => support.has(e.element)).reduce((n, e) => n + e.percent, 0);
    const dayMasterStrength = supportScore >= 55 ? 'thân vượng' : supportScore < 40 ? 'thân nhược' : 'trung hòa';
    const output = GENERATES[day.element], wealth = CONTROLS[day.element], officer = ELEMENTS.find(e => CONTROLS[e] === day.element);
    const favorableElements = dayMasterStrength === 'thân nhược' ? [resource, day.element] : dayMasterStrength === 'thân vượng' ? [output, wealth, officer] : [...ELEMENTS].sort((a, b) => elements.find(x => x.element === a).percent - elements.find(x => x.element === b).percent).slice(0, 2);
    const unfavorableElements = ELEMENTS.filter(e => !favorableElements.includes(e)).sort((a, b) => elements.find(x => x.element === b).percent - elements.find(x => x.element === a).percent).slice(0, 2);
    const primary = month.branch.hiddenStems[0]?.tenGod ?? 'Chưa xác định';
    return { primary: `${primary} cách (sơ bộ)`, dayMasterStrength, favorableElements: [...new Set(favorableElements)], unfavorableElements, summary: `Nhật Chủ ${day.name} ở mức ${dayMasterStrength}; nhóm hành hỗ trợ sơ bộ: ${[...new Set(favorableElements)].join(', ')}.`, evidence: ['Chủ khí nguyệt lệnh', 'Tỷ lệ Nhật Chủ + Ấn tinh', 'Quan hệ sinh khắc Ngũ Hành'] };
}
