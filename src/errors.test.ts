import { describe,expect,it } from 'vitest';
import { BaziError,toBaziErrorPayload } from './errors.js';
import { calculateBaziBatch,calculateBaziFromJson,validateBirthInput } from './json.js';

describe('stable error contract',()=>{
  it('keeps codes stable while localizing messages',()=>{
    let caught:unknown;
    try{validateBirthInput({localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'other'});}catch(error){caught=error;}
    expect(caught).toBeInstanceOf(BaziError);
    expect(toBaziErrorPayload(caught)).toEqual({name:'TypeError',code:'GENDER',message:'gender phải là male hoặc female'});
    expect(toBaziErrorPayload(caught,'en')).toEqual({name:'TypeError',code:'GENDER',message:'gender must be male or female'});
  });
  it('codes malformed JSON and isolated batch failures',()=>{
    expect(()=>calculateBaziFromJson('{bad')).toThrowError(expect.objectContaining({code:'INVALID_JSON'}));
    const batch=calculateBaziBatch([{localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'other'}]);
    expect(batch.items[0]).toMatchObject({ok:false,error:{name:'TypeError',code:'GENDER'}});
  });
});
