import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

if (!process.argv[2]) throw new Error('Usage: node pilots/serve-baselines.mjs <evidence-directory>')
const report = JSON.parse(await readFile(path.resolve(process.argv[2], 'results.json'), 'utf8'))
const servers = []
const close = async () => { await Promise.all(servers.map(server => new Promise(resolve => server.httpServer.close(resolve)))); process.exit() }
process.once('SIGINT', close)
process.once('SIGTERM', close)
try {
  for (const [index, pilot] of report.pilots.entries()) {
    const vite = await import(pathToFileURL(path.join(pilot.project, 'node_modules/vite/dist/node/index.js')).href)
    const server = await vite.preview({ root: pilot.project, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 4181 + index, strictPort: true } })
    servers.push(server)
    console.log(`${pilot.name}: http://127.0.0.1:${4181 + index}/ssr.html`)
  }
} catch (error) { console.error(error); await close() }
