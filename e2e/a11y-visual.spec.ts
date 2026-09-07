import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { execFileSync } from 'node:child_process'
import { qg4EvidenceCoverage } from '../docs/.vitepress/data/quality-evidence-policy.mjs'

const a11yComponents = qg4EvidenceCoverage.a11y
const components = qg4EvidenceCoverage.visual

const gotoComponent = async (page: Page, component: string) => {
  await page.goto(`/components/${component}`)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('#app')).toContainText(/./)
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
  const axe = new AxeBuilder({ page }).include(selector)
  if (component === 'select') {
    const combobox = target.getByRole('combobox').first()
    await combobox.focus()
    await combobox.click()
    await expect(page.locator('[role="listbox"]:visible').first()).toBeVisible()
    axe.include('[role="listbox"]')
  }
  const results = await axe.analyze()
  if (component === 'select') {
    await target.getByRole('combobox').first().press('Escape')
  }
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
  expect(blocking, `${component}: ${blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([])
}

const expectNoSeriousViolationsIn = async (page: Page, selector: string, label: string) => {
  const results = await new AxeBuilder({ page }).include(selector).analyze()
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
  expect(blocking, `${label}: ${blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([])
}

const expectDrawerSettled = async (page: Page) => {
  const drawer = page.locator('.aheart-drawer:visible').last()
  await expect(drawer).toHaveClass(/is-entered/)
  await expect.poll(() => drawer.locator('.aheart-drawer__panel').evaluate((panel) => getComputedStyle(panel).opacity)).toBe('1')
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
    for (const component of a11yComponents) {
      await gotoComponent(page, component)
      await expectNoSeriousA11yViolations(page, component)
    }
  })

  test('critical and serious axe violations are zero for opened overlays', async ({ page }) => {
    await gotoComponent(page, 'modal')
    await page.getByRole('region', { name: '对话框交互工作台' }).getByRole('button', { name: '打开异步对话框', exact: true }).click()
    await expect(page.getByRole('dialog', { name: '异步确认' })).toBeVisible()
    await expectNoSeriousViolationsIn(page, '.aheart-modal', 'modal overlay')

    await gotoComponent(page, 'drawer')
    await page.getByRole('button', { name: 'Open drawer', exact: true }).first().click()
    await expect(page.getByRole('dialog', { name: 'Account details' })).toBeVisible()
    await expectDrawerSettled(page)
    await expectNoSeriousViolationsIn(page, '.aheart-drawer', 'drawer overlay')

    await page.setViewportSize({ width: 390, height: 844 })
    await gotoComponent(page, 'ai-agent-workbench')
    await page.getByRole('tab', { name: '执行' }).click()
    await page.getByRole('button', { name: '查看执行与产物' }).click()
    await expect(page.getByRole('dialog', { name: '执行与产物' })).toBeVisible()
    await expectDrawerSettled(page)
    await expectNoSeriousViolationsIn(page, '.aheart-drawer', 'AI Workbench execution overlay')
  })

  test('evidence manifest binds QG4 coverage to the project and reviewed commit', async ({}, testInfo) => {
    const reviewedSha = process.env.AHEART_EVIDENCE_SHA
      ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    expect(reviewedSha).toMatch(/^[0-9a-f]{40}$/)

    await testInfo.attach('qg4-evidence-manifest.json', {
      body: Buffer.from(JSON.stringify({
        schemaVersion: 'aheart-qg4-evidence.v1',
        commit: {
          sha: reviewedSha,
          repository: process.env.GITHUB_REPOSITORY ?? 'local'
        },
        project: testInfo.project.name,
        spec: 'e2e/a11y-visual.spec.ts',
        coverage: qg4EvidenceCoverage
      }, null, 2)),
      contentType: 'application/json'
    })
  })

  test('production routes hydrate without Vue warnings or hydration mismatches', async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() !== 'warning' && message.type() !== 'error') return
      const text = message.text()
      if (/\[Vue warn\]|hydration|mismatch/i.test(text)) consoleErrors.push(text)
    })
    page.on('pageerror', (error) => pageErrors.push(error.message))

    for (const component of ['select', 'date-picker', 'time-picker', 'modal', 'drawer'] as const) {
      await gotoComponent(page, component)
      await getComponentSurface(page, component)

      if (component === 'select') {
        const combobox = page.getByRole('combobox').first()
        await combobox.click()
        await expect(page.locator('[role="listbox"]:visible').first()).toBeVisible()
        await combobox.press('Escape')
      }
      if (component === 'date-picker') {
        const input = page.locator('.aheart-date-picker input').first()
        await input.click()
        await expect(page.locator('.aheart-date-picker__panel.is-entered').first()).toBeVisible()
        await input.press('Escape')
      }
      if (component === 'time-picker') {
        const input = page.locator('.aheart-time-picker input').first()
        await input.click()
        await expect(page.locator('.aheart-time-picker__panel.is-entered').first()).toBeVisible()
        await input.press('Escape')
      }
      if (component === 'modal') {
        const opener = page.getByRole('region', { name: '对话框交互工作台' }).getByRole('button', { name: '打开异步对话框', exact: true })
        await opener.click()
        await expect(page.getByRole('dialog', { name: '异步确认' })).toBeVisible()
        await page.keyboard.press('Escape')
      }
      if (component === 'drawer') {
        const opener = page.getByRole('button', { name: 'Open drawer', exact: true }).first()
        await opener.click()
        await expect(page.getByRole('dialog', { name: 'Account details' })).toBeVisible()
        await page.keyboard.press('Escape')
      }
    }

    await page.setViewportSize({ width: 390, height: 844 })
    await gotoComponent(page, 'ai-agent-workbench')
    await page.getByRole('tab', { name: '执行' }).click()
    await page.getByRole('button', { name: '查看执行与产物' }).click()
    await expect(page.getByRole('dialog', { name: '执行与产物' })).toBeVisible()

    expect(consoleErrors, `hydration warnings detected:\n${consoleErrors.join('\n')}`).toEqual([])
    expect(pageErrors, `runtime errors detected:\n${pageErrors.join('\n')}`).toEqual([])
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

  test('Splitter mobile separator keeps a visual line while exposing a touch hit area', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Touch target assertions only apply to mobile projects.')
    await gotoComponent(page, 'splitter')
    const surface = await getComponentSurface(page, 'splitter')
    const separator = surface.locator('[role="separator"]').first()
    const box = await separator.boundingBox()
    expect(box).not.toBeNull()
    const x = box!.x - 12
    const y = box!.y + box!.height / 2
    const hitTarget = await page.evaluate(({ x, y }) => {
      const target = document.elementFromPoint(x, y)
      return target?.closest('[role="separator"]')?.getAttribute('role') ?? null
    }, { x, y })
    expect(hitTarget).toBe('separator')

    const before = Number(await separator.getAttribute('aria-valuenow'))
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 20, y, { steps: 4 })
    await page.mouse.up()
    await expect(separator).toHaveAttribute('aria-valuenow', String(before + 20))
  })

  test('Chinese long copy remains within the viewport at 200 percent zoom', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      const overflow = await surface.evaluate((element) => ({ viewport: element.clientWidth, content: element.scrollWidth }))
      expect(overflow.content, `${component} overflows horizontally at 200%`).toBeLessThanOrEqual(overflow.viewport)
      const outOfViewport = await surface.evaluate((element) => {
        const viewportRight = document.documentElement.clientWidth
        return Array.from(element.querySelectorAll<HTMLElement>('button, input, textarea, select, [role="button"], [role="combobox"], h1, h2, h3, p, label'))
          .filter((candidate) => {
            const style = getComputedStyle(candidate)
            return style.display !== 'none' && style.visibility !== 'hidden'
          })
          .map((candidate) => candidate.getBoundingClientRect())
          .filter((rect) => rect.left < -1 || rect.right > viewportRight + 1)
          .map((rect) => ({ left: Math.round(rect.left), right: Math.round(rect.right) }))
      })
      expect(outOfViewport, `${component} has visible content outside the viewport at 200%`).toEqual([])
    }
  })

  test('target panel text and controls remain visible and operable at 200 percent zoom', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 })
    await gotoComponent(page, 'ai-agent-workbench')
    const surface = await getComponentSurface(page, 'ai-agent-workbench')

    const targetPanel = surface.locator('.aheart-ai-workbench__chat:visible, .aheart-ai-workbench__mobile-panel:visible, .aheart-ai-workbench__execution:visible').first()
    await expect(targetPanel).toBeVisible()
    const operableButton = targetPanel.locator('button:not([disabled])').first()
    await expect(operableButton).toBeVisible()
    await operableButton.focus()
    await expect(operableButton).toBeFocused()
  })

  test('AI Workbench exposes the execution and artifact state on mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'The execution drawer visual evidence is owned by the mobile project.')
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoComponent(page, 'ai-agent-workbench')
    const workbench = page.locator('.aheart-ai-workbench').first()
    await workbench.getByRole('tab', { name: '执行' }).click()
    await workbench.getByRole('button', { name: '查看执行与产物', exact: true }).click()
    const drawer = page.getByRole('dialog', { name: '执行与产物' })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('region', { name: '移动端优先处理' })).toBeVisible()
    const priority = drawer.getByRole('region', { name: '移动端优先处理' })
    await expect(priority).toContainText('等待审批')
    await expect(priority).toContainText('审批对象')
    await expect(priority).toContainText('产品方案.md')
    const approveButton = priority.locator('button[data-action="approve"]')
    await expect(approveButton).toBeVisible()
    await approveButton.click()
    await expect(priority).toContainText('已批准')
    await expect(workbench.locator('[data-pending-approval-summary]')).toHaveCount(0)
    await expect(workbench.locator('.aheart-ai-workbench__pending-badge')).toHaveCount(0)
    await expect(drawer.locator('[data-task-id="publish"] .aheart-ai-workbench__task-status')).toContainText('已批准')
    await drawer.getByRole('button', { name: /来源数据\.csv/ }).click()
    await expect(priority).toContainText('结构化来源清单')
    await expect(priority).toContainText('审批对象')
    await expect(drawer).toContainText('产物')
    await drawer.locator('.aheart-drawer__body').evaluate((element) => { element.scrollTop = 0 })
    await expect(priority).toBeVisible()
    await expect(drawer).toHaveScreenshot('ai-agent-workbench-execution-mobile-390x844.png', { animations: 'disabled' })
  })

  test('AI Workbench opens the pending approval directly from the mobile summary', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'The pending approval shortcut is owned by the mobile project.')
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoComponent(page, 'ai-agent-workbench')

    const summary = page.locator('[data-pending-approval-summary]')
    await expect(summary).toContainText('待审批：产品方案.md')
    await summary.click()
    await expect(page.getByRole('dialog', { name: '执行与产物' })).toBeVisible()
    await expect(page.getByRole('region', { name: '移动端优先处理' })).toContainText('产品方案.md')
  })

  test('desktop component surface screenshots match baselines', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      await expect(surface).toHaveScreenshot(`${component}-desktop-1440x900.png`, {
        animations: 'disabled',
        ...(component === 'ai-agent-workbench' ? { maxDiffPixels: 16 } : {})
      })
    }
  })

  test('mobile component surface screenshots match baselines', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const component of components) {
      await gotoComponent(page, component)
      const surface = await getComponentSurface(page, component)
      await expect(surface).toHaveScreenshot(`${component}-mobile-390x844.png`, {
        animations: 'disabled',
        ...(component === 'ai-agent-workbench' ? { maxDiffPixels: 16 } : {})
      })
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
