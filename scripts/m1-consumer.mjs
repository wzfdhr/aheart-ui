import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { componentEntries } from '../packages/components/build/entries.mjs'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const tarball = await realpath(arg('--tarball') ?? 'test-results/release-tarballs/aheart-ui-1.2.0.tgz')
const output = path.resolve(arg('--out') ?? 'test-results/m1-consumer')
await mkdir(output, { recursive: true })
const consumer = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-m1-consumer-')))
const hash = data => createHash('sha256').update(data).digest('hex')
const results = { status: 'failed', consumer, tarball, tarballSHA256: hash(await readFile(tarball)), builds: {}, styles: {}, node: process.version }
const capture = async (name, command, args) => {
  try {
    const r = await run(command, args, { cwd: consumer, maxBuffer: 40 * 1024 * 1024, timeout: 180000 })
    await writeFile(path.join(output, `${name}.log`), r.stdout + r.stderr)
  } catch (e) {
    await writeFile(path.join(output, `${name}.log`), (e.stdout ?? '') + (e.stderr ?? e.message))
    throw e
  }
}
try {
  await cp(tarball, path.join(consumer, 'aheart-ui.tgz'))
  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({ name: 'aheart-m1-consumer', private: true, type: 'module', dependencies: { 'aheart-ui': 'file:./aheart-ui.tgz', vue: '3.5.44', vite: '5.0.12' } }, null, 2))
  await capture('install', 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])
  await cp(path.join(consumer, 'package-lock.json'), path.join(output, 'package-lock.json'))
  const installed = path.join(consumer, 'node_modules/aheart-ui')
  assert.equal((await lstat(installed)).isSymbolicLink(), false)
  assert.equal(await realpath(installed), installed)
  results.installedVersion = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8')).version
  assert.equal(results.installedVersion, '1.2.0')
  // Probe the actual package's ESM, CJS and legacy entry resolution in Node SSR.
  await writeFile(path.join(consumer, 'node-probe.mjs'), `
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Root, { Button, Modal, Select } from 'aheart-ui'
import Full from 'aheart-ui/full'
const require = createRequire(import.meta.url)
assert.equal(Full, Root)
for (const [entry, expected] of [['button', Button], ['modal', Modal], ['select', Select]]) {
  const esm = await import('aheart-ui/' + entry)
  assert.equal(esm.default, expected)
  assert.equal(require('aheart-ui/' + entry).default, require('aheart-ui')[entry[0].toUpperCase() + entry.slice(1)])
  assert.ok(require.resolve('aheart-ui/' + entry + '/style.css').endsWith('/es/' + entry + '/style.css'))
  assert.equal((await import('aheart-ui/es/' + entry + '/index.js')).default, expected)
  assert.equal(typeof await renderToString(createSSRApp({ render: () => h(esm.default) })), 'string')
}
assert.equal(require('aheart-ui/full').default, require('aheart-ui').default)
assert.equal(typeof window, 'undefined')
console.log('ESM/CJS/default/named/legacy and SSR passed')
`)
  await capture('node-probe', process.execPath, ['node-probe.mjs'])
  await writeFile(path.join(consumer, 'vite.config.mjs'), `
import { defineConfig } from 'vite'
import { gzipSync } from 'node:zlib'
const parsed = new Set()
export default defineConfig({ build: { minify: true }, plugins: [{
  name: 'm1-module-evidence', moduleParsed(info) { parsed.add(info.id.replace(process.cwd(), '<consumer>')) },
  generateBundle(_options, bundle) {
    const chunks = Object.values(bundle).filter(item => item.type === 'chunk')
    const modules = chunks.flatMap(chunk => Object.entries(chunk.modules).map(([id, info]) => ({ id: id.replace(process.cwd(), '<consumer>'), renderedLength: info.renderedLength })))
    const assets = Object.values(bundle).map(item => { const value = item.type === 'chunk' ? item.code : item.source; return { file: item.fileName, bytes: Buffer.byteLength(value), gzipBytes: gzipSync(value).length } })
    this.emitFile({ type: 'asset', fileName: 'module-graph.json', source: JSON.stringify({ parsed: [...parsed].sort(), modules, assets }, null, 2) })
  }
}] })
`)
  const modes = []
  for (const { name, subpath } of componentEntries) {
    modes.push({ name: subpath, code: `import C from 'aheart-ui/${subpath}'`, styles: [`aheart-ui/theme.css`, `aheart-ui/${subpath}/style.css`] })
    modes.push({ name: `root-${subpath}`, code: `import { ${name} as C } from 'aheart-ui'`, styles: [] })
  }
  modes.push({ name: 'bare-button', code: "import C from 'aheart-ui/button'", styles: [] })
  modes.push({ name: 'legacy-button', code: "import C from 'aheart-ui/es/button/index.js'", styles: ['aheart-ui/style.css'] })
  modes.push({ name: 'full', plugin: 'aheart-ui/full', styles: ['aheart-ui/full.css'] })
  modes.push({ name: 'legacy-full', plugin: 'aheart-ui', styles: ['aheart-ui/style.css'] })
  for (const mode of modes) {
    const source = mode.plugin
      ? `import {createApp,h,resolveComponent} from 'vue';import Plugin from '${mode.plugin}';const app=createApp({render:()=>h(resolveComponent('AButton'))});app.use(Plugin);app.mount('#app');`
      : `import {createApp,h} from 'vue';${mode.code};createApp({render:()=>h(C)}).mount('#app');`
    await writeFile(path.join(consumer, 'main.js'), source + mode.styles.map(style => `\nimport '${style}'`).join(''))
    await writeFile(path.join(consumer, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>M1</title></head><body><div id="app"></div><script type="module" src="/main.js"></script></body></html>')
    await capture(`build-${mode.name}`, process.execPath, ['node_modules/vite/bin/vite.js', 'build'])
    const graph = JSON.parse(await readFile(path.join(consumer, 'dist/module-graph.json'), 'utf8'))
    await writeFile(path.join(output, `${mode.name}-module-graph.json`), JSON.stringify(graph, null, 2))
    const jsGzip = graph.assets.filter(a => a.file.endsWith('.js')).reduce((sum, a) => sum + a.gzipBytes, 0)
    const cssBytes = graph.assets.filter(a => a.file.endsWith('.css')).reduce((sum, a) => sum + a.bytes, 0)
    assert.ok(jsGzip > 0)
    if (mode.styles.length) assert.ok(cssBytes > 0, `${mode.name} CSS was pruned`)
    else assert.equal(cssBytes, 0, `${mode.name} runtime introduced implicit CSS`)
    results.builds[mode.name] = { jsGzip, cssBytes, parsedModules: graph.parsed.length }
    if (['button', 'modal', 'select'].includes(mode.name)) {
      const allowed = { button: ['button', 'icon'], modal: ['modal', 'button', 'icon', 'skeleton'], select: ['select', 'icon'] }[mode.name]
      const unrelated = graph.parsed.filter(id => {
        if (/\/@aheart-ui\/(ai|dnd)\//.test(id)) return true
        const match = /\/node_modules\/aheart-ui\/es\/([^/]+)\/(.+)/.exec(id)
        return match && ![...allowed, 'utils', 'config'].includes(match[1]) && !(match[1] === 'form' && !match[2].includes('.vue'))
      })
      assert.deepEqual(unrelated, [], `${mode.name} parsed unrelated components`)
    }
  }
  const full = await readFile(path.join(installed, 'es/full.css'))
  assert.deepEqual(full, await readFile(path.join(installed, 'es/style.css')))
  const theme = await readFile(path.join(installed, 'es/theme.css'))
  assert.ok(theme.length <= full.length * 0.05)
  results.styles = { fullBytes: full.length, themeBytes: theme.length, components: {} }
  for (const { subpath } of componentEntries) {
    const css = await readFile(path.join(installed, `es/${subpath}/style.css`))
    assert.ok(css.length <= full.length * 0.25)
    assert.ok(css.length + theme.length <= full.length * 0.30)
    assert.ok(!/\.aheart-(table|ai-|dnd-)/.test(css.toString()))
    results.styles.components[subpath] = { bytes: css.length, fractionOfFull: css.length / full.length }
    const selected = results.builds[subpath].jsGzip, baseline = results.builds[`root-${subpath}`].jsGzip
    assert.ok(selected <= baseline + Math.max(512, baseline * 0.01), `${subpath} exceeds root named budget`)
    assert.ok(selected < results.builds.full.jsGzip, `${subpath} must be smaller than full`)
  }
  assert.equal(results.builds.full.cssBytes, results.builds['legacy-full'].cssBytes)
  results.status = 'passed'
} catch (error) { results.error = { message: error.message, stdout: error.stdout, stderr: error.stderr }; process.exitCode = 1 }
await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2)+'\n')
console.log(JSON.stringify(results, null, 2))
