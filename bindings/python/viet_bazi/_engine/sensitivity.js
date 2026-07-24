import { parseLocalIso } from './calendar.js';
import { calculateBazi } from './engine.js';
const pillarSnapshot = (pillars) => ({ year: `${pillars.year.stem.code}-${pillars.year.branch.code}`, month: `${pillars.month.stem.code}-${pillars.month.branch.code}`, day: `${pillars.day.stem.code}-${pillars.day.branch.code}`, hour: `${pillars.hour.stem.code}-${pillars.hour.branch.code}` });
const signature = (snapshot) => `${snapshot.year}|${snapshot.month}|${snapshot.day}|${snapshot.hour}`;
const shiftedIso = (localDateTime, minutes) => new Date(parseLocalIso(localDateTime).getTime() + minutes * 60000).toISOString().slice(0, 19);
const changedPillars = (baseline, current) => [['YEAR', 'year'], ['MONTH', 'month'], ['DAY', 'day'], ['HOUR', 'hour']].filter(([, key]) => baseline[key] !== current[key]).map(([code]) => code);
export function analyzeBirthTimeSensitivity(input, windowMinutes = 120, stepMinutes = 5) {
    if (!Number.isInteger(windowMinutes) || windowMinutes < 1 || windowMinutes > 720)
        throw new RangeError('windowMinutes phải là số nguyên trong 1..720');
    if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > windowMinutes)
        throw new RangeError('stepMinutes phải là số nguyên trong 1..windowMinutes');
    const offsets = new Set([-windowMinutes, 0, windowMinutes]);
    for (let offset = -windowMinutes; offset <= windowMinutes; offset += stepMinutes)
        offsets.add(offset);
    if (offsets.size > 289)
        throw new RangeError('Phân tích hỗ trợ tối đa 289 mẫu; hãy tăng stepMinutes');
    const baselineChart = calculateBazi(input), baseline = pillarSnapshot(baselineChart.pillars), states = new Map();
    for (const offset of [...offsets].sort((a, b) => a - b)) {
        const localDateTime = shiftedIso(input.localDateTime, offset), chart = calculateBazi({ ...input, localDateTime }), pillars = pillarSnapshot(chart.pillars), key = signature(pillars), existing = states.get(key);
        if (existing)
            existing.lastOffsetMinutes = offset;
        else
            states.set(key, { firstOffsetMinutes: offset, lastOffsetMinutes: offset, localDateTime, pillars });
    }
    const variants = [...states.values()].map(state => ({ ...state, changedPillars: changedPillars(baseline, state.pillars) }));
    return { schemaVersion: '1.0', windowMinutes, stepMinutes, sampleCount: offsets.size, stable: variants.length === 1, baseline: { localDateTime: input.localDateTime, pillars: baseline }, variants };
}
const pillarLabels = { vi: { YEAR: 'Năm', MONTH: 'Tháng', DAY: 'Ngày', HOUR: 'Giờ' }, en: { YEAR: 'Year', MONTH: 'Month', DAY: 'Day', HOUR: 'Hour' } };
/** Localize the explanatory layer while preserving stable pillar codes and snapshots. */
export function localizeBirthTimeSensitivity(report, locale = 'vi') {
    const labels = pillarLabels[locale], summary = locale === 'en' ? `${report.sampleCount} samples; ${report.stable ? 'all four pillars are stable' : `${report.variants.length} distinct pillar states`}.` : `${report.sampleCount} mẫu; ${report.stable ? 'cả bốn trụ ổn định' : `${report.variants.length} trạng thái trụ khác nhau`}.`;
    return { schemaVersion: '1.0', locale, windowMinutes: report.windowMinutes, stepMinutes: report.stepMinutes, sampleCount: report.sampleCount, stable: report.stable, summary, baseline: { localDateTime: report.baseline.localDateTime, pillars: { ...report.baseline.pillars } }, variants: report.variants.map(({ changedPillars, ...variant }) => ({ ...variant, pillars: { ...variant.pillars }, changedPillarCodes: [...changedPillars], changedPillars: changedPillars.map(code => labels[code]) })) };
}
