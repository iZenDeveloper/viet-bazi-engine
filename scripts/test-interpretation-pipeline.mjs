import { readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import { runInterpretationPipeline } from '../examples/interpretation-pipeline.mjs';

const birth={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'};
const calls=[];
const generate=async input=>{calls.push(input);return {provider:'test-provider',model:'test-model-v1',text:'Grounded interpretation [DAY_MASTER | pillars.day.stem].'};};
const first=await runInterpretationPipeline({birth,locale:'en',focus:'elements',generate});
const second=await runInterpretationPipeline({birth,locale:'en',focus:'elements',generate:async()=>({provider:'other',model:'other-v1',text:'Different prose.'})});
if(calls.length!==1||calls[0].messages.length!==2||'chart' in calls[0].metadata||'birth' in calls[0].metadata)throw new Error('Provider boundary leaked raw calculation input');
if(first.calculation.sha256!==second.calculation.sha256||JSON.stringify(first.calculation.chart)!==JSON.stringify(second.calculation.chart))throw new Error('Generated prose changed deterministic calculation');
if(first.generation.text===second.generation.text)throw new Error('Generation stage was not isolated');
const schema=JSON.parse(await readFile('examples/interpretation-envelope.schema.json','utf8')),validate=new Ajv2020({strict:false}).compile(schema);
if(!validate(first))throw new Error(`Interpretation envelope schema mismatch: ${JSON.stringify(validate.errors)}`);
console.log(JSON.stringify({providerBoundary:true,deterministicCalculation:true,generationIsolated:true,envelopeSchema:true,sha256:first.calculation.sha256}));
