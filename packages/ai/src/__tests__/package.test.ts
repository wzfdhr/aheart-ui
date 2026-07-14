import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('@aheart-ui/ai package outputs', () => {
  it('publishes the declaration file referenced by its types entry', () => {
    const packagePath = resolve(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as {
      types: string
      exports: { '.': { types: string } }
    }
    expect(packageJson.exports['.'].types).toBe(`./${packageJson.types}`)
    expect(existsSync(resolve(process.cwd(), packageJson.types))).toBe(true)
  })
})
