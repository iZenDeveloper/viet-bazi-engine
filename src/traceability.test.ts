import { describe,expect,it } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import { calculateBazi } from './engine.js';
import { BAZI_AUDIT_REPORT_JSON_SCHEMA } from './schema.js';
import { createBaziAuditReport } from './traceability.js';

describe('calculation traceability',()=>{
  it('maps stable rules to chart paths and validates against its schema',()=>{
    const chart=calculateBazi({localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'});
    const report=createBaziAuditReport(chart);
    expect(report.rules.map(x=>x.ruleCode)).toContain('LUCK_GENDER_YEAR_POLARITY');
    expect(report.rules.find(x=>x.ruleCode==='ELEMENT_WEIGHTED_BALANCE')?.outputPaths).toEqual(['elements']);
    expect(new Ajv2020({strict:false}).compile(BAZI_AUDIT_REPORT_JSON_SCHEMA)(report)).toBe(true);
  });
  it('records true-solar-time processing and boundary warnings only when applicable',()=>{
    const chart=calculateBazi({localDateTime:'2026-02-04T03:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male',trueSolarTime:true,location:{city:'Hà Nội'}});
    const report=createBaziAuditReport(chart);
    expect(report.rules.some(x=>x.ruleCode==='TRUE_SOLAR_TIME_LONGITUDE_EOT')).toBe(true);
    expect(report.warnings.some(x=>x.includes('ranh Tiết khí'))).toBe(true);
    expect(createBaziAuditReport(chart)).toEqual(report);
  });
});
