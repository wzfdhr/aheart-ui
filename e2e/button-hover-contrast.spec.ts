import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('default outlined, dashed, link and text buttons keep AA text contrast when hovered', async ({ page }) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/button')
  const demo = page.locator('.aheart-demo-panel').first()

  for (const label of ['默认按钮', '虚线按钮', '链接按钮', '文本按钮']) {
    const button = demo.getByRole('button', { name: label, exact: true })
    await button.evaluate(element => element.setAttribute('data-hover-contrast-target', 'true'))
    for (const state of ['normal', 'hover']) {
      if (state === 'hover') await button.hover()
      else await page.mouse.move(0, 0)
      await expect.poll(() => button.evaluate(element => element.matches(':hover'))).toBe(state === 'hover')
      const audit = await new AxeBuilder({ page })
        .include('[data-hover-contrast-target]')
        .withRules(['color-contrast'])
        .analyze()
      expect(audit.violations, `${label}: ${state}`).toEqual([])
      expect(audit.incomplete, `${label}: ${state} must be measurable`).toEqual([])
    }
    await button.evaluate(element => element.removeAttribute('data-hover-contrast-target'))
  }
})

test('hover text token can be themed separately from the button border', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/button')
  const demo = page.locator('.aheart-demo-panel').first()
  await demo.evaluate(element => {
    const style = (element as HTMLElement).style
    style.setProperty('--aheart-color-primary-hover', '#4096ff')
    style.setProperty('--aheart-color-primary-text-hover', '#5b2182')
  })
  const button = demo.getByRole('button', { name: '默认按钮', exact: true })
  await button.hover()
  await expect(button).toHaveCSS('color', 'rgb(91, 33, 130)')
  await expect(button).toHaveCSS('border-top-color', 'rgb(64, 150, 255)')
})
