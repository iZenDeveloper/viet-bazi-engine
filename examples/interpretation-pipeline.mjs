import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { calculateBazi,createInterpretationPrompt } from '../dist/index.js';

const stableHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * Provider-neutral example: deterministic calculation stays isolated from generated prose.
 * The provider receives grounded messages and immutable metadata, never a mutation callback.
 */
export async function runInterpretationPipeline({birth,locale='vi',focus='overview',generate}) {
  if(typeof generate!=='function')throw new TypeError('generate must be a function');
  const chart=calculateBazi(birth);
  const prompt=createInterpretationPrompt(chart,{locale,focus});
  const calculationHash=stableHash(chart);
  const generated=await generate({messages:structuredClone(prompt.messages),metadata:Object.freeze({engineVersion:chart.metadata.methodology.engineVersion,templateCode:prompt.templateCode,templateVersion:prompt.templateVersion,calculationHash})});
  if(!generated||typeof generated!=='object'||typeof generated.text!=='string'||!generated.text.trim()||typeof generated.provider!=='string'||typeof generated.model!=='string')throw new TypeError('generate must return non-empty text, provider and model strings');
  return {
    schemaVersion:'1.0',
    calculation:{engineVersion:chart.metadata.methodology.engineVersion,chartSchemaVersion:chart.schemaVersion,sha256:calculationHash,chart},
    prompt:{templateCode:prompt.templateCode,templateVersion:prompt.templateVersion,locale:prompt.locale,focus:prompt.focus},
    generation:{provider:generated.provider,model:generated.model,text:generated.text},
    warnings:[...prompt.grounding.summary.warnings]
  };
}

export const offlineMockProvider=async ({messages,metadata})=>({
  provider:'offline-mock',
  model:'deterministic-example-v1',
  text:`Mock interpretation from ${messages.length} grounded messages. Engine ${metadata.engineVersion}; calculation ${metadata.calculationHash.slice(0,12)}.`
});

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const result=await runInterpretationPipeline({
    birth:{localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'female'},
    locale:'vi',
    focus:'overview',
    generate:offlineMockProvider
  });
  process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
}
