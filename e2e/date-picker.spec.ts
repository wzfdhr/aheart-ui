import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/components/date-picker')
  await expect(page.getByRole('heading', { name: /DatePicker 日期选择器/ })).toBeVisible()
})

test('DatePicker completes format, mode, multiple and preset workflows', async ({ page }) => {
  const pickers = page.locator('.vp-doc .aheart-date-picker')

  const formatted = pickers.nth(1).locator('input')
  await formatted.fill('14072026')
  await formatted.press('Tab')
  await expect(formatted).toHaveValue('14/07/2026')

  const week = pickers.nth(2)
  await week.locator('input').fill('2026W30')
  await week.locator('input').press('Tab')
  await expect(week.locator('input')).toHaveValue('2026-W30')
  await week.locator('input').click()
  await expect(page.locator('.aheart-date-picker__panel.is-entered .aheart-date-picker__grid--week')).toBeVisible()
  await page.keyboard.press('Escape')

  const quarter = pickers.nth(4)
  await quarter.locator('input').fill('2026Q4')
  await quarter.locator('input').press('Tab')
  await expect(quarter.locator('input')).toHaveValue('2026-Q4')

  const multiple = pickers.nth(6)
  const multipleInput = multiple.locator('input')
  await multipleInput.click()
  const multiplePanel = page.locator(`#${await multipleInput.getAttribute('aria-controls')}`)
  await multiplePanel.locator('[data-value="2026-07-21"]').click()
  await expect(multiple.locator('.aheart-date-picker__tag')).toContainText(['2026-07-14', '2026-07-20', '2026-07-21'])

  const preset = pickers.nth(8)
  const presetInput = preset.locator('input')
  await presetInput.scrollIntoViewIfNeeded()
  await presetInput.click()
  const presetPanel = page.locator(`#${await presetInput.getAttribute('aria-controls')}`)
  await presetPanel.locator('[data-preset-index="1"]').click()
  await expect(preset.locator('input')).not.toHaveValue('')
})

test('DatePicker keeps showTime as a confirmable draft and supports keyboard focus', async ({ page }) => {
  const pickers = page.locator('.vp-doc .aheart-date-picker')
  const dateTime = pickers.nth(7)
  const input = dateTime.locator('input').first()

  await input.click()
  const panel = page.locator('.aheart-date-picker__panel.is-entered')
  await panel.locator('[data-value="2026-07-20"]').click()
  await panel.locator('[data-time-part="hour"]').fill('11')
  await expect(input).toHaveValue('2026-07-14 09:30:00 上午')
  await panel.locator('.aheart-date-picker__ok').click()
  await expect(input).toHaveValue('2026-07-20 11:30:00 中午')

  await input.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.aheart-date-picker__panel.is-entered')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(input).toBeFocused()
})

test('DatePicker remains reachable on a narrow viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only geometry check')
  const picker = page.locator('.vp-doc .aheart-date-picker').nth(7)
  await picker.locator('input').click()

  const panel = page.locator('.aheart-date-picker__panel.is-entered')
  await expect(panel).toBeVisible()
  const box = await panel.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await expect(panel.locator('.aheart-date-picker__grid button').first()).toHaveCSS('min-height', '40px')

  const input = picker.locator('input').first()
  await panel.locator('[data-value="2026-07-20"]').click()
  await panel.locator('[data-time-part="hour"]').fill('11')
  await panel.locator('[data-time-part="minute"]').fill('7')
  await expect(panel.locator('[data-time-part="minute"]')).toHaveValue('5')
  await panel.locator('[data-time-part="period"]').selectOption('PM')
  await panel.locator('.aheart-date-picker__ok').click()
  await expect(input).toHaveValue('2026-07-20 11:05:00 晚上')
  await expect(panel).toBeHidden()

  await input.click()
  await panel.locator('[data-value="2026-07-21"]').click()
  await page.keyboard.press('Escape')
  await expect(input).toHaveValue('2026-07-20 11:05:00 晚上')
})

test('DatePicker uses a coherent dark popup surface', async ({ page }) => {
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  const input = page.locator('.vp-doc .aheart-date-picker').nth(7).locator('input').first()
  await input.click()
  const panel = page.locator(`#${await input.getAttribute('aria-controls')}`)

  await expect(panel).toHaveCSS('background-color', 'rgb(23, 25, 29)')
  await expect(panel.locator('.aheart-date-picker__time')).toHaveCSS('background-color', 'rgb(29, 32, 38)')
  await expect(panel.locator('[data-time-part="hour"]')).toHaveCSS('color', 'rgb(240, 242, 245)')
})
