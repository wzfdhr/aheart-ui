import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { pathToFileURL } from 'node:url'

const execFileAsync = promisify(execFile)
const jobPattern = /^qg5-cross-browser \((desktop|mobile|desktop-firefox|desktop-webkit|mobile-webkit)\)$/
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const retryGithubRequest = async (request, { attempts = 3, delayMs = 250 } = {}) => {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request()
    } catch (error) {
      lastError = error
      const status = Number(error.status)
      const transient = status === 429 || status >= 500 || !Number.isFinite(status)
      if (!transient || attempt === attempts) throw error
      await wait(delayMs * attempt)
    }
  }
  throw lastError
}

export const normalizeGithubRuns = (source, jobsByAttempt) => ({
  schemaVersion: 'qg5-master-stability.v1',
  runs: source.workflow_runs.map((run) => {
    const attempts = []
    for (let attempt = 1; attempt <= run.run_attempt; attempt += 1) {
      const jobs = jobsByAttempt.get(`${run.id}:${attempt}`) ?? []
      const projects = {}
      for (const job of jobs) {
        const project = job.name.match(jobPattern)?.[1]
        if (project) projects[project] = job.conclusion
      }
      attempts.push({
        attempt,
        conclusion: Object.keys(projects).length === 5 && Object.values(projects).every((value) => value === 'success') ? 'success' : 'failure',
        projects
      })
    }
    return {
      runId: run.id,
      workflow: run.name,
      branch: run.head_branch,
      event: run.event,
      sha: run.head_sha,
      createdAt: run.created_at,
      attempts
    }
  })
})

const ghPages = async (endpoint, query = {}) => {
  const args = ['api', '--paginate', '--slurp', '-X', 'GET', endpoint]
  for (const [name, value] of Object.entries(query)) args.push('-f', `${name}=${value}`)
  const { stdout } = await retryGithubRequest(() => execFileAsync('gh', args, { maxBuffer: 32 * 1024 * 1024 }))
  return JSON.parse(stdout)
}

const mapWithConcurrency = async (items, concurrency, worker) => {
  const results = new Array(items.length)
  let index = 0
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = index
      index += 1
      results[current] = await worker(items[current])
    }
  })
  await Promise.all(runners)
  return results
}

export const collectGithubRuns = async ({ repository, expectedSha, limit = 20, request = ghPages, concurrency = 4 }) => {
  if (!/^[0-9a-f]{40}$/.test(expectedSha ?? '')) throw new Error('expectedSha must be a full 40-character SHA')
  const runPages = await request(`repos/${repository}/actions/workflows/ci.yml/runs`, { branch: 'master', per_page: 100 })
  const workflowRuns = runPages.flatMap((page) => page.workflow_runs ?? [])
    .filter((run) => run.head_sha === expectedSha)
    .slice(0, limit)
  const source = { workflow_runs: workflowRuns }
  const jobsByAttempt = new Map()
  await mapWithConcurrency(source.workflow_runs, concurrency, async (run) => {
    for (let attempt = 1; attempt <= run.run_attempt; attempt += 1) {
      const pages = await request(`repos/${repository}/actions/runs/${run.id}/attempts/${attempt}/jobs`, { per_page: 100 })
      jobsByAttempt.set(`${run.id}:${attempt}`, pages.flatMap((page) => page.jobs ?? []))
    }
  })
  return normalizeGithubRuns(source, jobsByAttempt)
}

const runCli = async () => {
  const repositoryIndex = process.argv.indexOf('--repository')
  const shaIndex = process.argv.indexOf('--sha')
  const repository = repositoryIndex >= 0 ? process.argv[repositoryIndex + 1] : process.env.GITHUB_REPOSITORY
  const expectedSha = shaIndex >= 0 ? process.argv[shaIndex + 1] : undefined
  if (!repository || !expectedSha) throw new Error('usage: node scripts/qg5-master-stability.collect.mjs --repository <owner/repo> --sha <master-sha>')
  process.stdout.write(`${JSON.stringify(await collectGithubRuns({ repository, expectedSha }), null, 2)}\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli().catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 2
  })
}
