#!/usr/bin/env node
// D5-C performance harness entry point. It records measurements only when a
// real built consumer URL is supplied; it never reports a synthetic pass.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const arg = name => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const url = arg('--url')
const out = arg('--out')
if (!url || !out) {
  console.error('usage: node scripts/d5-table-c-perf.mjs --url <built-consumer-url> --out <evidence-dir>')
  process.exit(2)
}

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const longTasks = []
  await page.addInitScript(() => {
    window.__d5cLongTasks = []
    new PerformanceObserver(list => window.__d5cLongTasks.push(...list.getEntries().map(entry => entry.duration)))
      .observe({ type: 'longtask', buffered: true })
  })
  const started = performance.now()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('[data-table-scroll]').evaluate(element => { element.scrollTop = element.scrollHeight / 2 })
  await page.waitForTimeout(100)
  const result = await page.evaluate(() => ({
    elapsedMs: performance.now(),
    logicalRows: document.querySelectorAll('tbody tr[data-table-row]').length,
    fullDomRows: document.querySelectorAll('tbody tr').length,
    longTasks: window.__d5cLongTasks ?? [],
    cls: window.__d5cCls ?? null,
    resourceEntries: performance.getEntriesByType('resource').map(entry => ({ name: entry.name, transferSize: entry.transferSize }))
  }))
  const record = { status: 'measured', url, startedAt: new Date().toISOString(), navigationMs: result.elapsedMs - started, ...result, thresholds: { virtualMs: 500, fullDomMedianRatio: 0.5, longTaskMs: 100, cls: 0.1 } }
  await mkdir(out, { recursive: true })
  await writeFile(`${out}/perf.json`, `${JSON.stringify(record, null, 2)}\n`)
  console.log(JSON.stringify(record, null, 2))
} finally {
  await browser.close()
}
