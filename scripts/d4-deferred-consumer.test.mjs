import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import path from 'node:path'
import ts from 'typescript'

import {
  RELEASE_MATRIX,
  buildAcceptanceFixture,
  recomputeEvidence,
  buildFullReportShell,
  validateBoundedReleaseReport,
  validateReport,
} from './d4-deferred-consumer-contract.mjs'

const run = promisify(execFile)
const fullReport = () => buildAcceptanceFixture({
  baselinePackage: '/tmp/d4-baseline.tgz',
  candidatePackage: '/tmp/d4-candidate.tgz',
  generatedAt: '2026-09-11T00:00:00.000Z',
})
const snapshotStructureProjection = snapshot => { const { capturePhase: _capturePhase, captureNonce: _captureNonce, ...structure } = snapshot; return structure }

const fullSsrTypesControlReport = () => {
  const report = fullReport()
  const nodeKinds = ['Tree/root', 'Tree/row', 'TreeSelect/trigger', 'TreeSelect/root', 'Cascader/trigger', 'Cascader/root']
  const makeSnapshot = (phase, nonce) => {
    const nodes = nodeKinds.map((identity, index) => {
      const [component, kind] = identity.split('/')
      const id = `full-${component.toLowerCase()}-${kind}-${index}`
      const selector = component === 'Tree' ? (kind === 'root' ? '.aheart-tree' : '.aheart-tree__node') : component === 'TreeSelect' ? (kind === 'trigger' ? '.aheart-tree-select__trigger' : '.aheart-tree-select__panel') : (kind === 'trigger' ? '.aheart-cascader__trigger' : '.aheart-cascader__panel')
      return { id, component, kind, selector, selectorProvenance: { source: 'document.querySelector', selector }, selectorMatchCount: 1, selectorResolved: true, role: null, ariaControls: null, ariaActivedescendant: null, ariaLabelledby: null, ariaDescribedby: null, focusModel: null }
    })
    const rawMainHtml = '<div data-full-ssr="stable"></div>'
    const rawTeleportHtml = '<div data-full-teleport="true"></div>'
    const normalize = html => html.replace(/\s+/g, ' ').trim()
    return { capturePhase: phase, captureNonce: nonce, sortedIds: nodes.map(node => node.id).sort(), nodes, focusModel: null, rawMainHtml, rawTeleportHtml, mainHtml: normalize(rawMainHtml), teleportHtml: normalize(rawTeleportHtml), combinedHtml: normalize(rawMainHtml + rawTeleportHtml), mainHtmlSha256: sha256(Buffer.from(normalize(rawMainHtml))), teleportHtmlSha256: sha256(Buffer.from(normalize(rawTeleportHtml))), combinedSha256: sha256(Buffer.from(normalize(rawMainHtml + rawTeleportHtml))) }
  }
  for (const [combinationKey, item] of Object.entries(report.ssrHydration.combinations)) {
    const serverSnapshot = makeSnapshot('server-before-hydration', `${combinationKey}-server`)
    const hydratedSnapshot = makeSnapshot('hydrated-after-mount', `${combinationKey}-hydrated`)
    assert.deepEqual(snapshotStructureProjection(serverSnapshot), snapshotStructureProjection(hydratedSnapshot), `${combinationKey} synthetic server/hydrated structure must be identical apart from capture metadata`)
    item.serverSnapshot = serverSnapshot
    item.hydratedSnapshot = hydratedSnapshot
    item.componentRows = { Tree: 12, TreeSelect: 12, Cascader: 12 }
    item.mainHtmlSha256 = serverSnapshot.mainHtmlSha256
    item.teleportHtmlSha256 = serverSnapshot.teleportHtmlSha256
    item.combinedSha256 = serverSnapshot.combinedSha256
    item.hydratedMainHtmlSha256 = hydratedSnapshot.mainHtmlSha256
    item.hydratedTeleportHtmlSha256 = hydratedSnapshot.teleportHtmlSha256
    item.initialRowsByComponent = { Tree: 12, TreeSelect: 12, Cascader: 12 }
    item.postHydrationActions = ['Tree', 'TreeSelect', 'Cascader'].map(component => ({ component, target: { selector: `#full-${component.toLowerCase()}-action`, selectorProvenance: { source: 'document.querySelector', selector: `#full-${component.toLowerCase()}-action` }, id: null }, beforeState: { value: 'before' }, afterState: { value: 'after' }, callbackEventNames: [`${component}:change`] }))
    item.captureEvidence = [
      { ordinal: 1, combinationKey, phase: serverSnapshot.capturePhase, nonce: serverSnapshot.captureNonce, structureSha256: sha256(Buffer.from(JSON.stringify(snapshotStructureProjection(serverSnapshot)))), path: `/synthetic/${combinationKey}/server.json`, sha256: 'a'.repeat(64) },
      { ordinal: 2, combinationKey, phase: hydratedSnapshot.capturePhase, nonce: hydratedSnapshot.captureNonce, structureSha256: sha256(Buffer.from(JSON.stringify(snapshotStructureProjection(hydratedSnapshot)))), path: `/synthetic/${combinationKey}/hydrated.json`, sha256: 'b'.repeat(64) },
    ]
    item.postHydrationInteraction = true
    item.postHydrationStateChanged = true
    item.businessEventsAfterHydration = 3
    item.initialIdSha256 = sha256(Buffer.from(JSON.stringify(serverSnapshot.sortedIds)))
    item.hydratedIdSha256 = item.initialIdSha256
  }
  report.typeProbe = { typesPath: '/synthetic/types-probe.ts', configPath: '/synthetic/tsconfig.type-probe.json', tscExitCode: 0, positiveChecks: ['TreeVirtual', 'TreeSelectVirtual', 'CascaderVirtual', 'h(Tree)', 'h(Cascader)'], negativeChecks: ['bad TreeVirtual', 'bad TreeSelectVirtual', 'bad CascaderVirtual'] }
  return report
}

const iframeControlReport = () => {
  const report = fullSsrTypesControlReport()
  const components = ['Tree', 'TreeSelect', 'Cascader']
  const expectedComponents = [...components].sort()
  const makeScenario = (component, index) => {
    const scenarioId = `iframe-scenario-${index}`
    const realmId = `iframe-realm-${index}`
    let seq = 0
    const events = []
    const add = (type, fields = {}) => events.push({ seq: ++seq, time: seq * 10, type, scenarioId, realmId, ...fields })
    add('instrumentation-install', { proxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedProxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedBeforeMount: true, collectorWaitsExcluded: true, realmType: 'iframe', propertyLocked: true, probeMarker: 'd4-iframe-probe-v1' })
    add('frame-mounted', { connected: true })
    for (const kind of ['resizeObserver', 'raf', 'timeout', 'interval']) {
      add('resource', { kind, action: 'create', resourceId: `${scenarioId}-${kind}`, targetSelector: '.component-root', source: 'component-runtime' })
      if (kind === 'resizeObserver') { add('resource', { kind, action: 'observe', resourceId: `${scenarioId}-${kind}`, targetSelector: '.component-root', source: 'component-runtime' }); add('resource', { kind, action: 'unobserve', resourceId: `${scenarioId}-${kind}`, targetSelector: '.component-root', source: 'component-runtime' }); add('resource', { kind, action: 'observe', resourceId: `${scenarioId}-${kind}`, targetSelector: '.secondary-root', source: 'component-runtime' }) }
    }
    if (component !== 'Tree') for (const type of ['popup-open', 'escape', 'popup-close', 'focus-restore', 'reopen']) add(type, { panelParentTag: type === 'popup-open' ? 'BODY' : undefined, panelParentOwnerDocument: true, panelParentDefaultView: true, scrollOwnerDocument: true, scrollOwnerDefaultView: true, parentDocumentResidualNodes: 0, panelParentRealm: 'iframe', ownerDocument: true, defaultView: true, restored: type === 'focus-restore', observedWithoutCollectorFocus: type === 'focus-restore', parentActiveElement: type === 'focus-restore' ? 'iframe' : undefined, visible: type === 'reopen', expanded: type === 'reopen', escapeEventRealm: type === 'escape' ? 'iframe' : undefined, consumed: false })
    if (component === 'Cascader') add('lazy-pending')
    add('frame-unmount-invoked', { connected: true })
    if (component === 'Cascader') add('lazy-abort')
    add('resource', { kind: 'resizeObserver', action: 'disconnect', resourceId: `${scenarioId}-resizeObserver`, targetSelector: '.component-root', source: 'component-runtime' })
    add('resource', { kind: 'raf', action: 'cancel', resourceId: `${scenarioId}-raf`, targetSelector: '.component-root', source: 'component-runtime' })
    add('resource', { kind: 'timeout', action: 'clear', resourceId: `${scenarioId}-timeout`, targetSelector: '.component-root', source: 'component-runtime' })
    add('resource', { kind: 'interval', action: 'clear', resourceId: `${scenarioId}-interval`, targetSelector: '.component-root', source: 'component-runtime' })
    add('frame-unmount-complete', { connected: true })
    add('owner-flush', { domResidualNodes: 0, teleportResidualNodes: 0, resourceResiduals: 0 })
    if (component === 'Cascader') add('lazy-resolve-after-unmount', { returnedChildrenCount: 1, componentUpdateCount: 0, stateRawBefore: 'same', stateRawAfter: 'same', domRawBefore: 'same', domRawAfter: 'same', stateHashBefore: 'same', stateHashAfter: 'same', domHashBefore: 'same', domHashAfter: 'same', callbacksBefore: [], callbacksAfter: [], stateHashBeforeSha256: sha256(Buffer.from('same')), stateHashAfterSha256: sha256(Buffer.from('same')), domHashBeforeSha256: sha256(Buffer.from('same')), domHashAfterSha256: sha256(Buffer.from('same')), callbacksBeforeSha256: sha256(Buffer.from('[]')), callbacksAfterSha256: sha256(Buffer.from('[]')) })
    add('owner-observation', { domResidualNodes: 0, teleportResidualNodes: 0, parentDocumentResidualNodes: 0, resourceResiduals: 0 })
    add('post-unmount-escape', { consumed: false, mutationCount: 0, updateCount: 0, callbacksBefore: [], callbacksAfter: [], beforeRaw: 'same', afterRaw: 'same', beforeHash: sha256(Buffer.from('same')), afterHash: sha256(Buffer.from('same')) })
    add('post-unmount-pointer', { consumed: false, mutationCount: 0, updateCount: 0, callbacksBefore: [], callbacksAfter: [], beforeRaw: 'same', afterRaw: 'same', beforeHash: sha256(Buffer.from('same')), afterHash: sha256(Buffer.from('same')) })
    add('frame-removed', { connected: false })
    return { component, scenarioUrl: `/components/d4-iframe?component=${component}&iframeProbe=true&virtual=true&rowMode=fixed${component === 'Cascader' ? '&cascaderScenario=iframe-lazy' : ''}`, scenarioId, realmId, events }
  }
  const scenarios = components.map(makeScenario)
  report.iframe = {
    status: 'recorded', sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0,
    scenarioUrls: scenarios.map(({ component, scenarioUrl }) => ({ component, url: scenarioUrl })),
    components: Object.fromEntries(expectedComponents.map(component => [component, { surface: { kind: component === 'Tree' ? 'inline' : 'teleport' }, trigger: { selector: `.${component.toLowerCase()}-trigger` }, scroll: { selector: '.scroll' }, panel: component === 'Tree' ? null : { selector: '.panel' }, ownerDocument: true, defaultView: true }])),
    rawLifecycle: {
      schema: 'd4-iframe-lifecycle/v1',
      scenarios,
      summary: { scenarioCount: 3, components: expectedComponents, proxiesInstalled: true, allRealmsIframe: true, createdBeforeUnmount: 12, activeAfterUnmount: 0, byKind: { resizeObserver: 0, raf: 0, timeout: 0, interval: 0 }, finalActive: 0, teleportResidualNodes: 0, escapeFocusRestored: true, unmountCleanup: true, lateLazyStateUpdates: 0, postUnmountInteractions: 0 },
    },
    lifecycleArtifact: { path: '/synthetic/iframe-lifecycle.json', sha256: 'a'.repeat(64) },
  }
  return report
}

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
  const typeProbeSource = `import { h } from 'vue'
import { Cascader, Tree, TreeSelect } from 'aheart-ui'
import type { CascaderVirtual, TreeSelectVirtual, TreeVirtual } from 'aheart-ui'
const treeVirtual: TreeVirtual = { height: 320, estimateSize: 28, overscan: 4 } // D4-POSITIVE-VIRTUAL-TYPES TreeVirtual TreeSelectVirtual CascaderVirtual
const treeSelectVirtual: TreeSelectVirtual = { height: 256, estimateSize: 28, overscan: 4 }
const cascaderVirtual: CascaderVirtual = { height: 256, estimateSize: 32, overscan: 4 }
h(Tree, { virtual: true }) // D4-POSITIVE-TREE
h(Tree, { virtual: treeVirtual }) // D4-POSITIVE-TREE-CONFIG
h(TreeSelect, { virtual: treeSelectVirtual }) // D4-POSITIVE-TREESELECT
h(Cascader, { virtual: cascaderVirtual }) // D4-POSITIVE-CASCADER
// @ts-expect-error D4-NEGATIVE-TREE height estimateSize overscan string
const invalidTreeConfig: TreeVirtual = { height: 'bad' }
// @ts-expect-error D4-NEGATIVE-TREESELECT height estimateSize overscan string
const invalidTreeSelectConfig: TreeSelectVirtual = { estimateSize: 'bad' }
// @ts-expect-error D4-NEGATIVE-CASCADER height estimateSize overscan string
const invalidCascaderConfig: CascaderVirtual = { overscan: 'bad' }
void [invalidTreeConfig, invalidTreeSelectConfig, invalidCascaderConfig]
`
  const typeProbeFile = await artifact('types-probe.ts', typeProbeSource)
  const typeProbeConfig = await artifact('tsconfig.type-probe.json', `${JSON.stringify({ compilerOptions: { strict: true, noEmit: true, module: 'ESNext', moduleResolution: 'Bundler', target: 'ES2022', skipLibCheck: true }, include: ['types-probe.ts'] }, null, 2)}\n`)
  const command = 'corepack pnpm exec tsc --noEmit -p tsconfig.type-probe.json --pretty false'
  const line = marker => ({ name: marker, source: typeProbeSource.split('\n').find(item => item.includes(marker)) ?? '' })
  report.typeProbe = { typesPath: typeProbeFile.file, typesSha256: typeProbeFile.hash, configPath: typeProbeConfig.file, configSha256: typeProbeConfig.hash, command, commandSha256: sha256(Buffer.from(command)), tscExitCode: 0, positiveChecks: ['D4-POSITIVE-VIRTUAL-TYPES', 'D4-POSITIVE-TREE', 'D4-POSITIVE-TREE-CONFIG', 'D4-POSITIVE-TREESELECT', 'D4-POSITIVE-CASCADER'].map(line), negativeChecks: ['D4-NEGATIVE-TREE', 'D4-NEGATIVE-TREESELECT', 'D4-NEGATIVE-CASCADER'].map(line) }
  const ssrArtifactDirectory = path.join(artifactDirectory, 'ssr-snapshots')
  await mkdir(ssrArtifactDirectory, { recursive: true })
  for (const [index, [combinationKey, item]] of Object.entries(report.ssrHydration.combinations).entries()) {
    item.captureEvidence = []
    for (const [ordinal, snapshot] of [item.serverSnapshot, item.hydratedSnapshot].entries()) {
      const payload = `${JSON.stringify({ snapshot }, null, 2)}\n`
      const snapshotFile = await artifact(path.join('ssr-snapshots', `${String(index).padStart(2, '0')}-${ordinal + 1}.json`), payload)
      item.captureEvidence.push({ ordinal: ordinal + 1, combinationKey, phase: snapshot.capturePhase, nonce: snapshot.captureNonce, structureSha256: sha256(Buffer.from(JSON.stringify(snapshotStructureProjection(snapshot)))), path: snapshotFile.file, sha256: snapshotFile.hash })
    }
  }
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

test('full observer evidence validates all 270 measured rounds and derives metric support from raw entry types', async t => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  assert.equal(typeof contract.validateBrowserObserverEvidence, 'function', 'contract must expose a shared all-round observer validator')
  let ordinal = 0
  const rounds = []
  for (const component of ['Tree', 'TreeSelect', 'Cascader']) for (const count of [1000, 5000, 10000]) for (const rowMode of ['fixed', 'coarse', 'dynamic']) for (let round = 0; round < 5; round++) for (const mode of round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']) {
    ordinal += 1
    const startedAt = ordinal * 100
    rounds.push({
      ordinal,
      component,
      count,
      rowMode,
      mode,
      round,
      caseKey: `${component}/${count}/${rowMode}`,
      observerRunId: `observer-round-${ordinal}`,
      supportedEntryTypes: ['layout-shift', 'longtask', 'resource'],
      startedAt,
      firstWriteAt: startedAt + 1,
      lastWriteAt: startedAt + 50,
      takeRecordsAt: startedAt + 51,
      drainedAt: startedAt + 52,
      disconnectedAt: startedAt + 53,
      disconnected: true,
      activeAfterDrain: 0,
      scrollSteps: 40,
      runtimeErrors: [],
      longTasks: [{ startTime: startedAt + 20, duration: 10 }],
      layoutShifts: [{ startTime: startedAt + 30, value: 0.0001 }],
      resources: { scripts: ['assets/index.js'], styles: ['assets/style.css'] },
    })
  }
  const browserEvidence = {
    observerRounds: rounds,
    observersStartedBeforeFirstWrite: true,
    observersStoppedAfterFinal: true,
    observersStartedAt: rounds[0].startedAt,
    observersStoppedAt: rounds.at(-1).drainedAt,
    consoleErrors: 0,
    pageErrors: 0,
    runtimeErrors: [],
    scrollSteps: 40,
    supportedEntryTypes: ['layout-shift', 'longtask', 'resource'],
    resources: { status: 'recorded', scripts: ['assets/index.js'], styles: ['assets/style.css'] },
    longTasks: { status: 'recorded', maxMs: 10, entries: rounds.flatMap(item => item.longTasks) },
    layoutShifts: { status: 'recorded', cls: 0.0001, entries: rounds.flatMap(item => item.layoutShifts) },
  }
  const validate = evidence => {
    const failures = []
    contract.validateBrowserObserverEvidence(evidence, failures, { browser: 'chromium', required: true })
    return failures
  }
  assert.deepEqual(validate(browserEvidence), [], 'complete all-round observer evidence must pass')
  const coarseClockEvidence = structuredClone(browserEvidence)
  const coarseRound = coarseClockEvidence.observerRounds.at(-1)
  coarseRound.takeRecordsAt = coarseRound.lastWriteAt
  coarseRound.drainedAt = coarseRound.lastWriteAt
  coarseRound.disconnectedAt = coarseRound.lastWriteAt
  coarseClockEvidence.observersStoppedAt = coarseRound.drainedAt
  assert.deepEqual(validate(coarseClockEvidence), [], 'coarse browser clocks may report equal ordered take/drain/disconnect timestamps')
  const unsupportedEvidence = structuredClone(browserEvidence)
  unsupportedEvidence.supportedEntryTypes = ['resource']
  for (const round of unsupportedEvidence.observerRounds) {
    round.supportedEntryTypes = ['resource']
    round.longTasks = []
    round.layoutShifts = []
  }
  unsupportedEvidence.longTasks = { status: 'unsupported', reason: 'PerformanceObserver.supportedEntryTypes excludes longtask in this browser' }
  unsupportedEvidence.layoutShifts = { status: 'unsupported', reason: 'PerformanceObserver.supportedEntryTypes excludes layout-shift in this browser' }
  assert.deepEqual(validate(unsupportedEvidence), [], 'unsupported metrics must be accepted only when the raw browser entry types omit them')
  const mutations = [
    ['missing round', /270|round|coverage/i, evidence => { evidence.observerRounds.pop() }],
    ['duplicate observer run', /unique|duplicate|run/i, evidence => { evidence.observerRounds[1].observerRunId = evidence.observerRounds[0].observerRunId }],
    ['undisconnected round', /disconnect|active|drain/i, evidence => { evidence.observerRounds[10].disconnected = false; evidence.observerRounds[10].activeAfterDrain = 1 }],
    ['round runtime error', /runtime|console|page.*error/i, evidence => { evidence.observerRounds[20].runtimeErrors.push({ kind: 'console', message: 'boom' }) }],
    ['forged unsupported status', /support|unsupported|entry.*type/i, evidence => { evidence.longTasks = { status: 'unsupported', reason: 'hard-coded' } }],
    ['entry outside its round', /entry|timestamp|window/i, evidence => { evidence.observerRounds[30].longTasks[0].startTime = evidence.observerRounds[30].drainedAt + 1 }],
  ]
  for (const [label, pattern, mutate] of mutations) await t.test(label, () => {
    const evidence = structuredClone(browserEvidence)
    mutate(evidence)
    assert.ok(validate(evidence).some(failure => pattern.test(failure)), `observer mutation must be rejected: ${label}`)
  })
})

test('full collector persists every observer round and records actual PerformanceObserver support', async () => {
  const source = await deferredCollectorSource()
  assert.doesNotMatch(source, /\blastObservers\b/, 'collector must not retain only the last observer sample')
  assert.match(source, /observerRounds/, 'collector must persist all measured observer rounds')
  assert.match(source, /observerRunId/, 'each navigation must expose a unique observer run identity')
  assert.match(source, /supportedEntryTypes/, 'metric support must come from the active browser realm')
  assert.match(source, /runtimeErrors/, 'each observer round must bind its own console/page errors')
  assert.match(source, /summarizeBrowserObserverEvidence/, 'browser summaries must be derived from raw observer rounds')
  assert.match(source, /async function createMeasuredPage[\s\S]*await installPerformanceObserverProbe\(page\)/, 'every recycled browser page must install the same per-navigation observer probe')
  assert.match(source, /__d4StartObservers/, 'each measured scroll round must start a fresh observer window on demand')
  assert.match(source, /window\.__d4StartObservers\?\.\(\)[\s\S]*for \(let index = 0; index < 40; index\+\+\)/, 'observer window must start immediately before the forty scroll writes')
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

test('full release SSR/types contract rejects missing snapshots, actions, capture artifacts and public type probe', async t => {
  const mutations = [
    ['full SSR snapshots', report => {
      for (const item of Object.values(report.ssrHydration.combinations)) {
        delete item.serverSnapshot
        delete item.hydratedSnapshot
      }
    }, /full SSR snapshots/i],
    ['full SSR actions', report => {
      for (const item of Object.values(report.ssrHydration.combinations)) delete item.postHydrationActions
    }, /full SSR actions/i],
    ['full SSR capture evidence', report => {
      for (const item of Object.values(report.ssrHydration.combinations)) delete item.captureEvidence
    }, /full SSR capture evidence/i],
    ['full public type probe', report => { delete report.typeProbe }, /full public type probe/i],
  ]
  for (const [label, mutate, pattern] of mutations) {
    await t.test(label, () => {
      const control = fullSsrTypesControlReport()
      assert.doesNotThrow(() => validateReport(control), 'the complete synthetic SSR/types control fixture must pass before a single evidence class is removed')
      const report = structuredClone(control)
      mutate(report)
      for (const item of Object.values(report.ssrHydration.combinations)) {
        if (label !== 'full SSR snapshots') assert.ok(item.serverSnapshot && item.hydratedSnapshot, 'control fixture must retain server and hydrated snapshots')
        if (label !== 'full SSR actions') assert.ok(item.postHydrationActions?.length === 3, 'control fixture must retain three component actions')
        if (label !== 'full SSR capture evidence') assert.ok(item.captureEvidence?.length === 2, 'control fixture must retain two capture records')
      }
      if (label !== 'full public type probe') assert.ok(report.typeProbe, 'control fixture must retain the public type probe')
      assert.throws(() => validateReport(report), error => (error?.failures ?? []).some(failure => pattern.test(failure)), `full release must reject missing ${label}`)
    })
  }
})

test('full release remains full and reports all four missing SSR/types evidence classes together', () => {
  const report = fullSsrTypesControlReport()
  assert.doesNotThrow(() => validateReport(report), 'complete synthetic full control must pass before evidence removal')
  for (const item of Object.values(report.ssrHydration.combinations)) {
    delete item.serverSnapshot
    delete item.hydratedSnapshot
    delete item.postHydrationActions
    delete item.captureEvidence
  }
  delete report.typeProbe
  assert.match(report.runId, /^full-/)
  assert.throws(() => validateReport(report), error => {
    const failures = error?.failures ?? []
    return failures.some(failure => /full SSR snapshots/i.test(failure)) && failures.some(failure => /full SSR actions/i.test(failure)) && failures.some(failure => /full SSR capture evidence/i.test(failure)) && failures.some(failure => /full public type probe/i.test(failure))
  }, 'full validation must report all four missing SSR/types evidence classes')
})

test('full SSR semantic parity rejects malformed IDs, ARIA refs, selectors, actions and row windows', async t => {
  const mutations = [
    ['duplicate or unsorted SSR IDs', /sorted|unique|duplicate.*ID|ID.*order/i, report => {
      for (const item of Object.values(report.ssrHydration.combinations)) for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) snapshot.sortedIds = [snapshot.sortedIds[0], snapshot.sortedIds[0], ...snapshot.sortedIds.slice(1)]
    }],
    ['unrecorded ARIA reference', /ARIA|reference.*ID|unrecorded/i, report => {
      for (const item of Object.values(report.ssrHydration.combinations)) for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) snapshot.nodes[0].ariaControls = 'full-missing-id'
    }],
    ['wrong selector component pattern', /selector.*component pattern|selector identity/i, report => {
      for (const item of Object.values(report.ssrHydration.combinations)) for (const snapshot of [item.serverSnapshot, item.hydratedSnapshot]) { snapshot.nodes[0].selector = '.aheart-cascader__trigger'; snapshot.nodes[0].selectorProvenance.selector = snapshot.nodes[0].selector }
    }],
    ['wrong hydration action components', /actions|component/i, report => {
      for (const item of Object.values(report.ssrHydration.combinations)) item.postHydrationActions = item.postHydrationActions.map((action, index) => ({ ...action, component: `Wrong${index}` }))
    }],
    ['virtual initial row window over budget', /virtual initial row window exceeds limit/i, report => {
      for (const item of Object.values(report.ssrHydration.combinations)) if (item.virtual?.Tree === true) item.initialRowsByComponent.Tree = 25
    }],
  ]
  for (const [label, pattern, mutate] of mutations) await t.test(label, () => {
    const control = fullSsrTypesControlReport()
    assert.doesNotThrow(() => validateReport(control), 'complete synthetic parity control must pass before mutation')
    const report = structuredClone(control)
    mutate(report)
    assert.throws(() => validateReport(report), error => (error?.failures ?? []).some(failure => pattern.test(failure)), `full semantic parity must reject ${label}`)
  })
})

test('full collection reuses smoke SSR capture helper and returns candidate type probe', async () => {
  const source = await deferredCollectorSource()
  const file = ts.createSourceFile('collect.mjs', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findFunction = (root, name) => {
    let found
    const visit = node => {
      if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node
      ts.forEachChild(node, visit)
    }
    visit(root)
    assert.ok(found, `collector must declare ${name}`)
    return found
  }
  const descendants = (root, predicate) => {
    const found = []
    const visit = node => { if (predicate(node)) found.push(node); ts.forEachChild(node, visit) }
    visit(root)
    return found
  }
  const callName = node => ts.isIdentifier(node.expression) ? node.expression.text : ts.isPropertyAccessExpression(node.expression) ? node.expression.name.text : ''
  const assertCollectorFunction = (fn, label) => {
    const calls = descendants(fn.body, node => ts.isCallExpression(node) && callName(node) === 'collectHydratedSsrEvidence')
    assert.equal(calls.length, 1, `${label} must call collectHydratedSsrEvidence exactly once`)
    const call = calls[0]
    const tryStatement = descendants(fn.body, node => ts.isTryStatement(node) && call.pos >= node.tryBlock.pos && call.end <= node.tryBlock.end)[0]
    assert.ok(tryStatement, `${label} capture call must be inside a TryStatement.tryBlock`)
    const finallyText = tryStatement.finallyBlock ? source.slice(tryStatement.finallyBlock.pos, tryStatement.finallyBlock.end) : ''
    assert.match(finallyText, /browser\.close/, `${label} finally block must close browser`)
    assert.match(finallyText, /(?:server|httpServer).*\.close/, `${label} finally block must close server/httpServer`)
    const oldLoops = descendants(fn.body, node => ts.isForStatement(node) && /mask\s*<\s*8/.test(source.slice(node.expression?.pos ?? node.pos, node.expression?.end ?? node.end)) && /(page\.goto|__d4Hydrated|serverSnapshot)/.test(source.slice(node.statement.pos, node.statement.end)))
    assert.equal(oldLoops.length, 0, `${label} must not retain the old per-mask hydration loop`)
  }
  const smokeFn = findFunction(file, 'collectSmoke')
  const sideFn = findFunction(file, 'collectSide')
  assertCollectorFunction(smokeFn, 'smoke')
  assertCollectorFunction(sideFn, 'full collectSide')
  const sentinel = { marker: 'candidate-type-probe' }
  const shell = buildFullReportShell({ baseline: { packageManifest: { sha256: 'a'.repeat(64) } }, candidate: { packageManifest: { sha256: 'b'.repeat(64) }, typeProbe: sentinel }, baselineCommit: '4a7511f9594d0a74906e427e158d02343ba33a22', candidateCommit: 'candidate', runId: 'full-shell-test' })
  assert.equal(shell.typeProbe, sentinel, 'full report shell must preserve the candidate type probe sentinel')
})

test('bounded and full validation share one SSR semantic validator', async () => {
  const source = await readFile(path.join(process.cwd(), 'scripts/d4-deferred-consumer-contract.mjs'), 'utf8')
  const file = ts.createSourceFile('contract.mjs', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findFunction = name => {
    let found
    const visit = node => { if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node; ts.forEachChild(node, visit) }
    visit(file)
    assert.ok(found, `contract must declare ${name}`)
    return found
  }
  const countCalls = fn => {
    let count = 0
    const visit = node => { if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'validateSsrEvidence') count += 1; ts.forEachChild(node, visit) }
    visit(fn.body)
    return count
  }
  assert.ok(countCalls(findFunction('validateBoundedReleaseReport')) >= 1, 'bounded validation must call the shared SSR semantic validator within its own function body')
  assert.ok(countCalls(findFunction('validateReport')) >= 1, 'full validation must call the shared SSR semantic validator within its own function body')
})

test('hydration evidence mapping preserves non-zero runtime values across all combinations', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  assert.equal(typeof contract.applyHydrationEvidence, 'function', 'contract must export the shared hydration evidence mapper')
  const control = fullSsrTypesControlReport()
  const ssr = structuredClone(control.ssrHydration)
  const hydration = Object.fromEntries(Object.keys(ssr.combinations).map((key, index) => [index, { errors: index === 0 ? 2 : 1, warnings: index === 0 ? 3 : 1, interacted: true, postHydrationStateChanged: true, businessEventsAfterHydration: 4 + index, hydratedHtmlSha256: `hydrated-${index}`, hydratedIdSha256: `ids-${index}`, businessEventNames: ['Tree:change'], expandedChanged: true }]))
  const mapped = contract.applyHydrationEvidence(ssr, hydration)
  assert.strictEqual(mapped, ssr, 'hydration evidence mapper must mutate and return the same SSR object')
  assert.equal(ssr.combinations['Tree=false,TreeSelect=false,Cascader=false'].hydrationErrors, 2)
  assert.equal(ssr.combinations['Tree=false,TreeSelect=false,Cascader=false'].hydrationWarnings, 3)
  for (const [index, item] of Object.values(ssr.combinations).entries()) {
    assert.equal(item.interacted, true)
    assert.equal(item.postHydrationStateChanged, true)
    assert.equal(item.businessEventsAfterHydration, 4 + index)
    assert.equal(item.hydratedHtmlSha256, `hydrated-${index}`)
    assert.equal(item.hydratedIdSha256, `ids-${index}`)
  }
  const collector = await deferredCollectorSource()
  const file = ts.createSourceFile('collect.mjs', collector, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findFunction = name => {
    let found
    const visit = node => { if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node; ts.forEachChild(node, visit) }
    visit(file)
    assert.ok(found, `collector must declare ${name}`)
    return found
  }
  const callNames = fn => { const names = []; const visit = node => { if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) names.push(node.expression.text); ts.forEachChild(node, visit) }; visit(fn.body); return names }
  const helper = findFunction('collectHydratedSsrEvidence')
  const applyCalls = []
  const inspectApply = node => { if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'applyHydrationEvidence') applyCalls.push(node); ts.forEachChild(node, inspectApply) }
  inspectApply(helper.body)
  assert.ok(applyCalls.some(call => call.arguments.length >= 2 && ts.isIdentifier(call.arguments[0]) && call.arguments[0].text === 'ssr' && ts.isIdentifier(call.arguments[1]) && call.arguments[1].text === 'hydration'), 'hydration helper must call applyHydrationEvidence(ssr, hydration)')
  const sideFn = findFunction('collectSide')
  const sideText = collector.slice(sideFn.pos, sideFn.end)
  assert.doesNotMatch(sideText, /\bfullHydration\b/, 'collectSide must not retain an unused fullHydration result')
  const sideCalls = []
  const inspectSide = node => { if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'collectHydratedSsrEvidence') sideCalls.push(node); ts.forEachChild(node, inspectSide) }
  inspectSide(sideFn.body)
  assert.ok(sideCalls.some(call => call.arguments.some(argument => ts.isObjectLiteralExpression(argument) && argument.properties.some(property => ts.isPropertyAssignment(property) && property.name?.getText(file) === 'ssr' && ts.isIdentifier(property.initializer) && property.initializer.text === 'ssr'))), 'full collectSide must pass the shared ssr object to the hydration helper')
  assert.match(sideText, /ssrHydration:\s*ssr/, 'full collectSide must return the mutated shared ssr object')
})

test('contradictory preflight reports are ineligible and legal preflight shells stay non-acceptance', async t => {
  const mutations = [
    ['ordinary validation', false],
    ['release validation', true],
  ]
  for (const [label, requireRelease] of mutations) await t.test(label, () => {
    const report = structuredClone(fullSsrTypesControlReport())
    for (const item of Object.values(report.ssrHydration.combinations)) {
      delete item.serverSnapshot
      delete item.hydratedSnapshot
      delete item.postHydrationActions
      delete item.captureEvidence
    }
    delete report.typeProbe
    report.preflight = true
    report.acceptanceEligible = true
    report.benchmarkExecuted = false
    report.runId = 'preflight-contradictory-test'
    assert.throws(() => validateReport(report, { requireRelease }), error => (error?.failures ?? []).some(failure => /preflight.*ineligible|release.*preflight/i.test(failure)), `contradictory preflight must be rejected by ${label}`)
  })
  const sentinel = { marker: 'preflight-type-probe' }
  const shell = buildFullReportShell({ preflight: true, baseline: { packageManifest: { sha256: 'a'.repeat(64) } }, candidate: { packageManifest: { sha256: 'b'.repeat(64) }, typeProbe: sentinel }, baselineCommit: '4a7511f9594d0a74906e427e158d02343ba33a22', candidateCommit: 'candidate', runId: 'preflight-legal-test' })
  assert.equal(shell.acceptanceEligible, false)
  assert.equal(shell.benchmarkExecuted, false)
  assert.deepEqual(shell.iframe, { status: 'not-run' }, 'legal preflight shell must not contain success iframe placeholders')
})

test('iframe lifecycle validator rejects forged raw resource, popup, focus, unmount and late-loader evidence', async t => {
  const mutations = [
    ['resource balance/realm', /resource.*(active|balance)|residual|cleanup/i, report => { const events = report.iframe.rawLifecycle.scenarios[0].events; events.splice(events.findIndex(event => event.type === 'resource' && event.action === 'disconnect'), 1); events.forEach((event, index) => { event.seq = index + 1; event.time = index + 1 }) }],
    ['Teleport ownership/residual', /teleport|residual|ownerDocument/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'TreeSelect').events.find(event => event.type === 'popup-open'); event.ownerDocument = false }],
    ['parent document residual', /parent.*document|residual|teleport/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'TreeSelect').events.find(event => event.type === 'popup-open'); event.parentDocumentResidualNodes = 1 }],
    ['owner observation residual', /parent.*document|residual|teleport/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'TreeSelect').events.find(event => event.type === 'owner-observation'); event.parentDocumentResidualNodes = 1 }],
    ['focus restore/close', /focus|escape|popup/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'Cascader').events.find(event => event.type === 'focus-restore'); event.restored = false }],
    ['unmount ordering/frame alive', /unmount|frame|connected|order/i, report => { const event = report.iframe.rawLifecycle.scenarios[0].events.find(event => event.type === 'frame-unmount-invoked'); event.connected = false }],
    ['late update/hash', /late|lazy|hash|update/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'Cascader').events.find(event => event.type === 'lazy-resolve-after-unmount'); event.componentUpdateCount = 1 }],
    ['late DOM hash mismatch', /late|lazy|hash|dom/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'Cascader').events.find(event => event.type === 'lazy-resolve-after-unmount'); event.domHashAfterSha256 = 'changed' }],
    ['post-unmount mutation', /post|mutation|update/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'Cascader').events.find(event => event.type === 'post-unmount-pointer'); event.mutationCount = 1 }],
    ['post-unmount consumed', /post|consum/i, report => { const event = report.iframe.rawLifecycle.scenarios.find(scenario => scenario.component === 'Cascader').events.find(event => event.type === 'post-unmount-escape'); event.consumed = true }],
    ['summary-only mutation', /summary|recompute|raw/i, report => { report.iframe.rawLifecycle.summary.createdBeforeUnmount = 0 }],
    ['events empty with successful summary', /events|lifecycle|recompute/i, report => { report.iframe.rawLifecycle.scenarios[0].events = [] }],
    ['raw lifecycle missing', /iframe|lifecycle|raw/i, report => { delete report.iframe.rawLifecycle }],
  ]
  for (const [label, pattern, mutate] of mutations) await t.test(label, () => {
    const control = iframeControlReport()
    assert.doesNotThrow(() => validateReport(control), 'complete iframe control must pass before mutation')
    const forged = structuredClone(control)
    mutate(forged)
    assert.throws(() => validateReport(forged), error => (error?.failures ?? []).some(failure => pattern.test(failure)), `iframe mutation must be rejected: ${label}`)
  })
})

test('iframe raw lifecycle uses one recomputable summary and dedicated validator', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  const control = iframeControlReport()
  assert.equal(typeof contract.recomputeIframeLifecycle, 'function', 'contract must export recomputeIframeLifecycle')
  const expected = contract.recomputeIframeLifecycle(control.iframe.rawLifecycle)
  const withoutSummary = structuredClone(control.iframe.rawLifecycle)
  delete withoutSummary.summary
  assert.deepEqual(contract.recomputeIframeLifecycle(withoutSummary), expected)
  const forgedSummary = structuredClone(control.iframe.rawLifecycle)
  forgedSummary.summary.createdBeforeUnmount = 0
  assert.deepEqual(contract.recomputeIframeLifecycle(forgedSummary), expected)
  assert.deepEqual(control.iframe.rawLifecycle.summary, expected)
  const source = await deferredCollectorSource()
  const file = ts.createSourceFile('contract.mjs', await readFile(path.join(process.cwd(), 'scripts/d4-deferred-consumer-contract.mjs'), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findFunction = name => { let found; const visit = node => { if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node; ts.forEachChild(node, visit) }; visit(file); assert.ok(found, `contract must declare ${name}`); return found }
  const countCalls = fn => { let count = 0; const visit = node => { if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'validateIframeEvidence') count += 1; ts.forEachChild(node, visit) }; visit(fn.body); return count }
  assert.ok(countCalls(findFunction('validateReport')) >= 1, 'full validator must call validateIframeEvidence in its own function body')
  assert.ok(countCalls(findFunction('validateBoundedReleaseReport')) >= 1, 'bounded validator must call validateIframeEvidence in its own function body')
  assert.match(source, /collectHydratedSsrEvidence/, 'collector must retain shared hydration helper')
})

test('iframe raw resource completion, probe locking and late hashes are recomputed from events', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  const control = iframeControlReport()
  assert.equal(typeof contract.recomputeIframeLifecycle, 'function')
  const controlSummary = contract.recomputeIframeLifecycle(control.iframe.rawLifecycle)
  const controlScenario = control.iframe.rawLifecycle.scenarios[0]
  assert.ok(controlScenario.events.findIndex(event => event.type === 'frame-unmount-complete') < controlScenario.events.findIndex(event => event.type === 'owner-observation') && controlScenario.events.findIndex(event => event.type === 'owner-observation') < controlScenario.events.findIndex(event => event.type === 'frame-removed'))
  assert.equal(controlSummary.activeAfterUnmount, 0)
  assert.ok(controlSummary.byKind, 'recomputed iframe summary must expose per-kind resource balance')
  assert.equal(controlSummary.byKind.resizeObserver, 0)
  const forged = structuredClone(control.iframe.rawLifecycle)
  const scenario = forged.scenarios[0]
  const unmount = scenario.events.findIndex(event => event.type === 'frame-unmount-complete')
  for (const event of scenario.events.filter(event => event.type === 'resource' && event.kind === 'resizeObserver' && ['create', 'observe', 'unobserve'].includes(event.action))) event.resourceId = 'ro-1'
  scenario.events = scenario.events.filter(event => !(event.type === 'resource' && event.kind === 'resizeObserver' && event.action === 'disconnect'))
  scenario.events.splice(unmount + 1, 0, { type: 'resource', kind: 'resizeObserver', action: 'disconnect', resourceId: 'ro-1', targetSelector: '.secondary-root', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId })
  scenario.events.forEach((event, index) => { event.seq = index + 1; event.time = (index + 1) * 10 })
  const forgedSummary = contract.recomputeIframeLifecycle(forged)
  assert.equal(forgedSummary.activeAfterUnmount, 1)
  assert.equal(forgedSummary.byKind.resizeObserver, 1)
  assert.equal(forgedSummary.finalActive, 0)
  assert.equal(forgedSummary.unmountCleanup, false)
  const source = await deferredCollectorSource()
  assert.match(source, /Object\.defineProperty[\s\S]*writable:\s*false[\s\S]*configurable:\s*false/, 'iframe probes must lock original API properties')
  assert.match(source, /probeMarker/, 'iframe probe must validate a marker rather than silently returning')
  assert.match(source, /original(?:ResizeObserver|RequestAnimationFrame|SetTimeout|SetInterval)/, 'iframe probe must retain original owner-realm APIs')
})

test('iframe probe source preserves owner APIs, focus measurement and non-silent proxy installation', async () => {
  const source = await deferredCollectorSource()
  const file = ts.createSourceFile('collect.mjs', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findFunction = name => { let found; const visit = node => { if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node; ts.forEachChild(node, visit) }; visit(file); assert.ok(found, `collector must declare ${name}`); return found }
  const iframeFn = findFunction('iframeProbe')
  const iframeText = source.slice(iframeFn.pos, iframeFn.end)
  const escapeAt = iframeText.indexOf("key: 'Escape'")
  const focusAt = iframeText.indexOf('focus-restore')
  assert.ok(escapeAt >= 0 && focusAt > escapeAt)
  assert.doesNotMatch(iframeText.slice(escapeAt, focusAt), /\.focus\(|locator\.focus\(/, 'Escape to focus-restore measurement must not force focus')
  const installFn = (() => { let found; const visit = node => { if (ts.isFunctionDeclaration(node) && node.name?.text === 'installIframeLifecycleProbe') found = node; ts.forEachChild(node, visit) }; visit(file); return found })()
  assert.ok(installFn, 'collector must expose a dedicated iframe lifecycle probe installer')
  const installText = source.slice(installFn.pos, installFn.end)
  assert.doesNotMatch(installText, /withCollector|exclusionDepth/, 'probe must not suppress records across async waits')
  assert.match(installText, /Object\.defineProperty\(window,\s*['"]__d4IframeLifecycleProbe['"][\s\S]*writable:\s*false[\s\S]*configurable:\s*false/)
  assert.match(installText, /probeMarker[\s\S]*(?:throw|Error)/, 'existing probe marker mismatch must fail explicitly')
  assert.match(installText, /original(?:ResizeObserver|RequestAnimationFrame|SetTimeout|SetInterval)/, 'probe must retain original owner APIs')
  assert.match(installText, /observe[\s\S]*targets|targets[\s\S]*observe/, 'ResizeObserver proxy must track observed targets')
  assert.match(installText, /unobserve[\s\S]*targets|targets[\s\S]*unobserve/, 'ResizeObserver proxy must remove only one target')
  assert.match(installText, /disconnect[\s\S]*targets|targets[\s\S]*disconnect/, 'ResizeObserver disconnect must clear target state')
})

test('iframe ResizeObserver target state distinguishes unobserve from disconnect', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  const control = iframeControlReport().iframe.rawLifecycle
  assert.equal(typeof contract.recomputeIframeLifecycle, 'function')
  const raw = structuredClone(control)
  const scenario = raw.scenarios[0]
  scenario.events = [
    { seq: 1, time: 1, type: 'instrumentation-install', scenarioId: scenario.scenarioId, realmId: scenario.realmId, proxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedProxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedBeforeMount: true, collectorWaitsExcluded: true, realmType: 'iframe', propertyLocked: true, probeMarker: 'd4-iframe-probe-v1' },
    { seq: 2, time: 2, type: 'frame-mounted', scenarioId: scenario.scenarioId, realmId: scenario.realmId, connected: true },
    { seq: 3, time: 3, type: 'resource', kind: 'resizeObserver', action: 'create', resourceId: 'ro-1', targetSelector: '.a', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId },
    { seq: 4, time: 4, type: 'resource', kind: 'resizeObserver', action: 'observe', resourceId: 'ro-1', targetSelector: '.a', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId },
    { seq: 5, time: 5, type: 'resource', kind: 'resizeObserver', action: 'unobserve', resourceId: 'ro-1', targetSelector: '.a', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId },
    { seq: 6, time: 6, type: 'resource', kind: 'resizeObserver', action: 'observe', resourceId: 'ro-1', targetSelector: '.b', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId },
    { seq: 7, time: 7, type: 'frame-unmount-invoked', scenarioId: scenario.scenarioId, realmId: scenario.realmId, connected: true },
    { seq: 8, time: 8, type: 'frame-unmount-complete', scenarioId: scenario.scenarioId, realmId: scenario.realmId, connected: true },
    { seq: 9, time: 9, type: 'resource', kind: 'resizeObserver', action: 'disconnect', resourceId: 'ro-1', targetSelector: '.b', source: 'component-runtime', scenarioId: scenario.scenarioId, realmId: scenario.realmId },
    { seq: 10, time: 10, type: 'owner-flush', scenarioId: scenario.scenarioId, realmId: scenario.realmId, domResidualNodes: 0, teleportResidualNodes: 0, resourceResiduals: 0 },
    { seq: 11, time: 11, type: 'frame-removed', scenarioId: scenario.scenarioId, realmId: scenario.realmId, connected: false },
  ]
  const summary = contract.recomputeIframeLifecycle(raw)
  assert.equal(summary.byKind.resizeObserver, 1)
  assert.equal(summary.finalActive, 0)
  assert.equal(summary.unmountCleanup, false)
})

test('iframe resource model treats ResizeObserver unobserve as target state and allows re-observe', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  const control = iframeControlReport().iframe.rawLifecycle
  const baseScenario = structuredClone(control.scenarios[0])
  const makeRaw = events => ({ ...structuredClone(control), scenarios: [{ ...baseScenario, events }] })
  const event = (seq, type, fields = {}) => ({ seq, time: seq, type, scenarioId: baseScenario.scenarioId, realmId: baseScenario.realmId, ...fields })
  const resource = (seq, action, targetSelector) => event(seq, 'resource', { kind: 'resizeObserver', action, resourceId: 'ro-targets', targetSelector, source: 'component-runtime' })
  const lifecycle = (resourceEvents = []) => [
    event(1, 'instrumentation-install', { proxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedProxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedBeforeMount: true, collectorWaitsExcluded: true, realmType: 'iframe', propertyLocked: true, probeMarker: 'd4-iframe-probe-v1' }),
    event(2, 'frame-mounted', { connected: true }),
    ...resourceEvents,
    event(7, 'frame-unmount-invoked', { connected: true }),
    event(8, 'frame-unmount-complete', { connected: true }),
    event(9, 'owner-flush', { domResidualNodes: 0, teleportResidualNodes: 0, resourceResiduals: 0 }),
    event(10, 'owner-observation', { domResidualNodes: 0, teleportResidualNodes: 0, parentDocumentResidualNodes: 0, resourceResiduals: 0 }),
    event(11, 'frame-removed', { connected: false }),
  ]
  const noTarget = contract.recomputeIframeLifecycle(makeRaw(lifecycle([
    resource(3, 'create', '.a'),
    resource(4, 'observe', '.a'),
    resource(5, 'unobserve', '.a'),
  ])))
  assert.equal(noTarget.byKind.resizeObserver, 0)
  assert.equal(noTarget.activeAfterUnmount, 0)
  const reobserved = contract.recomputeIframeLifecycle(makeRaw(lifecycle([
    resource(3, 'create', '.a'),
    resource(4, 'observe', '.a'),
    resource(5, 'unobserve', '.a'),
    resource(6, 'observe', '.b'),
  ])))
  assert.equal(reobserved.byKind.resizeObserver, 1)
  assert.equal(reobserved.activeAfterUnmount, 1)
})

test('iframe resource model rejects timeout creation after unmount completion', async () => {
  const contract = await import('./d4-deferred-consumer-contract.mjs')
  const control = iframeControlReport().iframe.rawLifecycle
  const scenario = structuredClone(control.scenarios[0])
  const event = (seq, type, fields = {}) => ({ seq, time: seq, type, scenarioId: scenario.scenarioId, realmId: scenario.realmId, ...fields })
  scenario.events = [
    event(1, 'instrumentation-install', { proxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedProxyKinds: ['resizeObserver', 'raf', 'timeout', 'interval'], installedBeforeMount: true, collectorWaitsExcluded: true, realmType: 'iframe', propertyLocked: true, probeMarker: 'd4-iframe-probe-v1' }),
    event(2, 'frame-mounted', { connected: true }),
    event(3, 'frame-unmount-invoked', { connected: true }),
    event(4, 'frame-unmount-complete', { connected: true }),
    event(5, 'resource', { kind: 'timeout', action: 'create', resourceId: 'timeout-late', targetSelector: '.component-root', source: 'component-runtime' }),
    event(6, 'owner-flush', { domResidualNodes: 0, teleportResidualNodes: 0, resourceResiduals: 1 }),
    event(7, 'owner-observation', { domResidualNodes: 0, teleportResidualNodes: 0, parentDocumentResidualNodes: 0, resourceResiduals: 1 }),
    event(8, 'frame-removed', { connected: false }),
  ]
  const summary = contract.recomputeIframeLifecycle({ ...structuredClone(control), scenarios: [scenario] })
  assert.equal(summary.byKind.timeout, 0)
  assert.equal(summary.finalActive, 1)
  assert.equal(summary.unmountCleanup, false)
})

test('full collector failure persistence keeps partial raw evidence and appends failure metadata', async () => {
  const source = await deferredCollectorSource()
  const fullBranch = source.slice(source.indexOf('\n} else {'))
  const failureBranch = fullBranch.slice(fullBranch.lastIndexOf('\n} catch (error) {'))
  assert.match(failureBranch, /readFile\(output/, 'full failure handling must reopen the partial raw report')
  assert.match(failureBranch, /validationFailures|failureEvidence/, 'full failure handling must append structured failure metadata')
  assert.match(failureBranch, /cases|performance|partial/i, 'full failure artifact must preserve partial raw evidence instead of replacing it with a summary')
})

test('full checkpoint index stays bounded and references compressed raw payload artifacts', async () => {
  const source = await deferredCollectorSource()
  const copyStart = source.indexOf('async function copyCheckpointEvidence')
  const copyEnd = source.indexOf('\nasync function verifyTarball', copyStart)
  const copySource = source.slice(copyStart, copyEnd)
  assert.ok(copyStart >= 0 && copyEnd > copyStart)
  assert.match(copySource, /raw-payload\.json\.gz/, 'large checkpoint payloads must be stored as gzip artifacts')
  assert.match(copySource, /rawPayloadGzipSha256|gzipSha256/, 'compressed checkpoint bytes must be hash-bound')
  assert.doesNotMatch(copySource, /return\s*\{[^}]*\brawPayload\s*[,}]/s, 'checkpoint descriptors must not return the raw JSON string inline')
  assert.doesNotMatch(copySource, /add\(details\.root\s*&&\s*path\.join\(details\.root,\s*['"]dist['"]\)/, 'immutable dist must not be copied into every checkpoint directory')
  const fullBranch = source.slice(source.indexOf('\n} else {'))
  assert.doesNotMatch(fullBranch, /rawPayload:\s*evidence\.rawPayload/, 'partial-report index must not duplicate raw checkpoint payloads')
})

test('full and virtual scroll evidence requires the same bounded viewport and real nonzero offsets', () => {
  const report = fullReport()
  assert.doesNotThrow(() => validateReport(report))
  const forged = structuredClone(report)
  for (const step of forged.cases['Tree/10000/dynamic'].full.scroll) {
    step.actualOffset = 0
    step.maxScrollOffset = 0
    step.viewportRect = { top: 0, bottom: 10000, height: 10000 }
    step.rowRects = Array.from({ length: 100 }, (_, index) => ({ top: 0, bottom: 10000, height: 10000, key: `row-${index}`, nextTickAt: step.timestamp, rafAt: [step.timestamp + 1, step.timestamp + 2] }))
    step.rowKeys = step.rowRects.map(row => row.key)
    step.rect = step.rowRects[0]
  }
  assert.throws(() => validateReport(forged), /scroll|viewport|geometry|offset|bounded/i)
})

test('collector bounds full-mode Tree viewport and serializes visible geometry only', async () => {
  const collector = await deferredCollectorSource()
  const fixture = await readFile(path.join(process.cwd(), 'docs/superpowers/experiments/d4-deferred-consumer/main.mjs'), 'utf8')
  assert.match(fixture, /aheart-tree[^`]*block-size:\s*320px[^`]*overflow-y:\s*auto/s, 'full and virtual Tree must share a 320px scroll viewport')
  assert.match(fixture, /aheart-tree-select__panel[^`]*\[role=["']tree["']\][^`]*block-size:\s*256px[^`]*overflow-y:\s*auto/s, 'full and virtual TreeSelect must share a 256px scroll viewport')
  assert.doesNotMatch(fixture, /nth-child\(10n\+1\)/, 'dynamic row identity must come from logical fixture data, not recycled DOM position')
  assert.match(collector, /evidenceRects\s*=\s*visibleRects/, 'collector must derive persisted geometry from visible rows')
  assert.doesNotMatch(collector, /rowRects:\s*rowRects\.map/, 'collector must not serialize every full-DOM row on every scroll step')
  assert.match(collector, /requestedOffset/, 'dynamic scroll evidence must preserve the requested pixel offset')
  assert.match(collector, /scrollAdjustment/, 'dynamic measurement scroll adjustments must be explicit')
})

test('Tree visual fixture contains wide trees inside its horizontal scroll owner', async () => {
  const fixture = await readFile(path.join(process.cwd(), 'docs/.vitepress/components/TreeVirtualFixture.vue'), 'utf8')
  assert.doesNotMatch(fixture, /class="tree-virtual-fixture__frame"\s+:style="treeStyle"/, 'fixed tree width on the frame leaks into the mobile document')
  assert.match(fixture, /<Tree[\s\S]*:style="\[treeStyle,\s*titleStyle\]"/, 'the wide Tree itself must sit inside the bounded overflow frame')
  assert.match(fixture, /\.tree-virtual-fixture__frame\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%[^}]*overflow-x:\s*auto/, 'grid min-content sizing must not let the wide Tree expand the mobile document')
})

test('full collector recycles instrumented pages between matrix cases', async () => {
  const source = await deferredCollectorSource()
  assert.match(source, /createMeasuredPage/, 'collector must centralize page instrumentation for every recycled page')
  assert.match(source, /recycleMeasuredPage/, 'collector must recycle pages between large matrix cases')
  assert.match(source, /page\s*=\s*await recycleMeasuredPage\(page,\s*browser/, 'Chromium must discard the hydration page before measurements')
  assert.match(source, /let otherPage\s*=\s*await createMeasuredPage\(other,\s*browserErrors\)/, 'Firefox and WebKit must start with a fully instrumented page')
  assert.doesNotMatch(source, /measureCaseWithContext\((?:page|otherPage),\s*settings,\s*mode\)/, 'recycled about:blank pages must not infer a null origin')
  assert.match(source, /measureCaseWithContext\(page,\s*settings,\s*mode,\s*base\)/, 'Chromium measurements must receive the explicit preview base URL')
  assert.match(source, /measureCaseWithContext\(otherPage,\s*settings,\s*mode,\s*base\)/, 'Firefox and WebKit measurements must receive the explicit preview base URL')
  assert.match(source, /recycleMeasuredBrowser/, 'long matrices must recycle the browser process between component families')
  assert.match(source, /recycleMeasuredBrowser\(page,\s*browser,\s*chromium/, 'Chromium must restart before the next matrix case')
  assert.match(source, /recycleMeasuredBrowser\(otherPage,\s*other,\s*Browser/, 'Firefox and WebKit must restart before the next matrix case')
  assert.match(source, /checkpoint\?\.\(['"]case['"][\s\S]{0,700}recycleMeasuredBrowser\(page,\s*browser,\s*chromium/, 'Chromium must restart after every completed matrix case')
  assert.match(source, /coverage\.push\([\s\S]{0,500}recycleMeasuredBrowser\(otherPage,\s*other,\s*Browser/, 'Firefox and WebKit must restart after every completed matrix case')
})

test('measureCase failures persist page readiness and resource diagnostics', async () => {
  const source = await deferredCollectorSource()
  assert.match(source, /collectMeasureFailureDiagnostics/, 'collector must capture diagnostics before discarding a failed page')
  assert.match(source, /document\.readyState/, 'failure diagnostics must identify document loading state')
  assert.match(source, /__d4Ready/, 'failure diagnostics must record whether the fixture reached ready')
  assert.match(source, /performance\.getEntriesByType\(['"]resource['"]\)/, 'failure diagnostics must record loaded production resources')
  assert.match(source, /appHtmlLength|appChildCount/, 'failure diagnostics must distinguish module load from Vue mount')
  assert.match(source, /measureCase[^`]*diagnostics=/s, 'the thrown failure must include the captured diagnostic payload')
})

test('dynamic-row action probes hit the visible row intersection, not a clipped row center', async () => {
  const source = await deferredCollectorSource()
  const measureStart = source.indexOf('async function measureCase(')
  const measureEnd = source.indexOf('\nasync function collectMeasureFailureDiagnostics', measureStart)
  const measureSource = source.slice(measureStart, measureEnd)
  assert.ok(measureStart >= 0 && measureEnd > measureStart)
  assert.doesNotMatch(measureSource, /rect\.top\s*\+\s*rect\.height\s*\/\s*2/, 'a tall clipped row center is not necessarily actionable')
  assert.match(measureSource, /Math\.max\(rect\.top,\s*viewport\.top\)/, 'hit probe must clamp to the visible top edge')
  assert.match(measureSource, /Math\.min\(rect\.bottom,\s*viewport\.bottom\)/, 'hit probe must clamp to the visible bottom edge')
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

test('Cascader test sources never depend on a developer or CI checkout path', async () => {
  const directory = new URL('../packages/components/src/cascader/__tests__/', import.meta.url)
  const entries = await import('node:fs/promises').then(({ readdir }) => readdir(directory, { withFileTypes: true }))
  const offenders = []
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.test.ts')) continue
    const source = await readFile(new URL(entry.name, directory), 'utf8')
    if (/\/Users\/[^/'"]+\/|\/home\/runner\/|[A-Za-z]:\\\\Users\\\\/u.test(source)) offenders.push(entry.name)
  }
  assert.deepEqual(offenders, [], 'tests must resolve fixtures from portable module or package paths instead of a machine checkout')
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
