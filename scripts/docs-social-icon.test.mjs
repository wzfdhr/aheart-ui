import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const configPath = resolve('docs/.vitepress/config.ts')
const iconPath = resolve('docs/public/github.svg')

test('docs GitHub social icon is local, labelled, and non-empty', () => {
  const config = readFileSync(configPath, 'utf8')
  const icon = readFileSync(iconPath, 'utf8')
  assert.match(config, /githubSvg\s*=\s*fs\.readFileSync\(/)
  assert.match(config, /icon:\s*\{\s*svg:\s*githubSvg\s*\}/)
  assert.match(config, /ariaLabel:\s*['"]GitHub['"]/)
  assert.match(icon, /^<svg\b[\s\S]*<path\b[\s\S]*<\/svg>\s*$/)
  assert.ok(icon.includes('fill="currentColor"'))
})
