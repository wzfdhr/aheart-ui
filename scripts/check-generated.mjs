import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const GENERATED_PATHS = [
  'packages/components/es',
  'packages/components/lib',
  'packages/dnd/es',
  'packages/dnd/lib',
  'packages/ai/es',
  'packages/ai/lib'
]

export const assertNoUntrackedGeneratedFiles = (output) => {
  const files = output.trim()
  if (files) throw new Error(`Untracked generated files:\n${files}`)
}

const assertCleanDiff = (cwd, args, message) => {
  try {
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (error) {
    const output = [error.stdout, error.stderr]
      .filter((value) => typeof value === 'string' && value.trim())
      .join('\n')
      .trim()
    throw new Error(output ? `${message}:\n${output}` : message)
  }
}

export const checkGeneratedOutput = (cwd = process.cwd()) => {
  assertCleanDiff(
    cwd,
    ['diff', '--cached', '--exit-code', 'HEAD', '--', ...GENERATED_PATHS],
    'Generated output index differs from HEAD'
  )
  assertCleanDiff(
    cwd,
    ['diff', '--exit-code', '--', ...GENERATED_PATHS],
    'Generated output worktree differs from index'
  )
  const untracked = execFileSync('git', ['ls-files', '--others', '--', ...GENERATED_PATHS], {
    cwd,
    encoding: 'utf8'
  })
  assertNoUntrackedGeneratedFiles(untracked)
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  try {
    checkGeneratedOutput()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
