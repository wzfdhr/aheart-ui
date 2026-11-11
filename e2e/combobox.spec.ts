import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('Combobox filters, selects and dismisses while preserving native focus', async ({ page }, testInfo) => {
  await page.goto('/components/combobox')
  const input = page.getByRole('combobox', { name: '城市' })
  const list = page.getByRole('listbox', { name: '城市' })
  const next = page.getByRole('textbox', { name: '街道' })
  const selected = page.locator('output')

  await input.click()
  await expect(list.getByRole('option')).toHaveCount(4)
  await expect(list.getByRole('option', { name: '南京 Nanjing' })).toHaveAttribute('aria-disabled', 'true')
  await input.press('ArrowDown')
  await input.press('ArrowDown')
  const shanghai = list.getByRole('option', { name: '上海 Shanghai' })
  await expect(input).toHaveAttribute('aria-activedescendant', (await shanghai.getAttribute('id'))!)
  await expect(input).toBeFocused()
  if (testInfo.project.name === 'desktop') {
    const result = await new AxeBuilder({ page }).include('.aheart-combobox').include('.aheart-combobox__popup').analyze()
    expect(result.violations).toEqual([])
  }
  await input.press('Enter')
  await expect(selected).toHaveText('shanghai')
  await expect(input).toHaveValue('上海 Shanghai')
  await expect(input).toBeFocused()
  await expect(list).toBeHidden()

  await input.fill('SHEN')
  await expect(list.getByRole('option')).toHaveCount(1)
  await list.getByRole('option', { name: '深圳 Shenzhen' }).click()
  await expect(selected).toHaveText('shenzhen')
  await expect(input).toBeFocused()
  await input.fill('zzz')
  await expect(page.getByText('没有匹配的城市')).toBeVisible()
  await input.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await expect(input).toHaveValue('深圳 Shenzhen')
  await expect(input).toBeFocused()
  await expect(page.locator('.aheart-combobox__popup')).toHaveCount(0)

  await input.press('ArrowUp')
  await expect(list).toBeVisible()
  await input.press('Tab')
  await expect(next).toBeFocused()
  await expect(list).toBeHidden()
})
