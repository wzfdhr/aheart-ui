import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const configSource = readFileSync(new URL('../playwright.config.ts', import.meta.url), 'utf8')

test('forwards the exact docs host and port command to VitePress', () => {
  const command = configSource.match(/webServer:\s*\{[\s\S]*?command:\s*'([^']+)'/)?.[1]

  assert.equal(command, 'corepack pnpm --dir docs dev --host 127.0.0.1 --port 5173')
})
