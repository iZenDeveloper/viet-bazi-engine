import { spawn } from 'node:child_process';
import { once } from 'node:events';

const child=spawn(process.execPath,['dist/mcp-server.js'],{stdio:['pipe','pipe','pipe']});
let output='',errors='';child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>errors+=chunk);
const messages=[
  {jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'smoke',version:'1.0.0'}}},
  {jsonrpc:'2.0',method:'notifications/initialized'},
  {jsonrpc:'2.0',id:2,method:'tools/list',params:{}},
  {jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'calculate_bazi',arguments:{localDateTime:'2000-01-07T12:00:00',timezoneOffsetMinutes:420,asOfYear:2026,gender:'male'}}}
];
child.stdin.end(messages.map(message=>JSON.stringify(message)).join('\n')+'\n');
const [code]=await once(child,'close');if(code!==0)throw new Error(`MCP process failed: ${errors}`);
const responses=output.trim().split('\n').map(line=>JSON.parse(line));
if(responses.length!==3||responses[0].result.protocolVersion!=='2025-06-18'||responses[1].result.tools.length!==5||responses[2].result.structuredContent.pillars.day.stem.code!=='JIA')throw new Error(`MCP smoke mismatch: ${output}`);
console.log(JSON.stringify({stdio:true,protocolVersion:'2025-06-18',tools:responses[1].result.tools.length,structuredContent:true,stdoutClean:!errors}));
