#!/usr/bin/env node
import { analyzeBirthTimeSensitivityFromJson, calculateBaziBatchFromJson, calculateBaziFromJson, compareBirthInputsFromJson, createBaziAuditReportFromJson, localizeBaziAuditReportFromJson, localizeCompatibilityFromJson, localizeFactsFromJson, localizeMethodologyFromJson, renderBaziSvgFromJson } from './json.js';
import { calculateAnnualTimeline } from './engine.js';
import { getEngineCapabilities } from './capabilities.js';
const MAX_STDIN_BYTES = 10 * 1024 * 1024;
function readStdin() { return new Promise((resolve, reject) => { let value = '', bytes = 0; process.stdin.setEncoding('utf8'); process.stdin.on('data', chunk => { bytes += new TextEncoder().encode(chunk).length; if (bytes > MAX_STDIN_BYTES) {
    const error = new RangeError('stdin vượt giới hạn 10 MiB');
    reject(error);
    process.stdin.destroy(error);
    return;
} value += chunk; }); process.stdin.on('end', () => resolve(value)); process.stdin.on('error', reject); }); }
const args = process.argv.slice(2), yearAt = args.indexOf('--year'), timelineAt = args.indexOf('--timeline'), sensitivityAt = args.indexOf('--sensitivity'), localeAt = args.indexOf('--locale'), titleAt = args.indexOf('--title'), widthAt = args.indexOf('--width'), year = yearAt >= 0 ? Number(args[yearAt + 1]) : undefined;
const excluded = new Set();
for (const at of [yearAt, timelineAt, sensitivityAt, localeAt, titleAt, widthAt])
    if (at >= 0) {
        excluded.add(at);
        excluded.add(at + 1);
    }
const inlineJson = args.find((x, i) => !excluded.has(i) && !['--compact', '--batch', '--compatibility', '--audit', '--facts', '--methodology', '--stdin', '--svg', '--no-hidden-stems', '--no-element-balance', '--high-contrast'].includes(x));
try {
    if (args.includes('--capabilities')) {
        if (args.some(arg => !['--capabilities', '--compact'].includes(arg)))
            throw new TypeError('--capabilities chỉ dùng cùng --compact');
        process.stdout.write(JSON.stringify(getEngineCapabilities(), null, args.includes('--compact') ? undefined : 2) + '\n');
    }
    else {
        const json = args.includes('--stdin') ? await readStdin() : inlineJson;
        if (!json)
            throw new TypeError('Usage: viet-bazi [--stdin] [--batch|--compatibility|--audit|--sensitivity 120:5|--svg] [--year 2026] [--timeline 2025:2035] [--compact] JSON');
        if (args.includes('--stdin') && inlineJson)
            throw new TypeError('--stdin không nhận thêm JSON argument');
        if (args.includes('--batch') && (yearAt >= 0 || timelineAt >= 0))
            throw new TypeError('--batch không dùng cùng --year hoặc --timeline');
        if (sensitivityAt >= 0 && (args.includes('--batch') || timelineAt >= 0))
            throw new TypeError('--sensitivity không dùng cùng --batch hoặc --timeline');
        if (args.includes('--compatibility') && (args.includes('--batch') || sensitivityAt >= 0 || timelineAt >= 0 || yearAt >= 0))
            throw new TypeError('--compatibility không dùng cùng --batch, --sensitivity, --timeline hoặc --year');
        if (args.includes('--audit') && (args.includes('--batch') || args.includes('--compatibility') || args.includes('--svg') || sensitivityAt >= 0 || timelineAt >= 0))
            throw new TypeError('--audit không dùng cùng batch, compatibility, svg, sensitivity hoặc timeline');
        if (args.includes('--svg') && (args.includes('--batch') || args.includes('--compatibility') || sensitivityAt >= 0 || timelineAt >= 0 || yearAt >= 0))
            throw new TypeError('--svg không dùng cùng batch, compatibility, sensitivity, timeline hoặc year');
        if (!args.includes('--svg') && (localeAt >= 0 && !args.includes('--facts') && !args.includes('--methodology') && !args.includes('--compatibility') && !args.includes('--audit') || titleAt >= 0 || widthAt >= 0 || args.includes('--no-hidden-stems') || args.includes('--no-element-balance') || args.includes('--high-contrast')))
            throw new TypeError('--locale chỉ dùng cùng --svg, --facts, --methodology, --compatibility hoặc --audit');
        let sensitivityOptions;
        if (sensitivityAt >= 0) {
            const match = /^(\d+)(?::(\d+))?$/.exec(args[sensitivityAt + 1] ?? '');
            if (!match)
                throw new RangeError('--sensitivity phải có dạng MINUTES hoặc MINUTES:STEP');
            sensitivityOptions = [Number(match[1]), Number(match[2] ?? 5)];
        }
        const locale = localeAt >= 0 ? args[localeAt + 1] : undefined;
        if (locale !== undefined && locale !== 'vi' && locale !== 'en')
            throw new RangeError('--locale phải là vi hoặc en');
        const width = widthAt >= 0 ? Number(args[widthAt + 1]) : undefined;
        if (width !== undefined && (!Number.isFinite(width) || width <= 0))
            throw new RangeError('--width phải là số dương');
        if (args.includes('--svg')) {
            const svg = renderBaziSvgFromJson(json, { ...(locale ? { locale } : {}), ...(titleAt >= 0 ? { title: args[titleAt + 1] ?? '' } : {}), ...(width !== undefined ? { width } : {}), ...(args.includes('--no-hidden-stems') ? { showHiddenStems: false } : {}), ...(args.includes('--no-element-balance') ? { showElementBalance: false } : {}), ...(args.includes('--high-contrast') ? { highContrast: true } : {}) });
            process.stdout.write(svg + '\n');
        }
        else {
            const chart = args.includes('--batch') ? calculateBaziBatchFromJson(json) : args.includes('--compatibility') ? (locale ? localizeCompatibilityFromJson(json, locale) : compareBirthInputsFromJson(json)) : args.includes('--audit') ? (locale ? localizeBaziAuditReportFromJson(json, locale, year) : createBaziAuditReportFromJson(json, year)) : args.includes('--facts') ? localizeFactsFromJson(json, locale === 'en' ? 'en' : 'vi', year) : args.includes('--methodology') ? localizeMethodologyFromJson(json, locale === 'en' ? 'en' : 'vi', year) : sensitivityOptions ? analyzeBirthTimeSensitivityFromJson(json, ...sensitivityOptions, year) : calculateBaziFromJson(json, year);
            let result = chart;
            if (timelineAt >= 0) {
                const match = /^(\d{4}):(\d{4})$/.exec(args[timelineAt + 1] ?? '');
                if (!match)
                    throw new RangeError('--timeline phải có dạng YYYY:YYYY');
                result = calculateAnnualTimeline(chart, Number(match[1]), Number(match[2]));
            }
            process.stdout.write(JSON.stringify(result, null, args.includes('--compact') ? undefined : 2) + '\n');
        }
    }
}
catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = error instanceof TypeError && error.message.startsWith('Usage:') ? 2 : 1;
}
