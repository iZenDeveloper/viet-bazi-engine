import { createHash } from 'node:crypto';
import { cpSync,existsSync,mkdirSync,readdirSync,readFileSync,unlinkSync,writeFileSync } from 'node:fs';
import { dirname,extname,join,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),source=join(root,'dist'),target=join(root,'bindings/python/viet_bazi/_engine');
if(!existsSync(join(source,'cli.js')))throw new Error('Thiếu dist/cli.js; hãy chạy npm run build trước');
mkdirSync(join(target,'wasm'),{recursive:true});
for(const name of readdirSync(target))if(extname(name)==='.js'||name==='manifest.json')unlinkSync(join(target,name));
const files=readdirSync(source).filter(name=>extname(name)==='.js').sort();
for(const name of files)cpSync(join(source,name),join(target,name));
cpSync(join(source,'wasm/calendar.wasm'),join(target,'wasm/calendar.wasm'));
const packaged=[...files.map(name=>({path:name,bytes:readFileSync(join(target,name))})),{path:'wasm/calendar.wasm',bytes:readFileSync(join(target,'wasm/calendar.wasm'))}];
const manifest={formatVersion:1,engineVersion:JSON.parse(readFileSync(join(root,'package.json'),'utf8')).version,files:Object.fromEntries(packaged.map(file=>[file.path,{bytes:file.bytes.length,sha256:createHash('sha256').update(file.bytes).digest('hex')}]))};
writeFileSync(join(target,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);
console.log(JSON.stringify({engineVersion:manifest.engineVersion,files:packaged.length,target}));
