import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
assert.ok(arg('--project') && arg('--core-tarball') && arg('--out'), 'Required: --project <isolated muxu-todo> --core-tarball <candidate.tgz> --out <new evidence directory>')
const project = await realpath(arg('--project'))
const relative = path.relative(await realpath(path.join(root, '.pilot-runs')), project)
assert.match(relative, /^aheart-m0-pilots-[^/]+\/muxu-todo$/, 'Only a runner-created isolated muxu-todo copy may be modified')
const tarball = await realpath(arg('--core-tarball'))
const candidate = JSON.parse((await run('tar', ['-xOf', tarball, 'package/package.json'])).stdout)
assert.equal(candidate.name, 'aheart-ui')
const out = path.resolve(arg('--out'))
await mkdir(out, { recursive: false })
const originalManifest = await readFile(path.join(project, 'package.json'))
const originalLock = await readFile(path.join(project, 'package-lock.json'))
const baselineLock = await readFile(path.join(root, 'pilots/muxu-todo/package-lock.json'))
const baselineCore = JSON.parse(baselineLock).packages['node_modules/aheart-ui']
assert.equal(baselineCore.version, '1.1.0')
assert.match(baselineCore.resolved, /^https:\/\/registry\.npmjs\.org\/aheart-ui\/-\//)
const manifest = JSON.parse(originalManifest)
assert.equal(manifest.name, 'aheart-pilot-muxu-todo')
assert.equal(manifest.private, true)
const sha256 = data => createHash('sha256').update(data).digest('hex')
const result = { status: 'failed', project, candidate: { version: candidate.version, sha256: sha256(await readFile(tarball)) }, baseline: 'aheart-ui@1.1.0', originalLockSha256: sha256(originalLock), commands: [], stages: [], errors: [], restoration: 'not-run' }
const command = async (label, args) => {
  try {
    const done = await run('npm', args, { cwd: project, timeout: 180000, maxBuffer: 30 * 1024 * 1024 })
    await writeFile(path.join(out, `${label}.log`), done.stdout + done.stderr)
    result.commands.push({ label, args, exitCode: 0 })
  } catch (error) {
    await writeFile(path.join(out, `${label}.log`), (error.stdout || '') + (error.stderr || error.message))
    result.commands.push({ label, args, exitCode: error.code ?? 1 })
    throw error
  }
}
const install = async (dependency, label) => {
  await writeFile(path.join(project, 'package.json'), JSON.stringify({ ...manifest, dependencies: { ...manifest.dependencies, 'aheart-ui': dependency } }, null, 2) + '\n')
  if (dependency === '1.1.0') {
    // A local candidate can have the same version as the registry baseline.
    // Restore the registry lock explicitly; a semver edit alone can retain file:.
    await writeFile(path.join(project, 'package-lock.json'), baselineLock)
  } else {
    await command(`${label}-lock`, ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'])
  }
  await command(`${label}-install`, ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'])
  await command(`${label}-build`, ['run', 'build'])
  const lock = await readFile(path.join(project, 'package-lock.json'))
  const core = JSON.parse(lock).packages['node_modules/aheart-ui']
  if (dependency === '1.1.0') {
    assert.equal(core.resolved, baselineCore.resolved)
    assert.equal(core.integrity, baselineCore.integrity)
  } else {
    assert.ok(core.resolved.startsWith('file:'))
    assert.equal(path.resolve(project, core.resolved.slice(5)), tarball)
    assert.equal(core.integrity, `sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`)
  }
  await writeFile(path.join(out, `${label}-package-lock.json`), lock)
}
const tooling = createRequire(path.join(root, 'pilots/tooling/package.json'))
const { chromium, expect } = tooling('@playwright/test')
let server, browser
try {
  await install('1.1.0', 'baseline')
  const vite = await import(pathToFileURL(path.join(project, 'node_modules/vite/dist/node/index.js')).href)
  server = await vite.preview({ root: project, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
  result.url = `http://127.0.0.1:${server.httpServer.address().port}/ssr.html`
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  page.on('pageerror', error => result.errors.push(error.message))
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) result.errors.push(message.text()) })
  const load = async () => {
    await page.goto(result.url)
    await page.waitForFunction(() => window.__pilotReady?.hydration)
  }
  const add = async title => {
    await page.getByLabel('任务名称', { exact: true }).fill(title)
    await page.getByRole('button', { name: '添加任务', exact: true }).click()
    await expect(page.getByRole('checkbox', { name: title, exact: true })).toBeVisible()
  }
  const snapshot = async (name, expectedColor) => {
    const button = page.getByRole('button', { name: '删除 核对组件样式', exact: true })
    await button.hover()
    await expect(button).toHaveCSS('color', expectedColor)
    const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('aheart-m0-muxu-todo-v1')))
    const lock = JSON.parse(await readFile(path.join(project, 'package-lock.json'), 'utf8'))
    result.stages.push({ name, tasks, core: lock.packages['node_modules/aheart-ui'], foreground: expectedColor })
    await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true })
  }
  const before = '迁移前保留任务', during = '候选期间新增任务'
  await load()
  await add(before)
  await page.getByRole('checkbox', { name: before, exact: true }).check()
  await snapshot('baseline', 'rgb(64, 150, 255)')
  await install(`file:${tarball}`, 'upgrade')
  await load()
  await expect(page.getByRole('checkbox', { name: before, exact: true })).toBeChecked()
  await add(during)
  await page.getByRole('checkbox', { name: during, exact: true }).check()
  await page.getByRole('checkbox', { name: before, exact: true }).uncheck()
  await snapshot('upgrade', 'rgb(0, 62, 179)')
  await install('1.1.0', 'rollback')
  await load()
  await expect(page.getByRole('checkbox', { name: before, exact: true })).not.toBeChecked()
  await expect(page.getByRole('checkbox', { name: during, exact: true })).toBeChecked()
  await page.getByRole('button', { name: `删除 ${before}`, exact: true }).click()
  await page.getByRole('button', { name: '确认删除', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: before, exact: true })).toHaveCount(0)
  await snapshot('rollback', 'rgb(64, 150, 255)')
  assert.deepEqual(result.errors, [])
  result.status = 'passed'
} catch (error) {
  result.error = error.stack
  console.error(error.message)
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(resolve => server.httpServer.close(resolve))
  try {
    await writeFile(path.join(project, 'package.json'), originalManifest)
    await writeFile(path.join(project, 'package-lock.json'), originalLock)
    await command('restore-install', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'])
    await command('restore-build', ['run', 'build'])
    assert.deepEqual(await readFile(path.join(project, 'package.json')), originalManifest)
    assert.deepEqual(await readFile(path.join(project, 'package-lock.json')), originalLock)
    result.restoration = 'passed'
  } catch (error) { result.restoration = 'failed'; result.restorationError = error.stack; result.status = 'failed' }
  await writeFile(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n')
}
console.log(JSON.stringify({ status: result.status, restoration: result.restoration, out }))
if (result.status !== 'passed') process.exitCode = 1
