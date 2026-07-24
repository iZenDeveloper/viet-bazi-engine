import { performance } from 'node:perf_hooks';
import { calculateBaziBatch } from '../dist/index.js';

function integerFlag(name, fallback, minimum, maximum) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer in ${minimum}..${maximum}`);
  }
  return value;
}

const count = integerFlag('--count', 10_000, 1, 1_000_000);
const batchSize = integerFlag('--batch-size', 1_000, 1, 1_000);
const warmup = integerFlag('--warmup', Math.min(250, count), 0, 10_000);

function inputAt(index) {
  const year = 1900 + (index % 201);
  const month = 1 + (index % 12);
  const day = 1 + (index % 28);
  const hour = index % 24;
  const minute = (index * 7) % 60;
  const pad = value => String(value).padStart(2, '0');
  return {
    localDateTime: `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`,
    timezoneOffsetMinutes: 420,
    asOfYear: 2026,
    gender: index % 2 === 0 ? 'male' : 'female',
    dayBoundary: index % 3 === 0 ? 'midnight' : 'early-zi',
    trueSolarTime: index % 2 === 0,
    ...(index % 2 === 0 ? { location: { city: index % 4 === 0 ? 'Hà Nội' : 'Hồ Chí Minh' } } : {})
  };
}

if (warmup > 0) calculateBaziBatch(Array.from({ length: warmup }, (_, index) => inputAt(index)));

let succeeded = 0;
let failed = 0;
let checksum = 0;
const startedAt = performance.now();
for (let offset = 0; offset < count; offset += batchSize) {
  const size = Math.min(batchSize, count - offset);
  const result = calculateBaziBatch(Array.from({ length: size }, (_, index) => inputAt(offset + index)));
  succeeded += result.summary.succeeded;
  failed += result.summary.failed;
  for (const item of result.items) {
    if (item.ok) {
      checksum += item.result.pillars.day.stem.index * 12 + item.result.pillars.day.branch.index;
    }
  }
}
const durationMs = performance.now() - startedAt;
const heapUsedMiB = process.memoryUsage().heapUsed / 1024 / 1024;

if (failed !== 0 || succeeded !== count) throw new Error(`Benchmark correctness failure: ${succeeded}/${count} succeeded`);

console.log(JSON.stringify({
  benchmarkVersion: '1.0',
  engineVersion: (await import('../dist/index.js')).ENGINE_VERSION,
  runtime: process.version,
  workload: { records: count, batchSize, warmup, deterministic: true },
  result: {
    succeeded,
    failed,
    durationMs: Number(durationMs.toFixed(2)),
    recordsPerSecond: Number((count / (durationMs / 1000)).toFixed(2)),
    heapUsedMiB: Number(heapUsedMiB.toFixed(2)),
    checksum
  }
}));
