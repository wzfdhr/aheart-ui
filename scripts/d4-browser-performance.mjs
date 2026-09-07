import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const selectPath = join(repo, 'packages/components/src/select/select.vue')
const harness = await mkdtemp(join(tmpdir(), 'aheart-d4-performance-'))
const outputDir = join(repo, 'docs/superpowers/evidence/d4-performance')
await mkdir(outputDir, { recursive: true })

await writeFile(join(harness, 'index.html'), `<div id="app"></div><script type="module" src="/@fs${join(harness, 'src/main.ts')}"></script>`)
await mkdir(join(harness, 'src'))
await writeFile(join(harness, 'src/main.ts'), `
import { createApp, h, nextTick, onMounted, ref } from 'vue'
import ${JSON.stringify(join(repo, 'packages/components/src/theme/index.css'))}
import Select from ${JSON.stringify(selectPath)}
import Cascader from ${JSON.stringify(join(repo, 'packages/components/src/cascader/cascader.vue'))}

const size = Number(new URLSearchParams(location.search).get('size') || 1000)
const mode = new URLSearchParams(location.search).get('mode') || 'select'
const variant = new URLSearchParams(location.search).get('variant') || 'fixed'
const options = Array.from({ length: size }, (_, index) => ({ label: 'Option ' + index.toString().padStart(5, '0'), value: index }))
const search = ref('')
const componentOptions = mode === 'select' ? options : options.map((option) => ({ ...option, isLeaf: true }))
const App = {
  setup() {
    onMounted(async () => { await nextTick(); requestAnimationFrame(() => { window.__d4Ready = performance.now() }) })
    return () => mode === 'select' ? h(Select, {
      options: componentOptions,
      defaultOpen: false,
      showSearch: true,
      placeholder: 'D4 baseline',
      searchValue: search.value,
      onSearch: (value) => { search.value = value },
      optionRender: (option, info) => variant === 'dynamic'
        ? h('span', { class: 'dynamic-render', 'data-render-index': info.index, style: 'display:block' }, info.index % 2 ? [option.label + ' / dynamic'] : [option.label + ' / dynamic', h('br'), 'detail'])
        : h('span', { class: 'fixed-render', 'data-render-index': info.index }, [option.label + ' / fixed'])
    }) : h(Cascader, { options: componentOptions, defaultOpen: false, showSearch: true, placeholder: 'D4 baseline' })
  }
}
window.__d4MountStart = performance.now()
createApp(App).mount('#app')
`)

const server = await createServer({
  root: harness,
  plugins: [vue()],
  resolve: { alias: { vue: join(repo, 'node_modules/vue/dist/vue.esm-bundler.js') } },
  server: { host: '127.0.0.1', port: 0, fs: { allow: [repo, harness] } }
})
await server.listen()
const address = server.httpServer.address()
const baseURL = `http://127.0.0.1:${typeof address === 'object' ? address.port : 5173}`
const browser = await chromium.launch({ headless: true })
const browserVersion = browser.version()
const results = []

try {
  for (const mode of ['select', 'cascader']) for (const variant of mode === 'select' ? ['fixed', 'dynamic'] : ['fixed']) for (const size of [1000, 5000, 10000]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      window.__d4LongTasks = []
      if ('PerformanceObserver' in window) {
        try {
          new PerformanceObserver((list) => {
            window.__d4LongTasks.push(...list.getEntries().map((entry) => ({ startTime: entry.startTime, duration: entry.duration })))
          }).observe({ type: 'longtask', buffered: true })
        } catch {}
      }
    })
    await page.goto(`${baseURL}/?size=${size}&mode=${mode}&variant=${variant}`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.__d4Ready !== undefined)
    const mountMs = await page.evaluate(() => window.__d4Ready - window.__d4MountStart)
    const openStart = Date.now()
    await page.locator(mode === 'select' ? '.aheart-select__selector' : '.aheart-cascader__trigger').click()
    await page.waitForSelector(mode === 'select' ? '.aheart-select__popup:visible' : '.aheart-cascader__panel:visible')
    const openMs = Date.now() - openStart
    const searchInput = page.locator(mode === 'select' ? '.aheart-select__search' : '.aheart-cascader__search')
    const searchStart = await page.evaluate(() => performance.now())
    await searchInput.fill('Option 000')
    await page.waitForFunction((selector) => document.querySelectorAll(selector).length === 100, mode === 'select' ? '.aheart-select__option' : '.aheart-cascader__search-results .aheart-cascader__option')
    const searchMs = (await page.evaluate(() => performance.now())) - searchStart
    await searchInput.fill('')
    await page.waitForFunction((size) => document.querySelectorAll('.aheart-select__option, .aheart-cascader__column .aheart-cascader__option').length === size, size)
    const keyboardStart = await page.evaluate(() => performance.now())
    if (mode === 'select') for (let index = 0; index < 20; index += 1) await searchInput.press('ArrowDown')
    else { await page.locator('.aheart-cascader__option').first().focus(); for (let index = 0; index < 20; index += 1) await page.keyboard.press('ArrowDown') }
    const keyboardMs = (await page.evaluate(() => performance.now())) - keyboardStart
    const metrics = await page.evaluate(() => ({
      optionDomCount: document.querySelectorAll('.aheart-select__option, .aheart-cascader__option').length,
      dynamicRenderCount: document.querySelectorAll('.dynamic-render').length,
      activeOptionCount: document.querySelectorAll('.aheart-select__option.is-active, .aheart-cascader__option.is-active').length,
      activeDescendant: document.querySelector('.aheart-select__search')?.getAttribute('aria-activedescendant') ?? document.querySelector('.aheart-cascader__trigger')?.getAttribute('aria-activedescendant') ?? null,
      activeText: (() => { const id = document.querySelector('.aheart-select__search')?.getAttribute('aria-activedescendant') ?? document.querySelector('.aheart-cascader__trigger')?.getAttribute('aria-activedescendant'); return id ? document.getElementById(id)?.textContent ?? null : null })(),
      optionHeights: [...document.querySelectorAll('.aheart-select__option, .aheart-cascader__option')].slice(0, 100).map((node) => Math.round(node.getBoundingClientRect().height * 100) / 100),
      activeRect: (() => { const activeId = document.querySelector('.aheart-select__search')?.getAttribute('aria-activedescendant') ?? document.querySelector('.aheart-cascader__trigger')?.getAttribute('aria-activedescendant'); const node = activeId ? document.getElementById(activeId) : null; if (!node) return null; const rect = node.getBoundingClientRect(); const viewport = node.closest('.aheart-select__popup, .aheart-cascader__column')?.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, viewportTop: viewport?.top ?? null, viewportBottom: viewport?.bottom ?? null, fullyVisible: Boolean(viewport && rect.top >= viewport.top && rect.bottom <= viewport.bottom) } })(),
      longTasks: window.__d4LongTasks ?? [],
      longTasksAfterMount: (window.__d4LongTasks ?? []).filter((entry) => entry.startTime >= window.__d4MountStart)
    }))
    if (errors.length) throw new Error(errors.join('\n'))
    if (process.argv.includes('--require-visible')) {
      assert.equal(metrics.optionDomCount, size)
      assert.equal(metrics.activeRect?.fullyVisible, true, `${mode}/${variant}/${size}: active option must remain visible after 20 ArrowDown presses`)
      assert.equal(metrics.activeDescendant !== null, true)
      assert.match(metrics.activeText, /Option 00020/)
    }
    if (size === 1000) await page.screenshot({ path: join(outputDir, `${mode}-${variant}-keyboard-${Date.now()}.png`) })
    results.push({ mode, variant, size, mountMs, openMs, searchMs, keyboard20Ms: keyboardMs, ...metrics })
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
  await rm(harness, { recursive: true, force: true })
}

const payload = {
  schema: 'd4-browser-performance/v1',
  generatedAt: new Date().toISOString(),
  environment: {
    browser: 'Chromium (Playwright headless)',
    browserVersion,
    mode: 'Vite development; not a production bundle benchmark',
    viewport: '1440x900',
    node: process.version,
    platform: process.platform,
    note: 'Single desktop run; non-statistical baseline, not an absolute pass/fail threshold.'
  },
  reproduction: 'corepack pnpm exec node scripts/d4-browser-performance.mjs',
  components: ['packages/components/src/select/select.vue', 'packages/components/src/cascader/cascader.vue'],
  sourceHashes: Object.fromEntries(['packages/components/src/select/select.vue', 'packages/components/src/cascader/cascader.vue', 'packages/components/src/select/style.css', 'packages/components/src/cascader/style.css', 'packages/components/src/theme/index.css'].map(path => [path, createHash('sha256').update(readFileSync(join(repo, path))).digest('hex')])),
  gitHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  timingMethod: 'mount is browser createApp.mount to nextTick+requestAnimationFrame; open/search/keyboard include Playwright action round-trip and are reported as such.',
  scenarios: results
}
const output = join(outputDir, `baseline-${new Date().toISOString().replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z')}.json`)
await writeFile(output, JSON.stringify(payload, null, 2) + '\n')
console.log(JSON.stringify({ output, scenarios: results }, null, 2))
