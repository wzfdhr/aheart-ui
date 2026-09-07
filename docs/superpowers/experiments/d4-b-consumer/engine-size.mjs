import { build } from 'vite'
import { writeFile } from 'node:fs/promises'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import assert from 'node:assert/strict'

// Exported adapter entry, no Vue runtime, Aheart, CSS or consumer UI.
const samples = {}
for (const [name, code] of [
  ['baseline', 'export const marker = 1'],
  ['unused', 'import { useVirtualizer } from "@tanstack/vue-virtual"; export const marker = 1'],
  ['engine', 'export { useVirtualizer, defaultRangeExtractor } from "@tanstack/vue-virtual"; export const marker = 1']
]) {
  const result = await build({configFile:false,logLevel:'error',plugins:[{
    name:'isolated-entry',resolveId(id){if(id==='isolated-entry')return '\0isolated-entry'},
    load(id){if(id==='\0isolated-entry')return code}
  }],build:{write:false,minify:'esbuild',sourcemap:false,rollupOptions:{
    input:'isolated-entry',external:['vue'],preserveEntrySignatures:'strict',output:{format:'es'}
  }}})
  const chunks=result.output.filter(item=>item.type==='chunk')
  samples[name]={raw:0,gzip:0,brotli:0,modules:[]}
  for(const chunk of chunks){
    const bytes=Buffer.from(chunk.code)
    samples[name].raw+=bytes.length
    samples[name].gzip+=gzipSync(bytes).length
    samples[name].brotli+=brotliCompressSync(bytes).length
    samples[name].modules.push(...Object.keys(chunk.modules).filter(id=>id.includes('@tanstack')).map(id=>id.slice(id.indexOf('@tanstack'))))
  }
}
assert.deepEqual(samples.baseline,samples.unused)
assert.ok(samples.engine.modules.length>0)
await writeFile('engine-sizes.json',JSON.stringify({external:['vue'],mode:'Vite production esbuild minify, ESM exported adapter entry',samples},null,2)+'\n')
console.log(JSON.stringify(samples,null,2))
