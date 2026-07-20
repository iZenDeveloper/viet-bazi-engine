import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe,expect,it } from 'vitest';
import { calculateBazi } from './engine.js';
import { calculateBaziBatch } from './json.js';
import { analyzeBirthTimeSensitivity } from './sensitivity.js';
import { BAZI_BATCH_INPUT_JSON_SCHEMA,BAZI_BATCH_RESULT_JSON_SCHEMA,BAZI_RESULT_JSON_SCHEMA,BIRTH_INPUT_JSON_SCHEMA,BIRTH_TIME_SENSITIVITY_JSON_SCHEMA } from './schema.js';

describe('public JSON schemas',()=>{
  const ajv=new Ajv2020({allErrors:true,strict:false});addFormats(ajv);
  it('accepts a valid input and rejects incomplete context or location',()=>{const validate=ajv.compile(BIRTH_INPUT_JSON_SCHEMA),base={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'};expect(validate(base)).toBe(true);expect(validate({...base,asOfYear:undefined})).toBe(false);expect(validate({...base,trueSolarTime:true})).toBe(false);expect(validate({...base,location:{city:'Hà Nội',latitude:21}})).toBe(false);expect(validate({...base,unknown:true})).toBe(false);});
  it('validates a complete engine result',()=>{const result=calculateBazi({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'female',trueSolarTime:true,location:{city:'Hà Nội'}});const validate=ajv.compile(BAZI_RESULT_JSON_SCHEMA);expect(validate(result),JSON.stringify(validate.errors)).toBe(true);});
  it('validates batch input and both output item variants',()=>{const valid={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'},batchAjv=new Ajv2020({allErrors:true,strict:false});addFormats(batchAjv);batchAjv.addSchema(BIRTH_INPUT_JSON_SCHEMA).addSchema(BAZI_RESULT_JSON_SCHEMA);const validateInput=batchAjv.compile(BAZI_BATCH_INPUT_JSON_SCHEMA),validateResult=batchAjv.compile(BAZI_BATCH_RESULT_JSON_SCHEMA);expect(validateInput([valid])).toBe(true);expect(validateInput(Array.from({length:1001},()=>valid))).toBe(false);const result=calculateBaziBatch([valid,{...valid,gender:'invalid'}]);expect(validateResult(result),JSON.stringify(validateResult.errors)).toBe(true);const malformed={...result,items:[{index:0,ok:true,error:{name:'Error',message:'mixed shape'}}]};expect(validateResult(malformed)).toBe(false);});
  it('validates stable and changing sensitivity contracts',()=>{const validate=ajv.compile(BIRTH_TIME_SENSITIVITY_JSON_SCHEMA),input={localDateTime:'2026-02-04T03:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male' as const},changing=analyzeBirthTimeSensitivity(input,15,5),stable=analyzeBirthTimeSensitivity({...input,localDateTime:'2000-01-07T12:30:00'},20,5);expect(validate(changing),JSON.stringify(validate.errors)).toBe(true);expect(validate(stable),JSON.stringify(validate.errors)).toBe(true);expect(validate({...stable,stable:false})).toBe(false);expect(validate({...changing,variants:[{...changing.variants[0],pillars:{...changing.variants[0]?.pillars,hour:'INVALID'}}]})).toBe(false);});
});
