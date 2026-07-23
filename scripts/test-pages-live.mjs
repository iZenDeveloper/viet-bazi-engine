import { readFile } from 'node:fs/promises';

const base=(process.argv[2]??process.env.VIET_BAZI_PAGES_URL??'').replace(/\/?$/,'/');
if(!/^https:\/\//.test(base))throw new Error('Pages live test requires an HTTPS base URL');
const localWorker=await readFile(new URL('../service-worker.js',import.meta.url),'utf8'),cacheName=/const CACHE='([^']+)'/.exec(localWorker)?.[1];
if(!cacheName)throw new Error('Local service-worker cache contract is missing');
const cases=[
  ['',200,'text/html','./demo/'],
  ['demo/',200,'text/html','Viet Bazi Engine'],
  ['demo/manifest.webmanifest',200,'application/manifest+json','"display": "standalone"'],
  ['dist/index.js',200,'application/javascript','calculateBazi'],
  ['service-worker.js',200,'application/javascript',cacheName]
];
for(const [path,status,type,marker] of cases){const response=await fetch(new URL(path,base),{redirect:'follow'}),body=await response.text();if(response.status!==status)throw new Error(`${path||'/'}: expected ${status}, got ${response.status}`);if(!response.headers.get('content-type')?.startsWith(type))throw new Error(`${path||'/'}: unexpected content type`);if(!body.includes(marker))throw new Error(`${path||'/'}: missing marker ${marker}`);}
console.log(JSON.stringify({pagesLive:true,https:true,routes:cases.length,base}));
