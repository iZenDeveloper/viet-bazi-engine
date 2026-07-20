export const CONFORMANCE_VERSION = '1.0.0';
/** NAOJ Reki Yoko 2026, Japanese civil time converted to UTC. */
export const JIE_2026_FIXTURES = [
    { name: 'Tiểu Hàn', longitude: 285, utc: '2026-01-05T08:23:00Z', monthIndex: 11 },
    { name: 'Lập Xuân', longitude: 315, utc: '2026-02-03T20:02:00Z', monthIndex: 0 },
    { name: 'Kinh Trập', longitude: 345, utc: '2026-03-05T13:59:00Z', monthIndex: 1 },
    { name: 'Thanh Minh', longitude: 15, utc: '2026-04-04T18:40:00Z', monthIndex: 2 },
    { name: 'Lập Hạ', longitude: 45, utc: '2026-05-05T11:49:00Z', monthIndex: 3 },
    { name: 'Mang Chủng', longitude: 75, utc: '2026-06-05T15:48:00Z', monthIndex: 4 },
    { name: 'Tiểu Thử', longitude: 105, utc: '2026-07-07T01:57:00Z', monthIndex: 5 },
    { name: 'Lập Thu', longitude: 135, utc: '2026-08-07T11:43:00Z', monthIndex: 6 },
    { name: 'Bạch Lộ', longitude: 165, utc: '2026-09-07T14:41:00Z', monthIndex: 7 },
    { name: 'Hàn Lộ', longitude: 195, utc: '2026-10-08T06:29:00Z', monthIndex: 8 },
    { name: 'Lập Đông', longitude: 225, utc: '2026-11-07T09:52:00Z', monthIndex: 9 },
    { name: 'Đại Tuyết', longitude: 255, utc: '2026-12-07T02:53:00Z', monthIndex: 10 }
];
/** NAOJ Japanese Calendar Database, Gregorian conversion with Eto of Day. */
export const SEXAGENARY_DAY_FIXTURES = [
    { date: '1900-01-01', eto: '甲戌', index: 10 }, { date: '1950-06-15', eto: '辛巳', index: 17 },
    { date: '1984-02-02', eto: '丙寅', index: 2 }, { date: '2000-01-07', eto: '甲子', index: 0 },
    { date: '2026-07-21', eto: '丙申', index: 32 }, { date: '2099-12-31', eto: '壬寅', index: 38 }
];
