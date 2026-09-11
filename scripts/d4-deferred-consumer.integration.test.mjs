import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { validateBoundedReleaseReport, verifyArtifactBindings } from './d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const workspace = process.cwd()
const baseline = '/private/tmp/aheart-d4-baseline-evidence-F5VN6u/repacked/aheart-ui-1.0.0.tgz'
const approvedBaseline = '4a7511f9594d0a74906e427e158d02343ba33a22'
const approvedBaselineHash = 'b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

let realCollection
const collectRealBoundedReport = () => realCollection ??= (async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'd4-deferred-integration-red-'))
  const candidate = await packCurrent(root)
  const candidateCommit = (await run('git', ['rev-parse', 'HEAD'], { cwd: workspace })).stdout.trim()
  const baselineBytes = await readFile(baseline)
  assert.equal(hash(baselineBytes), approvedBaselineHash)
  const candidateBytes = await readFile(candidate)
  const baselineManifest = path.join(root, 'baseline-manifest.json')
  const candidateManifest = path.join(root, 'candidate-manifest.json')
  await writeFile(baselineManifest, JSON.stringify({ clean: true, commit: approvedBaseline, tarballSha256: hash(baselineBytes) }))
  await writeFile(candidateManifest, JSON.stringify({ clean: true, commit: candidateCommit, tarballSha256: hash(candidateBytes) }))
  const out = path.join(root, 'collector.json')
  const log = path.join(root, 'collector.log')
  const result = await run(process.execPath, [
    path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'),
    '--smoke',
    '--baseline-tarball', baseline,
    '--candidate-tarball', candidate,
    '--baseline-commit', approvedBaseline,
    '--candidate-commit', candidateCommit,
    '--baseline-manifest', baselineManifest,
    '--candidate-manifest', candidateManifest,
    '--base-url', 'http://127.0.0.1:0',
    '--out', out,
  ], { cwd: workspace, maxBuffer: 8 * 1024 * 1024 }).then(value => ({ code: 0, output: `${value.stdout}\n${value.stderr}` }), error => ({ code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` }))
  await writeFile(log, result.output)
  assert.equal(result.code, 0, `collector child must exit successfully; preserved log ${log}\n${result.output}`)
  const report = JSON.parse(await readFile(out, 'utf8'))
  await verifyArtifactBindings(report, { reportPath: out })
  assert.doesNotThrow(() => validateBoundedReleaseReport(report), 'authentic bounded collector output must pass control validation before assertions')
  return { root, candidate, candidateCommit, result, report, log }
})()

async function packCurrent(directory) {
  const result = await run('corepack', ['pnpm', '--dir', path.join(workspace, 'packages/components'), 'pack', '--json', '--pack-destination', directory], { cwd: workspace, maxBuffer: 4 * 1024 * 1024 })
  return JSON.parse(result.stdout).filename
}

test('packed production smoke has an absolute preview baseURL and authentic collector output', async () => {
  const { result, report, log } = await collectRealBoundedReport()
  assert.equal(result.code, 0, `collector integration failed; preserved log ${log}\n${result.output}`)
  assert.equal(report.acceptanceEligible, false, 'one-case smoke must remain release-ineligible')
  assert.equal(report.smoke, true)
  assert.equal(report.preview.baseURL, 'http://127.0.0.1:0')
  assert.equal(report.preview.productionBuild, true)
  assert.equal(report.preview.absoluteNavigation, true)
  assert.equal(report.authenticEvidence, true)
  assert.equal(report.fixtures.treeSelect.searchMatchesAtLeast, 5000)
  assert.equal(report.fixtures.cascader.deepColumns, 5)
  assert.equal(report.fixtures.cascader.flattenedSearchLeaves, 10000)
  assert.equal(report.case.component, 'TreeSelect')
  assert.equal(report.case.count, 5000)
  assert.equal(report.case.scroll.length, 40)
  assert.equal(report.case.scroll[0].offset, 0)
  assert.equal(report.case.scroll[19].offset, 1)
  assert.equal(report.case.scroll[20].offset, 1)
  assert.equal(report.case.scroll[39].offset, 0)
  assert.ok(report.case.scroll.every(step => step.rect && step.rect.height > 0 && step.rowKeys.length > 0 && step.timestamp >= 0))
  assert.ok(report.case.scroll.some(step => step.actualOffset > 0), 'actual scroll offsets must move through the production viewport')
  assert.equal(report.ssrHydration.count, 8)
  assert.equal(Object.keys(report.ssrHydration.combinations).length, 8)
  assert.ok(Object.values(report.ssrHydration.combinations).every(item => item.deterministic === true))
  assert.equal(report.iframe.sameOrigin, true)
  assert.equal(report.iframe.ownerDocument, true)
  assert.equal(report.iframe.focusTransfer, true)
  assert.equal(report.iframe.unmountCleanup, true)
  assert.equal(report.iframe.postUnmountInteractions, 0)
  assert.ok(report.iframe.resourceCounts.before > 0 && report.iframe.resourceCounts.after === 0)
  assert.ok(report.packages.candidate.moduleRealpaths.length > 0)
  assert.equal(report.packages.candidate.tarballSha256Verified, true)
  assert.ok(report.case.timing.firstInteractionMs > 0 && report.case.timing.searchMs >= 0)
  assert.ok(report.case.timing.popup?.startedAt <= report.case.timing.triggerAt && report.case.timing.triggerAt <= report.case.timing.clickStartedAt && report.case.timing.clickStartedAt - report.case.timing.popup.startedAt <= 5 && report.case.timing.clickCompletedAt < report.case.timing.actionableAt && report.case.timing.actionableAt <= report.case.timing.nextTickAt && report.case.timing.nextTickAt <= report.case.timing.rafAt[0] && report.case.timing.rafAt[0] <= report.case.timing.rafAt[1] && report.case.timing.rafAt[1] <= report.case.timing.probeAt && report.case.timing.probeAt <= report.case.timing.endAt)
  assert.equal(report.case.timing.targetSelectorIncludesTrigger, false)
  assert.ok(report.case.timing.targetRect && report.case.timing.targetRect.intersectsViewport && report.case.timing.targetRect.enabled && report.case.timing.targetRect.pointerEvents !== 'none')
  assert.equal(report.case.timing.searchSeparated, true)
  assert.equal(report.case.timing.triggerExcludedFromRows, true)
  assert.equal(report.case.timing.vueNextTick, true)
  assert.equal(report.case.timing.ownerRealmFrames, 2)
  assert.equal(report.case.state.actionableRowVisible, true)
  assert.equal(report.case.state.actionableRowEnabled, true)
  assert.ok(Object.values(report.familyCoverage).every(item => item.realData && item.scenarios.length > 0 && item.scenarios.every(scenario => scenario.executed === true && scenario.eventCount > 0 && scenario.eventRecords.every(event => event.timestamp >= scenario.startedAt && event.timestamp <= scenario.finishedAt) && scenario.beforeStateHash !== scenario.afterStateHash && scenario.actualRows > 0)))
  assert.ok(report.familyCoverage.Tree.scenarios.some(scenario => scenario.childrenBefore < scenario.childrenAfter && scenario.eventRecords.some(event => event.name === 'expand')))
  assert.ok(report.familyCoverage.TreeSelect.scenarios.some(scenario => scenario.logicalSearchMatches >= 5000 && scenario.controlledRejected === true && scenario.eventRecords.some(event => event.name === 'controlled-reject')))
  assert.ok(report.familyCoverage.Cascader.scenarios.some(scenario => scenario.depth === 5 && scenario.optionsPerLevel === 2000 && scenario.flattenedSearchLeaves === 10000 && scenario.lazy.pending && scenario.lazy.resolved && scenario.lazy.retry && scenario.lazy.cancelled && scenario.lazy.staleIgnored && scenario.eventRecords.some(event => event.name === 'keyboard')))
  assert.ok(report.case.scroll.every(step => step.rowRects.length > 0 && step.viewportRect.height > 0 && step.coverageComplete && step.rowRects.every(row => row.height > 0 && row.intersectsViewport !== false && row.pointerEvents !== 'none' && row.nextTickAt <= row.rafAt[0] && row.rafAt[0] <= row.rafAt[1])))
  assert.equal(report.case.geometry.viewportCoverageComplete, true)
  assert.equal(report.case.geometry.excludeOffscreenPins, true)
  assert.equal(report.case.observers.startedBeforeFirstWrite, true)
  assert.equal(report.case.observers.drainedAfterLastWrite, true)
  assert.equal(report.case.observers.disconnected, true)
  assert.ok(report.case.observers.longTasks.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)))
  assert.ok(report.case.observers.layoutShifts.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)))
  assert.ok(report.case.observers.rawRounds.length >= 1 && report.case.observers.rawRounds.every(round => round.startedAt < round.firstWriteAt && round.lastWriteAt < round.drainedAt && round.takeRecordsAt >= round.lastWriteAt && round.disconnectedAt >= round.takeRecordsAt && round.entries.every(entry => entry.startTime >= round.startedAt && entry.startTime <= round.drainedAt)))
  assert.equal(report.case.observers.rawRecomputed, true)
  assert.ok(Object.values(report.ssrHydration.combinations).every(item => item.initialHtmlSha256 && item.hydratedHtmlSha256 && item.initialIdSha256 === item.hydratedIdSha256 && item.cjsRender === true && item.popupVirtualRows && (Object.values(item.virtual).every(value => value === false) || item.boundedRows <= 24) && item.postHydrationInteraction === true && item.postHydrationStateChanged === true && item.businessEventsAfterHydration > 0))
  assert.equal(report.iframe.observersAfterUnmount, 0)
  assert.equal(report.iframe.rafAfterUnmount, 0)
  assert.equal(report.iframe.timersAfterUnmount, 0)
  assert.equal(report.iframe.componentResizeObserversAfterUnmount, 0)
  assert.equal(report.iframe.componentRafAfterUnmount, 0)
  assert.equal(report.iframe.componentTimersAfterUnmount, 0)
  assert.equal(report.iframe.constructorProxy.resizeObserversAfterUnmount, 0)
  assert.equal(report.iframe.constructorProxy.rafAfterUnmount, 0)
  assert.equal(report.iframe.constructorProxy.timersAfterUnmount, 0)
  assert.equal(report.iframe.teleportOwnerDocument, true)
  assert.equal(report.iframe.teleportResidualNodes, 0)
  assert.equal(report.iframe.escapeFocusRestored, true)
  assert.equal(report.iframe.lateLazyStateUpdates, 0)
  assert.ok(report.iframe.resourceCounts.before > 0 && report.iframe.resourceCounts.after === 0)
  assert.equal(report.realEvidenceBinding.tarballReopened, true)
  assert.ok(report.realEvidenceBinding.buildFingerprint.before && report.realEvidenceBinding.buildFingerprint.after)
  assert.ok(report.realEvidenceBinding.moduleFingerprint.before && report.realEvidenceBinding.moduleFingerprint.after)
  assert.equal(report.realEvidenceBinding.cleanPackVerified, true)
  assert.equal(report.realEvidenceBinding.pnpmIntegrityVerified, true)
  assert.equal(report.realEvidenceBinding.baselineCommit, '4a7511f9594d0a74906e427e158d02343ba33a22')
  assert.equal(report.realEvidenceBinding.baselineTarballVerified, true)
  assert.equal(report.realEvidenceBinding.cleanStatusVerified, true)
  assert.equal(report.releaseFormat.rawEvidenceRecomputed, true)
  assert.equal(report.releaseFormat.validatorStatus, 'passed-ineligible')
  assert.equal(report.releaseFormat.validatorName, 'validateBoundedReleaseReport')
  assert.equal(report.alternatingOrderConvention, 'pair-forward-reverse')
  assert.equal(report.failureEvidence.persistedBeforeCleanup, true)
  assert.equal(report.outputDirectoryDurable, true)
})

test('real bounded family events use one normalized clock domain and stay inside each scenario', async () => {
  const { report } = await collectRealBoundedReport()
  for (const [component, family] of Object.entries(report.familyCoverage ?? {})) {
    assert.ok(family.clockDomain === 'epoch-ms' || (family.clockDomain?.kind === 'timeOrigin+navId' && Number.isFinite(family.clockDomain.timeOrigin) && family.clockDomain.navId), `${component} must declare epoch-ms or timeOrigin+navId clock normalization`)
    for (const scenario of family.scenarios ?? []) {
      assert.ok(Number.isFinite(scenario.startedAt) && Number.isFinite(scenario.finishedAt) && scenario.startedAt <= scenario.finishedAt)
      assert.ok((scenario.eventRecords ?? []).every(event => Number.isFinite(event.timestamp) && event.timestamp >= scenario.startedAt && event.timestamp <= scenario.finishedAt && event.clockDomain === family.clockDomain), `${component}/${scenario.label} event timestamps must use the normalized family clock domain`)
    }
  }
})

const assertDurableArtifactDescriptors = async report => {
  assert.ok(report.artifactDirectory, 'collector must publish a durable artifactDirectory')
  assert.ok(report.runDir, 'collector must retain the cleaned runDir marker')
  const artifactDirectory = path.resolve(report.artifactDirectory)
  const runDir = path.resolve(report.runDir)
  assert.notEqual(artifactDirectory, runDir, 'durable artifact directory must not be the cleaned runDir')
  const relativeToRunDir = path.relative(runDir, artifactDirectory)
  assert.ok(relativeToRunDir.startsWith('..'), 'durable artifact directory must be outside the cleaned runDir')
  const packageDescriptors = [
    report.packages.baseline.path,
    report.packages.baseline.manifestPath,
    report.packages.candidate.path,
    report.packages.candidate.manifestPath,
    report.packages.candidate.modulePath,
    report.packages.candidate.lockPath,
  ]
  for (const descriptor of packageDescriptors) {
    const absolute = path.resolve(descriptor)
    const relativeToArtifacts = path.relative(artifactDirectory, absolute)
    assert.ok(relativeToArtifacts && !relativeToArtifacts.startsWith('..') && !path.isAbsolute(relativeToArtifacts), `artifact descriptor must be inside durable output artifacts: ${descriptor}`)
    assert.ok(path.relative(runDir, absolute).startsWith('..'), `artifact descriptor must not remain under cleaned runDir: ${descriptor}`)
    assert.ok((await stat(absolute)).isFile(), `artifact descriptor must exist after collector exit: ${descriptor}`)
  }
  assert.ok((await stat(path.resolve(report.collectorSourcePath))).isFile(), 'collectorSourcePath must remain reopenable')
}

const assertBoundedControlPasses = async report => {
  await verifyArtifactBindings(report)
  assert.doesNotThrow(() => validateBoundedReleaseReport(report), 'unmodified real bounded report must pass before mutation')
  await assertDurableArtifactDescriptors(report)
}

const assertBoundedMutationRejected = async (report, mutate, message, pattern) => {
  await assertBoundedControlPasses(report)
  const forged = structuredClone(report)
  mutate(forged)
  await assert.rejects(async () => {
    await verifyArtifactBindings(forged)
    validateBoundedReleaseReport(forged)
  }, pattern, message)
}

test('real bounded geometry cannot retain coverage flags after rowRects move offscreen', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedMutationRejected(report, forged => {
    for (const step of forged.case.scroll) {
      for (const row of step.rowRects) {
        row.top = -99999
        row.bottom = -99971
        row.left = -99999
        row.right = -99971
      }
    }
  }, 'bounded validator must recompute viewport coverage from raw rowRects', /bounded raw geometry cannot be recomputed from rowRects\/viewport/)
})

test('real bounded artifact paths must exist for both baseline and candidate tarballs', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedMutationRejected(report, forged => {
    forged.packages.baseline.path = path.join(forged.runDir ?? tmpdir(), 'missing-baseline.tgz')
    forged.packages.candidate.path = path.join(forged.runDir ?? tmpdir(), 'missing-candidate.tgz')
    forged.packages.baseline.exists = true
    forged.packages.candidate.exists = true
  }, 'bounded validator must reject nonexistent baseline/candidate tarball paths', /(?:baseline|candidate) tarball artifact path does not exist/)
})

test('real bounded collector provenance rejects a forged collector source hash', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedMutationRejected(report, forged => { forged.collectorSourceSha256 = 'fake-collector-source' }, 'bounded validator must bind collectorSourceSha256 to the collector source', /collector source reopened hash mismatch/)
})

test('real bounded artifact, manifest, build, module and lock hashes are independently bound', async () => {
  const { report } = await collectRealBoundedReport()
  const mutations = [
    ['artifact tarball', forged => { forged.packages.candidate.sha256 = '0'.repeat(64) }],
    ['manifest', forged => { forged.packages.candidate.manifestSha256 = '0'.repeat(64) }],
    ['build fingerprint', forged => { forged.realEvidenceBinding.buildFingerprint.before = '0'.repeat(64) }],
    ['module fingerprint', forged => { forged.realEvidenceBinding.moduleFingerprint.before = '0'.repeat(64) }],
    ['lockfile', forged => { forged.packages.candidate.lockfileSha256 = '0'.repeat(64) }],
  ]
  for (const [label, mutate] of mutations) {
    await assertBoundedMutationRejected(report, mutate, `bounded validator must reject forged ${label} hash`, new RegExp(label === 'artifact tarball' ? 'candidate tarball reopened hash mismatch' : label === 'manifest' ? 'candidate manifest reopened hash mismatch' : label === 'build fingerprint' ? 'build fingerprint' : label === 'module fingerprint' ? 'module fingerprint' : 'candidate lock reopened hash mismatch'))
  }
})

test('real bounded actionability and observer summaries are recomputed from raw geometry/style/entries', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedMutationRejected(report, forged => {
    forged.case.timing.targetRect.top = -99999
    forged.case.timing.targetRect.bottom = -99971
    forged.case.timing.targetRect.left = -99999
    forged.case.timing.targetRect.right = -99971
    forged.case.timing.targetRect.intersectsViewport = true
    forged.case.timing.targetRect.enabled = true
    forged.case.timing.targetRect.pointerEvents = 'auto'
  }, 'bounded validator must recompute target actionability from raw target rect and style', /bounded first interaction raw timing\/target evidence is invalid/)

  await assertBoundedMutationRejected(report, forged => {
    const round = forged.case.observers.rawRounds[0]
    const longTask = { startTime: round.startedAt + 1, duration: 999 }
    const layoutShift = { startTime: round.drainedAt - 1, value: 0.9 }
    round.entries = [
      longTask,
      layoutShift,
    ]
    forged.case.observers.longTasks = [longTask]
    forged.case.observers.layoutShifts = [layoutShift]
  }, 'bounded validator must recompute observer max/CLS and time bounds from raw entries', /bounded observer raw rounds are not drained\/recomputed/)
})

test('real bounded build fingerprint must be reopened from the durable dist artifact', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const forged = structuredClone(report)
  forged.realEvidenceBinding.buildFingerprint = { before: '0'.repeat(64), after: '0'.repeat(64) }
  await assert.rejects(() => verifyArtifactBindings(forged), /build fingerprint before\/after mismatch/)
})

test('real bounded build fingerprint cannot hide a missing manifest behind matching zero hashes', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const forged = structuredClone(report)
  delete forged.realEvidenceBinding.buildManifestPath
  forged.realEvidenceBinding.buildFingerprint = { before: '0'.repeat(64), after: '0'.repeat(64) }
  await assert.rejects(() => verifyArtifactBindings(forged), /build manifest|build fingerprint before\/after mismatch/)
})

const assertBuildManifestMutationRejected = async (report, mutate, pattern, label) => {
  await assertBoundedControlPasses(report)
  const directory = await mkdtemp(path.join(tmpdir(), 'd4-build-manifest-red-'))
  try {
    const manifest = JSON.parse(await readFile(report.realEvidenceBinding.buildManifestPath, 'utf8'))
    await mutate(manifest, directory)
    const manifestPath = path.join(directory, 'dist-files.json')
    await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`)
    const forged = structuredClone(report)
    forged.realEvidenceBinding.buildManifestPath = manifestPath
    await assert.rejects(() => verifyArtifactBindings(forged), pattern, label)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('real bounded build manifest rejects empty, missing, extra and hash-wrong recursive dist evidence', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBuildManifestMutationRejected(report, manifest => { manifest.files = [] }, /build fingerprint before\/after mismatch/, 'empty build manifest must be rejected')
  await assertBuildManifestMutationRejected(report, manifest => { manifest.files = manifest.files.slice(1) }, /build fingerprint before\/after mismatch/, 'missing dist file must be rejected')
  await assertBuildManifestMutationRejected(report, async (manifest, directory) => {
    const unknownPath = path.join(directory, 'unknown-extra.js')
    await writeFile(unknownPath, 'unknown extra')
    manifest.files.push({ path: unknownPath, relativePath: 'unknown-extra.js', sha256: hash(Buffer.from('unknown extra')) })
  }, /build fingerprint before\/after mismatch/, 'unknown extra dist file must be rejected')
  await assertBuildManifestMutationRejected(report, manifest => { manifest.files[0].sha256 = '0'.repeat(64) }, /build file hash\/bytes mismatch:/, 'wrong dist file hash must be rejected')
})

test('real bounded module fingerprint must be reopened from the durable module artifact', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const forged = structuredClone(report)
  forged.realEvidenceBinding.moduleFingerprint = { before: '0'.repeat(64), after: '0'.repeat(64) }
  await assert.rejects(() => verifyArtifactBindings(forged), /module fingerprint before\/after mismatch/)
})

test('real bounded lock fingerprint must be reopened from the durable lock artifact', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  assert.ok(report.realEvidenceBinding.lockFingerprint?.before && report.realEvidenceBinding.lockFingerprint?.after, 'bounded report must expose lockFingerprint before/after')
  const forged = structuredClone(report)
  forged.realEvidenceBinding.lockFingerprint = { before: '0'.repeat(64), after: '0'.repeat(64) }
  await assert.rejects(() => verifyArtifactBindings(forged), /lock fingerprint before\/after mismatch/)
})

let preflightCollection
const collectPreflightReport = () => preflightCollection ??= (async () => {
  const collectorPath = path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs')
  const collectorSource = await readFile(collectorPath, 'utf8')
  assert.match(collectorSource, /preflight-full/, 'collector must expose the preflight-full API before this integration can run')
  const root = await mkdtemp(path.join(tmpdir(), 'd4-preflight-full-red-'))
  const candidate = await packCurrent(root)
  const candidateCommit = (await run('git', ['rev-parse', 'HEAD'], { cwd: workspace })).stdout.trim()
  const baselineBytes = await readFile(baseline)
  const candidateBytes = await readFile(candidate)
  const baselineManifest = path.join(root, 'baseline-manifest.json')
  const candidateManifest = path.join(root, 'candidate-manifest.json')
  await writeFile(baselineManifest, JSON.stringify({ clean: true, commit: approvedBaseline, tarballSha256: hash(baselineBytes) }))
  await writeFile(candidateManifest, JSON.stringify({ clean: true, commit: candidateCommit, tarballSha256: hash(candidateBytes) }))
  const output = path.join(root, 'preflight.json')
  const result = await run(process.execPath, [collectorPath, '--preflight-full', '--baseline-tarball', baseline, '--candidate-tarball', candidate, '--baseline-commit', approvedBaseline, '--candidate-commit', candidateCommit, '--baseline-manifest', baselineManifest, '--candidate-manifest', candidateManifest, '--out', output], { cwd: workspace, maxBuffer: 8 * 1024 * 1024 })
  assert.equal(result.code ?? 0, 0)
  const report = JSON.parse(await readFile(output, 'utf8'))
  return { collectorPath, root, output, report }
})()

test('real preflight-full runs both artifact sides without benchmark and saves a strict durable report', async () => {
  const { output, report } = await collectPreflightReport()
  assert.equal(report.preflight, true)
  assert.equal(report.smoke, false)
  assert.equal(report.acceptanceEligible, false)
  assert.equal(report.benchmarkExecuted, false)
  assert.equal(typeof report.environment?.cpu, 'string')
  assert.ok(report.environment.cpu.trim().length > 0)
  assert.ok(Number.isInteger(report.environment.concurrency) && report.environment.concurrency >= 1 && report.environment.concurrency <= 32)
  assert.notEqual(report.releaseFormat?.validatorStatus, 'pending')
  assert.ok(report.collectorSourcePath && report.artifactDirectory && report.realEvidenceBinding?.buildManifestPath && report.realEvidenceBinding?.buildDirectory)
  assert.ok(report.packages.baseline.path && report.packages.candidate.path && report.packages.baseline.manifestPath && report.packages.candidate.manifestPath && report.packages.candidate.modulePath && report.packages.candidate.lockPath)
  assert.ok(report.packages.baseline.lockfileAfterSha256 && report.packages.candidate.lockfileAfterSha256)
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  await contract.verifyArtifactBindings(report, { reportPath: output })
  assert.equal(typeof contract.validateFullPreflightReport, 'function')
  assert.doesNotThrow(() => contract.validateFullPreflightReport(report))
})

test('preflight validator rejects any benchmark execution marker or non-empty benchmark evidence', async () => {
  const { report } = await collectPreflightReport()
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  await contract.validateFullPreflightReport(report)
  for (const mutate of [
    forged => { forged.benchmarkExecuted = true },
    forged => { forged.performance = { status: 'executed', cases: {}, firstInteraction: { full: {}, virtual: {} } } },
    forged => { forged.cases = { injected: { raw: true } } },
    forged => { forged.browsers = { chromium: { status: 'executed' } } },
  ]) {
    const forged = structuredClone(report)
    mutate(forged)
    await assert.rejects(() => contract.validateFullPreflightReport(forged), /benchmarkExecuted|notRun|cases|browsers|benchmark/i)
  }
})

test('shared full report shell binds tarball provenance and gzip module paths to both package sides', async () => {
  const { report } = await collectPreflightReport()
  assert.equal(report.provenance.baselineTarballSha256, report.packages.baseline.sha256)
  assert.equal(report.provenance.candidateTarballSha256, report.packages.candidate.sha256)
  assert.equal(report.gzip.consumer.moduleProvenance.baseline.path, report.packages.baseline.modulePath)
  assert.equal(report.gzip.consumer.moduleProvenance.candidate.path, report.packages.candidate.modulePath)
  assert.equal(report.gzip.consumer.moduleProvenance.baseline.sha256, report.packages.baseline.afterHashes['es/index.js'])
  assert.equal(report.gzip.consumer.moduleProvenance.candidate.sha256, report.packages.candidate.afterHashes['es/index.js'])
  assert.match(report.gzip.consumer.moduleProvenance.baseline.path, /baseline-module-index\.js/)
  assert.match(report.gzip.consumer.moduleProvenance.candidate.path, /module-index\.js/)
})

test('preflight browser launch/page/setup failure hooks expose real close counters', async () => {
  const { report } = await collectPreflightReport()
  assert.ok(report.cleanupCounters?.baseline && report.cleanupCounters?.candidate)
  for (const side of ['baseline', 'candidate']) {
    assert.ok(report.cleanupCounters[side].chromiumClose > 0)
    assert.ok(report.cleanupCounters[side].previewServerClose > 0)
  }
  const source = await readFile(path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'), 'utf8')
  for (const flag of ['D4_DEFERRED_FAIL_BROWSER_LAUNCH', 'D4_DEFERRED_FAIL_BROWSER_PAGE', 'D4_DEFERRED_FAIL_BROWSER_SETUP']) assert.match(source, new RegExp(`${flag}.*chromium`))
})

test('preflight candidate-build failure preserves durable partial raw/checkpoint evidence after temporary cleanup', async () => {
  const collectorPath = path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs')
  const collectorSource = await readFile(collectorPath, 'utf8')
  assert.match(collectorSource, /D4_DEFERRED_FAIL_AFTER_CANDIDATE_BUILD/, 'preflight must expose the candidate-build failure injection')
  const root = await mkdtemp(path.join(tmpdir(), 'd4-preflight-failure-red-'))
  const candidate = await packCurrent(root)
  const candidateCommit = (await run('git', ['rev-parse', 'HEAD'], { cwd: workspace })).stdout.trim()
  const baselineBytes = await readFile(baseline)
  const candidateBytes = await readFile(candidate)
  const baselineManifest = path.join(root, 'baseline-manifest.json')
  const candidateManifest = path.join(root, 'candidate-manifest.json')
  await writeFile(baselineManifest, JSON.stringify({ clean: true, commit: approvedBaseline, tarballSha256: hash(baselineBytes) }))
  await writeFile(candidateManifest, JSON.stringify({ clean: true, commit: candidateCommit, tarballSha256: hash(candidateBytes) }))
  const output = path.join(root, 'preflight-failure.json')
  const result = await run(process.execPath, [collectorPath, '--preflight-full', '--baseline-tarball', baseline, '--candidate-tarball', candidate, '--baseline-commit', approvedBaseline, '--candidate-commit', candidateCommit, '--baseline-manifest', baselineManifest, '--candidate-manifest', candidateManifest, '--out', output], { cwd: workspace, env: { ...process.env, D4_DEFERRED_FAIL_AFTER_CANDIDATE_BUILD: '1' }, maxBuffer: 8 * 1024 * 1024 }).then(() => ({ code: 0 }), error => ({ code: error.code ?? 1 }))
  assert.notEqual(result.code, 0, 'candidate-build failure injection must exit non-zero')
  const partial = JSON.parse(await readFile(output, 'utf8'))
  assert.equal(partial.preflight, true)
  assert.equal(partial.failureEvidence?.candidate, true)
  assert.ok(partial.checkpoints?.some(checkpoint => checkpoint.rawPayloadHash && checkpoint.rawPayload))
  assert.ok(partial.cleanupCounters?.chromiumClose > 0 && partial.cleanupCounters?.previewServerClose > 0)
  assert.equal(partial.cleanupCounters?.temporaryRemovedAfterPersistence, true)
  const artifactDirectory = `${output}.artifacts`
  for (const name of ['baseline.tgz', 'candidate.tgz', 'baseline-manifest.json', 'candidate-manifest.json', 'module-index.js', 'pnpm-lock.yaml', 'dist-files.json', 'partial-report.json']) assert.ok((await stat(path.join(artifactDirectory, name))).isFile(), `durable failure artifact missing: ${name}`)
  assert.ok((await stat(`${output}.run/partial-report.json`)).isFile())
  assert.notEqual(partial.temporaryDirectory, true)
})

test('preflight browser launch/page/setup failure injections report actual close counters', async () => {
  const collectorPath = path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs')
  const source = await readFile(collectorPath, 'utf8')
  for (const flag of ['D4_DEFERRED_FAIL_BROWSER_LAUNCH', 'D4_DEFERRED_FAIL_BROWSER_PAGE', 'D4_DEFERRED_FAIL_BROWSER_SETUP']) assert.match(source, new RegExp(flag))
  assert.match(source, /cleanupCounters\.[A-Za-z]+\s*\+\+|cleanupCounters\.[A-Za-z]+\s*=/)
})

test('preflight browser-page injection executes the failing CLI and persists closed browser/server counters', async () => {
  const { collectorPath, root } = await collectPreflightReport()
  const output = path.join(root, 'preflight-browser-page-failure.json')
  const candidateCommit = (await run('git', ['rev-parse', 'HEAD'], { cwd: workspace })).stdout.trim()
  const result = await run(process.execPath, [collectorPath, '--preflight-full', '--baseline-tarball', baseline, '--candidate-tarball', path.join(root, 'aheart-ui.tgz'), '--baseline-commit', approvedBaseline, '--candidate-commit', candidateCommit, '--baseline-manifest', path.join(root, 'baseline-manifest.json'), '--candidate-manifest', path.join(root, 'candidate-manifest.json'), '--out', output], { cwd: workspace, env: { ...process.env, D4_DEFERRED_FAIL_BROWSER_PAGE: 'chromium' }, maxBuffer: 8 * 1024 * 1024 }).then(() => ({ code: 0 }), error => ({ code: error.code ?? 1 }))
  assert.notEqual(result.code, 0, 'browser-page injection must exit non-zero')
  const partial = JSON.parse(await readFile(output, 'utf8'))
  assert.ok(partial.cleanupCounters?.chromiumClose >= 1 && partial.cleanupCounters?.previewServerClose >= 1)
  assert.equal(partial.cleanupCounters?.temporaryRemovedAfterPersistence, true)
})

test('real bounded Tree family coverage preserves raw flat and expanded logical datasets', async () => {
  const { report } = await collectRealBoundedReport()
  const scenarios = report.familyCoverage?.Tree?.scenarios ?? []
  const flat = scenarios.find(scenario => scenario.label === 'flat-roots-10000')
  const expanded = scenarios.find(scenario => scenario.label === 'expanded-100x99')
  assert.ok(flat, 'Tree must record the flat-roots-10000 raw scenario')
  assert.equal(new Set(flat.logicalKeys).size, 10000)
  assert.equal(flat.sourceHash, hash(Buffer.from(flat.logicalKeys.join('\n'))))
  assert.ok(flat.scroll.some(step => step.rowKeys?.includes(flat.logicalKeys.at(-1))))
  assert.ok(flat.mountedRows <= 24)
  assert.ok(expanded, 'Tree must record the expanded-100x99 raw scenario')
  assert.equal(expanded.rawRoots?.length, 100)
  assert.ok(expanded.rawRoots?.every(root => root.children?.length === 99))
  assert.equal(expanded.roots, 100)
  assert.equal(expanded.childrenPerRoot, 99)
  assert.equal(expanded.expandedKeysInput?.length, 100)
  const adjacencyVisible = expanded.rawRoots.flatMap(root => expanded.expandedKeysInput.includes(root.key) ? [root.key, ...root.children.map(child => child.key)] : [root.key])
  assert.deepEqual(expanded.logicalVisibleKeys, adjacencyVisible)
  assert.equal(new Set(adjacencyVisible).size, 10000)
  assert.ok(expanded.mountedRows <= 24)
  assert.ok(expanded.mountedRows > 0)
  assert.equal('clamped' in expanded, false)
  assert.deepEqual(expanded.expandedKeysInput, expanded.eventRecords.find(event => event.name === 'expand')?.afterExpandedKeys)
  assert.ok(expanded.eventRecords.some(event => event.name === 'expand' && event.beforeExpandedKeys?.length === 99 && event.afterExpandedKeys?.length === 100))
  const source = await readFile(path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'), 'utf8')
  assert.doesNotMatch(source, /Math\.min\([^\n]*logicalVisibleKeys|Math\.min\([^\n]*logicalKeys/)
})

test('real bounded TreeSelect family coverage recomputes the 5000-match query and controlled rejection', async () => {
  const { report } = await collectRealBoundedReport()
  const scenario = report.familyCoverage?.TreeSelect?.scenarios?.find(item => item.label === 'search-5000-controlled')
  assert.ok(scenario, 'TreeSelect must record the raw 5000-match controlled-search scenario')
  assert.ok(Array.isArray(scenario.sourceKeys) && Array.isArray(scenario.sourceLabels) && scenario.sourceKeys.length > 5000)
  assert.equal(scenario.searchInputValue, 'match')
  assert.equal(scenario.searchInputElement?.value, scenario.searchInputValue, 'search query must be read from the mounted input.value')
  assert.equal(scenario.searchInputEvidence?.source, 'dom-input.value')
  const expected = scenario.sourceLabels.map((label, index) => label.includes(scenario.searchInputValue) ? scenario.sourceKeys[index] : null).filter(Boolean)
  assert.deepEqual(scenario.matchedKeys, expected)
  assert.equal(scenario.matchedKeys.length, 5000)
  assert.ok(scenario.eventRecords.some(event => event.name === 'update:modelValue' && event.intent === 'check'))
  assert.ok(scenario.controlledRejected === true)
  assert.deepEqual(scenario.valueBefore, scenario.valueAfter)
  assert.notDeepEqual(scenario.valueBefore, [])
  assert.deepEqual(scenario.acceptedValueBefore, scenario.acceptedValueAfter, 'controlled rejection must preserve the accepted DOM/state snapshot')
  assert.notDeepEqual(scenario.requestedValue, scenario.acceptedValueBefore?.value, 'controlled rejection must record a distinct requested value')
  assert.ok(scenario.acceptedValueBefore?.domTrigger && scenario.acceptedValueBefore?.stateRaw, 'accepted value snapshots must include raw DOM trigger and component state')
  assert.ok(scenario.eventRecords.some(event => event.name === 'update:modelValue' && event.valueSnapshot?.requestedValue && event.valueSnapshot.requestedValue === scenario.requestedValue))
})

test('real bounded Cascader family coverage preserves deep columns, search paths, lazy state and controlled rejection', async () => {
  const { report } = await collectRealBoundedReport()
  const scenario = report.familyCoverage?.Cascader?.scenarios?.find(item => item.label === 'deep5-search-lazy-controlled')
  assert.ok(scenario, 'Cascader must record the combined deep/search/lazy controlled scenario')
  assert.deepEqual(scenario.columnSizes, [2000, 2000, 2000, 2000, 2000])
  assert.ok(scenario.columns.every(column => new Set(column.rawLogicalOptionKeys).size === 2000 && column.mountedRows > 0 && column.mountedRows <= 24 && column.mountedRawRows >= 1 && column.mountedRawRows <= 24 && column.actualComponentOptionsHash === hash(Buffer.from(column.rawLogicalOptionKeys.join('\n'))) && column.rawColumnOptionsHash === column.actualComponentOptionsHash))
  assert.ok(scenario.selectedPath.every((key, columnIndex) => scenario.columns[columnIndex]?.rawLogicalOptionKeys.includes(key)), 'selected path must belong to the raw options of each corresponding column')
  assert.equal(scenario.selectedPath?.join('/'), scenario.selectionEvent?.value?.join('/'))
  assert.ok(scenario.search.inputValue && scenario.search.rawLeaves.length > 10000)
  const expectedPaths = scenario.search.rawLeaves.filter(leaf => leaf.labels.join(' / ').includes(scenario.search.inputValue)).map(leaf => leaf.path)
  assert.equal(expectedPaths.length, 10000)
  assert.deepEqual(scenario.search.matchedPaths, expectedPaths)
  assert.ok(scenario.search.visibleFirst && scenario.search.visibleTail)
  assert.ok(scenario.search.matchedPaths.some(pathValue => pathValue.length === scenario.search.visibleTail.path.length && pathValue.every((segment, index) => segment === scenario.search.visibleTail.path[index])))
  assert.deepEqual(scenario.search.visibleTail.path, scenario.search.matchedPaths.at(-1))
  assert.equal(scenario.search.pathHash, hash(Buffer.from(expectedPaths.map(pathValue => pathValue.join('/')).join('\n'))))
  assert.deepEqual(scenario.lazy.events.map(event => event.name), ['pending', 'error', 'pending', 'retry', 'resolve', 'pending', 'cancel', 'late-resolve-stale-ignored'])
  assert.ok(scenario.lazy.events.every(event => event.componentActionId && Number.isFinite(event.timestamp)))
  assert.ok(scenario.lazy.events.some(event => event.action === 'option' || event.action === 'retry' || event.action === 'escape' || event.action === 'revision'))
  assert.notDeepEqual(scenario.lazy.stateBefore, scenario.lazy.stateAfter)
  assert.deepEqual(scenario.lazy.stateBeforeLate, scenario.lazy.stateAfterLate, 'late stale lazy resolution must leave DOM/value/columns/child hashes unchanged')
  assert.ok(scenario.lazy.stateBeforeLate?.dom && scenario.lazy.stateBeforeLate?.value && scenario.lazy.stateBeforeLate?.columns && scenario.lazy.stateBeforeLate?.childHashes)
  const late = scenario.lazy.events.find(event => event.name === 'late-resolve-stale-ignored')
  assert.deepEqual(late?.stateBeforeLate, late?.stateAfterLate)
  assert.equal(scenario.lazy.staleIgnored, true)
  assert.equal(scenario.controlledRejected, true)
  const source = await readFile(path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'), 'utf8')
  assert.doesNotMatch(source, /window\.__d4LoadData/)
  assert.doesNotMatch(source, /__d4RunLazyScenario/)
})

test('real bounded measured rows retain computed fixed/coarse/dynamic heights and raw actionability probes', async () => {
  const { report } = await collectRealBoundedReport()
  for (const component of ['Tree', 'TreeSelect', 'Cascader']) {
    const rowModes = report.familyCoverage?.[component]?.rowModeEvidence
    assert.ok(rowModes, `${component} must expose rowModeEvidence`)
    for (const rowMode of ['fixed', 'coarse', 'dynamic']) {
      const metrics = rowModes[rowMode]
      assert.equal(metrics?.length, 4)
      assert.equal(new Set(metrics.map(metric => metric.index)).size, 4)
      assert.deepEqual(metrics.map(metric => metric.index).sort((a, b) => a - b), [0, 1, 10, 20])
      assert.equal(new Set(metrics.map(metric => metric.key)).size, 4)
      assert.ok(metrics.every(metric => Number(metric.key.split(/[-:]/).at(-1)) === metric.index && metric.rect && metric.computedStyle && Math.abs(metric.height - (metric.rect.bottom - metric.rect.top)) <= 0.5 && Math.abs(metric.height - Number.parseFloat(metric.computedStyle.height)) <= 0.5))
      if (rowMode === 'fixed') assert.ok(metrics.every(metric => metric.height === metric.expectedHeight))
      if (rowMode === 'coarse') assert.ok(metrics.every(metric => metric.height >= 44))
      if (rowMode === 'dynamic') assert.ok([0, 10, 20].every(index => metrics.find(metric => metric.index === index).height > metrics.find(metric => metric.index === 1).height && metrics.find(metric => metric.index === index).wrapped === true && (metrics.find(metric => metric.index === index).scrollWidth > metrics.find(metric => metric.index === index).clientWidth || metrics.find(metric => metric.index === index).lineHeight > 0)))
    }
  }
  for (const timing of [report.case?.timing]) {
    assert.equal(timing.targetKind, 'row')
    assert.equal(timing.targetSelectorIncludesTrigger, false)
    assert.equal(timing.fallbackTarget, false)
    assert.ok(timing.targetRect && timing.targetViewportRect && timing.hitTarget && timing.focusProbe)
    assert.ok(timing.targetRect.left < timing.targetViewportRect.right && timing.targetRect.right > timing.targetViewportRect.left && timing.targetRect.top < timing.targetViewportRect.bottom && timing.targetRect.bottom > timing.targetViewportRect.top)
    assert.equal(timing.hitTarget.kind, 'row')
    assert.equal(timing.focusProbe.activeElementInRow, true)
    assert.ok(timing.popup?.startedAt <= timing.triggerAt && timing.triggerAt <= timing.clickStartedAt && timing.clickStartedAt - timing.popup.startedAt <= 5 && timing.clickStartedAt <= timing.clickCompletedAt && timing.clickCompletedAt < timing.actionableAt && timing.actionableAt <= timing.nextTickAt && timing.nextTickAt <= timing.rafAt[0] && timing.rafAt[0] <= timing.rafAt[1] && timing.rafAt[1] <= timing.probeAt && timing.probeAt <= timing.endAt)
    assert.equal(timing.firstInteractionMs, timing.endAt - timing.popup.startedAt)
  }
})

test('bounded actionability validator rejects raw hit-target or focus-probe forgery', async () => {
  const { report } = await collectRealBoundedReport()
  assert.ok(report.case.timing.hitTarget && report.case.timing.focusProbe, 'bounded report must preserve raw hit-target and focus probes')
  for (const mutate of [
    forged => { forged.case.timing.popup.startedAt = forged.case.timing.triggerAt + 6 },
    forged => { forged.case.timing.hitTarget.kind = 'trigger' },
    forged => { forged.case.timing.focusProbe.activeElementInRow = false },
    forged => { forged.case.timing.targetRect.top = forged.case.timing.targetViewportRect.bottom + 100 },
    forged => { forged.case.timing.probeAt = forged.case.timing.endAt + 100 },
    forged => { forged.case.timing.endAt = forged.case.timing.probeAt - 100 },
  ]) {
    const forged = structuredClone(report)
    mutate(forged)
    assert.throws(() => validateBoundedReleaseReport(forged), /actionab|target|focus|hit|timing|viewport/i)
  }
  assert.ok(report.case.timing.hitTarget && report.case.timing.focusProbe)
})
