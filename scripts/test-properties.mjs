import assert from "node:assert/strict";
import { calculateBazi } from "../dist/engine.js";
import {
  findNextJie,
  solarLongitude,
  solarMonthIndex,
  solarTermBoundary,
} from "../dist/calendar.js";

function integerFlag(name, fallback, minimum, maximum) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer in ${minimum}..${maximum}`);
  }
  return value;
}

function mulberry32(seed) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const cases = integerFlag("--cases", 2_000, 1, 100_000);
const seed = integerFlag("--seed", 20_813_326, 0, 0xffffffff);
const random = mulberry32(seed);
const longitudes = [285, 315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255];
const models = ["legacy", "apparent", "ephemeris"];
let assertions = 0;

for (let index = 0; index < cases; index++) {
  const year = 1600 + Math.floor(random() * 801);
  const month = Math.floor(random() * 12);
  const day = 1 + Math.floor(random() * 28);
  const hour = Math.floor(random() * 24);
  const minute = Math.floor(random() * 60);
  const utc = new Date(Date.UTC(year, month, day, hour, minute));
  const model = models[Math.floor(random() * models.length)];

  const longitude = solarLongitude(utc, model);
  assert.ok(Number.isFinite(longitude) && longitude >= 0 && longitude < 360);
  assert.ok(Number.isInteger(solarMonthIndex(utc, model)));
  assert.ok(solarMonthIndex(utc, model) >= 0 && solarMonthIndex(utc, model) < 12);
  assertions += 3;

  if (index % 20 === 0) {
    const previous = findNextJie(utc, -1, model);
    const next = findNextJie(utc, 1, model);
    assert.ok(previous.getTime() < utc.getTime());
    assert.ok(next.getTime() > utc.getTime());
    assert.ok(utc.getTime() - previous.getTime() < 40 * 86400000);
    assert.ok(next.getTime() - utc.getTime() < 40 * 86400000);
    assertions += 4;
  }

  if (index % 25 === 0) {
    const slot = Math.floor(random() * 12);
    const boundary = solarTermBoundary(year, longitudes[slot], "ephemeris");
    const expectedAfter = (slot + 11) % 12;
    assert.equal(solarMonthIndex(new Date(boundary.getTime() - 2 * 60000), "ephemeris"), (expectedAfter + 11) % 12);
    assert.equal(solarMonthIndex(new Date(boundary.getTime() + 2 * 60000), "ephemeris"), expectedAfter);
    assertions += 2;
  }

  if (index % 50 === 0) {
    const pad = value => String(value).padStart(2, "0");
    const input = {
      localDateTime: `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`,
      timezoneOffsetMinutes: 420,
      asOfYear: 2026,
      gender: index % 2 === 0 ? "male" : "female",
      solarTermModel: model,
    };
    const first = calculateBazi(input);
    const second = calculateBazi(input);
    assert.deepEqual(first, second);
    assert.ok(Math.abs(first.elements.reduce((sum, item) => sum + item.percent, 0) - 100) <= 0.2);
    assertions += 2;
  }
}

console.log(JSON.stringify({
  layer: "property",
  seed,
  cases,
  assertions,
  reproducible: true,
}));
