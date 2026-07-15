import { expect, test } from '@playwright/test'

test('InputNumber and Textarea demos expose live, editable state', async ({ page }) => {
  await page.goto('/components/input-number')
  const numberDemo = page.locator('.aheart-demo-panel').first()
  const numberInput = numberDemo.getByRole('spinbutton').first()
  await numberInput.fill('12')
  await numberInput.blur()
  await expect(numberInput).toHaveValue('10')

  await page.goto('/components/textarea')
  const countDemo = page.locator('.aheart-demo-panel').nth(1)
  const textarea = countDemo.locator('textarea')
  await textarea.fill('Aheart UI')
  await expect(countDemo.locator('.aheart-textarea__count')).toHaveText('9 / 120')
  await expect(textarea).not.toHaveAttribute('aria-invalid', 'true')
})

test('Select supports real popup selection, multiple removal, clear, and loading feedback', async ({ page }) => {
  await page.goto('/components/select')

  const basic = page.locator('.aheart-demo-panel').first()
  await basic.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Apple', exact: true }).click()
  await expect(basic.locator('.aheart-select__selection')).toContainText('Apple')

  const multiple = page.locator('.aheart-demo-panel').nth(1)
  await expect(multiple.locator('.aheart-select__tag')).toHaveCount(2)
  await multiple.getByRole('button', { name: 'Remove Apple' }).click()
  await expect(multiple.locator('.aheart-select__tag')).toHaveCount(1)
  await multiple.getByRole('button', { name: 'Clear' }).click()
  await expect(multiple.locator('.aheart-select__tag')).toHaveCount(0)

  const loading = page.locator('.aheart-select.is-loading')
  await expect(loading.locator('.aheart-select__loading')).toBeVisible()
  await expect(page.locator('.aheart-demo-panel select')).toHaveCount(0)
})

test('Checkbox and Switch expose native state, loading feedback, and keyboard operation', async ({ page }) => {
  await page.goto('/components/checkbox')
  const indeterminate = page.locator('.aheart-demo-panel').nth(1).getByRole('checkbox')
  await expect(indeterminate).toHaveJSProperty('indeterminate', true)
  await expect(indeterminate).toHaveAttribute('aria-checked', 'mixed')

  await page.goto('/components/switch')
  const textSwitch = page.locator('.aheart-demo-panel').nth(1).getByRole('switch').first()
  await expect(textSwitch).toContainText('On')
  await textSwitch.focus()
  await page.keyboard.press('Space')
  await expect(textSwitch).toHaveAttribute('aria-checked', 'false')
  await expect(textSwitch).toContainText('Off')
  await expect(page.locator('.aheart-switch.is-loading .aheart-icon--spin')).toBeVisible()

  const aliasSwitch = page.locator('.aheart-demo-panel').nth(2).getByRole('switch').first()
  const checkedHandleGap = await aliasSwitch.evaluate((element) => {
    const root = element.getBoundingClientRect()
    const handle = element.querySelector('.aheart-switch__handle')!.getBoundingClientRect()
    return Math.round(root.right - handle.right)
  })
  expect(checkedHandleGap).toBe(2)
})

test('InputNumber spinner preserves the visual order of addons and controls', async ({ page }) => {
  await page.goto('/components/input-number')
  const spinner = page.locator('.aheart-input-number--mode-spinner')
  const positions = await spinner.evaluate((element) => {
    const left = (selector: string) => element.querySelector(selector)!.getBoundingClientRect().left
    return [
      left('.aheart-input-number__addon-before'),
      left('.aheart-input-number__prefix'),
      left('.aheart-input-number__controls'),
      left('.aheart-input-number__control'),
      left('.aheart-input-number__suffix')
    ]
  })
  expect(positions).toEqual([...positions].sort((left, right) => left - right))
})

test('TimePicker defaults to one-minute steps and supports configured steps and confirmation', async ({ page }) => {
  await page.goto('/components/time-picker')

  const basicInput = page.locator('.aheart-demo-panel').nth(0).getByRole('combobox')
  await basicInput.focus()
  const minuteColumn = page.getByRole('listbox', { name: '分' })
  await expect(minuteColumn.getByRole('option')).toHaveCount(60)
  await expect(minuteColumn.getByRole('option', { name: '01', exact: true })).toBeVisible()
  const selectedMinuteIsVisible = await minuteColumn.evaluate((column) => {
    const viewport = column.getBoundingClientRect()
    const selected = column.querySelector('.is-selected')!.getBoundingClientRect()
    return selected.top >= viewport.top && selected.bottom <= viewport.bottom
  })
  expect(selectedMinuteIsVisible).toBe(true)
  await page.keyboard.press('Escape')

  const steppedInput = page.locator('.aheart-demo-panel').nth(1).getByRole('combobox')
  await steppedInput.focus()
  await expect(page.getByRole('listbox', { name: '分' }).getByRole('option')).toHaveCount(12)
  await expect(page.getByRole('listbox', { name: '秒' }).getByRole('option')).toHaveCount(6)
  await page.keyboard.press('Escape')

  const confirmInput = page.locator('.aheart-demo-panel').nth(2).getByRole('combobox')
  await confirmInput.focus()
  await page.getByRole('listbox', { name: '分' }).getByRole('option', { name: '31', exact: true }).click()
  await expect(confirmInput).toHaveValue('14:31:00')
  await page.getByRole('button', { name: '确定', exact: true }).click()
  await expect(confirmInput).toHaveValue('14:31:00')
})

test('Cascader and TreeSelect overlays align controls and remain marker-free', async ({ page }) => {
  await page.goto('/components/cascader')
  const cascader = page.locator('.aheart-demo-panel').first().locator('.aheart-cascader')
  await cascader.getByRole('combobox').click()
  await page.locator('[data-cascader-value="zhejiang"]').click()
  await page.locator('[data-cascader-value="hangzhou"]').click()
  await page.locator('[data-cascader-value="xihu"]').click()
  await expect(cascader.locator('.aheart-cascader__value')).toContainText('浙江 / 杭州 / 西湖')
  const arrowGap = await cascader.evaluate((element) => {
    const trigger = element.querySelector('.aheart-cascader__trigger')!.getBoundingClientRect()
    const arrow = element.querySelector('.aheart-cascader__arrow')!.getBoundingClientRect()
    return trigger.right - arrow.right
  })
  expect(arrowGap).toBeLessThanOrEqual(12)

  await page.goto('/components/tree-select')
  const treeSelect = page.locator('.aheart-demo-panel').first().locator('.aheart-tree-select')
  await treeSelect.getByRole('combobox').click()
  const treeItem = page.locator('.aheart-tree-select__panel li').first()
  await expect(treeItem).toBeVisible()
  await expect(treeItem).toHaveCSS('list-style-type', 'none')
})

test('Cascader reports lazy-loading progress before rendering loaded children', async ({ page }) => {
  await page.goto('/components/cascader')
  const lazy = page.locator('.aheart-demo-panel').nth(2).locator('.aheart-cascader')
  await lazy.getByRole('combobox').click()
  const option = page.locator('[data-cascader-value="china"]')
  await option.click()
  await expect(option).toHaveAttribute('aria-busy', 'true')
  await expect(option.locator('.aheart-icon--spin')).toBeVisible()
  await expect(page.locator('[data-cascader-value="shanghai"]')).toBeVisible()
  await expect(option).not.toHaveAttribute('aria-busy', 'true')
})

test('Q3 controls preserve sizing, status colors, theme states, and visible keyboard focus', async ({ page }) => {
  await page.goto('/components/select')
  const select = page.locator('.aheart-demo-panel').first().locator('.aheart-select')
  const selectSizing = await select.evaluate((element) => {
    const root = element.getBoundingClientRect()
    const selector = element.querySelector('.aheart-select__selector')!.getBoundingClientRect()
    return { root: root.width, selector: selector.width }
  })
  expect(Math.abs(selectSizing.root - selectSizing.selector)).toBeLessThanOrEqual(1)
  await select.evaluate((element) => {
    element.classList.remove('aheart-select--outlined')
    element.classList.add('aheart-select--underlined', 'aheart-select--error')
  })
  await expect(select.locator('.aheart-select__selector')).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')

  await page.goto('/components/textarea')
  const textarea = page.locator('.aheart-demo-panel').first().locator('.aheart-textarea')
  await textarea.evaluate((element) => {
    element.classList.remove('aheart-textarea--outlined')
    element.classList.add('aheart-textarea--underlined', 'aheart-textarea--error')
  })
  await expect(textarea.locator('textarea')).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')

  await page.goto('/components/input-number')
  const inputNumber = page.locator('.aheart-demo-panel').first().locator('.aheart-input-number').first()
  await inputNumber.evaluate((element) => {
    element.classList.remove('aheart-input-number--outlined')
    element.classList.add('aheart-input-number--underlined', 'aheart-input-number--error')
  })
  await expect(inputNumber).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')

  await page.goto('/components/checkbox')
  const checkbox = page.locator('.aheart-demo-panel').first().getByRole('checkbox').first()
  await checkbox.focus()
  const focusShadow = await checkbox.evaluate((element) =>
    getComputedStyle(element.nextElementSibling as HTMLElement).boxShadow
  )
  expect(focusShadow).not.toBe('none')

  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement)
    return ['--aheart-color-border-secondary', '--aheart-color-fill-secondary', '--aheart-color-primary-bg', '--aheart-color-text-disabled']
      .map((name) => style.getPropertyValue(name).trim())
  })
  expect(tokens.every(Boolean)).toBe(true)
})

test('coarse-pointer controls provide reachable touch targets and reveal cascader columns', async ({ page }) => {
  test.skip(!await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'Mobile coarse-pointer coverage')

  const expectTouchTarget = async (selector: string) => {
    const size = await page.locator(selector).first().evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    })
    expect(size.width).toBeGreaterThanOrEqual(44)
    expect(size.height).toBeGreaterThanOrEqual(44)
  }

  await page.goto('/components/input-number')
  await expectTouchTarget('.aheart-input-number__increase')

  await page.goto('/components/checkbox')
  await expectTouchTarget('.aheart-checkbox')

  await page.goto('/components/textarea')
  await expectTouchTarget('.aheart-textarea__clear')

  await page.goto('/components/time-picker')
  await page.locator('.aheart-demo-panel').nth(2).getByRole('combobox').focus()
  const timePanel = page.locator('.aheart-time-picker__panel')
  await expect(timePanel).toHaveClass(/is-entered/)
  await expect.poll(() => timePanel.evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)')
  await expectTouchTarget('.aheart-time-picker__footer button')

  await page.goto('/components/tree-select')
  await expectTouchTarget('.aheart-tree-select__trigger')
  await page.locator('.aheart-demo-panel').first().getByRole('combobox').click()
  const treePanel = page.locator('.aheart-tree-select__panel')
  await expect(treePanel).toHaveClass(/is-entered/)
  await expect.poll(() => treePanel.evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)')
  await expectTouchTarget('.aheart-tree__node')

  await page.goto('/components/cascader')
  const cascader = page.locator('.aheart-demo-panel').first().locator('.aheart-cascader')
  await expectTouchTarget('.aheart-cascader__trigger')
  await cascader.getByRole('combobox').click()
  const columns = page.locator('.aheart-cascader__columns')
  await page.locator('[data-cascader-value="zhejiang"]').click()
  await page.locator('[data-cascader-value="hangzhou"]').click()
  await expect.poll(() => columns.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)

  await page.goto('/components/select')
  await expectTouchTarget('.aheart-select__selector')
})
