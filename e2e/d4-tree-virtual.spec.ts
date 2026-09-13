import { expect, test, type Page } from '@playwright/test'

const fixturePath = '/components/tree?fixture=tree-virtual'

type TreeSnapshot = {
  clientHeight: number
  scrollHeight: number
  scrollTop: number
  rowCount: number
  mountedKeys: string[]
  visibleRows: string[]
  windowCovered: boolean
}

const runtimeErrors = new WeakMap<Page, string[]>()
const browserWarnings = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }, testInfo) => {
  const errors: string[] = []
  const warnings: string[] = []
  const browserName = testInfo.project.use.browserName
  runtimeErrors.set(page, errors)
  browserWarnings.set(page, warnings)
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    const text = message.text()
    const firefoxScrollLinkedWarning = text.includes('scroll-linked positioning effect')
    const expectedFirefoxWarning = browserName === 'firefox' && message.type() === 'warning' && firefoxScrollLinkedWarning
    if (expectedFirefoxWarning) warnings.push(text)
    if (message.type() === 'error' || (message.type() === 'warning' && !expectedFirefoxWarning)) errors.push(`console ${message.type()}: ${text}`)
  })
  await page.goto(fixturePath)
  await expect(page.getByTestId('tree-virtual-fixture')).toBeVisible()
  await expect(page.getByRole('tree', { name: 'Tree virtual fixture tree' })).toBeVisible()
})

test.afterEach(async ({ page }, testInfo) => {
  const warnings = browserWarnings.get(page) ?? []
  if (warnings.length > 0) {
    await testInfo.attach('browser-diagnostics', { body: `${warnings.join('\n')}\n`, contentType: 'text/plain' })
  }
  expect(runtimeErrors.get(page) ?? []).toEqual([])
})

function tree(page: Page) {
  return page.getByRole('tree', { name: 'Tree virtual fixture tree' })
}

async function activateControl(page: Page, testId: string) {
  const control = page.getByTestId(testId)
  await control.focus()
  await control.press('Enter')
}

async function snapshot(page: Page): Promise<TreeSnapshot> {
  return tree(page).evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const contentTop = bounds.top + element.clientTop
    const list = element.querySelector<HTMLElement>('.aheart-tree__list')
    const logicalContentHeight = list?.getBoundingClientRect().height ?? 0
    const rows = Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"][data-tree-key]'))
    const intervals = rows.map(row => {
      const rect = row.getBoundingClientRect()
      return { key: row.dataset.treeKey ?? '', start: rect.top - contentTop + element.scrollTop, end: rect.bottom - contentTop + element.scrollTop }
    }).sort((a, b) => a.start - b.start)
    const viewportStart = element.scrollTop
    const viewportEnd = Math.min(viewportStart + element.clientHeight, logicalContentHeight)
    let coveredUntil = viewportStart
    for (const interval of intervals) {
      if (interval.end < coveredUntil - 1) continue
      if (interval.start > coveredUntil + 1) break
      coveredUntil = Math.max(coveredUntil, interval.end)
    }
    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
      rowCount: rows.length,
      mountedKeys: intervals.map(interval => interval.key),
      visibleRows: rows.filter(row => {
        const rect = row.getBoundingClientRect()
        return rect.top >= contentTop - 1 && rect.bottom <= contentTop + element.clientHeight + 1
      }).map(row => row.dataset.treeKey ?? ''),
      windowCovered: coveredUntil >= viewportEnd - 1
    }
  })
}

async function scrollTo(page: Page, offset: number) {
  await tree(page).evaluate((element, top) => {
    element.scrollTop = top
    element.dispatchEvent(new Event('scroll', { bubbles: true }))
  }, offset)
  await tree(page).evaluate(async element => {
    await Promise.resolve()
    const view = element.ownerDocument.defaultView!
    await new Promise<void>(resolve => view.requestAnimationFrame(() => view.requestAnimationFrame(() => resolve())))
  })
  await expect.poll(async () => (await snapshot(page)).windowCovered).toBe(true)
}

async function expectVisible(page: Page, key: string) {
  await expect.poll(async () => tree(page).locator(`[role="treeitem"][data-tree-key="${key}"]`).count()).toBe(1)
  await expect.poll(async () => {
    const row = tree(page).locator(`[role="treeitem"][data-tree-key="${key}"]`)
    return row.evaluate(element => {
      const viewport = element.closest<HTMLElement>('[role="tree"]')!
      const a = element.getBoundingClientRect()
      const b = viewport.getBoundingClientRect()
      return a.top >= b.top - 1 && a.bottom <= b.bottom + 1
    })
  }).toBe(true)
}

test('Tree fixture contains wide content without expanding the document', async ({ page }, testInfo) => {
  const layout = await page.evaluate(() => {
    const frame = document.querySelector<HTMLElement>('.tree-virtual-fixture__frame')!
    const tree = document.querySelector<HTMLElement>('[aria-label="Tree virtual fixture tree"]')!
    return {
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      frameClientWidth: frame.clientWidth,
      frameScrollWidth: frame.scrollWidth,
      treeWidth: tree.getBoundingClientRect().width,
    }
  })

  expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth + 1)
  expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth + 1)
  expect(layout.frameClientWidth).toBeLessThanOrEqual(layout.documentClientWidth)

  if (testInfo.project.name.includes('mobile')) {
    expect(layout.treeWidth).toBeGreaterThan(layout.frameClientWidth)
    expect(layout.frameScrollWidth).toBeGreaterThan(layout.frameClientWidth)
  }
})

test('Tree virtual fixture exposes a bounded real DOM window for 1000 and 10000 items', async ({ page }) => {
  await expect(page.getByTestId('tree-virtual-count')).toHaveText('count=1000')
  await expect.poll(() => snapshot(page)).toMatchObject({ rowCount: expect.any(Number) })
  const first = await snapshot(page)
  expect(first.scrollHeight).toBeGreaterThan(first.clientHeight)
  expect(first.rowCount).toBeLessThanOrEqual(24)

  await page.getByTestId('tree-virtual-count-10000').click()
  await expect(page.getByTestId('tree-virtual-count')).toHaveText('count=10000')
  await expect.poll(async () => {
    const state = await snapshot(page)
    return state.scrollHeight - state.clientHeight
  }).toBeGreaterThan(0)
  const tenK = await snapshot(page)
  expect(tenK.rowCount).toBeLessThanOrEqual(24)
  expect(await tree(page).locator('[role="treeitem"]').count()).toBeLessThan(100)
  await page.screenshot({ path: test.info().outputPath('tree-virtual-10000-window.png'), fullPage: false })
})

test('Tree virtual fixture scrolls through real windows and reaches the logical tail', async ({ page }) => {
  const view = tree(page)
  const initial = await snapshot(page)
  for (const fraction of [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]) {
    const state = await snapshot(page)
    await scrollTo(page, Math.max(0, (state.scrollHeight - state.clientHeight) * fraction))
    const after = await snapshot(page)
    expect(after.visibleRows.length).toBeGreaterThan(0)
    expect(after.rowCount).toBeLessThanOrEqual(24)
  }
  // Coarse mobile rows can finish their owner-realm measurement after the
  // final offset write. Re-read the committed content box and perform one
  // real bottom scroll so the tail assertion targets the current logical end.
  const settled = await snapshot(page)
  await scrollTo(page, settled.scrollHeight - settled.clientHeight)
  await expectVisible(page, 'tree-00999')
  expect((await snapshot(page)).scrollTop).toBeGreaterThan(initial.scrollTop)
  await view.screenshot({ path: test.info().outputPath('tree-virtual-tail.png'), fullPage: false })
})

test('Tree virtual Home and End move real focus to visible logical endpoints', async ({ page }) => {
  const view = tree(page)
  await view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]').focus()
  await view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]').press('End')
  const tail = view.locator('[role="treeitem"][data-tree-key="tree-00999"]')
  await expect(tail).toBeFocused()
  await expectVisible(page, 'tree-00999')
  expect((await snapshot(page)).rowCount).toBeLessThanOrEqual(24)

  await tail.press('Home')
  const first = view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]')
  await expect(first).toBeFocused()
  await expectVisible(page, 'tree-ancestor')
  await page.screenshot({ path: test.info().outputPath('tree-virtual-home-end.png'), fullPage: false })
})

test('Tree virtual keeps a mounted roving entry when Tab leaves and re-enters', async ({ page }) => {
  const view = tree(page)
  const before = page.getByTestId('tree-virtual-before')
  await before.focus()
  await before.press('Tab')
  const entry = view.locator('[role="treeitem"][tabindex="0"]')
  await expect(entry).toHaveCount(1)
  await expect(entry).toBeFocused()

  await entry.press('Shift+Tab')
  await expect.poll(() => tree(page).evaluate(element => !element.contains(element.ownerDocument.activeElement))).toBe(true)
  await page.keyboard.press('Tab')
  await expect(entry).toBeFocused()
})

test('Tree virtual recovers focus and roving entry after ancestor collapse and focus deletion', async ({ page }) => {
  const view = tree(page)
  const ancestor = view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]')
  const child = view.locator('[role="treeitem"][data-tree-key="tree-ancestor-child-05"]')
  await expect(child).toHaveCount(1)
  await child.focus()
  await child.press('ArrowLeft')
  await expect(ancestor).toBeFocused()
  await ancestor.press('ArrowLeft')
  await expect(view.locator('[data-tree-key^="tree-ancestor-child-"]')).toHaveCount(0)
  await expect(ancestor).toHaveAttribute('tabindex', '0')

  await page.getByTestId('tree-virtual-count-1000').click()
  await scrollTo(page, 99_999)
  const focusTarget = view.locator('[role="treeitem"][data-tree-key="tree-00999"]')
  await focusTarget.focus()
  await expect(focusTarget).toBeFocused()
  await activateControl(page, 'tree-virtual-delete-focus')
  await expect(focusTarget).toHaveCount(0)
  await expect(view.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1)
})

test('Tree virtual inherits disabled state and measures wrapped dynamic rows without overlap', async ({ page }) => {
  const view = tree(page)
  await page.getByTestId('tree-virtual-disable-ancestor').click()
  const ancestor = view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]')
  const child = view.locator('[role="treeitem"][data-tree-key="tree-ancestor-child-00"]')
  await expect(ancestor).toHaveAttribute('aria-disabled', 'true')
  await expect(child).toHaveAttribute('aria-disabled', 'true')
  await expect(child.getByRole('checkbox')).toBeDisabled()

  await activateControl(page, 'tree-virtual-width')
  await activateControl(page, 'tree-virtual-font')
  await activateControl(page, 'tree-virtual-wrap')
  await activateControl(page, 'tree-virtual-height')
  await scrollTo(page, 900)
  const geometry = await view.evaluate(element => {
    const viewport = element.getBoundingClientRect()
    const rows = Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"][data-tree-key]'))
    const rects = rows.map(row => {
      const rect = row.getBoundingClientRect()
      const title = row.querySelector<HTMLElement>('.aheart-tree__title')!
      return { top: rect.top, bottom: rect.bottom, titleBottom: title.getBoundingClientRect().bottom, scrollHeight: title.scrollHeight, clientHeight: title.clientHeight }
    })
    return { viewport, rects, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }
  })
  expect(geometry.scrollHeight).toBeGreaterThan(geometry.clientHeight)
  for (const [index, row] of geometry.rects.entries()) {
    expect(row.titleBottom, `row ${index} title must fit inside its row`).toBeLessThanOrEqual(row.bottom + 1)
    const previous = geometry.rects[index - 1]
    if (previous) expect(row.top, `row ${index} overlaps the previous row`).toBeGreaterThanOrEqual(previous.bottom - 1)
  }
  await page.screenshot({ path: test.info().outputPath('tree-virtual-dynamic-rows.png'), fullPage: false })
})

test('Tree virtual keeps the focused key and DOM id stable across same-length reorder', async ({ page }) => {
  const view = tree(page)
  await scrollTo(page, (await snapshot(page)).scrollHeight / 2)
  const mounted = await snapshot(page)
  const visibleDataRows = mounted.visibleRows.filter(key => /^tree-\d+$/.test(key))
  const stableKey = visibleDataRows[Math.floor(visibleDataRows.length / 2)]
  expect(stableKey, 'a real visible root key is required before reorder').toBeTruthy()
  const tracked = view.locator(`[role="treeitem"][data-tree-key="${stableKey}"]`)
  await expect(tracked).toHaveCount(1)
  await expect(tracked).toBeVisible()
  await tracked.focus()
  await expect(tracked).toBeFocused()
  const before = await tracked.getAttribute('id')
  const beforeCount = (await snapshot(page)).scrollHeight
  await page.getByTestId('tree-virtual-reorder').click()
  await expect(page.getByTestId('tree-virtual-revision')).toHaveText('revision=1')
  await expect.poll(() => view.locator(`[role="treeitem"][data-tree-key="${stableKey}"]`).count()).toBe(1)
  const after = view.locator(`[role="treeitem"][data-tree-key="${stableKey}"]`)
  await expect(after).toHaveAttribute('id', before ?? '')
  expect(await snapshot(page)).toMatchObject({ scrollHeight: beforeCount, windowCovered: true })
  await expect(view.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1)
})

test('Tree virtual pauses whole-tree disabled lifecycle without blank windows and resumes keyboard endpoints', async ({ page }) => {
  const view = tree(page)
  await activateControl(page, 'tree-virtual-disable-tree')
  await expect(page.getByTestId('tree-virtual-disable-tree')).toHaveText('tree disabled: on')

  const disabledStart = await snapshot(page)
  expect(disabledStart.scrollHeight).toBeGreaterThan(disabledStart.clientHeight)
  expect(disabledStart.rowCount).toBeLessThanOrEqual(24)
  await scrollTo(page, disabledStart.scrollHeight / 2)
  const disabledMiddle = await snapshot(page)
  expect(disabledMiddle.windowCovered).toBe(true)
  expect(disabledMiddle.rowCount).toBeLessThanOrEqual(24)
  await scrollTo(page, 99_999)
  const disabledTail = await snapshot(page)
  expect(disabledTail.windowCovered).toBe(true)
  expect(disabledTail.rowCount).toBeLessThanOrEqual(24)
  await expect(view.locator('[role="treeitem"][aria-disabled="true"]')).not.toHaveCount(0)

  await activateControl(page, 'tree-virtual-disable-tree')
  await expect(page.getByTestId('tree-virtual-disable-tree')).toHaveText('tree disabled: off')
  const entry = view.locator('[role="treeitem"][tabindex="0"]').first()
  await entry.focus()
  await entry.press('End')
  await expect(view.locator('[role="treeitem"][data-tree-key="tree-00999"]')).toBeFocused()
  await view.locator('[role="treeitem"][data-tree-key="tree-00999"]').press('Home')
  await expect(view.locator('[role="treeitem"][data-tree-key="tree-ancestor"]')).toBeFocused()
})

test('Tree virtual lazy loading exposes loading failure keyboard retry and successful children', async ({ page }) => {
  const lazyTree = page.getByRole('tree', { name: 'Tree virtual lazy fixture tree' })
  const root = lazyTree.locator('[role="treeitem"][data-tree-key="lazy-root"]')
  await expect(root).toHaveAttribute('aria-expanded', 'true')
  await expect(root).toHaveAttribute('aria-busy', 'true')
  await page.screenshot({ path: test.info().outputPath('tree-virtual-lazy-loading.png'), fullPage: false })

  await activateControl(page, 'tree-virtual-lazy-fail')
  const retry = root.getByRole('button', { name: '重试加载 Lazy loading root' })
  await expect(retry).toBeVisible()
  await expect(root).not.toHaveAttribute('aria-busy', 'true')
  await page.screenshot({ path: test.info().outputPath('tree-virtual-lazy-error.png'), fullPage: false })

  await activateControl(page, 'tree-virtual-lazy-success')
  await retry.focus()
  await retry.press('Enter')
  await expect(root).toHaveAttribute('aria-busy', 'true')
  await expect(retry).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('tree-virtual-lazy-success.png'), fullPage: false })
  await expect(root).toBeFocused()
  await expect.poll(() => lazyTree.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true)
  await expect.poll(() => lazyTree.locator('[role="treeitem"][data-tree-key="lazy-child-000"]').count()).toBe(1)
  await root.press('ArrowRight')
  await expect(lazyTree.locator('[role="treeitem"][data-tree-key="lazy-child-000"]')).toBeFocused()
})
