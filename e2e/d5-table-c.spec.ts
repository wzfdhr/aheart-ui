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
  const rows = demo.locator('tbody tr[data-table-row]')
  expect(await rows.count()).toBeGreaterThan(0)
  expect(await rows.count()).toBeLessThanOrEqual(20)
  const spacers = demo.locator('[data-table-virtual-spacer]')
  expect(await spacers.count()).toBeGreaterThanOrEqual(2)
  await expect(spacers.first()).toHaveAttribute('aria-hidden', 'true')
  await expect(spacers.first()).toHaveAttribute('data-table-spacer-position', 'before')
  await expect(spacers.last()).toHaveAttribute('data-table-spacer-position', 'after')
  await expect(spacers.first().locator('td')).toHaveAttribute('colspan', /[1-9]/)
  await demo.locator('.aheart-table__container').evaluate(element => { element.scrollTop = element.scrollHeight / 2 })
  await expect.poll(async () => demo.locator('tbody tr[data-table-row]').allTextContents()).toEqual(expect.arrayContaining([expect.stringMatching(/Row 4\d{3}|Row 5\d{3}|Row 6\d{3}/)]))
  const windowRows = await rows.evaluateAll(items => items.map(item => Number(item.getAttribute('data-table-row')?.match(/^d5c-(\d+)$/)?.[1])).filter(Number.isFinite))
  expect(windowRows.some(index => index >= 4000 && index <= 6000)).toBe(true)
  await page.waitForTimeout(1000)
  await expect.poll(() => errors.slice(), { interval: 100, timeout: 1000 }).toEqual([])
})

test('D5-C server current-page data virtualizes after pagination without a second slice', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C 服务端分页虚拟表格')
  await expect(demo.locator('[data-table-data-mode]')).toHaveText('server')
  await expect(demo.locator('[data-table-current-page]')).toHaveText('2')
  expect(await demo.locator('tbody tr[data-table-row]').count()).toBeGreaterThan(0)
  expect(await demo.locator('tbody tr[data-table-row]').count()).toBeLessThanOrEqual(20)
  await expect(demo.locator('tbody')).toContainText('Server row 1001')
  await demo.locator('.aheart-table__container').evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(demo.locator('tbody')).toContainText('Server row 1020')
  await page.waitForTimeout(1000)
  await expect.poll(() => errors.slice(), { interval: 100, timeout: 1000 }).toEqual([])
})

test('D5-C preserves fixed columns, selection, expanded companion rows, and focus pinning', async ({ page }, testInfo) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C 固定列展开选择组合')
  const scroll = demo.locator('.aheart-table__container')
  const geometry = await demo.locator('thead th').evaluateAll(cells => {
    const widths = cells.map(cell => ({ fixed: cell.getAttribute('data-fixed'), utility: cell.classList.contains('aheart-table__selection-cell') || cell.classList.contains('aheart-table__expand-cell'), width: cell.getBoundingClientRect().width }))
    return { widths, required: widths.filter(item => item.utility || item.fixed === 'left' || item.fixed === 'right').reduce((sum, item) => sum + item.width, 0) }
  })
  const availableWidth = await scroll.evaluate(element => element.clientWidth)
  expect(geometry.required).toBeGreaterThan(0)
  await expect(demo.locator('th[data-fixed="left"]')).toHaveCSS('position', 'sticky')
  const rightFixed = demo.locator('th[data-fixed="right"], th.is-fixed-right')
  const requestedRightWidth = Math.max(geometry.widths.filter(item => item.fixed === 'right').reduce((sum, item) => sum + item.width, 0), await rightFixed.evaluateAll(cells => cells.reduce((sum, cell) => sum + cell.getBoundingClientRect().width, 0)))
  const rightPosition = await rightFixed.count() ? await rightFixed.first().evaluate(element => getComputedStyle(element).position) : null
  const rightDowngraded = requestedRightWidth > 0 && (geometry.required > availableWidth || rightPosition !== 'sticky')
  if (requestedRightWidth > 0 && geometry.required <= availableWidth) {
    await expect(rightFixed).toHaveCSS('position', 'sticky')
  } else if (await rightFixed.count()) {
    await expect(rightFixed).not.toHaveCSS('position', 'sticky')
  }
  await expect.poll(() => scroll.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
  await scroll.evaluate(element => { element.scrollLeft = element.scrollWidth })
  await expect.poll(() => scroll.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
  await expect(demo.locator('th[data-fixed="left"]')).toHaveCSS('position', 'sticky')
  if (requestedRightWidth > 0 && geometry.required <= availableWidth) await expect(rightFixed).toHaveCSS('position', 'sticky')
  if (/mobile/.test(testInfo.project.name)) {
    const leftBodyCell = demo.locator('tbody tr[data-table-row]:not(.is-selected) td[data-fixed="left"]').first()
    await expect(leftBodyCell).toBeVisible()
    const backgroundAlpha = await leftBodyCell.evaluate(element => {
      const color = getComputedStyle(element).backgroundColor
      const rgba = color.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)
      return rgba ? Number(rgba[1]) : color === 'transparent' ? 0 : 1
    })
    expect(backgroundAlpha).toBeGreaterThan(0)
    if (rightDowngraded || /mobile/.test(testInfo.project.name)) {
      if (await rightFixed.count()) expect(rightPosition).not.toBe('sticky')
      await expect(rightFixed).toHaveCount(1)
      const leftBoundary = await demo.locator('th[data-fixed="left"], td[data-fixed="left"]').evaluateAll(cells => Math.max(...cells.map(cell => cell.getBoundingClientRect().right)))
      const rightTitle = rightFixed.locator('.aheart-table__title')
      const rightBox = await rightTitle.boundingBox()
      const containerBox = await scroll.boundingBox()
      expect(rightBox).not.toBeNull()
      expect(containerBox).not.toBeNull()
      expect(rightBox!.x).toBeGreaterThanOrEqual(leftBoundary + 1)
      expect(rightBox!.x + rightBox!.width).toBeLessThanOrEqual(containerBox!.x + containerBox!.width + 1)
    }
  }
  await scroll.evaluate(element => { element.scrollTop = element.scrollHeight / 2 })
  const target = demo.locator('tr[data-table-row]').filter({ hasText: /Row 5\d{3}/ }).first()
  const key = await target.getAttribute('data-table-row')
  expect(key).toBeTruthy()
  await demo.getByRole('checkbox', { name: new RegExp(`Select row ${key}$`) }).check()
  await scroll.evaluate(element => { element.scrollLeft = element.scrollWidth })
  await expect.poll(() => scroll.evaluate(element => Math.abs(element.scrollLeft - (element.scrollWidth - element.clientWidth)) <= 1)).toBe(true)
  if (/mobile/.test(testInfo.project.name) && requestedRightWidth > 0) {
    const readBodySnapshot = () => demo.evaluate((root, selectedKey) => {
      const container = root.querySelector('.aheart-table__container')
      const selected = root.querySelector(`tr[data-table-row="${selectedKey}"]`)
      const ordinary = [...root.querySelectorAll('tr[data-table-row]')].find(row => row.getAttribute('data-table-row') !== selectedKey)
      const leftCells = [...root.querySelectorAll('th[data-fixed="left"], th.is-fixed-left, td[data-fixed="left"], td.is-fixed-left')]
      const leftBoundary = Math.max(...leftCells.map(cell => cell.getBoundingClientRect().right))
      const containerRight = container?.getBoundingClientRect().right ?? NaN
      const inspect = (row: Element | undefined) => {
        const cell = row?.querySelector('td[data-fixed="right"], td.is-fixed-right')
        if (!cell) return null
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT)
        let node: Node | null = walker.nextNode()
        while (node && !node.textContent?.trim()) node = walker.nextNode()
        if (!node) return null
        const range = document.createRange(); range.selectNodeContents(node)
        const rect = range.getBoundingClientRect()
        const center = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
        const textStyle = getComputedStyle(node.parentElement ?? cell)
        return { text: (node.textContent ?? '').trim(), left: rect.left, right: rect.right, width: rect.width, height: rect.height, textAlign: textStyle.textAlign || getComputedStyle(cell).textAlign, blocked: Boolean(center?.closest('td[data-fixed="left"]')) }
      }
      const cells = [inspect(selected), inspect(ordinary)]
      return { leftBoundary, containerRight, cells, valid: Number.isFinite(leftBoundary) && Number.isFinite(containerRight) && cells.every(cell => cell && cell.width > 0 && cell.height > 0 && cell.text === 'ready' && cell.textAlign === 'right' && cell.left >= leftBoundary + 1 && cell.right <= containerRight + 1 && !cell.blocked) }
    }, key)
    await expect.poll(readBodySnapshot, { interval: 100, timeout: 5000 }).toMatchObject({ valid: true })
  }
  const expand = demo.getByRole('button', { name: new RegExp(`Expand row ${key}$`) })
  if (await expand.getAttribute('aria-expanded') !== 'true') await expand.click()
  await expect(demo.locator(`tr[data-table-row="${key}"]`)).toBeVisible()
  await expect(demo.locator(`tr[data-table-expanded-row="${key}"]`)).toBeVisible()
  const expandedCell = demo.locator(`tr[data-table-expanded-row="${key}"] td`)
  await expect(expandedCell).toHaveAttribute('colspan', /[1-9]/)
  const regularCell = demo.locator(`tr[data-table-row="${key}"] td`).first()
  const expandedColors = await expandedCell.evaluate(element => {
    const token = getComputedStyle(document.documentElement).getPropertyValue('--aheart-color-bg-hover').trim()
    const probe = document.createElement('span')
    probe.style.backgroundColor = token || '#fafafa'
    document.body.append(probe)
    const expected = getComputedStyle(probe).backgroundColor
    probe.remove()
    return { actual: getComputedStyle(element).backgroundColor, expected, token }
  })
  const regularBackground = await regularCell.evaluate(element => getComputedStyle(element).backgroundColor)
  expect(expandedColors.actual).toBe(expandedColors.expected)
  expect(expandedColors.actual).not.toBe(regularBackground)
  await demo.getByRole('button', { name: new RegExp(`Focus row ${key}$`) }).click()
  await expect(demo.locator(`tr[data-table-row="${key}"]`)).toHaveAttribute('data-focus-pinned', 'true')
  await expect.poll(() => demo.evaluate((root, expected) => document.activeElement?.closest('tr')?.getAttribute('data-table-row') === expected, key)).toBe(true)
  await scroll.evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(demo.locator(`tr[data-table-row="${key}"]`)).toHaveAttribute('data-focus-pinned', 'true')
  await demo.getByRole('button', { name: 'Focus outside table', exact: true }).focus()
  await expect.poll(async () => {
    const row = demo.locator(`tr[data-table-row="${key}"]`)
    return await row.count() === 0 || (await row.getAttribute('data-focus-pinned')) === 'false'
  }).toBe(true)
  await page.waitForTimeout(1000)
  await expect.poll(() => errors.slice(), { interval: 100, timeout: 1000 }).toEqual([])
})

for (const [reason, name] of [['rowspan', 'D5-C 回退 rowspan'], ['invalid-row-key', 'D5-C 回退 invalid rowKey'], ['duplicate-key', 'D5-C 回退 duplicate key']] as const) test(`D5-C fallback: ${reason}`, async ({ page }) => {
  const warnings: string[] = []
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()) })
  const demo = await openWorkbench(page, name)
  await expect(demo.locator('[data-table-virtual-fallback="full-dom"]')).toBeVisible()
  await expect(demo.locator('tbody tr')).toHaveCount(100)
  await expect(demo.locator('[data-table-virtual-fallback="full-dom"]')).toHaveAttribute('data-fallback-reason', new RegExp(reason === 'invalid-row-key' ? 'rowKey' : reason === 'duplicate-key' ? 'duplicate' : reason, 'i'))
  const devWarnings = await demo.getAttribute('data-dev-warnings')
  if (devWarnings === 'true') await expect.poll(() => warnings.join('\n')).toMatch(/rowspan|rowKey|duplicate|virtual/i)
})

test('D5-C SSR hydration, iframe ownerDocument, mobile and zoom stay error free', async ({ page }) => {
  const errors = runtimeErrors(page)
  const demo = await openWorkbench(page, 'D5-C SSR 与嵌入式容器')
  const iframe = page.frameLocator('iframe[data-table-owner-document]')
  const iframeTable = iframe.locator('table')
  await expect(iframeTable).toBeVisible()
  await expect(iframeTable).toHaveAttribute('aria-rowcount', '100')
  expect(await iframe.locator('tbody tr[data-table-row]').count()).toBeGreaterThan(0)
  expect(await iframe.locator('tbody tr[data-table-row]').count()).toBeLessThanOrEqual(20)
  await expect(iframe.locator('[data-table-virtual-spacer]')).toHaveCount(2)
  await iframeTable.evaluate(element => { const container = element.closest('.aheart-table__container'); if (container) container.scrollTop = container.scrollHeight / 2 })
  await expect.poll(() => iframeTable.evaluate(element => element.ownerDocument.defaultView === window)).toBe(true)
  await expect(iframe.locator('[data-owner-document]')).toHaveAttribute('data-owner-document', 'iframe')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => { document.body.style.zoom = '1.25' })
  await expect(demo.locator('iframe[data-table-owner-document]')).toBeVisible()
  await expect(iframeTable).toBeVisible()
  await demo.locator('[data-d5c-unmount-iframe]').click()
  await expect.poll(() => iframe.locator('body table').count(), { interval: 100, timeout: 1000 }).toBe(0)
  await expect(demo.locator('[data-iframe-listener-cleanup]')).toHaveText('ok')
  await page.waitForTimeout(1000)
  await expect.poll(() => errors.slice(), { interval: 100, timeout: 1000 }).toEqual([])
})

test('D5-C 1k local virtual table keeps the same bounded native window', async ({ page }) => {
  const demo = await openWorkbench(page, 'D5-C 1k 本地虚拟表格')
  await expect(demo.locator('table')).toHaveAttribute('aria-rowcount', '1000')
  expect(await demo.locator('tbody tr[data-table-row]').count()).toBeGreaterThan(0)
  expect(await demo.locator('tbody tr[data-table-row]').count()).toBeLessThanOrEqual(20)
})
