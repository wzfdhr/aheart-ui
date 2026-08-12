import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateMasterStability } from './qg5-master-stability.mjs'

const projects = ['desktop', 'mobile', 'desktop-firefox', 'desktop-webkit', 'mobile-webkit']

const makeRun = (index, overrides = {}) => ({
  runId: 1000 + index,
  workflow: 'CI',
  branch: 'master',
  event: 'push',
  sha: 'a'.repeat(40),
  createdAt: new Date(Date.UTC(2026, 7, 20 - index)).toISOString(),
  attempts: [{
    attempt: 1,
    conclusion: 'success',
    projects: Object.fromEntries(projects.map((project) => [project, 'success']))
  }],
  ...overrides
})

test('accepts ten consecutive healthy master runs with zero flaky reruns', () => {
  const evidence = {
    schemaVersion: 'qg5-master-stability.v1',
    runs: Array.from({ length: 10 }, (_, index) => makeRun(index))
  }
  const result = evaluateMasterStability(evidence, { expectedSha: evidence.runs[0].sha })
  assert.deepEqual(result, {
    ok: true,
    windowSize: 10,
    eligibleRuns: 10,
    flakyRuns: 0,
    flakyRate: 0,
    threshold: 0.01,
    runIds: Array.from({ length: 10 }, (_, index) => 1000 + index),
    flakyRunIds: []
  })
})

test('rejects an insufficient post-QG5 master window', () => {
  assert.throws(
    () => evaluateMasterStability({
      schemaVersion: 'qg5-master-stability.v1',
      runs: Array.from({ length: 9 }, (_, index) => makeRun(index))
    }, { expectedSha: makeRun(0).sha }),
    /requires 10 eligible master runs; received 9/
  )
})

test('rejects a run with a missing or failed browser project', () => {
  const missing = makeRun(0)
  delete missing.attempts[0].projects['mobile-webkit']
  assert.throws(
    () => evaluateMasterStability({
      schemaVersion: 'qg5-master-stability.v1',
      runs: [missing, ...Array.from({ length: 9 }, (_, index) => makeRun(index + 1))]
    }, { expectedSha: missing.sha }),
    /mobile-webkit.*missing/
  )

  const failed = makeRun(0)
  failed.attempts[0].projects['desktop-firefox'] = 'failure'
  assert.throws(
    () => evaluateMasterStability({
      schemaVersion: 'qg5-master-stability.v1',
      runs: [failed, ...Array.from({ length: 9 }, (_, index) => makeRun(index + 1))]
    }, { expectedSha: failed.sha }),
    /desktop-firefox.*success/
  )
})

test('counts a failed attempt followed by success as one flaky run', () => {
  const flaky = makeRun(0)
  flaky.attempts = [
    {
      attempt: 1,
      conclusion: 'failure',
      projects: Object.fromEntries(projects.map((project) => [project, project === 'mobile' ? 'failure' : 'success']))
    },
    {
      attempt: 2,
      conclusion: 'success',
      projects: Object.fromEntries(projects.map((project) => [project, 'success']))
    }
  ]
  assert.throws(
    () => evaluateMasterStability({
      schemaVersion: 'qg5-master-stability.v1',
      runs: [flaky, ...Array.from({ length: 9 }, (_, index) => makeRun(index + 1))]
    }, { expectedSha: flaky.sha }),
    /1\/10 flaky runs.*10\.00%.*below 1\.00%/
  )
})

test('filters non-master and pre-QG5 runs instead of treating them as passing evidence', () => {
  const runs = Array.from({ length: 10 }, (_, index) => makeRun(index))
  runs[0].branch = 'codex/qg5-cross-browser-production'
  runs.push(makeRun(11, { attempts: [] }))
  assert.throws(
    () => evaluateMasterStability({ schemaVersion: 'qg5-master-stability.v1', runs }, { expectedSha: makeRun(0).sha }),
    /requires 10 eligible master runs; received 9/
  )
})

test('rejects incomplete historical attempts instead of hiding them as stable', () => {
  const runs = Array.from({ length: 10 }, (_, index) => makeRun(index))
  runs[0].attempts = [
    { attempt: 1, conclusion: 'success', projects: {} },
    runs[0].attempts[0]
  ]
  runs[0].attempts[1].attempt = 2
  assert.throws(
    () => evaluateMasterStability({ schemaVersion: 'qg5-master-stability.v1', runs }, { expectedSha: runs[0].sha }),
    /attempt 1.*desktop.*missing/
  )
})

test('only accepts runs for the expected master SHA', () => {
  const runs = Array.from({ length: 10 }, (_, index) => makeRun(index))
  assert.throws(
    () => evaluateMasterStability({ schemaVersion: 'qg5-master-stability.v1', runs }, { expectedSha: 'f'.repeat(40) }),
    /requires 10 eligible master runs; received 0/
  )
})

test('rejects duplicate or non-contiguous attempt numbers', () => {
  const runs = Array.from({ length: 10 }, (_, index) => makeRun(index))
  runs[0].attempts = [runs[0].attempts[0], { ...runs[0].attempts[0] }]
  assert.throws(
    () => evaluateMasterStability({ schemaVersion: 'qg5-master-stability.v1', runs }, { expectedSha: runs[0].sha }),
    /attempt numbers must be contiguous from 1/
  )

  runs[0].attempts[1].attempt = 3
  assert.throws(
    () => evaluateMasterStability({ schemaVersion: 'qg5-master-stability.v1', runs }, { expectedSha: runs[0].sha }),
    /attempt numbers must be contiguous from 1/
  )
})
