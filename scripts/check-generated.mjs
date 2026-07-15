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

export const checkGeneratedOutput = (cwd = process.cwd()) => {
  execFileSync('git', ['diff', '--exit-code', 'HEAD', '--', ...GENERATED_PATHS], { cwd, stdio: 'inherit' })
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
