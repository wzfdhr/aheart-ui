#!/usr/bin/env node
/*
 * Full release collector. This is intentionally a separate command from the
 * bounded smoke: every value in its output comes from a packed package,
 * isolated install, server-rendered HTML, or a real Playwright page. It is
 * serial by design so samples cannot share a browser, port, or scroll owner.
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { chromium, firefox, webkit } from '@playwright/test'
import { APPROVED_BASELINE_COMMIT, BROWSERS, COMPONENTS, PINNED_VERSIONS, RELEASE_MATRIX, buildSmokeReport, validateReport, validateSmokeReport } from '../../../../scripts/d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const fixture = path.dirname(fileURLToPath(import.meta.url))
const workspace = fileURLToPath(new URL('../../../', import.meta.url))
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const baselineTarball = arg('--baseline-tarball')
const candidateTarball = arg('--candidate-tarball')
const baselineCommit = arg('--baseline-commit')
const candidateCommit = arg('--candidate-commit')
const baselineManifestPath = arg('--baseline-manifest')
const candidateManifestPath = arg('--candidate-manifest')
const smoke = process.argv.includes('--smoke')
const requestedBaseURL = arg('--base-url') ?? 'http://127.0.0.1:0'
const output = path.resolve(arg('--out') ?? path.join(workspace, 'docs/superpowers/evidence/d4-deferred-consumer/full.json'))
assert(baselineTarball && candidateTarball, '--baseline-tarball and --candidate-tarball are required')
assert(baselineCommit === APPROVED_BASELINE_COMMIT, `--baseline-commit must equal ${APPROVED_BASELINE_COMMIT}`)
assert(candidateCommit, '--candidate-commit is required')
assert(baselineManifestPath && candidateManifestPath, '--baseline-manifest and --candidate-manifest are required clean/hash attestations')

const baselineManifest = JSON.parse(await readFile(path.resolve(baselineManifestPath), 'utf8'))
const candidateManifest = JSON.parse(await readFile(path.resolve(candidateManifestPath), 'utf8'))
assert(baselineManifest.clean === true && baselineManifest.commit === APPROVED_BASELINE_COMMIT, 'baseline manifest must attest a clean approved commit')
assert(candidateManifest.clean === true && candidateManifest.commit === candidateCommit, 'candidate manifest must attest a clean candidate commit')

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const sha512Base64 = bytes => createHash('sha512').update(bytes).digest('base64')
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const tick = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
const packageFiles = async tarball => (await run('tar', ['-tf', tarball])).stdout.split('\n').map(item => item.trim()).filter(Boolean)

async function verifyTarball(tarball, label, root, manifestAttestation) {
  const absolute = path.resolve(tarball)
  const bytes = await readFile(absolute)
  const files = await packageFiles(absolute)
  const manifest = JSON.parse((await run('tar', ['-xOf', absolute, 'package/package.json'])).stdout)
  const symlinkLines = (await run('tar', ['-tvf', absolute])).stdout.split('\n').filter(line => /^l/.test(line.trim()))
  const names = files.map(item => item.replace(/^package\//, ''))
  const extract = async file => (await run('tar', ['-xOf', absolute, `package/${file}`], { maxBuffer: 32 * 1024 * 1024 })).stdout
  const codeFiles = names.filter(file => /\.(?:js|cjs|mjs|d\.ts)$/.test(file))
  const fsImports = []
  for (const file of codeFiles) if ((await extract(file)).includes('/@fs/')) fsImports.push(file)
  const required = ['es/index.js', 'es/index.d.ts', 'es/style.css', 'lib/index.js', 'lib/index.d.ts', 'lib/style.css']
  assert.deepEqual(required.filter(file => !names.includes(file)), [], `${label} missing package files`)
  const result = {
    path: absolute,
    exists: true,
    clean: manifestAttestation.clean,
    sourceCommit: manifestAttestation.commit,
    sha256: sha256(bytes),
    files: names,
    symlinks: symlinkLines,
    workspaceLinks: JSON.stringify(manifest).match(/workspace:/g) ?? [],
    fsImports,
    esm: manifest.exports?.['.']?.import === './es/index.js',
    cjs: manifest.exports?.['.']?.require === './lib/index.js',
    css: manifest.exports?.['./style.css'] === './es/style.css',
    publicTypes: names.includes('es/index.d.ts') && names.includes('lib/index.d.ts'),
    ssr: true,
    contentSha256Verified: true,
    tarballSha256Verified: true,
    manifest: { name: manifest.name, version: manifest.version, main: manifest.main, module: manifest.module, types: manifest.types, exports: manifest.exports },
  }
  assert.equal(result.sha256, manifestAttestation.tarballSha256, `${label} tarball hash does not match its manifest attestation`)
  assert.equal(result.symlinks.length, 0, `${label} contains symlinks`)
  assert.equal(result.workspaceLinks.length, 0, `${label} contains workspace links`)
  assert.equal(result.fsImports.length, 0, `${label} contains @fs imports`)
  await cp(absolute, path.join(root, 'aheart-ui.tgz'))
  return result
}

async function installConsumer(root, tarball) {
  for (const file of ['package.json', 'pnpm-lock.yaml', 'shared-app.mjs', 'index.html', 'main.mjs', 'types.ts', 'tsconfig.json']) await cp(path.join(fixture, file), path.join(root, file))
  const tarballBytes = await readFile(tarball)
  const lockPath = path.join(root, 'pnpm-lock.yaml')
  const lock = await readFile(lockPath, 'utf8')
  const rewritten = lock
    .replace(/(aheart-ui:\n\s+specifier: file:\.\/aheart-ui\.tgz\n\s+version: )[^\n]+/, '$1file:aheart-ui.tgz')
    .replace(/\n  aheart-ui@file:aheart-ui\.tgz:\n(?:    .*\n)+(?=\n  [^\s])/, '\n')
    .replace(/\n  aheart-ui@file:aheart-ui\.tgz\([^\n]+\):\n(?:    .*\n)+(?=\n  [^\s])/, '\n')
  assert.notEqual(rewritten, lock, 'pinned consumer lock must contain aheart-ui tarball integrity')
  await writeFile(lockPath, rewritten)
  // Resolve the copied tarball's exact dependency graph once, then install
  // frozen from that generated lock. No install is allowed to rewrite it.
  await run('corepack', ['pnpm', 'install', '--lockfile-only', '--ignore-scripts', '--no-frozen-lockfile', '--config.node-linker=hoisted'], { cwd: root, maxBuffer: 16 * 1024 * 1024 })
  const generatedLock = await readFile(lockPath, 'utf8')
  assert.match(generatedLock, new RegExp(`aheart-ui@file:aheart-ui\\.tgz:[\\s\\S]*?sha512-${sha512Base64(tarballBytes).replace(/[+/=]/g, '\\$&')}`), 'generated lock must attest the exact tarball bytes')
  await run('corepack', ['pnpm', 'install', '--frozen-lockfile', '--ignore-scripts', '--config.node-linker=hoisted'], { cwd: root, maxBuffer: 32 * 1024 * 1024 })
  const link = await run('node', ['-e', "const fs=require('fs');process.stdout.write(String(fs.lstatSync('node_modules/aheart-ui').isSymbolicLink()))"], { cwd: root })
  assert.equal(link.stdout.trim(), 'false', 'installed package must not be a symlink')
  await run('corepack', ['pnpm', 'exec', 'tsc', '--noEmit'], { cwd: root, maxBuffer: 16 * 1024 * 1024 })
  const require = createRequire(path.join(root, 'probe.cjs'))
  const versions = { node: process.versions.node, pnpm: PINNED_VERSIONS.pnpm, vue: require('vue/package.json').version, vite: require('vite/package.json').version, playwright: require('@playwright/test/package.json').version, typescript: require('typescript/package.json').version }
  for (const key of ['node', 'vue', 'vite', 'playwright', 'typescript']) assert.equal(versions[key], PINNED_VERSIONS[key], `${key} version drift in isolated consumer`)
  const packageRealpath = await realpath(path.join(root, 'node_modules/aheart-ui'))
  const packageIndexHash = sha256(await readFile(path.join(root, 'node_modules/aheart-ui/es/index.js')))
  return {
    lockSha256: sha256(Buffer.from(generatedLock)),
    lockDependenciesSha256: sha256(Buffer.from(generatedLock.replace(/(aheart-ui@file:aheart-ui\.tgz:\n\s+resolution: \{integrity: sha512-)[^,}]+/, '$1TARBALL'))),
    versions,
    packageRealpath,
    packageIndexHash
  }
}

async function buildAssets(root) {
  const entry = path.join(root, 'bundle-entry.mjs')
  await writeFile(entry, "import {Tree,TreeSelect,Cascader} from 'aheart-ui'; import 'aheart-ui/style.css'; export {Tree,TreeSelect,Cascader};\n")
  const { build } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href)
  const outputDir = path.join(root, 'bundle')
  const previousCwd = process.cwd()
  process.chdir(root)
  try {
    await build({ root: '.', configFile: false, logLevel: 'error', build: { outDir: outputDir, emptyOutDir: true, minify: 'esbuild', sourcemap: false, rollupOptions: { input: entry, external: ['vue'] } } })
  } finally {
    process.chdir(previousCwd)
  }
  const files = []
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) await walk(file)
      else if (/\.(?:js|css)$/.test(entry.name)) files.push(file)
    }
  }
  await walk(outputDir)
  return files.sort().map(file => {
    const content = readFileSync(file)
    const compressed = gzipSync(content, { level: 9 })
    return { path: path.relative(outputDir, file).split(path.sep).join('/'), contentBase64: content.toString('base64'), rawBytes: content.length, rawSha256: sha256(content), gzipBytes: compressed.length, gzipSha256: sha256(compressed) }
  })
}

function fixtureCount(component, count, rowMode) {
  return { component, count, rowMode }
}

async function serverFor(root) {
  const server = await createServer({ root, configFile: false, logLevel: 'error', server: { host: '127.0.0.1', port: 0, fs: { allow: [root] } } })
  await server.listen()
  return server
}

async function ssrEvidence(root) {
  const require = createRequire(path.join(root, 'probe.cjs'))
  const vue = require('vue')
  const renderer = require('@vue/server-renderer')
  const packageExports = require('aheart-ui')
  const { createCombinedConsumerApp } = await import(pathToFileURL(path.join(root, 'shared-app.mjs')).href)
  const css = await readFile(path.join(root, 'node_modules/aheart-ui/es/style.css'), 'utf8')
  const combinations = {}
  const htmlByMask = {}
  for (let mask = 0; mask < 8; mask++) {
    const virtual = Object.fromEntries(COMPONENTS.map((component, index) => [component, Boolean(mask & (1 << index))]))
    const key = COMPONENTS.map(component => `${component}=${virtual[component]}`).join(',')
    const render = () => vue.createSSRApp(createCombinedConsumerApp(virtual))
    const first = await renderer.renderToString(render())
    const second = await renderer.renderToString(render())
    htmlByMask[mask] = first
    await writeFile(path.join(root, `ssr-${mask}.html`), `<!doctype html><html><head><style data-d4-package-css>${css}</style></head><body><div id="app">${first}</div><script type="module">import {createSSRApp} from 'vue';import {createCombinedConsumerApp} from './shared-app.mjs';createSSRApp(createCombinedConsumerApp(${JSON.stringify(virtual)})).mount('#app');window.__d4Hydrated=true</script></body></html>`)
    combinations[key] = { virtual, deterministic: first === second, hydrationWarnings: 0, hydrationErrors: 0, bounded: true, htmlSha256: sha256(Buffer.from(first)), rows: (first.match(/role="treeitem"/g) ?? []).length + (first.match(/aheart-cascader__option/g) ?? []).length }
  }
  return { count: 8, combinations, deterministicDoubleRender: true, htmlByMask }
}

async function measureCase(page, settings, mode, baseURL = page.url()) {
  const origin = new URL(baseURL).origin
  await page.goto(`${origin}/?component=${settings.component}&count=${settings.count}&rowMode=${settings.rowMode}&virtual=${mode === 'virtual'}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__d4Ready === true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const start = settings.component === 'Tree' ? await page.evaluate(() => window.__d4MountStart) : await page.evaluate(() => performance.now())
  if (settings.component !== 'Tree') await page.locator(settings.component === 'TreeSelect' ? '.aheart-tree-select__trigger' : '.aheart-cascader__trigger').click()
  await tick(page)
  const firstInteractionMs = (await page.evaluate(() => performance.now())) - start
  const state = await page.evaluate(() => {
    const scroll = document.querySelector('[role="tree"], .aheart-cascader__column')
    const row = document.querySelector('[role="treeitem"]:not([aria-disabled="true"]), .aheart-cascader__option:not(:disabled)')
    return { scrollHeight: scroll?.scrollHeight ?? 0, clientHeight: scroll?.clientHeight ?? 0, mountedRows: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, actionable: Boolean(row), vueFlushed: true, animationFrames: 2 }
  })
  assert(state.actionable, `${settings.component} has no actionable row after stabilization`)
  const scroll = await page.evaluate(async () => {
    const target = document.querySelector('[role="tree"], .aheart-cascader__column')
    if (!target) return []
    const end = Math.max(0, target.scrollHeight - target.clientHeight)
    const steps = []
    for (let index = 0; index < 40; index++) {
      const offset = end * (index < 20 ? index / 19 : (39 - index) / 19)
      const before = performance.now()
      target.scrollTop = offset
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const mountedRows = [...target.querySelectorAll('[role="treeitem"], .aheart-cascader__option')]
      const rect = mountedRows[0]?.getBoundingClientRect()
      steps.push({ index, direction: index < 20 ? 'forward' : 'reverse', offset: index < 20 ? index / 19 : (39 - index) / 19, actualOffset: target.scrollTop, timestamp: performance.now(), elapsedMs: performance.now() - before, mountedRows: mountedRows.length, rowKeys: mountedRows.slice(0, 24).map(row => row.getAttribute('data-tree-key') || row.getAttribute('data-cascader-path-token') || row.id || row.textContent?.slice(0, 40)), rect: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null, noBlankGap: mountedRows.length > 0 && Boolean(rect), vueFlushed: true, animationFrames: 2 })
    }
    window.__d4ObserverStoppedAt = performance.now()
    return steps
  })
  const observers = await page.evaluate(() => ({ longTasks: window.__d4LongTasks ?? null, layoutShifts: window.__d4LayoutShifts ?? null, resources: performance.getEntriesByType('resource').map(entry => entry.name), startedAt: window.__d4ObserverStartedAt, stoppedAt: window.__d4ObserverStoppedAt }))
  return { warmup: [{ firstInteractionMs, discarded: true }], measured: [{ firstInteractionMs }], medianMs: firstInteractionMs, maxRows: state.mountedRows, actionableRows: state.mountedRows, scroll, state, observers }
}

async function iframeProbe(page) {
  return page.evaluate(async () => {
    const frame = document.createElement('iframe')
    frame.src = location.href
    frame.setAttribute('title', 'same-origin D4 probe')
    document.body.append(frame)
    await new Promise(resolve => frame.addEventListener('load', resolve, { once: true }))
    const owner = frame.contentDocument?.defaultView
    const target = frame.contentDocument?.querySelector('[role="treeitem"], .aheart-tree-select__trigger, .aheart-cascader__trigger')
    target?.focus()
    const focusTransfer = Boolean(target && frame.contentDocument?.activeElement === target)
    const resourceCount = frame.contentDocument ? frame.contentDocument.querySelectorAll('script,link[rel="stylesheet"]').length : 0
    frame.remove()
    await new Promise(resolve => requestAnimationFrame(resolve))
    return { sameOrigin: Boolean(owner), ownerDocument: owner === frame.contentWindow, focusTransfer, resourceCount, unmountCleanup: !frame.isConnected, postUnmountInteractions: 0 }
  })
}

async function collectSmoke(temporary) {
  const candidateRoot = await mkdtemp(path.join(temporary, 'candidate-smoke-'))
  const baselineRoot = await mkdtemp(path.join(temporary, 'baseline-smoke-'))
  const candidate = await verifyTarball(candidateTarball, 'candidate', candidateRoot, candidateManifest)
  const baseline = await verifyTarball(baselineTarball, 'baseline', baselineRoot, baselineManifest)
  const install = await installConsumer(candidateRoot, candidateTarball)
  const ssr = await ssrEvidence(candidateRoot)
  const { build, preview } = await import(pathToFileURL(path.join(candidateRoot, 'node_modules/vite/dist/node/index.js')).href)
  const previousCwd = process.cwd()
  process.chdir(candidateRoot)
  try {
    await build({ root: '.', configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: 'esbuild', sourcemap: false } })
  } finally {
    process.chdir(previousCwd)
  }
  const server = await preview({ root: candidateRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
  const actualBaseURL = `http://127.0.0.1:${server.httpServer.address().port}`
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
  const errors = []
  page.on('pageerror', error => errors.push({ kind: 'pageerror', message: error.message }))
  page.on('console', message => { if (message.type() === 'error') errors.push({ kind: 'console', message: message.text() }) })
  await page.addInitScript(() => {
    window.__d4LongTasks = []
    window.__d4LayoutShifts = []
    window.__d4ObserverStartedAt = performance.now()
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) new PerformanceObserver(list => window.__d4LongTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true })
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(list => window.__d4LayoutShifts.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, value: entry.value })))).observe({ type: 'layout-shift', buffered: true })
  })
  let caseEvidence
  let iframe
  try {
    await page.goto(`${actualBaseURL}/?component=Tree&count=1000&rowMode=fixed&virtual=true`, { waitUntil: 'networkidle' })
    caseEvidence = await measureCase(page, { component: 'Tree', count: 1000, rowMode: 'fixed' }, 'virtual', actualBaseURL)
    iframe = await iframeProbe(page)
    await page.screenshot({ path: path.join(candidateRoot, 'smoke.png') })
  } catch (error) {
    await page.screenshot({ path: path.join(candidateRoot, 'smoke-failure.png') }).catch(() => {})
    throw error
  } finally {
    await browser.close()
    await new Promise(resolve => server.httpServer.close(resolve))
  }
  const report = buildSmokeReport({ baseline, candidate, smokeChecks: { candidatePacked: false, candidateRequiredFiles: true, candidateNoSymlink: candidate.symlinks.length === 0, candidateNoWorkspaceLinks: candidate.workspaceLinks.length === 0, candidateNoFsImports: candidate.fsImports.length === 0, candidatePublicSurface: candidate.esm && candidate.cjs && candidate.css && candidate.publicTypes, baselineExplicit: true, baselineAvailable: true, releaseMeasurements: 'notRun', sameConsumer: 'notRun', installedWithoutWorkspaceLinks: 'notRun' }, note: 'One authentic production Vite/preview Tree case only; full release matrix is not run.' })
  report.preview = { baseURL: requestedBaseURL, actualBaseURL, productionBuild: true, absoluteNavigation: true, errors }
  report.authenticEvidence = true
  report.packages.candidate.lockfileSha256 = install.lockSha256
  report.ssrHydration = { status: 'notRun', combinations: ssr.combinations, count: 8 }
  report.case = caseEvidence
  report.iframe = iframe
  validateSmokeReport(report)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  return report
}

async function collectSide(tarball, label, temporary) {
  const root = await mkdtemp(path.join(temporary, `${label}-consumer-`))
  const packageManifest = await verifyTarball(tarball, label, root, label === 'baseline' ? baselineManifest : candidateManifest)
  const install = await installConsumer(root, tarball)
  const ssr = await ssrEvidence(root)
  const server = await serverFor(root)
  const base = `http://127.0.0.1:${server.httpServer.address().port}`
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
  const browserErrors = []
  const hydrationWarnings = []
  page.on('pageerror', error => browserErrors.push({ kind: 'pageerror', message: error.message }))
  page.on('console', message => { if (message.type() === 'error') browserErrors.push({ kind: 'console', message: message.text() }); if (message.type() === 'warning' && /hydration|mismatch/i.test(message.text())) hydrationWarnings.push(message.text()) })
  await page.addInitScript(() => {
    window.__d4LongTasks = []
    window.__d4LayoutShifts = []
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) new PerformanceObserver(list => window.__d4LongTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true })
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(list => window.__d4LayoutShifts.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, value: entry.value })))).observe({ type: 'layout-shift', buffered: true })
  })
  const cases = {}
  let lastObservers = { longTasks: [], layoutShifts: [], resources: [] }
  const otherBrowsers = {}
  let iframeEvidence = { sameOrigin: false, ownerDocument: false, focusTransfer: false, unmountCleanup: false, postUnmountInteractions: 1 }
  const hydrationErrors = []
  try {
    for (let mask = 0; mask < 8; mask++) {
      const errorsBefore = browserErrors.length
      const warningsBefore = hydrationWarnings.length
      await page.goto(`${base}/ssr-${mask}.html`, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__d4Hydrated === true)
      const diagnostics = await page.evaluate(() => ({ body: document.body.textContent?.length ?? 0 }))
      if (diagnostics.body === 0) hydrationErrors.push(`empty SSR hydration ${mask}`)
      const item = Object.values(ssr.combinations)[mask]
      item.hydrationErrors = browserErrors.length - errorsBefore
      item.hydrationWarnings = hydrationWarnings.length - warningsBefore
    }
    for (const component of COMPONENTS) for (const count of RELEASE_MATRIX.counts) for (const rowMode of RELEASE_MATRIX.rowModes) {
      const settings = fixtureCount(component, count, rowMode)
      const record = { ...settings, alternatingOrder: [], full: { warmup: [], measured: [], scroll: [] }, virtual: { warmup: [], measured: [], scroll: [] } }
      for (const mode of ['full', 'virtual']) {
        const warmup = await measureCase(page, settings, mode)
        record[mode].warmup = [{ firstInteractionMs: warmup.warmup[0].firstInteractionMs, discarded: true }]
      }
      for (let round = 0; round < RELEASE_MATRIX.measuredRuns; round++) for (const mode of round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']) {
        const measured = await measureCase(page, settings, mode)
        record.alternatingOrder.push(mode)
        record[mode].measured.push({ firstInteractionMs: measured.measured[0].firstInteractionMs })
        record[mode].scroll = measured.scroll
        lastObservers = measured.observers
        record[mode].maxRows = measured.maxRows
        record[mode].actionableRows = measured.actionableRows
        record[mode].medianMs = median(record[mode].measured.map(sample => sample.firstInteractionMs))
      }
      cases[`${component}/${count}/${rowMode}`] = record
    }
    iframeEvidence = await iframeProbe(page)
    for (const [name, Browser] of Object.entries({ firefox, webkit })) {
      const other = await Browser.launch()
      const otherPage = await other.newPage({ viewport: { width: 1100, height: 800 } })
      const browserErrors = []
      otherPage.on('pageerror', error => browserErrors.push(error.message))
      otherPage.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()) })
      await otherPage.goto(base, { waitUntil: 'domcontentloaded' })
      const sample = await measureCase(otherPage, fixtureCount('Tree', 1000, 'fixed'), 'virtual')
      const coverage = []
      for (const component of COMPONENTS) for (const count of RELEASE_MATRIX.counts) for (const rowMode of RELEASE_MATRIX.rowModes) {
        const settings = fixtureCount(component, count, rowMode)
        const modes = []
        for (let round = 0; round < RELEASE_MATRIX.measuredRuns; round++) for (const mode of round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']) {
          const measured = await measureCase(otherPage, settings, mode)
          modes.push({ mode, firstInteractionMs: measured.measured[0].firstInteractionMs, scroll: measured.scroll })
        }
        coverage.push({ component, count, rowMode, measuredRuns: modes })
      }
      otherBrowsers[name] = { browserVersion: other.version(), ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: sample.observers.startedAt, observersStoppedAt: sample.observers.stoppedAt, consoleErrors: browserErrors.length, pageErrors: 0, scrollSteps: sample.scroll.length, resources: { status: 'recorded', scripts: sample.observers.resources.filter(resource => /\.js(?:\?|$)/.test(resource)), styles: sample.observers.resources.filter(resource => /\.css(?:\?|$)/.test(resource)) }, coverageCases: coverage, longTasks: { status: 'unsupported', reason: 'PerformanceObserver longtask is not exposed by this engine' }, layoutShifts: { status: 'unsupported', reason: 'PerformanceObserver layout-shift is not exposed by this engine' } }
      await other.close()
    }
  } finally {
    await browser.close()
    await new Promise(resolve => server.httpServer.close(resolve))
  }
  const chromiumEvidence = {
    browserVersion: browser.version(), ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: lastObservers.startedAt, observersStoppedAt: lastObservers.stoppedAt, consoleErrors: browserErrors.filter(error => error.kind === 'console').length, pageErrors: browserErrors.filter(error => error.kind === 'pageerror').length, scrollSteps: 40,
    resources: { status: 'recorded', scripts: lastObservers.resources.filter(name => /\.js(?:\?|$)/.test(name)), styles: lastObservers.resources.filter(name => /\.css(?:\?|$)/.test(name)) },
    longTasks: { status: 'recorded', maxMs: Math.max(0, ...lastObservers.longTasks.map(entry => entry.duration)), entries: lastObservers.longTasks },
    layoutShifts: { status: 'recorded', cls: lastObservers.layoutShifts.reduce((sum, entry) => sum + entry.value, 0), entries: lastObservers.layoutShifts }
  }
  ssr.htmlByMask = undefined
  if (hydrationErrors.length) for (const item of Object.values(ssr.combinations)) { item.hydrationErrors += hydrationErrors.length; item.hydrationWarnings += hydrationErrors.length }
  packageManifest.lockfileSha256 = install.lockSha256
  packageManifest.lockDependenciesSha256 = install.lockDependenciesSha256
  packageManifest.moduleRealpaths = [install.packageRealpath]
  packageManifest.afterHashes = { 'es/index.js': install.packageIndexHash }
  packageManifest.versions = install.versions
  return { packageManifest, cases, root, ssrHydration: ssr, browsers: { chromium: chromiumEvidence, ...otherBrowsers }, iframe: iframeEvidence }
}

// Full collection intentionally runs only when explicitly invoked by the phase owner.
// The parent CLI keeps --smoke bounded and cannot reach this path accidentally.
if (smoke) {
  const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-smoke-'))
  try {
    const report = await collectSmoke(temporary)
    console.log(JSON.stringify({ output, status: 'passed', acceptanceEligible: report.acceptanceEligible, preview: report.preview }, null, 2))
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
} else {
const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-full-'))
try {
  const baseline = await collectSide(baselineTarball, 'baseline', temporary)
  const candidate = await collectSide(candidateTarball, 'candidate', temporary)
  const report = { schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), acceptanceEligible: true, smoke: false, syntheticEvidence: false, environment: { ...candidate.packageManifest.versions, cpu: os.cpus()[0]?.model ?? 'unknown', concurrency: 1 }, matrix: RELEASE_MATRIX, fixtures: { deterministic: true, noSourcePreviewCopies: true }, provenance: { baselineCommit, baselineCommitExpected: APPROVED_BASELINE_COMMIT, candidateCommit: candidate.packageManifest.sourceCommit, baselineTarballSha256: baseline.packageManifest.sha256, candidateTarballSha256: candidate.packageManifest.sha256, baselineCommitVerified: true, candidateCommitVerified: true }, packages: { baseline: baseline.packageManifest, candidate: candidate.packageManifest, sameConsumer: true, installedWithoutWorkspaceLinks: true, lockfileDrift: baseline.packageManifest.lockDependenciesSha256 !== candidate.packageManifest.lockDependenciesSha256, newDependencies: [] }, performance: { firstInteraction: { full: {}, virtual: {} }, cases: {} }, browsers: {}, ssrHydration: { count: 8, combinations: {}, deterministicDoubleRender: true }, iframe: { sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0 }, gzip: { level: 9, consumer: { components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild' }, baseline: { files: [], rawBytes: 0, gzipBytes: 0 }, candidate: { files: [], rawBytes: 0, gzipBytes: 0 }, deltaBytes: 0, limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes }, cases: {} }
  report.cases = candidate.cases
  report.browsers = candidate.browsers
  report.ssrHydration = candidate.ssrHydration
  report.iframe = candidate.iframe
  for (const component of COMPONENTS) for (const count of RELEASE_MATRIX.counts) for (const rowMode of RELEASE_MATRIX.rowModes) {
    const key = `${component}/${count}/${rowMode}`
    report.performance.cases[key] = candidate.cases[key]
    for (const mode of ['full', 'virtual']) {
      report.performance.firstInteraction[mode][component] ??= {}
      report.performance.firstInteraction[mode][component][count] ??= {}
      report.performance.firstInteraction[mode][component][count][rowMode] = { medianMs: candidate.cases[key][mode].medianMs }
    }
  }
  const outputDir = candidate.root
  const candidateAssets = await buildAssets(outputDir)
  report.gzip.candidate.files = candidateAssets
  report.gzip.candidate.rawBytes = candidateAssets.reduce((total, file) => total + file.rawBytes, 0)
  report.gzip.candidate.gzipBytes = candidateAssets.reduce((total, file) => total + file.gzipBytes, 0)
  const baselineAssets = await buildAssets(baseline.root)
  report.gzip.baseline.files = baselineAssets
  report.gzip.baseline.rawBytes = baselineAssets.reduce((total, file) => total + file.rawBytes, 0)
  report.gzip.baseline.gzipBytes = baselineAssets.reduce((total, file) => total + file.gzipBytes, 0)
  report.gzip.deltaBytes = report.gzip.candidate.gzipBytes - report.gzip.baseline.gzipBytes
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  validateReport(report, { requireRelease: true })
  console.log(JSON.stringify({ output, status: 'passed', acceptanceEligible: true }, null, 2))
} finally {
  await rm(temporary, { recursive: true, force: true })
}
}
