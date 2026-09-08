import { expect, test, type Page } from '@playwright/test'

function pageErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}

async function openFilter(page: Page, demo: ReturnType<Page['locator']>, index = 0) {
  const triggers = demo.locator('button[aria-haspopup="dialog"]')
  await triggers.nth(index).click()
  const popup = page.locator('[data-table-filter-popup]')
  await expect(popup).toBeVisible()
  return popup
}

test('D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })

  let popup = await openFilter(page, demo)
  await popup.locator('[data-d5b-filter-input]').fill('Ada')
  await popup.locator('[data-d5b-filter-cancel]').click()
  await expect(page.locator('[data-table-filter-popup]')).toHaveCount(0)
  await expect(demo.locator('p[role="status"]')).toContainText('筛选值：无')

  popup = await openFilter(page, demo)
  await popup.locator('[data-d5b-filter-input]').fill('Ada')
  await popup.locator('[data-d5b-filter-confirm]').click()
  await expect(demo.locator('p[role="status"]')).toContainText('筛选值：Ada')

  popup = await openFilter(page, demo)
  await popup.locator('[data-d5b-filter-reset]').click()
  await expect(demo.locator('p[role="status"]')).toContainText('筛选值：无')

  popup = await openFilter(page, demo)
  await popup.locator('[data-d5b-filter-input]').focus()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-table-filter-popup]')).toHaveCount(0)

  popup = await openFilter(page, demo, 1)
  await page.mouse.click(1000, 100)
  await expect(page.locator('[data-table-filter-popup]')).toHaveCount(0)

  await demo.getByRole('button', { name: '拒绝筛选打开' }).click()
  await demo.locator('button[aria-haspopup="dialog"]').first().click()
  await expect(page.locator('[data-table-filter-popup]')).toHaveCount(0)
  await expect(demo.locator('p[role="status"]')).toContainText('打开：否')
  expect(errors).toEqual([])
})

test('D5-B fixed columns, utility offsets, sticky header, y scroll, and narrow x scroll', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  const table = demo.locator('table')
  await expect(table).toHaveCount(1)
  await expect(table.locator('colgroup col')).toHaveCount(5)
  const headerGeometry = await table.locator('thead th').evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return { position: style.position, left: style.left, right: style.right, top: style.top, x: rect.x, width: rect.width }
  }))
  expect(headerGeometry.some(item => item.position === 'sticky' && Number.parseFloat(item.left) >= 0)).toBe(true)
  expect(headerGeometry.some(item => item.position === 'sticky' && item.right === '0px')).toBe(true)
  expect(headerGeometry.every(item => item.position === 'sticky' && item.top === '8px')).toBe(true)
  expect(headerGeometry[2].x).toBeGreaterThanOrEqual(headerGeometry[0].x + headerGeometry[0].width)
  await expect(demo.locator('.aheart-table__container')).toHaveCSS('overflow-y', 'auto')
  await expect(demo.locator('.aheart-table__container')).toHaveCSS('max-height', '180px')

  await page.setViewportSize({ width: 390, height: 844 })
  const overflow = await demo.locator('.aheart-table__container').evaluate(node => ({ scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }))
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth)
  expect(errors).toEqual([])
})

test('D5-B loading keeps old rows and locks actions, error only retries, and empty is visible', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  const rowCount = await demo.locator('tbody tr').count()
  await demo.getByRole('button', { name: '开始 loading' }).click()
  await expect(demo.locator('p[role="status"]')).toContainText('筛选值：无')
  await expect(demo.locator('tbody tr')).toHaveCount(rowCount)
  await expect(demo.locator('button[aria-haspopup="dialog"]').first()).toBeDisabled()
  await expect(demo.locator('.aheart-table__loading')).toBeVisible()
  await expect(demo.locator('p[role="status"]')).toContainText('自定义操作：0')
  await demo.getByRole('button', { name: '结束 loading' }).click()

  await demo.getByRole('button', { name: '显示 error' }).click()
  await expect(demo.getByRole('alert')).toContainText('当前数据加载失败')
  await expect(demo.locator('tbody tr')).toHaveCount(rowCount)
  await expect(demo.locator('button[aria-haspopup="dialog"]').first()).toBeDisabled()
  await demo.getByRole('button', { name: '重试数据请求' }).click()
  await expect(demo.getByRole('alert')).toHaveCount(0)
  await expect(demo.locator('p[role="status"]')).toContainText('retry：1')

  await demo.getByRole('button', { name: '显示 empty' }).click()
  await expect(demo.locator('tbody')).toContainText('暂无数据')
  expect(errors).toEqual([])
})
