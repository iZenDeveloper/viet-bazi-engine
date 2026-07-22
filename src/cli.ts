#!/usr/bin/env node
import { analyzeBirthTimeSensitivityFromJson,calculateBaziBatchFromJson,calculateBaziFromJson,compareBirthInputsFromJson } from './json.js';
import { calculateAnnualTimeline } from './engine.js';
import { getEngineCapabilities } from './capabilities.js';

declare const process:{argv:string[];stdin:{setEncoding(encoding:string):void;on(event:'data',listener:(chunk:string)=>void):void;on(event:'end',listener:()=>void):void;on(event:'error',listener:(error:Error)=>void):void;destroy(error?:Error):void};stdout:{write(s:string):void};stderr:{write(s:string):void};exitCode:number};
const MAX_STDIN_BYTES=10*1024*1024;
function readStdin():Promise<string>{return new Promise((resolve,reject)=>{let value='',bytes=0;process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{bytes+=new TextEncoder().encode(chunk).length;if(bytes>MAX_STDIN_BYTES){const error=new RangeError('stdin vượt giới hạn 10 MiB');reject(error);process.stdin.destroy(error);return;}value+=chunk;});process.stdin.on('end',()=>resolve(value));process.stdin.on('error',reject);});}

const args=process.argv.slice(2),yearAt=args.indexOf('--year'),timelineAt=args.indexOf('--timeline'),sensitivityAt=args.indexOf('--sensitivity'),year=yearAt>=0?Number(args[yearAt+1]):undefined;
const excluded=new Set<number>();if(yearAt>=0){excluded.add(yearAt);excluded.add(yearAt+1);}if(timelineAt>=0){excluded.add(timelineAt);excluded.add(timelineAt+1);}if(sensitivityAt>=0){excluded.add(sensitivityAt);excluded.add(sensitivityAt+1);}
const inlineJson=args.find((x,i)=>!excluded.has(i)&&!['--compact','--batch','--compatibility','--stdin'].includes(x));
try {
  if(args.includes('--capabilities')){
    if(args.some(arg=>!['--capabilities','--compact'].includes(arg)))throw new TypeError('--capabilities chỉ dùng cùng --compact');
    process.stdout.write(JSON.stringify(getEngineCapabilities(),null,args.includes('--compact')?undefined:2)+'\n');
  } else {
  const json=args.includes('--stdin')?await readStdin():inlineJson;
  if(!json)throw new TypeError('Usage: viet-bazi [--stdin] [--batch|--compatibility|--sensitivity 120:5] [--year 2026] [--timeline 2025:2035] [--compact] JSON');
  if(args.includes('--stdin')&&inlineJson)throw new TypeError('--stdin không nhận thêm JSON argument');
  if(args.includes('--batch')&&(yearAt>=0||timelineAt>=0))throw new TypeError('--batch không dùng cùng --year hoặc --timeline');
  if(sensitivityAt>=0&&(args.includes('--batch')||timelineAt>=0))throw new TypeError('--sensitivity không dùng cùng --batch hoặc --timeline');
  if(args.includes('--compatibility')&&(args.includes('--batch')||sensitivityAt>=0||timelineAt>=0||yearAt>=0))throw new TypeError('--compatibility không dùng cùng --batch, --sensitivity, --timeline hoặc --year');
  let sensitivityOptions:[number,number]|undefined;if(sensitivityAt>=0){const match=/^(\d+)(?::(\d+))?$/.exec(args[sensitivityAt+1]??'');if(!match)throw new RangeError('--sensitivity phải có dạng MINUTES hoặc MINUTES:STEP');sensitivityOptions=[Number(match[1]),Number(match[2]??5)];}
  const chart=args.includes('--batch')?calculateBaziBatchFromJson(json):args.includes('--compatibility')?compareBirthInputsFromJson(json):sensitivityOptions?analyzeBirthTimeSensitivityFromJson(json,...sensitivityOptions,year):calculateBaziFromJson(json,year);
  let result:unknown=chart;
  if(timelineAt>=0){const match=/^(\d{4}):(\d{4})$/.exec(args[timelineAt+1]??'');if(!match)throw new RangeError('--timeline phải có dạng YYYY:YYYY');result=calculateAnnualTimeline(chart as ReturnType<typeof calculateBaziFromJson>,Number(match[1]),Number(match[2]));}
  process.stdout.write(JSON.stringify(result,null,args.includes('--compact')?undefined:2)+'\n');
  }
} catch(error) {
  process.stderr.write(`${error instanceof Error?error.message:String(error)}\n`);process.exitCode=error instanceof TypeError&&error.message.startsWith('Usage:')?2:1;
}
