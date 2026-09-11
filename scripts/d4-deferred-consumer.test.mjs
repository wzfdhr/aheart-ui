import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
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

const releaseDescriptorFixture = () => {
  const report = fullReport()
  report.syntheticEvidence = false
  report.sourceKind = 'collected'
  report.runId = 'bounded-test-fixture'
  report.collectorSourcePath = '/artifacts/collector.mjs'
  report.collectorSourceSha256 = 'a'.repeat(64)
  report.artifactDirectory = '/artifacts'
  report.realEvidenceBinding = {
    tarballReopened: true,
    buildManifestPath: '/artifacts/dist-files.json',
    buildFingerprint: { before: 'b'.repeat(64), after: 'b'.repeat(64) },
    moduleFingerprint: { before: 'd'.repeat(64), after: 'd'.repeat(64) },
    lockFingerprint: { before: '8'.repeat(64), after: '8'.repeat(64) },
  }
  for (const side of ['baseline', 'candidate']) {
    report.packages[side].path = `/artifacts/${side}.tgz`
    report.packages[side].manifestPath = `/artifacts/${side}-manifest.json`
    report.packages[side].modulePath = `/artifacts/${side}-module.js`
    report.packages[side].lockPath = `/artifacts/${side}-pnpm-lock.yaml`
    report.packages[side].manifestSha256 = 'f'.repeat(64)
    report.packages[side].lockfileSha256 = '1'.repeat(64)
    report.packages[side].afterHashes = { 'es/index.js': '2'.repeat(64) }
  }
  return report
}

const deferredCollectorSource = () => readFile(path.join(process.cwd(), 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'), 'utf8')
const sha256 = value => createHash('sha256').update(value).digest('hex')

const readableFinalizationFixture = async root => {
  const report = releaseDescriptorFixture()
  const artifactDirectory = path.join(root, 'artifacts')
  await mkdir(artifactDirectory, { recursive: true })
  const artifact = async (name, content) => {
    const file = path.join(artifactDirectory, name)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, content)
    return { file, hash: sha256(content) }
  }
  const collector = await artifact('collector.mjs', 'collector source')
  const baselineTarball = await artifact('baseline.tgz', 'baseline tarball')
  const candidateTarball = await artifact('candidate.tgz', 'candidate tarball')
  const baselineManifest = await artifact('baseline-manifest.json', '{}')
  const candidateManifest = await artifact('candidate-manifest.json', '{}')
  const module = await artifact('module-index.js', 'module source')
  const lock = await artifact('pnpm-lock.yaml', 'lock source')
  const dist = await artifact('dist/index.js', 'dist source')
  const buildManifest = await artifact('dist-files.json', JSON.stringify({ files: [{ path: dist.file, relativePath: 'index.js', bytes: Buffer.byteLength('dist source'), sha256: dist.hash }] }))
  const buildFingerprint = sha256(`index.js=${dist.hash}`)
  report.artifactDirectory = artifactDirectory
  report.collectorSourcePath = collector.file
  report.collectorSourceSha256 = collector.hash
  report.runDir = path.join(root, 'run')
  await mkdir(report.runDir, { recursive: true })
  report.realEvidenceBinding.buildManifestPath = buildManifest.file
  report.realEvidenceBinding.buildDirectory = path.join(artifactDirectory, 'dist')
  report.realEvidenceBinding.buildFingerprint = { before: buildFingerprint, after: buildFingerprint }
  report.realEvidenceBinding.moduleFingerprint = { before: module.hash, after: module.hash }
  report.realEvidenceBinding.lockFingerprint = { before: lock.hash, after: lock.hash }
  report.packages.baseline.path = baselineTarball.file
  report.packages.baseline.sha256 = baselineTarball.hash
  report.packages.baseline.manifestPath = baselineManifest.file
  report.packages.baseline.manifestSha256 = baselineManifest.hash
  report.packages.baseline.modulePath = module.file
  report.packages.baseline.afterHashes = { 'es/index.js': module.hash }
  report.packages.baseline.lockPath = lock.file
  report.packages.baseline.lockfileSha256 = lock.hash
  report.packages.baseline.lockfileAfterSha256 = lock.hash
  report.packages.candidate.path = candidateTarball.file
  report.packages.candidate.sha256 = candidateTarball.hash
  report.packages.candidate.manifestPath = candidateManifest.file
  report.packages.candidate.manifestSha256 = candidateManifest.hash
  report.packages.candidate.modulePath = module.file
  report.packages.candidate.afterHashes = { 'es/index.js': module.hash }
  report.packages.candidate.lockPath = lock.file
  report.packages.candidate.lockfileSha256 = lock.hash
  report.packages.candidate.lockfileAfterSha256 = lock.hash
  report.provenance.baselineTarballSha256 = baselineTarball.hash
  report.provenance.candidateTarballSha256 = candidateTarball.hash
  report.releaseFormat = { validatorStatus: 'validating', collectorSourcePath: collector.file }
  return report
}

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

test('release validation rejects arbitrary collected source/run/fingerprint strings', () => {
  const report = fullReport()
  report.syntheticEvidence = false
  report.sourceKind = 'collected'
  report.runId = 'arbitrary-run-id'
  report.collectorSourceSha256 = 'arbitrary-collector-source'
  report.realEvidenceBinding = {
    tarballReopened: true,
    buildFingerprint: { before: 'arbitrary-build-before', after: 'arbitrary-build-after' },
    moduleFingerprint: { before: 'arbitrary-module-before', after: 'arbitrary-module-after' },
  }
  for (const side of ['baseline', 'candidate']) {
    report.packages[side].path = `/arbitrary/${side}.tgz`
    report.packages[side].manifestPath = `/arbitrary/${side}-manifest.json`
    report.packages[side].modulePath = `/arbitrary/${side}-index.js`
    report.packages[side].lockPath = `/arbitrary/${side}-pnpm-lock.yaml`
    report.packages[side].manifestSha256 = 'arbitrary-manifest-hash'
    report.packages[side].afterHashes = { 'es/index.js': 'arbitrary-module-hash' }
  }
  assert.throws(() => validateReport(report, { requireRelease: true }), /source|run|fingerprint|artifact|provenance|tarball|path|exist/i)
})

test('full release descriptor contract rejects pending validator status', () => {
  const pending = releaseDescriptorFixture()
  pending.releaseFormat = { validatorStatus: 'pending' }
  assert.throws(() => validateReport(pending, { requireRelease: true }), /pending|validator status/i)
})

test('full release descriptor contract rejects missing collectorSourcePath', () => {
  const missingCollectorSource = releaseDescriptorFixture()
  missingCollectorSource.releaseFormat = { validatorStatus: 'passed' }
  assert.throws(() => validateReport(missingCollectorSource, { requireRelease: true }), /collectorSourcePath|collector source path/i)
})

test('full release descriptor contract requires a durable artifactDirectory', () => {
  const missingArtifactDirectory = releaseDescriptorFixture()
  missingArtifactDirectory.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingArtifactDirectory.collectorSourcePath }
  delete missingArtifactDirectory.artifactDirectory
  assert.throws(() => validateReport(missingArtifactDirectory, { requireRelease: true }), /artifactDirectory|durable artifact/i)
})

test('full release descriptor contract requires a real build fingerprint', () => {
  const missingBuild = releaseDescriptorFixture()
  missingBuild.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingBuild.collectorSourcePath }
  delete missingBuild.realEvidenceBinding.buildFingerprint
  assert.throws(() => validateReport(missingBuild, { requireRelease: true }), /release report must carry collected source\/run\/artifact bindings|build fingerprint/i)
})

test('full release descriptor contract requires a real module fingerprint', () => {
  const missingModule = releaseDescriptorFixture()
  missingModule.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingModule.collectorSourcePath }
  delete missingModule.realEvidenceBinding.moduleFingerprint
  assert.throws(() => validateReport(missingModule, { requireRelease: true }), /release report must carry collected source\/run\/artifact bindings|module fingerprint/i)
})

test('full release descriptor contract requires a real lock descriptor and fingerprint', () => {
  const missingLock = releaseDescriptorFixture()
  missingLock.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingLock.collectorSourcePath }
  delete missingLock.realEvidenceBinding.lockFingerprint
  delete missingLock.packages.candidate.lockPath
  assert.throws(() => validateReport(missingLock, { requireRelease: true }), /candidate release artifact descriptors are incomplete|lock fingerprint/i)
})

test('full release descriptor contract rejects missing build manifest and lockfileAfter', () => {
  const missingBuildManifest = releaseDescriptorFixture()
  missingBuildManifest.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingBuildManifest.collectorSourcePath }
  delete missingBuildManifest.realEvidenceBinding.buildManifestPath
  assert.throws(() => validateReport(missingBuildManifest, { requireRelease: true }), /release report must carry collected source\/run\/artifact bindings|build manifest|build fingerprint/i)

  const missingLockAfter = releaseDescriptorFixture()
  missingLockAfter.releaseFormat = { validatorStatus: 'passed', collectorSourcePath: missingLockAfter.collectorSourcePath }
  delete missingLockAfter.packages.candidate.lockfileAfterSha256
  assert.throws(() => validateReport(missingLockAfter, { requireRelease: true }), /lock fingerprint|lockfileAfter/i)
})

test('full finalization accepts collected/validating input but only saved passed reports satisfy release validation', async () => {
  const report = releaseDescriptorFixture()
  report.releaseFormat = { validatorStatus: 'validating', collectorSourcePath: report.collectorSourcePath }
  assert.doesNotThrow(() => validateReport(report), 'collector validation may receive an explicit validating state')
  report.releaseFormat.validatorStatus = 'passed'
  assert.doesNotThrow(() => validateReport(report, { requireRelease: true }), 'successful validation must finalize to passed before release validation')
  const source = await deferredCollectorSource()
  assert.match(source, /export async function finalizeCollectedReport\(report, output\)/, 'collector must expose a reusable finalization helper')
  assert.match(source, /finalizeCollectedReport\(report, output\)/, 'full collection must use the finalization helper')
})

test('full finalization helper saves passed and reopens a minimal readable report without benchmark work', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'd4-finalize-unit-'))
  try {
    const report = await readableFinalizationFixture(root)
    const output = path.join(root, 'saved-report.json')
    const source = await deferredCollectorSource()
    const start = source.indexOf('export async function finalizeCollectedReport')
    const end = source.indexOf('// Full collection intentionally runs only when explicitly invoked', start)
    assert.ok(start >= 0 && end > start, 'full finalization helper source must be present')
    const helper = new Function('mkdir', 'path', 'writeFile', 'verifyArtifactBindings', 'validateReport', 'readFile', 'rename', `${source.slice(start, end).replace('export async function', 'async function')}; return finalizeCollectedReport`)(mkdir, path, writeFile, (await import('./d4-deferred-consumer-contract.mjs')).verifyArtifactBindings, (await import('./d4-deferred-consumer-contract.mjs')).validateReport, readFile, rename)
    await helper(report, output)
    const saved = JSON.parse(await readFile(output, 'utf8'))
    assert.equal(saved.releaseFormat.validatorStatus, 'passed')
    const contract = await import('./d4-deferred-consumer-contract.mjs')
    await contract.verifyArtifactBindings(saved, { reportPath: output })
    assert.doesNotThrow(() => contract.validateReport(saved, { requireRelease: true }))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('collector resolves its workspace root to the repository and avoids docs/docs default output', async () => {
  const source = await deferredCollectorSource()
  assert.match(source, /new URL\('\.\.\/\.\.\/\.\.\/\.\.\/', import\.meta\.url\)/, 'collector workspace root must resolve to the repository')
  assert.doesNotMatch(source, /path\.join\(workspace,\s*['"]docs\/docs\//, 'collector default output must not contain docs/docs')
})

test('full and preflight collection share artifact preparation/report-shell helpers', async () => {
  const source = await deferredCollectorSource()
  assert.match(source, /export async function prepareFullArtifactBindings\(/, 'collector must expose the shared artifact preparation helper')
  assert.match(source, /export function buildFullReportShell\(/, 'collector must expose the shared full report shell helper')
  assert.ok((source.match(/prepareFullArtifactBindings\(/g) ?? []).length >= 3, 'full and preflight paths must reuse artifact preparation')
  assert.ok((source.match(/buildFullReportShell\(/g) ?? []).length >= 3, 'full and preflight paths must reuse the report shell')
})

test('full collector failure persistence keeps partial raw evidence and appends failure metadata', async () => {
  const source = await deferredCollectorSource()
  const fullBranch = source.slice(source.indexOf('\n} else {'))
  const failureBranch = fullBranch.slice(fullBranch.lastIndexOf('\n} catch (error) {'))
  assert.match(failureBranch, /readFile\(output/, 'full failure handling must reopen the partial raw report')
  assert.match(failureBranch, /validationFailures|failureEvidence/, 'full failure handling must append structured failure metadata')
  assert.match(failureBranch, /cases|performance|partial/i, 'full failure artifact must preserve partial raw evidence instead of replacing it with a summary')
})

test('collectSide browser launch/page failures must close Firefox and WebKit in per-browser finally blocks', async () => {
  const source = await deferredCollectorSource()
  const browserLoop = source.slice(source.indexOf("for (const [name, Browser] of Object.entries({ firefox, webkit }))"))
  assert.match(browserLoop, /try\s*\{[\s\S]*Browser\.launch\(\)[\s\S]*finally\s*\{[\s\S]*await other\.close\(\)/, 'each Firefox/WebKit probe must close its browser even when launch/page/navigation fails')
})

test('preflight candidate-build failure injection preserves raw checkpoints and cleanup counters', async () => {
  const source = await deferredCollectorSource()
  assert.match(source, /D4_DEFERRED_FAIL_AFTER_CANDIDATE_BUILD/, 'candidate-build failure injection must be testable without benchmark execution')
  assert.match(source, /partial\.failureEvidence[\s\S]*candidate/i, 'partial failure must retain candidate build/module/lock evidence')
  assert.match(source, /cleanupCounters|browser.*close|server.*close/i, 'preflight failure must report cleanup counters')
})

test('release validation accepts the pair-forward-reverse order and rejects any other order', () => {
  const expected = ['full', 'virtual', 'virtual', 'full', 'full', 'virtual', 'virtual', 'full', 'full', 'virtual']
  const report = fullReport()
  for (const item of Object.values(report.cases)) item.alternatingOrder = [...expected]
  assert.doesNotThrow(() => validateReport(report), 'the real pair-forward-reverse order must be accepted')

  const invalid = fullReport()
  invalid.cases['Tree/10000/fixed'].alternatingOrder = ['full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual']
  assert.throws(() => validateReport(invalid), /alternat|order/i)
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
