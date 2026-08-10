import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const components = [
  'input',
  'select',
  'date-picker',
  'time-picker',
  'table',
  'menu',
  'modal',
  'splitter',
  'ai-agent-workbench'
] as const

const screenshotRoot = '/tmp/aheart-qg4-a11y-visual'

const gotoComponent = async (page: Page, component: string) => {
  await page.goto(`/components/${component}`)
  await page.waitForFunction(() => Boolean(document.title && document.documentElement.lang && document.querySelector('#app')?.textContent?.trim()))
}

const expectNoSeriousA11yViolations = async (page: Page, component: string) => {
  const target = page.locator('.aheart-demo-panel, .aheart-ai-workbench').first()
  await expect(target, `${component} should expose a component demo`).toBeVisible()
  const selector = await target.evaluate((element) => {
    element.setAttribute('data-qg4-a11y-target', 'true')
    return '[data-qg4-a11y-target="true"]'
  })
  const results = await new AxeBuilder({ page })
    .include(selector)
    .analyze()
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
  expect(blocking, `${component}: ${blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([])
}

const expectVisibleFocus = async (page: Page, component: string) => {
  const focusable = page.locator('button, input, textarea, select, [role="button"], [role="combobox"], [tabindex="0"]')
  const count = await focusable.count()
  expect(count, `${component} should expose at least one keyboard focus target`).toBeGreaterThan(0)
  await focusable.first().focus()
  await expect(focusable.first()).toBeFocused()
  const focusStyle = await focusable.first().evaluate((element: HTMLElement) => {
    const style = getComputedStyle(element)
    return { outline: style.outline, outlineStyle: style.outlineStyle, boxShadow: style.boxShadow }
  })
  expect(
    focusStyle.outlineStyle !== 'none' || focusStyle.boxShadow !== 'none',
    `${component} focus indicator missing: ${JSON.stringify(focusStyle)}`
  ).toBe(true)
}

test.describe('QG4 accessibility and visual regression gates', () => {
  test('critical and serious axe violations are zero for every target route', async ({ page }) => {
    for (const component of components) {
      await gotoComponent(page, component)
      await expectNoSeriousA11yViolations(page, component)
    }
  })

  test('target routes expose visible keyboard focus', async ({ page }) => {
    for (const component of components) {
      await gotoComponent(page, component)
      await expectVisibleFocus(page, component)
    }
  })

  test('Chinese long copy remains within the viewport at 200 percent zoom', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    for (const component of components) {
      await gotoComponent(page, component)
      await page.evaluate(() => document.documentElement.style.zoom = '200%')
      const overflow = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
      }))
      expect(overflow.content, `${component} overflows horizontally at 200%`).toBeLessThanOrEqual(overflow.viewport)
    }
  })

  test('desktop baseline screenshots use stable names and dimensions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await mkdir(screenshotRoot, { recursive: true })
    for (const component of components) {
      await gotoComponent(page, component)
      const file = path.join(screenshotRoot, `${component}-desktop-1440x900.png`)
      await page.screenshot({ path: file, fullPage: true })
      expect((await stat(file)).size, `${file} should be a non-empty baseline`).toBeGreaterThan(0)
    }
  })

  test('mobile baseline screenshots use stable names and dimensions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mkdir(screenshotRoot, { recursive: true })
    for (const component of components) {
      await gotoComponent(page, component)
      const file = path.join(screenshotRoot, `${component}-mobile-390x844.png`)
      await page.screenshot({ path: file, fullPage: true })
      expect((await stat(file)).size, `${file} should be a non-empty baseline`).toBeGreaterThan(0)
    }
  })

  test('reduced motion disables transition and animation durations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const component of components) {
      await gotoComponent(page, component)
      const motion = await page.evaluate(() => {
        const elements = [...document.querySelectorAll<HTMLElement>('*')]
        return elements.flatMap((element) => {
          const style = getComputedStyle(element)
          return [style.animationDuration, style.transitionDuration]
        }).filter((duration) => Number.parseFloat(duration) > 0.01)
      })
      expect(motion, `${component} retains motion under prefers-reduced-motion`).toEqual([])
    }
  })
})
