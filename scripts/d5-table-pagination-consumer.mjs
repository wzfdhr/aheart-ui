import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { createRequire } from 'node:module'
import { execFile } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'

const run = promisify(execFile)
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const fixture = path.join(rootDir, 'docs/superpowers/experiments/d5-a-consumer')
const arg = name => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const tarball = arg('--tarball')
const output = arg('--out')
assert.ok(tarball, '--tarball is required')
assert.ok(output, '--out directory is required')

const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const capture = async (command, args, options, logPath) => {
  try {
    const result = await run(command, args, options)
    await writeFile(logPath, result.stdout + result.stderr)
    return { code: 0, stdout: result.stdout, stderr: result.stderr }
  } catch (error) {
    await writeFile(logPath, (error.stdout ?? '') + (error.stderr ?? '') + `\nexit=${error.code ?? 1}\n`)
    throw error
  }
}

const main = async () => {
  await mkdir(output, { recursive: true })
  const tarballPath = await realpath(tarball)
  const consumerRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-d5-a-')))
  await cp(path.join(fixture, 'package.json'), path.join(consumerRoot, 'package.json'))
  await cp(path.join(fixture, 'app.js'), path.join(consumerRoot, 'app.js'))
  await cp(path.join(fixture, 'types.ts'), path.join(consumerRoot, 'types.ts'))
  await cp(tarballPath, path.join(consumerRoot, 'aheart-ui.tgz'))
  await writeFile(path.join(output, 'consumer-root.txt'), consumerRoot + '\n')

  const record = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    tarball: tarballPath,
    tarballSHA256: sha(await readFile(tarballPath)),
    consumerRoot,
    symlink: false,
    install: {},
    typecheck: {},
    imports: {},
    ssr: {},
    hydration: []
  }

  try {
    const tarballSHA256BeforeInstall = sha(await readFile(tarballPath))
    const install = await capture(
      'npm',
      ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 },
      path.join(output, 'npm-install.log')
    )
    const lockBytes = await readFile(path.join(consumerRoot, 'package-lock.json'))
    const installLockSHA256 = sha(lockBytes)
    await writeFile(path.join(output, 'package-lock.after-install.json'), lockBytes)
    const ci = await capture(
      'npm',
      ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 },
      path.join(output, 'npm-ci.log')
    )
    const ciLockBytes = await readFile(path.join(consumerRoot, 'package-lock.json'))
    const ciLockSHA256 = sha(ciLockBytes)
    await writeFile(path.join(output, 'package-lock.after-ci.json'), ciLockBytes)
    assert.equal(ciLockSHA256, installLockSHA256, 'npm ci changed package-lock.json')
    record.install = { code: install.code, ciCode: ci.code, lockSHA256: ciLockSHA256, lockBytes: ciLockBytes.length }
    record.symlink = (await lstat(path.join(consumerRoot, 'node_modules/aheart-ui'))).isSymbolicLink()
    assert.equal(record.symlink, false, 'consumer package must not be a workspace symlink')

    const tsc = await capture(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'],
      { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 },
      path.join(output, 'typecheck.log')
    )
    record.typecheck = { code: tsc.code, passed: true }

    const consumerRequire = createRequire(path.join(consumerRoot, 'probe.cjs'))
    const cjs = consumerRequire('aheart-ui')
    const esmImport = await capture(
      process.execPath,
      ['-e', "import('aheart-ui').then(({Table,Pagination}) => { if (typeof Table !== 'object' || typeof Pagination !== 'object') process.exit(2) })"],
      { cwd: consumerRoot, maxBuffer: 20 * 1024 * 1024 },
      path.join(output, 'esm-import.log')
    )
    assert.equal(typeof cjs.Table, 'object')
    assert.equal(typeof cjs.Pagination, 'object')
    record.imports = { cjs: ['Table', 'Pagination'], esm: ['Table', 'Pagination'], esmExitCode: esmImport.code }

    const vue = consumerRequire('vue')
    const renderer = consumerRequire('@vue/server-renderer')
    const appModule = await import(pathToFileURL(path.join(consumerRoot, 'app.js')).href)
    const rendered = {}
    const cjsTableHTML = await renderer.renderToString(vue.createSSRApp({
      render: () => vue.h(cjs.Table, {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ key: 'cjs', name: 'CJS' }],
        dataMode: 'server',
        pagination: { current: 1, pageSize: 1, total: 1 }
      })
    }))
    const cjsPaginationHTML = await renderer.renderToString(vue.createSSRApp({
      render: () => vue.h(cjs.Pagination, { total: 20, current: 2, pageSize: 10 })
    }))
    assert.match(cjsTableHTML, /CJS/)
    assert.match(cjsPaginationHTML, /aheart-pagination/)
    const stripMarkup = value => value
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, '')
      .trim()
    const rowTexts = html => {
      const tbody = html.match(/<tbody(?:\s[^>]*)?>([\s\S]*?)<\/tbody>/)?.[1] ?? ''
      return [...tbody.matchAll(/<tr(?:\s[^>]*)?>([\s\S]*?)<\/tr>/g)].map(match => stripMarkup(match[1]))
    }
    for (const mode of ['server', 'local']) {
      const settings = appModule.settingsFor(mode)
      const html = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp(settings)))
      rendered[mode] = html
      assert.ok(html.includes('<table>'), `${mode} SSR table missing`)
      const names = rowTexts(html)
      if (mode === 'server') {
        assert.deepEqual(names.slice(0, 2), ['Linus42', 'Ada36'])
      } else {
        assert.deepEqual(names.slice(0, 2), ['Linus42', 'Margaret31'])
        assert.match(html, /aheart-table__select-all/)
      }
    }
    record.ssr = { serverOrder: ['Linus', 'Ada'], localPage2: ['Linus', 'Margaret'], headerSelection: true }

    await writeFile(path.join(consumerRoot, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="app"><!--SSR--></div><script type="module" src="/main.js"></script></body></html>')
    await writeFile(path.join(consumerRoot, 'main.js'), `import { createSSRApp } from 'vue'; import 'aheart-ui/style.css'; import { makeConsumerApp } from './app.js'; const app = createSSRApp(makeConsumerApp(window.__D5_SETTINGS__)); app.mount('#app'); window.__fixtureReady = true;`)
    const { build, preview } = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/vite/dist/node/index.js')).href)
    await build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: false, sourcemap: false } })
    const template = await readFile(path.join(consumerRoot, 'dist/index.html'), 'utf8')
    for (const mode of ['server', 'local']) {
      const settings = appModule.settingsFor(mode)
      const page = template
        .replace('<!--SSR-->', rendered[mode])
        .replace('</body>', `<script>window.__D5_SETTINGS__=${JSON.stringify(settings)}</script></body>`)
      await writeFile(path.join(consumerRoot, `dist/${mode}.html`), page)
    }

    const server = await preview({ root: consumerRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
      const base = `http://127.0.0.1:${server.httpServer.address().port}`
      for (const mode of ['server', 'local']) {
        const warnings = []
        page.on('pageerror', error => warnings.push(error.message))
        page.on('console', message => {
          if (message.type() === 'warning' || message.type() === 'error') warnings.push(message.text())
        })
        await page.goto(`${base}/${mode}.html`)
        await page.waitForFunction(() => window.__fixtureReady)
        await page.waitForTimeout(50)
        const names = await page.locator('tbody tr:not(.aheart-table__expanded-row)').allTextContents()
        if (mode === 'server') assert.deepEqual(names.map(name => name.trim()), ['Linus42', 'Ada36'])
        else {
          assert.deepEqual(names.map(name => name.trim()), ['Linus42', 'Margaret31'])
          assert.equal(await page.locator('.aheart-table__select-all').count(), 1)
        }
        assert.deepEqual(warnings, [], `${mode} hydration warnings/errors`)
        record.hydration.push({ mode, warnings })
        page.removeAllListeners('pageerror')
        page.removeAllListeners('console')
      }
    } finally {
      await browser.close()
      await new Promise(resolve => server.httpServer.close(resolve))
    }

    const tarballSHA256AfterRun = sha(await readFile(tarballPath))
    assert.equal(tarballSHA256AfterRun, tarballSHA256BeforeInstall, 'tarball changed during consumer validation')
    record.tarballSHA256After = tarballSHA256AfterRun
    record.status = 'passed'
    await writeFile(path.join(output, 'results.json'), JSON.stringify(record, null, 2) + '\n')
    console.log(JSON.stringify({ status: record.status, output, consumerRoot, tarballSHA256: record.tarballSHA256 }, null, 2))
  } catch (error) {
    record.status = 'failed'
    record.error = { name: error.name, message: error.message, stack: error.stack }
    await writeFile(path.join(output, 'results.json'), JSON.stringify(record, null, 2) + '\n')
    throw error
  }
}

await main()
