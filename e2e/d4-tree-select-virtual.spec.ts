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
  await expect(await panelFor(page, main(page))).toBeVisible()
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

test('TreeSelect virtual fixture bounds 1000/10000 rows while exposing checkable disabled selected tags', async ({ page }) => {
  await openMain(page)
  await expect(main(page).locator('.aheart-tree-select__tag:not(.aheart-tree-select__tag--rest)')).toHaveCount(2)
  await expect(main(page).locator('.aheart-tree-select__tag--rest')).toHaveText('+1')

  const first = await treeSnapshot(page)
  expect(first.rows).toBeLessThanOrEqual(24)
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
      fontSize: getComputedStyle(element).fontSize
    }
  })
  expect(geometry.ownerClasses).toHaveLength(1)
  expect(geometry.ownerClasses.some(value => value.split(/\s+/).includes('aheart-tree'))).toBe(true)
  expect(geometry.fontSize).toBe('24px')
  expect(geometry.treeScrollHeight).toBeGreaterThan(geometry.treeHeight)
  expect(geometry.treeHeight).toBeLessThanOrEqual(256)
  expect(geometry.panelBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
  expect(geometry.treeBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
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
