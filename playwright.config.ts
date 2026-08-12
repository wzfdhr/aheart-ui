import { defineConfig, devices } from '@playwright/test'

const port = process.env.AHEART_E2E_PORT ?? '5173'
const qg2Only = /dnd-splitter\.spec\.ts/
const firefoxLaunchOptions = { firefoxUserPrefs: { 'network.proxy.type': 0 } }

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'desktop-firefox', testMatch: qg2Only, use: { ...devices['Desktop Chrome'], browserName: 'firefox', launchOptions: firefoxLaunchOptions } },
    { name: 'desktop-webkit', testMatch: qg2Only, use: { ...devices['Desktop Chrome'], browserName: 'webkit' } },
    { name: 'mobile-webkit', testMatch: qg2Only, use: { ...devices['iPhone 13'], browserName: 'webkit' } }
  ],
  webServer: {
    command: `corepack pnpm --dir docs dev --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI && process.env.AHEART_E2E_REUSE_SERVER !== 'false',
    timeout: 30_000
  }
})
