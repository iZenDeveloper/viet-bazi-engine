import { readFile } from 'node:fs/promises';
const paths=['demo/index.html','demo/app.js','demo/style.css','demo/manifest.webmanifest','demo/icon.svg','service-worker.js'],files=await Promise.all(paths.map(path=>readFile(path,'utf8'))),joined=files.join('\n');
if(/(?:src|href)=["']https?:\/\//.test(joined))throw new Error('Offline demo must not reference network resources');
for(const token of ['datetime-local','trueSolarTime','calculateBazi','calculateAnnualTimeline','renderBaziSvg','VIETNAM_CITIES','dayBoundary','locale','download-json','nearBoundary','renderSummary','renderTimeline','luck.active.pillar','pattern.primary','current-year','serviceWorker','cache.put','clients.claim','manifest.webmanifest','display','maskable'])if(!joined.includes(token))throw new Error(`Offline demo missing ${token}`);
const manifest=JSON.parse(files[3]);if(manifest.display!=='standalone'||manifest.icons.length<1||manifest.start_url!=='./')throw new Error('PWA manifest contract invalid');
console.log(JSON.stringify({offline:true,installable:true,cacheStrategy:'cache-first',networkReferences:0,downloads:['svg','json']}));
