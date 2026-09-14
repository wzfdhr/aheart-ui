import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const fixture = path.join(rootDir, 'docs/superpowers/experiments/form-list-consumer')
const argument = name => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const tarball = argument('--tarball')
const output = argument('--out')
assert.ok(tarball, '--tarball is required')
assert.ok(output, '--out is required')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const listJavaScript = async directory => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listJavaScript(target))
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(target)
  }
  return files
}

const capture = async (command, args, options, logPath) => {
  try {
    const result = await run(command, args, options)
    await writeFile(logPath, result.stdout + result.stderr)
    return result
  } catch (error) {
    await writeFile(logPath, `${error.stdout ?? ''}${error.stderr ?? ''}\nexit=${error.code ?? 1}\n`)
    throw error
  }
}

const main = async () => {
  await mkdir(output, { recursive: true })
  const tarballPath = await realpath(tarball)
  const consumerRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-form-list-consumer-')))
  for (const file of ['package.json', 'types.ts', 'app.js', 'main.js']) await cp(path.join(fixture, file), path.join(consumerRoot, file))
  await cp(tarballPath, path.join(consumerRoot, 'aheart-ui.tgz'))
  const record = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    tarball: tarballPath,
    tarballSHA256: sha256(await readFile(tarballPath)),
    consumerRoot,
    symlink: undefined,
    baselineGzipBytes: undefined,
    bundleGzipBytes: undefined,
    incrementalGzipBytes: undefined,
    checks: { typecheck: false, esm: false, cjs: false, css: false, ssr: false, hydration: false, interaction: false }
  }

  try {
    await capture('npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'npm-install.log'))
    await capture('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'npm-ci.log'))
    record.symlink = (await lstat(path.join(consumerRoot, 'node_modules/aheart-ui'))).isSymbolicLink()
    assert.equal(record.symlink, false)
    await capture(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'typecheck.log'))
    record.checks.typecheck = true

    const consumerRequire = createRequire(path.join(consumerRoot, 'probe.cjs'))
    const cjs = consumerRequire('aheart-ui')
    assert.equal(typeof cjs.FormList, 'object')
    assert.equal(cjs.AFormList, cjs.FormList)
    record.checks.cjs = true
    const esm = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/aheart-ui/es/index.js')).href)
    assert.equal(typeof esm.FormList, 'object')
    assert.equal(esm.AFormList, esm.FormList)
    record.checks.esm = true
    const css = await readFile(path.join(consumerRoot, 'node_modules/aheart-ui/es/style.css'), 'utf8')
    assert.match(css, /aheart-form-item/)
    record.checks.css = true

    const vue = consumerRequire('vue')
    const renderer = consumerRequire('@vue/server-renderer')
    const appModule = await import(pathToFileURL(path.join(consumerRoot, 'app.js')).href)
    const first = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    const second = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    assert.equal(first, second)
    assert.match(first, /data-form-list-consumer/)
    assert.match(first, /data-row-key/)
    record.checks.ssr = true

    await writeFile(path.join(consumerRoot, 'index.html'), '<!doctype html><html><body><div id="app"><!--SSR--></div><script type="module" src="/main.js"></script></body></html>')
    const vite = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/vite/dist/node/index.js')).href)
    await writeFile(path.join(consumerRoot, 'baseline.html'), '<!doctype html><html><body><div id="app"></div><script type="module" src="/baseline.js"></script></body></html>')
    await writeFile(path.join(consumerRoot, 'baseline.js'), "import { createApp, h } from 'vue'; createApp({ render: () => h('main', 'baseline') }).mount('#app');")
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'baseline-dist', emptyOutDir: true, minify: true, rollupOptions: { input: path.join(consumerRoot, 'baseline.html') } } })
    const baselineJavaScript = await Promise.all((await listJavaScript(path.join(consumerRoot, 'baseline-dist/assets'))).map(file => readFile(file)))
    record.baselineGzipBytes = baselineJavaScript.reduce((sum, bytes) => sum + gzipSync(bytes).byteLength, 0)
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: true } })
    await writeFile(path.join(consumerRoot, 'dist/index.html'), (await readFile(path.join(consumerRoot, 'dist/index.html'), 'utf8')).replace('<!--SSR-->', first))
    const javascript = await Promise.all((await listJavaScript(path.join(consumerRoot, 'dist/assets'))).map(file => readFile(file)))
    record.bundleGzipBytes = javascript.reduce((sum, bytes) => sum + gzipSync(bytes).byteLength, 0)
    record.incrementalGzipBytes = record.bundleGzipBytes - record.baselineGzipBytes
    assert.ok(record.bundleGzipBytes > 0)
    assert.ok(record.incrementalGzipBytes > 0 && record.incrementalGzipBytes <= 40 * 1024, `Form-only gzip increment ${record.incrementalGzipBytes} exceeds 40 KiB`)
    const bundledSource = Buffer.concat(javascript).toString('utf8')
    for (const unrelated of ['aheart-table', 'aheart-cascader', 'aheart-tree-select', 'aheart-upload']) {
      assert.doesNotMatch(bundledSource, new RegExp(unrelated), `Form-only subpath bundle must not include ${unrelated}`)
    }
    const server = await vite.preview({ root: consumerRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(`pageerror:${error.message}`))
      page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(`${message.type()}:${message.text()}`) })
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`)
      await page.waitForFunction(() => window.__formListConsumerReady)
      assert.equal(await page.locator('[data-row-key]').count(), 2)
      assert.deepEqual(errors, [])
      record.checks.hydration = true
      const initialKeys = await page.locator('[data-row-key]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-key')))
      await page.locator('[data-error]').click()
      await page.locator('[data-move]').click()
      assert.equal(await page.locator('[data-row-id="b"] [role="alert"]').textContent(), 'server')
      assert.equal(await page.locator('[data-row-id="b"]').getAttribute('data-row-key'), initialKeys[1])
      await page.locator('[data-add]').click()
      assert.equal(await page.locator('[data-row-key]').count(), 3)
      await page.locator('[data-reset]').click()
      assert.deepEqual(await page.locator('[data-row-id]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-id'))), ['a', 'b'])
      const resetKeys = await page.locator('[data-row-key]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-key')))
      assert.ok(resetKeys.every(key => !initialKeys.includes(key)))
      assert.deepEqual(errors, [])
      record.checks.interaction = true
    } finally {
      await browser.close()
      await new Promise(resolve => server.httpServer.close(resolve))
    }

    assert.deepEqual(Object.values(record.checks), Array(Object.keys(record.checks).length).fill(true))
    record.status = 'passed'
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    console.log(JSON.stringify({ status: record.status, tarballSHA256: record.tarballSHA256, baselineGzipBytes: record.baselineGzipBytes, bundleGzipBytes: record.bundleGzipBytes, incrementalGzipBytes: record.incrementalGzipBytes, output, consumerRoot }, null, 2))
  } catch (error) {
    record.status = 'failed'
    record.error = { name: error.name, message: error.message, stack: error.stack }
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    throw error
  }
}

await main()
