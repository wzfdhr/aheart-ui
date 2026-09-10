import { expect, test, type Page } from '@playwright/test'

const fixturePath = '/components/cascader?fixture=cascader-virtual'
const errors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = []
  errors.set(page, diagnostics)
  page.on('pageerror', error => diagnostics.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') diagnostics.push(`console ${message.type()}: ${message.text()}`)
  })
  await page.goto(fixturePath)
  await expect(page.getByTestId('cascader-virtual-fixture')).toBeVisible()
  await expect(page.getByTestId('cascader-virtual-main')).toBeVisible()
})

test.afterEach(async ({ page }, testInfo) => {
  const diagnostics = errors.get(page) ?? []
  if (diagnostics.length) await testInfo.attach('cascader-browser-diagnostics', { body: `${diagnostics.join('\n')}\n`, contentType: 'text/plain' })
  expect(diagnostics).toEqual([])
})

function field(page: Page, testId: string) {
  return page.getByTestId(testId)
}

async function panel(page: Page, testId = 'cascader-virtual-main') {
  const root = field(page, testId)
  await expect(root.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  const id = await root.getByRole('combobox').getAttribute('aria-controls')
  return page.locator(`#${id}`)
}

async function open(page: Page, testId = 'cascader-virtual-main') {
  const root = field(page, testId)
  const trigger = root.getByRole('combobox')
  if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click()
  return panel(page, testId)
}

test('default Cascader remains full-DOM compatible while the opt-in fixture exposes a virtual contract', async ({ page }) => {
  const popup = await open(page)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(1000)
  await expect(field(page, 'cascader-virtual-main').getByRole('combobox')).toHaveAttribute('aria-activedescendant', /.+/)
})

test('virtual Cascader mounts at most 24 options per column for 1k and 10k siblings', async ({ page }) => {
  const count1000 = page.getByTestId('cascader-virtual-count-1000')
  await count1000.click()
  let popup = await open(page)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(24)
  await field(page, 'cascader-virtual-main').getByRole('combobox').press('Escape')
  await page.getByTestId('cascader-virtual-count-10000').click()
  popup = await open(page)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(24)
  await expect(popup.locator('[data-cascader-column="0"]')).toHaveCSS('overflow-y', 'auto')
})

test('five columns keep logical 2k siblings virtualized and use one vertical scroll owner', async ({ page }) => {
  await page.getByTestId('cascader-virtual-five-columns').click()
  const popup = await open(page)
  const columns = popup.locator('.aheart-cascader__column')
  await expect(columns).toHaveCount(1)
  for (let column = 0; column < 4; column++) {
    const first = popup.locator(`.aheart-cascader__option[data-cascader-column="${column}"]`).first()
    await first.press('Enter')
    await expect.poll(() => popup.locator('.aheart-cascader__column').count()).toBe(column + 2)
  }
  await expect(popup.locator('.aheart-cascader__column')).toHaveCount(5)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(24)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="1"]')).toHaveCount(24)
  const verticalOwners = await popup.evaluate(element => Array.from(element.querySelectorAll<HTMLElement>('*')).filter(node => ['auto', 'scroll'].includes(getComputedStyle(node).overflowY)).length)
  expect(verticalOwners).toBe(1)
})

test('keyboard navigation reaches real focus, disabled tail, End, Left/Right and Enter', async ({ page }) => {
  await page.getByTestId('cascader-virtual-count-1000').click()
  const popup = await open(page)
  const trigger = field(page, 'cascader-virtual-main').getByRole('combobox')
  const first = popup.locator('.aheart-cascader__option[data-cascader-column="0"]').first()
  await first.focus()
  await expect(first).toBeFocused()
  await first.press('ArrowRight')
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="1"]').first()).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(first).toBeFocused()
  await first.press('End')
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]').last()).toBeFocused()
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]').last()).toHaveAttribute('aria-disabled', 'true')
  await expect(trigger).toHaveAttribute('aria-activedescendant', /.+/)
  await first.press('Enter')
})

test('search virtualizes 10k leaves, supports End+Enter, no-result and clear recovery', async ({ page }) => {
  await page.getByTestId('cascader-virtual-search-leaves').click()
  const popup = await open(page)
  const search = popup.getByRole('searchbox', { name: '搜索级联选项' })
  await search.fill('Search leaf 0001')
  await expect(popup.locator('.aheart-cascader__search-results .aheart-cascader__option')).toHaveCount(1)
  await search.press('End')
  await search.press('Enter')
  await expect(field(page, 'cascader-virtual-main').getByRole('combobox')).toContainText('Search leaf 0001')
  await field(page, 'cascader-virtual-main').getByRole('combobox').click()
  const reopened = await panel(page)
  await reopened.getByRole('searchbox', { name: '搜索级联选项' }).fill('no-match-anywhere')
  await expect(reopened.getByRole('status')).toHaveText('暂无匹配选项')
  await reopened.getByRole('searchbox', { name: '搜索级联选项' }).fill('')
  await expect(reopened.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(24)
})

test('typed paths and duplicate leaf paths retain identity when switching branches', async ({ page }) => {
  const controlled = field(page, 'cascader-virtual-controlled')
  await controlled.getByRole('combobox').click()
  const popup = await panel(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-a"]').press('ArrowRight')
  await expect(popup.locator('[data-cascader-value="same-leaf"]')).toHaveCount(1)
  await popup.locator('[data-cascader-value="same-leaf"]').press('Enter')
  await expect(page.getByTestId('cascader-virtual-events')).toContainText('duplicate-a')
  await controlled.getByRole('combobox').click()
  const reopened = await panel(page, 'cascader-virtual-controlled')
  await expect(reopened.locator('[data-cascader-value="duplicate-a"]')).toHaveAttribute('data-cascader-token', /.+/)
  await expect(reopened.locator('[data-cascader-token="n-31"]')).toHaveCount(1)
  await expect(reopened.locator('[data-cascader-token="s-31"]')).toHaveCount(1)
  await reopened.locator('[data-cascader-token="n-31"]').press('ArrowRight')
  await reopened.locator('[data-cascader-value="typed-leaf"]').press('Enter')
  await expect(page.getByTestId('cascader-virtual-events')).toContainText('[1,"typed-leaf"]')
})

test('controlled accept and reject policies are observable and do not desynchronize focus', async ({ page }) => {
  const controlled = field(page, 'cascader-virtual-controlled')
  await controlled.getByRole('combobox').click()
  let popup = await panel(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-a"]').click()
  await popup.locator('[data-cascader-value="same-leaf"]').click()
  await expect(controlled.getByRole('combobox')).toContainText('Same leaf')
  await page.getByTestId('cascader-virtual-policy').click()
  await controlled.getByRole('combobox').click()
  popup = await panel(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-b"]').click()
  await popup.locator('[data-cascader-value="same-leaf"]').click()
  await expect(controlled.getByRole('combobox')).toContainText('Same leaf')
  await expect(page.getByTestId('cascader-virtual-events')).toContainText('policy=reject')
})

test('lazy first failure, keyboard retry, stale replacement, abort, close and reopen remain safe', async ({ page }) => {
  const lazy = field(page, 'cascader-virtual-lazy')
  await lazy.getByRole('combobox').click()
  let popup = await panel(page, 'cascader-virtual-lazy')
  const root = popup.locator('[data-cascader-value="lazy-root"]')
  await root.click()
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('state=error; attempts=1')
  await root.press('Enter')
  await expect.poll(() => page.getByTestId('cascader-virtual-lazy-state').textContent()).toContain('state=success')
  await expect(popup.locator('[data-cascader-value="lazy-child"]')).toHaveCount(1)
  await page.getByTestId('cascader-virtual-lazy-replace').click()
  await page.getByTestId('cascader-virtual-lazy-close').click()
  await lazy.getByRole('combobox').click()
  popup = await panel(page, 'cascader-virtual-lazy')
  await expect(popup).toBeVisible()
  await page.getByTestId('cascader-virtual-lazy-abort').click()
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText(/state=(aborted|idle)/)
})

test('narrow short viewport, font 24 and long labels keep dynamic geometry inside the panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 300 })
  await page.getByTestId('cascader-virtual-count-10000').click()
  await page.getByTestId('cascader-virtual-font').click()
  await page.getByTestId('cascader-virtual-labels').click()
  await page.getByTestId('cascader-virtual-viewport').click()
  const popup = await open(page)
  await expect(popup.getByRole('searchbox', { name: '搜索级联选项' })).toBeVisible()
  const panelRect = await popup.boundingBox()
  const triggerRect = await field(page, 'cascader-virtual-main').getByRole('combobox').boundingBox()
  expect(panelRect && triggerRect && panelRect.width).toBeGreaterThan(0)
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(24)
})
