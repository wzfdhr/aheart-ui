import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { createRequire } from 'node:module'
import { execFile } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { cp, mkdtemp, readFile, readdir, lstat, realpath, writeFile } from 'node:fs/promises'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'

const run = promisify(execFile)
const fixture = fileURLToPath(new URL('../docs/superpowers/experiments/d4-c-consumer/', import.meta.url))
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const newTarball = arg('--new-tarball'), oldTarball = arg('--old-tarball')
const output = arg('--out') ?? path.join(tmpdir(), `d4-c-results-${Date.now()}.json`)
assert.ok(newTarball, '--new-tarball is required')
const counts = arg('--counts')?.split(',').map(Number) ?? [1000, 5000, 10000]
const rounds = Number(arg('--rounds') ?? 3)
assert.ok(rounds > 0 && counts.every(count => count >= 1000))
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const sizes = async directory => {
  const result = { js: { raw: 0, gzip: 0, brotli: 0 }, css: { raw: 0, gzip: 0, brotli: 0 } }
  for (const file of await readdir(directory)) {
    const bytes = await readFile(path.join(directory, file)), item = result[file.endsWith('.css') ? 'css' : 'js']
    item.raw += bytes.length; item.gzip += gzipSync(bytes).length; item.brotli += brotliCompressSync(bytes).length
  }
  return result
}
const visibleActive = () => {
  const input = document.querySelector('#consumer-select')
  const row = document.getElementById(input?.getAttribute('aria-activedescendant'))
  const popup = row?.closest('[role="listbox"]')
  if (!row || !popup) return false
  const r = row.getBoundingClientRect(), p = popup.getBoundingClientRect()
  return r.top >= p.top - 1 && r.bottom <= p.bottom + 1
}
const tick = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
const now = page => page.evaluate(() => performance.now())

async function candidate(tarball, label, evaluateRuntime) {
  const root = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-d4-c-')))
  console.log(`candidate ${label}: ${root}`)
  await cp(path.join(fixture, 'package.json'), path.join(root, 'package.json'))
  await cp(path.join(fixture, 'sharedApp.js'), path.join(root, 'sharedApp.js'))
  await cp(tarball, path.join(root, 'aheart-ui.tgz'))
  const locked = arg(evaluateRuntime ? '--new-lockfile' : '--old-lockfile')
  if (locked) await cp(locked, path.join(root, 'package-lock.json'))
  for (const args of locked ? [['ci']] : [['install', '--package-lock-only'], ['ci']]) {
    const result = await run('npm', [...args, '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: root, maxBuffer: 20 * 1024 * 1024 })
    await writeFile(path.join(root, args[0] + '.log'), result.stdout + result.stderr)
  }
  const require = createRequire(path.join(root, 'probe.cjs'))
  const vue = require('vue'), ssr = require('@vue/server-renderer'), cjs = require('aheart-ui')
  assert.equal(typeof cjs.Select, 'object')
  assert.equal((await lstat(path.join(root, 'node_modules/aheart-ui'))).isSymbolicLink(), false)
  const { build, preview } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href)
  const { makeConsumerApp } = await import(pathToFileURL(path.join(root, 'sharedApp.js')).href)
  const record = { root, tarball, tarballSHA256: sha(await readFile(tarball)), lockSHA256: sha(await readFile(path.join(root, 'package-lock.json'))), label, versions: { node: process.version, vue: vue.version, vite: require('vite/package.json').version }, symlink: false, sizes: {}, modules: {}, hydration: [], scenarios: [] }
  const cjsHTML = await ssr.renderToString(vue.createSSRApp({ render: () => vue.h(cjs.Select, { defaultOpen: true, virtual: evaluateRuntime, defaultValue: 999, options: Array.from({ length: 1000 }, (_, value) => ({ label: `Row ${value}`, value })) }) }))
  const ssrCount = (cjsHTML.match(/role="option"/g) ?? []).length
  assert.ok(evaluateRuntime ? ssrCount > 0 && ssrCount < 100 : ssrCount === 1000)
  assert.ok(cjsHTML.includes('Row 999'))
  record.cjsSSRRows = ssrCount
  const variants = evaluateRuntime ? ['default-false', 'virtual-true', 'unused-button'] : ['default-false', 'unused-button']
  for (const variant of variants) {
    const entry = variant === 'unused-button'
      ? `import {createApp,h} from 'vue';import Button from 'aheart-ui/es/button/index.js';import 'aheart-ui/style.css';createApp({render:()=>h(Button,null,()=> 'Button')}).mount('#app')`
      : `import {createApp,createSSRApp} from 'vue';import {makeConsumerApp} from './sharedApp.js';import 'aheart-ui/style.css';const q=new URLSearchParams(location.search);const settings=window.__CASE__??{count:Number(q.get('count')||1000),dynamic:q.get('dynamic')==='true'};const app=(window.__SSR__?createSSRApp:createApp)(makeConsumerApp({...settings,virtual:${variant === 'virtual-true'}}));app.mount('#app');window.__fixtureReady=true`
    await writeFile(path.join(root, 'main.js'), entry)
    await writeFile(path.join(root, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="app"><!--APP--></div><script type="module" src="/main.js"></script></body></html>')
    const outDir = 'dist-' + variant
    await build({ root, configFile: false, logLevel: 'error', plugins: [{ name: 'modules', generateBundle(_o, bundle) { record.modules[variant] = Object.values(bundle).filter(item => item.type === 'chunk').flatMap(item => Object.keys(item.modules)).filter(id => id.includes('@tanstack')).map(id => id.slice(id.indexOf('@tanstack'))) } }], build: { outDir, emptyOutDir: true, minify: 'esbuild', sourcemap: false } })
    record.sizes[variant] = await sizes(path.join(root, outDir, 'assets'))
    if (variant === 'unused-button') assert.deepEqual(record.modules[variant], [])
    else if (evaluateRuntime) assert.ok(record.modules[variant].length > 0)
    const template = await readFile(path.join(root, outDir, 'index.html'), 'utf8')
    assert.ok(template.includes('<!--APP-->'))
    await writeFile(path.join(root, outDir, 'index.html'), template.replace('<!--APP-->', ''))
    if (!evaluateRuntime || variant === 'unused-button') continue
    for (const dynamic of [false, true]) {
      const settings = { count: 1000, dynamic, defaultOpen: true }
      const html = await ssr.renderToString(vue.createSSRApp(makeConsumerApp({ ...settings, virtual: variant === 'virtual-true' })))
      await writeFile(path.join(root, outDir, `ssr-${dynamic}.html`), template.replace('<!--APP-->', html).replace('<body>', `<body><script>window.__SSR__=true;window.__CASE__=${JSON.stringify(settings)}</script>`))
    }
    const server = await preview({ root, configFile: false, build: { outDir }, preview: { host: '127.0.0.1', port: 0 } })
    const browser = await chromium.launch()
    record.browser = browser.version()
    try {
      const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
      const base = 'http://127.0.0.1:' + server.httpServer.address().port
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', item => { if (/hydration|mismatch/i.test(item.text())) errors.push(item.text()) })
      await page.addInitScript(() => {
        window.__longtasks = []
        new PerformanceObserver(list => window.__longtasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true })
      })
      for (const dynamic of [false, true]) {
        await page.goto(`${base}/ssr-${dynamic}.html`)
        await page.waitForFunction(() => window.__fixtureReady)
        if (variant === 'virtual-true') await page.waitForFunction(visibleActive)
        await tick(page)
        assert.deepEqual(errors, [])
        record.hydration.push({ variant, dynamic, errors: [...errors] })
      }
      const cdp = await page.context().newCDPSession(page)
      for (const count of counts) for (const dynamic of [false, true]) for (let round = 0; round < rounds; round++) {
        await page.goto(`${base}/?count=${count}&dynamic=${dynamic}`)
        await page.waitForFunction(() => window.__fixtureReady)
        const input = page.locator('#consumer-select'), markers = {}
        const heapBefore = await cdp.send('Runtime.getHeapUsage')
        markers.cold = [await now(page)]
        await input.click(); await page.waitForFunction(visibleActive); await tick(page)
        markers.cold.push(await now(page))
        const snapshot = await page.evaluate(() => ({ dom: document.querySelectorAll('[role="option"]').length, heights: [...new Set(Array.from(document.querySelectorAll('[role="option"]'), row => row.getBoundingClientRect().height))] }))
        if (variant === 'virtual-true') assert.ok(snapshot.dom > 0 && snapshot.dom < 100)
        else assert.equal(snapshot.dom, count)
        if (dynamic) assert.ok(snapshot.heights.length > 1)
        await input.press('Escape'); await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
        markers.hot = [await now(page)]
        await input.click(); await page.waitForFunction(visibleActive); await tick(page)
        markers.hot.push(await now(page))
        markers.keys = [await now(page)]
        for (let i = 0; i < 20; i++) await input.press('ArrowDown')
        await page.waitForFunction(visibleActive); await tick(page)
        markers.keys.push(await now(page))
        const activeText = await page.evaluate(() => document.getElementById(document.querySelector('#consumer-select').getAttribute('aria-activedescendant')).textContent)
        assert.match(activeText, /^Row 20(?:detail line)?$/)
        markers.search = [await now(page)]
        await input.fill(`Row ${count - 1}`)
        await page.waitForFunction(() => document.querySelectorAll('[role="option"]').length === 1)
        await page.waitForFunction(visibleActive); await tick(page)
        markers.search.push(await now(page))
        assert.ok((await page.locator('[role="option"]').textContent()).startsWith(`Row ${count - 1}`))
        const longtasks = await page.evaluate(() => window.__longtasks)
        const longtaskSegments = Object.fromEntries(Object.entries(markers).map(([name, [start, end]]) => [name, longtasks.filter(task => task.startTime >= start && task.startTime <= end)]))
        await input.fill('no-match-anywhere')
        await page.waitForSelector('.aheart-select__empty')
        const emptyVisible = await page.locator('[role="listbox"]').evaluate(element => {
          const empty = element.querySelector('.aheart-select__empty')
          return empty && element.clientHeight >= empty.getBoundingClientRect().height
        })
        assert.ok(emptyVisible, 'Empty state was clipped by the virtual window')
        assert.deepEqual(errors, [])
        record.scenarios.push({ variant, count, dynamic, round, ...snapshot, markers, longtaskSegments, emptyVisible, heapBefore, heapAfter: await cdp.send('Runtime.getHeapUsage'), coldOpenMs: markers.cold[1] - markers.cold[0], hotOpenMs: markers.hot[1] - markers.hot[0], searchMs: markers.search[1] - markers.search[0], twentyKeysMs: markers.keys[1] - markers.keys[0] })
        console.log(`${label} ${variant} count=${count} dynamic=${dynamic} round=${round} passed`)
      }
      await page.screenshot({ path: path.join(root, `proof-${variant}.png`) })
    } finally { await browser.close(); await new Promise(resolve => server.httpServer.close(resolve)) }
  }
  record.statistics = []
  for (const variant of variants) for (const count of counts) for (const dynamic of [false, true]) {
    const rows = record.scenarios.filter(row => row.variant === variant && row.count === count && row.dynamic === dynamic)
    if (!rows.length) continue
    const summary = { variant, count, dynamic }
    for (const metric of ['coldOpenMs', 'hotOpenMs', 'searchMs', 'twentyKeysMs']) {
      const values = rows.map(row => row[metric]).sort((a,b) => a-b)
      summary[metric] = { min: values[0], median: values[Math.floor(values.length / 2)], max: values.at(-1) }
    }
    record.statistics.push(summary)
  }
  assert.equal(sha(await readFile(tarball)), record.tarballSHA256)
  await writeFile(path.join(root, 'results.json'), JSON.stringify(record, null, 2))
  return record
}
const result = { generatedAt: new Date().toISOString(), counts, rounds, note: 'Cold means first popup open on a fresh page; hot excludes close animation. Timings include Playwright and two animation frames. Heap is not forced-GC or a leak metric. Long tasks assigned by startTime.', candidates: [] }
result.candidates.push(await candidate(newTarball, 'new', true))
if (oldTarball) result.candidates.push(await candidate(oldTarball, 'old-build-only', false))
await writeFile(output, JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ output, sizes: result.candidates.map(item => ({ label: item.label, sizes: item.sizes })) }, null, 2))
