import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Read-only: bind changed runtime, tests, build outputs and public docs to one candidate.
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
const base = '3dc64ff1734004c2e51cc2a5e6a99a59c85ae1a2'
const paths = [...new Set([
  ...git('diff', '--name-only', base).split('\n'),
  ...git('ls-files', '--others', '--exclude-standard').split('\n')
])].filter((path) => /^(packages\/|e2e\/|docs\/components\/|docs\/superpowers\/experiments\/d4-c-consumer\/|pnpm-lock.yaml$|playwright.config.ts$|scripts\/)/.test(path)).sort()
const files = paths.map((path) => ({ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') }))
const sha256 = createHash('sha256').update(JSON.stringify({ base, files })).digest('hex')
console.log(JSON.stringify({ base, sha256, files }, null, 2))
