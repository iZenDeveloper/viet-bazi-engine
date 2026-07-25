import { describe,expect,it } from 'vitest';
import { calculateBazi } from './engine.js';
import { createInterpretationPrompt } from './prompts.js';
import { createInterpretationPromptFromJson } from './json.js';

const input={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male' as const};

describe('grounded interpretation prompts',()=>{
  it('is deterministic and keeps stable codes with evidence',()=>{
    const chart=calculateBazi(input),a=createInterpretationPrompt(chart,{locale:'en',focus:'elements'}),b=createInterpretationPrompt(chart,{locale:'en',focus:'elements'});
    expect(a).toEqual(b);
    expect(a.templateCode).toBe('GROUNDED_BAZI_INTERPRETATION');
    expect(a.grounding.facts.facts.every(fact=>fact.code.length>0&&fact.evidence.length>0)).toBe(true);
    expect(a.messages[0].content).toContain('do not recalculate or invent facts');
    expect(a.messages[1].content).toContain('"stemCode"');
  });

  it('has JSON bridge parity and cultural-reference guardrails',()=>{
    const direct=createInterpretationPrompt(calculateBazi(input),{locale:'vi',focus:'career'});
    const bridged=createInterpretationPromptFromJson(JSON.stringify(input),'vi','career');
    expect(bridged).toEqual(direct);
    expect(direct.messages[0].content).toContain('Không đưa lời khuyên y tế, pháp lý, tài chính');
    expect(direct.grounding.audit.rules.some(rule=>rule.ruleCode==='TEN_GODS_DAY_MASTER')).toBe(true);
  });
});
