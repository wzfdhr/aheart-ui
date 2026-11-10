import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const entryMode = arg('--entry-mode') || 'legacy'
assert.ok(['legacy', 'subpath'].includes(entryMode), '--entry-mode must be legacy or subpath')
const browserEngine = arg('--browser') || 'chromium'
assert.ok(['chromium', 'firefox', 'webkit'].includes(browserEngine), '--browser must be chromium, firefox or webkit')
const strictTypesPolicy = arg('--strict-types') || 'pass'
assert.ok(['pass', 'known-card-error'].includes(strictTypesPolicy), '--strict-types must be pass or known-card-error')
const coreTarball = arg('--core-tarball') ? await realpath(arg('--core-tarball')) : undefined
const candidateManifest = coreTarball ? JSON.parse((await run('tar', ['-xOf', coreTarball, 'package/package.json'])).stdout) : undefined
if (candidateManifest) assert.equal(candidateManifest.name, 'aheart-ui', '--core-tarball must contain aheart-ui')
const candidate = coreTarball ? { path: coreTarball, version: candidateManifest.version, sha256: createHash('sha256').update(await readFile(coreTarball)).digest('hex') } : undefined
const runRoot = path.resolve(arg('--work-dir') || path.join(root, '.pilot-runs'))
await mkdir(runRoot, { recursive: true })
const out = path.resolve(arg('--out') || path.join(runRoot, `aheart-pilot-evidence-${Date.now()}`))
await mkdir(out, { recursive: false }) // Refuse to overwrite a prior run.
const workspace = await realpath(await mkdtemp(path.join(runRoot, 'aheart-m0-pilots-')))
const tooling = createRequire(path.join(root, 'pilots/tooling/package.json'))
const browserTypes = tooling('@playwright/test')
const { expect } = browserTypes
const { default: AxeBuilder } = tooling('@axe-core/playwright')
const available = ['clean-consumer', 'ai-review-gate', 'muxu-todo']
const names = arg('--only') ? arg('--only').split(',') : available
assert.ok(names.length > 0 && names.every(name => available.includes(name)), 'Unknown pilot')
const summary = { status: 'failed', generatedAt: new Date().toISOString(), sourceSha: (await run('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim(), node: process.version, workspace, evidence: out, origin: 'Newly created validation applications; not pre-existing business adoption', pilots: [], userAcceptance: 'not-run', electron: 'not-run (desktop browser baseline only)' }
summary.packageSource = candidate ? { kind: 'local-core-tarball', ...candidate } : { kind: 'public-registry' }
summary.strictTypesPolicy = strictTypesPolicy
summary.entryMode = entryMode
summary.browserEngine = browserEngine
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
  browser = await browserTypes[browserEngine].launch(browserEngine === 'firefox' ? { firefoxUserPrefs: { 'network.proxy.type': 0 } } : {})
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
      record.entryStrategy = name === 'clean-consumer' && entryMode === 'subpath' ? 'public-component-subpaths' : 'legacy-root-compatibility'
      if (record.entryStrategy === 'public-component-subpaths') {
        const imports = "import Button from 'aheart-ui/button'\nimport Modal from 'aheart-ui/modal'\nimport Select from 'aheart-ui/select'"
        for (const file of ['app.js', 'types.ts']) {
          const target = path.join(project, file)
          const text = await readFile(target, 'utf8')
          assert.ok(text.includes("import { Button, Modal, Select } from 'aheart-ui'"))
          await writeFile(target, text.replace("import { Button, Modal, Select } from 'aheart-ui'", imports).replace('使用现有根入口与全量 CSS，尚未宣称组件 CSS 按需。', '使用公开组件子入口与显式 theme/组件 CSS。'))
        }
        const target = path.join(project, 'main.js')
        await writeFile(target, (await readFile(target, 'utf8')).replace("import 'aheart-ui/style.css'", "import 'aheart-ui/theme.css'\nimport 'aheart-ui/button/style.css'\nimport 'aheart-ui/modal/style.css'\nimport 'aheart-ui/select/style.css'"))
        await mkdir(path.join(directory, 'consumed-source'))
        for (const file of ['app.js', 'main.js', 'types.ts']) await cp(path.join(project, file), path.join(directory, 'consumed-source', file))
      }
      const manifest = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'))
      if (candidate) {
        manifest.dependencies['aheart-ui'] = candidate.version
        await writeFile(path.join(project, 'package.json'), JSON.stringify({ ...manifest, dependencies: { ...manifest.dependencies, 'aheart-ui': `file:${coreTarball}` } }, null, 2) + '\n')
        await capture(record, 'candidate-lock', 'npm', ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'], project, directory)
      }
      await capture(record, 'install', 'npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'], project, directory)
      for (const [pkg, expected] of Object.entries(manifest.dependencies)) {
        const installed = path.join(project, 'node_modules', pkg)
        assert.equal((await lstat(installed)).isSymbolicLink(), false)
        assert.equal(await realpath(installed), installed)
        const actual = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8')).version
        assert.equal(actual, expected)
        record.packages[pkg] = { version: actual, symlink: false }
        if (pkg === 'aheart-ui' && candidate) record.packages[pkg].tarball = candidate
      }
      const lock = await readFile(path.join(project, 'package-lock.json'))
      record.lockSha256 = createHash('sha256').update(lock).digest('hex')
      await writeFile(path.join(directory, 'package-lock.json'), lock)
      await capture(record, 'typecheck', 'npm', ['run', 'typecheck'], project, directory)
      if (strictTypesPolicy === 'known-card-error') assert.equal(record.packages['aheart-ui'].version, '1.1.0', 'Known-error mode is restricted to the original 1.1.0 baseline')
      await capture(record, 'strict-types', 'npm', ['run', 'typecheck:strict'], project, directory, strictTypesPolicy === 'pass' ? 0 : 2)
      if (strictTypesPolicy === 'known-card-error') {
        const strict = await readFile(path.join(directory, 'strict-types.log'), 'utf8')
        const strictErrors = strict.split('\n').filter(line => /error TS\d+:/.test(line))
        assert.ok(strictErrors.length > 0)
        assert.ok(strictErrors.every(line => /node_modules\/aheart-ui\/(es|lib)\/card\/index\.d\.ts.*error TS2344:/.test(line)), 'Unexpected strict type error; inspect strict-types.log')
        record.knownIssues.push('Installed core Card declarations fail skipLibCheck:false (PR #39); no silent suppression of strict result')
      }
      record.strictTypes = strictTypesPolicy === 'pass' ? 'passed' : 'known-card-error'
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
          const context = await browser.newContext({ viewport, reducedMotion: 'reduce', ...(viewport.width < 600 && browserEngine !== 'firefox' ? { isMobile: true, hasTouch: true } : {}) })
          const page = await context.newPage(), errors = []
          page.on('pageerror', error => errors.push(error.message))
          page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
          const result = { viewport, browserEngine, browserVersion: browser.version(), url: `${url}/ssr.html`, checks: [], errors }
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
              await trigger.focus()
              await trigger.press('Enter')
              const dialog = page.getByRole('dialog', { name: '组件检查' })
              await expect(dialog).toBeVisible()
              const focusInside = () => dialog.evaluate(element => element.contains(element.ownerDocument.activeElement))
              await expect.poll(focusInside, { message: 'Modal initial focus must settle inside the dialog' }).toBe(true)
              for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); await expect.poll(focusInside, { message: 'Modal focus escaped' }).toBe(true) }
              // Compare native navigation independently of Modal and require
              // the real packed Modal to retain it while containing escapes.
              const probeHTML = '<input data-tab="radio-one" aria-label="One" type="radio" name="m1-choice" checked><input data-tab="radio-two" aria-label="Two" type="radio" name="m1-choice"><input data-tab="after-radio" aria-label="After radios"><div data-tab="editor" contenteditable="true">Editor</div><details><summary data-tab="summary">More</summary><input data-tab="closed-detail" aria-label="Closed detail"></details><input data-tab="date" aria-label="Date" type="date" value="2026-11-09"><video data-tab="media" controls tabindex="0"></video><button data-tab="end">End</button>'
              const cases = [['radio-one', 'Tab'], ['after-radio', 'Shift+Tab'], ['after-radio', 'Tab'], ['editor', 'Tab'], ['summary', 'Tab'], ['date', 'Tab'], ['media', 'Tab'], ['end', 'Shift+Tab']]
              const reference = await context.newPage()
              const oracle = []
              try {
                for (const [origin, key] of cases) {
                  await reference.setContent(`<div data-m1-tab-probe>${probeHTML}</div>`)
                  await reference.bringToFront()
                  await reference.locator('[data-m1-tab-probe]').click({ position: { x: 1, y: 1 } })
                  const target = reference.locator(`[data-tab="${origin}"]`)
                  await target.focus()
                  const supported = await target.evaluate(element => element === element.ownerDocument.activeElement || element.contains(element.ownerDocument.activeElement))
                  if (!supported) { oracle.push({ origin, key, supported: false }); continue }
                  await reference.keyboard.press(key)
                  await reference.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)))
                  const destination = await reference.evaluate(() => document.activeElement?.closest('[data-tab]')?.getAttribute('data-tab') ?? null)
                  oracle.push({ origin, key, supported: true, destination })
                }
              } finally { await reference.close(); await page.bringToFront() }
              await dialog.evaluate(element => {
                const host = element.ownerDocument.createElement('div')
                host.dataset.m1TabProbe = 'true'
                element.querySelector('.aheart-modal__body').append(host)
              })
              const probe = dialog.locator('[data-m1-tab-probe]')
              result.modalNativeTab = []
              for (const native of oracle) {
                await probe.evaluate((element, html) => { element.innerHTML = html }, probeHTML)
                await dialog.click({ position: { x: 1, y: 1 } })
                const target = probe.locator(`[data-tab="${native.origin}"]`)
                await target.focus()
                const supported = await target.evaluate(element => element === element.ownerDocument.activeElement || element.contains(element.ownerDocument.activeElement))
                assert.equal(supported, native.supported, 'Modal changed native programmatic focusability')
                if (!supported) { result.modalNativeTab.push({ ...native, status: 'not-focusable-in-engine' }); continue }
                await page.keyboard.press(native.key)
                await expect.poll(focusInside, { message: 'Native Tab escaped the blocking dialog' }).toBe(true)
                if (native.destination) await expect(probe.locator(`[data-tab="${native.destination}"]`)).toBeFocused()
                const actual = await page.evaluate(() => document.activeElement?.closest('[data-tab]')?.getAttribute('data-tab') ?? null)
                result.modalNativeTab.push({ ...native, actual, contained: true, status: 'passed' })
              }
              await probe.evaluate(element => element.remove())
              result.checks.push('independent native radio/editor/details/composite Tab oracle and containment')
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
            // Keep the failing hover state explicit: pointer position after a reorder
            // or a closing Modal must not decide whether contrast is checked.
            if (name === 'clean-consumer' || name === 'ai-review-gate') {
              if (name === 'ai-review-gate' && viewport.width < 600) {
                await page.getByRole('tab', { name: '执行', exact: true }).click()
                await page.getByRole('button', { name: '查看执行与产物', exact: true }).click()
              }
              const hoverTarget = name === 'clean-consumer'
                ? page.getByRole('button', { name: '打开检查弹窗' })
                : page.locator('[data-task-id]:visible [data-action="move-up"]:not(:disabled)').first()
              await hoverTarget.hover()
              await hoverTarget.evaluate(async element => {
                const transitions = element.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime))
                await Promise.all(transitions.map(animation => animation.finished.catch(() => {})))
              })
              result.hover = await hoverTarget.evaluate(element => ({
                text: element.textContent,
                active: element.matches(':hover'),
                foreground: getComputedStyle(element).color,
                background: getComputedStyle(element).backgroundColor
              }))
              assert.equal(result.hover.active, true)
              result.checks.push('explicit Button hover')
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
      record.status = record.browser.every(result => result.status === 'passed') ? (record.knownIssues.length ? 'passed-with-known-strict-type-issue' : 'passed') : 'failed'
      if (record.status === 'failed') record.error = 'Browser baseline has failures; inspect per-viewport reports'
    } catch (error) { record.error = error.stack; console.error(`${name}: ${error.message}`) }
    await writeFile(path.join(directory, 'results.json'), JSON.stringify(record, null, 2) + '\n')
    console.log(JSON.stringify({ name, status: record.status, project: record.project }))
  }
  summary.status = summary.pilots.every(x => x.status === 'passed') ? 'passed' : summary.pilots.every(x => x.status === 'passed' || x.status === 'passed-with-known-strict-type-issue') ? 'baseline-collected-with-known-issue' : 'failed'
} finally {
  if (browser) await browser.close()
  await writeFile(path.join(out, 'results.json'), JSON.stringify(summary, null, 2) + '\n')
}
if (summary.status === 'failed') process.exitCode = 1
else if (summary.pilots.some(record => record.knownIssues.length)) process.exitCode = 2
console.log(JSON.stringify({ status: summary.status, out, workspace }))
