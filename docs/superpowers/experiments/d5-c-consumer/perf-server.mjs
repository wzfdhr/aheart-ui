#!/usr/bin/env node
import { createServer } from 'vite'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const root = arg('--root')
if (!root) throw new Error('--root is required')
await writeFile(path.join(root, 'index.html'), '<!doctype html><html><body><div id="app"></div><script type="module" src="/@fs' + path.join(root, 'perf-main.js') + '"></script></body></html>')
await writeFile(path.join(root, 'perf-main.js'), `
import { createApp, h, nextTick } from 'vue'
import { Table } from 'aheart-ui'
import 'aheart-ui/style.css'
const virtual = new URLSearchParams(location.search).get('mode') === 'virtual'
const rows = Array.from({ length: 10000 }, (_, i) => ({ key: 'row-' + (i + 1), name: 'Row ' + (i + 1), status: 'ready' }))
const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }, { title: 'Status', dataIndex: 'status', key: 'status' }]
const props = { columns, rowKey: 'key', dataMode: 'local', dataSource: rows, pagination: false, ...(virtual ? { virtual: { height: 320, overscan: 4, estimateSize: 40 } } : {}) }
performance.mark('d5c:mountStart')
createApp({ render: () => h(Table, props) }).mount('#app')
await nextTick()
await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
performance.mark('d5c:interactive')
window.__fixtureReady = true
`)
const server = await createServer({ root, configFile: false, logLevel: 'error', define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true }, server: { host: '127.0.0.1', port: 0, fs: { allow: [root] } } })
await server.listen()
const port = server.httpServer.address().port
console.log(JSON.stringify({ root, fullUrl: `http://127.0.0.1:${port}/?mode=full`, virtualUrl: `http://127.0.0.1:${port}/?mode=virtual`, port }))
await new Promise(() => {})
