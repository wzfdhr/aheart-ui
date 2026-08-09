import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const configSource = readFileSync(new URL('../playwright.config.ts', import.meta.url), 'utf8')

test('forwards the exact docs host and port command to VitePress', () => {
  const command = configSource.match(/webServer:\s*\{[\s\S]*?command:\s*`([^`]+)`/)?.[1]

  assert.match(command, /--port \$\{port\}/)
})

test('uses AHEART_E2E_PORT with 5173 as the default everywhere', () => {
  assert.match(configSource, /AHEART_E2E_PORT/)
  assert.match(configSource, /\?\?\s*'5173'/)
  assert.match(configSource, /baseURL:\s*`http:\/\/127\.0\.0\.1:\$\{port\}`/)
  assert.match(configSource, /url:\s*`http:\/\/127\.0\.0\.1:\$\{port\}`/)
  assert.match(configSource, /command:[\s\S]*--port \$\{port\}/)
})

test('reuses an existing server locally but not in CI or when disabled', () => {
  assert.match(configSource, /reuseExistingServer:\s*!process\.env\.CI && process\.env\.AHEART_E2E_REUSE_SERVER !== 'false'/)
})

test('keeps desktop and mobile projects and adds Firefox and WebKit coverage', () => {
  for (const project of ['desktop', 'mobile', 'desktop-firefox', 'desktop-webkit', 'mobile-webkit']) {
    assert.match(configSource, new RegExp(String.raw`name:\s*'${project}'`))
  }

  assert.match(configSource, /const qg2Only = \/dnd-splitter\\\.spec\\\.ts\//)
  for (const project of ['desktop-firefox', 'desktop-webkit', 'mobile-webkit']) {
    assert.match(
      configSource,
      new RegExp(String.raw`name:\s*'${project}'[^}]*testMatch:\s*qg2Only`)
    )
  }
})

test('retains failure diagnostics and uses the HTML reporter', () => {
  assert.match(configSource, /trace:\s*'retain-on-failure'/)
  assert.match(configSource, /video:\s*'retain-on-failure'/)
  assert.match(configSource, /screenshot:\s*'only-on-failure'/)
  assert.match(configSource, /reporter:\s*['"]html['"]/)
})

test('CI installs all browsers and uploads test results and the Playwright report', () => {
  assert.match(configSource, /testDir:/)
  const ciSource = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')

  assert.match(ciSource, /playwright install --with-deps chromium firefox webkit/)
  assert.match(ciSource, /path:\s*\|\s*\n\s*test-results\/\s*\n\s*playwright-report\//)
})
