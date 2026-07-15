import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/components/date-picker')
  await expect(page.getByRole('heading', { name: /DatePicker 日期选择器/ })).toBeVisible()
})

test('DateRangePicker completes a range with one coordinated popup', async ({ page }, testInfo) => {
  const picker = page.locator('.vp-doc .aheart-date-range-picker').first()
  const inputs = picker.locator('input[data-range-part]')
  await inputs.first().click()
  const panel = page.locator(`#${await inputs.first().getAttribute('aria-controls')}`)
  await expect(panel).toBeVisible()
  await expect(panel.locator('.aheart-date-range-picker__calendar')).toHaveCount(2)

  if (testInfo.project.name === 'mobile') {
    await expect(panel.locator('.aheart-date-range-picker__calendar:visible')).toHaveCount(1)
    await expect(panel.getByRole('tab', { name: '开始日期' })).toHaveAttribute('aria-selected', 'true')
  } else {
    await expect(panel.locator('.aheart-date-range-picker__calendar:visible')).toHaveCount(2)
  }

  await panel.locator('[data-value="2026-07-16"]').first().click()
  await panel.locator('[data-value="2026-07-22"]').first().hover()
  await expect(panel.locator('[data-value="2026-07-20"]').first()).toHaveClass(/is-in-range/)
  await panel.locator('[data-value="2026-07-22"]').first().click()

  await expect(inputs.nth(0)).toHaveValue('2026-07-16')
  await expect(inputs.nth(1)).toHaveValue('2026-07-22')
  await expect(panel).toBeHidden()
})

test('DateRangePicker keeps date-time edits draft-only until confirmation', async ({ page }) => {
  const picker = page.locator('.vp-doc .aheart-date-range-picker').nth(1)
  const inputs = picker.locator('input[data-range-part]')
  await inputs.first().click()
  const panel = page.locator(`#${await inputs.first().getAttribute('aria-controls')}`)

  await panel.locator('[data-value="2026-07-16"]').first().click()
  await panel.locator('[data-value="2026-07-22"]').first().click()
  await panel.locator('[data-time-part="end-hour"]').fill('17')
  await expect(inputs.nth(1)).toHaveValue('2026-07-20 18:00:00')
  await panel.locator('.aheart-date-range-picker__ok').click()
  await expect(inputs.nth(0)).toHaveValue('2026-07-16 00:00:00')
  await expect(inputs.nth(1)).toHaveValue('2026-07-22 17:00:00')

  await inputs.first().click()
  await panel.locator('[data-value="2026-07-18"]').first().click()
  await page.keyboard.press('Escape')
  await expect(inputs.nth(0)).toHaveValue('2026-07-16 00:00:00')
})

test('DateRangePicker stays within the mobile viewport with a fixed action area', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only geometry check')
  const input = page.locator('.vp-doc .aheart-date-range-picker').first().locator('input').first()
  await input.click()
  const panel = page.locator(`#${await input.getAttribute('aria-controls')}`)
  const box = await panel.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await expect(panel.locator('.aheart-date-range-picker__grid button').first()).toHaveCSS('min-height', '40px')
  await expect(panel.locator('.aheart-date-range-picker__footer')).toHaveCSS('position', 'sticky')
})
