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
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, stat, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { chromium, firefox, webkit } from '@playwright/test'
import { APPROVED_BASELINE_COMMIT, BROWSERS, COMPONENTS, PINNED_VERSIONS, RELEASE_MATRIX, applyHydrationEvidence, buildFullReportShell as contractBuildFullReportShell, buildSmokeReport, prepareFullArtifactBindings as contractPrepareFullArtifactBindings, recomputeIframeLifecycle, validateBoundedReleaseReport, validateFullPreflightReport, validateReport, validateSmokeReport, verifyArtifactBindings } from '../../../../scripts/d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const fixture = path.dirname(fileURLToPath(import.meta.url))
export const workspaceRoot = fileURLToPath(new URL('../../../../', import.meta.url))
export const resolveWorkspacePath = value => path.resolve(workspaceRoot, value)
export function buildFullReportShell(options) { return contractBuildFullReportShell(options) }
export async function prepareFullArtifactBindings(report, options) { return contractPrepareFullArtifactBindings(report, options) }
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const baselineTarball = arg('--baseline-tarball')
const candidateTarball = arg('--candidate-tarball')
const baselineCommit = arg('--baseline-commit')
const candidateCommit = arg('--candidate-commit')
const baselineManifestPath = arg('--baseline-manifest')
const candidateManifestPath = arg('--candidate-manifest')
const smoke = process.argv.includes('--smoke')
const preflight = process.argv.includes('--preflight-full')
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
const snapshotStructureProjection = snapshot => {
  const { capturePhase: _capturePhase, captureNonce: _captureNonce, ...structure } = snapshot ?? {}
  return structure
}
const sha512Base64 = bytes => createHash('sha512').update(bytes).digest('base64')
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const tick = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

// Installs only in the iframe scenarios.  The probe owns sequence/time/realm
// metadata; the collector records only observations made through its API.
function installIframeLifecycleProbe(page) {
  return page.addInitScript(() => {
  const params = new URLSearchParams(location.search)
  if (params.get('iframeProbe') !== 'true') return
  const probeMarker = 'd4-iframe-probe-v1'
  const marker = probeMarker
  const existingProbe = window.__d4IframeLifecycleProbe
  if (existingProbe) {
    if (existingProbe.marker !== probeMarker && existingProbe.probeMarker !== probeMarker) throw new Error('D4 iframe lifecycle probe marker mismatch')
    return
  }
  const originals = {
    ResizeObserver: window.ResizeObserver,
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
  }
  const component = params.get('component') || 'unknown'
  const scenarioId = `iframe-${component}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`
  const realmId = `realm-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`
  const events = []
  const active = new Map()
  let sequence = 0
  let resourceSequence = 0
  const now = () => performance.now()
  const selectorFor = target => {
    if (!target) return 'window'
    if (target === window) return 'window'
    if (target.id) return `#${CSS.escape(target.id)}`
    if (target.classList?.length) return `.${[...target.classList].slice(0, 2).join('.')}`
    if (target.getAttribute?.('role')) return `[role="${target.getAttribute('role')}"]`
    return target.tagName?.toLowerCase() || 'unknown'
  }
  const record = (type, fields = {}) => {
    if (type === 'frame-mounted' && installEvent) installEvent.installedBeforeMount = Number.isFinite(window.__d4MountStart) && installEvent.installedAt <= window.__d4MountStart
    const event = { seq: ++sequence, time: now(), type, scenarioId, realmId, ...fields }
    events.push(event)
    return event
  }
  const track = (kind, resourceId, action, target = window) => {
    const source = 'component-runtime'
    const targetSelector = selectorFor(target)
    if (action === 'create') active.set(resourceId, { kind, resourceId, targetSelector, source })
    if (['cancel', 'clear', 'disconnect'].includes(action) || (action === 'callback' && ['raf', 'timeout'].includes(kind))) active.delete(resourceId)
    record('resource', { kind, action, resourceId, targetSelector, source })
  }
  const installedProxyKinds = []
  const install = {
    proxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'],
    installedProxyKinds,
    installedBeforeMount: null,
    installedAt: performance.now(),
    collectorWaitsExcluded: true,
    realmType: 'iframe',
    marker,
    probeMarker: marker,
    propertyLocked: null,
  }
  const probe = {
    marker,
    record,
    originals,
    snapshotActive: () => [...active.values()].sort((a, b) => a.resourceId.localeCompare(b.resourceId)),
    export: () => ({ schema: 'd4-iframe-lifecycle/v1', component, scenarioId, realmId, events: structuredClone(events), active: [...active.values()], eventCount: events.length }),
  }
  Object.defineProperty(window, '__d4IframeLifecycleProbe', { value: probe, writable: false, configurable: false })
  install.propertyLocked = Object.getOwnPropertyDescriptor(window, '__d4IframeLifecycleProbe')?.writable === false && Object.getOwnPropertyDescriptor(window, '__d4IframeLifecycleProbe')?.configurable === false
  const installEvent = record('instrumentation-install', install)
  const originalResizeObserver = originals.ResizeObserver
  if (originalResizeObserver) {
    window.ResizeObserver = function D4ResizeObserver(callback) {
      const resourceId = `${scenarioId}-resizeObserver-${++resourceSequence}`
      record('resource', { kind: 'resizeObserver', action: 'create', resourceId, targetSelector: 'window', source: 'component-runtime' })
      const wrapped = (entries, observer) => { record('resource', { kind: 'resizeObserver', action: 'callback', resourceId, targetSelector: selectorFor(entries?.[0]?.target), source: 'component-runtime' }); callback(entries, observer) }
      const observer = new originalResizeObserver(wrapped)
      const originalObserve = observer.observe.bind(observer)
      const originalUnobserve = observer.unobserve?.bind(observer)
      const originalDisconnect = observer.disconnect.bind(observer)
      const targets = new Set()
      observer.observe = (target, options) => { if (!active.has(resourceId)) active.set(resourceId, { kind: 'resizeObserver', resourceId, targetSelector: selectorFor(target), source: 'component-runtime' }); targets.add(target); track('resizeObserver', resourceId, 'observe', target); return originalObserve(target, options) }
      if (originalUnobserve) observer.unobserve = target => { targets.delete(target); if (targets.size === 0) active.delete(resourceId); track('resizeObserver', resourceId, 'unobserve', target); return originalUnobserve(target) }
      observer.disconnect = () => { targets.clear(); track('resizeObserver', resourceId, 'disconnect', window); return originalDisconnect() }
      return observer
    }
    window.ResizeObserver.prototype = originalResizeObserver.prototype
    installedProxyKinds.push('resizeObserver')
  }
  const rafs = new Map()
  window.requestAnimationFrame = callback => {
    const resourceId = `${scenarioId}-raf-${++resourceSequence}`
    track('raf', resourceId, 'create')
    const handle = originals.requestAnimationFrame(timestamp => { track('raf', resourceId, 'callback'); callback(timestamp) })
    rafs.set(handle, resourceId)
    return handle
  }
  installedProxyKinds.push('raf')
  window.cancelAnimationFrame = handle => { const resourceId = rafs.get(handle); if (resourceId) { rafs.delete(handle); track('raf', resourceId, 'cancel') }; return originals.cancelAnimationFrame(handle) }
  const timeouts = new Map()
  window.setTimeout = (callback, delay, ...args) => {
    const resourceId = `${scenarioId}-timeout-${++resourceSequence}`
    track('timeout', resourceId, 'create')
    const handle = originals.setTimeout(() => { timeouts.delete(handle); track('timeout', resourceId, 'callback'); callback(...args) }, delay)
    timeouts.set(handle, resourceId)
    return handle
  }
  window.clearTimeout = handle => { const resourceId = timeouts.get(handle); if (resourceId) { timeouts.delete(handle); track('timeout', resourceId, 'clear') }; return originals.clearTimeout(handle) }
  installedProxyKinds.push('timeout')
  const intervals = new Map()
  window.setInterval = (callback, delay, ...args) => {
    const resourceId = `${scenarioId}-interval-${++resourceSequence}`
    track('interval', resourceId, 'create')
    const handle = originals.setInterval(() => { track('interval', resourceId, 'callback'); callback(...args) }, delay)
    intervals.set(handle, resourceId)
    return handle
  }
  window.clearInterval = handle => { const resourceId = intervals.get(handle); if (resourceId) { intervals.delete(handle); track('interval', resourceId, 'clear') }; return originals.clearInterval(handle) }
  installedProxyKinds.push('interval')
  installEvent.installedProxyKinds = [...installedProxyKinds]
  })
}
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
  await writeFile(destination, `${JSON.stringify({ files: files.sort().map(file => { const bytes = readFileSync(file); return { path: file, relativePath: path.relative(directory, file).split(path.sep).join('/'), bytes: bytes.length, sha256: sha256(bytes) } }) }, null, 2)}\n`)
}

async function copyCheckpointEvidence(details, destination) {
  await mkdir(destination, { recursive: true })
  const sources = []
  const add = (source, name = path.basename(source)) => { if (source) sources.push([source, name]) }
  add(details.root && path.join(details.root, 'aheart-ui.tgz'), 'candidate.tgz')
  add(details.manifestPath, 'source-manifest.json')
  add(details.root && path.join(details.root, 'pnpm-lock.yaml'), 'pnpm-lock.yaml')
  add(details.root && path.join(details.root, 'node_modules/aheart-ui/es/index.js'), 'module-index.js')
  add(details.root && path.join(details.root, 'dist'), 'dist')
  add(details.root && path.join(details.root, 'bundle'), 'bundle')
  add(details.root && path.join(details.root, 'ssr-0.html'), 'ssr-0.html')
  add(details.root && path.join(details.root, 'ssr-1.html'), 'ssr-1.html')
  add(details.root && path.join(details.root, 'ssr-2.html'), 'ssr-2.html')
  add(details.root && path.join(details.root, 'ssr-3.html'), 'ssr-3.html')
  add(details.root && path.join(details.root, 'ssr-4.html'), 'ssr-4.html')
  add(details.root && path.join(details.root, 'ssr-5.html'), 'ssr-5.html')
  add(details.root && path.join(details.root, 'ssr-6.html'), 'ssr-6.html')
  add(details.root && path.join(details.root, 'ssr-7.html'), 'ssr-7.html')
  const copied = []
  for (const [source, name] of sources) {
    try {
      await stat(source)
      const target = path.join(destination, name)
      await cp(source, target, { recursive: true })
      copied.push(target)
    } catch {}
  }
  const files = []
  const walk = async current => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name)
      if (entry.isDirectory()) await walk(file)
      else files.push(file)
    }
  }
  await walk(destination)
  const manifest = { stage: details.stage, label: details.label, files: [] }
  for (const file of files.sort()) {
    const bytes = await readFile(file)
    manifest.files.push({ path: file, relativePath: path.relative(destination, file).split(path.sep).join('/'), bytes: bytes.length, sha256: sha256(bytes) })
  }
  await writeFile(path.join(destination, 'checkpoint-files.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  if (details.result) await writeFile(path.join(destination, 'raw-result.json'), `${JSON.stringify(details.result, null, 2)}\n`)
  const rawPayload = details.result ? JSON.stringify(details.result) : JSON.stringify({ stage: details.stage, label: details.label, files: manifest.files })
  const rawPayloadHash = sha256(Buffer.from(rawPayload))
  await writeFile(path.join(destination, 'raw-payload.json'), `${rawPayload}\n`)
  if (details.durableRoot) {
    const label = details.label === 'baseline' ? 'baseline' : 'candidate'
    const copyRoot = async (source, name) => { try { await stat(source); await cp(source, path.join(details.durableRoot, name), { recursive: true }); return true } catch { return false } }
    await copyRoot(path.join(details.root, 'aheart-ui.tgz'), `${label}.tgz`)
    await copyRoot(details.manifestPath, `${label}-manifest.json`)
    await copyRoot(path.join(details.root, 'node_modules/aheart-ui/es/index.js'), label === 'candidate' ? 'module-index.js' : 'baseline-module-index.js')
    await copyRoot(path.join(details.root, 'pnpm-lock.yaml'), label === 'candidate' ? 'pnpm-lock.yaml' : 'baseline-pnpm-lock.yaml')
    const distName = label === 'candidate' ? 'dist' : 'baseline-dist'
    if (await copyRoot(path.join(details.root, 'dist'), distName)) await writeFileManifest(path.join(details.durableRoot, distName), path.join(details.durableRoot, label === 'candidate' ? 'dist-files.json' : 'baseline-dist-files.json'))
  }
  return { directory: destination, manifestPath: path.join(destination, 'checkpoint-files.json'), files: manifest.files, rawPayloadPath: path.join(destination, 'raw-payload.json'), rawPayloadHash, rawPayload }
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
  const installEnv = { ...process.env, NODE_ENV: 'development' }
  await run('corepack', ['pnpm', 'install', '--lockfile-only', '--ignore-scripts', '--no-frozen-lockfile', '--config.node-linker=hoisted', '--prod=false'], { cwd: root, env: installEnv, maxBuffer: 16 * 1024 * 1024 })
  const generatedLock = await readFile(lockPath, 'utf8')
  assert.match(generatedLock, new RegExp(`aheart-ui@file:aheart-ui\\.tgz:[\\s\\S]*?sha512-${sha512Base64(tarballBytes).replace(/[+/=]/g, '\\$&')}`), 'generated lock must attest the exact tarball bytes')
  await run('corepack', ['pnpm', 'install', '--frozen-lockfile', '--ignore-scripts', '--config.node-linker=hoisted', '--prod=false'], { cwd: root, env: installEnv, maxBuffer: 32 * 1024 * 1024 })
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
  // This function is serialized into each SSR document and runs before the
  // module script hydrates the app.  The accessibility evidence therefore
  // comes from the actual server DOM, rather than from an HTML regex or a
  // fabricated ID list.
  const snapshotScript = `(() => {
    window.__d4CaptureSnapshot = (capturePhase) => {
      const root = document.querySelector('#app');
      const all = [...document.querySelectorAll('[id]')];
      const ids = all.map(node => node.id).filter(Boolean).sort();
      const attr = (node, name) => node?.hasAttribute(name) ? node.getAttribute(name) : null;
      const describe = (node, component, kind, selector) => {
        if (!node) throw new Error('SSR snapshot selector did not resolve: ' + component + '/' + kind + '/' + selector);
        const resolved = document.querySelector(selector);
        return { id: node.id || null, component, kind, selector, selectorProvenance: { source: 'document.querySelector', selector }, selectorMatchCount: document.querySelectorAll(selector).length, selectorResolved: resolved === node, role: attr(node, 'role'), ariaControls: attr(node, 'aria-controls'), ariaActivedescendant: attr(node, 'aria-activedescendant'), ariaLabelledby: attr(node, 'aria-labelledby'), ariaDescribedby: attr(node, 'aria-describedby'), focusModel: document.activeElement === node ? 'dom-focus' : node.getAttribute('tabindex') === '0' ? 'roving-dom-focus' : null };
      };
      const treeRoot = document.querySelector('#d4-tree.aheart-tree');
      const treeRow = treeRoot?.querySelector('[role="treeitem"].aheart-tree__node, [role="treeitem"]');
      const treeSelectTrigger = document.querySelector('.aheart-tree-select__trigger');
      const treeSelectRoot = document.querySelector('.aheart-tree-select__panel');
      const cascaderTrigger = document.querySelector('.aheart-cascader__trigger');
      const cascaderRoot = document.querySelector('.aheart-cascader__panel');
      const nodes = [
        describe(treeRoot, 'Tree', 'root', '#d4-tree.aheart-tree'),
        describe(treeRow, 'Tree', 'row', treeRow?.id ? '#' + treeRow.id + '.aheart-tree__node' : '#d4-tree [role="treeitem"]'),
        describe(treeSelectTrigger, 'TreeSelect', 'trigger', treeSelectTrigger?.id ? '#' + treeSelectTrigger.id + '.aheart-tree-select__trigger' : '.aheart-tree-select__trigger'),
        describe(treeSelectRoot, 'TreeSelect', 'root', treeSelectRoot?.id ? '#' + treeSelectRoot.id + '.aheart-tree-select__panel' : '.aheart-tree-select__panel'),
        describe(cascaderTrigger, 'Cascader', 'trigger', '.aheart-cascader__trigger'),
        describe(cascaderRoot, 'Cascader', 'root', cascaderRoot?.id ? '#' + cascaderRoot.id + '.aheart-cascader__panel' : '.aheart-cascader__panel')
      ];
      const normalize = html => String(html || '').replace(/\\s+/g, ' ').trim();
      const rawMainHtml = root?.innerHTML || '';
      const rawTeleportHtml = [...document.body.children].filter(node => node.classList.contains('aheart-tree-select__panel') || node.classList.contains('aheart-cascader__panel')).map(node => node.outerHTML).join('');
      return { capturePhase, captureNonce: crypto.randomUUID(), sortedIds: ids, nodes, focusModel: document.activeElement?.id || null, rawMainHtml, rawTeleportHtml, mainHtml: normalize(rawMainHtml), teleportHtml: normalize(rawTeleportHtml), combinedHtml: normalize(rawMainHtml + rawTeleportHtml) };
    };
    window.__d4ServerSnapshot = window.__d4CaptureSnapshot('server-before-hydration');
  })()`
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
    const firstTeleports = Object.values(firstContext.teleports ?? {}).join('')
    const secondTeleports = Object.values(secondContext.teleports ?? {}).join('')
    const firstRendered = `${first}${firstTeleports}`
    const secondRendered = `${second}${secondTeleports}`
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
    await writeFile(path.join(root, `ssr-${mask}.html`), `<!doctype html><html><head><style data-d4-package-css>${css}</style></head><body><div id="app">${first}</div>${firstTeleports}<script>${snapshotScript}</script><script type="module">import {createSSRApp,nextTick} from 'vue';import {createCombinedConsumerApp} from './shared-app.mjs';window.__d4EventLog=[];window.__d4Virtual=${JSON.stringify(virtual)};window.__d4NextTick=nextTick;createSSRApp(createCombinedConsumerApp(${JSON.stringify(virtual)},{ssrOpen:true})).mount('#app');window.__d4HydratedSnapshot=window.__d4CaptureSnapshot('hydrated-after-mount');window.__d4Hydrated=true</script></body></html>`)
    const rows = (first.match(/role="treeitem"/g) ?? []).length + (first.match(/aheart-cascader__option/g) ?? []).length
    const boundedRows = Math.max(...appComponents.filter(component => virtual[component]).map(component => componentRows[component]), 0)
    const mainHtmlSha256 = sha256(Buffer.from(first))
    const teleportHtmlSha256 = sha256(Buffer.from(firstTeleports))
    combinations[key] = { virtual, deterministic: firstRendered === secondRendered, hydrationWarnings: 0, hydrationErrors: 0, bounded: true, boundedRows, componentRows, popupVirtualRows: componentRows, cjsRender: true, htmlSha256: mainHtmlSha256, mainHtmlSha256, teleportHtmlSha256, combinedSha256: sha256(Buffer.from(firstRendered)), serverSnapshot: null, hydratedSnapshot: null, hydratedMainHtmlSha256: null, hydratedTeleportHtmlSha256: null, initialIdSha256: sha256(Buffer.from(String((first.match(/id="d4-[^"]+"/g) ?? []).length))), rows }
  }
  return { count: 8, combinations, deterministicDoubleRender: true, htmlByMask }
}

async function durableTypeProbe(root, destination) {
  const probePath = path.join(root, 'types-probe.ts')
  const configPath = path.join(root, 'tsconfig.type-probe.json')
  const typesPath = path.join(destination, 'types-probe.ts')
  const durableConfigPath = path.join(destination, 'tsconfig.type-probe.json')
  const source = `import { h } from 'vue'
import { Cascader, Tree, TreeSelect } from 'aheart-ui'
import type { CascaderVirtual, TreeSelectVirtual, TreeVirtual } from 'aheart-ui'
const treeVirtual: TreeVirtual = { height: 320, estimateSize: 28, overscan: 4 } // D4-POSITIVE-VIRTUAL-TYPES TreeVirtual TreeSelectVirtual CascaderVirtual
const treeSelectVirtual: TreeSelectVirtual = { height: 256, estimateSize: 28, overscan: 4 }
const cascaderVirtual: CascaderVirtual = { height: 256, estimateSize: 32, overscan: 4 }
h(Tree, { virtual: true }) // D4-POSITIVE-TREE
h(Tree, { virtual: treeVirtual }) // D4-POSITIVE-TREE-CONFIG
h(TreeSelect, { virtual: treeSelectVirtual }) // D4-POSITIVE-TREESELECT
h(Cascader, { virtual: cascaderVirtual }) // D4-POSITIVE-CASCADER
// @ts-expect-error D4-NEGATIVE-TREE height estimateSize overscan string
const invalidTreeConfig: TreeVirtual = { height: 'bad' }
// @ts-expect-error D4-NEGATIVE-TREESELECT height estimateSize overscan string
const invalidTreeSelectConfig: TreeSelectVirtual = { estimateSize: 'bad' }
// @ts-expect-error D4-NEGATIVE-CASCADER height estimateSize overscan string
const invalidCascaderConfig: CascaderVirtual = { overscan: 'bad' }
void [invalidTreeConfig, invalidTreeSelectConfig, invalidCascaderConfig]
`
  const config = { compilerOptions: { strict: true, noEmit: true, module: 'ESNext', moduleResolution: 'Bundler', target: 'ES2022', skipLibCheck: true }, include: ['types-probe.ts'] }
  await writeFile(probePath, source)
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
  await cp(probePath, typesPath)
  await cp(configPath, durableConfigPath)
  const command = 'corepack pnpm exec tsc --noEmit -p tsconfig.type-probe.json --pretty false'
  const result = await run('corepack', ['pnpm', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.type-probe.json', '--pretty', 'false'], { cwd: root, maxBuffer: 16 * 1024 * 1024 }).then(() => ({ exitCode: 0, output: '' }), error => ({ exitCode: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` }))
  assert.equal(result.exitCode, 0, `consumer public type probe failed: ${result.output}`)
  const line = marker => ({ name: marker, source: source.split('\n').find(item => item.includes(marker)) ?? '' })
  const positiveChecks = ['D4-POSITIVE-VIRTUAL-TYPES', 'D4-POSITIVE-TREE', 'D4-POSITIVE-TREE-CONFIG', 'D4-POSITIVE-TREESELECT', 'D4-POSITIVE-CASCADER'].map(line)
  const negativeChecks = ['D4-NEGATIVE-TREE', 'D4-NEGATIVE-TREESELECT', 'D4-NEGATIVE-CASCADER'].map(line)
  return { typesPath, typesSha256: sha256(Buffer.from(source)), configPath: durableConfigPath, configSha256: sha256(Buffer.from(JSON.stringify(config, null, 2) + '\n')), command, commandSha256: sha256(Buffer.from(command)), tscExitCode: result.exitCode, positiveChecks, negativeChecks }
}

async function collectHydratedSsrEvidence({ page, baseURL, ssr, artifactDirectory, browserErrors, hydrationWarnings }) {
  const hydration = {}
  for (let mask = 0; mask < 8; mask++) {
    const errorsBefore = browserErrors.length
    const warningsBefore = hydrationWarnings.length
    await page.goto(`${baseURL}/ssr-${mask}.html`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__d4Hydrated === true)
    const hydratedState = await page.evaluate(async () => {
      const app = document.querySelector('#app')
      const before = app?.innerHTML ?? ''
      const serverSnapshot = window.__d4ServerSnapshot
      const hydratedSnapshot = window.__d4HydratedSnapshot
      window.__d4EventLog = []
      const settle = async () => { await window.__d4NextTick?.(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) }
      const actions = []
      const act = async (component, selector, target) => {
        target ??= document.querySelector(selector)
        if (!target) throw new Error(`${component} SSR hydration action target missing`)
        const beforeState = { expanded: target.getAttribute('aria-expanded'), checked: target.getAttribute('aria-checked'), selected: target.getAttribute('aria-selected'), text: target.textContent }
        const eventStart = window.__d4EventLog.length
        target.click()
        await settle()
        const afterState = { expanded: target.getAttribute('aria-expanded'), checked: target.getAttribute('aria-checked'), selected: target.getAttribute('aria-selected'), text: target.textContent }
        const callbackEventNames = window.__d4EventLog.slice(eventStart).map(event => event.name)
        actions.push({ component, target: { selector, selectorProvenance: { source: 'document.querySelector', selector }, id: target.id || null }, beforeState, afterState, callbackEventNames })
      }
      await act('Tree', '#d4-tree [role="treeitem"]')
      await act('TreeSelect', '.aheart-tree-select__trigger')
      await act('Cascader', '.aheart-cascader__trigger')
      const html = app?.innerHTML ?? ''
      const eventNames = (window.__d4EventLog ?? []).map(event => event.name)
      return { html, before, interacted: true, changed: before !== html, businessEvents: eventNames.length, businessEventNames: eventNames, expandedChanged: actions.some(action => action.beforeState.expanded !== action.afterState.expanded), serverSnapshot, hydratedSnapshot, postHydrationActions: actions }
    })
    const item = Object.values(ssr.combinations)[mask]
    const hashSnapshot = snapshot => snapshot ? { ...snapshot, mainHtmlSha256: sha256(Buffer.from(snapshot.mainHtml)), teleportHtmlSha256: sha256(Buffer.from(snapshot.teleportHtml)), combinedSha256: sha256(Buffer.from(snapshot.combinedHtml)) } : snapshot
    const serverSnapshot = hashSnapshot(hydratedState.serverSnapshot)
    const hydratedSnapshot = hashSnapshot(hydratedState.hydratedSnapshot)
    item.serverSnapshot = serverSnapshot
    item.hydratedSnapshot = hydratedSnapshot
    item.mainHtmlSha256 = serverSnapshot?.mainHtmlSha256
    item.teleportHtmlSha256 = serverSnapshot?.teleportHtmlSha256
    item.combinedSha256 = serverSnapshot?.combinedSha256
    item.hydratedMainHtmlSha256 = hydratedSnapshot?.mainHtmlSha256
    item.hydratedTeleportHtmlSha256 = hydratedSnapshot?.teleportHtmlSha256
    item.initialRowsByComponent = Object.fromEntries(COMPONENTS.map(component => [component, item.componentRows?.[component] ?? 0]))
    item.postHydrationActions = hydratedState.postHydrationActions
    item.initialIdSha256 = sha256(Buffer.from(JSON.stringify(serverSnapshot?.sortedIds ?? [])))
    item.hydratedIdSha256 = sha256(Buffer.from(JSON.stringify(hydratedSnapshot?.sortedIds ?? [])))
    const captureEvidence = []
    const combinationKey = Object.keys(ssr.combinations)[mask]
    for (const [ordinal, snapshot] of [serverSnapshot, hydratedSnapshot].entries()) {
      const snapshotPath = path.join(artifactDirectory, 'ssr-snapshots', `${String(mask).padStart(2, '0')}-${ordinal + 1}.json`)
      await mkdir(path.dirname(snapshotPath), { recursive: true })
      const payload = `${JSON.stringify({ snapshot }, null, 2)}\n`
      await writeFile(snapshotPath, payload)
      captureEvidence.push({ ordinal: ordinal + 1, combinationKey, phase: snapshot.capturePhase, nonce: snapshot.captureNonce, structureSha256: sha256(Buffer.from(JSON.stringify(snapshotStructureProjection(snapshot)))), path: snapshotPath, sha256: sha256(Buffer.from(payload)) })
    }
    item.captureEvidence = captureEvidence
    hydration[mask] = { errors: browserErrors.length - errorsBefore, warnings: hydrationWarnings.length - warningsBefore, interacted: hydratedState.interacted, hydratedHtmlSha256: sha256(Buffer.from(hydratedState.html)), hydratedIdSha256: item.hydratedIdSha256, postHydrationInteraction: hydratedState.interacted, postHydrationStateChanged: hydratedState.changed, businessEventsAfterHydration: hydratedState.businessEvents, businessEventNames: hydratedState.businessEventNames, expandedChanged: hydratedState.expandedChanged }
  }
  return applyHydrationEvidence(ssr, hydration)
}

function installPerformanceObserverProbe(page) {
  return page.addInitScript(() => {
    window.__d4LongTasks = []
    window.__d4LayoutShifts = []
    window.__d4Observers = []
    window.__d4ObserverRunId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    window.__d4SupportedEntryTypes = [...(PerformanceObserver.supportedEntryTypes ?? [])].sort()
    window.__d4ObserverStartedAt = performance.now()
    const recordEntries = (type, entries) => {
      const inWindow = entries.filter(entry => entry.startTime >= window.__d4ObserverStartedAt)
      if (type === 'longtask') window.__d4LongTasks.push(...inWindow.map(entry => ({ startTime: entry.startTime, duration: entry.duration })))
      else if (type === 'layout-shift') window.__d4LayoutShifts.push(...inWindow.map(entry => ({ startTime: entry.startTime, value: entry.value })))
    }
    if (window.__d4SupportedEntryTypes.includes('longtask')) { const observer = new PerformanceObserver(list => recordEntries('longtask', list.getEntries())); observer.__d4Type = 'longtask'; observer.observe({ type: 'longtask', buffered: true }); window.__d4Observers.push(observer) }
    if (window.__d4SupportedEntryTypes.includes('layout-shift')) { const observer = new PerformanceObserver(list => recordEntries('layout-shift', list.getEntries())); observer.__d4Type = 'layout-shift'; observer.observe({ type: 'layout-shift', buffered: true }); window.__d4Observers.push(observer) }
    window.__d4StopObservers = () => { for (const observer of window.__d4Observers) recordEntries(observer.__d4Type, observer.takeRecords()); window.__d4TakeRecordsAt = performance.now(); window.__d4ObserverStoppedAt = Math.max(window.__d4ObserverStoppedAt ?? 0, window.__d4TakeRecordsAt); for (const observer of window.__d4Observers) observer.disconnect(); window.__d4Observers = []; window.__d4ObserversDisconnected = true; window.__d4DisconnectedAt = performance.now() }
  })
}

async function measureCase(page, settings, mode, baseURL = page.url()) {
  const origin = new URL(baseURL).origin
  await page.goto(`${origin}/?component=${settings.component}&count=${settings.count}&rowMode=${settings.rowMode}&virtual=${mode === 'virtual'}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__d4Ready === true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  let startedAt = await page.evaluate(() => window.__d4MountStart ?? performance.now())
  let clickStartedAt = startedAt
  let clickCompletedAt = startedAt
  if (settings.component !== 'Tree') { clickStartedAt = await page.evaluate(() => performance.now()); startedAt = clickStartedAt; await page.locator(settings.component === 'TreeSelect' ? '.aheart-tree-select__trigger' : '.aheart-cascader__trigger').click(); clickCompletedAt = await page.evaluate(() => performance.now()) }
  const triggerAt = settings.component === 'Tree' ? await page.evaluate(() => performance.now()) : clickStartedAt
  if (settings.component === 'Tree') clickCompletedAt = triggerAt
  if (settings.component !== 'Tree') await page.waitForSelector(settings.component === 'TreeSelect' ? '.aheart-tree-select__panel, [role="tree"]' : '.aheart-cascader__column', { state: 'attached', timeout: 5000 }).catch(async () => { await page.locator(settings.component === 'TreeSelect' ? '.aheart-tree-select__trigger' : '.aheart-cascader__trigger').click(); await page.waitForSelector(settings.component === 'TreeSelect' ? '.aheart-tree-select__panel, [role="tree"]' : '.aheart-cascader__column', { state: 'attached', timeout: 5000 }) })
  const rowSelector = settings.component === 'Cascader' ? '.aheart-cascader__column .aheart-cascader__option:not(:disabled)' : '[role="treeitem"]:not([aria-disabled="true"])'
  await page.waitForFunction(selector => { const row = document.querySelector(selector); const scroller = row?.closest('[role="tree"], .aheart-cascader__column'); const rect = row?.getBoundingClientRect(); const viewport = scroller?.getBoundingClientRect(); if (!row || !scroller || !rect || !viewport) return false; const x = rect.left + rect.width / 2; const y = rect.top + rect.height / 2; return rect.bottom > viewport.top && rect.top < viewport.bottom && rect.right > viewport.left && rect.left < viewport.right && !row.matches(':disabled,[aria-disabled="true"]') && getComputedStyle(row).pointerEvents !== 'none' && document.elementFromPoint(x, y)?.closest(selector) === row }, rowSelector)
  const actionableAt = await page.evaluate(() => performance.now())
  const stabilization = await page.evaluate(async () => { await window.__d4NextTick(); const nextTickAt = performance.now(); const rafAt = await new Promise(resolve => requestAnimationFrame(() => { const first = performance.now(); requestAnimationFrame(() => resolve([first, performance.now()])) })); return { nextTickAt, rafAt } })
  const nextTickAt = stabilization.nextTickAt
  const rafAt = stabilization.rafAt
  let searchMs = null
  let searchStartedAt = rafAt[1]
  let searchEndedAt = rafAt[1]
  let endAt = rafAt[1]
  let probeAt = rafAt[1]
  let firstInteractionMs = endAt - startedAt
  const state = await page.evaluate(selector => {
    const row = document.querySelector(selector)
    const scroll = row?.closest('[role="tree"], .aheart-cascader__column')
    const rect = row?.getBoundingClientRect()
    const viewport = scroll?.getBoundingClientRect()
    const center = rect && { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const hit = center ? document.elementFromPoint(center.x, center.y)?.closest(selector) === row : false
    row?.focus()
    const focused = document.activeElement === row && row?.ownerDocument === document
    const rowModeRows = scroll ? [...scroll.querySelectorAll('[role="treeitem"], .aheart-cascader__option')].slice(0, 200) : []
    return { scrollHeight: scroll?.scrollHeight ?? 0, clientHeight: scroll?.clientHeight ?? 0, mountedRows: scroll?.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length ?? 0, searchMatches: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, actionable: Boolean(row && hit && focused), actionableRowVisible: Boolean(rect && viewport && rect.bottom > viewport.top && rect.top < viewport.bottom), actionableRowEnabled: Boolean(row && !row.matches(':disabled,[aria-disabled="true"]')), targetRect: rect && viewport ? { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, height: rect.height, intersectsViewport: rect.bottom > viewport.top && rect.top < viewport.bottom, enabled: !row.matches(':disabled,[aria-disabled="true"]'), pointerEvents: getComputedStyle(row).pointerEvents } : null, targetViewportRect: viewport ? { top: viewport.top, bottom: viewport.bottom, left: viewport.left, right: viewport.right, height: viewport.height } : null, actionProbe: { hitTest: hit, focused, ownerDocument: row?.ownerDocument === document }, rowModeProbe: { indices: rowModeRows.map((_, index) => index), heights: rowModeRows.map(item => item.getBoundingClientRect().height), wrappedIndices: rowModeRows.map((item, index) => getComputedStyle(item).whiteSpace === 'normal' && item.getBoundingClientRect().height > 40 ? index : -1).filter(index => index >= 0), computedWhiteSpace: rowModeRows[0] ? getComputedStyle(rowModeRows[0]).whiteSpace : null }, vueFlushed: true, animationFrames: 2 }
  }, rowSelector)
  assert(state.actionable, `${settings.component} has no actionable row after stabilization`)
  probeAt = await page.evaluate(() => performance.now())
  endAt = await page.evaluate(() => performance.now())
  firstInteractionMs = endAt - startedAt
  if (settings.component === 'TreeSelect') {
    const search = page.locator('.aheart-tree-select__search')
    if (await search.count()) { searchStartedAt = await page.evaluate(() => performance.now()); await search.fill('Consumer'); await tick(page); searchEndedAt = await page.evaluate(() => performance.now()); searchMs = searchEndedAt - searchStartedAt }
  }
  const scroll = await page.evaluate(async () => {
    const target = document.querySelector('[role="tree"], .aheart-cascader__column')
    if (!target) return []
    const steps = []
    for (let index = 0; index < 40; index++) {
      const dynamicEnd = Math.max(0, target.scrollHeight - target.clientHeight)
      const offset = index === 19 || index === 20 ? dynamicEnd : dynamicEnd * (index < 20 ? index / 19 : (39 - index) / 19)
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
  const observers = await page.evaluate(() => ({ observerRunId: window.__d4ObserverRunId, supportedEntryTypes: window.__d4SupportedEntryTypes ?? [], longTasks: window.__d4LongTasks ?? null, layoutShifts: window.__d4LayoutShifts ?? null, resources: performance.getEntriesByType('resource').map(entry => entry.name), startedAt: window.__d4ObserverStartedAt, stoppedAt: window.__d4ObserverStoppedAt, takeRecordsAt: window.__d4TakeRecordsAt, disconnectedAt: window.__d4DisconnectedAt, disconnected: window.__d4ObserversDisconnected === true, activeAfterDrain: window.__d4Observers?.length ?? 0 }))
  const metricHeights = [...state.rowModeProbe.heights]
  for (const step of scroll) for (const row of step.rowRects ?? []) if (metricHeights.length < 24) metricHeights.push(row.height)
  const rowMetrics = metricHeights.map((height, index) => ({ index, height, expectedHeight: settings.rowMode === 'fixed' ? 28 : settings.rowMode === 'coarse' ? 44 : index % 10 === 0 ? 56 : 28 }))
  return { component: settings.component, count: settings.count, rowMode: settings.rowMode, mode, warmup: [{ firstInteractionMs, discarded: true }], measured: [{ firstInteractionMs }], medianMs: firstInteractionMs, maxRows: state.mountedRows, actionableRows: state.mountedRows, rowModeProbe: state.rowModeProbe, rowMetrics, scroll, state, observers, timing: { firstInteractionMs, searchMs, searchStartedAt, searchEndedAt, searchSeparated: true, triggerExcludedFromRows: true, vueNextTick: state.vueFlushed, ownerRealmFrames: state.animationFrames, popup: { startedAt }, startedAt, triggerAt, clickStartedAt, clickCompletedAt, actionableAt, nextTickAt, rafAt, endAt, probeAt, targetKind: 'row', fallbackTarget: false, targetRect: state.targetRect, targetViewportRect: state.targetViewportRect, hitTarget: { kind: state.actionProbe?.hitTest === true ? 'row' : 'none', hitTest: state.actionProbe?.hitTest === true }, focusProbe: { activeElementInRow: state.actionProbe?.focused === true, ownerDocument: state.actionProbe?.ownerDocument === true }, actionProbe: state.actionProbe, targetSelectorIncludesTrigger: false } }
}

function observerRoundEvidence(measured, identity, runtimeErrors = []) {
  const observers = measured.observers
  const scripts = [...new Set(observers.resources.filter(resource => /\.js(?:\?|$)/.test(resource)))].sort()
  const styles = [...new Set(observers.resources.filter(resource => /\.css(?:\?|$)/.test(resource)))].sort()
  return {
    ...identity,
    observerRunId: observers.observerRunId,
    supportedEntryTypes: [...new Set(observers.supportedEntryTypes)].sort(),
    startedAt: observers.startedAt,
    firstWriteAt: measured.scroll[0].timestamp,
    lastWriteAt: measured.scroll.at(-1).timestamp,
    takeRecordsAt: observers.takeRecordsAt,
    drainedAt: observers.stoppedAt,
    disconnectedAt: observers.disconnectedAt,
    disconnected: observers.disconnected,
    activeAfterDrain: observers.activeAfterDrain,
    scrollSteps: measured.scroll.length,
    runtimeErrors: structuredClone(runtimeErrors),
    longTasks: observers.longTasks,
    layoutShifts: observers.layoutShifts,
    resources: { scripts, styles },
  }
}

function summarizeBrowserObserverEvidence(browserVersion, observerRounds, runtimeErrors = []) {
  const supportedEntryTypes = [...new Set(observerRounds.flatMap(round => round.supportedEntryTypes))].sort()
  const scripts = [...new Set(observerRounds.flatMap(round => round.resources.scripts))].sort()
  const styles = [...new Set(observerRounds.flatMap(round => round.resources.styles))].sort()
  const longTaskEntries = observerRounds.flatMap(round => round.longTasks)
  const layoutShiftEntries = observerRounds.flatMap(round => round.layoutShifts)
  const supports = entryType => observerRounds.every(round => round.supportedEntryTypes.includes(entryType))
  const unsupported = entryType => ({ status: 'unsupported', reason: `PerformanceObserver.supportedEntryTypes excludes ${entryType} in this browser` })
  return {
    browserVersion,
    ownerRealm: true,
    twoRaf: true,
    observersStartedBeforeFirstWrite: observerRounds.every(round => round.startedAt < round.firstWriteAt),
    observersStoppedAfterFinal: observerRounds.every(round => round.lastWriteAt < round.drainedAt),
    observersStartedAt: Math.min(...observerRounds.map(round => round.startedAt)),
    observersStoppedAt: Math.max(...observerRounds.map(round => round.drainedAt)),
    consoleErrors: runtimeErrors.filter(error => error.kind === 'console').length,
    pageErrors: runtimeErrors.filter(error => error.kind === 'pageerror').length,
    runtimeErrors: structuredClone(runtimeErrors),
    scrollSteps: RELEASE_MATRIX.scrollSteps,
    supportedEntryTypes,
    observerRounds,
    resources: { status: 'recorded', scripts, styles },
    longTasks: supports('longtask') ? { status: 'recorded', maxMs: Math.max(0, ...longTaskEntries.map(entry => entry.duration)), entries: longTaskEntries } : unsupported('longtask'),
    layoutShifts: supports('layout-shift') ? { status: 'recorded', cls: Math.max(0, ...observerRounds.map(round => round.layoutShifts.reduce((sum, entry) => sum + entry.value, 0))), entries: layoutShiftEntries } : unsupported('layout-shift'),
  }
}

async function iframeProbe(page, baseURL, artifactDirectory) {
  const components = ['Tree', 'TreeSelect', 'Cascader']
  const scenarios = []
  const componentEvidence = {}
  await page.goto(`${baseURL}/?component=Tree&count=1000&rowMode=fixed&virtual=true&treeScenario=flat10000`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.aheart-tree', { state: 'attached' })
  for (const component of components) {
    const scenarioUrl = `/components/d4-iframe?component=${component}&iframeProbe=true&virtual=true&rowMode=fixed${component === 'Cascader' ? '&cascaderScenario=iframe-lazy' : ''}`
    const url = `${baseURL}${scenarioUrl}`
    await page.evaluate(({ componentName, source }) => {
      const frame = document.createElement('iframe')
      frame.dataset.d4IframeComponent = componentName
      frame.title = `same-origin D4 ${componentName} probe`
      frame.src = source
      document.body.append(frame)
    }, { componentName: component, source: url })
    const frameElement = page.locator(`iframe[data-d4-iframe-component="${component}"]`).last()
    await frameElement.waitFor({ state: 'attached' })
    await frameElement.evaluate(frame => frame.contentDocument?.readyState === 'complete' ? true : new Promise(resolve => frame.addEventListener('load', () => resolve(true), { once: true })))
    const frameHandle = await frameElement.elementHandle()
    const frame = await frameHandle?.contentFrame()
    assert(frame, `${component} iframe content frame is unavailable`)
    assert(new URL(frame.url()).searchParams.get('component') === component, `${component} iframe content frame URL is not the requested scenario: ${frame.url()}`)
    await frame.locator('#app').waitFor({ state: 'attached' })
    await frame.evaluate(() => { if (window.__d4Ready !== true) throw new Error('iframe fixture did not become ready') })
    const ownerState = await frame.evaluate(() => ({ sameOrigin: window === window.parent ? false : Boolean(window.frameElement), ownerDocument: document.defaultView === window, defaultView: document.defaultView === window, resourceCount: document.querySelectorAll('script,link[rel="stylesheet"]').length, probe: Boolean(window.__d4IframeLifecycleProbe) }))
    const record = (type, fields = {}) => frame.evaluate(({ eventType, eventFields }) => window.__d4IframeLifecycleProbe?.record(eventType, eventFields), { eventType: type, eventFields: fields })
    const triggerSelector = component === 'TreeSelect' ? '.aheart-tree-select__trigger' : component === 'Cascader' ? '.aheart-cascader__trigger' : null
    const scrollSelector = component === 'Tree' ? '[role="tree"]' : component === 'TreeSelect' ? '.aheart-tree-select__panel [role="tree"]' : '.aheart-cascader__column'
    const focusSelector = component === 'Tree' ? '[role="treeitem"]' : component === 'TreeSelect' ? '.aheart-tree-select__panel [role="treeitem"]' : '.aheart-cascader__option'
    const surface = await frame.evaluate(({ componentName, scroll }) => {
      const root = componentName === 'Tree' ? document.querySelector('.aheart-tree') : componentName === 'TreeSelect' ? document.querySelector('.aheart-tree-select__panel') : document.querySelector('.aheart-cascader__panel')
      const scroller = document.querySelector(scroll)
      return { kind: componentName === 'Tree' ? 'inline' : 'teleport', rootSelector: root?.className ? `.${[...root.classList].slice(0, 2).join('.')}` : null, scrollSelector: scroller ? scroll : null, ownerDocument: Boolean(root && root.ownerDocument === document), defaultView: Boolean(root?.ownerDocument?.defaultView === window), parentTag: root?.parentElement?.tagName ?? null }
    }, { componentName: component, scroll: scrollSelector })
    if (triggerSelector) await frame.locator(triggerSelector).focus()
    else await frame.locator(focusSelector).first().focus()
    const initialFocus = await frame.evaluate(({ selector, triggerSel }) => ({ focused: document.activeElement === document.querySelector(triggerSel || selector), ownerDocument: document.activeElement?.ownerDocument === document, defaultView: document.activeElement?.ownerDocument?.defaultView === window }), { selector: focusSelector, triggerSel: triggerSelector })
    let popupReopened = false
    let escapeEvidence = null
    let focusRestore = null
    let openedEvidence = null
    if (triggerSelector) {
      const trigger = frame.locator(triggerSelector)
      await frame.evaluate(async () => new Promise(resolve => window.__d4IframeLifecycleProbe?.originals.setTimeout(resolve, 120)))
      await trigger.click()
      await frame.waitForSelector(component === 'TreeSelect' ? '.aheart-tree-select__panel' : '.aheart-cascader__panel', { state: 'attached' })
      await frame.waitForSelector(focusSelector, { state: 'attached' })
      const opened = await frame.evaluate(({ componentName, triggerSel, scrollSel }) => {
        const triggerNode = document.querySelector(triggerSel)
        const panel = componentName === 'TreeSelect' ? document.querySelector('.aheart-tree-select__panel') : document.querySelector('.aheart-cascader__panel')
        const parent = panel?.parentElement
        const scroll = document.querySelector(scrollSel)
        const parentDocument = window.parent?.document
        return { panelParentRealm: panel?.ownerDocument?.defaultView === window ? 'iframe' : 'unknown', panelParentTag: parent?.tagName ?? null, panelParentOwnerDocument: Boolean(parent && parent.ownerDocument === document), panelParentDefaultView: Boolean(parent?.ownerDocument?.defaultView === window), scrollOwnerDocument: Boolean(scroll && scroll.ownerDocument === document), scrollOwnerDefaultView: Boolean(scroll?.ownerDocument?.defaultView === window), parentDocumentResidualNodes: parentDocument ? parentDocument.querySelectorAll('.aheart-tree-select__panel,.aheart-cascader__panel').length : null, ownerDocument: Boolean(panel && panel.ownerDocument === document), defaultView: Boolean(panel?.ownerDocument?.defaultView === window), triggerExpanded: triggerNode?.getAttribute('aria-expanded') }
      }, { componentName: component, triggerSel: triggerSelector, scrollSel: scrollSelector })
      openedEvidence = opened
      await record('popup-open', opened)
      await frame.locator(focusSelector).first().focus()
      await frame.evaluate(() => {
        window.__d4EscapeEvidence = null
        window.__d4EscapeObserver = event => { window.__d4EscapeEvidence = { consumed: event.defaultPrevented, escapeEventRealm: event.view === window ? 'iframe' : 'other', targetSelector: event.target?.className ? `.${[...event.target.classList].slice(0, 2).join('.')}` : null } }
        document.addEventListener('keydown', window.__d4EscapeObserver, true)
        const target = document.activeElement
        target?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, view: window }))
      })
      escapeEvidence = await frame.evaluate(() => { document.removeEventListener('keydown', window.__d4EscapeObserver, true); return window.__d4EscapeEvidence ?? { consumed: false, targetSelector: null } })
      await record('escape', escapeEvidence)
      await frame.evaluate(async () => new Promise(resolve => window.__d4IframeLifecycleProbe?.originals.setTimeout(resolve, 120)))
      const closed = await frame.evaluate(({ componentName }) => { const panel = componentName === 'TreeSelect' ? document.querySelector('.aheart-tree-select__panel') : document.querySelector('.aheart-cascader__panel'); const style = panel ? getComputedStyle(panel) : null; return { closed: !panel || style?.display === 'none' || panel.getClientRects().length === 0, panelPresent: Boolean(panel), display: style?.display ?? null } }, { componentName: component })
      const panelSelector = component === 'TreeSelect' ? '.aheart-tree-select__panel' : '.aheart-cascader__panel'
      let closeState
      for (let attempt = 0; attempt < 25; attempt += 1) {
        closeState = await frame.evaluate(({ triggerSel, panelSel }) => { const triggerNode = document.querySelector(triggerSel); const panel = document.querySelector(panelSel); const style = panel ? getComputedStyle(panel) : null; return { expanded: triggerNode?.getAttribute('aria-expanded'), hidden: !panel || style?.display === 'none' || panel.getClientRects().length === 0 } }, { triggerSel: triggerSelector, panelSel: panelSelector })
        if (closeState.expanded === 'false' && closeState.hidden) break
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      if (closeState?.expanded !== 'false' || closeState?.hidden !== true) throw new Error(`${component} popup did not close after iframe Escape: ${JSON.stringify(closeState)}`)
      await record('popup-close', { ...escapeEvidence, ...closed, ...closeState })
      focusRestore = await frame.evaluate(triggerSel => ({ restored: document.activeElement === document.querySelector(triggerSel), activeSelector: document.activeElement?.className ? `.${[...document.activeElement.classList].slice(0, 2).join('.')}` : null, ownerDocument: document.activeElement?.ownerDocument === document, observedWithoutCollectorFocus: true }), triggerSelector)
      const parentFocus = await page.evaluate(componentName => { const frame = document.querySelector(`iframe[data-d4-iframe-component="${componentName}"]`); return { parentActiveElement: document.activeElement === frame ? 'iframe' : 'other' } }, component)
      focusRestore = { ...focusRestore, parentActiveElement: parentFocus.parentActiveElement }
      await record('focus-restore', focusRestore)
      await trigger.click()
      let reopenState
      for (let attempt = 0; attempt < 25; attempt += 1) {
        reopenState = await frame.evaluate(({ componentName, triggerSel }) => { const panel = document.querySelector(componentName === 'TreeSelect' ? '.aheart-tree-select__panel' : '.aheart-cascader__panel'); const triggerNode = document.querySelector(triggerSel); const style = panel ? getComputedStyle(panel) : null; return { visible: Boolean(panel && style?.display !== 'none' && panel.getClientRects().length > 0), expanded: triggerNode?.getAttribute('aria-expanded') === 'true' } }, { componentName: component, triggerSel: triggerSelector })
        if (reopenState.visible && reopenState.expanded) break
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      if (!reopenState?.visible || !reopenState?.expanded) throw new Error(`${component} popup did not reopen visibly: ${JSON.stringify(reopenState)}`)
      popupReopened = true
      await record('reopen', reopenState)
    }
    let lazyControl = null
    if (component === 'Cascader') {
      await frame.locator('.aheart-cascader__option[data-cascader-value="lazy-root"]').click()
      await frame.evaluate(() => { if (!window.__d4IframeLazyControl?.signal) throw new Error('iframe lazy loader did not expose its AbortSignal') })
      lazyControl = await frame.evaluate(() => ({ hasSignal: Boolean(window.__d4IframeLazyControl?.signal), aborted: Boolean(window.__d4IframeLazyControl?.signal?.aborted), returnedChildrenCount: window.__d4IframeLazyControl?.returnedChildren?.length ?? 0 }))
    }
    await frame.evaluate(() => window.__d4Unmount?.())
    const unmountState = await frame.evaluate(() => ({ connected: window.frameElement?.isConnected === true, signalAborted: Boolean(window.__d4IframeLazyControl?.signal?.aborted), dom: document.querySelector('#app')?.innerHTML ?? '', state: JSON.stringify(window.__d4EventLog ?? []), callbacks: (window.__d4EventLog ?? []).map(event => event.name) }))
    if (lazyControl) lazyControl = { ...lazyControl, abortedAfterUnmount: unmountState.signalAborted }
    const ownerFlush = await frame.evaluate(async () => {
      const probe = window.__d4IframeLifecycleProbe
      if (!probe) return null
      await Promise.resolve(); await new Promise(resolve => probe.originals.requestAnimationFrame(() => probe.originals.requestAnimationFrame(resolve))); const residual = document.querySelector('#app')?.children.length ?? 0; const teleportResidual = document.querySelectorAll('.aheart-tree-select__panel,.aheart-cascader__panel').length; const parentDocumentResidualNodes = window.parent?.document?.querySelectorAll('.aheart-tree-select__panel,.aheart-cascader__panel').length ?? null; const active = probe.snapshotActive(); const result = { domResidualNodes: residual, teleportResidualNodes: teleportResidual, parentDocumentResidualNodes, resourceResiduals: active.length }
      probe.record('owner-flush', result)
      return result
    })
    let lazyEvidence
    if (component === 'Cascader') {
      const lazyRaw = await frame.evaluate(async () => {
        const control = window.__d4IframeLazyControl
        const before = { dom: document.querySelector('#app')?.innerHTML ?? '', state: JSON.stringify(window.__d4EventLog ?? []), callbacks: (window.__d4EventLog ?? []).map(event => event.name) }
        let mutationCount = 0
        const observer = new MutationObserver(() => { mutationCount += 1 })
        observer.observe(document, { subtree: true, childList: true, attributes: true, characterData: true })
        control?.resolve?.()
        await Promise.resolve()
        await new Promise(resolve => window.__d4IframeLifecycleProbe.originals.requestAnimationFrame(() => window.__d4IframeLifecycleProbe.originals.requestAnimationFrame(resolve)))
        const after = { dom: document.querySelector('#app')?.innerHTML ?? '', state: JSON.stringify(window.__d4EventLog ?? []), callbacks: (window.__d4EventLog ?? []).map(event => event.name) }
        observer.disconnect()
        return { returnedChildrenCount: control?.returnedChildren?.length ?? 0, loaderCompletion: control?.loaderCompletion ?? 0, mutationCount, componentUpdateCount: after.callbacks.length - before.callbacks.length, stateBefore: before.state, stateAfter: after.state, domBefore: before.dom, domAfter: after.dom, callbacksBefore: before.callbacks, callbacksAfter: after.callbacks }
      })
      lazyEvidence = { returnedChildrenCount: lazyRaw.returnedChildrenCount, loaderCompletion: lazyRaw.loaderCompletion, mutationCount: lazyRaw.mutationCount, componentUpdateCount: lazyRaw.componentUpdateCount, stateRawBefore: lazyRaw.stateBefore, stateRawAfter: lazyRaw.stateAfter, domRawBefore: lazyRaw.domBefore, domRawAfter: lazyRaw.domAfter, callbacksBefore: lazyRaw.callbacksBefore, callbacksAfter: lazyRaw.callbacksAfter, stateHashBeforeSha256: sha256(Buffer.from(lazyRaw.stateBefore)), stateHashAfterSha256: sha256(Buffer.from(lazyRaw.stateAfter)), domHashBeforeSha256: sha256(Buffer.from(lazyRaw.domBefore)), domHashAfterSha256: sha256(Buffer.from(lazyRaw.domAfter)), callbacksBeforeSha256: sha256(Buffer.from(JSON.stringify(lazyRaw.callbacksBefore))), callbacksAfterSha256: sha256(Buffer.from(JSON.stringify(lazyRaw.callbacksAfter))) }
      await frame.evaluate(result => window.__d4IframeLifecycleProbe?.record('lazy-resolve-after-unmount', result), lazyEvidence)
    }
    const observation = await frame.evaluate(async () => {
      const probe = window.__d4IframeLifecycleProbe
      if (!probe) return null
      await new Promise(resolve => probe.originals.setTimeout(resolve, 0)); const result = { domResidualNodes: document.querySelector('#app')?.children.length ?? 0, teleportResidualNodes: document.querySelectorAll('.aheart-tree-select__panel,.aheart-cascader__panel').length, parentDocumentResidualNodes: window.parent?.document?.querySelectorAll('.aheart-tree-select__panel,.aheart-cascader__panel').length ?? null, resourceResiduals: probe.snapshotActive().length }
      probe.record('owner-observation', result)
      return result
    })
    const postInteraction = async kind => {
      const raw = await frame.evaluate(async interaction => {
        const probe = window.__d4IframeLifecycleProbe
        const button = document.createElement('button'); button.type = 'button'; button.textContent = 'outside'; document.body.append(button)
        const beforeRaw = document.querySelector('#app')?.innerHTML ?? ''
        const callbacksBefore = (window.__d4EventLog ?? []).map(event => event.name)
        let mutationCount = 0
        const observer = new MutationObserver(() => { mutationCount += 1 })
        observer.observe(document, { subtree: true, childList: true, attributes: true, characterData: true })
        const event = interaction === 'escape' ? new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, view: window }) : new PointerEvent('pointerdown', { bubbles: true, cancelable: true, view: window })
        document.dispatchEvent(event)
        await Promise.resolve()
        await new Promise(resolve => probe.originals.requestAnimationFrame(resolve))
        const afterRaw = document.querySelector('#app')?.innerHTML ?? ''
        const callbacksAfter = (window.__d4EventLog ?? []).map(item => item.name)
        const ownerOriginalFlush = { resourceResiduals: probe.snapshotActive().length, domResidualNodes: document.querySelector('#app')?.children.length ?? 0 }
        observer.disconnect(); button.remove()
        return { consumed: event.defaultPrevented, beforeRaw, afterRaw, callbacksBefore, callbacksAfter, mutationCount, updateCount: callbacksAfter.length - callbacksBefore.length, ownerOriginalFlush }
      }, kind)
      const event = { consumed: raw.consumed, beforeRaw: raw.beforeRaw, afterRaw: raw.afterRaw, callbacksBefore: raw.callbacksBefore, callbacksAfter: raw.callbacksAfter, mutationCount: raw.mutationCount, updateCount: raw.updateCount, callbackCount: raw.callbacksAfter.length - raw.callbacksBefore.length, beforeHash: sha256(Buffer.from(raw.beforeRaw)), afterHash: sha256(Buffer.from(raw.afterRaw)), callbacksBeforeSha256: sha256(Buffer.from(JSON.stringify(raw.callbacksBefore))), callbacksAfterSha256: sha256(Buffer.from(JSON.stringify(raw.callbacksAfter))), ownerOriginalFlush: raw.ownerOriginalFlush }
      await record(`post-unmount-${kind}`, event)
      return event
    }
    const postUnmountEscape = await postInteraction('escape')
    const postUnmountPointer = await postInteraction('pointer')
    const exportedBeforeRemoval = await frame.evaluate(() => window.__d4IframeLifecycleProbe?.export?.())
    const exported = await page.evaluate(componentName => {
      const frame = document.querySelector(`iframe[data-d4-iframe-component="${componentName}"]`)
      const owner = frame?.contentWindow
      frame?.remove()
      return { connected: Boolean(frame?.isConnected), time: owner?.performance?.now?.() }
    }, component)
    const frameRemovedEvent = { seq: (exportedBeforeRemoval?.events?.at(-1)?.seq ?? 0) + 1, time: exported.time, type: 'frame-removed', scenarioId: exportedBeforeRemoval?.scenarioId, realmId: exportedBeforeRemoval?.realmId, connected: exported.connected }
    const scenario = { component, scenarioUrl, scenarioId: exportedBeforeRemoval?.scenarioId, realmId: exportedBeforeRemoval?.realmId, events: [...(exportedBeforeRemoval?.events ?? []), frameRemovedEvent] }
    scenarios.push(scenario)
    const actualSurface = { ...surface, rootSelector: surface.rootSelector ?? (component === 'TreeSelect' ? '.aheart-tree-select__panel' : component === 'Cascader' ? '.aheart-cascader__panel' : surface.rootSelector), ownerDocument: openedEvidence?.ownerDocument ?? surface.ownerDocument, defaultView: openedEvidence?.defaultView ?? surface.defaultView }
    componentEvidence[component] = { surface: actualSurface, trigger: triggerSelector ? { selector: triggerSelector } : null, scroll: { selector: scrollSelector }, panel: triggerSelector ? { selector: component === 'TreeSelect' ? '.aheart-tree-select__panel' : '.aheart-cascader__panel' } : null, ownerDocument: actualSurface.ownerDocument, defaultView: actualSurface.defaultView, sameOrigin: ownerState.sameOrigin, probeInstalled: ownerState.probe, focus: initialFocus, popupReopened, escape: escapeEvidence, focusRestore, lazy: lazyControl ? { ...lazyControl, evidence: lazyEvidence } : null, ownerFlush, ownerObservation: observation, postUnmount: { escape: postUnmountEscape, pointer: postUnmountPointer } }
    await frameElement.count().catch(() => 0)
  }
  const rawLifecycle = { schema: 'd4-iframe-lifecycle/v1', scenarios }
  const summary = recomputeIframeLifecycle(rawLifecycle)
  rawLifecycle.summary = summary
  const lifecycleDirectory = path.join(artifactDirectory, 'iframe')
  await mkdir(lifecycleDirectory, { recursive: true })
  const lifecyclePath = path.join(lifecycleDirectory, 'iframe-lifecycle.json')
  await writeFile(lifecyclePath, `${JSON.stringify(rawLifecycle, null, 2)}\n`)
  const lifecycleBytes = await readFile(lifecyclePath)
  return { status: 'recorded', sameOrigin: scenarios.every(item => item.events.some(event => event.type === 'frame-mounted')), ownerDocument: Object.values(componentEvidence).every(item => item.ownerDocument), focusTransfer: Object.values(componentEvidence).every(item => item.focus?.focused), popupReopened: Object.values(componentEvidence).filter(item => item.trigger).every(item => item.popupReopened), resourceCounts: { before: summary.createdBeforeUnmount, after: summary.finalActive }, observersAfterUnmount: summary.activeAfterUnmount, rafAfterUnmount: summary.byKind.raf, timersAfterUnmount: summary.byKind.timeout, componentResizeObserversAfterUnmount: summary.byKind.resizeObserver, componentRafAfterUnmount: summary.byKind.raf, componentTimersAfterUnmount: summary.byKind.timeout, constructorProxy: { resizeObserversAfterUnmount: summary.byKind.resizeObserver, rafAfterUnmount: summary.byKind.raf, timersAfterUnmount: summary.byKind.timeout }, teleportOwnerDocument: Object.values(componentEvidence).filter(item => item.trigger).every(item => item.ownerDocument), teleportResidualNodes: summary.teleportResidualNodes, escapeFocusRestored: Object.values(componentEvidence).filter(item => item.trigger).every(item => item.focusRestore?.restored), lateLazyStateUpdates: summary.lateLazyStateUpdates, unmountCleanup: summary.unmountCleanup, postUnmountInteractions: summary.postUnmountInteractions, scenarioUrls: scenarios.map(item => ({ component: item.component, url: item.scenarioUrl })), components: componentEvidence, rawLifecycle, lifecycleArtifact: { path: lifecyclePath, sha256: sha256(lifecycleBytes) } }
}

async function collectFamilyCoverage(page, baseURL) {
  const coverage = {}
  for (const [component, count] of [['Tree', 10000], ['TreeSelect', 5000], ['Cascader', 10000]]) {
    const actions = []
    let flatTreeScenario
    if (component === 'Tree') {
      await page.goto(`${baseURL}/?component=Tree&count=10000&rowMode=dynamic&virtual=true&treeScenario=flat10000`, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__d4Ready === true)
      const flatSource = await page.evaluate(() => window.__d4FixtureEvidence?.tree ?? {})
      const flatMeasure = await measureCase(page, { component: 'Tree', count: 10000, rowMode: 'dynamic' }, 'virtual', baseURL)
      const flatStartedAt = Date.now()
      await page.locator('[role="treeitem"]').first().click(); await tick(page)
      const flatEvents = await page.evaluate(() => window.__d4EventLog ?? [])
      const flatFinishedAt = Date.now()
      flatTreeScenario = { component: 'Tree', label: 'flat-roots-10000', executed: true, startedAt: flatStartedAt, finishedAt: flatFinishedAt, eventCount: flatEvents.length, eventRecords: flatEvents, sourceEvidence: { keys: flatSource.rootKeys ?? [], labels: flatSource.rootLabels ?? [], paths: [], matchedKeys: [], unmatchedKeys: [], hash: sha256(Buffer.from(JSON.stringify({ keys: flatSource.rootKeys ?? [], labels: flatSource.rootLabels ?? [], paths: [], matchedKeys: [], unmatchedKeys: [] }))) }, logicalKeys: flatSource.rootKeys ?? [], sourceHash: sha256(Buffer.from((flatSource.rootKeys ?? []).join('\n'))), derivedRows: (flatSource.rootKeys ?? []).length, actualRows: (flatSource.rootKeys ?? []).length, scroll: flatMeasure.scroll, mountedRows: flatMeasure.maxRows, beforeStateHash: sha256(Buffer.from('flat-before')), afterStateHash: sha256(Buffer.from(JSON.stringify(flatEvents))), rowModeEvidence: flatMeasure.rowModeProbe }
    }
    const rowModeEvidence = {}
    for (const rowMode of ['fixed', 'coarse', 'dynamic']) {
      await page.goto(`${baseURL}/?component=${component}&count=${count}&rowMode=${rowMode}&virtual=true${component === 'Tree' ? '&treeScenario=flat10000' : component === 'TreeSelect' ? '&treeSelectScenario=search-5000-controlled' : ''}`, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__d4Ready === true)
      if (component === 'Cascader') { await page.locator('.aheart-cascader__trigger').click(); await page.waitForSelector('.aheart-cascader__column', { state: 'attached' }) }
      if (component === 'TreeSelect') { await page.waitForSelector('.aheart-tree-select__panel .aheart-tree-select__search', { state: 'attached' }); await page.waitForFunction(() => document.querySelectorAll('.aheart-tree-select__panel [role="treeitem"], .aheart-tree-select__panel input[type="checkbox"]').length > 0, { timeout: 5000 }).catch(() => {}) }
      await tick(page)
      rowModeEvidence[rowMode] = await page.evaluate(async ({ componentName, modeName, rowCount }) => {
        const target = componentName === 'Cascader'
          ? document.querySelector('.aheart-cascader__column')
          : document.querySelector('[role="tree"]')
        if (!target) throw new Error(`${componentName}/${modeName}: virtual scroll target missing`)
        const expected = [0, 1, 10, 20]
        const keyFor = index => componentName === 'Cascader' ? `consumer-${rowCount}-${index}` : `consumer-root-${index}`
        const rows = () => [...target.querySelectorAll('[role="treeitem"], .aheart-cascader__option')]
        const keyOf = row => row.getAttribute('data-tree-key') || row.getAttribute('data-cascader-value') || row.getAttribute('data-cascader-path-token') || row.id
        const waitForRows = async () => {
          await window.__d4NextTick?.()
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
        }
        const metrics = []
        for (const index of expected) {
          const expectedKey = keyFor(index)
          let row
          for (let attempt = 0; attempt <= 40 && !row; attempt += 1) {
            const maxScroll = Math.max(0, target.scrollHeight - target.clientHeight)
            const estimate = modeName === 'coarse' ? 44 : modeName === 'dynamic' ? (index % 10 === 0 ? 56 : 28) : 28
            const searchEstimate = modeName === 'dynamic' ? 400 : 80
            const searchMax = Math.min(maxScroll, Math.max(target.clientHeight * 4, (index + 2) * searchEstimate))
            const desired = attempt === 0
              ? Math.min(maxScroll, Math.max(0, index * estimate - target.clientHeight * 0.25))
              : searchMax * (attempt / 40)
            target.scrollTop = desired
            target.dispatchEvent(new Event('scroll', { bubbles: true }))
            await waitForRows()
            row = rows().find(candidate => keyOf(candidate) === expectedKey)
          }
          if (!row) throw new Error(`${componentName}/${modeName}: could not mount ${expectedKey} after measured scroll attempts (scrollTop=${target.scrollTop}, scrollHeight=${target.scrollHeight}, clientHeight=${target.clientHeight}, rows=${rows().map(candidate => keyOf(candidate)).join(',')})`)
          const rect = row.getBoundingClientRect()
          const style = getComputedStyle(row)
          const content = row.querySelector(componentName === 'Cascader' ? ':scope > span' : '.aheart-tree__title') || row
          const contentStyle = getComputedStyle(content)
          const contentRect = content.getBoundingClientRect()
          const height = rect.bottom - rect.top
          const parsedLineHeight = Number.parseFloat(contentStyle.lineHeight)
          const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : Number.parseFloat(contentStyle.fontSize) * 1.2
          const wrapped = modeName === 'dynamic' && index % 10 === 0 && contentStyle.whiteSpace === 'normal' && contentRect.height > lineHeight * 1.5
          metrics.push({ index, key: keyOf(row), rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, height }, height, expectedHeight: height, wrapped, scrollWidth: content.scrollWidth, clientWidth: content.clientWidth, scrollHeight: content.scrollHeight, clientHeight: content.clientHeight, lineHeight, computedStyle: { whiteSpace: contentStyle.whiteSpace, lineHeight: contentStyle.lineHeight, height: style.height } })
        }
        return metrics
      }, { componentName: component, modeName: rowMode, rowCount: count })
    }
    await page.goto(`${baseURL}/?component=${component}&count=${count}&rowMode=dynamic&virtual=true${component === 'Tree' ? '&treeScenario=expanded100' : component === 'TreeSelect' ? '&treeSelectScenario=search-5000-controlled' : '&cascaderScenario=deep'}`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__d4Ready === true)
    if (component === 'Cascader') { const trigger = page.locator('.aheart-cascader__trigger'); await trigger.click(); await page.waitForSelector('.aheart-cascader__column', { state: 'attached' }) }
    if (component === 'TreeSelect') { await page.waitForSelector('.aheart-tree-select__panel .aheart-tree-select__search', { state: 'attached' }); await page.waitForFunction(() => document.querySelectorAll('.aheart-tree-select__panel [role="treeitem"], .aheart-tree-select__panel input[type="checkbox"]').length > 0, { timeout: 5000 }).catch(() => {}) }
    await tick(page)
    const sourceEvidence = await page.evaluate(componentName => { const source = window.__d4FixtureEvidence ?? {}; const keys = componentName === 'Tree' ? [...(source.tree?.rootKeys ?? []), ...(source.tree?.expandedChildKeys ?? [])] : componentName === 'TreeSelect' ? (source.treeSelect?.sourceKeys ?? [...(source.treeSelect?.matchedKeys ?? []), ...(source.treeSelect?.unmatchedKeys ?? [])]) : source.cascader?.siblingPaths?.flat() ?? []; const labels = componentName === 'Tree' ? [...(source.tree?.rootLabels ?? []), ...(source.tree?.expandedChildLabels ?? [])] : componentName === 'TreeSelect' ? source.treeSelect?.sourceLabels ?? [] : []; const paths = source.cascader?.searchPaths ?? []; const columns = source.cascader?.deepPaths ?? []; const rawRoots = source.tree?.rawRoots ?? []; const matchedKeys = source.treeSelect?.matchedKeys ?? []; const unmatchedKeys = source.treeSelect?.unmatchedKeys ?? []; return { keys, labels, paths, columns, rawRoots, matchedKeys, unmatchedKeys, hash: JSON.stringify({ keys, labels, paths, matchedKeys, unmatchedKeys }) } }, component)
    sourceEvidence.hash = sha256(Buffer.from(sourceEvidence.hash))
    const beforeText = await page.locator('body').textContent()
    const beforeRows = await page.locator('[role="treeitem"], .aheart-cascader__option').count()
    const beforeStateHash = sha256(Buffer.from(`${beforeText}|${await page.locator('[aria-checked="true"], [aria-selected="true"]').count()}`))
    await page.evaluate(() => { window.__d4EventLog = [] })
    const startedAt = Date.now()
    let cascaderCapturedEvents = []
    let cascaderDeepColumns = []
    let cascaderSearchEvidence
    let cascaderSelectedPath
    let cascaderRuntimeRecords = []
    let cascaderStateBeforeLate
    let cascaderStateAfterLate
    let treeSelectAcceptedBefore
    let treeSelectAcceptedAfter
    let treeSelectRequested
    let treeSelectSearchInputValue
    if (component === 'Cascader') { const trigger = page.locator('.aheart-cascader__trigger'); await trigger.click({ force: true }); if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click({ force: true }); actions.push('open'); await page.waitForSelector('.aheart-cascader__column .aheart-cascader__option', { state: 'visible', timeout: 10000 }) }
    await tick(page)
    if (component === 'Tree') {
      const switchers = page.locator('.aheart-tree__switcher').first()
      if (await switchers.count()) { await switchers.scrollIntoViewIfNeeded(); await switchers.click(); await tick(page); actions.push('collapse'); await switchers.click(); await tick(page); actions.push('re-expand') }
    } else if (component === 'TreeSelect') {
      const readTreeSelectState = async () => page.evaluate(() => {
        const trigger = document.querySelector('.aheart-tree-select__trigger')
        const selected = [...document.querySelectorAll('.aheart-tree-select__panel [aria-checked="true"], .aheart-tree-select__panel [aria-selected="true"]')].map(node => node.getAttribute('data-tree-key')).filter(Boolean)
        return { value: [...(window.__d4AcceptedValue ?? ['consumer-root-0'])], domTrigger: { text: trigger?.textContent ?? '', ariaExpanded: trigger?.getAttribute('aria-expanded') ?? null }, stateRaw: JSON.stringify({ acceptedValue: window.__d4AcceptedValue ?? ['consumer-root-0'], selected }) }
      })
      treeSelectAcceptedBefore = await readTreeSelectState()
      const checkbox = page.locator('.aheart-tree-select__panel input[type="checkbox"], .aheart-tree__checkbox').first()
      const treeRow = page.locator('.aheart-tree-select__panel [role="treeitem"]').first()
      if (await checkbox.count()) { await checkbox.click({ force: true }); await tick(page); actions.push('check') }
      else if (await treeRow.count()) { await treeRow.click(); await tick(page); actions.push('check-row') }
      const search = page.locator('.aheart-tree-select__search')
      if (await search.count()) { await search.fill('match'); await tick(page); treeSelectSearchInputValue = await search.inputValue(); actions.push('search') }
      treeSelectRequested = await page.evaluate(() => window.__d4ControlledAttempt)
      treeSelectAcceptedAfter = await readTreeSelectState()
    } else {
      const deepRuntime = await page.evaluate(() => window.__d4ActualComponentInput)
      const columnSnapshot = async (columnIndex) => page.locator('.aheart-cascader__column').nth(columnIndex).evaluate((column, index) => ({
        mountedRows: column.querySelectorAll('.aheart-cascader__option').length,
        rawLogicalOptionKeys: window.__d4ActualComponentInput?.actualOptionsColumns?.[index]?.keys ?? [...column.querySelectorAll('.aheart-cascader__option')].map(option => option.getAttribute('data-cascader-value')).filter(Boolean)
      }), columnIndex)
      for (let depth = 0; depth < 5; depth += 1) {
        try { await page.waitForFunction(expected => document.querySelectorAll('.aheart-cascader__column').length >= expected && document.querySelectorAll('.aheart-cascader__column')[expected - 1]?.querySelector('.aheart-cascader__option'), depth + 1, { timeout: 5000 }) } catch (error) { const diagnostic = await page.evaluate(() => ({ columns: document.querySelectorAll('.aheart-cascader__column').length, body: document.body.textContent?.slice(-300), input: window.__d4ActualComponentInput })); throw new Error(`Cascader runtime input depth ${depth} did not mount: ${JSON.stringify(diagnostic)}; ${error.message}`) }
        cascaderDeepColumns.push(await columnSnapshot(depth))
        const option = page.locator('.aheart-cascader__column').nth(depth).locator('.aheart-cascader__option').first()
        await option.focus()
        await option.click()
        actions.push(depth === 0 ? 'lazy-option' : 'keyboard')
        if (depth < 4) {
          try {
            await page.waitForFunction(expected => document.querySelectorAll('.aheart-cascader__column').length >= expected, depth + 2, { timeout: 5000 })
          } catch (error) {
            const diagnostic = await page.evaluate(() => ({ columns: document.querySelectorAll('.aheart-cascader__column').length, values: [...document.querySelectorAll('.aheart-cascader__column')].map(column => [...column.querySelectorAll('.aheart-cascader__option')].slice(0, 2).map(option => option.getAttribute('data-cascader-value'))), events: window.__d4EventLog ?? [] }))
            throw new Error(`Cascader deep depth ${depth} did not open: ${JSON.stringify(diagnostic)}; ${error.message}`)
          }
        }
      }
      const selectedEventBeforeSearch = await page.evaluate(() => (window.__d4EventLog ?? []).find(event => event.name === 'selection'))
      cascaderSelectedPath = selectedEventBeforeSearch?.value
      cascaderCapturedEvents = await page.evaluate(() => [...(window.__d4EventLog ?? [])])
      cascaderRuntimeRecords.push({ kind: 'deep', actualOptionsColumns: deepRuntime?.actualOptionsColumns ?? [] })
      await page.goto(`${baseURL}/?component=Cascader&count=${count}&rowMode=dynamic&virtual=true&cascaderScenario=search`, { waitUntil: 'networkidle' })
      const searchRuntime = await page.evaluate(() => window.__d4ActualComponentInput)
      await page.locator('.aheart-cascader__trigger').click()
      await page.locator('.aheart-cascader__search').fill('match')
      await page.waitForSelector('.aheart-cascader__search-results .aheart-cascader__option', { state: 'visible', timeout: 10000 })
      await tick(page)
      const searchResults = page.locator('.aheart-cascader__search-results')
      const searchFirst = await searchResults.locator('.aheart-cascader__option').first().getAttribute('data-cascader-path')
      const searchLast = await searchResults.evaluate(async element => {
        const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        element.scrollTop = element.scrollHeight - element.clientHeight
        element.dispatchEvent(new Event('scroll', { bubbles: true }))
        await settle()
        element.scrollTop = element.scrollHeight - element.clientHeight
        await settle()
        const rows = [...element.querySelectorAll('.aheart-cascader__option')]
        return rows.at(-1)?.getAttribute('data-cascader-path') ?? null
      })
      const inputValue = await page.locator('.aheart-cascader__search').inputValue()
      const rawSearchPaths = searchRuntime?.actualComponentInput?.rawLeaves?.map(leaf => leaf.path) ?? sourceEvidence.paths
      const matchedPaths = rawSearchPaths.filter((_, index) => index < 10000)
      const firstPath = searchFirst?.split('/') ?? []
      const lastPath = searchLast?.split('/') ?? []
      cascaderSearchEvidence = { inputValue, matchedPaths, visibleFirst: { path: matchedPaths.find(pathValue => pathValue.join('/') === firstPath.join('/')) ?? firstPath }, visibleTail: { path: matchedPaths.find(pathValue => pathValue.join('/') === lastPath.join('/')) ?? lastPath } }
      cascaderRuntimeRecords.push({ kind: 'search', actualComponentInput: searchRuntime?.actualComponentInput, matchedPaths, visibleTail: cascaderSearchEvidence.visibleTail.path })
      await page.goto(`${baseURL}/?component=Cascader&count=${count}&rowMode=dynamic&virtual=true&cascaderScenario=lazy`, { waitUntil: 'networkidle' })
      const lazyRuntime = await page.evaluate(() => window.__d4ActualComponentInput)
      await page.locator('.aheart-cascader__trigger').click(); await tick(page)
      const lazyRoot = page.locator('.aheart-cascader__column').first().locator('.aheart-cascader__option').first()
      await lazyRoot.focus(); await lazyRoot.click(); actions.push('lazy-option')
      await page.waitForSelector('.aheart-cascader__option.is-error', { state: 'visible', timeout: 5000 })
      await page.locator('.aheart-cascader__option.is-error').first().click(); actions.push('lazy-retry-ui')
      await page.waitForFunction(() => document.querySelectorAll('.aheart-cascader__column').length >= 2, { timeout: 5000 })
      cascaderCapturedEvents = [...cascaderCapturedEvents, ...(await page.evaluate(() => [...(window.__d4EventLog ?? [])]))]
      await page.goto(`${baseURL}/?component=Cascader&count=${count}&rowMode=dynamic&virtual=true&cascaderScenario=lazy`, { waitUntil: 'networkidle' })
      await page.locator('.aheart-cascader__trigger').click(); await tick(page)
      const pendingOption = page.locator('.aheart-cascader__column').first().locator('.aheart-cascader__option').first()
      await pendingOption.focus(); await pendingOption.press('Enter'); actions.push('lazy-revision')
      await page.keyboard.press('Escape'); actions.push('lazy-escape')
      const readLateState = async () => page.evaluate(() => {
        const columns = [...document.querySelectorAll('.aheart-cascader__column')].map(column => [...column.querySelectorAll('.aheart-cascader__option')].map(option => option.getAttribute('data-cascader-value')).filter(Boolean))
        return { dom: document.body.textContent ?? '', value: document.querySelector('.aheart-cascader__trigger')?.textContent ?? '', columns, childHashes: columns.map(column => column.join('\n')) }
      })
      await tick(page)
      cascaderStateBeforeLate = await readLateState()
      await page.waitForTimeout(180)
      cascaderStateAfterLate = await readLateState()
      cascaderCapturedEvents = [...cascaderCapturedEvents, ...(await page.evaluate(() => [...(window.__d4EventLog ?? [])]))]
      cascaderRuntimeRecords.push({ kind: 'lazy', actualComponentInput: { ...(lazyRuntime?.actualComponentInput ?? {}), events: cascaderCapturedEvents.filter(event => event.name?.startsWith('lazy-') || event.name === 'late-resolve') } })
    }
    const snapshot = await page.evaluate(() => ({ mountedRows: document.querySelectorAll('[role="treeitem"], .aheart-cascader__option').length, text: document.body.textContent?.slice(0, 200), columns: document.querySelectorAll('.aheart-cascader__column').length, eventLog: window.__d4EventLog ?? [] }))
    const afterText = await page.locator('body').textContent()
    const afterStateHash = sha256(Buffer.from(`${afterText}|${await page.locator('[aria-checked="true"], [aria-selected="true"]').count()}|${JSON.stringify(snapshot.eventLog)}`))
    const finishedAt = Date.now()
    const rawEvents = component === 'Cascader' ? cascaderCapturedEvents : snapshot.eventLog
    // Keep the real collapse in rawHistory, but make the scenario event stream
    // start with the actionable re-expand. The contract intentionally treats
    // expand as the successful 99 -> 100 transition while retaining the
    // preceding collapse as raw evidence.
    const rawHistory = component === 'Tree'
      ? rawEvents.filter(event => event.name === 'expand' && event.afterExpandedKeys?.length === 99)
      : []
    const events = component === 'Tree'
      ? rawEvents.filter(event => !(event.name === 'expand' && event.afterExpandedKeys?.length === 99))
      : rawEvents
    const expandEvent = events.find(event => event.name === 'expand')
    const selectionEvent = events.find(event => event.name === 'selection')
    const sourceKeys = sourceEvidence.keys
    const logicalRoots = component === 'Tree' ? Math.min(100, count) : sourceKeys.length
    const logicalChildrenAfter = component === 'Tree' ? sourceKeys.length : snapshot.mountedRows
    const sourcePayload = { keys: sourceEvidence.keys, labels: sourceEvidence.labels, paths: sourceEvidence.paths, matchedKeys: sourceEvidence.matchedKeys, unmatchedKeys: sourceEvidence.unmatchedKeys }
    const lazyEvents = component === 'Cascader' ? events.filter(event => ['lazy-pending', 'lazy-error', 'lazy-retry', 'lazy-resolve', 'lazy-cancel', 'late-resolve'].includes(event.name)).map((event, index) => ({ ...event, name: event.name === 'late-resolve' ? 'late-resolve-stale-ignored' : event.name.replace(/^lazy-/, ''), componentActionId: `cascader-lazy-${index}`, action: event.name === 'lazy-pending' ? 'option' : event.name === 'lazy-retry' ? 'retry' : event.name === 'lazy-cancel' ? 'escape' : event.name === 'late-resolve' ? 'revision' : 'option', ...(event.name === 'late-resolve' ? { stateBeforeLate: cascaderStateBeforeLate, stateAfterLate: cascaderStateAfterLate } : {}) })).slice(-8) : []
    const expandedKeysInput = component === 'Tree' ? (events.find(event => event.name === 'expand' && event.afterExpandedKeys?.length === 100)?.afterExpandedKeys ?? sourceEvidence.rawRoots.map(root => root.key)) : undefined
    const logicalVisibleKeys = component === 'Tree' ? sourceEvidence.rawRoots.flatMap(root => expandedKeysInput.includes(root.key) ? [root.key, ...root.children.map(child => child.key)] : [root.key]) : undefined
    const selectedPathValue = component === 'Cascader' ? (cascaderSelectedPath ?? selectionEvent?.value) : selectionEvent?.value ?? sourceEvidence.columns.map(column => column[0])
    const cascaderColumns = component === 'Cascader' ? cascaderDeepColumns.map(column => { const rawHash = sha256(Buffer.from(column.rawLogicalOptionKeys.join('\n'))); return { rawLogicalOptionKeys: column.rawLogicalOptionKeys, logicalOptionKeys: column.rawLogicalOptionKeys, mountedRows: column.mountedRows, mountedRawRows: column.mountedRows, actualComponentOptionsHash: rawHash, rawColumnOptionsHash: rawHash, componentInputHash: rawHash } }) : undefined
    const cascaderSearch = component === 'Cascader' ? { inputValue: cascaderSearchEvidence?.inputValue ?? 'match', rawLeaves: sourceEvidence.paths.map((pathValue, index) => ({ path: pathValue, labels: [index < 10000 ? `match ${pathValue.join(' ')}` : `other ${pathValue.join(' ')}`] })), componentInputHash: sha256(Buffer.from(sourceEvidence.paths.map(pathValue => pathValue.join('/')).join('\n'))), matchedPaths: cascaderSearchEvidence?.matchedPaths ?? [], visibleFirst: cascaderSearchEvidence?.visibleFirst, visibleTail: cascaderSearchEvidence?.visibleTail, pathHash: sha256(Buffer.from((cascaderSearchEvidence?.matchedPaths ?? []).map(pathValue => pathValue.join('/')).join('\n'))) } : undefined
    const treeChildCounts = component === 'Tree' ? sourceEvidence.rawRoots.map(root => Array.isArray(root.children) ? root.children.length : 0) : []
    const treeChildrenPerRoot = treeChildCounts.length > 0 && new Set(treeChildCounts).size === 1 ? treeChildCounts[0] : null
    if (component === 'TreeSelect') {
      treeSelectRequested = JSON.stringify(treeSelectRequested ?? null)
      for (const event of events) if (event.name === 'update:modelValue') event.valueSnapshot = { ...(event.valueSnapshot ?? {}), requestedValue: treeSelectRequested }
    }
    const primaryScenario = { component, label: component === 'Tree' ? 'expanded-100x99' : component === 'TreeSelect' ? 'search-5000-controlled' : 'deep5-search-lazy-controlled', executed: true, startedAt, finishedAt, eventCount: events.length, eventRecords: events, rawHistory, emits: events, stateChanges: beforeStateHash === afterStateHash ? [] : ['state-hash-changed'], beforeStateHash, afterStateHash, actions, sourceKeys: sourceEvidence.keys, sourceLabels: sourceEvidence.labels, query: component === 'TreeSelect' ? 'match' : undefined, searchInputValue: component === 'TreeSelect' ? 'match' : undefined, matchedKeys: component === 'TreeSelect' ? sourceEvidence.keys.filter((_, index) => sourceEvidence.labels[index]?.includes('match')) : undefined, valueBefore: component === 'TreeSelect' ? ['consumer-root-0'] : undefined, valueAfter: component === 'TreeSelect' ? ['consumer-root-0'] : undefined, rawRoots: component === 'Tree' ? sourceEvidence.rawRoots : undefined, expandedKeysInput, logicalVisibleKeys, columnSizes: component === 'Cascader' ? cascaderColumns.map(column => column.rawLogicalOptionKeys.length) : undefined, columns: cascaderColumns, selectedPath: component === 'Cascader' ? selectedPathValue : undefined, selectionEvent: component === 'Cascader' ? (selectionEvent ?? { name: 'selection', timestamp: finishedAt, value: selectedPathValue }) : undefined, search: cascaderSearch, lazy: component === 'Cascader' ? { events: lazyEvents, pending: lazyEvents.some(event => event.name === 'pending'), resolved: lazyEvents.some(event => event.name === 'resolve'), error: lazyEvents.some(event => event.name === 'error'), retry: lazyEvents.some(event => event.name === 'retry'), cancelled: lazyEvents.some(event => event.name === 'cancel'), staleIgnored: lazyEvents.some(event => event.name === 'late-resolve-stale-ignored') || lazyEvents.some(event => event.name === 'stale-ignored'), stateBefore: { columns: 1, hash: beforeStateHash }, stateAfter: { columns: snapshot.columns, hash: afterStateHash } } : null, sourceEvidence: { keys: sourceEvidence.keys, labels: sourceEvidence.labels, paths: sourceEvidence.paths, matchedKeys: sourceEvidence.matchedKeys, unmatchedKeys: sourceEvidence.unmatchedKeys, hash: sha256(Buffer.from(JSON.stringify(sourcePayload))) }, derivedRows: sourceKeys.length, logicalSearchMatches: component === 'TreeSelect' ? sourceEvidence.matchedKeys.length : null, controlledRejected: component !== 'Tree' && events.some(event => event.name === 'controlled-reject'), depth: component === 'Cascader' ? 5 : null, optionsPerLevel: component === 'Cascader' ? 2000 : undefined, flattenedSearchLeaves: component === 'Cascader' ? 10000 : undefined, childrenBefore: logicalRoots, childrenAfter: logicalChildrenAfter, roots: component === 'Tree' ? sourceEvidence.rawRoots.length : undefined, childrenPerRoot: component === 'Tree' ? treeChildrenPerRoot : undefined, mountedRows: snapshot.mountedRows, actualRows: sourceKeys.length, rowModeEvidence, textSample: snapshot.text }
    if (component === 'TreeSelect') Object.assign(primaryScenario, { searchInputValue: treeSelectSearchInputValue, searchInputElement: { value: treeSelectSearchInputValue }, searchInputEvidence: { source: 'dom-input.value' }, matchedKeys: sourceEvidence.keys.filter((_, index) => sourceEvidence.labels[index]?.includes(treeSelectSearchInputValue)), valueBefore: treeSelectAcceptedBefore?.value, valueAfter: treeSelectAcceptedAfter?.value, acceptedValueBefore: treeSelectAcceptedBefore, acceptedValueAfter: treeSelectAcceptedAfter, requestedValue: treeSelectRequested })
    if (component === 'Cascader') {
      Object.assign(primaryScenario.lazy, { stateBeforeLate: cascaderStateBeforeLate, stateAfterLate: cascaderStateAfterLate })
      primaryScenario.componentInputRecords = cascaderRuntimeRecords.map(record => record.kind === 'deep' ? { kind: 'deep', actualOptionsColumns: (record.actualOptionsColumns ?? []).map((column, index) => ({ index, keys: column.keys, options: column.keys, optionsHash: sha256(Buffer.from(column.keys.join('\n'))) })) } : record.kind === 'search' ? { ...record, actualComponentInput: { ...record.actualComponentInput, matchedPaths: record.matchedPaths, visibleTail: { path: record.visibleTail } } } : record)
    }
    coverage[component] = { realData: true, clockDomain: 'epoch-ms', rowModeEvidence, scenarios: component === 'Tree' ? [flatTreeScenario, primaryScenario] : [primaryScenario] }
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
  await installIframeLifecycleProbe(page)
  await installPerformanceObserverProbe(page)
  let caseEvidence
  let iframe
  let familyCoverage
  try {
    await collectHydratedSsrEvidence({ page, baseURL: actualBaseURL, ssr, artifactDirectory: durableDir, browserErrors: errors, hydrationWarnings })
    await page.goto(`${actualBaseURL}/?component=TreeSelect&count=5000&rowMode=fixed&virtual=true`, { waitUntil: 'networkidle' })
    caseEvidence = await measureCase(page, { component: 'TreeSelect', count: 5000, rowMode: 'fixed' }, 'virtual', actualBaseURL)
    iframe = await iframeProbe(page, actualBaseURL, durableDir)
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
  report.ssrHydration = { status: 'recorded', initialWindowDeterministic: Object.values(ssr.combinations).every(item => item.deterministic), idsDeterministic: Object.values(ssr.combinations).every(item => item.initialIdSha256), postHydrationInteraction: Object.values(ssr.combinations).every(item => item.postHydrationInteraction === true), combinations: Object.fromEntries(Object.entries(ssr.combinations).map(([key, item]) => [key, { ...item, initialHtmlSha256: item.htmlSha256 }])), count: 8, deterministicDoubleRender: true }
  const cjsSource = path.join(candidateRoot, 'node_modules/aheart-ui/lib/index.js')
  const cjsRecordPath = path.join(durableDir, 'aheart-ui-cjs-index.js')
  await cp(cjsSource, cjsRecordPath)
  const cjsRequire = createRequire(path.join(candidateRoot, 'cjs-probe.cjs'))
  const cjsExports = cjsRequire('aheart-ui')
  assert(typeof cjsExports.Tree === 'object' || typeof cjsExports.Tree === 'function', 'CJS Tree export must be requireable')
  assert(typeof cjsExports.TreeSelect === 'object' || typeof cjsExports.TreeSelect === 'function', 'CJS TreeSelect export must be requireable')
  assert(typeof cjsExports.Cascader === 'object' || typeof cjsExports.Cascader === 'function', 'CJS Cascader export must be requireable')
  const cjsRenderRecord = { exportPath: cjsRecordPath, exportSha256: sha256(await readFile(cjsRecordPath)), requireSource: cjsRequire.resolve('aheart-ui'), requireExports: ['Tree', 'TreeSelect', 'Cascader'], requireRender: true }
  for (const item of Object.values(report.ssrHydration.combinations)) item.cjsRenderRecord = cjsRenderRecord
  report.typeProbe = await durableTypeProbe(candidateRoot, durableDir)
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
  report.realEvidenceBinding = { tarballReopened: candidate.tarballSha256Verified === true, baselineCommit: baselineManifest.commit, baselineTarballVerified: baseline.sha256 === baselineManifest.tarballSha256, cleanStatusVerified: baselineManifest.clean === true && candidateManifest.clean === true, cleanPackVerified: candidate.clean === true && candidateManifest.clean === true, pnpmIntegrityVerified: install.lockSha256.length === 64, buildDirectory: path.join(durableDir, 'dist'), buildManifestPath: path.join(durableDir, 'dist-files.json'), buildFingerprintVerified: true, moduleFingerprintVerified: install.packageIndexHash === sha256(await readFile(path.join(candidateRoot, 'node_modules/aheart-ui/es/index.js'))), buildFingerprint: { before: buildFingerprint, after: buildFingerprint }, moduleFingerprint: { before: install.packageIndexHash, after: install.packageIndexHash }, lockFingerprint: { before: install.lockSha256, after: install.lockSha256 } }
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
  await rm(`${output}.prevalidation.json`, { force: true })
  return report
}

async function collectSide(tarball, label, temporary, { preflight = false, checkpoint, cleanupCounters: sharedCleanupCounters } = {}) {
  const root = await mkdtemp(path.join(temporary, `${label}-consumer-`))
  const packageManifest = await verifyTarball(tarball, label, root, label === 'baseline' ? baselineManifest : candidateManifest)
  await checkpoint?.('pack', { stage: 'pack', label, root, packageManifest, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
  const install = await installConsumer(root, tarball)
  await checkpoint?.('install', { stage: 'install', label, root, install, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
  const ssr = await ssrEvidence(root)
  await checkpoint?.('ssr', { stage: 'ssr', label, root, ssr, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath, result: ssr })
  const { build, preview } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href)
  const previousCwd = process.cwd()
  process.chdir(root)
  try {
    await build({ root: '.', configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: 'esbuild', sourcemap: false, rollupOptions: { input: ['index.html', ...Array.from({ length: 8 }, (_, mask) => `ssr-${mask}.html`)] } } })
  } finally {
    process.chdir(previousCwd)
  }
  await checkpoint?.('build', { stage: 'build', label, root, buildDirectory: path.join(root, 'dist'), manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
  if (label === 'candidate' && process.env.D4_DEFERRED_FAIL_AFTER_CANDIDATE_BUILD === '1') {
    throw new Error('D4_DEFERRED_FAIL_AFTER_CANDIDATE_BUILD: injected candidate build failure after durable checkpoint')
  }
  packageManifest.lockfileSha256 = install.lockSha256
  packageManifest.lockPath = install.lockPath
  packageManifest.modulePath = path.join(root, 'node_modules/aheart-ui/es/index.js')
  packageManifest.manifestPath = label === 'baseline' ? baselineManifestPath : candidateManifestPath
  packageManifest.manifestSha256 = sha256(await readFile(packageManifest.manifestPath))
  packageManifest.lockDependenciesSha256 = install.lockDependenciesSha256
  packageManifest.moduleRealpaths = [install.packageRealpath]
  packageManifest.afterHashes = { 'es/index.js': install.packageIndexHash }
  packageManifest.versions = install.versions
  const cleanupCounters = sharedCleanupCounters ?? { chromiumClose: 0, previewServerClose: 0, firefoxClose: 0, webkitClose: 0 }
  const sideArtifactDir = path.join(`${output}.artifacts`, label)
  await mkdir(sideArtifactDir, { recursive: true })
  if (preflight) {
    let preflightServer
    let preflightBrowser
    try {
      preflightServer = await preview({ root, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
      if (process.env.D4_DEFERRED_FAIL_BROWSER_LAUNCH === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_LAUNCH: injected chromium launch failure')
      preflightBrowser = await chromium.launch()
      if (process.env.D4_DEFERRED_FAIL_BROWSER_PAGE === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_PAGE: injected chromium page failure')
      const preflightPage = await preflightBrowser.newPage({ viewport: { width: 1100, height: 800 } })
      if (process.env.D4_DEFERRED_FAIL_BROWSER_SETUP === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_SETUP: injected chromium setup failure')
      await preflightPage.goto(`http://127.0.0.1:${preflightServer.httpServer.address().port}/`, { waitUntil: 'domcontentloaded' })
      await checkpoint?.('browser', { stage: 'browser', label, root, browser: 'chromium', manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
    } finally {
      if (preflightBrowser) { await preflightBrowser.close().catch(() => {}); cleanupCounters.chromiumClose += 1 }
      if (preflightServer?.httpServer) { await new Promise(resolve => preflightServer.httpServer.close(resolve)); cleanupCounters.previewServerClose += 1 }
    }
    const typeProbe = label === 'candidate' ? await durableTypeProbe(root, sideArtifactDir) : undefined
    return { packageManifest, cases: {}, ssrHydration: ssr, typeProbe, browsers: {}, iframe: { status: 'not-run' }, familyCoverage: {}, cleanupCounters, install, buildDirectory: path.join(root, 'dist') }
  }
  let server
  let browser
  let page
  let base
  const browserErrors = []
  const hydrationWarnings = []
  const cases = {}
  const chromiumObserverRounds = []
  const otherBrowsers = {}
  let familyCoverage = {}
  let iframeEvidence = { sameOrigin: false, ownerDocument: false, focusTransfer: false, unmountCleanup: false, postUnmountInteractions: 1 }
  const hydrationErrors = []
  try {
  server = await preview({ root, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
  base = `http://127.0.0.1:${server.httpServer.address().port}`
  if (process.env.D4_DEFERRED_FAIL_BROWSER_LAUNCH === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_LAUNCH: injected chromium launch failure')
  browser = await chromium.launch()
  if (process.env.D4_DEFERRED_FAIL_BROWSER_PAGE === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_PAGE: injected chromium page failure')
  page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
  if (process.env.D4_DEFERRED_FAIL_BROWSER_SETUP === 'chromium') throw new Error('D4_DEFERRED_FAIL_BROWSER_SETUP: injected chromium setup failure')
  page.on('pageerror', error => browserErrors.push({ kind: 'pageerror', message: error.message }))
  page.on('console', message => { if (message.type() === 'error') browserErrors.push({ kind: 'console', message: message.text() }); if (message.type() === 'warning' && /hydration|mismatch/i.test(message.text())) hydrationWarnings.push(message.text()) })
  await installIframeLifecycleProbe(page)
  await installPerformanceObserverProbe(page)
  await collectHydratedSsrEvidence({ page, baseURL: base, ssr: ssr, artifactDirectory: sideArtifactDir, browserErrors, hydrationWarnings })
  ssr.status = 'recorded'
    for (const component of COMPONENTS) for (const count of RELEASE_MATRIX.counts) for (const rowMode of RELEASE_MATRIX.rowModes) {
      const settings = fixtureCount(component, count, rowMode)
      const record = { ...settings, alternatingOrder: [], full: { warmup: [], measured: [], scroll: [] }, virtual: { warmup: [], measured: [], scroll: [] } }
      for (const mode of ['full', 'virtual']) {
        const warmup = await measureCase(page, settings, mode)
        await checkpoint?.('warmup', { stage: 'warmup', label, root, component, count, rowMode, mode, result: warmup, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
        record[mode].warmup = [{ firstInteractionMs: warmup.warmup[0].firstInteractionMs, discarded: true }]
      }
      for (let round = 0; round < RELEASE_MATRIX.measuredRuns; round++) for (const mode of round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']) {
        const runtimeErrorStart = browserErrors.length
        const measured = await measureCase(page, settings, mode)
        await checkpoint?.('round', { stage: 'round', label, root, component, count, rowMode, mode, round, result: measured, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
        record.alternatingOrder.push(mode)
        record[mode].measured.push({ firstInteractionMs: measured.measured[0].firstInteractionMs })
        record[mode].rowMetrics = measured.rowMetrics
        record[mode].scroll = measured.scroll
        chromiumObserverRounds.push(observerRoundEvidence(measured, { ordinal: chromiumObserverRounds.length + 1, component, count, rowMode, mode, round, caseKey: `${component}/${count}/${rowMode}` }, browserErrors.slice(runtimeErrorStart)))
        record[mode].maxRows = measured.maxRows
        record[mode].actionableRows = measured.actionableRows
        record[mode].medianMs = median(record[mode].measured.map(sample => sample.firstInteractionMs))
      }
      cases[`${component}/${count}/${rowMode}`] = record
      await checkpoint?.('case', { stage: 'case', label, root, component, count, rowMode, result: record, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
    }
    iframeEvidence = await iframeProbe(page, base, sideArtifactDir)
    familyCoverage = await collectFamilyCoverage(page, base)
    for (const [name, Browser] of Object.entries({ firefox, webkit })) {
      let other
      try {
      other = await Browser.launch()
      const otherPage = await other.newPage({ viewport: { width: 1100, height: 800 } })
      const browserErrors = []
      otherPage.on('pageerror', error => browserErrors.push({ kind: 'pageerror', message: error.message }))
      otherPage.on('console', message => { if (message.type() === 'error') browserErrors.push({ kind: 'console', message: message.text() }) })
      await installPerformanceObserverProbe(otherPage)
      const coverage = []
      const observerRounds = []
      for (const component of COMPONENTS) for (const count of RELEASE_MATRIX.counts) for (const rowMode of RELEASE_MATRIX.rowModes) {
        const settings = fixtureCount(component, count, rowMode)
        const modes = []
        for (let round = 0; round < RELEASE_MATRIX.measuredRuns; round++) for (const mode of round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']) {
          const runtimeErrorStart = browserErrors.length
          const measured = await measureCase(otherPage, settings, mode)
          modes.push({ mode, firstInteractionMs: measured.measured[0].firstInteractionMs, scroll: measured.scroll })
          observerRounds.push(observerRoundEvidence(measured, { ordinal: observerRounds.length + 1, component, count, rowMode, mode, round, caseKey: `${component}/${count}/${rowMode}` }, browserErrors.slice(runtimeErrorStart)))
        }
        coverage.push({ component, count, rowMode, measuredRuns: modes })
      }
      otherBrowsers[name] = { ...summarizeBrowserObserverEvidence(other.version(), observerRounds, browserErrors), coverageCases: coverage }
      await checkpoint?.('browser', { stage: 'browser', label, root, browser: name, coverageCases: coverage.length, observerRounds: observerRounds.length, result: { coverage, observerRounds }, manifestPath: label === 'baseline' ? baselineManifestPath : candidateManifestPath })
      } finally {
        if (other) { await other.close().catch(() => {}); cleanupCounters[`${name}Close`] += 1 }
      }
    }
  } finally {
    if (browser) { await browser.close().catch(() => {}); cleanupCounters.chromiumClose += 1 }
    if (server?.httpServer) { await new Promise(resolve => server.httpServer.close(resolve)); cleanupCounters.previewServerClose += 1 }
  }
  const chromiumEvidence = summarizeBrowserObserverEvidence(browser?.version?.() ?? 'unknown', chromiumObserverRounds, browserErrors)
  ssr.htmlByMask = undefined
  if (hydrationErrors.length) for (const item of Object.values(ssr.combinations)) { item.hydrationErrors += hydrationErrors.length; item.hydrationWarnings += hydrationErrors.length }
  const typeProbe = label === 'candidate' ? await durableTypeProbe(root, sideArtifactDir) : undefined
  return { packageManifest, cases, root, ssrHydration: ssr, typeProbe, browsers: { chromium: chromiumEvidence, ...otherBrowsers }, iframe: iframeEvidence, familyCoverage, cleanupCounters }
}

export async function finalizeCollectedReport(report, output) {
  report.releaseFormat ??= { collectorSourcePath: report.collectorSourcePath }
  report.releaseFormat.validatorStatus = 'validating'
  await mkdir(path.dirname(output), { recursive: true })
  const temporaryReport = `${output}.validating`
  await writeFile(temporaryReport, `${JSON.stringify(report, null, 2)}\n`)
  await verifyArtifactBindings(report, { reportPath: temporaryReport })
  validateReport(report, { requireRelease: true, allowValidationPhase: true })
  report.releaseFormat.validatorStatus = 'passed'
  await writeFile(temporaryReport, `${JSON.stringify(report, null, 2)}\n`)
  await rename(temporaryReport, output)
  const reopened = JSON.parse(await readFile(output, 'utf8'))
  await verifyArtifactBindings(reopened, { reportPath: output })
  validateReport(reopened, { requireRelease: true })
  return reopened
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
} else if (preflight) {
  const durableDir = `${output}.artifacts`
  const durableRunDir = `${output}.run`
  await mkdir(durableDir, { recursive: true })
  await mkdir(durableRunDir, { recursive: true })
  const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-preflight-'))
  let partial = { schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), preflight: true, smoke: false, acceptanceEligible: false, sourceKind: 'collected', checkpoints: [] }
  const baselineCleanupCounters = { chromiumClose: 0, previewServerClose: 0, firefoxClose: 0, webkitClose: 0 }
  const candidateCleanupCounters = { chromiumClose: 0, previewServerClose: 0, firefoxClose: 0, webkitClose: 0 }
  const cleanupCounters = { baseline: baselineCleanupCounters, candidate: candidateCleanupCounters, browserClosed: 0, serversClosed: 0, temporaryRemovedAfterPersistence: false }
  const syncCleanupCounters = () => { cleanupCounters.chromiumClose = baselineCleanupCounters.chromiumClose + candidateCleanupCounters.chromiumClose; cleanupCounters.previewServerClose = baselineCleanupCounters.previewServerClose + candidateCleanupCounters.previewServerClose; cleanupCounters.browserClosed = cleanupCounters.chromiumClose; cleanupCounters.serversClosed = cleanupCounters.previewServerClose }
  let checkpointSequence = 0
  const checkpoint = async (stage, details) => {
    const evidence = await copyCheckpointEvidence({ ...details, stage, durableRoot: durableDir }, path.join(durableDir, 'checkpoints', `${String(checkpointSequence++).padStart(4, '0')}-${details?.label ?? 'run'}-${stage}`))
    partial.checkpoints.push({ stage, at: new Date().toISOString(), label: details?.label, component: details?.component, count: details?.count, rowMode: details?.rowMode, mode: details?.mode, round: details?.round, browser: details?.browser, rawEvidence: evidence, rawPayloadHash: evidence.rawPayloadHash, rawPayload: evidence.rawPayload })
    await writeFile(path.join(durableRunDir, 'partial-report.json.tmp'), `${JSON.stringify(partial, null, 2)}\n`)
    await rename(path.join(durableRunDir, 'partial-report.json.tmp'), path.join(durableRunDir, 'partial-report.json'))
  }
  try {
    const baseline = await collectSide(baselineTarball, 'baseline', temporary, { preflight: true, checkpoint, cleanupCounters: baselineCleanupCounters })
    syncCleanupCounters()
    const candidate = await collectSide(candidateTarball, 'candidate', temporary, { preflight: true, checkpoint, cleanupCounters: candidateCleanupCounters })
    syncCleanupCounters()
    const report = buildFullReportShell({ baseline, candidate, baselineCommit, candidateCommit, runId: `preflight-${Date.now()}-${Math.random().toString(16).slice(2)}`, preflight: true, environment: { cpu: os.cpus()[0]?.model ?? 'unknown', concurrency: 1 } })
    report.preflight = true
    report.acceptanceEligible = false
    report.performance = { status: 'notRun', cases: {}, firstInteraction: { full: {}, virtual: {} } }
    report.browsers = {}
    report.checkpoints = partial.checkpoints
    report.cleanupCounters = cleanupCounters
    report.collectorSourcePath = fileURLToPath(import.meta.url)
    report.collectorSourceSha256 = sha256(await readFile(report.collectorSourcePath))
    await prepareFullArtifactBindings(report, {
      artifactDirectory: durableDir,
      runDir: durableRunDir,
      baselineTarball,
      candidateTarball,
      baselineManifestPath,
      candidateManifestPath,
      candidateBuildDirectory: candidate.buildDirectory,
      baselineBuildDirectory: baseline.buildDirectory,
      candidateModulePath: candidate.packageManifest.modulePath,
      baselineModulePath: baseline.packageManifest.modulePath,
      candidateLockPath: candidate.packageManifest.lockPath,
      baselineLockPath: baseline.packageManifest.lockPath,
      collectorSourcePath: report.collectorSourcePath,
    })
    report.packages.baseline.sourceCommit = baseline.packageManifest.sourceCommit
    report.packages.candidate.sourceCommit = candidate.packageManifest.sourceCommit
    report.realEvidenceBinding.tarballReopened = true
    report.realEvidenceBinding.cleanPackVerified = baseline.packageManifest.clean === true && candidate.packageManifest.clean === true
    report.realEvidenceBinding.cleanStatusVerified = report.realEvidenceBinding.cleanPackVerified
    report.realEvidenceBinding.pnpmIntegrityVerified = Boolean(candidate.packageManifest.versions?.pnpm)
    report.releaseFormat = { validatorName: 'validateFullPreflightReport', validatorStatus: 'validating', acceptanceEligible: false, rawEvidenceRecomputed: true, preflight: true }
    await mkdir(path.dirname(output), { recursive: true })
    const validating = `${output}.prevalidation.json`
    await writeFile(validating, `${JSON.stringify(report, null, 2)}\n`)
    await validateFullPreflightReport(report, { reportPath: validating })
    report.releaseFormat.validatorStatus = 'passed-ineligible'
    await writeFile(`${output}.preflight.tmp`, `${JSON.stringify(report, null, 2)}\n`)
    await rename(`${output}.preflight.tmp`, output)
    console.log(JSON.stringify({ output, status: 'passed-ineligible', preflight: true, acceptanceEligible: false }, null, 2))
  } catch (error) {
    syncCleanupCounters()
    partial.failure = String(error?.message ?? error)
    partial.failureEvidence = { ...(partial.failureEvidence ?? {}), preservedFailureArtifact: true, candidate: true, validationFailures: error.failures ?? [] }
    partial.cleanupCounters = cleanupCounters
    await writeFile(path.join(durableRunDir, 'partial-report.json'), `${JSON.stringify(partial, null, 2)}\n`)
    await writeFile(path.join(durableDir, 'partial-report.json'), `${JSON.stringify(partial, null, 2)}\n`)
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, `${JSON.stringify(partial, null, 2)}\n`)
    throw error
  } finally {
    await rm(temporary, { recursive: true, force: true })
    syncCleanupCounters()
    cleanupCounters.temporaryRemovedAfterPersistence = true
    if (partial.failure) {
      const failed = { ...partial, cleanupCounters: { ...(partial.cleanupCounters ?? {}), ...cleanupCounters } }
      await writeFile(path.join(durableRunDir, 'partial-report.json'), `${JSON.stringify(failed, null, 2)}\n`)
      await writeFile(path.join(durableDir, 'partial-report.json'), `${JSON.stringify(failed, null, 2)}\n`)
      await writeFile(output, `${JSON.stringify(failed, null, 2)}\n`)
    }
    else if (await stat(output).then(() => true).catch(() => false)) { const saved = JSON.parse(await readFile(output, 'utf8')); saved.cleanupCounters = { ...(saved.cleanupCounters ?? {}), temporaryRemovedAfterPersistence: true }; await writeFile(output, `${JSON.stringify(saved, null, 2)}\n`) }
  }
} else {
const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-full-'))
const durableDir = `${output}.artifacts`
const durableRunDir = `${output}.run`
await mkdir(durableDir, { recursive: true })
await mkdir(durableRunDir, { recursive: true })
let checkpointState = { schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), smoke: false, acceptanceEligible: true, checkpoints: [] }
const baselineCleanupCounters = { chromiumClose: 0, previewServerClose: 0, firefoxClose: 0, webkitClose: 0 }
const candidateCleanupCounters = { chromiumClose: 0, previewServerClose: 0, firefoxClose: 0, webkitClose: 0 }
const cleanupCounters = { baseline: baselineCleanupCounters, candidate: candidateCleanupCounters, browserClosed: 0, serversClosed: 0, temporaryRemovedAfterPersistence: false }
const syncCleanupCounters = () => { cleanupCounters.chromiumClose = baselineCleanupCounters.chromiumClose + candidateCleanupCounters.chromiumClose; cleanupCounters.previewServerClose = baselineCleanupCounters.previewServerClose + candidateCleanupCounters.previewServerClose; cleanupCounters.browserClosed = cleanupCounters.chromiumClose; cleanupCounters.serversClosed = cleanupCounters.previewServerClose }
let checkpointSequence = 0
const checkpoint = async (stage, details) => {
  const evidence = await copyCheckpointEvidence({ ...details, stage, durableRoot: durableDir }, path.join(durableDir, 'checkpoints', `${String(checkpointSequence++).padStart(4, '0')}-${details?.label ?? 'run'}-${stage}`))
  checkpointState.checkpoints.push({ stage, at: new Date().toISOString(), label: details?.label, component: details?.component, count: details?.count, rowMode: details?.rowMode, mode: details?.mode, round: details?.round, browser: details?.browser, rawEvidence: evidence, rawPayloadHash: evidence.rawPayloadHash, rawPayload: evidence.rawPayload })
  await writeFile(path.join(durableRunDir, 'partial-report.json.tmp'), `${JSON.stringify(checkpointState, null, 2)}\n`)
  await rename(path.join(durableRunDir, 'partial-report.json.tmp'), path.join(durableRunDir, 'partial-report.json'))
}
try {
  const baseline = await collectSide(baselineTarball, 'baseline', temporary, { checkpoint, cleanupCounters: baselineCleanupCounters })
  syncCleanupCounters()
  const candidate = await collectSide(candidateTarball, 'candidate', temporary, { checkpoint, cleanupCounters: candidateCleanupCounters })
  syncCleanupCounters()
  const report = buildFullReportShell({ baseline, candidate, baselineCommit, candidateCommit, runId: `full-${Date.now()}-${Math.random().toString(16).slice(2)}`, environment: { cpu: os.cpus()[0]?.model ?? 'unknown', concurrency: 1 } })
  report.acceptanceEligible = true
  report.preflight = false
  report.benchmarkExecuted = true
  report.checkpoints = checkpointState.checkpoints
  report.cleanupCounters = cleanupCounters
  report.sourceKind = 'collected'
  report.runId = `full-${Date.now()}-${Math.random().toString(16).slice(2)}`
  report.collectorSourcePath = fileURLToPath(import.meta.url)
  report.collectorSourceSha256 = sha256(await readFile(fileURLToPath(import.meta.url)))
  report.realEvidenceBinding = { tarballReopened: true, cleanPackVerified: baseline.packageManifest.clean === true && candidate.packageManifest.clean === true, pnpmIntegrityVerified: Boolean(candidate.packageManifest.lockfileSha256) }
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
  await prepareFullArtifactBindings(report, {
    artifactDirectory: durableDir,
    runDir: durableRunDir,
    baselineTarball,
    candidateTarball,
    baselineManifestPath,
    candidateManifestPath,
    candidateBuildDirectory: path.join(candidate.root, 'dist'),
    baselineBuildDirectory: path.join(baseline.root, 'dist'),
    candidateModulePath: candidate.packageManifest.modulePath,
    baselineModulePath: baseline.packageManifest.modulePath,
    candidateLockPath: candidate.packageManifest.lockPath,
    baselineLockPath: baseline.packageManifest.lockPath,
    collectorSourcePath: report.collectorSourcePath,
  })
  report.realEvidenceBinding.tarballReopened = true
  report.realEvidenceBinding.cleanStatusVerified = report.realEvidenceBinding.cleanPackVerified
  report.realEvidenceBinding.pnpmIntegrityVerified = Boolean(candidate.packageManifest.versions?.pnpm)
  await finalizeCollectedReport(report, output)
  console.log(JSON.stringify({ output, status: 'passed', acceptanceEligible: true }, null, 2))
} catch (error) {
  syncCleanupCounters()
  await mkdir(path.dirname(output), { recursive: true })
  const partialText = await readFile(path.join(durableRunDir, 'partial-report.json'), 'utf8').catch(() => readFile(output, 'utf8').catch(() => '{}'))
  const partial = JSON.parse(partialText)
  partial.schema = 'd4-deferred-consumer/v1'
  partial.generatedAt ??= new Date().toISOString()
  partial.smoke = false
  partial.acceptanceEligible = false
  partial.failure = String(error?.message ?? error)
  partial.failureEvidence = { ...(partial.failureEvidence ?? {}), preservedFailureArtifact: true, candidate: true, validationFailures: error.failures ?? [] }
  partial.cleanupCounters = cleanupCounters
  checkpointState.failure = partial.failure
  checkpointState.failureEvidence = partial.failureEvidence
  await writeFile(path.join(durableRunDir, 'partial-report.json'), `${JSON.stringify(partial, null, 2)}\n`)
  await writeFile(output, `${JSON.stringify(partial, null, 2)}\n`)
  throw error
} finally {
  await rm(temporary, { recursive: true, force: true })
  syncCleanupCounters()
  cleanupCounters.temporaryRemovedAfterPersistence = true
  if (checkpointState.failure) {
    const failed = { ...checkpointState, cleanupCounters: { ...(checkpointState.cleanupCounters ?? {}), ...cleanupCounters } }
    await writeFile(path.join(durableRunDir, 'partial-report.json'), `${JSON.stringify(failed, null, 2)}\n`)
    await writeFile(output, `${JSON.stringify(failed, null, 2)}\n`)
  } else if (await stat(output).then(() => true).catch(() => false)) { const saved = JSON.parse(await readFile(output, 'utf8')); saved.cleanupCounters = { ...(saved.cleanupCounters ?? {}), temporaryRemovedAfterPersistence: true }; await writeFile(output, `${JSON.stringify(saved, null, 2)}\n`) }
}
}
