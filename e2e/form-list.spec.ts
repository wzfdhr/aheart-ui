import { expect, test, type Page } from '@playwright/test'

const fixturePath = '/components/form?fixture=form-list'
const runtimeErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(`console ${message.type()}: ${message.text()}`)
  })
  await page.goto(fixturePath)
  await expect(page.getByTestId('form-list-fixture')).toBeVisible()
  await expect(page.getByTestId('form-list-rows').locator('[data-field-key]')).toHaveCount(3)
})

test.afterEach(async ({ page }, testInfo) => {
  const errors = runtimeErrors.get(page) ?? []
  if (errors.length) await testInfo.attach('runtime-errors', { body: `${errors.join('\n')}\n`, contentType: 'text/plain' })
  expect(errors).toEqual([])
})

const rows = (page: Page) => page.getByTestId('form-list-rows').locator('[data-field-key]')
const order = async (page: Page) => rows(page).evaluateAll(elements => elements.map(element => element.getAttribute('data-row-id')))
const keys = async (page: Page) => rows(page).evaluateAll(elements => elements.map(element => element.getAttribute('data-field-key')))
const contrast = (page: Page, selector: string) => page.locator(selector).evaluate(element => {
  const parse = (value: string) => value.match(/rgba?\(([^)]+)\)/)?.[1].split(',').slice(0, 3).map(channel => Number(channel.trim())) ?? []
  const linear = (value: number) => { const channel = value / 255; return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4 }
  const luminance = (rgb: number[]) => 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2])
  const foreground = parse(getComputedStyle(element).color)
  let parent: Element | null = element
  let background = [255, 255, 255]
  while (parent) {
    const style = getComputedStyle(parent)
    const candidate = parse(style.backgroundColor)
    if (candidate.length === 3 && style.backgroundColor !== 'rgba(0, 0, 0, 0)') { background = candidate; break }
    parent = parent.parentElement
  }
  const a = luminance(foreground)
  const b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
})

test('add, insert, remove and move preserve surviving logical keys', async ({ page }) => {
  const initialKeys = await keys(page)
  expect(new Set(initialKeys).size).toBe(3)

  await page.getByTestId('form-list-insert').click()
  await expect.poll(() => order(page)).toEqual(['ada', 'insert-1', 'grace', 'linus'])
  const insertedKeys = await keys(page)
  expect(insertedKeys[0]).toBe(initialKeys[0])
  expect(insertedKeys[2]).toBe(initialKeys[1])
  expect(insertedKeys[3]).toBe(initialKeys[2])

  await page.getByTestId('form-list-remove-second').click()
  await expect.poll(() => order(page)).toEqual(['ada', 'grace', 'linus'])
  expect(await keys(page)).toEqual(initialKeys)

  await page.getByTestId('form-list-add').click()
  await expect.poll(() => order(page)).toEqual(['ada', 'grace', 'linus', 'append-2'])
  expect((await keys(page)).slice(0, 3)).toEqual(initialKeys)
})

test('focused move control and server error follow Grace through move and external reorder', async ({ page }) => {
  await page.getByTestId('form-list-server-error').click()
  const grace = rows(page).filter({ has: page.locator('[data-testid="move-up-grace"]') })
  const graceKey = await grace.getAttribute('data-field-key')
  await expect(grace.getByRole('alert')).toHaveText('Grace server error')

  const moveUp = page.getByTestId('move-up-grace')
  await moveUp.focus()
  await moveUp.press('Enter')
  await expect.poll(() => order(page)).toEqual(['grace', 'ada', 'linus'])
  await expect(page.getByTestId('move-down-grace')).toBeFocused()
  await expect(rows(page).first()).toHaveAttribute('data-field-key', graceKey!)
  await expect(rows(page).first().getByRole('alert')).toHaveText('Grace server error')

  await page.getByTestId('form-list-reverse').click()
  await expect.poll(() => order(page)).toEqual(['linus', 'ada', 'grace'])
  const movedGrace = rows(page).last()
  await expect(movedGrace).toHaveAttribute('data-field-key', graceKey!)
  await expect(movedGrace.getByRole('alert')).toHaveText('Grace server error')
  await page.screenshot({ path: test.info().outputPath('form-list-error-move.png'), fullPage: false })
})

test('nested phones, list rules and reset restore the initial rows with fresh keys', async ({ page }) => {
  const beforeReset = await keys(page)
  await page.getByTestId('phone-add-ada').click()
  await expect(rows(page).filter({ has: page.getByText('1 · ada', { exact: true }) }).getByRole('textbox', { name: /Phone \d · ada/ })).toHaveCount(2)
  await page.getByTestId('form-list-server-error').click()
  await expect(rows(page).filter({ has: page.getByText('2 · grace', { exact: true }) }).getByRole('alert')).toHaveText('Grace server error')
  expect(await contrast(page, '.form-list-fixture .aheart-form-item__help')).toBeGreaterThanOrEqual(4.5)

  await page.getByTestId('remove-linus').click()
  await page.getByTestId('remove-grace').click()
  await expect(rows(page)).toHaveCount(1)
  await expect(page.getByTestId('remove-ada')).toBeFocused()
  await expect(page.getByTestId('form-list-errors')).toHaveText('至少保留两位成员')
  expect(await contrast(page, '.form-list-fixture__list-error')).toBeGreaterThanOrEqual(4.5)

  await page.getByTestId('form-list-reset').click()
  await expect.poll(() => order(page)).toEqual(['ada', 'grace', 'linus'])
  await expect(page.getByTestId('form-list-errors')).toHaveCount(0)
  const afterReset = await keys(page)
  expect(afterReset).toHaveLength(3)
  expect(afterReset.every(key => !beforeReset.includes(key))).toBe(true)
})

test('narrow viewport keeps all operation controls and rows within the document', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 })
  await expect(page.getByTestId('form-list-fixture')).toBeVisible()
  await expect(page.getByTestId('form-list-add')).toBeVisible()
  await expect(page.getByTestId('remove-ada')).toBeVisible()
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    fixture: document.querySelector<HTMLElement>('[data-testid="form-list-fixture"]')?.getBoundingClientRect(),
    controls: Array.from(document.querySelectorAll<HTMLElement>('[data-testid="form-list-fixture"] button')).map(element => element.getBoundingClientRect())
  }))
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1)
  expect(geometry.fixture?.left ?? -1).toBeGreaterThanOrEqual(0)
  expect(geometry.fixture?.right ?? Infinity).toBeLessThanOrEqual(geometry.clientWidth + 1)
  for (const control of geometry.controls) {
    expect(control.left).toBeGreaterThanOrEqual(0)
    expect(control.right).toBeLessThanOrEqual(geometry.clientWidth + 1)
  }
  await page.screenshot({ path: test.info().outputPath('form-list-mobile.png'), fullPage: false })
})
