import { mkdir,writeFile } from 'node:fs/promises';
import * as schemas from '../dist/schema.js';

const entries=Object.entries(schemas).filter(([name,value])=>name.endsWith('_JSON_SCHEMA')&&value&&typeof value==='object'&&typeof value.$id==='string').sort(([a],[b])=>a.localeCompare(b));
await mkdir('schemas',{recursive:true});
for(const [,schema] of entries){const name=new URL(schema.$id).pathname.split('/').pop();if(!name?.endsWith('.json'))throw new Error(`Schema ID không có JSON filename: ${schema.$id}`);await writeFile(`schemas/${name}`,`${JSON.stringify(schema,null,2)}\n`);}
await writeFile('schemas/manifest.json',`${JSON.stringify({formatVersion:1,count:entries.length,schemas:Object.fromEntries(entries.map(([name,schema])=>[name,schema.$id]))},null,2)}\n`);
console.log(JSON.stringify({schemas:entries.length,target:'schemas'}));
