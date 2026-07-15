import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { GENERATED_PATHS } from './check-generated.mjs'

const workflowSource = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
const generatedPaths = GENERATED_PATHS.join(' ')

const getStep = (name) =>
  workflowSource.match(new RegExp(`      - name: ${name}\\n[\\s\\S]*?(?=\\n      - name:|$)`))?.[0]

test('uploads tracked diffs and every untracked generated file on build gate failure', () => {
  const captureStep = getStep('Capture Build Diagnostics')
  const uploadStep = getStep('Upload Build Diagnostics')

  assert.ok(captureStep, 'Capture Build Diagnostics step is missing')
  assert.ok(uploadStep, 'Upload Build Diagnostics step is missing')
  assert.ok(
    captureStep.includes(
      `git diff -- ${generatedPaths} > test-results/generated-tracked.diff`
    ),
    'tracked generated diff capture is incomplete'
  )
  assert.ok(
    captureStep.includes(
      `git ls-files --others -- ${generatedPaths} > test-results/generated-untracked.txt`
    ),
    'untracked generated diagnostics must include ignored files'
  )
  assert.doesNotMatch(captureStep, /git ls-files[^\n]*--exclude-standard/)
  assert.match(uploadStep, /path: test-results\//)
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
  assert.match(uploadStep, /\n          path: test-results\/\n/)
  assert.match(uploadStep, /\n          if-no-files-found: warn(?:\n|$)/)
})
