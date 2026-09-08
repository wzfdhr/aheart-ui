import { expect, test, type Page } from '@playwright/test'

/** D5-C contract tests. These intentionally target the runtime workbench and
 * remain RED until the virtual table implementation and docs fixture land. */
function runtimeErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

async function openWorkbench(page: Page, name: string) {
  await page.goto('/components/table')
  const region = page.getByRole('region', { name })
  await expect(region).toBeVisible()
  return region
}

test('D5-C native table exposes logical aria count and a small default DOM window', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C 10k 本地虚拟表格')
  const table = demo.locator('table')
  await expect(table).toHaveAttribute('aria-rowcount', '10000')
  await expect(demo.locator('tbody tr[data-table-row]')).toHaveCount(20)
  await expect(demo.locator('[data-table-virtual-spacer]')).toHaveCount(2)
  expect(await demo.locator('tbody tr[data-table-row]').count()).toBeLessThanOrEqual(20)
  await demo.locator('[data-table-scroll]').evaluate(element => { element.scrollTop = element.scrollHeight / 2 })
  await expect(demo.locator('tbody tr[data-table-row]').first()).toContainText('Row 5000')
  expect(errors).toEqual([])
})

test('D5-C server current-page data virtualizes after pagination without a second slice', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C 服务端分页虚拟表格')
  await expect(demo.locator('[data-table-data-mode]')).toHaveText('server')
  await expect(demo.locator('[data-table-current-page]')).toHaveText('2')
  await expect(demo.locator('tbody tr[data-table-row]')).toHaveCount(20)
  await expect(demo.locator('tbody')).toContainText('Server row 1001')
  await demo.locator('[data-table-scroll]').evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(demo.locator('tbody')).toContainText('Server row 1020')
  expect(errors).toEqual([])
})

test('D5-C preserves fixed columns, selection, expanded companion rows, and focus pinning', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C 固定列展开选择组合')
  await expect(demo.locator('th[data-fixed="left"]')).toHaveCSS('position', 'sticky')
  await expect(demo.locator('th[data-fixed="right"]')).toHaveCSS('position', 'sticky')
  await demo.getByRole('checkbox', { name: 'Select row 5000', exact: true }).check()
  await demo.getByRole('button', { name: 'Expand row 5000', exact: true }).click()
  await expect(demo.locator('tr[data-table-row="5000"]')).toBeVisible()
  await expect(demo.locator('tr[data-table-expanded-row="5000"]')).toBeVisible()
  await demo.getByRole('button', { name: 'Focus row 5000', exact: true }).click()
  await expect(demo.locator('tr[data-table-row="5000"]')).toHaveAttribute('data-focus-pinned', 'true')
  expect(errors).toEqual([])
})

test('D5-C warns and falls back to full DOM for unsupported rowspan and invalid row keys', async ({ page }) => {
  const warnings: string[] = []
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()) })
  const demo = await openWorkbench(page, 'D5-C 兼容性回退')
  await expect(demo.locator('[data-table-virtual-fallback="full-dom"]')).toBeVisible()
  await expect(demo.locator('tbody tr[data-table-row]')).toHaveCount(100)
  expect(warnings.join('\n')).toMatch(/rowspan|rowKey|virtual/i)
})

test('D5-C SSR hydration, iframe ownerDocument, mobile and zoom stay error free', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C SSR 与嵌入式容器')
  await expect(demo.locator('[data-ssr-initial-window]')).toHaveAttribute('data-ssr-initial-window', 'equal')
  await expect(demo.locator('[data-owner-document-cleanup]')).toHaveText('ok')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => { document.body.style.zoom = '1.25' })
  await expect(demo.locator('[data-table-scroll]')).toBeVisible()
  await expect.poll(() => errors).toEqual([])
})
