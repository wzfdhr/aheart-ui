import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { GENERATED_PATHS } from './check-generated.mjs'

const workflowSource = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
const qualityPlanSource = readFileSync(
  new URL('../docs/superpowers/plans/2026-07-15-full-functional-quality-plan.md', import.meta.url),
  'utf8'
)
const workspacePackage = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)
const generatedPaths = GENERATED_PATHS.join(' ')
const workspacePnpmVersion = workspacePackage.packageManager.match(/^pnpm@(.+)$/)?.[1]

const getStep = (name) =>
  workflowSource.match(new RegExp(`      - name: ${name}\\n[\\s\\S]*?(?=\\n      - name:|$)`))?.[0]

const qg5Job = workflowSource.slice(workflowSource.indexOf('  qg5-cross-browser:'))

test('uploads both tracked diff layers and build manifests on build gate failure', () => {
  const setupPnpmStep = getStep('Setup pnpm')
  const buildStep = getStep('Check Build Determinism and Generated Output')
  const captureStep = getStep('Capture Build Diagnostics')
  const uploadStep = getStep('Upload Build Diagnostics')

  assert.ok(workspacePnpmVersion, 'workspace packageManager must pin pnpm')
  assert.ok(setupPnpmStep, 'Setup pnpm step is missing')
  assert.match(setupPnpmStep, new RegExp(`\\n          version: ${workspacePnpmVersion}(?:\\n|$)`))
  assert.ok(buildStep, 'build determinism step is missing')
  assert.ok(captureStep, 'Capture Build Diagnostics step is missing')
  assert.ok(uploadStep, 'Upload Build Diagnostics step is missing')
  assert.match(buildStep, /\n        id: build_generated\n/)
  assert.match(
    captureStep,
    /\n        if: \$\{\{ failure\(\) && steps\.build_generated\.outcome == 'failure' \}\}\n/
  )
  assert.match(
    uploadStep,
    /\n        if: \$\{\{ failure\(\) && steps\.build_generated\.outcome == 'failure' \}\}\n/
  )
  assert.ok(
    captureStep.includes(
      `git diff --cached HEAD -- ${generatedPaths} > test-results/build-generated-diagnostics/generated-cached.diff`
    ),
    'HEAD-to-index generated diff capture is incomplete'
  )
  assert.ok(
    captureStep.includes(
      `git diff -- ${generatedPaths} > test-results/build-generated-diagnostics/generated-worktree.diff`
    ),
    'index-to-worktree generated diff capture is incomplete'
  )
  assert.ok(
    captureStep.includes(
      `git ls-files --others -- ${generatedPaths} > test-results/build-generated-diagnostics/generated-untracked.txt`
    ),
    'untracked generated diagnostics must include ignored files'
  )
  assert.doesNotMatch(captureStep, /git ls-files[^\n]*--exclude-standard/)
  assert.match(uploadStep, /path: test-results\/build-generated-diagnostics\//)

  const artifactName = uploadStep.match(/\n          name: ([^\n]+)/)?.[1]

  assert.ok(artifactName, 'build diagnostics artifact name is missing')
  assert.match(artifactName, /\$\{\{ github\.run_id \}\}/)
  assert.match(artifactName, /\$\{\{ github\.run_attempt \}\}/)
  assert.match(uploadStep, /\n          if-no-files-found: error(?:\n|$)/)
})

test('keeps the quality plan entry point aligned with the four-role gate', () => {
  const executionRequirement = qualityPlanSource.match(/^> \*\*执行要求：\*\*.*$/m)?.[0]

  assert.ok(executionRequirement, 'quality plan execution requirement is missing')
  assert.match(executionRequirement, /设计审核/)
  assert.match(executionRequirement, /开发经理/)
  assert.match(executionRequirement, /测试经理/)
  assert.match(executionRequirement, /产品经理/)
})

test('uploads uniquely named e2e artifacts only when end-to-end tests fail', () => {
  const e2eStep = getStep('End-to-End Tests')
  const uploadStep = getStep('Upload End-to-End Failure Artifacts')

  assert.ok(e2eStep, 'End-to-End Tests step is missing')
  assert.ok(uploadStep, 'Upload End-to-End Failure Artifacts step is missing')
  assert.match(e2eStep, /\n        id: e2e\n/)
  assert.match(
    uploadStep,
    /\n        if: \$\{\{ failure\(\) && steps\.e2e\.outcome == 'failure' \}\}\n/
  )
  assert.match(uploadStep, /\n        uses: actions\/upload-artifact@v4\n/)

  const artifactName = uploadStep.match(/\n          name: ([^\n]+)/)?.[1]

  assert.ok(artifactName, 'e2e artifact name is missing')
  assert.match(artifactName, /\$\{\{ github\.run_id \}\}/)
  assert.match(artifactName, /\$\{\{ github\.run_attempt \}\}/)
  assert.match(uploadStep, /\n          path: \|\n            test-results\/\n            playwright-report\/\n/)
  assert.match(uploadStep, /\n          if-no-files-found: warn(?:\n|$)/)
})

test('runs QG5 production specs in independent browser project shards', () => {
  assert.ok(qg5Job, 'QG5 cross-browser job is missing')
  assert.match(qg5Job, /fail-fast: false/)
  for (const project of ['desktop', 'mobile', 'desktop-firefox', 'desktop-webkit', 'mobile-webkit']) {
    assert.match(qg5Job, new RegExp(`\\n\\s+- ${project}(?:\\n|$)`))
  }
  assert.match(qg5Job, /cross-browser-production\.spec\.ts/)
  assert.match(qg5Job, /cross-browser-r1\.spec\.ts/)
  assert.match(qg5Job, /--project ["']?\$\{\{ matrix\.project \}\}["']?/)
})

test('always uploads per-project QG5 Playwright evidence with run identity', () => {
  assert.ok(qg5Job, 'QG5 cross-browser job is missing')
  const uploadStep = qg5Job.match(/      - name: Upload QG5[\s\S]*$/)?.[0]

  assert.ok(uploadStep, 'QG5 evidence upload step is missing')
  assert.match(uploadStep, /if: \$\{\{ always\(\) \}\}/)
  assert.match(uploadStep, /name: qg5-\$\{\{ matrix\.project \}\}-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/)
  assert.match(uploadStep, /playwright-report\//)
  assert.match(uploadStep, /test-results\//)
})
