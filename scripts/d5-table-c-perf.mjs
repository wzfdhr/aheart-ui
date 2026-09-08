#!/usr/bin/env node
// Paired D5-C browser gate. Each mode uses the same page clock; navigation
// uses DOMContentLoaded plus an explicit fixture-ready marker, never networkidle.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const fullUrl = arg('--full-url'), virtualUrl = arg('--virtual-url'), out = arg('--out')
const rounds = Number(arg('--rounds') ?? 3)
const baseline = Number(arg('--baseline-table-gzip'))
const candidate = Number(arg('--candidate-table-gzip'))
if (!fullUrl || !virtualUrl || !out || !Number.isInteger(rounds) || rounds < 2 || !Number.isFinite(baseline) || !Number.isFinite(candidate)) {
  console.error('usage: node scripts/d5-table-c-perf.mjs --full-url <url> --virtual-url <url> --baseline-table-gzip <bytes> --candidate-table-gzip <bytes> --out <json> [--rounds 3]')
  process.exit(2)
}
const browser = await chromium.launch(), results = []
try {
  for (const [mode, url] of [['full-dom', fullUrl], ['virtual', virtualUrl]]) for (let round = 0; round < rounds; round++) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.addInitScript(() => {
      window.__d5c = { longTasks: [], cls: 0 }
      new PerformanceObserver(list => window.__d5c.longTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask', buffered: true })
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__d5c.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    })
    const start = await page.evaluate(() => performance.now())
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.__fixtureReady === true || document.querySelector('[data-fixture-ready="true"]'))
    const ready = await page.evaluate(() => performance.now())
    const metrics = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('tbody tr[data-table-row]')]
      const table = document.querySelector('table'), aria = Number(table?.getAttribute('aria-rowcount'))
      if (!rows.length || !Number.isFinite(aria) || !window.__d5c) return null
      return { ttiMs: performance.now(), logicalRows: rows.length, fullDomRows: document.querySelectorAll('tbody tr').length, ariaRowCount: aria, virtual: Boolean(document.querySelector('[data-table-virtual-spacer]')), longTaskMax: Math.max(0, ...window.__d5c.longTasks), cls: window.__d5c.cls }
    })
    await page.close()
    if (!metrics) throw new Error(`${mode} round ${round + 1}: missing required metrics`)
    results.push({ mode, round: round + 1, navigationMs: ready - start, ...metrics, ttiAfterNavigationMs: metrics.ttiMs - ready })
  }
} finally { await browser.close() }
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const summary = Object.fromEntries(['full-dom', 'virtual'].map(mode => {
  const rows = results.filter(r => r.mode === mode)
  return [mode, { medianTtiMs: median(rows.map(r => r.ttiAfterNavigationMs)), medianLogicalRows: median(rows.map(r => r.logicalRows)), maxLongTaskMs: Math.max(...rows.map(r => r.longTaskMax)), maxCls: Math.max(...rows.map(r => r.cls)), medianFullDomRows: median(rows.map(r => r.fullDomRows)) }]
}))
const checks = { virtualTti: summary.virtual.medianTtiMs <= 500, virtualHalfRows: summary.virtual.medianLogicalRows <= 20 && summary.virtual.medianLogicalRows <= summary['full-dom'].medianLogicalRows * 0.5, longTasks: summary.virtual.maxLongTaskMs <= 100, cls: summary.virtual.maxCls <= 0.1, tableGzipDelta: candidate - baseline <= 12 * 1024 }
const record = { status: Object.values(checks).every(Boolean) ? 'passed' : 'failed', measuredAt: new Date().toISOString(), rounds, results, summary, thresholds: { virtualTtiMs: 500, logicalRows: 20, virtualRatio: 0.5, longTaskMs: 100, cls: 0.1, tableGzipDeltaBytes: 12 * 1024 }, checks, baselineTableGzipBytes: baseline, candidateTableGzipBytes: candidate }
await mkdir(path.dirname(out), { recursive: true }); await writeFile(out, JSON.stringify(record, null, 2) + '\n')
console.log(JSON.stringify(record, null, 2)); if (record.status !== 'passed') process.exitCode = 1
