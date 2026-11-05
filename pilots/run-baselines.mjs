import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const out = path.resolve(arg('--out') || path.join(tmpdir(), `aheart-pilot-evidence-${Date.now()}`))
await mkdir(out, { recursive: false }) // Refuse to overwrite a prior run.
const workspace = await realpath(await mkdtemp(path.join(tmpdir(), 'aheart-m0-pilots-')))
const tooling = createRequire(path.join(root, 'pilots/tooling/package.json'))
const { chromium, expect } = tooling('@playwright/test')
const { default: AxeBuilder } = tooling('@axe-core/playwright')
const available = ['clean-consumer', 'ai-review-gate', 'muxu-todo']
const names = arg('--only') ? arg('--only').split(',') : available
assert.ok(names.length > 0 && names.every(name => available.includes(name)), 'Unknown pilot')
const summary = { status: 'failed', generatedAt: new Date().toISOString(), sourceSha: (await run('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim(), node: process.version, workspace, evidence: out, origin: 'Newly created validation applications; not pre-existing business adoption', pilots: [], userAcceptance: 'not-run', electron: 'not-run (desktop browser baseline only)' }
const capture = async (record, label, command, args, cwd, directory, expected = 0) => {
  const started = performance.now()
  try {
    const result = await run(command, args, { cwd, maxBuffer: 30 * 1024 * 1024, timeout: 180000 })
    await writeFile(path.join(directory, `${label}.log`), result.stdout + result.stderr)
    record.commands.push({ label, command: [command, ...args], exitCode: 0, seconds: (performance.now() - started) / 1000, expectedExit: expected })
    assert.equal(expected, 0, `${label}: expected failure did not reproduce; reassess baseline`)
  } catch (error) {
    if (typeof error.code !== 'number') throw error
    await writeFile(path.join(directory, `${label}.log`), (error.stdout || '') + (error.stderr || '') + `\nexit=${error.code}\n`)
    record.commands.push({ label, command: [command, ...args], exitCode: error.code, seconds: (performance.now() - started) / 1000, expectedExit: expected })
    assert.equal(error.code, expected, `${label} failed; inspect its log`)
  }
}
let browser
try {
  browser = await chromium.launch()
  for (const name of names) {
    const directory = path.join(out, name), project = path.join(workspace, name)
    await mkdir(directory)
    const record = { name, status: 'failed', project, commands: [], browser: [], sourceFiles: {}, packages: {}, knownIssues: [] }
    summary.pilots.push(record)
    try {
      const source = path.join(root, 'pilots', name)
      await cp(source, project, { recursive: true, filter: file => !/(?:^|\/)(node_modules|dist|ssr\.html)(?:\/|$)/.test(file) })
      for (const file of await readdir(source)) {
        if ((await lstat(path.join(source, file))).isFile()) record.sourceFiles[file] = createHash('sha256').update(await readFile(path.join(source, file))).digest('hex')
      }
      await capture(record, 'install', 'npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'], project, directory)
      const manifest = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'))
      for (const [pkg, expected] of Object.entries(manifest.dependencies)) {
        const installed = path.join(project, 'node_modules', pkg)
        assert.equal((await lstat(installed)).isSymbolicLink(), false)
        assert.equal(await realpath(installed), installed)
        const actual = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8')).version
        assert.equal(actual, expected)
        record.packages[pkg] = { version: actual, symlink: false }
      }
      const lock = await readFile(path.join(project, 'package-lock.json'))
      record.lockSha256 = createHash('sha256').update(lock).digest('hex')
      await writeFile(path.join(directory, 'package-lock.json'), lock)
      await capture(record, 'typecheck', 'npm', ['run', 'typecheck'], project, directory)
      await capture(record, 'strict-types', 'npm', ['run', 'typecheck:strict'], project, directory, 2)
      const strict = await readFile(path.join(directory, 'strict-types.log'), 'utf8')
      assert.match(strict, /card\/index\.d\.ts.*TS2344/)
      record.knownIssues.push('Public aheart-ui@1.1.0 Card declarations fail skipLibCheck:false (PR #39); no silent suppression of strict result')
      await capture(record, 'build-ssr', 'npm', ['run', 'build'], project, directory)
      const graph = JSON.parse(await readFile(path.join(project, 'dist/module-graph.json'), 'utf8'))
      await writeFile(path.join(directory, 'module-graph.json'), JSON.stringify(graph, null, 2) + '\n')
      const rendered = graph.modules.filter(module => module.renderedLength > 0).map(module => module.id)
      record.moduleGraph = { renderedModules: rendered.length, ai: rendered.some(id => id.includes('/@aheart-ui/ai/')), dnd: rendered.some(id => id.includes('/@aheart-ui/dnd/')), css: graph.assets.filter(x => x.file.endsWith('.css')), js: graph.assets.filter(x => x.file.endsWith('.js')) }
      if (name !== 'ai-review-gate') { assert.equal(record.moduleGraph.ai, false); assert.equal(record.moduleGraph.dnd, false) }
      const vite = await import(pathToFileURL(path.join(project, 'node_modules/vite/dist/node/index.js')).href)
      const server = await vite.preview({ root: project, configFile: false, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } })
      const url = `http://127.0.0.1:${server.httpServer.address().port}`
      record.url = url
      try {
        for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
          const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
          const page = await context.newPage(), errors = []
          page.on('pageerror', error => errors.push(error.message))
          page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
          const result = { viewport, browserVersion: browser.version(), url: `${url}/ssr.html`, checks: [], errors }
          record.browser.push(result)
          try {
            const start = performance.now()
            await page.goto(result.url)
            await page.waitForFunction(() => window.__pilotReady?.hydration)
            result.firstRenderMilliseconds = performance.now() - start
            await expect(page.locator('[data-pilot]')).toBeVisible()
            result.checks.push('SSR hydration')
            if (name === 'clean-consumer') {
              await page.getByRole('button', { name: '点击计数', exact: true }).click()
              await expect(page.getByLabel('计数结果')).toHaveText('1')
              await page.getByRole('combobox', { name: '展示方式' }).click()
              await page.getByRole('option', { name: '紧凑', exact: true }).click()
              await expect(page.getByLabel('选中方式')).toHaveText('compact')
              const trigger = page.getByRole('button', { name: '打开检查弹窗' })
              await trigger.click()
              const dialog = page.getByRole('dialog', { name: '组件检查' })
              await expect(dialog).toBeVisible()
              for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); assert.ok(await dialog.evaluate(element => element.contains(element.ownerDocument.activeElement)), 'Modal focus escaped') }
              await page.keyboard.press('Escape')
              await expect(dialog).toBeHidden()
              await expect(trigger).toBeFocused()
              result.checks.push('counter', 'Select', 'Modal Tab trap/Escape/focus restore')
            } else if (name === 'muxu-todo') {
              await page.getByLabel('任务名称', { exact: true }).fill('验证消费升级')
              await page.getByRole('button', { name: '添加任务', exact: true }).click()
              await page.getByRole('checkbox', { name: '验证消费升级', exact: true }).check()
              await page.getByRole('combobox', { name: '任务筛选' }).click()
              await page.getByRole('option', { name: '已完成', exact: true }).click()
              await expect(page.getByRole('checkbox', { name: '验证消费升级', exact: true })).toBeChecked()
              await expect(page.getByRole('checkbox', { name: '核对组件样式', exact: true })).toHaveCount(0)
              await page.reload(); await page.waitForFunction(() => window.__pilotReady)
              await expect(page.getByRole('checkbox', { name: '验证消费升级', exact: true })).toBeChecked()
              await page.getByRole('button', { name: '删除 验证消费升级', exact: true }).click()
              await page.getByRole('button', { name: '确认删除', exact: true }).click()
              await expect(page.getByRole('checkbox', { name: '验证消费升级', exact: true })).toHaveCount(0)
              result.checks.push('create', 'complete', 'filter', 'localStorage reload', 'Modal delete')
            } else {
              const approve = page.getByRole('button', { name: '批准本地修订', exact: true })
              await expect(approve).toBeDisabled()
              await page.getByRole('checkbox', { name: '已检查变更内容', exact: true }).check()
              await expect(approve).toBeDisabled()
              await page.getByRole('checkbox', { name: '已完成本地验证', exact: true }).check()
              await page.getByRole('button', { name: '查看本地变更', exact: true }).click()
              await expect(page.getByRole('dialog', { name: '本地变更 R1' })).toBeVisible()
              await page.getByRole('button', { name: '返回检查', exact: true }).click()
              await page.getByLabel('消息内容', { exact: true }).fill('如何检查这次修订？')
              await page.getByRole('button', { name: '发送消息', exact: true }).click()
              await expect(page.getByText('本地复核建议：检查输入、样式和焦点，再批准修订。', { exact: true })).toBeVisible()
              if (viewport.width < 600) {
                await page.getByRole('tab', { name: '执行', exact: true }).click()
                await page.getByRole('button', { name: '查看执行与产物', exact: true }).click()
              }
              await page.locator('[data-task-id="verify"]:visible [data-action="move-up"]').click()
              await expect(page.locator('[data-task-id]:visible').first()).toHaveAttribute('data-task-id', 'verify')
              result.checks.push('Workbench task reorder')
              if (viewport.width < 600) await page.keyboard.press('Escape')
              await approve.click()
              await expect(page.getByLabel('修订状态')).toHaveText('已批准')
              await expect(page.getByLabel('批准记录')).toContainText('R1：人工批准已记录')
              await expect(approve).toBeDisabled()
              result.checks.push('checklist gate', 'Modal preview', 'local chat lifecycle', 'approval', 'repeat prevention')
            }
            const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
            await writeFile(path.join(directory, `axe-${viewport.width}.json`), JSON.stringify(audit, null, 2) + '\n')
            assert.deepEqual(audit.violations.map(x => ({ id: x.id, impact: x.impact, targets: x.nodes.map(n => n.target) })), [])
            result.checks.push('axe WCAG A/AA')
            await page.screenshot({ path: path.join(directory, `browser-${viewport.width}.png`), fullPage: true })
            assert.deepEqual(errors, [])
            result.status = 'passed'
          } catch (error) {
            result.status = 'failed'; result.error = error.stack
            await page.screenshot({ path: path.join(directory, `failure-${viewport.width}.png`), fullPage: true }).catch(() => {})
          } finally { await context.close() }
        }
        // Real child document: scripts and CSS are loaded inside the iframe.
        if (name === 'clean-consumer') {
          const page = await browser.newPage()
          try {
            await page.goto(`${url}/iframe.html`)
            const frame = page.frameLocator('iframe')
            await frame.getByRole('button', { name: '打开检查弹窗' }).click()
            await expect(frame.getByRole('dialog', { name: '组件检查' })).toBeVisible()
            await expect(page.locator('[role=dialog]')).toHaveCount(0)
            await frame.getByRole('button', { name: '完成检查', exact: true }).click()
            await expect(frame.getByText('检查完成', { exact: true })).toBeVisible()
            await page.screenshot({ path: path.join(directory, 'iframe.png'), fullPage: true })
            record.iframe = 'passed'
          } finally { await page.close() }
        }
      } finally { await new Promise(resolve => server.httpServer.close(resolve)) }
      record.status = record.browser.every(result => result.status === 'passed') ? 'passed-with-known-strict-type-issue' : 'failed'
      if (record.status === 'failed') record.error = 'Browser baseline has failures; inspect per-viewport reports'
    } catch (error) { record.error = error.stack; console.error(`${name}: ${error.message}`) }
    await writeFile(path.join(directory, 'results.json'), JSON.stringify(record, null, 2) + '\n')
    console.log(JSON.stringify({ name, status: record.status, project: record.project }))
  }
  summary.status = summary.pilots.every(x => x.status === 'passed-with-known-strict-type-issue') ? 'baseline-collected-with-known-issue' : 'failed'
} finally {
  if (browser) await browser.close()
  await writeFile(path.join(out, 'results.json'), JSON.stringify(summary, null, 2) + '\n')
}
if (summary.status === 'failed') process.exitCode = 1
else if (summary.pilots.some(record => record.knownIssues.length)) process.exitCode = 2
console.log(JSON.stringify({ status: summary.status, out, workspace }))
