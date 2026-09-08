import { expect, test, type Page } from '@playwright/test'

function pageErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}

async function waitForTableLayout(demo: ReturnType<Page['locator']>) {
  const tables = demo.locator('table[data-table-layout-ready]')
  const count = await tables.count()
  expect(count).toBeGreaterThan(0)
  for (let index = 0; index < count; index += 1) {
    await expect(tables.nth(index)).toHaveAttribute('data-table-layout-ready', 'true')
  }
}

async function openFilter(page: Page, demo: ReturnType<Page['locator']>, index = 0) {
  const triggers = demo.locator('button[aria-haspopup="dialog"]')
  if (index > 0) {
    const container = demo.locator('.aheart-table__container')
    await container.evaluate(element => { element.scrollLeft = element.scrollWidth })
    const fixedBoundary = demo.locator('thead th').nth(2)
    await expect.poll(async () => {
      const containerBox = await container.boundingBox()
      const boundaryBox = await fixedBoundary.boundingBox()
      const triggerBox = await triggers.nth(index).boundingBox()
      if (!containerBox || !boundaryBox || !triggerBox) return false
      const hitInside = await triggers.nth(index).evaluate((element, point) => {
        const hit = element.ownerDocument.elementFromPoint(point.x, point.y)
        return hit === element || Boolean(hit && element.contains(hit))
      }, { x: triggerBox.x + triggerBox.width / 2, y: triggerBox.y + triggerBox.height / 2 })
      return triggerBox.x >= boundaryBox.x + boundaryBox.width + 8 &&
        hitInside &&
        triggerBox.x + triggerBox.width <= containerBox.x + containerBox.width + 1
    }).toBe(true)
  }
  await triggers.nth(index).click()
  const popup = page.locator('[data-table-filter-popup]')
  await expect(popup).toBeVisible()
  return popup
}

test('D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  await waitForTableLayout(demo)

  const anchoredTrigger = demo.locator('button[aria-haspopup="dialog"]').first()
  await anchoredTrigger.scrollIntoViewIfNeeded()
  const beforeScrollY = await page.evaluate(() => window.scrollY)
  const triggerBefore = await anchoredTrigger.boundingBox()
  expect(triggerBefore).not.toBeNull()
  if (!triggerBefore) return
  expect(triggerBefore.y).toBeGreaterThanOrEqual(0)
  const anchoredClick = page.locator('[data-table-filter-popup]')
  await anchoredTrigger.click()
  await expect(anchoredClick).toBeVisible()
  await expect(anchoredClick).toHaveAccessibleName(/筛选|姓名/)
  const namedFilterInput = anchoredClick.getByRole('textbox', { name: '筛选姓名' })
  await expect(namedFilterInput).toHaveCount(1)
  const actionBoxes = await Promise.all([
    anchoredClick.locator('[data-d5b-filter-confirm]').boundingBox(),
    anchoredClick.locator('[data-d5b-filter-reset]').boundingBox(),
    anchoredClick.locator('[data-d5b-filter-cancel]').boundingBox()
  ])
  const inputBox = await namedFilterInput.boundingBox()
  const popupBoxForControls = await anchoredClick.boundingBox()
  expect(inputBox).not.toBeNull()
  expect(popupBoxForControls).not.toBeNull()
  if (!inputBox || !popupBoxForControls || actionBoxes.some(box => !box)) return
  for (const box of actionBoxes) {
    if (!box) continue
    expect(box.x).toBeGreaterThanOrEqual(popupBoxForControls.x)
    expect(box.x + box.width).toBeLessThanOrEqual(popupBoxForControls.x + popupBoxForControls.width)
    expect(box.y).toBeGreaterThanOrEqual(popupBoxForControls.y)
    expect(box.y + box.height).toBeLessThanOrEqual(popupBoxForControls.y + popupBoxForControls.height)
  }
  for (let index = 0; index < actionBoxes.length - 1; index += 1) {
    const current = actionBoxes[index]
    const next = actionBoxes[index + 1]
    if (!current || !next) continue
    const horizontalGap = next.x - (current.x + current.width)
    const verticalGap = next.y - (current.y + current.height)
    expect(horizontalGap >= 6 || verticalGap >= 6).toBe(true)
    expect(current.x + current.width <= next.x || current.y + current.height <= next.y).toBe(true)
  }
  const viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }))
  await expect.poll(async () => {
    const triggerBox = await anchoredTrigger.boundingBox()
    const popupBox = await anchoredClick.boundingBox()
    const scrollY = await page.evaluate(() => window.scrollY)
    if (!triggerBox || !popupBox) return false
    const horizontalOverlap = popupBox.x < triggerBox.x + triggerBox.width && popupBox.x + popupBox.width > triggerBox.x
    const verticalDistance = Math.min(
      Math.abs(popupBox.y - (triggerBox.y + triggerBox.height)),
      Math.abs(popupBox.y + popupBox.height - triggerBox.y)
    )
    return Math.abs(scrollY - beforeScrollY) <= 2 &&
      triggerBox.y >= 0 && triggerBox.y + triggerBox.height <= viewport.height &&
      popupBox.x >= 0 && popupBox.x + popupBox.width <= viewport.width &&
      popupBox.y >= 0 && popupBox.y + popupBox.height <= viewport.height &&
      horizontalOverlap && verticalDistance < 24
  }).toBe(true)
  await page.keyboard.press('Escape')
  await expect(anchoredClick).toHaveCount(0)
  expect(await page.evaluate(() => window.scrollY)).toBe(beforeScrollY)
  await expect(anchoredTrigger).toBeFocused()

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

test('D5-B outside close followed by immediate reopen keeps the new popup alive', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  await waitForTableLayout(demo)
  const trigger = demo.locator('button[aria-haspopup="dialog"]').first()
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const popup = page.locator('[data-table-filter-popup]')
  await expect(popup).toBeVisible()
  const outsideTarget = demo.locator('p[role="status"]')
  await expect(outsideTarget).toBeVisible()
  await outsideTarget.click()
  await expect(popup).toHaveCount(0)
  await trigger.click()
  await expect(popup).toBeVisible()
  await page.waitForTimeout(40)
  await expect(popup).toHaveCount(1)
  await expect(demo.locator('p[role="status"]')).toContainText('打开：是')
  expect(errors).toEqual([])
})

test('D5-B 430px transition degrades right fixed while keeping Role filter reachable', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  await page.setViewportSize({ width: 430, height: 844 })
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  await waitForTableLayout(demo)
  const container = demo.locator('.aheart-table__container')
  const table = demo.locator('table')
  const trigger = demo.locator('button[aria-haspopup="dialog"]').nth(1)
  await trigger.scrollIntoViewIfNeeded()
  await container.evaluate(element => { element.scrollLeft = element.scrollWidth })
  const boundary = await demo.locator('thead th').nth(2).boundingBox()
  const triggerBox = await trigger.boundingBox()
  const containerBox = await container.boundingBox()
  const rightHeader = await demo.locator('thead th').nth(4).evaluate(element => getComputedStyle(element).right)
  expect(boundary).not.toBeNull()
  expect(triggerBox).not.toBeNull()
  expect(containerBox).not.toBeNull()
  expect(rightHeader).toBe('auto')
  if (!boundary || !triggerBox || !containerBox) return
  expect(triggerBox.x - (boundary.x + boundary.width)).toBeGreaterThanOrEqual(8)
  expect(triggerBox.x + triggerBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 1)
  const hitInside = await trigger.evaluate((element, point) => {
    const hit = element.ownerDocument.elementFromPoint(point.x, point.y)
    return hit === element || Boolean(hit && element.contains(hit))
  }, { x: triggerBox.x + triggerBox.width / 2, y: triggerBox.y + triggerBox.height / 2 })
  expect(hitInside).toBe(true)
  await trigger.click()
  await expect(page.locator('[data-table-filter-popup]')).toBeVisible()
  expect(errors).toEqual([])
})

test('D5-B fixed columns, utility offsets, sticky header, y scroll, and narrow x scroll', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  await waitForTableLayout(demo)
  const table = demo.locator('table')
  const containerBox = await demo.locator('.aheart-table__container').boundingBox()
  expect(containerBox).not.toBeNull()
  if (!containerBox) return
  const fixedExpected = containerBox.width >= 528
  await expect(table).toHaveCount(1)
  await expect(table.locator('colgroup col')).toHaveCount(5)
  const headerGeometry = await table.locator('thead th').evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return { position: style.position, left: style.left, right: style.right, top: style.top, x: rect.x, width: rect.width }
  }))
  expect(headerGeometry.some(item => item.position === 'sticky' && Number.parseFloat(item.left) >= 0)).toBe(true)
  expect(headerGeometry.some(item => item.position === 'sticky' && item.right === '0px')).toBe(fixedExpected)
  expect(headerGeometry.every(item => item.position === 'sticky' && item.top === '8px')).toBe(true)
  if (fixedExpected) expect(headerGeometry[2].x).toBeGreaterThanOrEqual(headerGeometry[0].x + headerGeometry[0].width)
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
  await waitForTableLayout(demo)
  const rowCount = await demo.locator('tbody tr').count()
  await demo.getByRole('button', { name: '开始 loading' }).click()
  await expect(demo.locator('p[role="status"]')).toContainText('筛选值：无')
  await expect(demo.locator('tbody tr')).toHaveCount(rowCount)
  await expect(demo.locator('button[aria-haspopup="dialog"]').first()).toBeDisabled()
  await expect(demo.locator('.aheart-table__loading')).toBeVisible()
  await expect(demo.locator('p[role="status"]')).toContainText('自定义操作：0')
  await demo.getByRole('button', { name: '结束 loading' }).click()

  let openStatePopup = await openFilter(page, demo)
  await demo.getByRole('button', { name: '开始 loading' }).click()
  await expect.poll(async () => {
    if (await openStatePopup.count() === 0) return true
    return await openStatePopup.locator('[data-d5b-filter-confirm]').isDisabled()
  }).toBe(true)
  await demo.getByRole('button', { name: '结束 loading' }).click()
  if (await openStatePopup.count() === 0) openStatePopup = await openFilter(page, demo)

  await demo.getByRole('button', { name: '显示 error' }).click()
  await expect(demo.getByRole('alert')).toContainText('当前数据加载失败')
  await expect(demo.locator('tbody tr')).toHaveCount(rowCount)
  const staleRow = demo.locator('tbody tr').first()
  await expect(staleRow).toBeVisible()
  const staleRowVisibility = await staleRow.evaluate(row => {
    const style = getComputedStyle(row)
    return { opacity: style.opacity, visibility: style.visibility }
  })
  expect(staleRowVisibility.opacity).not.toBe('0')
  expect(staleRowVisibility.visibility).toBe('visible')
  const errorBox = await demo.getByRole('alert').boundingBox()
  const rowBox = await staleRow.boundingBox()
  expect(errorBox).not.toBeNull()
  expect(rowBox).not.toBeNull()
  if (!errorBox || !rowBox) return
  expect(errorBox.y + errorBox.height).toBeLessThanOrEqual(rowBox.y + 1)
  expect(demo.locator('.aheart-table__empty')).toHaveCount(0)
  await expect(demo.locator('button[aria-haspopup="dialog"]').first()).toBeDisabled()
  await expect(demo.getByRole('button', { name: '重试数据请求' })).toBeVisible()
  await expect.poll(async () => {
    if (await openStatePopup.count() === 0) return true
    return await openStatePopup.locator('[data-d5b-filter-confirm]').isDisabled()
  }).toBe(true)
  await demo.getByRole('button', { name: '重试数据请求' }).click()
  await expect(demo.getByRole('alert')).toHaveCount(0)
  await expect(demo.locator('p[role="status"]')).toContainText('retry：1')

  await demo.getByRole('button', { name: '显示 empty' }).click()
  await expect(demo.locator('tbody')).toContainText('暂无数据')
  expect(errors).toEqual([])
})

test('D5-B review geometry, natural-width freeze, external sticky scroll, popup anchoring, and iframe outside boundary', async ({ page }) => {
  const errors = pageErrors(page)
  await page.goto('/components/table')
  const demo = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  await waitForTableLayout(demo)
  const table = demo.locator('table')
  const initialContainer = await demo.locator('.aheart-table__container').boundingBox()
  expect(initialContainer).not.toBeNull()
  if (!initialContainer) return
  const fixedExpected = initialContainer.width >= 528
  const geometry = await table.locator('thead th').evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      x: rect.x,
      width: rect.width
    }
  }))
  const tableRect = await table.evaluate(node => node.getBoundingClientRect())
  const bodyStyle = await table.locator('tbody td').first().evaluate(node => {
    const style = getComputedStyle(node)
    return { position: style.position, top: style.top }
  })
  expect(bodyStyle.position).toBe('sticky')
  expect(bodyStyle.top).toBe('auto')
  const nonFixedBodyStyle = await table.locator('tbody tr').first().locator('td').nth(3).evaluate(node => {
    const style = getComputedStyle(node)
    return { position: style.position, top: style.top }
  })
  expect(nonFixedBodyStyle.position).not.toBe('sticky')
  expect(geometry.every(item => item.position === 'sticky' && item.top === '8px')).toBe(true)
  if (fixedExpected) {
    for (const index of [0, 1, 2]) {
      const offset = Number.parseFloat(geometry[index].left)
      expect(Math.abs(geometry[index].x - tableRect.x - offset)).toBeLessThan(4)
    }
    expect(geometry[2].x).toBeGreaterThanOrEqual(geometry[0].x + geometry[0].width - 2)
    expect(geometry[2].x).toBeGreaterThanOrEqual(geometry[1].x + geometry[1].width - 2)
    expect(geometry[4].right).toBe('0px')
  } else expect(geometry[4].right).toBe('auto')

  await expect(table).toHaveAttribute('data-table-layout-ready', 'true')
  const beforeColumns = await table.locator('colgroup col').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).width))
  await demo.getByRole('button', { name: '切换长内容' }).click()
  const afterLongColumns = await table.locator('colgroup col').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).width))
  expect(afterLongColumns).toEqual(beforeColumns)
  await demo.getByRole('button', { name: '恢复短内容' }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  const narrowContainer = demo.locator('.aheart-table__container')
  const narrowBox = await narrowContainer.boundingBox()
  if (narrowBox && narrowBox.width < 528) await narrowContainer.evaluate(element => { element.scrollLeft = 0 })
  const overflow = await demo.locator('.aheart-table__container').evaluate(node => ({ scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }))
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth)

  const trigger = demo.locator('button[aria-haspopup="dialog"]').first()
  await trigger.click()
  const popup = page.locator('[data-table-filter-popup]')
  await expect(popup).toBeVisible()
  const triggerRect = await trigger.boundingBox()
  const popupRect = await popup.boundingBox()
  expect(triggerRect).not.toBeNull()
  expect(popupRect).not.toBeNull()
  if (!triggerRect || !popupRect) return
  const viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }))
  expect(popupRect.x).toBeGreaterThanOrEqual(8)
  expect(popupRect.x + popupRect.width).toBeLessThanOrEqual(viewport.width - 8)
  expect(popupRect.x).toBeLessThan(triggerRect.x + triggerRect.width)
  expect(popupRect.x + popupRect.width).toBeGreaterThan(triggerRect.x)
  const bottomDistance = Math.abs(popupRect.y - (triggerRect.y + triggerRect.height))
  const topDistance = Math.abs(popupRect.y + popupRect.height - triggerRect.y)
  expect(Math.min(bottomDistance, topDistance)).toBeLessThan(24)

  await page.goto('/')
  await page.evaluate(src => {
    const iframe = document.createElement('iframe')
    iframe.dataset.reviewTableIframe = 'true'
    iframe.src = src
    iframe.style.cssText = 'width: 100%; height: 720px; border: 0;'
    document.body.append(iframe)
  }, '/components/table')
  const iframe = page.locator('iframe[data-review-table-iframe]')
  await expect(iframe).toHaveCount(1)
  const frame = await iframe.elementHandle().then(handle => handle?.contentFrame())
  if (!frame) throw new Error('review iframe did not expose a same-origin frame')
  const frameDemo = frame.getByRole('region', { name: 'D5-B 筛选布局状态' })
  const frameTrigger = frameDemo.locator('button[aria-haspopup="dialog"]').first()
  await frameTrigger.click()
  const framePopup = frame.locator('[data-table-filter-popup]')
  await expect(framePopup).toBeVisible()
  await page.mouse.click(4, 4)
  await expect(framePopup).toBeVisible()
  await frame.locator('body').click({ position: { x: 4, y: 4 } })
  await expect(framePopup).toHaveCount(0)
  expect(errors.filter(error => !error.startsWith('D5FLOATDBG'))).toEqual([])
})

test('D5-B utility columns use measured widths for fixed offsets', async ({ page }) => {
  await page.goto('/components/table')
  const region = page.getByRole('region', { name: 'D5-B 筛选布局状态' })
  const table = region.locator('table')
  await expect(table).toHaveAttribute('data-table-layout-ready', 'true')
  const tableBox = await table.boundingBox()
  const utilities = await table.locator('thead th').evaluateAll(nodes => nodes.slice(0, 2).map(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return { width: rect.width, x: rect.x, left: Number.parseFloat(style.left) }
  }))
  const firstData = await table.locator('thead th').nth(2).boundingBox()
  expect(tableBox).not.toBeNull()
  expect(firstData).not.toBeNull()
  expect(utilities).toHaveLength(2)
  if (!tableBox || !firstData || utilities.length !== 2) return
  expect(utilities.every(item => item.width >= 80)).toBe(true)
  const utilityWidth = utilities.reduce((total, item) => total + item.width, 0)
  expect(Math.abs(firstData.x - (tableBox.x + utilityWidth))).toBeLessThan(4)
})

test('D5-B external ancestor scroll keeps no-y sticky header at the offset and inside the table', async ({ page }) => {
  await page.goto('/components/table')
  const region = page.getByRole('region', { name: 'D5-B 外部滚动 sticky' })
  const scroller = region.locator('.d5b-external-scroll')
  const table = region.locator('table')
  const header = table.locator('thead th').first()
  await expect(table).toHaveCount(1)
  const clientTop = await scroller.evaluate(node => node.clientTop)
  const geometry = async () => {
    const container = await scroller.boundingBox()
    const headerBox = await header.boundingBox()
    const tableBox = await table.boundingBox()
    const headerHeight = await header.evaluate(node => node.getBoundingClientRect().height)
    if (!container || !headerBox || !tableBox) return null
    return {
      target: container.y + clientTop + 8,
      headerTop: headerBox.y,
      headerBottom: headerBox.y + headerBox.height,
      headerHeight,
      tableBottom: tableBox.y + tableBox.height
    }
  }
  await scroller.evaluate(node => {
    const table = node.querySelector('table')
    const header = table?.querySelector('thead')
    if (!table || !header) return
    const hold = Math.min(120, Math.max(1, table.offsetHeight - header.getBoundingClientRect().height - 40))
    const tableTopInScroller = table.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop
    node.scrollTop = Math.min(node.scrollHeight - node.clientHeight, tableTopInScroller + hold)
  })
  await expect.poll(async () => {
    const value = await geometry()
    return value ? Math.round(value.headerTop - value.target) : -1
  }).toBe(0)

  await scroller.evaluate(node => {
    const table = node.querySelector('table')
    if (!table) return
    const maxScroll = node.scrollHeight - node.clientHeight
    const tableTopInScroller = table.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop
    node.scrollTop = Math.min(maxScroll, tableTopInScroller + table.offsetHeight)
  })
  await expect.poll(async () => {
    const value = await geometry()
    if (!value) return false
    const bottomInsideTable = value.headerBottom <= value.tableBottom + 1
    const tableBelowTarget = value.tableBottom >= value.target + value.headerHeight
    return bottomInsideTable && (tableBelowTarget || value.headerTop < value.target)
  }).toBe(true)
})
