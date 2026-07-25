import { describe,expect,it } from 'vitest';
import { handleMcpMessage,MCP_PROTOCOL_VERSION,MCP_TOOLS } from './mcp.js';

const birth={localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'};
const request=(id:number,method:string,params:Record<string,unknown>={})=>handleMcpMessage({jsonrpc:'2.0',id,method,params});

describe('offline MCP server',()=>{
  it('negotiates lifecycle and lists static structured tools',()=>{
    expect(request(1,'initialize',{protocolVersion:MCP_PROTOCOL_VERSION,capabilities:{},clientInfo:{name:'test',version:'1'}})).toMatchObject({result:{protocolVersion:MCP_PROTOCOL_VERSION,capabilities:{tools:{listChanged:false}}}});
    const listed=request(2,'tools/list') as {result:{tools:typeof MCP_TOOLS}};
    expect(listed.result.tools.map(tool=>tool.name)).toEqual(MCP_TOOLS.map(tool=>tool.name));
  });

  it('returns structured chart and prompt content',()=>{
    const chart=request(3,'tools/call',{name:'calculate_bazi',arguments:birth}) as {result:{structuredContent:{pillars:{day:{stem:{code:string}}}}}};
    expect(chart.result.structuredContent.pillars.day.stem.code).toBe('JIA');
    const prompt=request(4,'tools/call',{name:'create_grounded_interpretation_prompt',arguments:{birth,locale:'en',focus:'elements'}}) as {result:{structuredContent:{templateCode:string;focus:string}}};
    expect(prompt.result.structuredContent).toMatchObject({templateCode:'GROUNDED_BAZI_INTERPRETATION',focus:'elements'});
  });

  it('uses tool errors for invalid inputs and JSON-RPC errors for unknown methods',()=>{
    expect(request(5,'tools/call',{name:'calculate_bazi',arguments:{...birth,gender:'invalid'}})).toMatchObject({result:{isError:true,structuredContent:{code:'GENDER'}}});
    expect(request(6,'unknown')).toMatchObject({error:{code:-32601}});
    expect(handleMcpMessage({jsonrpc:'2.0',method:'notifications/initialized'})).toBeNull();
  });
});
