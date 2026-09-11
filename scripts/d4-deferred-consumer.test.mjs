import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  RELEASE_MATRIX,
  buildAcceptanceFixture,
  recomputeEvidence,
  validateBoundedReleaseReport,
  validateReport,
} from './d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const fullReport = () => buildAcceptanceFixture({
  baselinePackage: '/tmp/d4-baseline.tgz',
  candidatePackage: '/tmp/d4-candidate.tgz',
  generatedAt: '2026-09-11T00:00:00.000Z',
})

test('the contract exposes the frozen release matrix', () => {
  assert.deepEqual(RELEASE_MATRIX, {
    counts: [1000, 5000, 10000],
    rowModes: ['fixed', 'coarse', 'dynamic'],
    measuredRuns: 5,
    warmupRuns: 1,
    scrollSteps: 40,
    maxVirtualRows: 24,
    maxFirstInteractionMs: 500,
    maxVirtualRatio: 0.5,
    maxLongTaskMs: 100,
    maxCls: 0.1,
    maxGzipDeltaBytes: 12 * 1024,
  })
})

test('a complete deterministic fixture is accepted only after evidence is recomputed', () => {
  const report = fullReport()
  const evidence = recomputeEvidence(report)
  assert.equal(evidence.firstInteraction.virtual.Tree[10000].fixed.medianMs, report.performance.firstInteraction.virtual.Tree[10000].fixed.medianMs)
  assert.equal(evidence.gzip.baseline.gzipBytes, report.gzip.baseline.gzipBytes)
  assert.equal(evidence.gzip.candidate.gzipBytes, report.gzip.candidate.gzipBytes)
  assert.equal(evidence.gzip.deltaBytes, report.gzip.deltaBytes)
  assert.equal(validateReport(report).status, 'passed')
})

test('fabricated medians and gzip totals are rejected', () => {
  const report = fullReport()
  report.performance.firstInteraction.virtual.Tree[10000].fixed.medianMs += 1
  assert.throws(() => validateReport(report), /recomputed|first interaction/i)

  const second = fullReport()
  second.gzip.deltaBytes += 1
  assert.throws(() => validateReport(second), /recomputed|gzip/i)
})

test('the release matrix cannot be made complete by dropping one count or row mode', () => {
  const report = fullReport()
  delete report.cases['Cascader/10000/dynamic']
  assert.throws(() => validateReport(report), /matrix|Cascader|10000|dynamic/i)
})

test('unsupported Firefox and WebKit observer metrics are explicit, never fake zero', () => {
  const report = fullReport()
  for (const browser of ['firefox', 'webkit']) {
    report.browsers[browser].longTasks = 0
    assert.throws(() => validateReport(report), /unsupported|long.?task/i)
  }
})

test('smoke reports are explicitly ineligible for release', () => {
  const report = buildAcceptanceFixture({
    baselinePackage: '/tmp/d4-baseline.tgz',
    candidatePackage: '/tmp/d4-candidate.tgz',
    generatedAt: '2026-09-11T00:00:00.000Z',
    smoke: true,
  })
  assert.equal(report.acceptanceEligible, false)
  assert.throws(() => validateReport(report, { requireRelease: true }), /smoke|eligible/i)
})

test('require-release rejects nonexistent or synthetic tarball provenance', () => {
  const report = fullReport()
  assert.throws(() => validateReport(report, { requireRelease: true }), /tarball|exist|provenance/i)
})

test('baseline commit and package hash must match the approved baseline provenance', () => {
  const report = fullReport()
  report.provenance = { baselineCommit: 'wrong-baseline', baselineCommitExpected: '4a7511f9594d0a74906e427e158d02343ba33a22', candidateCommit: 'candidate', baselineTarballSha256: '0'.repeat(64), candidateTarballSha256: report.packages.candidate.sha256 }
  assert.throws(() => validateReport(report, { requireRelease: true }), /baseline|provenance|hash/i)
})

test('scroll evidence rejects repeated offsets, missing endpoint and non-positive timings', () => {
  const report = fullReport()
  const sample = report.cases['Tree/10000/fixed'].virtual
  sample.scroll = sample.scroll.slice(0, 39)
  sample.measured[0].firstInteractionMs = -1
  for (const step of sample.scroll) step.offset = 0
  assert.throws(() => validateReport(report), /scroll|offset|timing|positive/i)
})

test('environment evidence rejects empty CPU/browser and impossible concurrency', () => {
  const report = fullReport()
  report.environment.cpu = ''
  report.environment.concurrency = 500
  report.browsers.chromium.browserVersion = ''
  assert.throws(() => validateReport(report), /CPU|cpu|concurrency|browser/i)
})

test('row budget is recomputed from every virtual scroll sample, not a trusted summary', () => {
  const report = fullReport()
  report.cases['Tree/10000/fixed'].virtual.scroll[0].mountedRows = 10000
  report.cases['Tree/10000/fixed'].virtual.maxRows = 24
  report.cases['Tree/10000/fixed'].virtual.actionableRows = 24
  assert.throws(() => validateReport(report), /row|window|24/i)
})

test('SSR combinations must be eight distinct false/true assignments', () => {
  const report = fullReport()
  const first = Object.values(report.ssrHydration.combinations)[0]
  for (const item of Object.values(report.ssrHydration.combinations)) item.virtual = { ...first.virtual }
  assert.throws(() => validateReport(report), /SSR|hydration|combination|distinct/i)
})

test('raw observer entries, timestamps and package resources are required', () => {
  const report = fullReport()
  delete report.browsers.chromium.longTasks.entries
  delete report.browsers.chromium.layoutShifts.entries
  delete report.browsers.chromium.resources
  assert.throws(() => validateReport(report), /observer|timestamp|resource|raw/i)
})

test('gzip provenance includes all components, CSS, nested chunks and unique assets', () => {
  const report = fullReport()
  report.gzip.candidate.files = report.gzip.candidate.files.filter(file => file.path === 'tree.js')
  assert.throws(() => validateReport(report), /gzip|CSS|asset|component|chunk/i)

  const second = fullReport()
  second.gzip.candidate.files[1].path = 'chunks/tree-select.js'
  second.gzip.candidate.files.push({ ...second.gzip.candidate.files[0] })
  assert.throws(() => validateReport(second), /gzip|asset|duplicate|chunk/i)
})

test('smoke failures cannot be reported as installed/verified success', () => {
  const report = buildAcceptanceFixture({ smoke: true })
  report.smokeChecks = { candidatePublicSurface: false, candidateNoSymlink: false, baselineAvailable: false }
  report.packages.sameConsumer = true
  report.packages.installedWithoutWorkspaceLinks = true
  assert.throws(() => validateReport(report, { requireSmokeChecks: true }), /smoke|verified|failed|baseline/i)
})

test('smoke requires an explicit approved baseline and rejects the old fallback path', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'd4-deferred-red-'))
  try {
    const result = await run(process.execPath, [path.join(process.cwd(), 'scripts/d4-deferred-consumer.mjs'), '--smoke', '--out', path.join(directory, 'smoke.json')], { cwd: process.cwd() }).then(() => ({ code: 0 }), error => ({ code: error.code ?? 1, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }))
    assert.notEqual(result.code, 0, `smoke unexpectedly accepted fallback baseline: ${result.output}`)
    assert.match(result.output, /baseline|explicit|approved/i)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('bounded validator is a distinct ineligible release-format gate', () => {
  const report = fullReport()
  report.smoke = true
  report.acceptanceEligible = false
  assert.throws(() => validateBoundedReleaseReport(report), /artifact|raw|bounded|authentic/i)
})

test('release validation rejects synthetic fixture even when syntheticEvidence is toggled false', () => {
  const report = fullReport()
  report.syntheticEvidence = false
  assert.throws(() => validateReport(report, { requireRelease: true }), /artifact|sourceKind|runId|tarball|clean|provenance/i)
})

test('raw mutation cases reject row geometry, event records, SSR IDs and artifact binding', () => {
  const report = fullReport()
  report.cases['Tree/10000/fixed'].virtual.scroll[0].rowKeys = []
  assert.throws(() => validateBoundedReleaseReport({ ...report, smoke: true, acceptanceEligible: false }), /row|geometry|raw|bounded/i)

  const events = fullReport()
  events.cases['Tree/10000/fixed'].alternatingOrder.reverse()
  assert.throws(() => validateBoundedReleaseReport({ ...events, smoke: true, acceptanceEligible: false }), /alternat|order|raw/i)

  const ssr = fullReport()
  ssr.ssrHydration.combinations[Object.keys(ssr.ssrHydration.combinations)[0]].deterministic = false
  assert.throws(() => validateBoundedReleaseReport({ ...ssr, smoke: true, acceptanceEligible: false }), /SSR|hydration|determin/i)

  const artifact = fullReport()
  artifact.provenance.baselineTarballSha256 = 'f'.repeat(64)
  assert.throws(() => validateBoundedReleaseReport({ ...artifact, smoke: true, acceptanceEligible: false }), /artifact|hash|provenance/i)
})
