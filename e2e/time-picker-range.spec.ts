import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/components/time-picker')
  await expect(page.locator('h1')).toContainText('TimePicker')
})

test('TimePicker separates display and value formats and keeps disabled options out of the list', async ({ page }) => {
  const picker = page.locator('.aheart-time-picker').first()
  await picker.locator('input').click()
  await expect(page.locator('.aheart-time-picker__panel')).toBeVisible()
  await expect(page.locator('.aheart-time-picker__column').nth(1).locator('button')).toHaveCount(60)
  await page.keyboard.press('Escape')
  await expect(picker.locator('input')).toBeFocused()
})

test('TimeRangePicker completes one coordinated range draft', async ({ page }) => {
  const example = page.locator('.aheart-demo-panel').filter({ has: page.locator('.aheart-time-range-picker') }).first()
  const picker = example.locator('.aheart-time-range-picker')
  await picker.locator('[data-range-part="start"]').click()
  await expect(page.locator('.aheart-time-range-picker__panel')).toHaveCount(1)
  await page.locator('.aheart-time-range-picker__panel [data-hour="11"]').click()
  await page.locator('.aheart-time-range-picker__panel [data-minute="15"]').click()
  await page.locator('.aheart-time-range-picker__panel [data-second="20"]').click()
  await picker.locator('[data-range-part="end"]').click()
  await page.locator('.aheart-time-range-picker__panel [data-hour="12"]').click()
  await page.locator('.aheart-time-range-picker__panel [data-minute="45"]').click()
  await page.locator('.aheart-time-range-picker__panel [data-second="50"]').click()
  await page.locator('.aheart-time-range-picker__confirm').click()
  await expect(example).toContainText('11:15:20 至 12:45:50')
})

test('TimeRangePicker remains reachable on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile viewport assertion')
  const picker = page.locator('.aheart-time-range-picker').first()
  await picker.locator('[data-range-part="start"]').click()
  const panel = page.locator('.aheart-time-range-picker__panel')
  const box = await panel.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await expect(panel.locator('.aheart-time-range-picker__confirm')).toBeVisible()
})
