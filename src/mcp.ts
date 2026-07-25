import { analyzeBirthTimeSensitivity } from './sensitivity.js';
import { calculateBazi } from './engine.js';
import { compareBirthInputs } from './compatibility.js';
import { createInterpretationPrompt } from './prompts.js';
import { getEngineCapabilities } from './capabilities.js';
import { toBaziErrorPayload } from './errors.js';
import { validateBirthInput } from './json.js';
import type { InterpretationFocus } from './types.js';

export const MCP_PROTOCOL_VERSION='2025-06-18' as const;

type JsonRpcId=string|number;
interface JsonRpcRequest {jsonrpc:'2.0';id?:JsonRpcId;method:string;params?:Record<string,unknown>}
interface JsonRpcResponse {jsonrpc:'2.0';id:JsonRpcId|null;result?:Record<string,unknown>;error?:{code:number;message:string;data?:unknown}}

const locationSchema={type:'object',additionalProperties:false,properties:{city:{type:'string',minLength:1},latitude:{type:'number',minimum:-90,maximum:90},longitude:{type:'number',minimum:-180,maximum:180}},dependentRequired:{latitude:['longitude'],longitude:['latitude']},anyOf:[{required:['city']},{required:['latitude','longitude']}]} as const;
const birthSchema={type:'object',additionalProperties:false,required:['localDateTime','timezoneOffsetMinutes','asOfYear','gender'],properties:{localDateTime:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(?::\\d{2})?$'},timezoneOffsetMinutes:{type:'integer',minimum:-840,maximum:840},asOfYear:{type:'integer',minimum:1600,maximum:2400},gender:{enum:['male','female']},trueSolarTime:{type:'boolean'},dayBoundary:{enum:['early-zi','midnight']},solarTermModel:{enum:['legacy','apparent']},location:locationSchema}} as const;
const focusSchema={enum:['overview','elements','career','relationships','timing']} as const;

export const MCP_TOOLS=[
  {name:'get_engine_capabilities',title:'Get engine capabilities',description:'Return offline engine versions, feature codes, limits and schema IDs.',inputSchema:{type:'object',additionalProperties:false}},
  {name:'calculate_bazi',title:'Calculate a Bazi chart',description:'Calculate a deterministic Four Pillars chart from local civil birth data.',inputSchema:birthSchema},
  {name:'analyze_birth_time_sensitivity',title:'Analyze birth-time sensitivity',description:'Recalculate a bounded time window and report pillar changes near boundaries.',inputSchema:{type:'object',additionalProperties:false,required:['birth'],properties:{birth:birthSchema,windowMinutes:{type:'integer',minimum:1,maximum:720,default:120},stepMinutes:{type:'integer',minimum:1,maximum:720,default:5}}}},
  {name:'compare_bazi',title:'Compare two Bazi charts',description:'Return transparent compatibility factors and evidence for two birth inputs.',inputSchema:{type:'object',additionalProperties:false,required:['first','second'],properties:{first:birthSchema,second:birthSchema}}},
  {name:'create_grounded_interpretation_prompt',title:'Create grounded interpretation prompt',description:'Create provider-neutral LLM messages grounded in stable codes, evidence, methodology and audit rules.',inputSchema:{type:'object',additionalProperties:false,required:['birth'],properties:{birth:birthSchema,locale:{enum:['vi','en'],default:'vi'},focus:{...focusSchema,default:'overview'}}}}
] as const;

const ok=(id:JsonRpcId,result:Record<string,unknown>):JsonRpcResponse=>({jsonrpc:'2.0',id,result});
const fail=(id:JsonRpcId|null,code:number,message:string,data?:unknown):JsonRpcResponse=>({jsonrpc:'2.0',id,error:{code,message,...(data===undefined?{}:{data})}});
const structured=(value:unknown):Record<string,unknown>=>({content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value as Record<string,unknown>,isError:false});
const object=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};

function callTool(name:string,args:Record<string,unknown>):Record<string,unknown> {
  if(name==='get_engine_capabilities')return structured(getEngineCapabilities());
  if(name==='calculate_bazi')return structured(calculateBazi(validateBirthInput(args)));
  if(name==='analyze_birth_time_sensitivity'){const birth=validateBirthInput(args.birth),window=args.windowMinutes??120,step=args.stepMinutes??5;if(typeof window!=='number'||typeof step!=='number')throw new TypeError('windowMinutes and stepMinutes must be numbers');return structured(analyzeBirthTimeSensitivity(birth,window,step));}
  if(name==='compare_bazi')return structured(compareBirthInputs(validateBirthInput(args.first),validateBirthInput(args.second)));
  if(name==='create_grounded_interpretation_prompt'){const locale=args.locale??'vi',focus=args.focus??'overview';if(locale!=='vi'&&locale!=='en')throw new RangeError('locale must be vi or en');if(!focusSchema.enum.includes(focus as InterpretationFocus))throw new RangeError('Unsupported interpretation focus');return structured(createInterpretationPrompt(calculateBazi(validateBirthInput(args.birth)),{locale,focus:focus as InterpretationFocus}));}
  throw new RangeError(`Unknown tool: ${name}`);
}

/** Handle one MCP JSON-RPC message. Notifications intentionally return null. */
export function handleMcpMessage(message:unknown):JsonRpcResponse|null {
  if(!message||typeof message!=='object'||Array.isArray(message))return fail(null,-32600,'Invalid Request');
  const request=message as JsonRpcRequest;
  if(request.jsonrpc!=='2.0'||typeof request.method!=='string')return fail(request.id??null,-32600,'Invalid Request');
  if(request.id===undefined)return null;
  if(request.method==='initialize')return ok(request.id,{protocolVersion:MCP_PROTOCOL_VERSION,capabilities:{tools:{listChanged:false}},serverInfo:{name:'viet-bazi-engine',title:'Viet Bazi Engine',version:getEngineCapabilities().engineVersion},instructions:'Offline deterministic Bazi calculations. Results are cultural-reference data; preserve warnings and stable evidence codes.'});
  if(request.method==='ping')return ok(request.id,{});
  if(request.method==='tools/list')return ok(request.id,{tools:MCP_TOOLS});
  if(request.method==='tools/call'){
    const params=object(request.params),name=params.name,args=object(params.arguments);
    if(typeof name!=='string')return fail(request.id,-32602,'Invalid tools/call parameters');
    try{return ok(request.id,callTool(name,args));}catch(error){const payload=toBaziErrorPayload(error,'en');return ok(request.id,{content:[{type:'text',text:JSON.stringify(payload)}],structuredContent:payload,isError:true});}
  }
  return fail(request.id,-32601,'Method not found');
}
