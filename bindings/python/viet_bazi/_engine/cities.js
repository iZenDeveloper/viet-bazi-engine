export const VIETNAM_CITIES = [
    { id: 'ha-noi', name: 'Hà Nội', aliases: ['Hanoi'], latitude: 21.0285, longitude: 105.8542, timezoneOffsetMinutes: 420 },
    { id: 'ho-chi-minh', name: 'Hồ Chí Minh', aliases: ['TP HCM', 'TP.HCM', 'Ho Chi Minh City', 'Saigon', 'Sài Gòn'], latitude: 10.7769, longitude: 106.7009, timezoneOffsetMinutes: 420 },
    { id: 'da-nang', name: 'Đà Nẵng', aliases: ['Da Nang'], latitude: 16.0544, longitude: 108.2022, timezoneOffsetMinutes: 420 },
    { id: 'hai-phong', name: 'Hải Phòng', aliases: ['Hai Phong'], latitude: 20.8449, longitude: 106.6881, timezoneOffsetMinutes: 420 },
    { id: 'can-tho', name: 'Cần Thơ', aliases: ['Can Tho'], latitude: 10.0452, longitude: 105.7469, timezoneOffsetMinutes: 420 },
    { id: 'hue', name: 'Huế', aliases: ['Hue'], latitude: 16.4637, longitude: 107.5909, timezoneOffsetMinutes: 420 },
    { id: 'nha-trang', name: 'Nha Trang', aliases: [], latitude: 12.2388, longitude: 109.1967, timezoneOffsetMinutes: 420 },
    { id: 'vung-tau', name: 'Vũng Tàu', aliases: ['Vung Tau'], latitude: 10.4114, longitude: 107.1362, timezoneOffsetMinutes: 420 },
    { id: 'da-lat', name: 'Đà Lạt', aliases: ['Da Lat', 'Dalat'], latitude: 11.9404, longitude: 108.4583, timezoneOffsetMinutes: 420 },
    { id: 'buon-ma-thuot', name: 'Buôn Ma Thuột', aliases: ['Buon Ma Thuot', 'Ban Me Thuot'], latitude: 12.6667, longitude: 108.0500, timezoneOffsetMinutes: 420 }
];
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');
export function findCity(query) { const q = normalize(query); return VIETNAM_CITIES.find(c => [c.id, c.name, ...c.aliases].some(x => normalize(x) === q)); }
export function resolveLocation(location) {
    if (!location)
        throw new RangeError('trueSolarTime cần location');
    if (location.latitude !== undefined || location.longitude !== undefined) {
        if (location.latitude === undefined || location.longitude === undefined)
            throw new RangeError('Phải truyền đủ latitude và longitude');
        if (!Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90)
            throw new RangeError('latitude không hợp lệ');
        if (!Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180)
            throw new RangeError('longitude không hợp lệ');
        return { latitude: location.latitude, longitude: location.longitude, ...(location.city ? { city: location.city } : {}) };
    }
    if (!location.city)
        throw new RangeError('location cần city hoặc cặp latitude/longitude');
    const found = findCity(location.city);
    if (!found)
        throw new RangeError(`Không tìm thấy thành phố "${location.city}" trong catalog; hãy truyền tọa độ thủ công`);
    return { city: found.name, latitude: found.latitude, longitude: found.longitude };
}
