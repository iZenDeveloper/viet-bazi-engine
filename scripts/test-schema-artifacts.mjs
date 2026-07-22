import { readFile } from 'node:fs/promises';
import * as schemas from '../dist/schema.js';

const manifest=JSON.parse(await readFile('schemas/manifest.json','utf8')),entries=Object.entries(schemas).filter(([name,value])=>name.endsWith('_JSON_SCHEMA')&&value&&typeof value==='object'&&typeof value.$id==='string');
if(manifest.formatVersion!==1||manifest.count!==entries.length)throw new Error('Schema manifest count mismatch');
for(const [name,schema] of entries){const file=new URL(schema.$id).pathname.split('/').pop(),artifact=JSON.parse(await readFile(`schemas/${file}`,'utf8'));if(JSON.stringify(artifact)!==JSON.stringify(schema))throw new Error(`Schema artifact drift: ${name}`);}
console.log(JSON.stringify({schemaArtifacts:entries.length,drift:false}));
