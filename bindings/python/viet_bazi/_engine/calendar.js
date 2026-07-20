const RAD = Math.PI / 180;
const mod = (n, m) => ((n % m) + m) % m;
export function parseLocalIso(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
    if (!m)
        throw new RangeError('localDateTime phải có dạng YYYY-MM-DDTHH:mm[:ss], không kèm múi giờ');
    const nums = m.slice(1).map(Number);
    const [y, mo, d, h, mi, s = 0] = nums;
    const date = new Date(Date.UTC(y, mo - 1, d, h, mi, s));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d || h > 23 || mi > 59 || s > 59)
        throw new RangeError('Ngày giờ sinh không hợp lệ');
    return date;
}
export function toUtc(local, offsetMinutes) { return new Date(local.getTime() - offsetMinutes * 60000); }
export function julianDay(date) { return date.getTime() / 86400000 + 2440587.5; }
export function solarLongitude(date) {
    const n = julianDay(date) - 2451545.0;
    const L = mod(280.460 + 0.9856474 * n, 360), g = mod(357.528 + 0.9856003 * n, 360) * RAD;
    return mod(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g), 360);
}
/** Equation of time, in minutes (NOAA approximation). */
export function equationOfTime(date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    const day = (date.getTime() - start) / 86400000;
    const b = 2 * Math.PI * (day - 81) / 364;
    return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}
export function solarCorrectionMinutes(date, longitude, offsetMinutes) {
    return 4 * (longitude - offsetMinutes / 4) + equationOfTime(date);
}
export function sexagenaryDayIndex(localSolar, dayBoundary = 'early-zi') {
    // Civil date's JDN; traditional day changes at 23:00 (early-Zi convention).
    const shifted = new Date(localSolar.getTime() + (dayBoundary === 'early-zi' && localSolar.getUTCHours() >= 23 ? 86400000 : 0));
    const y = shifted.getUTCFullYear(), m = shifted.getUTCMonth() + 1, d = shifted.getUTCDate();
    const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    return mod(jdn + 49, 60);
}
export function solarMonthIndex(utc) {
    // 0=Dần (Lập Xuân), boundaries every 30° from longitude 315°.
    return mod(Math.floor(mod(solarLongitude(utc) - 315, 360) / 30), 12);
}
export function baziYear(utc) {
    const y = utc.getUTCFullYear();
    // Longitude >=315 and <~360 is after Lập Xuân; Jan/early Feb belongs to prior year.
    const lon = solarLongitude(utc);
    return utc.getUTCMonth() < 2 && lon < 315 ? y - 1 : y;
}
export function findNextJie(utc, direction) {
    return findJieBoundary(utc, direction, solarLongitude);
}
export function findJieBoundary(utc, direction, longitude) {
    const bucket = (date) => Math.floor(mod(longitude(date) - 315, 360) / 30);
    let cursor = new Date(utc), previous = new Date(cursor), origin = bucket(cursor);
    for (let i = 0; i < 40 * 24; i++) {
        previous = cursor;
        cursor = new Date(cursor.getTime() + direction * 3600000);
        if (bucket(cursor) !== origin) {
            let lo = Math.min(cursor.getTime(), previous.getTime()), hi = Math.max(cursor.getTime(), previous.getTime()), lowBucket = bucket(new Date(lo));
            while (hi - lo > 1000) {
                const mid = Math.floor((lo + hi) / 2);
                if (bucket(new Date(mid)) === lowBucket)
                    lo = mid;
                else
                    hi = mid;
            }
            return new Date(Math.round(hi / 60000) * 60000);
        }
    }
    throw new Error('Không tìm thấy tiết khí lân cận');
}
/** Finds a solar-longitude crossing with minute precision. Target is in degrees. */
export function solarTermBoundary(year, targetLongitude) {
    if (!Number.isInteger(year) || year < 1600 || year > 2400)
        throw new RangeError('year phải nằm trong 1600..2400');
    if (!Number.isFinite(targetLongitude) || targetLongitude < 0 || targetLongitude >= 360)
        throw new RangeError('targetLongitude phải nằm trong [0, 360)');
    const estimatedDay = mod(targetLongitude - 280, 360) / .9856474;
    const center = Date.UTC(year, 0, 1) + estimatedDay * 86400000;
    let best = new Date(center), bestError = Infinity;
    for (let minutes = -5 * 1440; minutes <= 5 * 1440; minutes += 10) {
        const candidate = new Date(center + minutes * 60000);
        const error = Math.abs(mod(solarLongitude(candidate) - targetLongitude + 180, 360) - 180);
        if (error < bestError) {
            bestError = error;
            best = candidate;
        }
    }
    let lo = best.getTime() - 20 * 60000, hi = best.getTime() + 20 * 60000;
    for (let i = 0; i < 24; i++) {
        const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
        const e1 = Math.abs(mod(solarLongitude(new Date(m1)) - targetLongitude + 180, 360) - 180), e2 = Math.abs(mod(solarLongitude(new Date(m2)) - targetLongitude + 180, 360) - 180);
        if (e1 < e2)
            hi = m2;
        else
            lo = m1;
    }
    return new Date(Math.round((lo + hi) / 2 / 60000) * 60000);
}
export { mod };
