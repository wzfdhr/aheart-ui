import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const fixture = path.join(rootDir, 'docs/superpowers/experiments/d6-consumer')
const argument = (name) => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const tarball = argument('--tarball')
const output = argument('--out')
assert.ok(tarball, '--tarball is required')
assert.ok(output, '--out is required')
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

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
  const consumerRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-d6-')))
  for (const file of ['package.json', 'types.ts', 'app.js']) await cp(path.join(fixture, file), path.join(consumerRoot, file))
  await cp(tarballPath, path.join(consumerRoot, 'aheart-ui.tgz'))
  const record = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    tarball: tarballPath,
    tarballSHA256: sha256(await readFile(tarballPath)),
    consumerRoot,
    symlink: false,
    typecheck: false,
    imports: false,
    css: false,
    ssr: false,
    hydration: false,
    interaction: false
  }

  try {
    await capture('npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 }, path.join(output, 'npm-install.log'))
    await capture('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 }, path.join(output, 'npm-ci.log'))
    record.symlink = (await lstat(path.join(consumerRoot, 'node_modules/aheart-ui'))).isSymbolicLink()
    assert.equal(record.symlink, false)
    await capture(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'], { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 }, path.join(output, 'typecheck.log'))
    record.typecheck = true

    const consumerRequire = createRequire(path.join(consumerRoot, 'probe.cjs'))
    const cjs = consumerRequire('aheart-ui')
    assert.equal(typeof cjs.DatePicker, 'object')
    assert.equal(typeof cjs.TimeRangePicker, 'object')
    assert.equal(typeof cjs.Upload, 'object')
    await capture(process.execPath, ['-e', "import('aheart-ui').then(m => { if (!m.DatePicker || !m.TimeRangePicker || !m.Upload) process.exit(2) })"], { cwd: consumerRoot }, path.join(output, 'esm-import.log'))
    record.imports = true
    const css = await readFile(path.join(consumerRoot, 'node_modules/aheart-ui/es/style.css'), 'utf8')
    assert.match(css, /aheart-upload__cancel/)
    assert.match(css, /aheart-date-range-picker__panel\.has-time/)
    record.css = true

    const vue = consumerRequire('vue')
    const renderer = consumerRequire('@vue/server-renderer')
    const appModule = await import(pathToFileURL(path.join(consumerRoot, 'app.js')).href)
    const rendered = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    assert.match(rendered, /data-d6-consumer/)
    assert.match(rendered, /Select file/)
    record.ssr = true

    await writeFile(path.join(consumerRoot, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="app"><!--SSR--></div><script type="module" src="/main.js"></script></body></html>')
    await writeFile(path.join(consumerRoot, 'main.js'), "import { createSSRApp } from 'vue'; import 'aheart-ui/style.css'; import { makeConsumerApp } from './app.js'; createSSRApp(makeConsumerApp()).mount('#app'); window.__d6Ready = true;")
    const vite = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/vite/dist/node/index.js')).href)
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: false } })
    const html = (await readFile(path.join(consumerRoot, 'dist/index.html'), 'utf8')).replace('<!--SSR-->', rendered)
    await writeFile(path.join(consumerRoot, 'dist/index.html'), html)
    const server = await vite.preview({ root: consumerRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`)
      await page.waitForFunction(() => window.__d6Ready)
      record.hydration = true
      await page.getByLabel('Select file').setInputFiles({ name: 'consumer.txt', mimeType: 'text/plain', buffer: Buffer.from('D6') })
      await page.getByRole('button', { name: 'Upload', exact: true }).click()
      await page.getByText('Done', { exact: true }).waitFor()
      assert.deepEqual(errors, [])
      record.interaction = true
    } finally {
      await browser.close()
      await new Promise(resolve => server.httpServer.close(resolve))
    }

    record.status = 'passed'
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    console.log(JSON.stringify({ status: record.status, tarballSHA256: record.tarballSHA256, output, consumerRoot }, null, 2))
  } catch (error) {
    record.status = 'failed'
    record.error = { name: error.name, message: error.message, stack: error.stack }
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    throw error
  }
}

await main()
