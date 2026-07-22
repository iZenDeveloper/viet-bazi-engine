import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { dirname,extname,resolve,sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),port=Number(process.env.VIET_BAZI_DEMO_PORT??8080);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.wasm':'application/wasm'};
const required=['demo/index.html','demo/app.js','demo/style.css','demo/manifest.webmanifest','service-worker.js','dist/index.js'];
if(process.argv.includes('--check')){await Promise.all(required.map(path=>stat(resolve(root,path))));console.log(JSON.stringify({ready:true,port,root}));process.exit(0);}
if(!Number.isInteger(port)||port<1||port>65535)throw new RangeError('VIET_BAZI_DEMO_PORT phải là số nguyên trong 1..65535');
createServer(async(request,response)=>{try{const raw=new URL(request.url??'/',`http://${request.headers.host??'localhost'}`).pathname,pathName=raw==='/'?'/demo/':raw,filePath=resolve(root,`.${pathName.endsWith('/')?`${pathName}index.html`:pathName}`);if(filePath!==root&&!filePath.startsWith(root+sep)){response.writeHead(403).end('Forbidden');return;}const content=await readFile(filePath);response.writeHead(200,{'content-type':mime[extname(filePath)]??'application/octet-stream','cache-control':'no-cache'}).end(content);}catch{response.writeHead(404,{'content-type':'text/plain; charset=utf-8'}).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Viet Bazi demo: http://127.0.0.1:${port}/demo/`));
