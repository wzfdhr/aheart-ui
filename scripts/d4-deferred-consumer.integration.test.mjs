import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'

const run = promisify(execFile)
const workspace = process.cwd()
const baseline = path.join(workspace, 'docs/superpowers/evidence/d4-c/consumer/baseline.tgz')
const approvedBaseline = '4a7511f9594d0a74906e427e158d02343ba33a22'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

async function packCurrent(directory) {
  const result = await run('corepack', ['pnpm', '--dir', path.join(workspace, 'packages/components'), 'pack', '--json', '--pack-destination', directory], { cwd: workspace, maxBuffer: 4 * 1024 * 1024 })
  return JSON.parse(result.stdout).filename
}

test('packed production smoke has an absolute preview baseURL and authentic collector output', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'd4-deferred-integration-red-'))
  const candidate = await packCurrent(root)
  const baselineBytes = await readFile(baseline)
  const candidateBytes = await readFile(candidate)
  const baselineManifest = path.join(root, 'baseline-manifest.json')
  const candidateManifest = path.join(root, 'candidate-manifest.json')
  await writeFile(baselineManifest, JSON.stringify({ clean: true, commit: approvedBaseline, tarballSha256: hash(baselineBytes) }))
  await writeFile(candidateManifest, JSON.stringify({ clean: true, commit: 'candidate-from-clean-checkout', tarballSha256: hash(candidateBytes) }))
  const out = path.join(root, 'collector.json')
  const log = path.join(root, 'collector.log')
  const result = await run(process.execPath, [
    path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'),
    '--smoke',
    '--baseline-tarball', baseline,
    '--candidate-tarball', candidate,
    '--baseline-commit', approvedBaseline,
    '--candidate-commit', 'candidate-from-clean-checkout',
    '--baseline-manifest', baselineManifest,
    '--candidate-manifest', candidateManifest,
    '--base-url', 'http://127.0.0.1:0',
    '--out', out,
  ], { cwd: workspace, maxBuffer: 8 * 1024 * 1024 }).then(value => ({ code: 0, output: `${value.stdout}\n${value.stderr}` }), error => ({ code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` }))
  await writeFile(log, result.output)
  assert.equal(result.code, 0, `collector integration failed; preserved log ${log}\n${result.output}`)
  const report = JSON.parse(await readFile(out, 'utf8'))
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
  assert.equal(report.case.timing.searchSeparated, true)
  assert.equal(report.case.timing.triggerExcludedFromRows, true)
  assert.equal(report.case.timing.vueNextTick, true)
  assert.equal(report.case.timing.ownerRealmFrames, 2)
  assert.equal(report.case.state.actionableRowVisible, true)
  assert.equal(report.case.state.actionableRowEnabled, true)
  assert.ok(Object.values(report.familyCoverage).every(item => item.realData && item.scenarios.length > 0 && item.scenarios.every(scenario => scenario.executed === true && scenario.eventCount > 0)))
  assert.ok(report.familyCoverage.Tree.scenarios.some(scenario => scenario.actions.includes('expand')))
  assert.ok(report.familyCoverage.TreeSelect.scenarios.some(scenario => scenario.actions.includes('check') && scenario.logicalSearchMatches >= 5000))
  assert.ok(report.familyCoverage.Cascader.scenarios.some(scenario => scenario.actions.includes('keyboard') && scenario.actions.includes('lazy')))
  assert.ok(report.case.scroll.every(step => step.rowRects.length > 0 && step.viewportRect.height > 0 && step.coverageComplete && step.rowRects.every(row => row.height > 0)))
  assert.equal(report.case.geometry.viewportCoverageComplete, true)
  assert.equal(report.case.geometry.excludeOffscreenPins, true)
  assert.equal(report.case.observers.startedBeforeFirstWrite, true)
  assert.equal(report.case.observers.drainedAfterLastWrite, true)
  assert.equal(report.case.observers.disconnected, true)
  assert.ok(report.case.observers.longTasks.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)))
  assert.ok(report.case.observers.layoutShifts.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)))
  assert.equal(report.case.observers.rawRecomputed, true)
  assert.ok(Object.values(report.ssrHydration.combinations).every(item => item.initialHtmlSha256 && item.hydratedHtmlSha256 && item.initialIdSha256 && item.hydratedIdSha256 && item.postHydrationInteraction === true))
  assert.equal(report.iframe.observersAfterUnmount, 0)
  assert.equal(report.iframe.rafAfterUnmount, 0)
  assert.equal(report.iframe.timersAfterUnmount, 0)
  assert.ok(report.iframe.resourceCounts.before > 0 && report.iframe.resourceCounts.after === 0)
  assert.equal(report.realEvidenceBinding.tarballReopened, true)
  assert.ok(report.realEvidenceBinding.buildFingerprint.before && report.realEvidenceBinding.buildFingerprint.after)
  assert.ok(report.realEvidenceBinding.moduleFingerprint.before && report.realEvidenceBinding.moduleFingerprint.after)
  assert.equal(report.alternatingOrderConvention, 'pair-forward-reverse')
  assert.equal(report.failureEvidence.persistedBeforeCleanup, true)
  assert.equal(report.outputDirectoryDurable, true)
})
