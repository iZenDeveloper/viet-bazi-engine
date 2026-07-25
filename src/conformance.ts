export const CONFORMANCE_VERSION='1.3.0' as const;

export interface SolarTermFixture { name:string; longitude:number; utc:string; monthIndex:number }
export interface MultiYearSolarTermFixture extends SolarTermFixture { year:number }
export interface SexagenaryDayFixture { date:string; eto:string; index:number }
export interface TimezoneBoundaryFixture { id:string;group:string;localDateTime:string;timezoneOffsetMinutes:number;dayBoundary:'early-zi'|'midnight';utc:string;year:string;month:string;day:string;hour:string }
export interface JplLichunPoint { year:number;utc:string;bracketStartUtc:string;bracketEndUtc:string;startLongitude:number;endLongitude:number }
export interface JplLichunFixtureSet {
  source:string;sourceUrl:string;retrievedAt:string;
  query:{apiVersion:string;command:string;center:string;ephemerisType:string;quantities:string;timeType:string;calendarType:string;apparent:string;objectData:string;makeEphemeris:string;timeDigits:string;calendarFormat:string;csvFormat:string;extraPrecision:string;stepSizeMinutes:number;window:string};
  method:string;regressionThresholdMinutes:number;points:readonly JplLichunPoint[];
}

/** Frozen NASA/JPL Horizons quantity 31 checkpoints; see the JSON artifact for full provenance. */
export const JPL_LICHUN_MULTI_CENTURY_FIXTURES:JplLichunFixtureSet={
  source:'NASA/JPL Horizons API',sourceUrl:'https://ssd.jpl.nasa.gov/api/horizons.api',retrievedAt:'2026-07-25',
  query:{apiVersion:'1.2',command:'10',center:'500@399',ephemerisType:'OBSERVER',quantities:'31',timeType:'UT',calendarType:'GREGORIAN',apparent:'AIRLESS',objectData:'NO',makeEphemeris:'YES',timeDigits:'SECONDS',calendarFormat:'BOTH',csvFormat:'YES',extraPrecision:'YES',stepSizeMinutes:5,window:'February 2 00:00 through February 6 00:00 UTC'},
  method:'Linear interpolation between the adjacent five-minute ObsEcLon samples bracketing 315 degrees.',regressionThresholdMinutes:40,
  points:[
    {year:1600,utc:'1600-02-04T10:31:09.442Z',bracketStartUtc:'1600-02-04T10:30:00Z',bracketEndUtc:'1600-02-04T10:35:00Z',startLongitude:314.9991867,endLongitude:315.0027003},
    {year:1700,utc:'1700-02-03T17:04:00.965Z',bracketStartUtc:'1700-02-03T17:00:00Z',bracketEndUtc:'1700-02-03T17:05:00Z',startLongitude:314.9971767,endLongitude:315.0006917},
    {year:1800,utc:'1800-02-03T23:34:47.532Z',bracketStartUtc:'1800-02-03T23:30:00Z',bracketEndUtc:'1800-02-03T23:35:00Z',startLongitude:314.9966285,endLongitude:315.0001462},
    {year:1900,utc:'1900-02-04T05:51:35.228Z',bracketStartUtc:'1900-02-04T05:50:00Z',bracketEndUtc:'1900-02-04T05:55:00Z',startLongitude:314.9988825,endLongitude:315.002403},
    {year:2000,utc:'2000-02-04T12:40:23.828Z',bracketStartUtc:'2000-02-04T12:40:00Z',bracketEndUtc:'2000-02-04T12:45:00Z',startLongitude:314.9997202,endLongitude:315.0032429},
    {year:2100,utc:'2100-02-03T19:02:09.622Z',bracketStartUtc:'2100-02-03T19:00:00Z',bracketEndUtc:'2100-02-03T19:05:00Z',startLongitude:314.9984775,endLongitude:315.0020012},
    {year:2200,utc:'2200-02-04T01:29:48.242Z',bracketStartUtc:'2200-02-04T01:25:00Z',bracketEndUtc:'2200-02-04T01:30:00Z',startLongitude:314.9966145,endLongitude:315.0001381},
    {year:2300,utc:'2300-02-04T08:09:25.867Z',bracketStartUtc:'2300-02-04T08:05:00Z',bracketEndUtc:'2300-02-04T08:10:00Z',startLongitude:314.9968765,endLongitude:315.000401},
    {year:2400,utc:'2400-02-04T14:18:04.708Z',bracketStartUtc:'2400-02-04T14:15:00Z',bracketEndUtc:'2400-02-04T14:20:00Z',startLongitude:314.9978285,endLongitude:315.0013554}
  ]
};

/** NAOJ Reki Yoko 2026, Japanese civil time converted to UTC. */
export const JIE_2026_FIXTURES:readonly SolarTermFixture[]=[
  {name:'Tiểu Hàn',longitude:285,utc:'2026-01-05T08:23:00Z',monthIndex:11},
  {name:'Lập Xuân',longitude:315,utc:'2026-02-03T20:02:00Z',monthIndex:0},
  {name:'Kinh Trập',longitude:345,utc:'2026-03-05T13:59:00Z',monthIndex:1},
  {name:'Thanh Minh',longitude:15,utc:'2026-04-04T18:40:00Z',monthIndex:2},
  {name:'Lập Hạ',longitude:45,utc:'2026-05-05T11:49:00Z',monthIndex:3},
  {name:'Mang Chủng',longitude:75,utc:'2026-06-05T15:48:00Z',monthIndex:4},
  {name:'Tiểu Thử',longitude:105,utc:'2026-07-07T01:57:00Z',monthIndex:5},
  {name:'Lập Thu',longitude:135,utc:'2026-08-07T11:43:00Z',monthIndex:6},
  {name:'Bạch Lộ',longitude:165,utc:'2026-09-07T14:41:00Z',monthIndex:7},
  {name:'Hàn Lộ',longitude:195,utc:'2026-10-08T06:29:00Z',monthIndex:8},
  {name:'Lập Đông',longitude:225,utc:'2026-11-07T09:52:00Z',monthIndex:9},
  {name:'Đại Tuyết',longitude:255,utc:'2026-12-07T02:53:00Z',monthIndex:10}
];

/** NAOJ Reki Yoko 2013 and 2020, JCST converted to UTC. */
export const JIE_MULTI_YEAR_FIXTURES:readonly MultiYearSolarTermFixture[]=[
  {year:2013,name:'Tiểu Hàn',longitude:285,utc:'2013-01-05T04:34:00Z',monthIndex:11},{year:2013,name:'Lập Xuân',longitude:315,utc:'2013-02-03T16:13:00Z',monthIndex:0},
  {year:2013,name:'Kinh Trập',longitude:345,utc:'2013-03-05T10:15:00Z',monthIndex:1},{year:2013,name:'Thanh Minh',longitude:15,utc:'2013-04-04T15:02:00Z',monthIndex:2},
  {year:2013,name:'Lập Hạ',longitude:45,utc:'2013-05-05T08:18:00Z',monthIndex:3},{year:2013,name:'Mang Chủng',longitude:75,utc:'2013-06-05T12:23:00Z',monthIndex:4},
  {year:2013,name:'Tiểu Thử',longitude:105,utc:'2013-07-06T22:35:00Z',monthIndex:5},{year:2013,name:'Lập Thu',longitude:135,utc:'2013-08-07T08:20:00Z',monthIndex:6},
  {year:2013,name:'Bạch Lộ',longitude:165,utc:'2013-09-07T11:16:00Z',monthIndex:7},{year:2013,name:'Hàn Lộ',longitude:195,utc:'2013-10-08T02:58:00Z',monthIndex:8},
  {year:2013,name:'Lập Đông',longitude:225,utc:'2013-11-07T06:14:00Z',monthIndex:9},{year:2013,name:'Đại Tuyết',longitude:255,utc:'2013-12-06T23:09:00Z',monthIndex:10},
  {year:2020,name:'Tiểu Hàn',longitude:285,utc:'2020-01-05T21:30:00Z',monthIndex:11},{year:2020,name:'Lập Xuân',longitude:315,utc:'2020-02-04T09:03:00Z',monthIndex:0},
  {year:2020,name:'Kinh Trập',longitude:345,utc:'2020-03-05T02:57:00Z',monthIndex:1},{year:2020,name:'Thanh Minh',longitude:15,utc:'2020-04-04T07:38:00Z',monthIndex:2},
  {year:2020,name:'Lập Hạ',longitude:45,utc:'2020-05-05T00:51:00Z',monthIndex:3},{year:2020,name:'Mang Chủng',longitude:75,utc:'2020-06-05T04:58:00Z',monthIndex:4},
  {year:2020,name:'Tiểu Thử',longitude:105,utc:'2020-07-06T15:14:00Z',monthIndex:5},{year:2020,name:'Lập Thu',longitude:135,utc:'2020-08-07T01:06:00Z',monthIndex:6},
  {year:2020,name:'Bạch Lộ',longitude:165,utc:'2020-09-07T04:08:00Z',monthIndex:7},{year:2020,name:'Hàn Lộ',longitude:195,utc:'2020-10-07T19:55:00Z',monthIndex:8},
  {year:2020,name:'Lập Đông',longitude:225,utc:'2020-11-06T23:14:00Z',monthIndex:9},{year:2020,name:'Đại Tuyết',longitude:255,utc:'2020-12-06T16:09:00Z',monthIndex:10}
];

/** NAOJ Japanese Calendar Database, Gregorian conversion with Eto of Day. */
export const SEXAGENARY_DAY_FIXTURES:readonly SexagenaryDayFixture[]=[
  {date:'1900-01-01',eto:'甲戌',index:10},{date:'1950-06-15',eto:'辛巳',index:17},
  {date:'1984-02-02',eto:'丙寅',index:2},{date:'2000-01-07',eto:'甲子',index:0},
  {date:'2026-07-21',eto:'丙申',index:32},{date:'2099-12-31',eto:'壬寅',index:38}
];

/** Portable invariants for UTC normalization, local pillars and the two public day-boundary conventions. */
export const TIMEZONE_BOUNDARY_FIXTURES:readonly TimezoneBoundaryFixture[]=[
  {id:'same-2000-vn',group:'same-utc-2000',localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,dayBoundary:'early-zi',utc:'2000-01-07T05:00:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'JIA-ZI',hour:'GENG-WU'},
  {id:'same-2000-utc',group:'same-utc-2000',localDateTime:'2000-01-07T05:00:00',timezoneOffsetMinutes:0,dayBoundary:'early-zi',utc:'2000-01-07T05:00:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'JIA-ZI',hour:'DING-MAO'},
  {id:'same-2000-ny',group:'same-utc-2000',localDateTime:'2000-01-07T00:00:00',timezoneOffsetMinutes:-300,dayBoundary:'early-zi',utc:'2000-01-07T05:00:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'JIA-ZI',hour:'JIA-ZI'},
  {id:'lichun-vn',group:'same-utc-lichun',localDateTime:'2026-02-04T03:30:00',timezoneOffsetMinutes:420,dayBoundary:'early-zi',utc:'2026-02-03T20:30:00.000Z',year:'BING-WU',month:'GENG-YIN',day:'JI-YOU',hour:'BING-YIN'},
  {id:'lichun-utc',group:'same-utc-lichun',localDateTime:'2026-02-03T20:30:00',timezoneOffsetMinutes:0,dayBoundary:'early-zi',utc:'2026-02-03T20:30:00.000Z',year:'BING-WU',month:'GENG-YIN',day:'WU-SHEN',hour:'REN-XU'},
  {id:'lichun-ny',group:'same-utc-lichun',localDateTime:'2026-02-03T15:30:00',timezoneOffsetMinutes:-300,dayBoundary:'early-zi',utc:'2026-02-03T20:30:00.000Z',year:'BING-WU',month:'GENG-YIN',day:'WU-SHEN',hour:'GENG-SHEN'},
  {id:'zi-before',group:'early-zi-boundary',localDateTime:'2000-01-07T22:59:00',timezoneOffsetMinutes:420,dayBoundary:'early-zi',utc:'2000-01-07T15:59:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'JIA-ZI',hour:'YI-HAI'},
  {id:'zi-after',group:'early-zi-boundary',localDateTime:'2000-01-07T23:00:00',timezoneOffsetMinutes:420,dayBoundary:'early-zi',utc:'2000-01-07T16:00:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'YI-CHOU',hour:'BING-ZI'},
  {id:'midnight-before',group:'midnight-boundary',localDateTime:'2000-01-07T23:59:00',timezoneOffsetMinutes:420,dayBoundary:'midnight',utc:'2000-01-07T16:59:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'JIA-ZI',hour:'JIA-ZI'},
  {id:'midnight-after',group:'midnight-boundary',localDateTime:'2000-01-08T00:00:00',timezoneOffsetMinutes:420,dayBoundary:'midnight',utc:'2000-01-07T17:00:00.000Z',year:'JI-MAO',month:'DING-CHOU',day:'YI-CHOU',hour:'BING-ZI'}
];
