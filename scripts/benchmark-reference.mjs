import { execFileSync } from 'node:child_process';
import { cpus, freemem, platform, release, totalmem } from 'node:os';

function integerFlag(name,fallback,minimum,maximum){
  const index=process.argv.indexOf(name);
  if(index<0)return fallback;
  const value=Number(process.argv[index+1]);
  if(!Number.isInteger(value)||value<minimum||value>maximum)throw new RangeError(`${name} must be an integer in ${minimum}..${maximum}`);
  return value;
}

const samples=integerFlag('--samples',5,3,21);
const records=integerFlag('--count',10_000,1,1_000_000);
const batchSize=integerFlag('--batch-size',1_000,1,1_000);
const warmup=integerFlag('--warmup',250,0,10_000);
const results=[];

for(let sample=0;sample<samples;sample++){
  const output=execFileSync(process.execPath,[
    'scripts/benchmark-batch.mjs',
    '--count',String(records),
    '--batch-size',String(batchSize),
    '--warmup',String(warmup)
  ],{encoding:'utf8'});
  results.push(JSON.parse(output));
}

const first=results[0];
if(results.some(item=>item.engineVersion!==first.engineVersion||item.result.checksum!==first.result.checksum||item.result.succeeded!==records)){
  throw new Error('Reference samples disagree on engine, checksum or record count');
}

const ordered=key=>results.map(item=>item.result[key]).sort((a,b)=>a-b);
const summary=key=>{
  const values=ordered(key),middle=Math.floor(values.length/2);
  return {min:values[0],median:values[middle],max:values.at(-1)};
};
const cpu=cpus()[0];

console.log(JSON.stringify({
  formatVersion:1,
  engineVersion:first.engineVersion,
  benchmarkVersion:first.benchmarkVersion,
  capturedAt:new Date().toISOString(),
  environment:{
    platform:platform(),
    osRelease:release(),
    architecture:process.arch,
    node:process.version,
    cpu:cpu?.model??'unknown',
    logicalCpus:cpus().length,
    totalMemoryMiB:Math.round(totalmem()/1024/1024),
    freeMemoryMiBAtCapture:Math.round(freemem()/1024/1024)
  },
  workload:first.workload,
  samples,
  correctness:{succeeded:records,failed:0,checksum:first.result.checksum},
  metrics:{
    durationMs:summary('durationMs'),
    recordsPerSecond:summary('recordsPerSecond'),
    heapUsedMiB:summary('heapUsedMiB')
  }
}));
