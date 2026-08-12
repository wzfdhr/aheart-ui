import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const configSource = readFileSync(new URL('../playwright.config.ts', import.meta.url), 'utf8')

test('builds the docs and serves the production preview on the requested port', () => {
  const command = configSource.match(/webServer:\s*\{[\s\S]*?command:\s*`([^`]+)`/)?.[1]

  assert.match(command, /docs:build/)
  assert.match(command, /docs preview/)
  assert.doesNotMatch(command, /docs dev/)
  assert.match(command, /--host 127\.0\.0\.1/)
  assert.match(command, /--port \$\{port\}/)
})

test('uses AHEART_E2E_PORT with 5173 as the default everywhere', () => {
  assert.match(configSource, /AHEART_E2E_PORT/)
  assert.match(configSource, /\?\?\s*'5173'/)
  assert.match(configSource, /baseURL:\s*`http:\/\/127\.0\.0\.1:\$\{port\}`/)
  assert.match(configSource, /url:\s*`http:\/\/127\.0\.0\.1:\$\{port\}`/)
  assert.match(configSource, /command:[\s\S]*--port \$\{port\}/)
})

test('never reuses an unknown local server for production verification', () => {
  assert.match(configSource, /reuseExistingServer:\s*false/)
})

test('runs the QG5 production suite in Firefox, desktop WebKit, and mobile WebKit', () => {
  for (const project of ['desktop', 'mobile', 'desktop-firefox', 'desktop-webkit', 'mobile-webkit']) {
    assert.match(configSource, new RegExp(String.raw`name:\s*'${project}'`))
  }

  assert.match(configSource, /const crossBrowserTests = \[qg2Only, qg5Only, qg5R1Only\]/)
  for (const project of ['desktop-firefox', 'desktop-webkit', 'mobile-webkit']) {
    assert.match(
      configSource,
      new RegExp(String.raw`name:\s*'${project}'[^}]*testMatch:\s*crossBrowserTests`)
    )
  }
})

test('gives the production preview enough time to build before readiness checks', () => {
  assert.match(configSource, /webServer:[\s\S]*timeout:\s*120_000/)
})

test('retains failure diagnostics and uses the HTML reporter', () => {
  assert.match(configSource, /trace:\s*'retain-on-failure'/)
  assert.match(configSource, /video:\s*'retain-on-failure'/)
  assert.match(configSource, /screenshot:\s*'only-on-failure'/)
  assert.match(configSource, /reporter:\s*['"]html['"]/)
})

test('disables the macOS system proxy for local Firefox verification', () => {
  assert.match(configSource, /const firefoxLaunchOptions = \{ firefoxUserPrefs: \{ 'network\.proxy\.type': 0 \} \}/)
  assert.match(configSource, /name:\s*'desktop-firefox'[^\n]*launchOptions:\s*firefoxLaunchOptions/)
})

test('CI installs all browsers and uploads test results and the Playwright report', () => {
  assert.match(configSource, /testDir:/)
  const ciSource = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')

  assert.match(ciSource, /playwright install --with-deps chromium firefox webkit/)
  assert.match(ciSource, /path:\s*\|\s*\n\s*test-results\/\s*\n\s*playwright-report\//)
})
