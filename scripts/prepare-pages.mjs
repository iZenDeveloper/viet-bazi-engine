import { cp,mkdir,rm,writeFile } from 'node:fs/promises';

const target='dist-pages';
await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await Promise.all([cp('demo',`${target}/demo`,{recursive:true}),cp('dist',`${target}/dist`,{recursive:true}),cp('service-worker.js',`${target}/service-worker.js`)]);
await writeFile(`${target}/index.html`,'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./demo/"><title>Viet Bazi Engine</title></head><body><a href="./demo/">Mở Viet Bazi Engine</a></body></html>\n');
await writeFile(`${target}/.nojekyll`,'');
console.log(JSON.stringify({pagesReady:true,target,roots:['demo','dist','service-worker.js']}));
