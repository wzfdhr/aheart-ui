#!/usr/bin/env node
/* D5-C package-boundary comparison.  This intentionally builds two isolated
 * npm consumers from real tarballs; no workspace package or symlink is used. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { promisify } from 'node:util'
import { fileURLToPath, pathToFileURL } from 'node:url'
import os from 'node:os'
import path from 'node:path'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const baselineCommit = '7f29bb5'
const evidence = path.join(root, 'docs/superpowers/evidence/d5-c/package-compare')
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const out = arg('--out') ?? path.join(evidence, 'package-compare.json')
const logPath = arg('--log') ?? path.join(evidence, 'package-compare.log')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const hash = value => sha256(Buffer.from(value))
const js = JSON.stringify
const recordLog = []
const note = value => { recordLog.push(value); console.log(value) }
const packageDir = path.join(root, 'packages/components')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(file))
    else files.push(file)
  }
  return files
}
async function fileMetrics(dir) {
  const files = (await walk(dir)).filter(file => /\.(?:js|mjs|cjs|css)$/i.test(file)).sort()
  const items = []
  for (const file of files) {
    const bytes = await readFile(file)
    items.push({ file: path.relative(dir, file), sha256: sha256(bytes), rawBytes: bytes.length, gzipBytes: gzipSync(bytes).length })
  }
  return items
}
async function makeBaselineTarball(temp) {
  const archive = path.join(temp, 'baseline-components.tar')
  const unpack = path.join(temp, 'baseline-components')
  await mkdir(unpack, { recursive: true })
  const tar = await run('git', ['archive', '--format=tar', baselineCommit, 'packages/components'], { cwd: root, encoding: 'buffer', maxBuffer: 100 * 1024 * 1024 })
  await writeFile(archive, tar.stdout)
  await run('tar', ['-xf', archive, '--strip-components=2', '-C', unpack])
  const destination = path.join(temp, 'baseline-pack'); await mkdir(destination, { recursive: true })
  const packed = await run('npm', ['pack', '--ignore-scripts', '--pack-destination', destination], { cwd: unpack, maxBuffer: 20 * 1024 * 1024 })
  const name = packed.stdout.trim().split(/\s+/).at(-1)
  return path.join(destination, name)
}
async function makeCandidateTarball(temp) {
  const destination = path.join(temp, 'candidate-pack'); await mkdir(destination, { recursive: true })
  const packed = await run('npm', ['pack', '--ignore-scripts', '--pack-destination', destination], { cwd: packageDir, maxBuffer: 20 * 1024 * 1024 })
  const name = packed.stdout.trim().split(/\s+/).at(-1)
  return path.join(destination, name)
}
async function installConsumer(tarball, label, temp) {
  const consumer = await mkdtemp(path.join(temp, `${label}-consumer-`))
  const workspaceRequire = createRequire(path.join(packageDir, 'probe.cjs'))
  const versions = {
    vue: workspaceRequire('vue/package.json').version,
    renderer: workspaceRequire('@vue/server-renderer/package.json').version,
    vite: workspaceRequire('vite/package.json').version
  }
  const pkg = { name: `d5-c-${label}`, private: true, type: 'module', scripts: {}, dependencies: { 'aheart-ui': `file:${tarball}`, vue: versions.vue, '@vue/server-renderer': versions.renderer }, devDependencies: { vite: versions.vite } }
  await writeFile(path.join(consumer, 'package.json'), js(pkg, null, 2) + '\n')
  await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumer, maxBuffer: 40 * 1024 * 1024 })
  const installed = path.join(consumer, 'node_modules/aheart-ui')
  assert.equal((await lstat(installed)).isSymbolicLink(), false, `${label}: package is a symlink`)
  return { consumer, versions, installed }
}
function consumerSource(mode) {
  return `import { createSSRApp, h } from 'vue'; import { Table } from 'aheart-ui';
const rows=Array.from({length:10000},(_,i)=>({key:'row-'+(i+1),name:'Row '+(i+1),status:'ready'}));
const columns=[{title:'Name',dataIndex:'name',key:'name'},{title:'Status',dataIndex:'status',key:'status'}];
const props={columns,rowKey:'key',dataMode:'local',dataSource:rows,pagination:false${mode === 'false' ? ',virtual:false' : ''}};
export const app=createSSRApp({render:()=>h(Table,props)});`
}
async function packageProbe(item, label, temp) {
  const require = createRequire(path.join(item.consumer, 'probe.cjs'))
  const cjs = require('aheart-ui')
  // ESM + CSS are loaded by the identical Vite production pipeline. Node's
  // native ESM loader intentionally does not understand the package CSS side
  // effect, while Vite does (and therefore tests the published ESM entry).
  await writeFile(path.join(item.consumer, 'index.html'), '<!doctype html><html><body><div id="app"></div><script type="module" src="/main.mjs"></script></body></html>')
  await writeFile(path.join(item.consumer, 'main.mjs'), "import { Table } from 'aheart-ui'; import 'aheart-ui/style.css'; document.querySelector('#app').textContent = typeof Table")
  await run('npx', ['vite', 'build', '--outDir', 'esm-dist', '--emptyOutDir'], { cwd: item.consumer, maxBuffer: 40 * 1024 * 1024 })
  const esmFiles = await walk(path.join(item.consumer, 'esm-dist'))
  assert.ok(esmFiles.some(file => file.endsWith('.js')) && esmFiles.some(file => file.endsWith('.css')), `${label}: Vite ESM/CSS build missing output`)
  assert.ok(cjs.Table, `${label}: CJS Table export missing`)
  const css = await readFile(path.join(item.installed, 'es/style.css'))
  assert.ok(css.length > 0, `${label}: CSS empty`)
  const renderer = require('@vue/server-renderer')
  const results = {}
  for (const mode of label === 'baseline' ? ['default'] : ['default', 'false']) {
    const source = consumerSource(mode)
    const file = path.join(item.consumer, `${mode}.mjs`)
    await writeFile(file, source)
    const mod = await import(pathToFileURL(file).href + `?${Date.now()}-${mode}`)
    const html = await renderer.renderToString(mod.app)
    const tbody = html.match(/<tbody(?:\s[^>]*)?>([\s\S]*?)<\/tbody>/)?.[1] ?? ''
    const rowCount = (tbody.match(/<tr(?:\s|>)/g) ?? []).length
    const cellCount = (tbody.match(/<td(?:\s|>)/g) ?? []).length
    // The component keeps a stable logical-item token on ordinary rows for
    // focus bookkeeping. Virtual-only evidence is spacers, the scroll/height
    // markers, and aria row virtualization metadata.
    const markers = (html.match(/data-table-(?:virtual|spacer)|data-aheart-virtual-(?:scroll|height|estimate|overscan|measured)|aria-(?:rowcount|rowindex)/gi) ?? []).length
    assert.equal(rowCount, 10000, `${label}/${mode}: expected 10000 rows, got ${rowCount}`)
    assert.equal(cellCount, 20000, `${label}/${mode}: expected 20000 cells, got ${cellCount}`)
    assert.equal(markers, 0, `${label}/${mode}: unexpected virtual marker`)
    assert.match(html, /Row 1/) ; assert.match(html, /Row 10000/)
    results[mode] = { htmlBytes: Buffer.byteLength(html), sha256: hash(html), rowCount, cellCount, markers, firstRow: html.indexOf('Row 1'), lastRow: html.indexOf('Row 10000'), nativeTable: /<table(?:\s|>)/.test(html) }
  }
  const packageFiles = await fileMetrics(path.join(item.consumer, 'esm-dist'))
  return { esmTable: true, cjsTable: true, cssBytes: css.length, symlink: false, packageFiles, ssr: results }
}
const started = new Date().toISOString()
const temp = await mkdtemp(path.join(os.tmpdir(), 'aheart-d5-c-package-'))
let record
try {
  await mkdir(path.dirname(out), { recursive: true })
  await mkdir(path.dirname(logPath), { recursive: true })
  note(`temp=${temp}`)
  const baselineTarball = await makeBaselineTarball(temp)
  const candidateTarball = await makeCandidateTarball(temp)
  const baselineBytes = await readFile(baselineTarball), candidateBytes = await readFile(candidateTarball)
  const [baseline, candidate] = await Promise.all([installConsumer(baselineTarball, 'baseline', temp), installConsumer(candidateTarball, 'candidate', temp)])
  const baselineProbe = await packageProbe(baseline, 'baseline', temp)
  const candidateProbe = await packageProbe(candidate, 'candidate', temp)
  const all = [...baselineProbe.packageFiles, ...candidateProbe.packageFiles]
  const paths = [...new Set(all.map(file => file.file))].sort()
  const bundleFiles = paths.map(file => {
    const b = baselineProbe.packageFiles.find(item => item.file === file), c = candidateProbe.packageFiles.find(item => item.file === file)
    return { file, baseline: b ?? null, candidate: c ?? null, rawDelta: (c?.rawBytes ?? 0) - (b?.rawBytes ?? 0), gzipDelta: (c?.gzipBytes ?? 0) - (b?.gzipBytes ?? 0) }
  })
  const baselineSum = baselineProbe.packageFiles.reduce((a, x) => ({ rawBytes: a.rawBytes + x.rawBytes, gzipBytes: a.gzipBytes + x.gzipBytes }), { rawBytes: 0, gzipBytes: 0 })
  const candidateSum = candidateProbe.packageFiles.reduce((a, x) => ({ rawBytes: a.rawBytes + x.rawBytes, gzipBytes: a.gzipBytes + x.gzipBytes }), { rawBytes: 0, gzipBytes: 0 })
  const normalizedEqual = candidateProbe.ssr.default.sha256 === candidateProbe.ssr.false.sha256
  const gzipDelta = candidateSum.gzipBytes - baselineSum.gzipBytes
  const checks = { tarballsReal: true, noWorkspaceSymlinks: baselineProbe.symlink === false && candidateProbe.symlink === false, esmCjsCss: baselineProbe.esmTable && baselineProbe.cjsTable && candidateProbe.esmTable && candidateProbe.cjsTable, candidateDefaultFalseNormalizedDOMHashEqual: normalizedEqual, baselineNative10k20kNoMarkers: baselineProbe.ssr.default.rowCount === 10000 && baselineProbe.ssr.default.cellCount === 20000 && baselineProbe.ssr.default.markers === 0 && baselineProbe.ssr.default.nativeTable, candidateNative10k20kNoMarkers: candidateProbe.ssr.default.rowCount === 10000 && candidateProbe.ssr.default.cellCount === 20000 && candidateProbe.ssr.default.markers === 0 && candidateProbe.ssr.default.nativeTable, gzipDeltaWithinBudget: gzipDelta <= 12288 }
  record = { status: Object.values(checks).every(Boolean) ? 'passed' : 'failed', started, completed: new Date().toISOString(), baselineCommit, node: process.version, configuration: { vue: baseline.versions.vue, serverRenderer: baseline.versions.renderer, vite: baseline.versions.vite, build: 'Vite production, configFile:false, minify:true, sourcemap:false; same consumer source' }, tarballs: { baseline: { path: baselineTarball, sha256: sha256(baselineBytes), rawBytes: baselineBytes.length }, candidate: { path: candidateTarball, sha256: sha256(candidateBytes), rawBytes: candidateBytes.length } }, bundles: { baseline: baselineSum, candidate: candidateSum, gzipDeltaBytes: gzipDelta, rawDeltaBytes: candidateSum.rawBytes - baselineSum.rawBytes, files: bundleFiles }, ssr: { baseline: baselineProbe.ssr, candidate: candidateProbe.ssr }, checks, consumers: { baseline: { root: baseline.consumer, packageRealpath: baseline.installed }, candidate: { root: candidate.consumer, packageRealpath: candidate.installed } } }
} catch (error) {
  record = { status: 'failed', started, completed: new Date().toISOString(), baselineCommit, error: String(error?.stack ?? error) }
  process.exitCode = 1
}
await writeFile(out, JSON.stringify(record, null, 2) + '\n')
await writeFile(logPath, recordLog.join('\n') + '\n' + JSON.stringify(record, null, 2) + '\n')
console.log(JSON.stringify(record, null, 2))
if (record.status !== 'passed') process.exitCode = 1
