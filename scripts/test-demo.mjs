import { readFile } from 'node:fs/promises';
const files=await Promise.all(['demo/index.html','demo/app.js','demo/style.css'].map(path=>readFile(path,'utf8'))),joined=files.join('\n');
if(/https?:\/\//.test(joined))throw new Error('Offline demo must not reference network resources');
for(const token of ['datetime-local','trueSolarTime','calculateBazi','renderBaziSvg','download-json','nearBoundary'])if(!joined.includes(token))throw new Error(`Offline demo missing ${token}`);
console.log(JSON.stringify({offline:true,networkReferences:0,downloads:['svg','json']}));
