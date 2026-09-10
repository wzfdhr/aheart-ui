import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, readdir, stat, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const rootDir = fileURLToPath(new URL('../../../..', import.meta.url))
const fixture = path.join(rootDir, 'docs/superpowers/experiments/d8-consumer')
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const out = arg('--out')
const aiTarball = arg('--ai-tarball')
const componentsTarball = arg('--components-tarball')
const dndTarball = arg('--dnd-tarball')
assert.ok(out, '--out is required')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const tarballFileCount = async file => {
  const listing = await run('tar', ['-tzf', file], { maxBuffer: 10 * 1024 * 1024 })
  return listing.stdout.trim() ? listing.stdout.trim().split('\n').length : 0
}
const capture = async (command, args, options, logPath) => {
  try {
    const result = await run(command, args, options)
    await writeFile(logPath, `${result.stdout ?? ''}${result.stderr ?? ''}`)
    return result
  } catch (error) {
    await writeFile(logPath, `${error.stdout ?? ''}${error.stderr ?? ''}\nexit=${error.code ?? 1}\n`)
    throw error
  }
}
const packageInfo = async (root, name) => {
  const packageRoot = path.join(root, 'node_modules', name)
  const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'))
  const entries = await readdir(packageRoot, { recursive: true })
  return { packageRoot, packageJson, entries: entries.sort(), symlink: (await lstat(packageRoot)).isSymbolicLink() }
}
const failedMissingInput = async reason => {
  await mkdir(out, { recursive: true })
  const result = { status: 'failed', phase: 'red', reason, generatedAt: new Date().toISOString(), node: process.version, npm: null, pnpm: null, gates: {} }
  await writeFile(path.join(out, 'results.json'), `${JSON.stringify(result, null, 2)}\n`)
  console.error(JSON.stringify(result, null, 2))
  process.exitCode = 1
}

if (!aiTarball || !componentsTarball || !dndTarball) await failedMissingInput('all three real tarballs are required; refusing to substitute workspace packages')
else {
  const consumerRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-d8-ai-')))
  await mkdir(out, { recursive: true })
  for (const file of ['package.json', 'types.ts', 'app.js', 'main.js']) await cp(path.join(fixture, file), path.join(consumerRoot, file))
  await cp(await realpath(aiTarball), path.join(consumerRoot, 'aheart-ui-ai.tgz'))
  await cp(await realpath(componentsTarball), path.join(consumerRoot, 'aheart-ui.tgz'))
  await cp(await realpath(dndTarball), path.join(consumerRoot, 'aheart-ui-dnd.tgz'))
  const record = {
    status: 'failed', generatedAt: new Date().toISOString(), node: process.version, npm: null, pnpm: null,
    consumerRoot, tarballs: {}, symlink: false, packageFiles: false, typecheck: false, imports: false,
    css: false, pluginInstall: false, reducer: false, ssr: false, hydration: false,
    chatLifecycle: false, workbench: false, aiForm: false, primitiveBundle: false, gzip: { status: 'not-run' }, gates: {}
  }
  try {
    try { record.npm = (await run('npm', ['--version'], { cwd: consumerRoot })).stdout.trim() } catch { record.npm = null }
    try { record.pnpm = (await run('corepack', ['pnpm', '--version'], { cwd: consumerRoot })).stdout.trim() } catch { record.pnpm = null }
    for (const [key, file] of Object.entries({ ai: aiTarball, components: componentsTarball, dnd: dndTarball })) {
      const bytes = await readFile(file)
      record.tarballs[key] = { path: await realpath(file), sha256: sha256(bytes), bytes: bytes.length, files: await tarballFileCount(file) }
    }
    await capture('npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(out, 'npm-install.log'))
    for (const name of ['aheart-ui', '@aheart-ui/dnd', '@aheart-ui/ai']) {
      const info = await packageInfo(consumerRoot, name)
      record.symlink ||= info.symlink
      assert.equal(info.symlink, false, `${name} is a workspace symlink`)
      assert.ok(info.entries.includes('es/index.js') || info.entries.includes('es/index.d.ts'), `${name} missing ESM files`)
      assert.ok(info.entries.includes('lib/index.js'), `${name} missing CJS files`)
      assert.ok(info.entries.some(entry => entry.endsWith('style.css')), `${name} missing CSS`)
    }
    record.packageFiles = true
    await capture(process.execPath, ['-e', "import('./types.ts').catch(error => { console.error(error); process.exit(1) })"], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(out, 'public-type-import.log')).catch(() => {})
    await capture('npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }, path.join(out, 'typecheck.log'))
    record.typecheck = true

    const consumerRequire = createRequire(path.join(consumerRoot, 'probe.cjs'))
    const cjs = consumerRequire('@aheart-ui/ai')
    assert.equal(typeof cjs.AIForm, 'object')
    assert.equal(typeof cjs.AIAgentWorkbench, 'object')
    assert.equal(typeof cjs.createAIStreamReducer, 'function')
    const esm = await import('@aheart-ui/ai')
    assert.equal(typeof esm.AIChatPanel, 'object')
    assert.equal(typeof esm.createAIStreamReducer, 'function')
    const css = await readFile(path.join(consumerRoot, 'node_modules/@aheart-ui/ai/es/style.css'), 'utf8')
    assert.match(css, /aheart-ai-workbench/)
    assert.match(css, /aheart-ai-chat-panel/)
    record.imports = true
    record.css = true
    const appModule = await import(pathToFileURL(path.join(consumerRoot, 'app.js')).href)
    const vue = consumerRequire('vue')
    const renderer = consumerRequire('@vue/server-renderer')
    const ssrOne = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    const ssrTwo = await renderer.renderToString(vue.createSSRApp(appModule.makeConsumerApp()))
    assert.equal(ssrOne, ssrTwo, 'SSR output is not deterministic')
    assert.match(ssrOne, /data-d8-consumer/)
    record.ssr = true

    const plugin = cjs.default
    const pluginApp = vue.createApp({ render: () => vue.h('div') })
    pluginApp.use(plugin)
    assert.ok(pluginApp.component('AAIForm'))
    assert.ok(pluginApp.component('AAIAgentWorkbench'))
    record.pluginInstall = true
    const reducer = esm.createAIStreamReducer({ requestId: 'request', messageId: 'message' })
    reducer.dispatch({ version: '2', requestId: 'request', messageId: 'message', sequence: 1, revision: 0, type: 'text-delta', delta: 'hello' })
    const reduced = reducer.dispatch({ version: '2', requestId: 'request', messageId: 'message', sequence: 2, revision: 0, type: 'final', message: { id: 'message', role: 'assistant', content: 'hello', status: 'complete' } })
    assert.equal(reduced.status, 'completed')
    assert.equal(reduced.message.content, 'hello')
    record.reducer = true

    await writeFile(path.join(consumerRoot, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="app"><!--SSR--></div><script type="module" src="/main.js"></script></body></html>')
    const vite = await import(pathToFileURL(path.join(consumerRoot, 'node_modules/vite/dist/node/index.js')).href)
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true }, build: { outDir: 'dist', emptyOutDir: true, minify: false } })
    await writeFile(path.join(consumerRoot, 'dist/index.html'), (await readFile(path.join(consumerRoot, 'dist/index.html'), 'utf8')).replace('<!--SSR-->', ssrOne))
    const server = await vite.preview({ root: consumerRoot, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
    const { chromium } = await import('@playwright/test')
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`)
      await page.waitForFunction(() => window.__d8Ready)
      await page.evaluate(() => window.__d8ConsumerState.settle())
      assert.deepEqual(errors, [])
      record.hydration = true
      const composer = page.getByLabel('消息内容')
      await composer.fill('consumer lifecycle')
      await page.getByRole('button', { name: '发送消息' }).click()
      await page.getByText('Hello from D8', { exact: true }).waitFor()
      record.chatLifecycle = Boolean(await page.locator('[data-d8-chat]').count() && await page.locator('[data-message-id]').count())
      await page.locator('[data-approval-id="approval-1"] [data-action="approve"]').first().click()
      await page.locator('[data-task-id="free-task"] [data-action="move-up"]').first().click()
      await page.evaluate(() => window.__d8ConsumerState.settle())
      const operationCount = await page.evaluate(() => window.__d8ConsumerState.operations.length)
      const moveCount = await page.evaluate(() => window.__d8ConsumerState.moveEvents.length)
      record.workbench = Boolean(await page.getByText('Approve deployment').count() && await page.getByText('Deploy artifact').count() && operationCount === 1 && moveCount >= 1)
      record.aiForm = Boolean(await page.getByLabel('Name').count() && await page.getByLabel('Count').count())
      assert.equal(record.chatLifecycle && record.workbench && record.aiForm, true)
    } finally { await browser.close(); await new Promise(resolve => server.httpServer.close(resolve)) }

    const primitive = path.join(consumerRoot, 'primitive-entry.js')
    await writeFile(primitive, "import AIForm from '@aheart-ui/ai/es/form.vue'; export { AIForm };\n")
    await vite.build({ root: consumerRoot, configFile: false, logLevel: 'error', build: { outDir: 'primitive-dist', emptyOutDir: true, minify: false, lib: { entry: primitive, formats: ['es'], fileName: 'primitive' } } })
    const primitiveBundle = await readFile(path.join(consumerRoot, 'primitive-dist/primitive.js'), 'utf8')
    assert.doesNotMatch(primitiveBundle, /agent-workbench|@aheart-ui\/dnd|SortableList/)
    record.primitiveBundle = true
    record.status = 'passed'
  } catch (error) {
    record.error = { name: error.name, message: error.message, stack: error.stack }
  }
  await writeFile(path.join(out, 'results.json'), `${JSON.stringify(record, null, 2)}\n`)
  if (record.status !== 'passed') { console.error(JSON.stringify(record, null, 2)); process.exitCode = 1 }
  else console.log(JSON.stringify({ status: record.status, out, consumerRoot }, null, 2))
}
