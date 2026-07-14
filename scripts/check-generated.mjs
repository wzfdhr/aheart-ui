import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const generatedPaths = [
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

export const checkGeneratedOutput = () => {
  execFileSync('git', ['diff', '--exit-code', '--', ...generatedPaths], { stdio: 'inherit' })
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...generatedPaths], {
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
