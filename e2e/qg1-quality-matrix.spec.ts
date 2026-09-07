import { expect, test, type Locator } from '@playwright/test'

const assertMatrixTables = async (wraps: Locator, options: { requireVisibleLastHeader: boolean }) => {
  await expect(wraps).toHaveCount(3)
  const regionLabels = await wraps.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label')))
  expect(new Set(regionLabels).size).toBe(3)

  for (let index = 0; index < await wraps.count(); index += 1) {
    const wrap = wraps.nth(index)
    const table = wrap.locator('table')
    const packageName = (await wrap.locator('xpath=..').locator('header strong').textContent())!.trim()

    await expect(wrap).toHaveAttribute('tabindex', '0')
    await expect(wrap).toHaveAttribute('aria-label', new RegExp(packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    await expect(table.locator('thead th')).toHaveCount(8)

    const structure = await table.evaluate((element) => {
      const columns = [...element.querySelectorAll('colgroup col')]
      const effectiveColumnCount = columns.reduce((count, column) => count + Number(column.getAttribute('span') || 1), 0)
      return {
        colgroupCount: element.querySelectorAll('colgroup').length,
        effectiveColumnCount,
        rawColumnWidths: columns.map((column) => column.getBoundingClientRect().width),
        effectiveColumnWidths: columns.flatMap((column) => {
          const span = Number(column.getAttribute('span') || 1)
          return Array.from({ length: span }, () => column.getBoundingClientRect().width / span)
        }),
        headers: [...element.querySelectorAll('thead th')].map((header) => header.textContent?.trim())
      }
    })

    expect(structure.colgroupCount).toBe(1)
    expect(structure.effectiveColumnCount).toBe(8)
    expect(structure.rawColumnWidths).toHaveLength(4)
    expect(structure.effectiveColumnWidths).toHaveLength(8)
    expect(structure.effectiveColumnWidths.every((width) => width > 0)).toBe(true)
    expect(structure.headers).toEqual(['组件', '风险', '单元测试', '浏览器验收', 'SSR', '无障碍', '视觉', '负责人'])

    const geometry = await wrap.evaluate((element) => {
      const table = element.querySelector('table')!
      const headers = [...element.querySelectorAll('thead th')]
      const firstCell = element.querySelector('tbody td')!
      const wrapBox = element.getBoundingClientRect()
      const tableBox = table.getBoundingClientRect()
      const initialOwnerBox = headers.at(-1)!.getBoundingClientRect()

      element.scrollLeft = element.scrollWidth

      const firstHeaderBox = headers[0].getBoundingClientRect()
      const firstCellBox = firstCell.getBoundingClientRect()
      const ownerBox = headers.at(-1)!.getBoundingClientRect()
      return {
        scrollWidth: element.scrollWidth,
        tableWidth: tableBox.width,
        scrollLeft: element.scrollLeft,
        maxScrollLeft: element.scrollWidth - element.clientWidth,
        initialOwnerLeft: initialOwnerBox.left,
        initialOwnerRight: initialOwnerBox.right,
        ownerLeft: ownerBox.left,
        ownerRight: ownerBox.right,
        firstHeaderLeft: firstHeaderBox.left,
        firstCellLeft: firstCellBox.left,
        wrapLeft: wrapBox.left,
        wrapRight: wrapBox.right
      }
    })

    expect(geometry.scrollWidth).toBeGreaterThanOrEqual(geometry.tableWidth)
    expect(geometry.scrollLeft).toBe(geometry.maxScrollLeft)
    expect(geometry.ownerLeft).toBeGreaterThanOrEqual(geometry.wrapLeft)
    expect(geometry.ownerRight).toBeLessThanOrEqual(geometry.wrapRight)
    expect(Math.abs(geometry.firstHeaderLeft - geometry.wrapLeft)).toBeLessThanOrEqual(1)
    expect(Math.abs(geometry.firstCellLeft - geometry.wrapLeft)).toBeLessThanOrEqual(1)
    if (options.requireVisibleLastHeader) {
      expect(geometry.initialOwnerLeft).toBeGreaterThanOrEqual(geometry.wrapLeft)
      expect(geometry.initialOwnerRight).toBeLessThanOrEqual(geometry.wrapRight + 1)
    }
  }
}

test.describe('QG1 quality matrix usability', () => {
  test('desktop shows product tasks inside the component column without adding columns', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.goto('/guide/quality-matrix')

    const firstRow = page.locator('.aheart-quality-matrix tbody tr').first()
    await expect(firstRow.locator('td')).toHaveCount(8)
    await expect(firstRow.locator('td').first().locator('.aheart-quality-matrix__product-task')).toContainText(/.+/)

    const splitterRow = page.locator('.aheart-quality-matrix tbody tr').filter({ hasText: 'splitter' }).first()
    const browserEvidence = splitterRow.locator('td').nth(3)
    await expect(browserEvidence).toContainText('dnd-splitter.spec.ts')
    await expect(browserEvidence).not.toContainText('QG2：待验收')
  })

  test('desktop matrix uses the available width and keeps every table discoverable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/guide/quality-matrix')

    const matrix = page.locator('.aheart-quality-matrix')
    expect(await matrix.boundingBox()).toEqual(expect.objectContaining({ width: expect.any(Number) }))
    expect((await matrix.boundingBox())?.width).toBeGreaterThanOrEqual(900)
    await assertMatrixTables(matrix.locator('.aheart-quality-matrix__table-wrap'), { requireVisibleLastHeader: true })
  })

  test('mobile matrix exposes named regions and every table keeps context at max scroll', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/guide/quality-matrix')

    const matrix = page.locator('.aheart-quality-matrix')
    const summary = matrix.locator('.aheart-quality-matrix__summary')
    const legend = matrix.locator('.aheart-quality-matrix__legend')
    const wraps = matrix.locator('.aheart-quality-matrix__table-wrap')
    await expect(legend).toContainText('R1')
    await expect(legend).toContainText('R2')
    await expect(legend).toContainText('待验收')
    expect(await legend.boundingBox()).not.toBeNull()
    expect((await legend.boundingBox())!.y).toBeLessThan((await wraps.nth(0).boundingBox())!.y)
    expect((await summary.boundingBox())!.y).toBeLessThan((await legend.boundingBox())!.y)

    await assertMatrixTables(wraps, { requireVisibleLastHeader: false })
  })
})
