import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { chromium } from '@playwright/test'

const run = promisify(execFile)
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const fixture = path.join(rootDir, 'docs/superpowers/experiments/d7-consumer')
const argument = (name) => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const tarball = argument('--tarball')
const output = argument('--out')
const phase = argument('--phase') ?? 'green'
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

const waitForSettle = async (page) => {
  await page.waitForTimeout(25)
  await page.evaluate(async () => { await window.__d7ConsumerState?.settle() })
}

const main = async () => {
  await mkdir(output, { recursive: true })
  const tarballPath = await realpath(tarball)
  const consumerRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-d7-')))
  for (const file of ['package.json', 'types.ts', 'app.js', 'main.js']) {
    await cp(path.join(fixture, file), path.join(consumerRoot, file))
  }
  await cp(tarballPath, path.join(consumerRoot, 'aheart-ui-dnd.tgz'))
  const record = {
    phase,
    generatedAt: new Date().toISOString(),
    node: process.version,
    pnpm: undefined,
    tarball: tarballPath,
    tarballSHA256: sha256(await readFile(tarballPath)),
    packageFileCount: undefined,
    consumerRoot,
    symlink: undefined,
    checks: {
      typecheck: false,
      esm: false,
      cjs: false,
      css: false,
      ssrDeterministic: false,
      hydration: false,
      genericKeyboard: false,
      sortableStableKey: false,
      sortableRevision: false,
      sortableControlledRollback: false,
      ownerDocumentCleanup: false
    }
  }

  try {
    const tarListing = await run('tar', ['-tzf', tarballPath], { maxBuffer: 2 * 1024 * 1024 })
    record.packageFileCount = tarListing.stdout.split('\n').filter(entry => entry.length > 0 && !entry.endsWith('/')).length
    const pnpmVersion = await run('corepack', ['pnpm', '--version'], { cwd: consumerRoot })
    record.pnpm = pnpmVersion.stdout.trim()
    await capture('npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'npm-install.log'))
    await capture('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'npm-ci.log'))
    record.symlink = (await lstat(path.join(consumerRoot, 'node_modules/@aheart-ui/dnd'))).isSymbolicLink()
    assert.equal(record.symlink, false, 'consumer dependency must be a copied package, not a workspace symlink')

    await capture(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(output, 'typecheck.log'))
    record.checks.typecheck = true

    const consumerRequire = createRequire(path.join(consumerRoot, 'probe.cjs'))
    const cjs = consumerRequire('@aheart-ui/dnd')
    assert.equal(typeof cjs.Draggable, 'object')
    assert.equal(typeof cjs.DropZone, 'object')
    assert.equal(typeof cjs.SortableList, 'object')
    record.checks.cjs = true
    const esm = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/@aheart-ui/dnd/es/index.js')).href)
    assert.ok(esm.Draggable && esm.DropZone && esm.SortableList)
    assert.equal(typeof esm.default, 'object')
    record.checks.esm = true

    const css = await readFile(path.join(consumerRoot, 'node_modules/@aheart-ui/dnd/es/style.css'), 'utf8')
    assert.match(css, /aheart-dnd-sortable-list/)
    assert.match(css, /aheart-dnd-live-region/)
    record.checks.css = true

    const vue = consumerRequire('vue')
    const renderer = consumerRequire('@vue/server-renderer')
    const appModule = await import(pathToFileURL(path.join(consumerRoot, 'app.js')).href)
    const renderedA = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    const renderedB = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    assert.equal(renderedA, renderedB, 'SSR output must be byte-for-byte deterministic')
    assert.doesNotMatch(renderedA, /aheart-dnd-live-region/)
    assert.doesNotMatch(renderedA, /data-aheart-sortable-list-id="aheart-sortable-/)
    record.checks.ssrDeterministic = true

    await writeFile(path.join(consumerRoot, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="app"><!--D7-SSR--></div><script type="module" src="/main.js"></script></body></html>')
    const vite = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/vite/dist/node/index.js')).href)
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'dist', emptyOutDir: true, minify: false } })
    await writeFile(path.join(consumerRoot, 'dist/index.html'), (await readFile(path.join(consumerRoot, 'dist/index.html'), 'utf8')).replace('<!--D7-SSR-->', renderedA))
    const server = await vite.preview({ root: consumerRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(`pageerror:${error.message}`))
      page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(`${message.type()}:${message.text()}`) })
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`)
      await page.waitForFunction(() => window.__d7Ready)
      assert.equal(await page.locator('[data-d7-consumer]').count(), 1)
      assert.deepEqual(errors, [], `hydration/runtime warnings: ${errors.join('; ')}`)
      record.checks.hydration = true

      const genericSource = page.locator('[data-d7-generic-source]')
      const genericTarget = page.locator('[data-d7-generic-target]')
      await genericSource.focus()
      await page.keyboard.press('Space')
      await page.keyboard.press('Escape')
      await page.keyboard.press('Enter')
      await genericTarget.focus()
      await page.keyboard.press('Enter')
      await waitForSettle(page)
      const genericState = await page.evaluate(() => ({
        grabs: window.__d7ConsumerState.genericGrabCount,
        cancels: window.__d7ConsumerState.genericCancelCount,
        drops: window.__d7ConsumerState.genericDropCount
      }))
      assert.deepEqual(genericState, { grabs: 2, cancels: 1, drops: 1 })
      record.checks.genericKeyboard = true

      const stableFirst = page.locator('[data-d7-stable] .aheart-dnd-sortable-item').first()
      await stableFirst.focus()
      await page.keyboard.press('Alt+ArrowDown')
      await waitForSettle(page)
      const stableIds = await page.evaluate(() => window.__d7ConsumerState.stableIds)
      assert.deepEqual(stableIds, ['stable-b', 'stable-a'], 'sortable keyboard reorder must use stable item keys')
      record.checks.sortableStableKey = true

      const controlledFirst = page.locator('[data-d7-controlled] .aheart-dnd-sortable-item').first()
      await controlledFirst.focus()
      await page.keyboard.press('Alt+ArrowRight')
      await waitForSettle(page)
      const controlledState = await page.evaluate(() => ({
        source: window.__d7ConsumerState.sourceIds,
        target: window.__d7ConsumerState.targetIds,
        reasons: window.__d7ConsumerState.rejects.map(event => event.reason),
        revisions: window.__d7ConsumerState.rejects.map(event => [event.source.revision, event.target.revision])
      }))
      assert.deepEqual(controlledState.source, ['source', 'source-tail'])
      assert.deepEqual(controlledState.target, ['target'])
      assert.equal(controlledState.reasons.filter(reason => reason === 'parent-rejected').length, 2)
      assert.deepEqual(controlledState.revisions, [['consumer-r1', 'consumer-r1'], ['consumer-r1', 'consumer-r1']])
      record.checks.sortableRevision = true
      record.checks.sortableControlledRollback = true

      const mainLiveBefore = await page.locator('body > .aheart-dnd-live-region').count()
      const iframeResult = await page.evaluate(async () => window.__d7CreateIframeCleanupProbe())
      assert.equal(iframeResult.liveRegionBeforeDetach, true)
      assert.equal(iframeResult.reason, 'owner-detached')
      assert.equal(iframeResult.liveRegionAfterDetach, false)
      assert.equal(await page.locator('body > .aheart-dnd-live-region').count(), mainLiveBefore)
      record.checks.ownerDocumentCleanup = true
    } finally {
      await browser.close()
      await new Promise(resolve => server.httpServer.close(resolve))
    }

    assert.deepEqual(Object.values(record.checks), Array(Object.keys(record.checks).length).fill(true))
    record.status = 'passed'
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    console.log(JSON.stringify({ status: record.status, phase, tarballSHA256: record.tarballSHA256, output, consumerRoot }, null, 2))
  } catch (error) {
    record.status = 'failed'
    record.error = { name: error.name, message: error.message, stack: error.stack }
    await writeFile(path.join(output, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
    throw error
  }
}

await main()
