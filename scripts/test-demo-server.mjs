import { spawn } from 'node:child_process';

const port=18080,child=spawn(process.execPath,['scripts/serve-demo.mjs'],{cwd:process.cwd(),env:{...process.env,VIET_BAZI_DEMO_PORT:String(port)},stdio:['ignore','pipe','pipe']});
const ready=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Demo server start timeout')),5000);child.stdout.setEncoding('utf8');child.stdout.on('data',chunk=>{if(chunk.includes(`127.0.0.1:${port}`)){clearTimeout(timer);resolve();}});child.once('exit',code=>reject(new Error(`Demo server exited early: ${code}`)));child.stderr.on('data',chunk=>reject(new Error(String(chunk))));});
try {
  await ready;
  const cases=[['/demo/',200,'text/html'],['/dist/index.js',200,'text/javascript'],['/demo/manifest.webmanifest',200,'application/manifest+json'],['/missing',404,'text/plain']];
  for(const [path,status,type] of cases){const response=await fetch(`http://127.0.0.1:${port}${path}`);if(response.status!==status)throw new Error(`${path}: expected ${status}, got ${response.status}`);if(!response.headers.get('content-type')?.startsWith(type))throw new Error(`${path}: unexpected content type`);}
  console.log(JSON.stringify({httpSmoke:true,routes:cases.length,loopback:true}));
} finally {child.kill('SIGTERM');}
