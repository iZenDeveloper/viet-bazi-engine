import { readFile,stat } from 'node:fs/promises';
const required=['dist-pages/index.html','dist-pages/.nojekyll','dist-pages/demo/index.html','dist-pages/demo/manifest.webmanifest','dist-pages/dist/index.js','dist-pages/dist/wasm/calendar.wasm','dist-pages/service-worker.js'];
await Promise.all(required.map(path=>stat(path)));
const [root,demo,app,worker]=await Promise.all(['dist-pages/index.html','dist-pages/demo/index.html','dist-pages/demo/app.js','dist-pages/service-worker.js'].map(path=>readFile(path,'utf8')));
if(!root.includes('./demo/')||!demo.includes('./manifest.webmanifest')||!app.includes("'../dist/index.js'")||!app.includes("'../service-worker.js'")||!worker.includes("'./demo/"))throw new Error('GitHub Pages relative-path contract invalid');
console.log(JSON.stringify({pagesArtifact:true,files:required.length,relativePaths:true}));
