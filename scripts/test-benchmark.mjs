import { execFileSync } from 'node:child_process';

const output = execFileSync(process.execPath, [
  'scripts/benchmark-batch.mjs',
  '--count', '25',
  '--batch-size', '10',
  '--warmup', '2'
], { encoding: 'utf8' });
const report = JSON.parse(output);

if (report.benchmarkVersion !== '1.0') throw new Error('Unexpected benchmark schema');
if (report.engineVersion !== '0.45.0') throw new Error(`Unexpected engine version: ${report.engineVersion}`);
if (report.workload.records !== 25 || report.workload.batchSize !== 10 || !report.workload.deterministic) throw new Error('Unexpected workload metadata');
if (report.result.succeeded !== 25 || report.result.failed !== 0) throw new Error('Benchmark did not calculate every record');
for (const metric of ['durationMs', 'recordsPerSecond', 'heapUsedMiB', 'checksum']) {
  if (!Number.isFinite(report.result[metric]) || report.result[metric] < 0) throw new Error(`Invalid metric: ${metric}`);
}

console.log(JSON.stringify({ benchmarkContract: true, records: report.result.succeeded }));
