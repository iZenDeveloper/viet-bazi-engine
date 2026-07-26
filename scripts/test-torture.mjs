import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { calculateBaziBatch } from "../dist/index.js";

function integerFlag(name, fallback, minimum, maximum) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer in ${minimum}..${maximum}`);
  }
  return value;
}

const count = integerFlag("--count", 25_000, 1, 1_000_000);
const models = ["ephemeris", "apparent", "legacy"];
const pad = value => String(value).padStart(2, "0");
const inputAt = index => {
  const year = 1600 + (index * 37) % 801;
  const month = 1 + index % 12;
  const day = 1 + (index * 11) % 28;
  const hour = index % 24;
  const minute = (index * 17) % 60;
  return {
    localDateTime: `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`,
    timezoneOffsetMinutes: [-480, 0, 330, 420, 540][index % 5],
    asOfYear: 2026,
    gender: index % 2 === 0 ? "male" : "female",
    dayBoundary: index % 4 === 0 ? "midnight" : "early-zi",
    solarTermModel: models[index % models.length],
  };
};

function runPass() {
  let checksum = 0;
  let succeeded = 0;
  for (let offset = 0; offset < count; offset += 1_000) {
    const size = Math.min(1_000, count - offset);
    const result = calculateBaziBatch(Array.from({ length: size }, (_, index) => inputAt(offset + index)));
    assert.equal(result.summary.failed, 0);
    succeeded += result.summary.succeeded;
    for (const item of result.items) {
      if (item.ok) {
        checksum = (checksum + item.result.pillars.year.stem.index * 1729
          + item.result.pillars.month.branch.index * 127
          + item.result.pillars.day.stem.index * 13
          + item.result.pillars.hour.branch.index) >>> 0;
      }
    }
  }
  assert.equal(succeeded, count);
  return checksum;
}

const startedAt = performance.now();
const firstChecksum = runPass();
const secondChecksum = runPass();
assert.equal(secondChecksum, firstChecksum);

console.log(JSON.stringify({
  layer: "torture",
  recordsPerPass: count,
  passes: 2,
  totalCalculations: count * 2,
  checksum: firstChecksum,
  deterministic: true,
  durationMs: Number((performance.now() - startedAt).toFixed(2)),
  heapUsedMiB: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
}));
