import { describe, expect, it } from "vitest";
import { Solar } from "lunar-typescript";
import { calculateBazi } from "./engine.js";
import type { Pillar } from "./types.js";

const STEM_CODES = [
  "JIA",
  "YI",
  "BING",
  "DING",
  "WU",
  "JI",
  "GENG",
  "XIN",
  "REN",
  "GUI",
];
const STEM_CHARACTERS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCH_CODES = [
  "ZI",
  "CHOU",
  "YIN",
  "MAO",
  "CHEN",
  "SI",
  "WU",
  "WEI",
  "SHEN",
  "YOU",
  "XU",
  "HAI",
];
const BRANCH_CHARACTERS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const pad = (value: number) => String(value).padStart(2, "0");
const pillarText = (pillar: Pillar) =>
  `${STEM_CHARACTERS[STEM_CODES.indexOf(pillar.stem.code)]}${BRANCH_CHARACTERS[BRANCH_CODES.indexOf(pillar.branch.code)]}`;

interface Mismatch {
  localDateTime: string;
  engine: string[];
  oracle: string[];
}

const compare = (
  year: number,
  month: number,
  day: number,
  hour: number,
  mismatches: Mismatch[],
): boolean => {
  const localDateTime = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:00:00`;
  const result = calculateBazi({
    localDateTime,
    timezoneOffsetMinutes: 480,
    asOfYear: year,
    gender: "male",
    dayBoundary: "midnight",
    solarTermModel: "apparent",
  });
  const oracle = Solar.fromYmdHms(year, month, day, hour, 0, 0)
    .getLunar()
    .getEightChar();
  const enginePillars = [
    pillarText(result.pillars.year),
    pillarText(result.pillars.month),
    pillarText(result.pillars.day),
    pillarText(result.pillars.hour),
  ];
  const oraclePillars = [
    oracle.getYear(),
    oracle.getMonth(),
    oracle.getDay(),
    oracle.getTime(),
  ];
  const nearSolarTerm =
    result.normalized.solarTerms.nearestDistanceMinutes <= 40;
  const engineComparable = nearSolarTerm
    ? enginePillars.slice(2)
    : enginePillars;
  const oracleComparable = nearSolarTerm
    ? oraclePillars.slice(2)
    : oraclePillars;
  if (
    engineComparable.join(",") !== oracleComparable.join(",") &&
    mismatches.length < 20
  ) {
    mismatches.push({
      localDateTime,
      engine: enginePillars,
      oracle: oraclePillars,
    });
  }
  return nearSolarTerm;
};

describe("large independent BaZi differential corpus", () => {
  it(
    "matches lunar-typescript across dates and all twelve two-hour branches",
    () => {
      const mismatches: Mismatch[] = [];
      let cases = 0;
      let nearSolarTermCases = 0;
      const start = new Date(Date.UTC(1900, 0, 1, 12));
      const end = new Date(Date.UTC(2100, 11, 31, 12));

      for (
        const date = new Date(start);
        date <= end;
        date.setUTCDate(date.getUTCDate() + 13)
      ) {
        if (compare(
          date.getUTCFullYear(),
          date.getUTCMonth() + 1,
          date.getUTCDate(),
          12,
          mismatches,
        )) nearSolarTermCases++;
        cases++;
      }

      for (
        const date = new Date(start);
        date <= end;
        date.setUTCDate(date.getUTCDate() + 97)
      ) {
        for (let hour = 0; hour < 24; hour += 2) {
          if (compare(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            hour,
            mismatches,
          )) nearSolarTermCases++;
          cases++;
        }
      }

      expect(cases).toBeGreaterThan(14_000);
      expect(nearSolarTermCases).toBeGreaterThan(0);
      expect(mismatches).toEqual([]);
    },
    30_000,
  );
});
