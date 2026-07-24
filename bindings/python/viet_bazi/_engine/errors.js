export const BAZI_ERROR_CODES = [
    'INVALID_JSON', 'INPUT_NOT_OBJECT', 'UNKNOWN_PROPERTY', 'LOCAL_DATETIME_TYPE', 'LOCAL_DATETIME_FORMAT',
    'TIMEZONE_OFFSET', 'AS_OF_YEAR', 'GENDER', 'TRUE_SOLAR_TIME_TYPE', 'DAY_BOUNDARY', 'LOCATION_TYPE',
    'LATITUDE', 'LONGITUDE', 'LOCATION_COORDINATES_REQUIRED', 'CITY_TYPE', 'LOCATION_REQUIRED',
    'TRUE_SOLAR_LOCATION_REQUIRED', 'BATCH_NOT_ARRAY', 'BATCH_LIMIT', 'COMPATIBILITY_ARITY',
    'TIMELINE_RANGE', 'TIMELINE_LIMIT', 'TIMELINE_EMPTY', 'SENSITIVITY_WINDOW', 'SENSITIVITY_STEP',
    'SENSITIVITY_LIMIT', 'SVG_WIDTH', 'SVG_LOCALE', 'WASM_INSTANTIATION', 'WASM_ABI', 'CALCULATION_ERROR'
];
export class BaziError extends Error {
    code;
    messages;
    constructor(code, name, messages) { super(messages.vi); this.name = name; this.code = code; this.messages = Object.freeze({ ...messages }); }
    toPayload(locale = 'vi') { return { name: this.name, code: this.code, message: this.messages[locale] }; }
}
export const baziError = (code, name, vi, en) => new BaziError(code, name, { vi, en });
export function toBaziErrorPayload(error, locale = 'vi') {
    if (error instanceof BaziError)
        return error.toPayload(locale);
    return { name: error instanceof Error ? error.name : 'Error', code: 'CALCULATION_ERROR', message: error instanceof Error ? error.message : String(error) };
}
