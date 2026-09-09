import { expect, test, type Page } from '@playwright/test'

const file = (name: string) => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(`D6 Upload contract: ${name}`)
})

const runtimeErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) errors.push(`${message.type()}:${message.text()}`)
  })
  return errors
}

test('D6 Picker single draft discards on Escape and commits once on Confirm', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/time-picker')
  const demo = page.getByRole('region', { name: 'D6 单值时间事务' })
  const input = demo.getByRole('combobox')
  const value = demo.locator('[data-d6-time-value]')
  await expect(value).toHaveText('14:30:00')

  await input.focus()
  let panel = page.locator('.aheart-time-picker__panel:visible')
  await expect(panel).toBeVisible()
  await panel.locator('[data-hour="10"]').click()
  await expect(value).toHaveText('14:30:00')
  await input.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(value).toHaveText('14:30:00')
  await expect(input).toBeFocused()

  await input.press('ArrowDown')
  panel = page.locator('.aheart-time-picker__panel:visible')
  await panel.locator('[data-hour="10"]').click()
  await panel.getByRole('button', { name: '确定', exact: true }).click()
  await expect(value).toHaveText('10:30:00')
  await expect(panel).toHaveCount(0)
  expect(errors).toEqual([])
})

test('D6 DatePicker and DateRangePicker share draft, discard, and confirm timing', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/date-picker')
  const single = page.getByRole('region', { name: 'D6 单值日期事务' })
  const singleInput = single.getByRole('combobox')
  const singleValue = single.locator('[data-d6-date-value]')
  await expect(singleValue).toHaveText('2026-07-14 09:30:00')
  await singleInput.focus()
  let panel = page.locator('.aheart-date-picker__panel:visible')
  await panel.locator('[data-value="2026-07-15"]').first().click()
  await expect(singleValue).toHaveText('2026-07-14 09:30:00')
  await singleInput.press('Escape')
  await expect(singleValue).toHaveText('2026-07-14 09:30:00')
  await expect(singleInput).toBeFocused()

  await singleInput.press('ArrowDown')
  panel = page.locator('.aheart-date-picker__panel:visible')
  await panel.locator('[data-value="2026-07-15"]').first().click()
  await panel.locator('.aheart-date-picker__ok').click()
  await expect(singleValue).toHaveText('2026-07-15 09:30:00')

  const range = page.getByRole('region', { name: 'D6 范围日期事务' })
  const rangeValue = range.locator('[data-d6-date-range-value]')
  await expect(rangeValue).toHaveText('2026-07-14 09:30:00 至 2026-07-20 18:00:00')
  await range.getByRole('combobox').first().focus()
  const rangePanel = page.locator('.aheart-date-range-picker__panel:visible')
  await rangePanel.locator('[data-value="2026-07-16"]').first().click()
  await rangePanel.locator('[data-value="2026-07-21"]').first().click()
  await expect(rangeValue).toHaveText('2026-07-14 09:30:00 至 2026-07-20 18:00:00')
  await rangePanel.locator('.aheart-date-range-picker__ok').click()
  await expect(rangeValue).toContainText('2026-07-16')
  await expect(rangeValue).toContainText('2026-07-21')
  expect(errors).toEqual([])
})

test('D6 TimeRangePicker stages both endpoints and commits the complete range once', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/time-picker')
  const demo = page.getByRole('region', { name: 'D6 范围时间事务' })
  const value = demo.locator('[data-d6-time-range-value]')
  await expect(value).toHaveText('09:00:00 至 18:00:00')
  await demo.getByRole('combobox').first().focus()
  const panel = page.locator('.aheart-time-range-picker__panel:visible')
  await panel.locator('[data-hour="10"]').click()
  await panel.getByRole('tab', { name: '结束时间' }).click()
  await panel.locator('[data-hour="19"]').click()
  await expect(value).toHaveText('09:00:00 至 18:00:00')
  await panel.locator('.aheart-time-range-picker__confirm').click()
  await expect(value).toHaveText('10:00:00 至 19:00:00')
  expect(errors).toEqual([])
})

test('D6 TimePicker changeOnScroll follows live option geometry before and after row-size changes', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/time-picker')
  const demo = page.getByRole('region', { name: 'D6 时间列真实尺寸' })
  const input = demo.getByRole('combobox')
  const value = demo.locator('[data-d6-time-geometry-value]')
  await input.focus()
  const panel = page.locator('.aheart-time-picker__panel:visible')
  await expect(panel).toBeVisible()

  const style = await page.addStyleTag({ content: '.aheart-time-picker__column button { height: 44px !important; min-height: 44px !important; }' })
  const minuteColumn = panel.locator('[data-time-column="minute"]')
  const scrollToMinute = (minute: number) => minuteColumn.evaluate((column, targetMinute) => {
    const target = column.querySelector<HTMLElement>(`[data-minute="${targetMinute}"]`)
    if (!target) return false
    const columnRect = column.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    column.scrollTop += targetRect.top - columnRect.top + targetRect.height / 2 - column.clientHeight / 2
    column.dispatchEvent(new Event('scroll'))
    return true
  }, minute)
  expect(await scrollToMinute(20)).toBe(true)
  await expect(value).toHaveText('09:20:00')

  await style.evaluate(element => { element.textContent = '.aheart-time-picker__column button { height: 52px !important; min-height: 52px !important; }' })
  expect(await scrollToMinute(40)).toBe(true)
  await expect(value).toHaveText('09:40:00')
  expect(errors).toEqual([])
})

test('D6 Upload cancel invalidates late callbacks and Retry creates a successful task', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/upload')
  const demo = page.getByRole('region', { name: '取消与任务隔离' })
  await demo.getByLabel('选择文件').setInputFiles(file('cancel.txt'))
  await expect(demo.getByTestId('upload-cancel-status')).toHaveText('上传中 25%')
  await demo.getByRole('button', { name: '取消上传 cancel.txt' }).click()
  await expect(demo.getByTestId('upload-cancel-status')).toHaveText('已取消')
  await demo.getByRole('button', { name: '触发旧任务完成' }).click()
  await expect(demo.getByTestId('upload-cancel-status')).toHaveText('已取消')
  await demo.getByRole('button', { name: '重试 cancel.txt' }).click()
  await expect(demo.getByTestId('upload-cancel-status')).toHaveText('重试成功')
  expect(errors).toEqual([])
})

test('D6 Upload exposes timeout, validation, manual, controlled, and independent locale behavior', async ({ page }) => {
  const errors = runtimeErrors(page)
  await page.goto('/components/upload')
  const timeout = page.getByRole('region', { name: '上传超时' })
  await timeout.getByLabel('选择文件').setInputFiles(file('timeout.txt'))
  await expect(timeout.getByTestId('upload-timeout-status')).toHaveText('上传超时，可重试')
  await expect(timeout.getByRole('button', { name: '重试 timeout.txt' })).toBeVisible()

  const validation = page.getByRole('region', { name: '上传校验失败' })
  await validation.getByLabel('选择文件').setInputFiles(file('invalid.txt'))
  await expect(validation.getByTestId('upload-validation-status')).toHaveText('校验失败')

  const manual = page.getByRole('region', { name: '手动上传' })
  await manual.getByLabel('选择文件').setInputFiles(file('manual-d6.txt'))
  await expect(manual.getByTestId('upload-manual-request-count')).toHaveText('请求次数：0')
  await manual.getByRole('button', { name: '上传', exact: true }).click()
  await expect(manual.getByTestId('upload-manual-status')).toHaveText('上传成功')

  const controlled = page.getByRole('region', { name: '受控拒绝' })
  await controlled.getByLabel('选择文件').setInputFiles(file('rejected.txt'))
  await expect(controlled.getByText('rejected.txt', { exact: true })).toHaveCount(0)
  await controlled.getByLabel('选择文件').setInputFiles(file('accepted.txt'))
  await expect(controlled.getByText('accepted.txt', { exact: true })).toBeVisible()

  const locale = page.getByRole('region', { name: 'Upload 独立 locale' })
  await expect(locale.getByLabel('选择附件')).toBeVisible()
  expect(errors).toEqual([])
})
