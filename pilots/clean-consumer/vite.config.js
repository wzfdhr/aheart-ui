import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
export default defineConfig({
  base: './',
  define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true },
  build: { minify: true, rollupOptions: { input: { index: fileURLToPath(new URL('./index.html', import.meta.url)), ssr: fileURLToPath(new URL('./ssr.html', import.meta.url)), iframe: fileURLToPath(new URL('./iframe.html', import.meta.url)) } } },
  plugins: [{ name: 'pilot-module-evidence', generateBundle(_options, bundle) {
    const chunks = Object.values(bundle).filter(item => item.type === 'chunk')
    const modules = chunks.flatMap(chunk => Object.entries(chunk.modules).map(([id, info]) => ({ id: id.replace(process.cwd(), '<consumer>'), renderedLength: info.renderedLength })))
    const assets = Object.values(bundle).map(item => { const value = item.type === 'chunk' ? item.code : item.source; return { file: item.fileName, bytes: Buffer.byteLength(value), gzipBytes: gzipSync(value).length } })
    this.emitFile({ type: 'asset', fileName: 'module-graph.json', source: JSON.stringify({ modules, assets }, null, 2) })
  } }]
})
