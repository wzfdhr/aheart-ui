import { expect, test } from '@playwright/test'

test.describe('QG1 quality matrix usability', () => {
  test('desktop matrix uses the available width and keeps all headers discoverable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/guide/quality-matrix')

    const matrix = page.locator('.aheart-quality-matrix')
    const wrap = matrix.locator('.aheart-quality-matrix__table-wrap').first()
    const table = wrap.locator('table')
    const lastHeader = table.locator('th').last()

    expect(await matrix.boundingBox()).toEqual(expect.objectContaining({ width: expect.any(Number) }))
    expect((await matrix.boundingBox())?.width).toBeGreaterThanOrEqual(900)
    const geometry = await wrap.evaluate((element) => {
      const table = element.querySelector('table')!
      const lastHeader = table.querySelector('th:last-child')!
      const wrapBox = element.getBoundingClientRect()
      const tableBox = table.getBoundingClientRect()
      const lastHeaderBox = lastHeader.getBoundingClientRect()
      return {
        tableWidth: tableBox.width,
        scrollWidth: element.scrollWidth,
        lastHeaderRight: lastHeaderBox.right,
        wrapRight: wrapBox.right
      }
    })

    expect(geometry.scrollWidth).toBeGreaterThanOrEqual(geometry.tableWidth)
    expect(geometry.lastHeaderRight).toBeLessThanOrEqual(geometry.wrapRight + 1)
    await expect(lastHeader).toHaveText('负责人')
  })

  test('mobile matrix exposes a named scroll region, sticky context, and the owner at max scroll', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/guide/quality-matrix')

    const matrix = page.locator('.aheart-quality-matrix')
    const summary = matrix.locator('.aheart-quality-matrix__summary')
    const legend = matrix.locator('.aheart-quality-matrix__legend')
    const wrap = matrix.locator('.aheart-quality-matrix__table-wrap').first()
    const table = wrap.locator('table')

    await expect(wrap).toHaveAttribute('tabindex', '0')
    await expect(wrap).toHaveAttribute('aria-label', /质量矩阵/)
    await expect(legend).toContainText('R1')
    await expect(legend).toContainText('R2')
    await expect(legend).toContainText('待验收')
    expect(await legend.boundingBox()).not.toBeNull()
    expect((await legend.boundingBox())!.y).toBeLessThan((await wrap.boundingBox())!.y)
    expect((await summary.boundingBox())!.y).toBeLessThan((await legend.boundingBox())!.y)

    const geometry = await wrap.evaluate((element) => {
      element.scrollLeft = element.scrollWidth
      const wrapBox = element.getBoundingClientRect()
      const headers = [...element.querySelectorAll('th')]
      const firstHeaderBox = headers[0].getBoundingClientRect()
      const ownerHeaderBox = headers.at(-1)!.getBoundingClientRect()
      const firstCellBox = element.querySelector('tbody td')!.getBoundingClientRect()
      return {
        scrollLeft: element.scrollLeft,
        maxScrollLeft: element.scrollWidth - element.clientWidth,
        scrollWidth: element.scrollWidth,
        tableWidth: element.querySelector('table')!.getBoundingClientRect().width,
        firstHeaderLeft: firstHeaderBox.left,
        firstCellLeft: firstCellBox.left,
        ownerHeaderLeft: ownerHeaderBox.left,
        ownerHeaderRight: ownerHeaderBox.right,
        wrapLeft: wrapBox.left,
        wrapRight: wrapBox.right
      }
    })

    expect(geometry.scrollLeft).toBe(geometry.maxScrollLeft)
    expect(geometry.scrollWidth).toBeGreaterThanOrEqual(geometry.tableWidth)
    expect(geometry.firstHeaderLeft).toBeCloseTo(geometry.wrapLeft, 0)
    expect(geometry.firstCellLeft).toBeCloseTo(geometry.wrapLeft, 0)
    expect(geometry.ownerHeaderLeft).toBeGreaterThanOrEqual(geometry.wrapLeft)
    expect(geometry.ownerHeaderRight).toBeLessThanOrEqual(geometry.wrapRight)
  })
})
