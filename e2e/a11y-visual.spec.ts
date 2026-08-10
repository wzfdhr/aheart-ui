import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

const gotoComponent = async (page: Page, component: string) => {
  await page.goto(`/components/${component}`)
  await page.waitForFunction(() => Boolean(document.title && document.documentElement.lang && document.querySelector('#app')?.textContent?.trim()))
}

const getComponentSurface = async (page: Page, component: string) => {
  const surfaceSelector = component === 'date-picker'
    ? '.aheart-date-picker'
    : component === 'table'
      ? '.q4-table-sort-demo'
      : '.aheart-demo-panel, .aheart-ai-workbench'
  const surface = page.locator(surfaceSelector).first()
  await expect(surface, `${component} should expose a component demo`).toBeVisible()
  if (component === 'table') {
    await expect(surface, 'table focus gate should target the interactive sorting demo').toHaveClass(/q4-table-sort-demo/)
  }
  return surface
}

const expectNoSeriousA11yViolations = async (page: Page, component: string) => {
  const target = await getComponentSurface(page, component)
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
  const surface = await getComponentSurface(page, component)
  const focusable = surface.locator('button:visible, input:visible, textarea:visible, select:visible, [role="button"]:visible, [role="combobox"]:visible, [tabindex="0"]:visible')
  const count = await focusable.count()
  expect(count, `${component} should expose at least one keyboard focus target`).toBeGreaterThan(0)
  let focusIndicatorFound = false
  for (let index = 0; index < count; index += 1) {
    const candidate = focusable.nth(index)
    await candidate.focus()
    const focusStyle = await candidate.evaluate((element: HTMLElement) => {
      const candidates = [element, element.closest('.aheart-input, .aheart-select, .aheart-date-picker, .aheart-time-picker')].filter(Boolean) as HTMLElement[]
      return candidates.map((candidate) => {
        const style = getComputedStyle(candidate)
        return { outlineStyle: style.outlineStyle, boxShadow: style.boxShadow }
      })
    })
    if (focusStyle.some(({ outlineStyle, boxShadow }) => outlineStyle !== 'none' || boxShadow !== 'none')) {
      await expect(candidate).toBeFocused()
      focusIndicatorFound = true
      break
    }
  }
  expect(focusIndicatorFound, `${component} focus indicator missing`).toBe(true)
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

  test('Select opens, selects with the keyboard, and restores focus on Escape', async ({ page }) => {
    await gotoComponent(page, 'select')
    const surface = await getComponentSurface(page, 'select')
    const select = surface.getByRole('combobox').first()

    await select.focus()
    await expect(select).toBeFocused()
    await select.press('ArrowDown')
    await expect(select).toHaveAttribute('aria-expanded', 'true')
    await select.press('ArrowDown')
    await select.press('Enter')
    await expect(select).toHaveAttribute('aria-expanded', 'false')
    await expect(select).toContainText('Apple')

    await select.press('ArrowDown')
    await expect(select).toHaveAttribute('aria-expanded', 'true')
    await select.press('Escape')
    await expect(select).toHaveAttribute('aria-expanded', 'false')
    await expect(select).toBeFocused()
  })

  test('Menu supports real directional navigation, Enter selection, and Escape', async ({ page }) => {
    await gotoComponent(page, 'menu')
    const surface = await getComponentSurface(page, 'menu')
    const menu = surface.locator('.aheart-menu').first()
    const firstItem = menu.locator('[data-menu-key="dashboard"]')

    await firstItem.focus()
    await firstItem.press('ArrowDown')
    const activeItem = menu.locator('[data-menu-key]:focus, [data-submenu-key]:focus')
    await expect(activeItem).toHaveCount(1)
    const activeKey = await activeItem.getAttribute('data-menu-key')
    await activeItem.press('ArrowRight')
    await menu.locator('[data-menu-key]:focus, [data-submenu-key]:focus').press('Enter')
    await expect(menu.locator(`.is-selected [data-menu-key="${activeKey}"]`)).toHaveCount(1)
    await menu.locator('[data-menu-key]:focus, [data-submenu-key]:focus').press('Escape')
    await expect(menu.locator(`[data-menu-key="${activeKey}"]`)).toBeFocused()
  })

  test('Table sort button responds to keyboard activation', async ({ page }) => {
    await gotoComponent(page, 'table')
    const surface = await getComponentSurface(page, 'table')
    const sortButton = surface.getByRole('button', { name: /Age/ })

    await sortButton.focus()
    await expect(sortButton).toBeFocused()
    await sortButton.press('Enter')
    await expect(surface.locator('tbody tr').first()).toContainText('Linus')
    await sortButton.press('Space')
    await expect(surface.locator('tbody tr').first()).toContainText('Ada')
  })

  test('Splitter separator adjusts from the keyboard and updates aria-valuenow', async ({ page }) => {
    await gotoComponent(page, 'splitter')
    const surface = await getComponentSurface(page, 'splitter')
    const separator = surface.locator('[role="separator"]').first()
    const before = await separator.getAttribute('aria-valuenow')

    await separator.focus()
    await separator.press('ArrowRight')
    await expect(separator).toHaveAttribute('aria-valuenow', String(Number(before) + 10))
    await separator.press('ArrowLeft')
    await expect(separator).toHaveAttribute('aria-valuenow', before ?? '')
  })

  test('Chinese long copy remains within the viewport at 200 percent zoom', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      await page.evaluate(() => document.documentElement.style.zoom = '200%')
      const overflow = await surface.evaluate((element) => ({ viewport: element.clientWidth, content: element.scrollWidth }))
      expect(overflow.content, `${component} overflows horizontally at 200%`).toBeLessThanOrEqual(overflow.viewport)
    }
  })

  test('target panel text and controls remain visible and operable at 200 percent zoom', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await gotoComponent(page, 'ai-agent-workbench')
    const surface = await getComponentSurface(page, 'ai-agent-workbench')
    await page.evaluate(() => { document.documentElement.style.zoom = '200%' })

    const targetPanel = surface.locator('.aheart-ai-workbench__main, .aheart-ai-workbench__execution, .aheart-ai-workbench__artifact').filter({ hasText: /任务|执行|产物/ }).first()
    await expect(targetPanel).toBeVisible()
    const operableButton = targetPanel.locator('button:not([disabled])').first()
    await expect(operableButton).toBeVisible()
    await operableButton.focus()
    await expect(operableButton).toBeFocused()
  })

  test('desktop component surface screenshots match baselines', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      await expect(surface).toHaveScreenshot(`${component}-desktop-1440x900.png`, { animations: 'disabled' })
    }
  })

  test('mobile component surface screenshots match baselines', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      await expect(surface).toHaveScreenshot(`${component}-mobile-390x844.png`, { animations: 'disabled' })
    }
  })

  test('reduced motion disables transition and animation durations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      const motion = await surface.evaluate((target) => {
        const elements = [target, ...target.querySelectorAll<HTMLElement>('*')]
        return elements.flatMap((element) => {
          const style = getComputedStyle(element)
          return [style.animationDuration, style.transitionDuration]
        }).filter((duration) => Number.parseFloat(duration) > 0.01)
      })
      expect(motion, `${component} retains motion under prefers-reduced-motion`).toEqual([])
    }
  })
})
