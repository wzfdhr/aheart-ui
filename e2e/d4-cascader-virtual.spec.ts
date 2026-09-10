import { expect, test, type Locator, type Page } from '@playwright/test'

const fixturePath = '/components/cascader?fixture=cascader-virtual'
const errors = new WeakMap<Page, string[]>()
const browserWarnings = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }, testInfo) => {
  const diagnostics: string[] = []
  const warnings: string[] = []
  errors.set(page, diagnostics)
  browserWarnings.set(page, warnings)
  page.on('pageerror', error => diagnostics.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    const text = message.text()
    const expectedFirefoxWarning = testInfo.project.name === 'desktop-firefox' && message.type() === 'warning' && text.includes('scroll-linked positioning effect')
    if (expectedFirefoxWarning) warnings.push(text)
    if (message.type() === 'error' || (message.type() === 'warning' && !expectedFirefoxWarning)) diagnostics.push(`console ${message.type()}: ${text}`)
  })
  await page.goto(fixturePath)
  await expect(page.getByTestId('cascader-virtual-fixture')).toBeVisible()
  await expect(page.getByTestId('cascader-virtual-main')).toBeVisible()
})

test.afterEach(async ({ page }, testInfo) => {
  const warnings = browserWarnings.get(page) ?? []
  if (warnings.length) await testInfo.attach('cascader-browser-warnings', { body: `${warnings.join('\n')}\n`, contentType: 'text/plain' })
  const diagnostics = errors.get(page) ?? []
  if (diagnostics.length) await testInfo.attach('cascader-browser-diagnostics', { body: `${diagnostics.join('\n')}\n`, contentType: 'text/plain' })
  expect(diagnostics).toEqual([])
})

function field(page: Page, testId: string) {
  return page.getByTestId(testId)
}

async function expectKeyboardFocusIndicator(locator: Locator) {
  await expect.poll(async () => locator.evaluate(element => {
    const style = getComputedStyle(element)
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }
})).toEqual({ outlineStyle: 'solid', outlineWidth: '2px' })
}

async function expectTextContrast(locator: Locator) {
  const colors = await locator.evaluate(element => {
    const parse = (value: string) => {
      const rgb = value.match(/rgba?\(([^)]+)\)/)?.[1].split(',').slice(0, 3).map(channel => Number(channel.trim()))
      if (rgb) return rgb
      const srgb = value.match(/color\(srgb\s+([^\s/]+)\s+([^\s/]+)\s+([^\s/]+)(?:\s*\/\s*[^)]+)?\)/i)
      if (!srgb) return []
      return [srgb[1], srgb[2], srgb[3]].map(channel => Number(channel) * 255)
    }
    const computed = getComputedStyle(element)
    return { foreground: parse(computed.color), background: parse(computed.backgroundColor) }
  })
  expect(colors.foreground).toHaveLength(3)
  expect(colors.background).toHaveLength(3)
  expect(colors.foreground.every(Number.isFinite)).toBe(true)
  expect(colors.background.every(Number.isFinite)).toBe(true)
  const ratio = await locator.evaluate((element, colors) => {
    const linear = (channel: number) => { const normalized = channel / 255; return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4 }
    const luminance = (value: number[]) => 0.2126 * linear(value[0]) + 0.7152 * linear(value[1]) + 0.0722 * linear(value[2])
    const foreground = luminance(colors.foreground)
    const background = luminance(colors.background)
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
  }, colors)
  console.log(JSON.stringify({ foreground: colors.foreground, background: colors.background, ratio }))
  expect(Number.isFinite(ratio)).toBe(true)
  expect(ratio).toBeGreaterThanOrEqual(4.5)
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
  const popup = await open(page, 'cascader-virtual-default')
  await expect(popup.locator('.aheart-cascader__option[data-cascader-column="0"]')).toHaveCount(1000)
})

test('virtual Cascader mounts at most 24 options per column for 1k and 10k siblings', async ({ page }) => {
  const count1000 = page.getByTestId('cascader-virtual-count-1000')
  await count1000.click()
  let popup = await open(page)
  let rows = popup.locator('.aheart-cascader__option[data-cascader-column="0"]')
  await expect.poll(() => rows.count()).toBeGreaterThan(0)
  expect(await rows.count()).toBeLessThanOrEqual(24)
  await field(page, 'cascader-virtual-main').getByRole('combobox').press('Escape')
  await page.getByTestId('cascader-virtual-count-10000').click()
  popup = await open(page)
  rows = popup.locator('.aheart-cascader__option[data-cascader-column="0"]')
  await expect.poll(() => rows.count()).toBeGreaterThan(0)
  expect(await rows.count()).toBeLessThanOrEqual(24)
  await expect(popup.locator('.aheart-cascader__column').first()).toHaveCSS('overflow-y', 'auto')
  await expect(field(page, 'cascader-virtual-main').getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
})

test('five columns keep logical 2k siblings virtualized with one vertical scroll owner per column', async ({ page }) => {
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
  for (const column of [0, 1, 2, 3, 4]) {
    const columnRows = popup.locator(`.aheart-cascader__option[data-cascader-column="${column}"]`)
    await expect.poll(() => columnRows.count()).toBeGreaterThan(0)
    expect(await columnRows.count()).toBeLessThanOrEqual(24)
  }
  const verticalOwners = await popup.evaluate(element => ({
    columns: Array.from(element.querySelectorAll<HTMLElement>('.aheart-cascader__column')).map(node => getComputedStyle(node).overflowY),
    popup: getComputedStyle(element).overflowY,
    columnsWrap: getComputedStyle(element.querySelector<HTMLElement>('.aheart-cascader__columns')!).overflowY
  }))
  expect(verticalOwners.columns).toEqual(['auto', 'auto', 'auto', 'auto', 'auto'])
  expect(verticalOwners.popup).not.toMatch(/^(auto|scroll)$/)
  expect(verticalOwners.columnsWrap).not.toMatch(/^(auto|scroll)$/)
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
  const lastEnabled = popup.locator('.aheart-cascader__option[data-cascader-value="sibling-998"]')
  await expect(lastEnabled).toBeFocused()
  await expectKeyboardFocusIndicator(lastEnabled)
  const disabledTail = popup.locator('.aheart-cascader__option[data-cascader-value="sibling-999"]')
  if (await disabledTail.count()) await expect(disabledTail).not.toBeFocused()
  await expect(trigger).not.toHaveAttribute('aria-activedescendant')
  await first.press('Enter')
})

test('search virtualizes 10k leaves, supports End+Enter, no-result and clear recovery', async ({ page }) => {
  await page.getByTestId('cascader-virtual-search-leaves').click()
  const popup = await open(page)
  const search = popup.getByRole('searchbox', { name: '搜索级联选项' })
  await search.fill('Search leaf 0')
  const searchRows = popup.locator('.aheart-cascader__search-results .aheart-cascader__option')
  const mountedSearchRows = await searchRows.count()
  expect(mountedSearchRows).toBeGreaterThan(0)
  expect(mountedSearchRows).toBeLessThanOrEqual(24)
  await search.press('End')
  await expect.poll(() => search.evaluate(element => ({ focused: element.ownerDocument.activeElement === element, end: (element as HTMLInputElement).selectionEnd === (element as HTMLInputElement).value.length }))).toEqual({ focused: true, end: true })
  await search.press('ArrowDown')
  let focusedResult = popup.locator('.aheart-cascader__search-results .aheart-cascader__option:focus')
  await expect(focusedResult).toHaveCount(1)
  await focusedResult.press('End')
  await expect(focusedResult).toContainText('Search leaf 09998')
  await expectKeyboardFocusIndicator(focusedResult)
  await search.focus()
  await search.fill('no-match-after-end')
  await expect(popup.getByRole('status')).toHaveText('暂无匹配选项')
  await expect(popup.locator('[data-virtual-scroll-owner="true"]')).toHaveCount(0)
  await expect(popup.locator('.aheart-cascader__search-results')).toHaveCount(0)
  await search.fill('Search leaf 0')
  await search.press('ArrowDown')
  focusedResult = popup.locator('.aheart-cascader__search-results .aheart-cascader__option:focus')
  await expect(focusedResult).toHaveCount(1)
  await focusedResult.press('End')
  await expect(focusedResult).toContainText('Search leaf 09998')
  await focusedResult.press('Enter')
  await expect(field(page, 'cascader-virtual-main').getByRole('combobox')).toContainText('Search leaf 09998')
  await field(page, 'cascader-virtual-main').getByRole('combobox').click()
  const reopened = await panel(page)
  await reopened.getByRole('searchbox', { name: '搜索级联选项' }).fill('no-match-anywhere')
  await expect(reopened.getByRole('status')).toHaveText('暂无匹配选项')
  await reopened.getByRole('searchbox', { name: '搜索级联选项' }).fill('')
  const recoveredRows = reopened.locator('.aheart-cascader__option[data-cascader-column="0"]')
  await expect.poll(() => recoveredRows.count()).toBeGreaterThan(0)
  expect(await recoveredRows.count()).toBeLessThanOrEqual(24)
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
  await reopened.locator('[data-cascader-value="duplicate-b"]').click()
  await expect(reopened.locator('[data-cascader-value="same-leaf"]')).not.toHaveClass(/is-selected/)
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
  const accepted = page.getByTestId('cascader-virtual-controlled-accepted')
  await expect(accepted).toContainText('accepted-path=["duplicate-a","same-leaf"]')
  await expect(accepted).toContainText('accepted-token=s:duplicate-a|s:same-leaf')
  await page.getByTestId('cascader-virtual-policy').click()
  popup = await open(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-b"]').click()
  await popup.locator('[data-cascader-value="same-leaf"]').click()
  await expect(controlled.getByRole('combobox')).toContainText('Same leaf')
  await expect(page.getByTestId('cascader-virtual-events')).toContainText('policy=reject')
  await expect(page.getByTestId('cascader-virtual-events')).toContainText('last=["duplicate-b","same-leaf"]')
  await expect(accepted).toContainText('accepted-path=["duplicate-a","same-leaf"]')
  await expect(accepted).toContainText('accepted-token=s:duplicate-a|s:same-leaf')
})

test('selected keyboard focus preserves the selected background and visible focus ring', async ({ page }) => {
  const controlled = field(page, 'cascader-virtual-controlled')
  const trigger = controlled.getByRole('combobox')
  await trigger.click()
  let popup = await panel(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-a"]').press('ArrowRight')
  await popup.locator('[data-cascader-value="same-leaf"]').press('Enter')
  await expect(trigger).toContainText('Same leaf')
  await trigger.click()
  popup = await panel(page, 'cascader-virtual-controlled')
  await popup.locator('[data-cascader-value="duplicate-a"]').click()
  const selected = popup.locator('[data-cascader-value="same-leaf"]')
  await selected.focus()
  await expect(selected).toHaveClass(/is-selected/)
  const style = await selected.evaluate(element => {
    const computed = getComputedStyle(element)
    return { background: computed.backgroundColor, outlineStyle: computed.outlineStyle, outlineWidth: computed.outlineWidth }
  })
  expect(style.background).toBe('rgb(230, 244, 255)')
  expect(style.outlineStyle).toBe('solid')
  expect(style.outlineWidth).toBe('2px')
})

test('lazy first failure, keyboard retry, stale replacement, abort, close and reopen remain safe', async ({ page }) => {
  const lazy = field(page, 'cascader-virtual-lazy')
  await lazy.getByRole('combobox').click()
  let popup = await panel(page, 'cascader-virtual-lazy')
  const root = popup.locator('[data-cascader-value="lazy-root"]')
  await root.focus()
  // Keep the first activation and retry on the page's active element. locator.press
  // would focus the row before dispatch and could hide a lost keyboard owner.
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('state=error; attempts=1')
  await expect(root).toBeFocused()
  await expectKeyboardFocusIndicator(root)
  await expectTextContrast(root)
  await page.keyboard.press('Enter')
  await expect.poll(() => page.getByTestId('cascader-virtual-lazy-state').textContent()).toContain('state=success')
  await expect(popup.locator('[data-cascader-value="lazy-child"]')).toBeFocused()
  await page.getByTestId('cascader-virtual-lazy-reset').click()
  await page.getByTestId('cascader-virtual-lazy-arm-replace').click()
  popup = await open(page, 'cascader-virtual-lazy')
  const replacementRoot = popup.locator('[data-cascader-value="lazy-root-1"]')
  await replacementRoot.click()
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('state=aborted')
  await expect(page.getByTestId('cascader-virtual-lazy-history')).toContainText('history=idle>loading>error>loading>success>loading>aborted')
  await expect(popup.locator('[data-cascader-value="lazy-child"]')).toHaveCount(0)
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('revision=2')
  popup = await open(page, 'cascader-virtual-lazy')
  const secondPendingRoot = popup.locator('[data-cascader-value="lazy-root-2"]')
  await expect(secondPendingRoot).toBeVisible()
  await secondPendingRoot.click()
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('state=loading')
  await lazy.getByRole('combobox').press('Escape')
  await expect(page.getByTestId('cascader-virtual-lazy-state')).toContainText('state=aborted')
  await expect((await open(page, 'cascader-virtual-lazy')).locator('[data-cascader-value="lazy-root-2"]')).toBeVisible()
})

test('narrow short viewport, font 24 and long labels keep dynamic geometry inside the panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 300 })
  await page.getByTestId('cascader-virtual-count-10000').click()
  await page.getByTestId('cascader-virtual-font').click()
  await page.getByTestId('cascader-virtual-labels').click()
  await page.getByTestId('cascader-virtual-viewport').click()
  const popup = await open(page)
  await expect(popup.getByRole('searchbox', { name: '搜索级联选项' })).toBeVisible()
  const geometry = await popup.evaluate(element => {
    const panelRect = element.getBoundingClientRect()
    const viewportRect = element.querySelector<HTMLElement>('.aheart-cascader__column')?.getBoundingClientRect()
    const rows = Array.from(element.querySelectorAll<HTMLElement>('.aheart-cascader__option[data-cascader-column="0"]'))
    return {
      mounted: rows.length,
      fontSize: rows[0] ? getComputedStyle(rows[0]).fontSize : '',
      panel: { top: panelRect.top, bottom: panelRect.bottom, left: panelRect.left, right: panelRect.right, width: panelRect.width, height: panelRect.height },
      viewport: viewportRect ? { top: viewportRect.top, bottom: viewportRect.bottom, left: viewportRect.left, right: viewportRect.right, width: viewportRect.width, height: viewportRect.height } : undefined,
      rows: rows.map(row => { const rect = row.getBoundingClientRect(); const title = row.querySelector<HTMLElement>(':scope > span'); const titleRect = title?.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, height: rect.height, titleHeight: titleRect?.height ?? 0 } })
    }
  })
  expect(geometry.mounted).toBeGreaterThan(0)
  expect(geometry.mounted).toBeLessThanOrEqual(24)
  expect(geometry.panel.width).toBeGreaterThan(0)
  expect(geometry.panel.height).toBeGreaterThan(0)
  expect(geometry.viewport?.width).toBeGreaterThan(0)
  expect(geometry.viewport?.height).toBeGreaterThan(0)
  expect(geometry.fontSize).toBe('24px')
  expect(geometry.rows.every(row => row.height > 0 && row.titleHeight > 0)).toBe(true)
  expect(geometry.rows.some(row => row.top <= geometry.viewport!.top && row.bottom >= geometry.viewport!.top)).toBe(true)
  expect(geometry.rows.some(row => row.top <= geometry.viewport!.bottom && row.bottom >= geometry.viewport!.bottom)).toBe(true)
  expect(geometry.rows.every((row, index) => index === 0 || row.top >= geometry.rows[index - 1].bottom - 1)).toBe(true)
  expect(geometry.rows.some(row => row.titleHeight > 24)).toBe(true)
})
