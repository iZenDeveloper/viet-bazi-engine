import { calculateBaziWithCalendar } from './engine.js';
import { findJieBoundary, mod } from './calendar.js';
import { baziError } from './errors.js';
async function instantiate(source, imports) {
    if (source instanceof WebAssembly.Module)
        return WebAssembly.instantiate(source, imports);
    if (source instanceof Response) {
        const fallback = source.clone();
        try {
            return (await WebAssembly.instantiateStreaming(source, imports)).instance;
        }
        catch {
            return (await WebAssembly.instantiate(await fallback.arrayBuffer(), imports)).instance;
        }
    }
    return (await WebAssembly.instantiate(source, imports)).instance;
}
export async function loadWasmCalendar(source) {
    const imports = { env: { sin: Math.sin, cos: Math.cos } };
    let instance;
    try {
        instance = await instantiate(source, imports);
    }
    catch {
        throw baziError('WASM_INSTANTIATION', 'Error', 'Không thể khởi tạo WASM calendar', 'Unable to instantiate the WASM calendar');
    }
    const raw = instance.exports;
    if (typeof raw.abi_version !== 'function' || raw.abi_version() !== 1)
        throw baziError('WASM_ABI', 'Error', 'WASM calendar ABI không tương thích', 'Incompatible WASM calendar ABI');
    return { abiVersion: 1, solarLongitude: (ms) => raw.solar_longitude(ms), equationOfTime: (day) => raw.equation_of_time(day), sexagenaryDayIndex: (year, month, day, hour) => raw.sexagenary_day_index(year, month, day, hour) };
}
function operations(kernel) {
    const longitude = (date) => kernel.solarLongitude(date.getTime());
    return {
        baziYear(utc) { const y = utc.getUTCFullYear(), lon = longitude(utc); return utc.getUTCMonth() < 2 && lon < 315 ? y - 1 : y; },
        solarMonthIndex(utc) { return mod(Math.floor(mod(longitude(utc) - 315, 360) / 30), 12); },
        sexagenaryDayIndex(localSolar, dayBoundary) { return kernel.sexagenaryDayIndex(localSolar.getUTCFullYear(), localSolar.getUTCMonth() + 1, localSolar.getUTCDate(), dayBoundary === 'early-zi' ? localSolar.getUTCHours() : 0); },
        solarCorrectionMinutes(utc, locationLongitude, offsetMinutes) { const start = Date.UTC(utc.getUTCFullYear(), 0, 0), day = (utc.getTime() - start) / 86400000; return 4 * (locationLongitude - offsetMinutes / 4) + kernel.equationOfTime(day); },
        findNextJie(utc, direction) { return findJieBoundary(utc, direction, longitude); }
    };
}
export async function createWasmBaziEngine(source) {
    const kernel = await loadWasmCalendar(source), calendar = operations(kernel);
    return { backend: 'wasm-calendar-v1', kernel, calculateBazi: (input) => calculateBaziWithCalendar(input, calendar) };
}
