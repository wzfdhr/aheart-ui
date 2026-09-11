import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'

const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) freeze(child)
  }
  return value
}

export const RELEASE_MATRIX = freeze({
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

export const PINNED_VERSIONS = freeze({
  node: '24.17.0',
  pnpm: '9.15.4',
  vue: '3.5.38',
  vite: '5.0.12',
  playwright: '1.61.1',
  typescript: '5.3.3',
})

export const COMPONENTS = freeze(['Tree', 'TreeSelect', 'Cascader'])
export const BROWSERS = freeze(['chromium', 'firefox', 'webkit'])
export const APPROVED_BASELINE_COMMIT = '4a7511f9594d0a74906e427e158d02343ba33a22'

const keyFor = (component, count, rowMode) => `${component}/${count}/${rowMode}`
const median = values => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const json = value => JSON.stringify(value)

function deterministicSeed(value) {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * The production fixture intentionally does not mirror any source-preview
 * fixture. It is a data generator for the packed consumer only: the actual
 * browser runner mounts these records through the public package API.
 */
export function generateTree(count, { expandedRoots = 100 } = {}) {
  assert(Number.isSafeInteger(count) && count >= 1)
  const nodes = []
  if (count === 10000) {
    for (let root = 0; root < expandedRoots; root++) {
      const rootKey = `tree-root-${root}`
      nodes.push({ key: rootKey, label: `Tree root ${root}`, children: Array.from({ length: 99 }, (_, child) => ({ key: `${rootKey}/child-${child}`, label: `Child ${root}.${child}` })) })
    }
    return nodes
  }
  const rootCount = Math.min(count, Math.max(1, Math.ceil(count / 20)))
  for (let root = 0; root < rootCount && nodes.length < count; root++) {
    const rootKey = `tree-${count}-root-${root}`
    nodes.push({ key: rootKey, label: `Tree ${count} root ${root}` })
  }
  return nodes
}

export function generateTreeSelect(count) {
  return { nodes: generateTree(count), checkable: true, query: `Tree ${count}` }
}

export function generateCascader(count) {
  const siblings = Array.from({ length: count }, (_, index) => ({ value: `cascade-${count}-sibling-${index}`, label: `Sibling ${index}` }))
  const columns = Array.from({ length: 5 }, (_, depth) => Array.from({ length: 2000 }, (_, index) => ({ value: `cascade-depth-${depth}-option-${index}`, label: `Depth ${depth} option ${index}` })))
  const searchLeaves = Array.from({ length: 10000 }, (_, index) => ({ path: [`search-${Math.floor(index / 100)}`, `leaf-${index}`], label: `Search leaf ${index}` }))
  return { siblings, columns, searchLeaves }
}

export function generateFixture(component, count, rowMode) {
  assert(COMPONENTS.includes(component))
  assert(RELEASE_MATRIX.counts.includes(count))
  assert(RELEASE_MATRIX.rowModes.includes(rowMode))
  const seed = deterministicSeed(`${component}:${count}:${rowMode}`)
  const rowHeight = rowMode === 'coarse' ? 44 : rowMode === 'dynamic' ? undefined : 28
  const rows = Array.from({ length: Math.min(count, 120) }, (_, index) => ({
    key: `${component.toLowerCase()}-${count}-${rowMode}-${index}`,
    label: rowMode === 'dynamic' && index % 10 === 0 ? `${component} row ${index} wrapped label ${seed}` : `${component} row ${index}`,
    expectedHeight: rowHeight ?? (index % 10 === 0 ? 56 : 28),
  }))
  return {
    component,
    count,
    rowMode,
    rows,
    data: component === 'Tree' ? generateTree(count) : component === 'TreeSelect' ? generateTreeSelect(count) : generateCascader(count),
    semantics: component === 'TreeSelect' ? { checkable: true, searchMatchesAtLeast: 5000 } : component === 'Cascader' ? { deepColumns: 5, searchLeaves: 10000 } : { expandedRoots: count === 10000 ? 100 : 0 },
  }
}

function packageManifest(label, packagePath) {
  const content = Buffer.from(`d4-${label}-manifest\n`)
  return {
    path: packagePath,
    exists: true,
    sha256: sha256(content),
    clean: true,
    symlinks: [],
    workspaceLinks: [],
    fsImports: [],
    files: ['dist/index.js', 'dist/index.cjs', 'dist/style.css', 'dist/index.d.ts'],
    esm: true,
    cjs: true,
    css: true,
    publicTypes: true,
    ssr: true,
    contentSha256Verified: true,
    tarballSha256Verified: true,
    sourceCommit: label === 'baseline' ? APPROVED_BASELINE_COMMIT : 'candidate-commit',
  }
}

function makeBundle(label, files) {
  return files.map((name, index) => {
    const content = Buffer.from(`d4-${label}-${name}-${index}\n`)
    const compressed = gzipSync(content, { level: 9 })
    return {
      path: name,
      contentBase64: content.toString('base64'),
      rawBytes: content.length,
      rawSha256: sha256(content),
      gzipBytes: compressed.length,
      gzipSha256: sha256(compressed),
    }
  })
}

function makeMode(component, count, rowMode, mode) {
  const base = mode === 'virtual' ? 90 + (count / 10000) * 20 : 300 + (count / 10000) * 70
  const samples = Array.from({ length: RELEASE_MATRIX.measuredRuns }, (_, index) => Math.round(base + ((index * 7 + deterministicSeed(`${component}/${rowMode}`)) % 9) - 4))
  const scroll = Array.from({ length: RELEASE_MATRIX.scrollSteps }, (_, index) => ({
    index,
    direction: index < 20 ? 'forward' : 'reverse',
    offset: index < 20 ? index / 19 : (39 - index) / 19,
    elapsedMs: mode === 'virtual' ? 2 + (index % 3) : 4 + (index % 5),
    mountedRows: mode === 'virtual' ? 18 + (index % 3) : count,
    noBlankGap: true,
    vueFlushed: true,
    animationFrames: 2,
    actualOffset: index < 20 ? index / 19 : (39 - index) / 19,
    timestamp: index + 1,
    rowKeys: [`${component}-${index}`],
    rect: { top: 10, bottom: 38, height: 28 },
  }))
  return {
    warmup: [{ firstInteractionMs: Math.round(base + 20), discarded: true }],
    measured: samples.map(firstInteractionMs => ({ firstInteractionMs })),
    medianMs: median(samples),
    maxRows: mode === 'virtual' ? 21 : count,
    actionableRows: mode === 'virtual' ? 20 : count,
    scroll,
  }
}

function makePerformance() {
  const firstInteraction = { full: {}, virtual: {} }
  const cases = {}
  for (const component of COMPONENTS) {
    firstInteraction.full[component] = {}
    firstInteraction.virtual[component] = {}
    for (const count of RELEASE_MATRIX.counts) {
      firstInteraction.full[component][count] = {}
      firstInteraction.virtual[component][count] = {}
      for (const rowMode of RELEASE_MATRIX.rowModes) {
        const full = makeMode(component, count, rowMode, 'full')
        const virtual = makeMode(component, count, rowMode, 'virtual')
        firstInteraction.full[component][count][rowMode] = { medianMs: full.medianMs }
        firstInteraction.virtual[component][count][rowMode] = { medianMs: virtual.medianMs }
        cases[keyFor(component, count, rowMode)] = {
          component,
          count,
          rowMode,
          alternatingOrder: ['full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual'],
          full,
          virtual,
        }
      }
    }
  }
  return { firstInteraction, cases }
}

function makeBrowsers() {
  return {
    chromium: { browserVersion: 'Chromium (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'recorded', maxMs: 42, entries: [{ startTime: 10, duration: 42 }] }, layoutShifts: { status: 'recorded', cls: 0.02, entries: [{ startTime: 10, value: 0.02 }] } },
    firefox: { browserVersion: 'Firefox (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'unsupported', reason: 'PerformanceObserver longtask is not exposed by this engine' }, layoutShifts: { status: 'unsupported', reason: 'PerformanceObserver layout-shift is not exposed by this engine' } },
    webkit: { browserVersion: 'WebKit (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'unsupported', reason: 'PerformanceObserver longtask is not exposed by this engine' }, layoutShifts: { status: 'unsupported', reason: 'PerformanceObserver layout-shift is not exposed by this engine' } },
  }
}

function makeSsr() {
  const combinations = {}
  for (let mask = 0; mask < 8; mask++) {
    const virtual = COMPONENTS.map((component, index) => [component, Boolean(mask & (1 << index))])
    const key = virtual.map(([component, enabled]) => `${component}=${enabled}`).join(',')
    combinations[key] = { virtual: Object.fromEntries(virtual), deterministic: true, hydrationWarnings: 0, hydrationErrors: 0, bounded: true }
  }
  return { combinations, count: 8, deterministicDoubleRender: true }
}

export function buildAcceptanceFixture({ baselinePackage, candidatePackage, generatedAt = new Date(0).toISOString(), smoke = false } = {}) {
  const performance = makePerformance()
  const baselineFiles = makeBundle('baseline', ['assets/tree.js', 'assets/tree-select.js', 'assets/cascader.js', 'assets/style.css'])
  const candidateFiles = makeBundle('candidate', ['assets/tree.js', 'assets/tree-select.js', 'assets/cascader.js', 'assets/style.css'])
  const total = files => files.reduce((sum, file) => sum + file.gzipBytes, 0)
  const baseline = packageManifest('baseline', baselinePackage ?? '/tmp/d4-baseline.tgz')
  const candidate = packageManifest('candidate', candidatePackage ?? '/tmp/d4-candidate.tgz')
  return {
    schema: 'd4-deferred-consumer/v1',
    generatedAt,
    acceptanceEligible: !smoke,
    smoke,
    syntheticEvidence: true,
    environment: { ...PINNED_VERSIONS, node: process.version === `v${PINNED_VERSIONS.node}` ? PINNED_VERSIONS.node : PINNED_VERSIONS.node, cpu: 'fixture', concurrency: 1 },
    matrix: RELEASE_MATRIX,
    fixtures: { deterministic: true, noSourcePreviewCopies: true, tree: { roots: 100, childrenPerRoot: 99, expandedRoots: 100 }, treeSelect: { sharedTree: true, checkable: true, queryMatches: 5000 }, cascader: { siblings: 10000, deepColumns: 5, optionsPerColumn: 2000, flattenedSearchLeaves: 10000 }, rowHeights: { fixed: 28, coarse: 44, dynamicEvery: 10 } },
    provenance: { baselineCommit: APPROVED_BASELINE_COMMIT, baselineCommitExpected: APPROVED_BASELINE_COMMIT, candidateCommit: 'candidate-commit', baselineTarballSha256: baseline.sha256, candidateTarballSha256: candidate.sha256, baselineCommitVerified: true, candidateCommitVerified: true },
    packages: { baseline, candidate, sameConsumer: true, installedWithoutWorkspaceLinks: true, lockfileDrift: false, newDependencies: [] },
    performance,
    browsers: makeBrowsers(),
    ssrHydration: makeSsr(),
    iframe: { sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0 },
    gzip: { level: 9, consumer: { components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild', entry: 'bundle-entry.mjs', config: { vite: PINNED_VERSIONS.vite, mode: 'production' }, moduleProvenance: true }, baseline: { files: baselineFiles, rawBytes: baselineFiles.reduce((sum, file) => sum + file.rawBytes, 0), gzipBytes: total(baselineFiles) }, candidate: { files: candidateFiles, rawBytes: candidateFiles.reduce((sum, file) => sum + file.rawBytes, 0), gzipBytes: total(candidateFiles) }, deltaBytes: total(candidateFiles) - total(baselineFiles), limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes },
    cases: performance.cases,
  }
}

export function buildSmokeReport({ baseline, candidate, generatedAt = new Date().toISOString(), smokeChecks = {}, note = 'Bounded package smoke only; release matrix was not executed.' } = {}) {
  return {
    schema: 'd4-deferred-consumer/v1',
    generatedAt,
    acceptanceEligible: false,
    smoke: true,
    syntheticEvidence: false,
    smokeReason: note,
    environment: { ...PINNED_VERSIONS, cpu: 'recorded by smoke runner', concurrency: 1 },
    matrix: RELEASE_MATRIX,
    fixtures: { deterministic: true, noSourcePreviewCopies: true, status: 'not-run' },
    provenance: { status: 'notRun', baselineCommit: null, candidateCommit: null, baselineTarballSha256: baseline?.sha256 ?? null, candidateTarballSha256: candidate?.sha256 ?? null },
    packages: { baseline: baseline ?? null, candidate: candidate ?? null, sameConsumer: 'notRun', installedWithoutWorkspaceLinks: 'notRun', lockfileDrift: 'notRun', newDependencies: 'notRun' },
    performance: { status: 'not-run', firstInteraction: null, cases: {} },
    browsers: { status: 'not-run' },
    ssrHydration: { status: 'not-run', count: 0, combinations: {} },
    iframe: { status: 'not-run' },
    gzip: { status: 'not-run', level: 9, deltaBytes: null, limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes },
    cases: {},
    smokeChecks,
  }
}

function expectedCaseKeys() {
  return COMPONENTS.flatMap(component => RELEASE_MATRIX.counts.flatMap(count => RELEASE_MATRIX.rowModes.map(rowMode => keyFor(component, count, rowMode))))
}

function ensure(condition, message, failures) {
  if (!condition) failures.push(message)
}

function recomputeMode(mode, path) {
  const samples = mode?.measured?.map(sample => sample.firstInteractionMs)
  if (!Array.isArray(samples) || samples.length !== RELEASE_MATRIX.measuredRuns || samples.some(value => !Number.isFinite(value))) return { errors: [`${path} measured samples must contain exactly five finite values`] }
  const errors = []
  ensure(mode.warmup?.length === RELEASE_MATRIX.warmupRuns && mode.warmup[0]?.discarded === true, `${path} must have one discarded warmup`, errors)
  ensure(mode.medianMs === median(samples), `${path} median is not recomputed from raw samples`, errors)
  ensure(samples.every(value => value > 0), `${path} measured timings must be positive`, errors)
  ensure(Array.isArray(mode.scroll) && mode.scroll.length === RELEASE_MATRIX.scrollSteps, `${path} must have forty scroll samples`, errors)
  if (Array.isArray(mode.scroll)) {
    ensure(mode.scroll.slice(0, 20).every(step => step.direction === 'forward'), `${path} must have twenty forward scroll steps`, errors)
    ensure(mode.scroll.slice(20).every(step => step.direction === 'reverse'), `${path} must have twenty reverse scroll steps`, errors)
    ensure(mode.scroll.every((step, index) => {
      const expected = index < 20 ? index / 19 : (39 - index) / 19
      return step.vueFlushed === true && step.animationFrames >= 2 && step.noBlankGap === true && Number.isFinite(step.offset) && Math.abs(step.offset - expected) < 1e-9 && Number.isFinite(step.actualOffset) && Number.isFinite(step.timestamp) && step.timestamp >= 0 && Array.isArray(step.rowKeys) && step.rowKeys.length > 0 && step.rect && Number.isFinite(step.rect.height) && step.rect.height > 0 && step.elapsedMs > 0 && step.mountedRows > 0 && (mode.maxRows > 24 || step.mountedRows <= RELEASE_MATRIX.maxVirtualRows)
    }), `${path} scroll steps must prove exact endpoints, positive timing and bounded mounted rows`, errors)
  }
  return { errors, medianMs: median(samples) }
}

export function recomputeEvidence(report) {
  const errors = []
  const firstInteraction = { full: {}, virtual: {} }
  for (const key of expectedCaseKeys()) {
    const item = report.cases?.[key]
    ensure(item, `missing matrix case ${key}`, errors)
    if (!item) continue
    ensure(JSON.stringify(item.alternatingOrder) === JSON.stringify(['full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual', 'full', 'virtual']), `${key} measured order is not alternating`, errors)
    for (const modeName of ['full', 'virtual']) {
      const result = recomputeMode(item[modeName], `${key}/${modeName}`)
      errors.push(...result.errors)
      firstInteraction[modeName][item.component] ??= {}
      firstInteraction[modeName][item.component][item.count] ??= {}
      firstInteraction[modeName][item.component][item.count][item.rowMode] = { medianMs: result.medianMs }
    }
  }
  const gzip = {}
  for (const side of ['baseline', 'candidate']) {
    const bundle = report.gzip?.[side]
    ensure(Array.isArray(bundle?.files) && bundle.files.length > 0, `${side} gzip evidence must list files`, errors)
    const files = bundle?.files ?? []
    const names = files.map(file => file.path)
    ensure(new Set(names).size === names.length, `${side} gzip evidence contains duplicate assets`, errors)
    ensure(names.some(name => name.endsWith('.js')) && names.some(name => name.endsWith('.css')) && names.some(name => name.includes('/')), `${side} gzip evidence must include recursive JS/CSS assets`, errors)
    ensure(names.every(name => /\.(?:js|css)$/.test(name) && !name.startsWith('/')), `${side} gzip evidence contains a non-JS/CSS asset`, errors)
    let rawBytes = 0, gzipBytes = 0
    for (const file of files) {
      const content = Buffer.from(file.contentBase64 ?? '', 'base64')
      const compressed = gzipSync(content, { level: 9 })
      ensure(file.rawBytes === content.length && file.rawSha256 === sha256(content), `${side}/${file.path} raw evidence hash mismatch`, errors)
      ensure(file.gzipBytes === compressed.length && file.gzipSha256 === sha256(compressed), `${side}/${file.path} gzip evidence hash mismatch`, errors)
      rawBytes += content.length
      gzipBytes += compressed.length
    }
    ensure(bundle?.rawBytes === rawBytes && bundle?.gzipBytes === gzipBytes, `${side} gzip totals are not recomputed from raw evidence`, errors)
    gzip[side] = { rawBytes, gzipBytes, files: files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }
  }
  gzip.deltaBytes = (gzip.candidate?.gzipBytes ?? 0) - (gzip.baseline?.gzipBytes ?? 0)
  return { firstInteraction, gzip, errors }
}

export function validateReport(report, { requireRelease = false, requireSmokeChecks = false } = {}) {
  if (report?.smoke === true && requireSmokeChecks) return validateSmokeReport(report)
  const failures = []
  if (requireRelease && (report?.smoke === true || report?.acceptanceEligible !== true)) {
    throw new Error('D4 deferred consumer contract failed: smoke, ineligible or synthetic provenance reports cannot pass release validation')
  }
  ensure(report?.schema === 'd4-deferred-consumer/v1', 'schema must be d4-deferred-consumer/v1', failures)
  ensure(report?.syntheticEvidence !== true || requireRelease !== true, 'synthetic fixture provenance cannot pass release validation', failures)
  ensure(report?.provenance?.baselineCommit === APPROVED_BASELINE_COMMIT && report?.provenance?.baselineCommitExpected === APPROVED_BASELINE_COMMIT && report?.provenance?.baselineCommitVerified === true && report?.provenance?.candidateCommitVerified === true, 'baseline/candidate commit provenance is missing or does not match the approved baseline', failures)
  ensure(report?.provenance?.baselineTarballSha256 === report?.packages?.baseline?.sha256 && report?.provenance?.candidateTarballSha256 === report?.packages?.candidate?.sha256, 'tarball hash provenance does not match package manifests', failures)
  ensure(report?.environment && JSON.stringify({ ...PINNED_VERSIONS }) === JSON.stringify(Object.fromEntries(Object.keys(PINNED_VERSIONS).map(key => [key, report.environment[key]]))), 'pinned Node/pnpm/Vue/Vite/Playwright/TypeScript versions are required', failures)
  ensure(typeof report.environment?.cpu === 'string' && report.environment.cpu.trim().length > 0, 'CPU model is required', failures)
  ensure(Number.isSafeInteger(report.environment?.concurrency) && report.environment.concurrency >= 1 && report.environment.concurrency <= 32, 'concurrency must be a positive bounded integer', failures)
  ensure(report?.matrix && JSON.stringify(report.matrix) === JSON.stringify(RELEASE_MATRIX), 'release matrix differs from the approved fixed matrix', failures)
  ensure(report?.fixtures?.deterministic === true && report.fixtures.noSourcePreviewCopies === true, 'fixtures must be deterministic and independent of source-preview fixture shapes', failures)
  ensure(report?.packages?.sameConsumer === true && report.packages.installedWithoutWorkspaceLinks === true, 'baseline and candidate must use the same consumer without workspace links', failures)
  ensure(report.packages.lockfileDrift === false && Array.isArray(report.packages.newDependencies) && report.packages.newDependencies.length === 0, 'consumer lockfile drift or new dependencies are not allowed', failures)
  for (const side of ['baseline', 'candidate']) {
    const pkg = report.packages?.[side]
    ensure(pkg?.clean === true, `${side} package must come from a clean manifest`, failures)
    ensure(pkg?.exists === true, `${side} tarball path must exist and be verified`, failures)
    ensure(pkg?.sha256 && pkg.sha256.length === 64, `${side} tarball SHA-256 is required`, failures)
    ensure(Array.isArray(pkg?.symlinks) && pkg.symlinks.length === 0, `${side} package contains symlinks`, failures)
    ensure(Array.isArray(pkg?.workspaceLinks) && pkg.workspaceLinks.length === 0, `${side} package contains workspace links`, failures)
    ensure(Array.isArray(pkg?.fsImports) && pkg.fsImports.length === 0, `${side} package contains @fs imports`, failures)
    for (const field of ['esm', 'cjs', 'css', 'publicTypes', 'ssr', 'contentSha256Verified', 'tarballSha256Verified']) ensure(pkg?.[field] === true, `${side} package is missing ${field} evidence`, failures)
    ensure(pkg?.sourceCommit === (side === 'baseline' ? APPROVED_BASELINE_COMMIT : report.provenance?.candidateCommit), `${side} package source commit provenance is missing`, failures)
  }
  const recomputed = recomputeEvidence(report)
  failures.push(...recomputed.errors)
  ensure(JSON.stringify(recomputed.firstInteraction) === JSON.stringify(report.performance?.firstInteraction), 'first interaction evidence differs from recomputed raw samples', failures)
  ensure(JSON.stringify(recomputed.gzip) === JSON.stringify({ baseline: report.gzip?.baseline && { rawBytes: report.gzip.baseline.rawBytes, gzipBytes: report.gzip.baseline.gzipBytes, files: report.gzip.baseline.files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }, candidate: report.gzip?.candidate && { rawBytes: report.gzip.candidate.rawBytes, gzipBytes: report.gzip.candidate.gzipBytes, files: report.gzip.candidate.files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }, deltaBytes: report.gzip?.deltaBytes }), 'gzip evidence differs from recomputed raw files', failures)
  for (const key of expectedCaseKeys()) {
    const item = report.cases?.[key]
    if (!item) continue
    const virtual = item.virtual
    ensure(virtual.maxRows <= RELEASE_MATRIX.maxVirtualRows && virtual.actionableRows <= RELEASE_MATRIX.maxVirtualRows, `${key} virtual window exceeds 24 actionable rows`, failures)
    ensure(virtual.medianMs <= RELEASE_MATRIX.maxFirstInteractionMs, `${key} virtual first interaction exceeds 500ms`, failures)
    if (item.count === 10000) ensure(virtual.medianMs <= item.full.medianMs * RELEASE_MATRIX.maxVirtualRatio, `${key} virtual median is above fifty percent of full path`, failures)
  }
  for (const browser of BROWSERS) {
    const item = report.browsers?.[browser]
    if (!item) {
      ensure(false, `${browser} browser evidence is missing`, failures)
      continue
    }
    ensure(item?.browserVersion, `${browser} browser build is missing`, failures)
    ensure(item?.ownerRealm === true && item.twoRaf === true && item.observersStartedBeforeFirstWrite === true && item.observersStoppedAfterFinal === true && item.scrollSteps === 40 && item.consoleErrors === 0 && item.pageErrors === 0, `${browser} scroll/realm/error observer contract is incomplete`, failures)
    ensure(Number.isFinite(item.observersStartedAt) && Number.isFinite(item.observersStoppedAt) && item.observersStoppedAt >= item.observersStartedAt, `${browser} observer lifecycle timestamps are missing`, failures)
    ensure(item.resources?.status === 'recorded' && item.resources.scripts?.length > 0 && item.resources.styles?.length > 0, `${browser} resource evidence is missing`, failures)
    if (browser === 'chromium') {
      ensure(item.longTasks?.status === 'recorded' && item.longTasks.maxMs <= RELEASE_MATRIX.maxLongTaskMs && Array.isArray(item.longTasks.entries) && item.longTasks.entries.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)), 'Chromium long-task observer is missing raw timestamp entries or over 100ms', failures)
      ensure(item.layoutShifts?.status === 'recorded' && item.layoutShifts.cls <= RELEASE_MATRIX.maxCls && Array.isArray(item.layoutShifts.entries) && item.layoutShifts.entries.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)), 'Chromium layout-shift observer is missing raw timestamp entries or over 0.1', failures)
    } else {
      ensure(item.longTasks?.status === 'unsupported' && item.longTasks.reason, `${browser} long-task metrics must be explicitly unsupported`, failures)
      ensure(item.layoutShifts?.status === 'unsupported' && item.layoutShifts.reason, `${browser} layout-shift metrics must be explicitly unsupported`, failures)
    }
  }
  ensure(report.ssrHydration?.count === 8 && Object.keys(report.ssrHydration.combinations ?? {}).length === 8 && report.ssrHydration.deterministicDoubleRender === true, 'SSR/hydration must cover eight deterministic boolean combinations', failures)
  const ssrItems = Object.values(report.ssrHydration?.combinations ?? {})
  ensure(new Set(ssrItems.map(item => JSON.stringify(item.virtual))).size === 8, 'SSR/hydration combinations must contain eight distinct false/true assignments', failures)
  for (const item of ssrItems) ensure(item.deterministic === true && item.hydrationWarnings === 0 && item.hydrationErrors === 0 && item.bounded === true, 'SSR/hydration combination has warnings, errors or unbounded output', failures)
  ensure(report.iframe?.sameOrigin === true && report.iframe.ownerDocument === true && report.iframe.focusTransfer === true && report.iframe.unmountCleanup === true && report.iframe.postUnmountInteractions === 0, 'same-origin iframe owner/focus/unmount evidence is incomplete', failures)
  ensure(report.gzip?.level === 9 && JSON.stringify(report.gzip.consumer) === JSON.stringify({ components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild', entry: 'bundle-entry.mjs', config: { vite: PINNED_VERSIONS.vite, mode: 'production' }, moduleProvenance: true }) && report.gzip?.deltaBytes <= RELEASE_MATRIX.maxGzipDeltaBytes, 'gzip level-9 consumer comparison or delta is invalid', failures)
  if (requireRelease) ensure(report.acceptanceEligible === true && report.smoke === false, 'smoke reports are not release eligible', failures)
  if (failures.length) {
    const error = new Error(`D4 deferred consumer contract failed: ${failures.join('; ')}`)
    error.failures = failures
    throw error
  }
  return { status: 'passed', acceptanceEligible: report.acceptanceEligible === true, failures: [] }
}

export function validateSmokeReport(report) {
  const failures = []
  ensure(report?.schema === 'd4-deferred-consumer/v1' && report.smoke === true && report.acceptanceEligible === false, 'smoke must be explicitly ineligible', failures)
  ensure(report.authenticEvidence === true && report.preview?.productionBuild === true && report.preview.absoluteNavigation === true && /^https?:\/\//.test(report.preview.baseURL ?? '') && Array.isArray(report.preview.errors) && report.preview.errors.length === 0, 'smoke must contain authentic production preview evidence', failures)
  ensure(Array.isArray(report.case?.scroll) && report.case.scroll.length === 40 && report.case.scroll.every(step => step.rect && Array.isArray(step.rowKeys) && step.rowRects?.length > 0 && step.viewportRect?.height > 0 && step.coverageComplete === true && Number.isFinite(step.timestamp)), 'smoke must collect one authentic forty-step geometry case', failures)
  const timing = report.case?.timing
  ensure(timing && timing.startedAt < timing.triggerAt && timing.triggerAt < timing.actionableAt && timing.actionableAt <= timing.nextTickAt && timing.nextTickAt <= timing.rafAt?.[0] && timing.rafAt?.[0] <= timing.rafAt?.[1] && timing.endAt === timing.rafAt?.[1] && timing.targetSelectorIncludesTrigger === false, 'smoke first-interaction timing is not ordered around actionable row, Vue nextTick and two owner-realm RAFs', failures)
  ensure(report.ssrHydration?.status === 'recorded' && report.ssrHydration.count === 8 && Object.keys(report.ssrHydration.combinations ?? {}).length === 8 && Object.values(report.ssrHydration.combinations).every(item => item.deterministic === true && item.cjsRender === true && (Object.values(item.virtual).every(value => value === false) || item.boundedRows <= 24) && item.hydrationErrors === 0 && item.hydrationWarnings === 0 && item.interacted === true && item.postHydrationStateChanged === true), 'smoke must record eight clean SSR/hydration cases', failures)
  ensure(report.iframe?.sameOrigin === true && report.iframe.ownerDocument === true && report.iframe.focusTransfer === true && report.iframe.popupReopened === true && report.iframe.resourceCounts?.before > 0 && report.iframe.resourceCounts?.after === 0 && report.iframe.unmountCleanup === true && report.iframe.postUnmountInteractions === 0, `smoke iframe popup/focus/resource/unmount evidence is incomplete: ${JSON.stringify(report.iframe)}`, failures)
  ensure(Array.isArray(report.packages?.candidate?.moduleRealpaths) && report.packages.candidate.moduleRealpaths.length > 0 && report.packages.candidate.afterHashes && report.packages.candidate.versions, 'smoke package realpath/version/after-hash evidence is missing', failures)
  ensure(report.packages?.candidate?.versions && JSON.stringify(report.packages.candidate.versions) === JSON.stringify({ ...PINNED_VERSIONS }), 'smoke consumer versions are not the pinned release versions', failures)
  ensure(report.case?.observers?.startedBeforeFirstWrite === true && report.case.observers.drainedAfterLastWrite === true && report.case.observers.disconnected === true && report.case.observers.rawRecomputed === true && report.case.observers.longTasks.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)) && report.case.observers.layoutShifts.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)), 'smoke observer evidence is not drained/raw/recomputed', failures)
  ensure(report.familyCoverage && Object.values(report.familyCoverage).every(item => item.realData && item.scenarios?.every(scenario => scenario.executed === true && scenario.eventCount > 0)), 'smoke family scenarios are not real executed records', failures)
  ensure(report.realEvidenceBinding?.tarballReopened === true && report.realEvidenceBinding.buildFingerprint?.before && report.realEvidenceBinding.buildFingerprint?.after && report.realEvidenceBinding.moduleFingerprint?.before === report.realEvidenceBinding.moduleFingerprint?.after, 'smoke evidence is not bound to reopened tarball/build/module fingerprints', failures)
  ensure(report.packages?.sameConsumer === 'notRun' && report.packages?.installedWithoutWorkspaceLinks === 'notRun', 'smoke must not claim installed same-consumer verification', failures)
  ensure(report.smokeChecks?.baselineExplicit === true && report.smokeChecks?.baselineAvailable === true, 'smoke requires an explicit available baseline', failures)
  for (const field of ['candidateRequiredFiles', 'candidateNoSymlink', 'candidateNoWorkspaceLinks', 'candidateNoFsImports', 'candidatePublicSurface']) ensure(report.smokeChecks?.[field] === true, `smoke package check failed: ${field}`, failures)
  if (failures.length) {
    const error = new Error(`D4 smoke contract failed: ${failures.join('; ')}`)
    error.failures = failures
    throw error
  }
  return { status: 'passed', acceptanceEligible: false, failures: [] }
}
