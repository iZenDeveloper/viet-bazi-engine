import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,root),'utf8');
const sorted=value=>[...value].sort((a,b)=>a.localeCompare(b));

function declarationExports() {
  const entry=fileURLToPath(new URL('dist/index.d.ts',root));
  const program=ts.createProgram([entry],{module:ts.ModuleKind.NodeNext,moduleResolution:ts.ModuleResolutionKind.NodeNext,target:ts.ScriptTarget.ES2022,skipLibCheck:true});
  const source=program.getSourceFile(entry);
  if(!source)throw new Error('dist/index.d.ts is missing; run npm run build first');
  const checker=program.getTypeChecker(),module=checker.getSymbolAtLocation(source);
  if(!module)throw new Error('Unable to inspect dist/index.d.ts');
  const types=[];
  for(const symbol of checker.getExportsOfModule(module)){
    const name=symbol.getName();
    const target=symbol.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(symbol):symbol;
    if(target.flags&ts.SymbolFlags.Type)types.push(name);
  }
  return sorted(types);
}

function pythonExports(source) {
  const match=/__all__\s*=\s*(\[[^\]]*\])/s.exec(source);
  if(!match)throw new Error('Python __all__ is missing');
  return sorted(JSON.parse(match[1].replaceAll("'",'"')));
}

async function currentSurface() {
  const pkg=JSON.parse(await read('package.json'));
  const schemaManifest=JSON.parse(await read('schemas/manifest.json'));
  const runtime=await import(new URL(`dist/index.js?audit=${Date.now()}`,root));
  const mcp=await import(new URL(`dist/mcp.js?audit=${Date.now()}`,root));
  return {
    formatVersion:1,
    package:{
      name:pkg.name,
      entrypoints:pkg.exports,
      binaries:pkg.bin
    },
    typescript:{
      runtimeExports:sorted(Object.keys(runtime)),
      typeDeclarations:declarationExports()
    },
    schemas:{
      count:schemaManifest.count,
      ids:schemaManifest.schemas
    },
    mcp:{
      protocolVersion:mcp.MCP_PROTOCOL_VERSION,
      tools:sorted(mcp.MCP_TOOLS.map(tool=>tool.name))
    },
    python:{
      exports:pythonExports(await read('bindings/python/viet_bazi/__init__.py'))
    }
  };
}

const current=await currentSurface();
if(process.argv.includes('--print')){
  console.log(JSON.stringify(current,null,2));
  process.exit(0);
}

const expected=JSON.parse(await read('api/public-api.snapshot.json'));
if(JSON.stringify(current)!==JSON.stringify(expected)){
  console.error(JSON.stringify({publicApiStable:false,expected,current},null,2));
  throw new Error('Public API snapshot drifted; review the change and update api/public-api.snapshot.json intentionally');
}
console.log(JSON.stringify({
  publicApiStable:true,
  runtimeExports:current.typescript.runtimeExports.length,
  typeExports:current.typescript.typeDeclarations.length,
  schemas:current.schemas.count,
  mcpTools:current.mcp.tools.length,
  pythonExports:current.python.exports.length
}));
