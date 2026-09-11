import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { recomputeFamilyCoverage, validateBoundedReleaseReport, verifyArtifactBindings } from './d4-deferred-consumer-contract.mjs'

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

const collectAuthenticSsrSnapshotRed = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'd4-deferred-ssr-authentic-red-'))
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
  const args = [
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
  ]
  const result = await run(process.execPath, args, { cwd: workspace, maxBuffer: 8 * 1024 * 1024 }).then(value => ({ code: 0, output: `${value.stdout}\n${value.stderr}` }), error => ({ code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` }))
  const logPath = path.join(root, 'collector.log')
  await writeFile(logPath, result.output)
  let report
  if (result.code === 0) {
    report = JSON.parse(await readFile(out, 'utf8'))
    await verifyArtifactBindings(report, { reportPath: out })
    assert.doesNotThrow(() => validateBoundedReleaseReport(report), 'successful authentic collector output must pass control validation')
  } else {
    const prevalidationPath = `${out}.prevalidation.json`
    report = JSON.parse(await readFile(prevalidationPath, 'utf8'))
    assert.match(result.output, /D4 bounded release contract failed|SSR|snapshot|selector/i, `failed collector must identify snapshot contract failure; log ${logPath}`)
  }
  return { root, report, result, logPath, outputPath: result.code === 0 ? out : `${out}.prevalidation.json` }
}

const snapshotStructureProjection = snapshot => {
  if (!snapshot) return snapshot
  const { capturePhase: _capturePhase, captureNonce: _captureNonce, ...structure } = snapshot
  return structure
}

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

test('bounded SSR records bind full server/hydrated DOM and teleport snapshots, not only ID counts', async () => {
  const { report } = await collectRealBoundedReport()
  const combinations = Object.values(report.ssrHydration.combinations ?? {})
  assert.equal(combinations.length, 8)
  for (const item of combinations) {
    for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
      assert.ok(snapshot && Array.isArray(snapshot.sortedIds) && snapshot.sortedIds.length > 0)
      assert.ok(Array.isArray(snapshot.nodes) && snapshot.nodes.length > 0)
      assert.equal(snapshot.nodes.length, 6, 'SSR accessibility snapshot must contain exactly the six contract nodes')
      assert.deepEqual(snapshot.sortedIds, [...snapshot.sortedIds].sort(), 'snapshot sortedIds must be actual deterministic values')
      assert.equal(new Set(snapshot.sortedIds).size, snapshot.sortedIds.length)
      const ids = new Set(snapshot.sortedIds)
      const expectedKinds = { Tree: ['root', 'row'], TreeSelect: ['trigger', 'root'], Cascader: ['trigger', 'root'] }
      assert.deepEqual(new Set(snapshot.nodes.map(node => node.component)), new Set(Object.keys(expectedKinds)))
      assert.deepEqual(
        snapshot.nodes.map(node => `${node.component}/${node.kind}`).sort(),
        ['Cascader/root', 'Cascader/trigger', 'Tree/root', 'Tree/row', 'TreeSelect/root', 'TreeSelect/trigger'],
        'SSR accessibility snapshot must contain one unique record for each contract node'
      )
      for (const [component, kinds] of Object.entries(expectedKinds)) {
        for (const kind of kinds) {
          const node = snapshot.nodes.find(item => item.component === component && item.kind === kind)
          assert.ok(node, `${component}/${kind} must be captured from an actual rendered selector`)
          const selector = node.selector ?? node.selectorProvenance ?? node.identity?.selector
          assert.ok(typeof selector === 'string' && selector.length > 0, `${component}/${kind} must retain its actual selector provenance`)
          assert.equal(node.selectorProvenance?.source, 'document.querySelector')
          assert.equal(node.selectorMatchCount, 1, `${component}/${kind} selector must resolve exactly once`)
          assert.equal(node.selectorResolved, true, `${component}/${kind} selector must resolve to the recorded node`)
          const selectorPattern = component === 'Tree' ? (kind === 'row' ? /treeitem|aheart-tree__node/ : /aheart-tree/) : component === 'TreeSelect' ? (kind === 'trigger' ? /tree-select__trigger/ : /tree-select__panel|role=.?tree/) : (kind === 'trigger' ? /cascader__trigger/ : /cascader__panel|cascader__column/)
          assert.match(selector, selectorPattern, `${component}/${kind} selector must identify the actual component element`)
        }
      }
      assert.doesNotMatch(snapshot.rawMainHtml, /<script\b|__d4CaptureSnapshot|D4FLOATDBG|diagnostic/i, 'raw main HTML must exclude collector diagnostics')
      assert.doesNotMatch(snapshot.rawTeleportHtml, /<script\b|__d4CaptureSnapshot|D4FLOATDBG|diagnostic/i, 'raw teleport HTML must exclude collector diagnostics')
      for (const node of snapshot.nodes) {
        if (node.id == null) {
          assert.equal(node.component, 'Cascader', 'an id-less snapshot node is only valid for the actual Cascader trigger')
          assert.equal(node.kind, 'trigger', 'an id-less snapshot node cannot be synthesized as a row/root')
          assert.ok(node.selector ?? node.selectorProvenance ?? node.identity?.selector, 'an id-less trigger must carry selector provenance')
        } else assert.ok(ids.has(node.id))
        for (const attribute of ['ariaControls', 'ariaActivedescendant', 'ariaLabelledby', 'ariaDescribedby']) assert.ok(Object.prototype.hasOwnProperty.call(node, attribute), `${node.component}/${node.kind} snapshot must record ${attribute}, including null when absent`)
        for (const attribute of ['ariaControls', 'ariaActivedescendant', 'ariaLabelledby', 'ariaDescribedby']) {
          const value = node[attribute]
          if (value == null || value === '') continue
          const references = Array.isArray(value) ? value : String(value).split(/\s+/)
          assert.ok(references.every(reference => ids.has(reference)), `${node.component}/${node.kind} ${attribute} must reference a recorded ID`)
        }
      }
      const treeSelectTrigger = snapshot.nodes.find(node => node.component === 'TreeSelect' && node.kind === 'trigger')
      if (item.virtual?.TreeSelect === true && treeSelectTrigger?.ariaActivedescendant == null) assert.equal(treeSelectTrigger.focusModel, 'roving-dom-focus')
    }
    assert.equal(item.serverSnapshot.capturePhase, 'server-before-hydration')
    assert.equal(item.hydratedSnapshot.capturePhase, 'hydrated-after-mount')
    assert.ok(typeof item.serverSnapshot.captureNonce === 'string' && item.serverSnapshot.captureNonce.length > 0)
    assert.ok(typeof item.hydratedSnapshot.captureNonce === 'string' && item.hydratedSnapshot.captureNonce.length > 0)
    assert.notEqual(item.serverSnapshot.captureNonce, item.hydratedSnapshot.captureNonce)
    assert.deepEqual(snapshotStructureProjection(item.serverSnapshot), snapshotStructureProjection(item.hydratedSnapshot), 'server and hydrated accessibility structures must match after excluding capture metadata only')
    assert.equal(item.combinedSha256, item.serverSnapshot.combinedSha256)
    assert.equal(item.combinedSha256, item.hydratedSnapshot.combinedSha256)
    assert.equal(item.mainHtmlSha256, item.hydratedMainHtmlSha256)
    assert.equal(item.teleportHtmlSha256, item.hydratedTeleportHtmlSha256)
    assert.ok(item.cjsRenderRecord?.exportPath && item.cjsRenderRecord?.exportSha256)
    assert.equal(hash(await readFile(item.cjsRenderRecord.exportPath)), item.cjsRenderRecord.exportSha256)
  }
})

test('authentic SSR RED directly checks exact nodes, independent captures, selectors, normalization and pollution', async t => {
  const capture = await collectAuthenticSsrSnapshotRed()
  const { report, result, logPath } = capture
  const combinations = Object.values(report.ssrHydration?.combinations ?? {})
  assert.ok(combinations.length === 8, `SSR report must preserve all eight combinations; log ${logPath}`)
  const expectedKinds = ['Cascader/root', 'Cascader/trigger', 'Tree/root', 'Tree/row', 'TreeSelect/root', 'TreeSelect/trigger']
  const normalize = html => String(html || '').replace(/\s+/g, ' ').trim()

  await t.test('capture phase and exact six node contract', () => {
    for (const item of combinations) {
      for (const [phase, snapshot] of [['server-before-hydration', item.serverSnapshot], ['hydrated-after-mount', item.hydratedSnapshot]]) {
        assert.equal(snapshot?.capturePhase, phase)
        assert.ok(typeof snapshot?.captureNonce === 'string' && snapshot.captureNonce.length > 0)
        assert.equal(snapshot?.nodes?.length, 6)
        assert.deepEqual(snapshot.nodes.map(node => `${node.component}/${node.kind}`).sort(), expectedKinds)
      }
      assert.notEqual(item.serverSnapshot.captureNonce, item.hydratedSnapshot.captureNonce)
      assert.deepEqual(snapshotStructureProjection(item.serverSnapshot), snapshotStructureProjection(item.hydratedSnapshot))
    }
  })

  await t.test('selector re-query and normalized raw bindings', () => {
    for (const item of combinations) {
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
        for (const node of snapshot.nodes) {
          assert.equal(node.selectorProvenance?.source, 'document.querySelector')
          assert.equal(node.selectorMatchCount, 1)
          assert.equal(node.selectorResolved, true)
        }
        assert.equal(snapshot.mainHtml, normalize(snapshot.rawMainHtml))
        assert.equal(snapshot.teleportHtml, normalize(snapshot.rawTeleportHtml))
        assert.doesNotMatch(snapshot.rawMainHtml, /<script\b|__d4CaptureSnapshot|D4FLOATDBG|diagnostic/i)
        assert.doesNotMatch(snapshot.rawTeleportHtml, /<script\b|__d4CaptureSnapshot|D4FLOATDBG|diagnostic/i)
      }
    }
  })

  await t.test('capture artifacts reopen and bind every snapshot field', async () => {
    for (const [combinationKey, item] of Object.entries(report.ssrHydration.combinations ?? {})) {
      const evidence = item.captureEvidence
      assert.ok(Array.isArray(evidence) && evidence.length === 2, `${combinationKey} must expose two capture records; log ${logPath}`)
      for (const [index, record] of evidence.entries()) {
        const snapshot = index === 0 ? item.serverSnapshot : item.hydratedSnapshot
        assert.equal(record.ordinal, index + 1)
        assert.equal(record.combinationKey, combinationKey)
        assert.equal(record.phase, snapshot.capturePhase)
        assert.equal(record.nonce, snapshot.captureNonce)
        assert.equal(record.structureSha256, hash(Buffer.from(JSON.stringify(snapshotStructureProjection(snapshot)))))
        assert.ok(record.path && record.sha256)
        const bytes = await readFile(path.resolve(record.path))
        assert.equal(hash(bytes), record.sha256)
        const artifact = JSON.parse(bytes)
        const artifactSnapshot = artifact.snapshot ?? artifact
        assert.deepEqual(artifactSnapshot, snapshot, `${combinationKey} capture artifact must exactly match its snapshot`)
      }
    }
  })

  await writeFile('/tmp/d4-ssr-authentic-red-v3-summary.log', `${JSON.stringify({ exitCode: result.code, logPath, outputPath: capture.outputPath, subtests: 3 }, null, 2)}\n`)
})

test('bounded SSR hydration records have all three component actions and honest virtual row windows', async () => {
  const { report } = await collectRealBoundedReport()
  for (const item of Object.values(report.ssrHydration.combinations ?? {})) {
    const actions = item.postHydrationActions ?? []
    assert.deepEqual(new Set(actions.map(action => action.component)), new Set(['Tree', 'TreeSelect', 'Cascader']))
    assert.ok(actions.every(action => action.target && action.beforeState && action.afterState && JSON.stringify(action.beforeState) !== JSON.stringify(action.afterState) && action.callbackEventNames?.length > 0))
    for (const component of ['Tree', 'TreeSelect', 'Cascader']) {
      const rows = item.initialRowsByComponent?.[component]
      assert.ok(Number.isInteger(rows) && rows > 0)
      if (item.virtual?.[component] === true) assert.ok(rows <= 24)
      else assert.equal(rows, item.componentRows?.[component])
    }
  }
})

test('bounded SSR validator rejects forged accessibility IDs, teleport hashes and component action records', async () => {
  const { report } = await collectRealBoundedReport()
  const mutations = [
    forged => { const item = forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]]; item.hydratedSnapshot.nodes[0].id = 'd4-forged-id' },
    forged => { const item = forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]]; item.hydratedSnapshot.nodes[0].ariaControls = 'd4-forged-controls' },
    forged => { const item = forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]]; item.hydratedSnapshot.nodes[0].ariaLabelledby = 'd4-missing-label' },
    forged => { const item = forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]]; item.hydratedSnapshot.nodes[0].ariaDescribedby = item.hydratedSnapshot.nodes[0].id },
    forged => { forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]].teleportHtmlSha256 = '0'.repeat(64) },
    forged => { const item = forged.ssrHydration.combinations[Object.keys(forged.ssrHydration.combinations)[0]]; item.postHydrationActions = item.postHydrationActions.filter(action => action.component !== 'Cascader') },
  ]
  for (const mutate of mutations) await assertBoundedMutationRejected(report, mutate, 'bounded SSR raw accessibility/teleport/action evidence must be immutable', /SSR|hydration|accessib|teleport|action|snapshot|hash/i)
})

test('bounded SSR validator rejects copied hydrated snapshots, extra nodes and teleport diagnostics', async () => {
  const { report } = await collectRealBoundedReport()
  const key = Object.keys(report.ssrHydration.combinations)[0]
  const normalize = html => String(html || '').replace(/\s+/g, ' ').trim()
  const refreshHashes = item => {
    for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
      snapshot.teleportHtml = normalize(snapshot.rawTeleportHtml)
      snapshot.combinedHtml = normalize(snapshot.rawMainHtml + snapshot.rawTeleportHtml)
      snapshot.teleportHtmlSha256 = hash(Buffer.from(snapshot.teleportHtml))
      snapshot.combinedSha256 = hash(Buffer.from(snapshot.combinedHtml))
    }
    item.teleportHtmlSha256 = item.serverSnapshot.teleportHtmlSha256
    item.hydratedTeleportHtmlSha256 = item.hydratedSnapshot.teleportHtmlSha256
    item.combinedSha256 = item.serverSnapshot.combinedSha256
  }
  const mutations = [
    ['copied hydrated snapshot', /capture|artifact|snapshot|nonce/i, true, forged => {
      const item = forged.ssrHydration.combinations[key]
      item.hydratedSnapshot = structuredClone(item.serverSnapshot)
      item.hydratedSnapshot.capturePhase = 'hydrated-after-mount'
      item.hydratedSnapshot.captureNonce = `${item.serverSnapshot.captureNonce}-copied`
    }],
    ['extra snapshot node', /exactly six|node count must be six/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      item.serverSnapshot.nodes.push(structuredClone(item.serverSnapshot.nodes[0]))
      item.hydratedSnapshot.nodes.push(structuredClone(item.hydratedSnapshot.nodes[0]))
    }],
    ['duplicate or missing node identity', /component\.kind.*unique|duplicate component\.kind|identity set/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
        snapshot.nodes = snapshot.nodes.filter(node => !(node.component === 'TreeSelect' && node.kind === 'root'))
        snapshot.nodes.push({ ...structuredClone(snapshot.nodes[0]), component: 'Tree', kind: 'row' })
      }
    }],
    ['non-unique selector provenance', /selector match count.*one|selector.*exactly once/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
        const node = snapshot.nodes.find(entry => entry.component === 'TreeSelect' && entry.kind === 'trigger')
        node.selector = '.aheart-tree-select__trigger'
        node.selectorProvenance.selector = node.selector
        node.selectorMatchCount = 2
        node.selectorResolved = false
      }
    }],
    ['wrong selector provenance', /selector.*component pattern|selector identity mismatch/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) {
        const node = snapshot.nodes.find(entry => entry.component === 'Cascader' && entry.kind === 'root')
        node.selector = '.aheart-cascader__trigger'
        node.selectorProvenance.selector = node.selector
        node.selectorMatchCount = 1
        node.selectorResolved = true
      }
    }],
    ['teleport diagnostic', /diagnostic script pollution|raw teleport.*script/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) snapshot.rawTeleportHtml += '<script>window.__d4CaptureSnapshot()</script>'
      refreshHashes(item)
    }],
    ['raw teleport only', /raw teleport.*normalized mismatch|normalize\.rawTeleportHtml/i, false, forged => {
      const item = forged.ssrHydration.combinations[key]
      for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) snapshot.rawTeleportHtml += '<span>raw-binding-probe</span>'
    }],
  ]
  await assertBoundedControlPasses(report)
  for (const [label, pattern, captureArtifact, mutate] of mutations) {
    const forged = structuredClone(report)
    mutate(forged)
    if (captureArtifact) {
      await assert.rejects(async () => {
        await verifyArtifactBindings(forged)
        validateBoundedReleaseReport(forged)
      }, error => error?.message && pattern.test(error.message), `bounded SSR validator must reject ${label} through capture artifact binding`)
    } else {
      assert.throws(() => validateBoundedReleaseReport(forged), error => {
        const semanticFailures = (error?.failures ?? []).filter(failure => !/capture|artifact/i.test(failure))
        return semanticFailures.some(failure => pattern.test(failure))
      }, `bounded SSR validator must reject ${label} through its dedicated contract failure`)
    }
  }
})

test('real bounded iframe lifecycle evidence has authentic realm, popup, unmount and late-loader records', async t => {
  const { report } = await collectRealBoundedReport()
  const iframe = report.iframe
  const components = ['Tree', 'TreeSelect', 'Cascader']
  const expectedComponents = [...components].sort()
  const assertRaw = () => { assert.ok(iframe.rawLifecycle, 'bounded iframe report must contain raw lifecycle evidence'); assert.equal(iframe.rawLifecycle.schema, 'd4-iframe-lifecycle/v1'); assert.ok(Array.isArray(iframe.rawLifecycle.scenarios) && iframe.rawLifecycle.scenarios.length === 3); return iframe.rawLifecycle }
  const assertScenario = (raw, component) => { const scenario = raw.scenarios.find(item => item.component === component); assert.ok(scenario, `${component} iframe scenario is required`); assert.ok(Array.isArray(scenario.events), `${component} iframe events are required`); return scenario }
  await t.test('scenario matrix, surface descriptors and raw artifact', async () => {
    const raw = assertRaw()
    assert.equal(iframe.status, 'recorded')
    assert.ok(iframe.lifecycleArtifact?.path && iframe.lifecycleArtifact.sha256)
    const bytes = await readFile(iframe.lifecycleArtifact.path)
    assert.equal(hash(bytes), iframe.lifecycleArtifact.sha256)
    assert.deepEqual(JSON.parse(bytes), raw)
    assert.deepEqual(raw.scenarios.map(item => item.component).sort(), expectedComponents)
    assert.equal(new Set(raw.scenarios.map(item => item.scenarioId)).size, 3)
    assert.equal(new Set(raw.scenarios.map(item => item.realmId)).size, 3)
    for (const scenario of raw.scenarios) { const parsed = new URL(`http://iframe.test${scenario.scenarioUrl}`); assert.equal(parsed.searchParams.get('component'), scenario.component); assert.equal(parsed.searchParams.get('iframeProbe'), 'true'); assert.equal(parsed.searchParams.get('virtual'), 'true'); assert.equal(parsed.searchParams.get('rowMode'), 'fixed'); if (scenario.component === 'Cascader') assert.equal(parsed.searchParams.get('cascaderScenario'), 'iframe-lazy') }
    assert.deepEqual(Object.keys(iframe.components ?? {}).sort(), expectedComponents)
    for (const component of components) { const evidence = iframe.components[component]; assert.ok(evidence.surface?.kind && evidence.scroll?.selector); if (component === 'Tree') assert.equal(evidence.surface.kind, 'inline'); else assert.equal(evidence.surface.kind, 'teleport'); assert.equal(evidence.ownerDocument, true); assert.equal(evidence.defaultView, true) }
  })
  await t.test('resource constructor events are raw and drained', () => {
    const raw = assertRaw(); assert.ok(raw.scenarios.every(scenario => scenario.events?.length > 0));
    const resources = []
    for (const component of components) { const scenario = assertScenario(raw, component); const install = scenario.events.find(event => event.type === 'instrumentation-install'); assert.ok(install && install.installedBeforeMount && install.realmType === 'iframe' && install.collectorWaitsExcluded); assert.deepEqual([...install.proxyKinds].sort(), ['interval', 'raf', 'resizeObserver', 'timeout']); assert.ok(scenario.events.every((event, index) => event.seq === index + 1 && event.time >= (scenario.events[index - 1]?.time ?? 0) && event.scenarioId === scenario.scenarioId && event.realmId === scenario.realmId)); resources.push(...scenario.events.filter(event => event.type === 'resource')) }
    assert.ok(resources.length > 0); assert.ok(resources.every(event => ['resizeObserver', 'raf', 'timeout', 'interval'].includes(event.kind) && ['create', 'observe', 'callback', 'cancel', 'clear', 'disconnect'].includes(event.action) && event.resourceId && event.source === 'component-runtime' && event.realmId))
    assert.ok(raw.summary?.createdBeforeUnmount > 0); assert.equal(raw.summary?.activeAfterUnmount, 0)
  })
  await t.test('popup focus Teleport unmount and late loader events are real', () => {
    const raw = assertRaw(); for (const component of ['TreeSelect', 'Cascader']) { const scenario = assertScenario(raw, component); const events = scenario.events; for (const type of ['popup-open', 'escape', 'popup-close', 'focus-restore', 'reopen']) assert.ok(events.some(event => event.type === type && event.realmId === scenario.realmId)); const open = events.find(event => event.type === 'popup-open'); assert.equal(open.panelParentTag, 'BODY'); assert.equal(open.panelParentOwnerDocument, true); assert.equal(open.panelParentDefaultView, true); assert.equal(open.scrollOwnerDocument, true); assert.equal(open.scrollOwnerDefaultView, true); const escape = events.find(event => event.type === 'escape'); assert.equal(escape.escapeEventRealm, 'iframe'); const focus = events.find(event => event.type === 'focus-restore'); assert.equal(focus.observedWithoutCollectorFocus, true); assert.equal(focus.parentActiveElement, 'iframe'); const reopen = events.find(event => event.type === 'reopen'); assert.equal(reopen.visible, true); assert.equal(reopen.expanded, true) }
    const cascader = assertScenario(raw, 'Cascader').events; for (const type of ['lazy-pending', 'lazy-abort', 'lazy-resolve-after-unmount']) assert.ok(cascader.some(event => event.type === type)); const late = cascader.find(event => event.type === 'lazy-resolve-after-unmount'); assert.equal(typeof late.stateRawBefore, 'string'); assert.equal(typeof late.stateRawAfter, 'string'); assert.equal(typeof late.domRawBefore, 'string'); assert.equal(typeof late.domRawAfter, 'string'); assert.ok(Array.isArray(late.callbacksBefore) && Array.isArray(late.callbacksAfter)); assert.equal(late.componentUpdateCount, 0); assert.equal(late.stateHashBeforeSha256, hash(Buffer.from(late.stateRawBefore))); assert.equal(late.stateHashAfterSha256, hash(Buffer.from(late.stateRawAfter))); assert.equal(late.domHashBeforeSha256, hash(Buffer.from(late.domRawBefore))); assert.equal(late.domHashAfterSha256, hash(Buffer.from(late.domRawAfter))); assert.equal(late.stateRawBefore, late.stateRawAfter); assert.equal(late.domRawBefore, late.domRawAfter); assert.equal(late.callbacksBeforeSha256, hash(Buffer.from(JSON.stringify(late.callbacksBefore)))); assert.equal(late.callbacksAfterSha256, hash(Buffer.from(JSON.stringify(late.callbacksAfter)))); const post = cascader.filter(event => event.type === 'post-unmount-escape' || event.type === 'post-unmount-pointer'); assert.equal(post.length, 2); assert.notDeepEqual(post[0], post[1]); for (const event of post) { assert.ok(typeof event.beforeRaw === 'string' && typeof event.afterRaw === 'string' && Array.isArray(event.callbacksBefore) && Array.isArray(event.callbacksAfter)); assert.equal(event.consumed, false); assert.equal(event.mutationCount, 0); assert.equal(event.beforeHash, hash(Buffer.from(event.beforeRaw))); assert.equal(event.afterHash, hash(Buffer.from(event.afterRaw))) } assert.equal(raw.summary?.teleportResidualNodes, 0); assert.equal(raw.summary?.escapeFocusRestored, true); assert.equal(raw.summary?.unmountCleanup, true); assert.equal(raw.summary?.lateLazyStateUpdates, 0); assert.equal(raw.summary?.postUnmountInteractions, 0)
  })
})

test('iframe lifecycle artifact mutation is rejected by reopened hash binding', async () => {
  const { report } = await collectRealBoundedReport()
  assert.ok(report.iframe?.lifecycleArtifact?.path)
  const root = await mkdtemp(path.join(tmpdir(), 'd4-iframe-artifact-red-'))
  try {
    const copied = path.join(root, 'iframe-lifecycle.json')
    await cp(report.iframe.lifecycleArtifact.path, copied)
    await writeFile(copied, `${await readFile(copied)}\niframe-mutation`)
    const forged = structuredClone(report)
    forged.iframe.lifecycleArtifact.path = copied
    await assert.rejects(() => verifyArtifactBindings(forged), /iframe lifecycle artifact hash mismatch/i)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('bounded metadata cannot bypass capture artifacts or validator identity', async t => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const key = Object.keys(report.ssrHydration.combinations)[0]
  const mutations = [
    ['copied snapshot with forged capture metadata', /capture artifact mandatory|capture.*artifact|snapshot.*mismatch/i, forged => {
      const item = forged.ssrHydration.combinations[key]
      item.hydratedSnapshot = structuredClone(item.serverSnapshot)
      item.hydratedSnapshot.capturePhase = 'hydrated-after-mount'
      item.hydratedSnapshot.captureNonce = `${item.serverSnapshot.captureNonce}-forged`
    }],
    ['forged bounded run identity', /bounded run identity|run identity|capture artifact mandatory/i, forged => {
      forged.runId = 'bounded-forged-run'
    }],
    ['forged bounded validator marker', /validator marker|validator identity|capture artifact mandatory/i, forged => {
      forged.releaseFormat.validatorName = 'validateBoundedReleaseReport-forged'
    }],
  ]
  for (const [label, pattern, mutate] of mutations) {
    await t.test(label, async () => {
      const forged = structuredClone(report)
      mutate(forged)
      await assert.rejects(async () => {
        await verifyArtifactBindings(forged)
        validateBoundedReleaseReport(forged)
      }, error => pattern.test(error?.message ?? '') || (error?.failures ?? []).some(failure => pattern.test(failure)), `bounded metadata bypass must reject ${label}`)
    })
  }
})

test('bounded artifact and SSR status metadata are mandatory', async t => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const key = Object.keys(report.ssrHydration.combinations)[0]
  const mutations = [
    ['copied snapshot without artifact directory', /artifact.*mandatory|artifactDirectory|capture artifact/i, forged => {
      const item = forged.ssrHydration.combinations[key]
      item.hydratedSnapshot = structuredClone(item.serverSnapshot)
      item.hydratedSnapshot.capturePhase = 'hydrated-after-mount'
      item.hydratedSnapshot.captureNonce = `${item.serverSnapshot.captureNonce}-forged`
      delete forged.artifactDirectory
    }],
    ['copied snapshot without SSR recorded status', /SSR.*status|status.*recorded|capture artifact/i, forged => {
      const item = forged.ssrHydration.combinations[key]
      item.hydratedSnapshot = structuredClone(item.serverSnapshot)
      item.hydratedSnapshot.capturePhase = 'hydrated-after-mount'
      item.hydratedSnapshot.captureNonce = `${item.serverSnapshot.captureNonce}-forged`
      delete forged.ssrHydration.status
    }],
    ['bounded report without artifact directory', /artifact.*mandatory|artifactDirectory|bounded.*artifact/i, forged => {
      delete forged.artifactDirectory
    }],
  ]
  for (const [label, pattern, mutate] of mutations) await t.test(label, async () => {
    const forged = structuredClone(report)
    mutate(forged)
    await assert.rejects(async () => {
      await verifyArtifactBindings(forged)
      validateBoundedReleaseReport(forged)
    }, error => pattern.test(error?.message ?? '') || (error?.failures ?? []).some(failure => pattern.test(failure)), `bounded mandatory metadata must reject ${label}`)
  })
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

test('durable consumer type probe binds a real types.ts file, tsc result and positive/negative virtual API checks', async () => {
  const { output, report } = await collectPreflightReport()
  const probe = report.typeProbe
  assert.ok(probe?.typesPath && probe?.typesSha256)
  assert.equal((await stat(probe.typesPath)).isFile(), true)
  assert.equal(hash(await readFile(probe.typesPath)), probe.typesSha256)
  assert.equal(probe.tscExitCode, 0)
  assert.ok(probe.positiveChecks?.length > 0 && probe.negativeChecks?.length > 0)
  assert.ok(probe.positiveChecks.some(check => /TreeVirtual|TableVirtual|TreeSelectVirtual|CascaderVirtual/.test(check.source ?? check.code ?? check.name ?? '')))
  assert.ok(probe.positiveChecks.some(check => /h\s*\(?(Tree|TreeSelect|Cascader)/.test(check.source ?? check.code ?? '')))
  assert.ok(probe.negativeChecks.some(check => /@ts-expect-error/.test(check.source ?? check.code ?? '') && /height|estimateSize|overscan|string/.test(check.source ?? check.code ?? '')))
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  for (const mutate of [
    forged => { delete forged.typeProbe.typesPath },
    forged => { forged.typeProbe.typesSha256 = '0'.repeat(64) },
    forged => { forged.typeProbe.positiveChecks = forged.typeProbe.positiveChecks.slice(1) },
  ]) {
    const forged = structuredClone(report)
    mutate(forged)
    await assert.rejects(() => contract.verifyArtifactBindings(forged, { reportPath: output }), /type|types|probe|hash|artifact/i)
  }
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

test('real Cascader coverage keeps deep, search and lazy component inputs as separate authentic records', async () => {
  const { report } = await collectRealBoundedReport()
  const scenario = report.familyCoverage?.Cascader?.scenarios?.find(item => item.label === 'deep5-search-lazy-controlled')
  const records = scenario?.componentInputRecords ?? []
  assert.equal(records.length, 3)
  const deep = records.find(record => record.kind === 'deep')
  const search = records.find(record => record.kind === 'search')
  const lazy = records.find(record => record.kind === 'lazy')
  assert.ok(deep && search && lazy, 'deep/search/lazy must each have a separate real componentInput record')
  assert.equal(deep.actualOptionsColumns?.length, 5)
  assert.ok(deep.actualOptionsColumns.every((column, index) => column.index === index && column.keys.length === 2000 && column.optionsHash === hash(Buffer.from(column.keys.join('\n'))) && column.keys.every(key => !key.startsWith('search-') && !key.includes('10000'))))
  assert.ok(deep.actualOptionsColumns.every((column, index) => scenario.columns[index].rawLogicalOptionKeys.length === 2000 && scenario.columns[index].rawColumnOptionsHash === column.optionsHash))
  assert.equal(search.actualComponentInput?.rawLeaves?.length, 10050)
  assert.deepEqual(search.actualComponentInput.matchedPaths, scenario.search.matchedPaths)
  assert.deepEqual(search.actualComponentInput.visibleTail, scenario.search.visibleTail)
  assert.equal(lazy.actualComponentInput?.kind, 'lazy')
  assert.ok(lazy.actualComponentInput.loaderId && lazy.actualComponentInput.events?.length > 0)
  assert.ok(scenario.selectedPath.every((key, columnIndex) => deep.actualOptionsColumns[columnIndex].keys.includes(key)), 'selectedPath must be a member of each corresponding deep component input column')
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
    assert.ok(timing.searchStartedAt >= timing.endAt, 'search must start only after the first interaction evidence is frozen')
    assert.equal(timing.firstInteractionMs, timing.endAt - timing.popup.startedAt)
  }
})

test('bounded validator rejects forged row-mode geometry and Cascader column evidence after control pass', async () => {
  const { report } = await collectRealBoundedReport()
  const mutations = [
    ['dynamic height', forged => { forged.familyCoverage.Tree.rowModeEvidence.dynamic[0].height += 1 }],
    ['dynamic rect', forged => { forged.familyCoverage.Tree.rowModeEvidence.dynamic[0].rect.bottom += 1 }],
    ['dynamic computed style', forged => { forged.familyCoverage.Tree.rowModeEvidence.dynamic[0].computedStyle.height = '999px' }],
    ['dynamic wrapped flag', forged => { forged.familyCoverage.Tree.rowModeEvidence.dynamic[0].wrapped = false }],
    ['Cascader mounted rows', forged => { forged.familyCoverage.Cascader.scenarios.find(item => item.label === 'deep5-search-lazy-controlled').columns[0].mountedRows = 25 }],
    ['Cascader raw option hash', forged => { forged.familyCoverage.Cascader.scenarios.find(item => item.label === 'deep5-search-lazy-controlled').columns[0].rawColumnOptionsHash = '0'.repeat(64) }],
  ]
  for (const [label, mutate] of mutations) {
    await assertBoundedMutationRejected(report, mutate, `bounded validator must reject forged ${label}`, /row|geometry|computed|wrapped|column|hash|bounded|raw/i)
  }
})

test('family coverage recomputation rejects a componentInput hash mismatch', async () => {
  const { report } = await collectRealBoundedReport()
  await assertBoundedControlPasses(report)
  const forged = structuredClone(report)
  const deep = forged.familyCoverage.Cascader.scenarios.find(item => item.label === 'deep5-search-lazy-controlled').componentInputRecords.find(record => record.kind === 'deep')
  deep.actualOptionsColumns[0].optionsHash = '0'.repeat(64)
  assert.equal(recomputeFamilyCoverage(forged.familyCoverage), false, 'family recomputation must bind componentInput hashes to raw options')
  assert.throws(() => validateBoundedReleaseReport(forged), /family|componentInput|hash|raw/i)
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
