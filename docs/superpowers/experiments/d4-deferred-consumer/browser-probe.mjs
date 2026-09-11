import assert from 'node:assert/strict'
import { chromium, firefox, webkit } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const url = arg('--url')
const output = arg('--out')
const browserName = arg('--browser') ?? 'chromium'
assert(url, '--url is required')
const Browser = { chromium, firefox, webkit }[browserName]
assert(Browser, `unsupported browser ${browserName}`)

const browser = await Browser.launch()
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
const errors = []
page.on('pageerror', error => errors.push({ kind: 'pageerror', message: error.message }))
page.on('console', message => { if (message.type() === 'error') errors.push({ kind: 'console', message: message.text() }) })
try {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__d4Ready === true)
  const first = await page.evaluate(() => ({
    resources: performance.getEntriesByType('resource').map(entry => entry.name).filter(name => /aheart-ui|style\.css/.test(name)),
    treeRows: document.querySelectorAll('[role="treeitem"]').length,
    options: document.querySelectorAll('.aheart-cascader__option').length,
    iframeOwner: document.defaultView === window,
  }))
  const iframe = await page.evaluate(async () => {
    const frame = document.createElement('iframe')
    frame.src = location.href
    frame.setAttribute('title', 'same-origin D4 probe')
    document.body.append(frame)
    await new Promise(resolve => frame.addEventListener('load', resolve, { once: true }))
    const owner = frame.contentDocument?.defaultView
    const before = frame.contentDocument?.querySelectorAll('[role="treeitem"]').length ?? 0
    frame.remove()
    return { sameOrigin: Boolean(owner), ownerDocument: owner === frame.contentWindow, rowsBeforeUnmount: before, removed: !frame.isConnected }
  })
  assert.equal(errors.length, 0, errors.map(error => error.message).join('; '))
  const result = { status: 'passed', browser: browserName, browserVersion: browser.version(), errors, first, iframe, resources: first.resources }
  if (output) await writeFile(output, `${JSON.stringify(result, null, 2)}\n`)
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}
