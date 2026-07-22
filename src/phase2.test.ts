import { describe,expect,it } from 'vitest';
import { calculateBazi } from './engine.js';
import { compareBaziCharts,compareBirthInputs } from './compatibility.js';
import { compareBirthInputsFromJson,renderBaziSvgFromJson } from './json.js';
import { renderBaziSvg } from './svg.js';

const a=calculateBazi({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'female'});
const b=calculateBazi({localDateTime:'1988-11-02T08:10:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'});

describe('phase 2 building blocks',()=>{
  it('returns a bounded, explainable compatibility score',()=>{const r=compareBaziCharts(a,b);expect(r.schemaVersion).toBe('1.0');expect(r.score).toBeGreaterThanOrEqual(0);expect(r.score).toBeLessThanOrEqual(100);expect(r.factors.reduce((n,f)=>n+f.score,0)).toBe(r.score);expect(r.metadata.methodology).toBe('heuristic-v1');});
  it('compares typed and JSON birth-input pairs',()=>{const inputs=[a.input,b.input] as const;expect(compareBirthInputs(...inputs)).toEqual(compareBaziCharts(a,b));expect(compareBirthInputsFromJson(JSON.stringify(inputs))).toEqual(compareBaziCharts(a,b));expect(()=>compareBirthInputsFromJson(JSON.stringify([a.input]))).toThrow('đúng 2');});
  it('renders standalone accessible SVG and escapes title',()=>{const svg=renderBaziSvg(a,{title:'A < B & C'});expect(svg).toContain('<svg');expect(svg).toContain('A &lt; B &amp; C');expect(svg).toContain('aria-labelledby');expect(svg).not.toContain('A < B');});
  it('renders a fully localized English SVG view',()=>{const svg=renderBaziSvg(a,{locale:'en'});expect(svg).toContain('Bazi Chart');expect(svg).toContain('Day Master');expect(svg).toContain('Four Pillars');expect(svg).not.toContain('Nhật Chủ');});
  it('renders SVG from an untyped JSON boundary',()=>{const svg=renderBaziSvgFromJson(JSON.stringify(a.input),{locale:'en',title:'A < B',showHiddenStems:false});expect(svg).toContain('A &lt; B');expect(svg).not.toContain('class="hidden"');});
});
