#!/usr/bin/env node
// Paired D5-C gate. TTI is fixture-owned mountStart -> interactive in the
// same navigation document; networkidle is deliberately not part of TTI.
import { chromium } from '@playwright/test'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const fullUrl = arg('--full-url'), virtualUrl = arg('--virtual-url'), out = arg('--out')
const baselineFile = arg('--baseline-table-file'), candidateFile = arg('--candidate-table-file')
const rounds = Number(arg('--rounds') ?? 3)
if (!fullUrl || !virtualUrl || !out || !baselineFile || !candidateFile || !Number.isInteger(rounds) || rounds < 3) {
  console.error('usage: node scripts/d5-table-c-perf.mjs --full-url <10k-url> --virtual-url <10k-url> --baseline-table-file <D5-A-Table-only-file> --candidate-table-file <D5-C-Table-only-file> --out <json> [--rounds 3]')
  process.exit(2)
}
const bytesFor = async file => { const raw = await readFile(file); return { file: path.resolve(file), sha256: createHash('sha256').update(raw).digest('hex'), rawBytes: raw.length, gzipBytes: gzipSync(raw).length } }
const [baseline, candidate] = await Promise.all([bytesFor(baselineFile), bytesFor(candidateFile)])
const browser = await chromium.launch(), results = []
try {
  for (const [mode, url] of [['full-dom', fullUrl], ['virtual', virtualUrl]]) for (let round = 0; round < rounds; round++) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.addInitScript(() => {
      window.__d5c = { longTasks: [], cls: 0 }
      new PerformanceObserver(list => window.__d5c.longTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask', buffered: true })
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__d5c.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.__fixtureReady === true && performance.getEntriesByName('d5c:mountStart', 'mark').length > 0 && performance.getEntriesByName('d5c:interactive', 'mark').length > 0)
    const metrics = await page.evaluate(() => {
      const mount = performance.getEntriesByName('d5c:mountStart', 'mark').at(-1), interactive = performance.getEntriesByName('d5c:interactive', 'mark').at(-1)
      const rows = document.querySelectorAll('tbody tr[data-table-row]'), table = document.querySelector('table'), ariaRaw = table?.getAttribute('aria-rowcount')
      if (!mount || !interactive || !rows.length || !table || ariaRaw === null || !window.__d5c) return null
      const interactiveMs = interactive.startTime - mount.startTime, ariaRowCount = Number(ariaRaw)
      if (!Number.isFinite(interactive.startTime) || !Number.isFinite(mount.startTime) || interactiveMs < 0 || !Number.isFinite(ariaRowCount)) return null
      return { interactiveMs, logicalRows: rows.length, fullDomRows: document.querySelectorAll('tbody tr').length, ariaRowCount, spacerCount: document.querySelectorAll('[data-table-virtual-spacer]').length, longTaskMax: Math.max(0, ...window.__d5c.longTasks), cls: window.__d5c.cls }
    })
    await page.close()
    if (!metrics) throw new Error(`${mode} round ${round + 1}: missing/invalid fixture marks or required metrics`)
    if (metrics.ariaRowCount !== 10000) throw new Error(`${mode} round ${round + 1}: ariaRowCount must equal 10000`)
    if (mode === 'full-dom' && (metrics.logicalRows !== 10000 || metrics.spacerCount !== 0)) throw new Error(`${mode} round ${round + 1}: expected 10000 rows and no spacer`)
    if (mode === 'virtual' && (metrics.logicalRows > 20 || metrics.spacerCount !== 2)) throw new Error(`${mode} round ${round + 1}: expected <=20 rows and exactly two main spacers`)
    results.push({ mode, round: round + 1, ...metrics })
  }
} finally { await browser.close() }
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const summary = Object.fromEntries(['full-dom', 'virtual'].map(mode => { const rows = results.filter(r => r.mode === mode); return [mode, { medianInteractiveMs: median(rows.map(r => r.interactiveMs)), medianLogicalRows: median(rows.map(r => r.logicalRows)), medianFullDomRows: median(rows.map(r => r.fullDomRows)), maxLongTaskMs: Math.max(...rows.map(r => r.longTaskMax)), maxCls: Math.max(...rows.map(r => r.cls)), spacerCounts: rows.map(r => r.spacerCount) }] }))
const checks = { virtualInteractive: summary.virtual.medianInteractiveMs <= 500 && summary.virtual.medianInteractiveMs <= summary['full-dom'].medianInteractiveMs * 0.5, fullDom10k: summary['full-dom'].medianLogicalRows === 10000 && summary['full-dom'].spacerCounts.every(count => count === 0), virtualWindow: summary.virtual.medianLogicalRows > 0 && summary.virtual.medianLogicalRows <= 20 && summary.virtual.spacerCounts.every(count => count > 0), longTasks: summary.virtual.maxLongTaskMs <= 100, cls: summary.virtual.maxCls <= 0.1, tableGzipDelta: candidate.gzipBytes - baseline.gzipBytes <= 12 * 1024 }
const record = { status: Object.values(checks).every(Boolean) ? 'passed' : 'failed', measuredAt: new Date().toISOString(), rounds, results, summary, thresholds: { virtualInteractiveMs: 500, virtualInteractiveRatio: 0.5, logicalRows: 20, longTaskMs: 100, cls: 0.1, tableGzipDeltaBytes: 12 * 1024 }, checks, gzip: { baseline, candidate, deltaBytes: candidate.gzipBytes - baseline.gzipBytes } }
await mkdir(path.dirname(out), { recursive: true }); await writeFile(out, JSON.stringify(record, null, 2) + '\n')
console.log(JSON.stringify(record, null, 2)); if (record.status !== 'passed') process.exitCode = 1
