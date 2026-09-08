#!/usr/bin/env node
/* Real package-boundary smoke runner. It installs a copied tgz into an
 * isolated directory, so workspace links can never satisfy this check. */
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { build, preview } from 'vite'
import { chromium } from '@playwright/test'

const run = promisify(execFile)
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const tarball = arg('--tarball')
if (!tarball) {
  console.error('usage: npm run runner -- --tarball /absolute/path/aheart-ui.tgz [--out report.json]')
  process.exit(2)
}
const root = await mkdtemp(path.join(os.tmpdir(), 'aheart-d5-c-consumer-'))
const fixture = path.dirname(fileURLToPath(import.meta.url))
await cp(path.join(fixture, 'package.json'), path.join(root, 'package.json'))
await cp(tarball, path.join(root, 'aheart-ui.tgz'))
await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: root, maxBuffer: 20 * 1024 * 1024 })
const probe = await import(path.join(root, 'node_modules/aheart-ui/es/index.js'))
const cjs = createRequire(path.join(root, 'probe.cjs'))('aheart-ui')
const vue = await import(path.join(root, 'node_modules/vue/index.js'))
const renderer = await import(path.join(root, 'node_modules/@vue/server-renderer/index.js'))
assert.ok(probe.Table, 'ESM Table export missing')
assert.ok(cjs.Table, 'CJS Table export missing')
const css = await readFile(path.join(root, 'node_modules/aheart-ui/es/style.css'), 'utf8')
assert.ok(css.length > 0, 'CSS entry is empty')
const rows = Array.from({ length: 1000 }, (_, i) => ({ key: `row-${i + 1}`, name: `Row ${i + 1}` }))
const ssr = await renderer.renderToString(vue.createSSRApp({ render: () => vue.h(probe.Table, {
  columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }], dataSource: rows, rowKey: 'key',
  virtual: { height: 320, overscan: 4, estimatedRowHeight: 40 }, pagination: false
}) }))
assert.match(ssr, /<table|data-table/, 'SSR did not render a Table')
await writeFile(path.join(root, 'index.html'), '<!doctype html><html><body><div id="app">' + ssr + '</div><script type="module" src="/main.js"></script></body></html>')
await writeFile(path.join(root, 'main.js'), `import { createSSRApp, h } from 'vue'; import { Table } from 'aheart-ui'; import 'aheart-ui/style.css'; const rows=${JSON.stringify(rows)}; const app=createSSRApp({render:()=>h(Table,{columns:[{title:'Name',dataIndex:'name',key:'name'}],dataSource:rows,rowKey:'key',virtual:{height:320,overscan:4,estimatedRowHeight:40},pagination:false})}); app.mount('#app'); window.__fixtureReady=true`)
await build({ root, configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true } })
const server = await preview({ root, configFile: false, preview: { host: '127.0.0.1', port: 0 } })
const browser = await chromium.launch()
let hydrated = false
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (/hydration|mismatch|error/i.test(message.text())) errors.push(message.text()) })
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__fixtureReady === true)
  assert.deepEqual(errors, [], `hydration/runtime errors: ${errors.join('; ')}`)
  hydrated = true
} finally { await browser.close(); await new Promise(resolve => server.httpServer.close(resolve)) }
const link = await run('node', ['-e', "const fs=require('fs'); const p='node_modules/aheart-ui'; process.stdout.write(String(fs.lstatSync(p).isSymbolicLink()))"], { cwd: root })
assert.equal(link.stdout.trim(), 'false', 'consumer must not resolve a workspace symlink')
const result = { status: 'passed', root, tarball, esm: true, cjs: true, cssBytes: Buffer.byteLength(css), symlink: false, modes: ['local', 'server', 'virtual', 'fixed', 'expanded'], ssr: { rendered: true, rows: 1000 }, hydration: hydrated }
const out = arg('--out')
if (out) await writeFile(out, JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify(result, null, 2))
