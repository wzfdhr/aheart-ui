import assert from 'node:assert/strict'
import test from 'node:test'

import { collectGithubRuns, normalizeGithubRuns, retryGithubRequest } from './qg5-master-stability.collect.mjs'

const projectJobs = (status = 'success') => [
  'desktop',
  'mobile',
  'desktop-firefox',
  'desktop-webkit',
  'mobile-webkit'
].map((project) => ({ name: `qg5-cross-browser (${project})`, conclusion: status }))

test('normalizes GitHub workflow runs and preserves every attempt for flaky detection', () => {
  const source = {
    workflow_runs: [{
      id: 42,
      name: 'CI',
      head_branch: 'master',
      event: 'workflow_dispatch',
      head_sha: 'a'.repeat(40),
      created_at: '2026-08-12T00:00:00Z',
      run_attempt: 2
    }]
  }
  const jobsByAttempt = new Map([
    ['42:1', projectJobs().map((job) => job.name.includes('(mobile)') ? { ...job, conclusion: 'failure' } : job)],
    ['42:2', projectJobs()]
  ])

  assert.deepEqual(normalizeGithubRuns(source, jobsByAttempt), {
    schemaVersion: 'qg5-master-stability.v1',
    runs: [{
      runId: 42,
      workflow: 'CI',
      branch: 'master',
      event: 'workflow_dispatch',
      sha: 'a'.repeat(40),
      createdAt: '2026-08-12T00:00:00Z',
      attempts: [
        {
          attempt: 1,
          conclusion: 'failure',
          projects: {
            desktop: 'success',
            mobile: 'failure',
            'desktop-firefox': 'success',
            'desktop-webkit': 'success',
            'mobile-webkit': 'success'
          }
        },
        {
          attempt: 2,
          conclusion: 'success',
          projects: {
            desktop: 'success',
            mobile: 'success',
            'desktop-firefox': 'success',
            'desktop-webkit': 'success',
            'mobile-webkit': 'success'
          }
        }
      ]
    }]
  })
})

test('keeps missing QG5 project evidence observable instead of silently dropping a run', () => {
  const source = {
    workflow_runs: [{
      id: 43,
      name: 'CI',
      head_branch: 'master',
      event: 'push',
      head_sha: 'b'.repeat(40),
      created_at: '2026-08-13T00:00:00Z',
      run_attempt: 1
    }]
  }
  const jobsByAttempt = new Map([['43:1', [{ name: 'verify', conclusion: 'success' }]]])
  assert.deepEqual(normalizeGithubRuns(source, jobsByAttempt).runs[0].attempts[0].projects, {})
})

test('collects paginated runs and jobs while filtering to the requested master SHA', async () => {
  const targetSha = 'c'.repeat(40)
  const otherSha = 'd'.repeat(40)
  const requests = []
  const request = async (endpoint) => {
    requests.push(endpoint)
    if (endpoint.endsWith('/runs')) return [{ workflow_runs: [
      { id: 50, name: 'CI', head_branch: 'master', event: 'workflow_dispatch', head_sha: targetSha, created_at: '2026-08-14T00:00:00Z', run_attempt: 1 },
      { id: 51, name: 'CI', head_branch: 'master', event: 'workflow_dispatch', head_sha: otherSha, created_at: '2026-08-14T01:00:00Z', run_attempt: 1 }
    ] }]
    return [{ jobs: projectJobs().slice(0, 3) }, { jobs: projectJobs().slice(3) }]
  }

  const result = await collectGithubRuns({ repository: 'wzfdhr/aheart-ui', expectedSha: targetSha, request, concurrency: 2 })
  assert.equal(result.runs.length, 1)
  assert.equal(result.runs[0].runId, 50)
  assert.equal(Object.keys(result.runs[0].attempts[0].projects).length, 5)
  assert.equal(requests.some((endpoint) => endpoint.includes('/runs/51/')), false)
})

test('retries transient GitHub failures with a bounded attempt count', async () => {
  let attempts = 0
  const result = await retryGithubRequest(async () => {
    attempts += 1
    if (attempts < 3) {
      const error = new Error('temporary failure')
      error.status = 503
      throw error
    }
    return 'ok'
  }, { attempts: 3, delayMs: 0 })
  assert.equal(result, 'ok')
  assert.equal(attempts, 3)

  await assert.rejects(
    retryGithubRequest(async () => {
      const error = new Error('not found')
      error.status = 404
      throw error
    }, { attempts: 3, delayMs: 0 }),
    /not found/
  )
})
