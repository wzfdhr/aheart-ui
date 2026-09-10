import { expect, test, type Locator, type Page } from '@playwright/test'

const fixturePath = '/components/tree-select?fixture=tree-select-virtual'
const runtimeErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  page.on('console', message => { if (message.type() === 'error') errors.push(`console error: ${message.text()}`) })
  await page.goto(fixturePath)
  await expect(page.getByTestId('tree-select-virtual-fixture')).toBeVisible()
})

test.afterEach(async ({ page }) => { expect(runtimeErrors.get(page) ?? []).toEqual([]) })

function main(page: Page) { return page.getByTestId('tree-select-virtual-main') }
function controlled(page: Page) { return page.getByTestId('tree-select-virtual-controlled') }

async function openMain(page: Page) {
  await main(page).getByRole('combobox').click()
  const panel = await panelFor(page, main(page))
  await expect(panel).toBeVisible()
  await expect(panel).toHaveClass(/is-entered/)
  await expect.poll(() => panel.evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  await settleOwnerRealm(panel)
}

async function closeMain(page: Page) {
  const trigger = main(page).getByRole('combobox')
  await trigger.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(await panelFor(page, main(page))).toBeHidden()
}

async function panelFor(page: Page, select: Locator) {
  const id = await select.getByRole('combobox').getAttribute('aria-controls')
  expect(id).toBeTruthy()
  return page.locator(`#${id}`)
}

async function settleOwnerRealm(locator: Locator) {
  await locator.evaluate(async element => {
    await Promise.resolve()
    const view = element.ownerDocument.defaultView!
    await new Promise<void>(resolve => view.requestAnimationFrame(() => view.requestAnimationFrame(() => resolve())))
  })
}

async function treeSnapshot(page: Page) {
  return (await panelFor(page, main(page))).locator('[role="tree"]').evaluate(element => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
    rows: element.querySelectorAll('[role="treeitem"]').length
  }))
}

async function scrollTree(page: Page, select: Locator, offset: number) {
  const panel = await panelFor(page, select)
  await panel.locator('[role="tree"]').evaluate((element, top) => {
    element.scrollTop = top
    element.dispatchEvent(new Event('scroll', { bubbles: true }))
  }, offset)
  await settleOwnerRealm(panel)
  return panel.locator('[role="tree"]').evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const contentTop = bounds.top + element.clientTop
    const rows = Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"][data-tree-key]')).map(row => {
      const rect = row.getBoundingClientRect()
      return { key: row.dataset.treeKey ?? '', start: rect.top - contentTop + element.scrollTop, end: rect.bottom - contentTop + element.scrollTop }
    }).sort((a, b) => a.start - b.start)
    const viewportStart = element.scrollTop
    const viewportEnd = Math.min(viewportStart + element.clientHeight, element.scrollHeight)
    let coveredUntil = viewportStart
    for (const row of rows) {
      if (row.end < coveredUntil - 1) continue
      if (row.start > coveredUntil + 1) break
      coveredUntil = Math.max(coveredUntil, row.end)
    }
    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
      rows: rows.length,
      windowCovered: coveredUntil >= viewportEnd - 1
    }
  })
}

test('TreeSelect virtual fixture bounds 1000/10000 rows while exposing checkable disabled selected tags', async ({ page }) => {
  await openMain(page)
  await expect(main(page).locator('.aheart-tree-select__tag:not(.aheart-tree-select__tag--rest)')).toHaveCount(2)
  await expect(main(page).locator('.aheart-tree-select__tag--rest')).toHaveText('+1')

  const first = await treeSnapshot(page)
  expect(first.rows).toBeLessThanOrEqual(24)
  await closeMain(page)
  await page.getByTestId('tree-select-virtual-count-10000').click()
  await openMain(page)
  await expect(page.getByTestId('tree-select-virtual-fixture')).toContainText('count=10000')
  await expect.poll(async () => (await treeSnapshot(page)).scrollHeight).toBeGreaterThan(0)
  const tenK = await treeSnapshot(page)
  expect(tenK.rows).toBeLessThanOrEqual(24)
})

test('TreeSelect virtual owns one vertical scroller and budgets a short viewport with long labels and large fonts', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 300 })
  await page.getByTestId('tree-select-virtual-count-10000').click()
  await page.getByTestId('tree-select-virtual-labels').click()
  await page.getByTestId('tree-select-virtual-font').click()
  await openMain(page)

  const panel = await panelFor(page, main(page))
  const geometry = await panel.evaluate(element => {
    const candidates = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))]
    const owners = candidates.filter(candidate => {
      const style = getComputedStyle(candidate)
      return /(auto|scroll|overlay)/.test(style.overflowY) && candidate.scrollHeight > candidate.clientHeight + 1
    })
    const tree = element.querySelector<HTMLElement>('[role="tree"]')!
    const rect = element.getBoundingClientRect()
    return {
      ownerClasses: owners.map(owner => owner.className),
      panelBottom: rect.bottom,
      viewportHeight: element.ownerDocument.defaultView!.innerHeight,
      treeHeight: tree.clientHeight,
      treeScrollHeight: tree.scrollHeight,
      treeBottom: tree.getBoundingClientRect().bottom,
      fontSize: getComputedStyle(element).fontSize,
      treeFontSize: getComputedStyle(tree).fontSize,
      rows: Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]')).map(row => {
        const rect = row.getBoundingClientRect()
        const title = row.querySelector<HTMLElement>('.aheart-tree__title')!
        return {
          top: rect.top,
          bottom: rect.bottom,
          titleBottom: title.getBoundingClientRect().bottom,
          titleClipped: title.scrollHeight > title.clientHeight + 1,
          titleHeight: title.clientHeight,
          text: title.textContent ?? ''
        }
      })
    }
  })
  expect(geometry.ownerClasses).toHaveLength(1)
  expect(geometry.ownerClasses.some(value => value.split(/\s+/).includes('aheart-tree'))).toBe(true)
  expect(geometry.fontSize).toBe('24px')
  expect(geometry.treeFontSize).toBe('24px')
  expect(geometry.treeScrollHeight).toBeGreaterThan(geometry.treeHeight)
  expect(geometry.treeHeight).toBeLessThanOrEqual(256)
  expect(geometry.panelBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
  expect(geometry.treeBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
  expect(geometry.rows.every(row => row.titleBottom <= row.bottom + 1)).toBe(true)
  expect(geometry.rows.every(row => row.titleHeight > 0 && row.text.length > 0)).toBe(true)
  const sortedRows = [...geometry.rows].sort((a, b) => a.top - b.top)
  for (const [index, row] of sortedRows.entries()) {
    const previous = sortedRows[index - 1]
    if (previous) expect(row.top, `row ${index} must not overlap previous row`).toBeGreaterThanOrEqual(previous.bottom - 1)
  }
  for (const offset of [0, geometry.treeScrollHeight / 3, geometry.treeScrollHeight / 2, Math.max(0, geometry.treeScrollHeight - geometry.treeHeight), 0]) {
    const state = await scrollTree(page, main(page), offset)
    expect(state.rows).toBeGreaterThan(0)
    expect(state.rows).toBeLessThanOrEqual(24)
    expect(state.scrollHeight).toBeGreaterThan(state.clientHeight)
    expect(state.windowCovered).toBe(true)
  }
  await page.screenshot({ path: test.info().outputPath('tree-select-dynamic-geometry.png'), fullPage: false })
})

test('TreeSelect virtual search transfers real focus and reaches the last enabled 10k result', async ({ page }) => {
  await page.getByTestId('tree-select-virtual-count-10000').click()
  await openMain(page)
  const panel = await panelFor(page, main(page))
  const search = panel.getByRole('searchbox', { name: '搜索树节点' })
  await search.fill('Node')
  await search.press('ArrowDown')
  await settleOwnerRealm(panel)
  const tree = panel.getByRole('tree')
  await expect(tree.locator('[role="treeitem"]').first()).toBeFocused()
  await tree.locator('[role="treeitem"]').first().press('End')
  await settleOwnerRealm(panel)

  await expect(tree.locator('[role="treeitem"][data-tree-key="node-09998"]')).toBeFocused()
  const disabledTail = tree.locator('[role="treeitem"][data-tree-key="node-09999"]')
  await expect(disabledTail).toHaveAttribute('aria-disabled', 'true')
  await expect(disabledTail.getByRole('checkbox')).toBeDisabled()
  await expect(disabledTail).not.toBeFocused()
  expect((await treeSnapshot(page)).rows).toBeLessThanOrEqual(24)
  await expect(main(page).getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
})

test('TreeSelect virtual search supports real Tab and Shift+Tab re-entry after reopen', async ({ page }) => {
  await openMain(page)
  const panel = await panelFor(page, main(page))
  const search = panel.getByRole('searchbox', { name: '搜索树节点' })
  await search.focus()
  await search.press('Tab')
  const entry = panel.locator('[role="treeitem"][tabindex="0"]')
  await expect(entry).toHaveCount(1)
  await expect(entry).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(search).toBeFocused()
  await closeMain(page)
  await openMain(page)
  await expect((await panelFor(page, main(page))).getByRole('searchbox', { name: '搜索树节点' })).toBeVisible()
})

test('TreeSelect virtual empty-query ArrowRight reaches a manually expanded visible child', async ({ page }) => {
  await openMain(page)
  const panel = await panelFor(page, main(page))
  const root = panel.locator('[role="treeitem"][data-tree-key="tree-root"]')
  await root.getByRole('button', { name: 'Expand node' }).click()
  await expect(panel.locator('[data-tree-key="tree-child"]')).toHaveCount(1)
  const search = panel.getByRole('searchbox', { name: '搜索树节点' })
  await search.focus()
  await search.press('ArrowDown')
  await settleOwnerRealm(panel)
  await panel.locator('[role="treeitem"][data-tree-key="tree-root"]').press('ArrowRight')
  await expect(panel.locator('[role="treeitem"][data-tree-key="tree-child"]')).toBeFocused()
})

test('TreeSelect virtual short viewport keeps search and the logical tail reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 300 })
  await page.getByTestId('tree-select-virtual-count-10000').click()
  await page.getByTestId('tree-select-virtual-font').click()
  await page.getByTestId('tree-select-virtual-viewport').click()
  await openMain(page)
  const panel = await panelFor(page, main(page))
  const search = panel.getByRole('searchbox', { name: '搜索树节点' })
  await expect(search).toBeVisible()
  await search.focus()
  await search.press('ArrowDown')
  await settleOwnerRealm(panel)
  const tree = panel.getByRole('tree')
  await tree.locator('[role="treeitem"]').first().press('End')
  await settleOwnerRealm(panel)
  await expect(tree.locator('[role="treeitem"][data-tree-key="node-09998"]')).toBeFocused()
  await expect(search).toBeVisible()
  await expect(panel).toBeVisible()
})

test('TreeSelect virtual lazy loading shows error, keyboard retry, loaded child, and selection', async ({ page }, testInfo) => {
  const lazy = page.getByTestId('tree-select-virtual-lazy')
  await lazy.getByRole('combobox').click()
  const panel = await panelFor(page, lazy)
  const root = panel.locator('[role="treeitem"][data-tree-key="lazy-root"]')
  await root.getByRole('button', { name: 'Expand node' }).click()
  await expect(root).toHaveAttribute('aria-busy', 'true')
  await page.screenshot({ path: testInfo.outputPath('tree-select-lazy-loading.png'), fullPage: false })

  const retry = root.getByRole('button', { name: '重试加载 Lazy loading root' })
  await expect(retry).toBeVisible()
  await expect(root).not.toHaveAttribute('aria-busy', 'true')
  await page.screenshot({ path: testInfo.outputPath('tree-select-lazy-error.png'), fullPage: false })

  await retry.focus()
  await retry.press('Enter')
  await expect(root).toHaveAttribute('aria-busy', 'true')
  await expect.poll(() => panel.locator('[role="treeitem"][data-tree-key="lazy-child"]').count()).toBe(1)
  await expect(page.getByTestId('tree-select-virtual-lazy-state')).toContainText('state=success')
  await page.screenshot({ path: testInfo.outputPath('tree-select-lazy-success.png'), fullPage: false })

  await expect(root).toBeFocused()
  await root.press('ArrowRight')
  const child = panel.locator('[role="treeitem"][data-tree-key="lazy-child"]')
  await expect(child).toBeFocused()
  await child.click()
  await expect(lazy.getByRole('combobox')).toContainText('Loaded lazy child')
})

test('TreeSelect controlled rejection keeps the parent value after a real item switch', async ({ page }) => {
  const select = controlled(page)
  await select.getByRole('combobox').click()
  const panel = await panelFor(page, select)
  await expect(panel).toBeVisible()
  await panel.locator('[data-tree-key="node-00002"]').click()
  await expect(page.getByTestId('tree-select-virtual-events')).toContainText('last=node-00002')
  await expect(select.getByRole('combobox')).toContainText('Node 00001')
  await expect(select.getByRole('combobox')).not.toContainText('Node 00002')
})
