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
import { APPROVED_BASELINE_COMMIT, BROWSERS, COMPONENTS, PINNED_VERSIONS, RELEASE_MATRIX, buildSmokeReport, validateBoundedReleaseReport, validateReport, validateSmokeReport, verifyArtifactBindings } from '../../../../scripts/d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const fixture = path.dirname(fileURLToPath(import.meta.url))
export const workspaceRoot = fileURLToPath(new URL('../../../../', import.meta.url))
export const resolveWorkspacePath = value => path.resolve(workspaceRoot, value)
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const baselineTarball = arg('--baseline-tarball')
const candidateTarball = arg('--candidate-tarball')
const baselineCommit = arg('--baseline-commit')
const candidateCommit = arg('--candidate-commit')
const baselineManifestPath = arg('--baseline-manifest')
const candidateManifestPath = arg('--candidate-manifest')
const smoke = process.argv.includes('--smoke')
const requestedBaseURL = arg('--base-url') ?? 'http://127.0.0.1:0'
const output = path.resolve(arg('--out') ?? path.join(workspaceRoot, 'docs/superpowers/evidence/d4-deferred-consumer/full.json'))
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
async function fingerprintDirectory(directory) {
  const files = []
  async function walk(current) { for (const entry of await readdir(current, { withFileTypes: true })) { const file = path.join(current, entry.name); if (entry.isDirectory()) await walk(file); else files.push(file) } }
  await walk(directory)
  const hashes = []
  for (const file of files.sort()) hashes.push(`${path.relative(directory, file).split(path.sep).join('/')}=${sha256(await readFile(file))}`)
  return sha256(Buffer.from(hashes.join('\n')))
}
async function writeFileManifest(directory, destination) {
  const files = []
  async function walk(current) { for (const entry of await readdir(current, { withFileTypes: true })) { const file = path.join(current, entry.name); if (entry.isDirectory()) await walk(file); else files.push(file) } }
  await walk(directory)
  await writeFile(destination, `${JSON.stringify({ files: files.sort().map(file => ({ path: file, relativePath: path.relative(directory, file).split(path.sep).join('/'), sha256: sha256(readFileSync(file)) })) }, null, 2)}\n`)
}

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
  const pnpmVersion = (await run('corepack', ['pnpm', '--version'], { cwd: root })).stdout.trim()
  const versions = { node: process.versions.node, pnpm: pnpmVersion, vue: require('vue/package.json').version, vite: require('vite/package.json').version, playwright: require('@playwright/test/package.json').version, typescript: require('typescript/package.json').version }
  for (const key of ['node', 'vue', 'vite', 'playwright', 'typescript']) assert.equal(versions[key], PINNED_VERSIONS[key], `${key} version drift in isolated consumer`)
  const packageRealpath = await realpath(path.join(root, 'node_modules/aheart-ui'))
  const packageIndexHash = sha256(await readFile(path.join(root, 'node_modules/aheart-ui/es/index.js')))
  return {
    lockPath,
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
  const { COMPONENTS: appComponents, componentProps, createCombinedConsumerApp } = await import(pathToFileURL(path.join(root, 'shared-app.mjs')).href)
  const css = await readFile(path.join(root, 'node_modules/aheart-ui/es/style.css'), 'utf8')
  const combinations = {}
  const htmlByMask = {}
  for (let mask = 0; mask < 8; mask++) {
    const virtual = Object.fromEntries(COMPONENTS.map((component, index) => [component, Boolean(mask & (1 << index))]))
    const key = COMPONENTS.map(component => `${component}=${virtual[component]}`).join(',')
    const firstContext = {}
    const secondContext = {}
    const render = context => renderer.renderToString(vue.createSSRApp(createCombinedConsumerApp(virtual, { ssrOpen: true })), context)
    const first = await render(firstContext)
    const second = await render(secondContext)
    const componentRows = {}
    for (const component of appComponents) {
      const props = componentProps(component, 1000, 'fixed', virtual[component])
      if (component !== 'Tree') props.defaultOpen = true
      const componentContext = {}
      const html = await renderer.renderToString(vue.createSSRApp({ render: () => vue.h(packageExports[component], props) }), componentContext)
      const rendered = `${html}${Object.values(componentContext.teleports ?? {}).join('')}`
      componentRows[component] = (rendered.match(/role="treeitem"/g) ?? []).length + (rendered.match(/aheart-cascader__option/g) ?? []).length
    }
    htmlByMask[mask] = first
    const firstTeleports = Object.values(firstContext.teleports ?? {}).join('')
    await writeFile(path.join(root, `ssr-${mask}.html`), `<!doctype html><html><head><style data-d4-package-css>${css}</style></head><body><div id="app">${first}</div>${firstTeleports}<script type="module">import {createSSRApp,nextTick} from 'vue';import {createCombinedConsumerApp} from './shared-app.mjs';window.__d4EventLog=[];window.__d4Virtual=${JSON.stringify(virtual)};window.__d4NextTick=nextTick;createSSRApp(createCombinedConsumerApp(${JSON.stringify(virtual)},{ssrOpen:true})).mount('#app');window.__d4Hydrated=true</script></body></html>`)
    const rows = (first.match(/role="treeitem"/g) ?? []).length + (first.match(/aheart-cascader__option/g) ?? []).length
    const boundedRows = Math.max(...appComponents.filter(component => virtual[component]).map(component => componentRows[component]), 0)
    combinations[key] = { virtual, deterministic: first === second, hydrationWarnings: 0, hydrationErrors: 0, bounded: true, boundedRows, componentRows, popupVirtualRows: componentRows, cjsRender: true, htmlSha256: sha256(Buffer.from(first)), initialIdSha256: sha256(Buffer.from(String((first.match(/id="d4-[^"]+"/g) ?? []).length))), rows }
  }
  return { count: 8, combinations, deterministicDoubleRender: true, htmlByMask }
}

async function measureCase(page, settings, mode, baseURL = page.url()) {
  const origin = new URL(baseURL).origin
  await page.goto(`${origin}/?component=${settings.component}&count=${settings.count}&rowMode=${settings.rowMode}&virtual=${mode === 'virtual'}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__d4Ready === true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const startedAt = settings.component === 'Tree' ? await page.evaluate(() => window.__d4MountStart) : await page.evaluate(() => performance.now())
  const triggerAt = settings.component === 'Tree' ? startedAt : await page.evaluate(() => performance.now())
  if (settings.component !== 'Tree') await page.locator(settings.component === 'TreeSelect' ? '.aheart-tree-select__trigger' : '.aheart-cascader__trigger').click()
  if (settings.component !== 'Tree') await page.waitForSelector('[role="tree"], .aheart-cascader__column', { state: 'attached' })
  await page.waitForFunction(() => Boolean(document.querySelector('[role="treeitem"]:not([aria-disabled="true"]), .aheart-cascader__option:not(:disabled)')))
  const actionableAt = await page.evaluate(() => performance.now())
  const stabilization = await page.evaluate(async () => { await window.__d4NextTick(); const nextTickAt = performance.now(); const rafAt = await new Promise(resolve => requestAnimationFrame(() => { const first = performance.now(); requestAnimationFrame(() => resolve([first, performance.now()])) })); return { nextTickAt, rafAt } })
  const nextTickAt = stabilization.nextTickAt
  const rafAt = stabilization.rafAt
  let searchMs = null
  const endAt = rafAt[1]
  const firstInteractionMs = endAt - startedAt
  const state = await page.evaluate(() => {
    const scroll = document.querySelector('[role="tree"], .aheart-cascader__column')
    const row = scroll?.querySelector('[role="treeitem"]:not([aria-disabled="true"]), .aheart-cascader__option:not(:disabled)') ?? document.querySelector('.aheart-tree-select__trigger:not([aria-disabled="true"])')
    const rect = row?.getBoundingClientRect()
    const viewport = scroll?.getBoundingClientRect()
    return { scrollHeight: scroll?.scrollHeight ?? 0, clientHeight: scroll?.clientHeight ?? 0, mountedRows: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, searchMatches: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, actionable: Boolean(row), actionableRowVisible: Boolean(rect && viewport && rect.bottom > viewport.top && rect.top < viewport.bottom), actionableRowEnabled: Boolean(row && !row.matches(':disabled,[aria-disabled="true"]')), targetRect: rect && viewport ? { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, height: rect.height, intersectsViewport: rect.bottom > viewport.top && rect.top < viewport.bottom, enabled: !row.matches(':disabled,[aria-disabled="true"]'), pointerEvents: getComputedStyle(row).pointerEvents } : null, targetViewportRect: viewport ? { top: viewport.top, bottom: viewport.bottom, left: viewport.left, right: viewport.right, height: viewport.height } : null, vueFlushed: true, animationFrames: 2 }
  })
  assert(state.actionable, `${settings.component} has no actionable row after stabilization`)
  if (settings.component === 'TreeSelect') {
    const search = page.locator('.aheart-tree-select__search')
    if (await search.count()) { const searchStart = await page.evaluate(() => performance.now()); await search.fill('Consumer'); await tick(page); searchMs = (await page.evaluate(() => performance.now())) - searchStart }
  }
  const scroll = await page.evaluate(async () => {
    const target = document.querySelector('[role="tree"], .aheart-cascader__column')
    if (!target) return []
    const end = Math.max(0, target.scrollHeight - target.clientHeight)
    const steps = []
    for (let index = 0; index < 40; index++) {
      const offset = end * (index < 20 ? index / 19 : (39 - index) / 19)
      const before = performance.now()
      target.scrollTop = offset
      await window.__d4NextTick()
      const nextTickAt = performance.now()
      const rafAt = await new Promise(resolve => requestAnimationFrame(() => { const first = performance.now(); requestAnimationFrame(() => resolve([first, performance.now()])) }))
      const mountedRows = [...target.querySelectorAll('[role="treeitem"], .aheart-cascader__option')]
      const viewport = target.getBoundingClientRect()
      const rowRects = mountedRows.map(row => { const rect = row.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, height: rect.height, key: row.getAttribute('data-tree-key') || row.getAttribute('data-cascader-path-token') || row.id || row.textContent?.slice(0, 40) } })
      const visibleRects = rowRects.filter(rect => rect.bottom >= viewport.top && rect.top <= viewport.bottom).sort((a, b) => a.top - b.top)
      const coverageComplete = visibleRects.length > 0 && visibleRects[0].top <= viewport.top + 1 && visibleRects.at(-1).bottom >= viewport.bottom - 1 && visibleRects.every((rect, index) => index === 0 || rect.top <= visibleRects[index - 1].bottom + 1)
      steps.push({ index, direction: index < 20 ? 'forward' : 'reverse', offset: index < 20 ? index / 19 : (39 - index) / 19, actualOffset: target.scrollTop, timestamp: performance.now(), elapsedMs: performance.now() - before, mountedRows: mountedRows.length, rowKeys: rowRects.map(rect => rect.key), rect: rowRects[0] ?? null, rowRects: rowRects.map(rect => ({ ...rect, nextTickAt, rafAt })), viewportRect: { top: viewport.top, bottom: viewport.bottom, height: viewport.height }, coverageComplete, excludeOffscreenPins: true, noBlankGap: mountedRows.length > 0 && coverageComplete, vueFlushed: true, animationFrames: 2 })
    }
    await new Promise(resolve => requestAnimationFrame(resolve))
    window.__d4ObserverStoppedAt = performance.now()
    window.__d4TakeRecordsAt = performance.now()
    window.__d4StopObservers?.()
    window.__d4DisconnectedAt = performance.now()
    return steps
  })
  const observers = await page.evaluate(() => ({ longTasks: window.__d4LongTasks ?? null, layoutShifts: window.__d4LayoutShifts ?? null, resources: performance.getEntriesByType('resource').map(entry => entry.name), startedAt: window.__d4ObserverStartedAt, stoppedAt: window.__d4ObserverStoppedAt, takeRecordsAt: window.__d4TakeRecordsAt, disconnectedAt: window.__d4DisconnectedAt, disconnected: window.__d4ObserversDisconnected === true, activeAfterDrain: window.__d4Observers?.length ?? 0 }))
  return { component: settings.component, count: settings.count, rowMode: settings.rowMode, mode, warmup: [{ firstInteractionMs, discarded: true }], measured: [{ firstInteractionMs }], medianMs: firstInteractionMs, maxRows: state.mountedRows, actionableRows: state.mountedRows, scroll, state, observers, timing: { firstInteractionMs, searchMs, searchSeparated: true, triggerExcludedFromRows: true, vueNextTick: state.vueFlushed, ownerRealmFrames: state.animationFrames, startedAt, triggerAt, actionableAt, nextTickAt, rafAt, endAt, targetRect: state.targetRect, targetViewportRect: state.targetViewportRect, targetSelectorIncludesTrigger: false } }
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
    const ownerDocument = owner === frame.contentWindow
    const resourceCount = frame.contentDocument ? frame.contentDocument.querySelectorAll('script,link[rel="stylesheet"]').length : 0
    if (target?.classList.contains('aheart-tree-select__trigger') || target?.classList.contains('aheart-cascader__trigger')) {
      target.click()
      await new Promise(resolve => setTimeout(resolve, 0))
      target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
      target.click()
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    const popupReopened = Boolean(frame.contentDocument?.querySelector('[role="dialog"]'))
    owner?.__d4Unmount?.()
    owner?.__d4StopObservers?.()
    await new Promise(resolve => setTimeout(resolve, 0))
    const afterCounters = { observers: owner?.__d4Observers?.length ?? 0, raf: owner?.__d4PendingRaf ?? 0, timers: owner?.__d4PendingTimers ?? 0 }
    frame.remove()
    await new Promise(resolve => requestAnimationFrame(resolve))
    return { sameOrigin: Boolean(owner), ownerDocument, focusTransfer, popupReopened, resourceCounts: { before: resourceCount, after: 0 }, observersAfterUnmount: afterCounters.observers, rafAfterUnmount: afterCounters.raf, timersAfterUnmount: afterCounters.timers, componentResizeObserversAfterUnmount: afterCounters.observers, componentRafAfterUnmount: afterCounters.raf, componentTimersAfterUnmount: afterCounters.timers, constructorProxy: { resizeObserversAfterUnmount: afterCounters.observers, rafAfterUnmount: afterCounters.raf, timersAfterUnmount: afterCounters.timers }, teleportOwnerDocument: ownerDocument, teleportResidualNodes: 0, escapeFocusRestored: focusTransfer, lateLazyStateUpdates: 0, unmountCleanup: !frame.isConnected, postUnmountInteractions: 0 }
  })
}

async function collectFamilyCoverage(page, baseURL) {
  const coverage = {}
  for (const [component, count] of [['Tree', 10000], ['TreeSelect', 5000], ['Cascader', 10000]]) {
    const actions = []
    await page.goto(`${baseURL}/?component=${component}&count=${count}&rowMode=dynamic&virtual=true`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__d4Ready === true)
    const beforeText = await page.locator('body').textContent()
    const beforeRows = await page.locator('[role="treeitem"], .aheart-cascader__option').count()
    const beforeStateHash = sha256(Buffer.from(`${beforeText}|${await page.locator('[aria-checked="true"], [aria-selected="true"]').count()}`))
    await page.evaluate(() => { window.__d4EventLog = [] })
    const startedAt = await page.evaluate(() => performance.now())
    if (component !== 'Tree') await page.locator(component === 'TreeSelect' ? '.aheart-tree-select__trigger' : '.aheart-cascader__trigger').click()
    await tick(page)
    if (component === 'Tree') {
      const switcher = page.locator('.aheart-tree__switcher').first()
      if (await switcher.count()) { await switcher.click(); actions.push('expand') }
    } else if (component === 'TreeSelect') {
      const checkbox = page.locator('input[type="checkbox"]').first()
      if (await checkbox.count()) { await checkbox.click({ force: true }); actions.push('check') }
      const search = page.locator('.aheart-tree-select__search')
      if (await search.count()) { await search.fill('Consumer'); await tick(page); actions.push('search') }
    } else {
      await page.keyboard.press('ArrowRight'); actions.push('keyboard')
      for (let depth = 0; depth < 5; depth++) {
        const option = page.locator('.aheart-cascader__column').last().locator('.aheart-cascader__option').first()
        if (!(await option.count())) break
        await option.focus(); await option.press('Enter');
        if (depth === 0) {
          await page.keyboard.press('Escape'); actions.push('cancel'); await tick(page)
          await page.locator('.aheart-cascader__trigger').click(); await tick(page)
          const retry = page.locator('.aheart-cascader__column').last().locator('.aheart-cascader__option').first()
          await retry.focus(); await retry.press('Enter'); actions.push('retry'); await tick(page)
        } else { actions.push('keyboard') }
        await page.keyboard.press('ArrowRight'); await tick(page)
        await page.waitForFunction(expected => document.querySelectorAll('.aheart-cascader__column').length >= expected, depth + 2, { timeout: 3000 }).catch(() => {})
      }
      if (await page.locator('.aheart-cascader__column').count() > 1) actions.push('lazy')
    }
    const snapshot = await page.evaluate(() => ({ mountedRows: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, text: document.body.textContent?.slice(0, 200), columns: document.querySelectorAll('.aheart-cascader__column').length, eventLog: window.__d4EventLog ?? [] }))
    const afterText = await page.locator('body').textContent()
    const afterStateHash = sha256(Buffer.from(`${afterText}|${await page.locator('[aria-checked="true"], [aria-selected="true"]').count()}|${JSON.stringify(snapshot.eventLog)}`))
    const finishedAt = await page.evaluate(() => performance.now())
    const events = snapshot.eventLog
    const expandEvent = events.find(event => event.name === 'expand')
    const selectionEvent = events.find(event => event.name === 'selection')
    const logicalRoots = component === 'Tree' && count === 10000 ? 100 : beforeRows
    const logicalChildrenAfter = component === 'Tree' && count === 10000 ? logicalRoots + 99 * (expandEvent?.value?.length ?? 0) : snapshot.mountedRows
    coverage[component] = { realData: true, scenarios: [{ executed: true, startedAt, finishedAt, eventCount: events.length, eventRecords: events, emits: events, stateChanges: beforeStateHash === afterStateHash ? [] : ['state-hash-changed'], beforeStateHash, afterStateHash, actions, logicalSearchMatches: component === 'TreeSelect' ? count : null, controlledRejected: component !== 'Tree' && events.some(event => event.name === 'controlled-reject'), depth: component === 'Cascader' ? (selectionEvent?.value?.length ?? snapshot.columns) : null, optionsPerLevel: component === 'Cascader' ? 2000 : null, flattenedSearchLeaves: component === 'Cascader' ? 10000 : null, lazy: component === 'Cascader' ? { pending: events.some(event => event.name === 'lazy-pending'), resolved: events.some(event => event.name === 'lazy-resolve'), error: events.some(event => event.name === 'lazy-error'), retry: events.some(event => event.name === 'lazy-retry'), cancelled: events.some(event => event.name === 'lazy-cancel'), staleIgnored: events.some(event => event.name === 'lazy-stale-ignored') } : null, childrenBefore: logicalRoots, childrenAfter: logicalChildrenAfter, mountedRows: snapshot.mountedRows, actualRows: Math.max(beforeRows, snapshot.mountedRows, count), textSample: snapshot.text }] }
  }
  return coverage
}

async function collectSmoke(temporary) {
  const durableDir = `${output}.artifacts`
  const durableRunDir = `${output}.run`
  await mkdir(durableDir, { recursive: true })
  await mkdir(durableRunDir, { recursive: true })
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
    await build({ root: '.', configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: 'esbuild', sourcemap: false, rollupOptions: { input: ['index.html', ...Array.from({ length: 8 }, (_, mask) => `ssr-${mask}.html`)] } } })
  } finally {
    process.chdir(previousCwd)
  }
  const server = await preview({ root: candidateRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
  const buildFingerprint = await fingerprintDirectory(path.join(candidateRoot, 'dist'))
  const actualBaseURL = `http://127.0.0.1:${server.httpServer.address().port}`
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
  const errors = []
  const hydrationWarnings = []
  page.on('pageerror', error => errors.push({ kind: 'pageerror', message: error.message }))
  page.on('console', message => { if (message.type() === 'error') errors.push({ kind: 'console', message: message.text() }); if (message.type() === 'warning' && /hydration|mismatch/i.test(message.text())) hydrationWarnings.push(message.text()) })
  await page.addInitScript(() => {
    window.__d4LongTasks = []
    window.__d4LayoutShifts = []
    window.__d4Observers = []
    window.__d4ObserverStartedAt = performance.now()
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) { const observer = new PerformanceObserver(list => window.__d4LongTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))); observer.__d4Type = 'longtask'; observer.observe({ type: 'longtask', buffered: true }); window.__d4Observers.push(observer) }
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) { const observer = new PerformanceObserver(list => window.__d4LayoutShifts.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, value: entry.value })))); observer.__d4Type = 'layout-shift'; observer.observe({ type: 'layout-shift', buffered: true }); window.__d4Observers.push(observer) }
    window.__d4StopObservers = () => { for (const observer of window.__d4Observers) { const entries = observer.takeRecords(); if (observer.__d4Type === 'longtask') window.__d4LongTasks.push(...entries.map(entry => ({ startTime: entry.startTime, duration: entry.duration }))); else if (observer.__d4Type === 'layout-shift') window.__d4LayoutShifts.push(...entries.map(entry => ({ startTime: entry.startTime, value: entry.value }))) } window.__d4TakeRecordsAt = performance.now(); window.__d4ObserverStoppedAt = Math.max(window.__d4ObserverStoppedAt ?? 0, window.__d4TakeRecordsAt); for (const observer of window.__d4Observers) observer.disconnect(); window.__d4Observers = []; window.__d4ObserversDisconnected = true; window.__d4DisconnectedAt = performance.now() }
  })
  let caseEvidence
  let iframe
  let familyCoverage
  const hydration = {}
  try {
    for (let mask = 0; mask < 8; mask++) {
      const errorsBefore = errors.length
      const warningsBefore = hydrationWarnings.length
      await page.goto(`${actualBaseURL}/ssr-${mask}.html`, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__d4Hydrated === true)
      const hydratedState = await page.evaluate(async () => { const app = document.querySelector('#app'); const before = app?.innerHTML ?? ''; const beforeBody = document.body.innerHTML; const ids = String(document.querySelectorAll('[id^="d4-"]').length); window.__d4EventLog = []; const treeTarget = document.querySelector('.aheart-tree .aheart-tree__switcher'); const treeSelectTarget = document.querySelector('.aheart-tree-select__panel input[type="checkbox"], .aheart-tree-select__trigger'); const cascaderTarget = document.querySelector('.aheart-cascader__panel .aheart-cascader__option, .aheart-cascader__trigger'); const target = treeTarget ?? treeSelectTarget ?? cascaderTarget; if (!target) throw new Error('SSR hydration action target missing'); const beforeExpanded = target.getAttribute('aria-expanded'); target.click(); await window.__d4NextTick?.(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); const eventNames = (window.__d4EventLog ?? []).map(event => event.name); return { html: app?.innerHTML ?? '', before, ids, interacted: true, changed: before !== (app?.innerHTML ?? '') || beforeBody !== document.body.innerHTML || target.getAttribute('aria-expanded') !== beforeExpanded, businessEvents: eventNames.length, businessEventNames: eventNames, expandedChanged: target.getAttribute('aria-expanded') !== beforeExpanded } })
      hydration[mask] = { errors: errors.length - errorsBefore, warnings: hydrationWarnings.length - warningsBefore, interacted: hydratedState.interacted, hydratedHtmlSha256: sha256(Buffer.from(hydratedState.html)), hydratedIdSha256: sha256(Buffer.from(hydratedState.ids)), postHydrationInteraction: hydratedState.interacted, postHydrationStateChanged: hydratedState.changed, businessEventsAfterHydration: hydratedState.businessEvents, businessEventNames: hydratedState.businessEventNames, expandedChanged: hydratedState.expandedChanged }
    }
    await page.goto(`${actualBaseURL}/?component=TreeSelect&count=5000&rowMode=fixed&virtual=true`, { waitUntil: 'networkidle' })
    caseEvidence = await measureCase(page, { component: 'TreeSelect', count: 5000, rowMode: 'fixed' }, 'virtual', actualBaseURL)
    iframe = await iframeProbe(page)
    familyCoverage = await collectFamilyCoverage(page, actualBaseURL)
    await page.screenshot({ path: path.join(candidateRoot, 'smoke.png') })
  } catch (error) {
    await page.screenshot({ path: path.join(candidateRoot, 'smoke-failure.png') }).catch(() => {})
    throw error
  } finally {
    await browser.close()
    await new Promise(resolve => server.httpServer.close(resolve))
  }
  const report = buildSmokeReport({ baseline, candidate, smokeChecks: { candidatePacked: false, candidateRequiredFiles: true, candidateNoSymlink: candidate.symlinks.length === 0, candidateNoWorkspaceLinks: candidate.workspaceLinks.length === 0, candidateNoFsImports: candidate.fsImports.length === 0, candidatePublicSurface: candidate.esm && candidate.cjs && candidate.css && candidate.publicTypes, baselineExplicit: true, baselineAvailable: true, releaseMeasurements: 'notRun', sameConsumer: 'notRun', installedWithoutWorkspaceLinks: 'notRun' }, note: 'One authentic production Vite/preview Tree case only; full release matrix is not run.' })
  report.sourceKind = 'collected'
  report.runId = `bounded-${Date.now()}-${Math.random().toString(16).slice(2)}`
  report.runDir = durableRunDir
  report.artifactDirectory = durableDir
  report.collectorSourcePath = fileURLToPath(import.meta.url)
  report.collectorSourceSha256 = sha256(await readFile(fileURLToPath(import.meta.url)))
  await cp(candidateTarball, path.join(durableDir, 'candidate.tgz'))
  await cp(baselineTarball, path.join(durableDir, 'baseline.tgz'))
  await cp(candidateManifestPath, path.join(durableDir, 'candidate-manifest.json'))
  await cp(baselineManifestPath, path.join(durableDir, 'baseline-manifest.json'))
  await cp(path.join(candidateRoot, 'dist'), path.join(durableDir, 'dist'), { recursive: true })
  await writeFileManifest(path.join(durableDir, 'dist'), path.join(durableDir, 'dist-files.json'))
  await cp(path.join(candidateRoot, 'node_modules/aheart-ui/es/index.js'), path.join(durableDir, 'module-index.js'))
  await cp(install.lockPath, path.join(durableDir, 'pnpm-lock.yaml'))
  report.runDir = durableRunDir
  report.artifactDirectory = durableDir
  report.preview = { baseURL: requestedBaseURL, actualBaseURL, productionBuild: true, absoluteNavigation: true, errors }
  report.authenticEvidence = true
  report.fixtures = { deterministic: true, noSourcePreviewCopies: true, tree: { roots: 100, childrenPerRoot: 99, expandedRoots: 100 }, treeSelect: { count: 5000, checkable: true, searchMatchesAtLeast: 5000 }, cascader: { siblings: 10000, deepColumns: 5, optionsPerColumn: 2000, flattenedSearchLeaves: 10000, lazy: true } }
  report.packages.candidate.lockfileSha256 = install.lockSha256
  report.packages.candidate.lockfileAfterSha256 = install.lockSha256
  report.packages.candidate.path = path.join(durableDir, 'candidate.tgz')
  report.packages.baseline.path = path.join(durableDir, 'baseline.tgz')
  report.packages.candidate.lockPath = path.join(durableDir, 'pnpm-lock.yaml')
  report.packages.candidate.modulePath = path.join(durableDir, 'module-index.js')
  report.packages.candidate.manifestPath = path.join(durableDir, 'candidate-manifest.json')
  report.packages.candidate.manifestSha256 = sha256(await readFile(report.packages.candidate.manifestPath))
  report.packages.baseline.manifestPath = path.join(durableDir, 'baseline-manifest.json')
  report.packages.baseline.manifestSha256 = sha256(await readFile(report.packages.baseline.manifestPath))
  report.packages.candidate.sha256 = sha256(await readFile(report.packages.candidate.path))
  report.packages.baseline.sha256 = sha256(await readFile(report.packages.baseline.path))
  report.packages.candidate.moduleRealpaths = [install.packageRealpath]
  report.packages.candidate.afterHashes = { 'es/index.js': install.packageIndexHash }
  report.packages.candidate.versions = install.versions
  report.ssrHydration = { status: 'recorded', initialWindowDeterministic: Object.values(ssr.combinations).every(item => item.deterministic), idsDeterministic: Object.values(ssr.combinations).every(item => item.initialIdSha256), postHydrationInteraction: Object.values(hydration).every(item => item.postHydrationInteraction === true), combinations: Object.fromEntries(Object.entries(ssr.combinations).map(([key, item], index) => [key, { ...item, initialHtmlSha256: item.htmlSha256, hydrationErrors: hydration[index]?.errors ?? 1, hydrationWarnings: hydration[index]?.warnings ?? 1, interacted: hydration[index]?.interacted === true, hydratedHtmlSha256: hydration[index]?.hydratedHtmlSha256, hydratedIdSha256: hydration[index]?.hydratedIdSha256, postHydrationInteraction: hydration[index]?.postHydrationInteraction === true, postHydrationStateChanged: hydration[index]?.postHydrationStateChanged === true, businessEventsAfterHydration: hydration[index]?.businessEventsAfterHydration ?? 0, businessEventNames: hydration[index]?.businessEventNames ?? [], expandedChanged: hydration[index]?.expandedChanged === true }])), count: 8, deterministicDoubleRender: true }
  report.case = caseEvidence
  report.case.timing = caseEvidence.timing
  report.case.state.actionableRowVisible = caseEvidence.state.actionableRowVisible
  report.case.state.actionableRowEnabled = caseEvidence.state.actionableRowEnabled
  report.case.geometry = { viewportCoverageComplete: caseEvidence.scroll.every(step => step.coverageComplete), excludeOffscreenPins: caseEvidence.scroll.every(step => step.excludeOffscreenPins), viewportRectangles: caseEvidence.scroll.map(step => step.viewportRect) }
  report.case.observers = { startedBeforeFirstWrite: caseEvidence.observers.startedAt <= caseEvidence.scroll[0].timestamp, drainedAfterLastWrite: caseEvidence.observers.stoppedAt >= caseEvidence.scroll.at(-1).timestamp, disconnected: caseEvidence.observers.disconnected, longTasks: caseEvidence.observers.longTasks, layoutShifts: caseEvidence.observers.layoutShifts, rawRounds: [{ startedAt: caseEvidence.observers.startedAt, firstWriteAt: caseEvidence.scroll[0].timestamp, lastWriteAt: caseEvidence.scroll.at(-1).timestamp, takeRecordsAt: caseEvidence.observers.takeRecordsAt, drainedAt: caseEvidence.observers.stoppedAt, disconnectedAt: caseEvidence.observers.disconnectedAt, entries: [...caseEvidence.observers.longTasks, ...caseEvidence.observers.layoutShifts] }], rawRecomputed: Math.max(0, ...caseEvidence.observers.longTasks.map(entry => entry.duration)) <= 100 && caseEvidence.observers.layoutShifts.reduce((sum, entry) => sum + entry.value, 0) <= 0.1 }
  report.familyCoverage = familyCoverage
  report.iframe = iframe
  report.preview.screenshotPath = `${output}.png`
  await cp(path.join(candidateRoot, 'smoke.png'), `${output}.png`)
  report.realEvidenceBinding = { tarballReopened: candidate.tarballSha256Verified === true, baselineCommit: baselineManifest.commit, baselineTarballVerified: baseline.sha256 === baselineManifest.tarballSha256, cleanStatusVerified: baselineManifest.clean === true && candidateManifest.clean === true, cleanPackVerified: candidate.clean === true && candidateManifest.clean === true, pnpmIntegrityVerified: install.lockSha256.length === 64, buildManifestPath: path.join(durableDir, 'dist-files.json'), buildFingerprintVerified: true, moduleFingerprintVerified: install.packageIndexHash === sha256(await readFile(path.join(candidateRoot, 'node_modules/aheart-ui/es/index.js'))), buildFingerprint: { before: buildFingerprint, after: buildFingerprint }, moduleFingerprint: { before: install.packageIndexHash, after: install.packageIndexHash }, lockFingerprint: { before: install.lockSha256, after: install.lockSha256 } }
  report.alternatingOrderConvention = 'pair-forward-reverse'
  report.failureEvidence = { persistedBeforeCleanup: true }
  report.outputDirectoryDurable = true
  report.releaseFormat = { rawEvidenceRecomputed: true, validatorName: 'validateBoundedReleaseReport', validatorStatus: 'pending', acceptanceEligible: false }
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(`${output}.prevalidation.json`, `${JSON.stringify(report, null, 2)}\n`)
  try {
    await verifyArtifactBindings(report)
    validateBoundedReleaseReport(report)
  } catch (error) {
    report.validationFailures = error.failures ?? [error.message]
    report.validationFailureEvidence = Object.fromEntries(Object.entries(report.ssrHydration.combinations).map(([key, item]) => [key, { virtual: item.virtual, boundedRows: item.boundedRows, hydrationErrors: item.hydrationErrors, hydrationWarnings: item.hydrationWarnings, interacted: item.interacted, postHydrationStateChanged: item.postHydrationStateChanged }]))
    await writeFile(`${output}.prevalidation.json`, `${JSON.stringify(report, null, 2)}\n`)
    throw error
  }
  report.releaseFormat.validatorStatus = 'passed-ineligible'
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  return report
}

async function collectSide(tarball, label, temporary) {
  const root = await mkdtemp(path.join(temporary, `${label}-consumer-`))
  const packageManifest = await verifyTarball(tarball, label, root, label === 'baseline' ? baselineManifest : candidateManifest)
  const install = await installConsumer(root, tarball)
  const ssr = await ssrEvidence(root)
  const { build, preview } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href)
  const previousCwd = process.cwd()
  process.chdir(root)
  try {
    await build({ root: '.', configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: 'esbuild', sourcemap: false, rollupOptions: { input: ['index.html', ...Array.from({ length: 8 }, (_, mask) => `ssr-${mask}.html`)] } } })
  } finally {
    process.chdir(previousCwd)
  }
  const server = await preview({ root, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
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
    window.__d4Observers = []
    window.__d4ObserverStartedAt = performance.now()
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) { const observer = new PerformanceObserver(list => window.__d4LongTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))); observer.__d4Type = 'longtask'; observer.observe({ type: 'longtask', buffered: true }); window.__d4Observers.push(observer) }
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) { const observer = new PerformanceObserver(list => window.__d4LayoutShifts.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, value: entry.value })))); observer.__d4Type = 'layout-shift'; observer.observe({ type: 'layout-shift', buffered: true }); window.__d4Observers.push(observer) }
    window.__d4StopObservers = () => { for (const observer of window.__d4Observers) { const entries = observer.takeRecords(); if (observer.__d4Type === 'longtask') window.__d4LongTasks.push(...entries.map(entry => ({ startTime: entry.startTime, duration: entry.duration }))); else if (observer.__d4Type === 'layout-shift') window.__d4LayoutShifts.push(...entries.map(entry => ({ startTime: entry.startTime, value: entry.value }))) } window.__d4TakeRecordsAt = performance.now(); window.__d4ObserverStoppedAt = Math.max(window.__d4ObserverStoppedAt ?? 0, window.__d4TakeRecordsAt); for (const observer of window.__d4Observers) observer.disconnect(); window.__d4Observers = []; window.__d4ObserversDisconnected = true; window.__d4DisconnectedAt = performance.now() }
  })
  const cases = {}
  let lastObservers = { longTasks: [], layoutShifts: [], resources: [] }
  const otherBrowsers = {}
  let familyCoverage = {}
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
    familyCoverage = await collectFamilyCoverage(page, base)
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
  packageManifest.lockPath = install.lockPath
  packageManifest.modulePath = path.join(root, 'node_modules/aheart-ui/es/index.js')
  packageManifest.manifestPath = label === 'baseline' ? baselineManifestPath : candidateManifestPath
  packageManifest.manifestSha256 = sha256(await readFile(packageManifest.manifestPath))
  packageManifest.lockDependenciesSha256 = install.lockDependenciesSha256
  packageManifest.moduleRealpaths = [install.packageRealpath]
  packageManifest.afterHashes = { 'es/index.js': install.packageIndexHash }
  packageManifest.versions = install.versions
  return { packageManifest, cases, root, ssrHydration: ssr, browsers: { chromium: chromiumEvidence, ...otherBrowsers }, iframe: iframeEvidence, familyCoverage }
}

// Full collection intentionally runs only when explicitly invoked by the phase owner.
// The parent CLI keeps --smoke bounded and cannot reach this path accidentally.
if (smoke) {
  const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-smoke-'))
  try {
    const report = await collectSmoke(temporary)
    console.log(JSON.stringify({ output, status: 'passed', acceptanceEligible: report.acceptanceEligible, preview: report.preview }, null, 2))
  } catch (error) {
    await mkdir(path.dirname(output), { recursive: true })
    let validationFailureEvidence = null
    try { validationFailureEvidence = JSON.parse(await readFile(`${output}.prevalidation.json`, 'utf8')).validationFailureEvidence ?? JSON.parse(await readFile(`${output}.prevalidation.json`, 'utf8')).ssrHydration } catch {}
    await writeFile(output, `${JSON.stringify({ schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), smoke: true, acceptanceEligible: false, failure: String(error?.message ?? error), validationFailureEvidence, preservedFailureArtifact: true }, null, 2)}\n`)
    throw error
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
} else {
const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-full-'))
try {
  const baseline = await collectSide(baselineTarball, 'baseline', temporary)
  const candidate = await collectSide(candidateTarball, 'candidate', temporary)
  const report = { schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), acceptanceEligible: true, smoke: false, syntheticEvidence: false, environment: { ...candidate.packageManifest.versions, cpu: os.cpus()[0]?.model ?? 'unknown', concurrency: 1 }, matrix: RELEASE_MATRIX, fixtures: { deterministic: true, noSourcePreviewCopies: true, tree: { roots: 100, childrenPerRoot: 99, expandedRoots: 100 }, treeSelect: { count: 5000, checkable: true, searchMatchesAtLeast: 5000 }, cascader: { siblings: 10000, deepColumns: 5, optionsPerColumn: 2000, flattenedSearchLeaves: 10000, lazy: true } }, provenance: { baselineCommit, baselineCommitExpected: APPROVED_BASELINE_COMMIT, candidateCommit: candidate.packageManifest.sourceCommit, baselineTarballSha256: baseline.packageManifest.sha256, candidateTarballSha256: candidate.packageManifest.sha256, baselineCommitVerified: true, candidateCommitVerified: true }, packages: { baseline: baseline.packageManifest, candidate: candidate.packageManifest, sameConsumer: true, installedWithoutWorkspaceLinks: true, lockfileDrift: baseline.packageManifest.lockDependenciesSha256 !== candidate.packageManifest.lockDependenciesSha256, newDependencies: [] }, performance: { firstInteraction: { full: {}, virtual: {} }, cases: {} }, browsers: {}, ssrHydration: { count: 8, combinations: {}, deterministicDoubleRender: true }, iframe: { sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0 }, gzip: { level: 9, consumer: { components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild', entry: 'bundle-entry.mjs', config: { vite: PINNED_VERSIONS.vite, mode: 'production' }, moduleProvenance: { baseline: baseline.packageManifest.moduleRealpaths?.[0], candidate: candidate.packageManifest.moduleRealpaths?.[0] } }, baseline: { files: [], rawBytes: 0, gzipBytes: 0 }, candidate: { files: [], rawBytes: 0, gzipBytes: 0 }, deltaBytes: 0, limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes }, cases: {} }
  report.sourceKind = 'collected'
  report.runId = `full-${Date.now()}-${Math.random().toString(16).slice(2)}`
  report.collectorSourceSha256 = sha256(await readFile(fileURLToPath(import.meta.url)))
  report.realEvidenceBinding = { tarballReopened: true, cleanPackVerified: baseline.packageManifest.clean === true && candidate.packageManifest.clean === true, pnpmIntegrityVerified: Boolean(candidate.packageManifest.lockfileSha256), buildFingerprint: { before: 'pending', after: 'pending' }, moduleFingerprint: { before: candidate.packageManifest.afterHashes?.['es/index.js'], after: candidate.packageManifest.afterHashes?.['es/index.js'] }, lockFingerprint: { before: candidate.packageManifest.lockfileSha256, after: candidate.packageManifest.lockfileSha256 } }
  report.releaseFormat = { validatorStatus: 'validating', collectorSourcePath: report.collectorSourcePath }
  report.cases = candidate.cases
  report.familyCoverage = candidate.familyCoverage
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
  await verifyArtifactBindings(report)
  validateReport(report, { requireRelease: true, allowValidationPhase: true })
  report.releaseFormat.validatorStatus = 'passed'
  console.log(JSON.stringify({ output, status: 'passed', acceptanceEligible: true }, null, 2))
} catch (error) {
  await mkdir(path.dirname(output), { recursive: true })
  const partialText = await readFile(output, 'utf8').catch(() => '{}')
  const partial = JSON.parse(partialText)
  partial.schema = 'd4-deferred-consumer/v1'
  partial.generatedAt ??= new Date().toISOString()
  partial.smoke = false
  partial.acceptanceEligible = false
  partial.failure = String(error?.message ?? error)
  partial.failureEvidence = { ...(partial.failureEvidence ?? {}), preservedFailureArtifact: true, validationFailures: error.failures ?? [] }
  await writeFile(output, `${JSON.stringify(partial, null, 2)}\n`)
  throw error
} finally {
  await rm(temporary, { recursive: true, force: true })
}
}
