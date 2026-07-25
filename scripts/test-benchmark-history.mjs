import { readFile } from 'node:fs/promises';

const history=JSON.parse(await readFile('benchmarks/history.json','utf8'));
if(history.formatVersion!==1||!Array.isArray(history.runs)||history.runs.length<1)throw new Error('Benchmark history is empty or invalid');

for(const [index,run] of history.runs.entries()){
  if(!/^\d{4}-\d{2}-\d{2}T/.test(run.capturedAt)||!/^[0-9a-f]{40}$/.test(run.sourceCommit)||!run.environment?.node||!run.environment?.cpu)throw new Error(`Benchmark run ${index} lacks provenance`);
  if(run.samples<3||run.workload?.deterministic!==true||run.correctness?.succeeded!==run.workload?.records||run.correctness?.failed!==0)throw new Error(`Benchmark run ${index} violates correctness contract`);
  for(const metric of ['durationMs','recordsPerSecond','heapUsedMiB']){
    const value=run.metrics?.[metric];
    if(!value||![value.min,value.median,value.max].every(Number.isFinite)||value.min>value.median||value.median>value.max)throw new Error(`Benchmark run ${index} has invalid ${metric}`);
  }
}

console.log(JSON.stringify({benchmarkHistory:true,referenceRuns:history.runs.length,latestEngineVersion:history.runs.at(-1).engineVersion}));
