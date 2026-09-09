import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const baseURL = process.env.AHEART_D7_VISUAL_URL ?? 'http://127.0.0.1:5303'
const outputDir = new URL('../docs/superpowers/evidence/d7/visual/', import.meta.url).pathname
const errors = []

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
page.on('pageerror', (error) => errors.push({ type: 'pageerror', text: error.message, url: page.url() }))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push({ type: 'console', text: message.text(), url: page.url() })
})

const openFixture = async (width = 1280, height = 900) => {
  await page.setViewportSize({ width, height })
  await page.goto(`${baseURL}/components/dnd`, { waitUntil: 'networkidle' })
  await page.getByTestId('d7-fixture').waitFor({ state: 'visible' })
  await page.waitForTimeout(250)
}

const screenshotRegion = async (name, locator) => {
  await locator.scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  await locator.screenshot({ path: `${outputDir}/${name}.png`, animations: 'disabled' })
}

const screenshotViewport = async (name, locator) => {
  await locator.evaluate((node) => node.scrollIntoView({ block: 'center', inline: 'nearest' }))
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${outputDir}/${name}.png`, animations: 'disabled' })
}

const genericCard = () => page.locator('[data-testid="d7-fixture"] > .d7-card').first()
const transactionCard = () => page.locator('[data-testid="d7-fixture"] > .d7-card').filter({ hasText: '稳定版本与受控事务' }).first()

const manifest = []

await openFixture()
{
  const source = page.getByTestId('d7-generic-source')
  const accepted = page.getByTestId('d7-generic-accepted')
  await source.focus()
  await page.keyboard.press('Space')
  await accepted.focus()
  await accepted.getAttribute('data-aheart-dnd-keyboard-state')
  manifest.push({ file: '01-desktop-generic-keyboard.png', viewport: '1280x900', state: 'source grabbed; compatible target focused', live: await page.locator('.aheart-dnd-live-region').textContent() })
  await screenshotRegion('01-desktop-generic-keyboard', genericCard())
}

await openFixture()
{
  const source = page.getByTestId('d7-generic-source')
  const mismatch = page.getByTestId('d7-generic-mismatch')
  await source.focus()
  await page.keyboard.press('Space')
  await mismatch.focus()
  manifest.push({ file: '02-desktop-generic-mismatch.png', viewport: '1280x900', state: 'source grabbed; incompatible target focused', live: await page.locator('.aheart-dnd-live-region').textContent() })
  await screenshotRegion('02-desktop-generic-mismatch', genericCard())
}

await openFixture()
{
  const source = page.getByTestId('d7-rollback-source')
  await source.getByRole('listitem').first().focus()
  await page.keyboard.press('Alt+ArrowRight')
  await page.getByTestId('d7-rollback-result').waitFor({ state: 'visible' })
  const details = transactionCard().locator('details')
  manifest.push({
    file: '03-desktop-parent-rejection-rollback.png',
    viewport: '1280x900',
    state: await page.getByTestId('d7-rollback-result').textContent(),
    field: await page.getByTestId('d7-rollback-field').textContent(),
    process: await page.getByTestId('d7-rollback-process').textContent(),
    auditDetailsOpen: await details.getAttribute('open')
  })
  await screenshotRegion('03-desktop-parent-rejection-rollback', transactionCard())
}

await openFixture(390, 844)
{
  const source = page.getByTestId('d7-generic-source')
  const accepted = page.getByTestId('d7-generic-accepted')
  await source.focus()
  await page.keyboard.press('Space')
  await accepted.focus()
  manifest.push({ file: '04-mobile390-generic-keyboard.png', viewport: '390x844', state: 'source grabbed; compatible target focused', columns: await page.locator('.d7-primary-grid').evaluate((node) => getComputedStyle(node).gridTemplateColumns) })
  await screenshotRegion('04-mobile390-generic-keyboard', genericCard())
}

await openFixture(390, 844)
{
  const source = page.getByTestId('d7-rollback-source')
  await source.getByRole('listitem').first().focus()
  await page.keyboard.press('Alt+ArrowRight')
  await page.getByTestId('d7-rollback-result').waitFor({ state: 'visible' })
  const duplicate = page.getByTestId('d7-duplicate-list')
  await duplicate.getByRole('listitem').first().focus()
  await page.keyboard.press('Alt+ArrowDown')
  const scope = page.getByTestId('d7-scope-source')
  await scope.focus()
  await page.keyboard.press('Space')
  await page.getByTestId('d7-scope-navigate').click()
  manifest.push({
    file: '05a-mobile390-rollback-duplicate.png',
    viewport: '390x844',
    rollback: await page.getByTestId('d7-rollback-result').textContent(),
    duplicate: await page.getByTestId('d7-duplicate-reject-reason').textContent(),
    auditDetailsOpen: await transactionCard().locator('details').getAttribute('open')
  })
  await screenshotViewport('05a-mobile390-rollback-duplicate', transactionCard())
  const scopeCard = page.locator('[data-testid="d7-fixture"] > .d7-card').filter({ hasText: '路由 scopeKey 与迟到回调' }).first()
  manifest.push({
    file: '05b-mobile390-scope-iframe.png',
    viewport: '390x844',
    scope: await page.getByTestId('d7-scope-cancel-reason').textContent(),
    iframe: await page.getByTestId('d7-owner-state').textContent()
  })
  await screenshotViewport('05b-mobile390-scope-iframe', scopeCard)
}

await openFixture()
{
  const iframe = page.getByTestId('d7-owner-iframe')
  const frame = iframe.contentFrame()
  await frame.getByTestId('d7-iframe-scroll').first().waitFor({ state: 'visible' })
  manifest.push({ file: '06-desktop-iframe-owner-scroll.png', viewport: '1280x900', state: await page.getByTestId('d7-owner-state').textContent(), live: await page.getByTestId('d7-owner-live-count').textContent() })
  await screenshotRegion('06-desktop-iframe-owner-scroll', iframe)
}

await writeFile(`${outputDir}/manifest.json`, `${JSON.stringify({ baseURL, screenshots: manifest, runtimeErrors: errors }, null, 2)}\n`)
await browser.close()

if (errors.length > 0) {
  console.error(`D7 visual capture found ${errors.length} runtime error(s)`)
  process.exitCode = 1
} else {
  console.log(`D7 visual capture complete: ${manifest.length} screenshots, runtime errors=0`)
}
