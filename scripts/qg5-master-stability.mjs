import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const expectedQG5Projects = ['desktop', 'mobile', 'desktop-firefox', 'desktop-webkit', 'mobile-webkit']
export const qg5StabilityWindow = 10
export const qg5FlakyThreshold = 0.01

const validateAttempt = (run, attempt) => {
  if (!Number.isInteger(attempt?.attempt) || attempt.attempt < 1) throw new Error(`run ${run.runId} has an invalid attempt`)
  if (!['success', 'failure', 'cancelled', 'timed_out'].includes(attempt.conclusion)) {
    throw new Error(`run ${run.runId} attempt ${attempt.attempt} has an invalid conclusion`)
  }
  if (!attempt.projects || typeof attempt.projects !== 'object') throw new Error(`run ${run.runId} attempt ${attempt.attempt} has no project evidence`)
  for (const project of expectedQG5Projects) {
    if (!(project in attempt.projects)) throw new Error(`run ${run.runId} attempt ${attempt.attempt} project ${project} is missing`)
    if (!['success', 'failure', 'cancelled', 'timed_out'].includes(attempt.projects[project])) {
      throw new Error(`run ${run.runId} attempt ${attempt.attempt} project ${project} has an invalid conclusion`)
    }
  }
}

const validateFinalProjects = (run, attempt) => {
  for (const project of expectedQG5Projects) {
    if (!(project in attempt.projects)) throw new Error(`run ${run.runId} project ${project} is missing`)
    if (attempt.projects[project] !== 'success') throw new Error(`run ${run.runId} project ${project} must finish with success`)
  }
}

export const evaluateMasterStability = (evidence, { expectedSha } = {}) => {
  if (evidence?.schemaVersion !== 'qg5-master-stability.v1') throw new Error(`unsupported schemaVersion: ${evidence?.schemaVersion ?? 'missing'}`)
  if (!Array.isArray(evidence.runs)) throw new Error('runs must be an array')

  const eligible = evidence.runs
    .filter((run) => run.workflow === 'CI' && run.branch === 'master' && ['push', 'workflow_dispatch'].includes(run.event) && run.sha === expectedSha && Array.isArray(run.attempts) && run.attempts.length > 0)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))

  for (const run of eligible) {
    if (!Number.isFinite(Date.parse(run.createdAt))) throw new Error(`run ${run.runId} has an invalid createdAt`)
    if (!/^[0-9a-f]{40}$/.test(run.sha ?? '')) throw new Error(`run ${run.runId} has an invalid SHA`)
  }
  const uniqueIds = new Set(eligible.map((run) => run.runId))
  if (uniqueIds.size !== eligible.length) throw new Error('master stability evidence contains duplicate run IDs')
  if (eligible.length < qg5StabilityWindow) {
    throw new Error(`QG5 stability requires ${qg5StabilityWindow} eligible master runs; received ${eligible.length}`)
  }

  const window = eligible.slice(0, qg5StabilityWindow)
  const flakyRunIds = []
  for (const run of window) {
    const attempts = [...run.attempts].sort((left, right) => left.attempt - right.attempt)
    attempts.forEach((attempt) => validateAttempt(run, attempt))
    if (!attempts.every((attempt, index) => attempt.attempt === index + 1)) {
      throw new Error(`run ${run.runId} attempt numbers must be contiguous from 1`)
    }
    const finalAttempt = attempts.at(-1)
    validateFinalProjects(run, finalAttempt)
    if (finalAttempt.conclusion !== 'success') throw new Error(`run ${run.runId} final attempt must finish with success`)
    if (attempts.slice(0, -1).some((attempt) => attempt.conclusion !== 'success' || Object.values(attempt.projects).some((status) => status !== 'success'))) {
      flakyRunIds.push(run.runId)
    }
  }

  const flakyRate = flakyRunIds.length / qg5StabilityWindow
  if (flakyRate >= qg5FlakyThreshold) {
    throw new Error(`${flakyRunIds.length}/${qg5StabilityWindow} flaky runs = ${(flakyRate * 100).toFixed(2)}%; must be below ${(qg5FlakyThreshold * 100).toFixed(2)}%`)
  }

  return {
    ok: true,
    windowSize: qg5StabilityWindow,
    eligibleRuns: window.length,
    flakyRuns: flakyRunIds.length,
    flakyRate,
    threshold: qg5FlakyThreshold,
    runIds: window.map((run) => run.runId),
    flakyRunIds
  }
}

const runCli = async () => {
  const inputIndex = process.argv.indexOf('--input')
  const shaIndex = process.argv.indexOf('--sha')
  if (inputIndex < 0 || shaIndex < 0 || !process.argv[inputIndex + 1] || !process.argv[shaIndex + 1]) throw new Error('usage: node scripts/qg5-master-stability.mjs --input <evidence.json> --sha <master-sha>')
  const evidence = JSON.parse(await readFile(path.resolve(process.argv[inputIndex + 1]), 'utf8'))
  process.stdout.write(`${JSON.stringify(evaluateMasterStability(evidence, { expectedSha: process.argv[shaIndex + 1] }), null, 2)}\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    await runCli()
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}
