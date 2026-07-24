import { describe,expect,it } from 'vitest';
import { BaziError,toBaziErrorPayload } from './errors.js';
import { calculateBaziBatch,calculateBaziFromJson,validateBirthInput } from './json.js';
import { calculateAnnualTimeline,calculateBazi } from './engine.js';
import { analyzeBirthTimeSensitivity } from './sensitivity.js';
import { localizeAnnualTimeline } from './localization-report.js';
import { renderBaziSvg } from './svg.js';
import { loadWasmCalendar } from './wasm.js';

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
  it('codes timeline, sensitivity and SVG validation',()=>{
    const input={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male' as const},chart=calculateBazi(input);
    expect(()=>calculateAnnualTimeline(chart,2027,2025)).toThrowError(expect.objectContaining({code:'TIMELINE_RANGE'}));
    expect(()=>calculateAnnualTimeline(chart,1600,1801)).toThrowError(expect.objectContaining({code:'TIMELINE_LIMIT'}));
    expect(()=>localizeAnnualTimeline([])).toThrowError(expect.objectContaining({code:'TIMELINE_EMPTY'}));
    expect(()=>analyzeBirthTimeSensitivity(input,0,1)).toThrowError(expect.objectContaining({code:'SENSITIVITY_WINDOW'}));
    expect(()=>analyzeBirthTimeSensitivity(input,10,11)).toThrowError(expect.objectContaining({code:'SENSITIVITY_STEP'}));
    expect(()=>analyzeBirthTimeSensitivity(input,720,1)).toThrowError(expect.objectContaining({code:'SENSITIVITY_LIMIT'}));
    expect(()=>renderBaziSvg(chart,{width:0})).toThrowError(expect.objectContaining({code:'SVG_WIDTH'}));
    expect(()=>renderBaziSvg(chart,{locale:'fr' as 'vi'})).toThrowError(expect.objectContaining({code:'SVG_LOCALE'}));
  });
  it('codes invalid WASM modules',async()=>{
    await expect(loadWasmCalendar(new Uint8Array([0,1,2,3]))).rejects.toMatchObject({code:'WASM_INSTANTIATION'});
  });
});
