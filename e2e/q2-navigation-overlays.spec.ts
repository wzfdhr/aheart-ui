import { expect, test } from '@playwright/test'

const contrastRatio = (foreground: string, background: string) => {
  const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
  const luminance = (color: string) => {
    const [red, green, blue] = parse(color).map((channel) => {
      const normalized = channel / 255
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
  }
  const foregroundLuminance = luminance(foreground)
  const backgroundLuminance = luminance(background)

  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

test('warning and danger buttons keep visible labels and accessible contrast', async ({ page }) => {
  await page.goto('/components/button')

  const warning = page.getByRole('button', { name: '警告按钮', exact: true })
  await expect(warning).toBeVisible()
  await expect(warning).toHaveText('警告按钮')

  const colors = await warning.evaluate((element) => {
    const style = getComputedStyle(element)
    return { foreground: style.color, background: style.backgroundColor }
  })

  expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5)

  const danger = page.getByRole('button', { name: '危险按钮', exact: true })
  await expect(danger).toHaveText('危险按钮')
  const dangerColors = await danger.evaluate((element) => {
    const style = getComputedStyle(element)
    return { foreground: style.color, background: style.backgroundColor }
  })

  expect(contrastRatio(dangerColors.foreground, dangerColors.background)).toBeGreaterThanOrEqual(4.5)
})

test('horizontal dark menu is marker-free and geometrically aligned', async ({ page }) => {
  await page.goto('/components/menu')

  const menu = page.locator('.menu-horizontal-dark-demo .aheart-menu')
  const selected = menu.getByRole('menuitem', { name: 'Analytics' })
  await expect(menu).toBeVisible()
  await expect(selected).toBeVisible()

  const geometry = await menu.evaluate((element) => {
    const root = element.getBoundingClientRect()
    const item = element.querySelector('[aria-current="page"]')?.getBoundingClientRect()
    const listStyle = getComputedStyle(element.querySelector('.aheart-menu__list') as HTMLElement).listStyleType
    const itemListStyle = getComputedStyle(element.querySelector('li') as HTMLElement).listStyleType
    const selectedButton = element.querySelector('[aria-current="page"]') as HTMLElement

    return {
      rootCenter: root.top + root.height / 2,
      itemCenter: item ? item.top + item.height / 2 : 0,
      listStyle,
      itemListStyle,
      menuBackground: getComputedStyle(element).backgroundColor,
      selectedBackground: getComputedStyle(selectedButton).backgroundColor
    }
  })

  expect(geometry.listStyle).toBe('none')
  expect(geometry.itemListStyle).toBe('none')
  expect(Math.abs(geometry.rootCenter - geometry.itemCenter)).toBeLessThanOrEqual(1)
  expect(geometry.selectedBackground).toBe(geometry.menuBackground)

  await selected.hover()
  const hoverColors = await selected.evaluate((element) => {
    const style = getComputedStyle(element)
    return { foreground: style.color, background: style.backgroundColor }
  })
  expect(contrastRatio(hoverColors.foreground, hoverColors.background)).toBeGreaterThanOrEqual(4.5)
})

test('steps connectors stay centered for small vertical and default horizontal layouts', async ({ page }) => {
  await page.goto('/components/steps')

  const horizontal = page.locator('.aheart-steps--horizontal').first()
  const vertical = page.locator('.aheart-steps--vertical.aheart-steps--small').first()

  for (const steps of [horizontal, vertical]) {
    const geometry = await steps.evaluate((element) => {
      const indicator = element.querySelector('.aheart-steps__indicator')!.getBoundingClientRect()
      const connector = element.querySelector('.aheart-steps__connector')!.getBoundingClientRect()
      const vertical = element.classList.contains('aheart-steps--vertical')

      return vertical
        ? { indicatorCenter: indicator.left + indicator.width / 2, connectorCenter: connector.left + connector.width / 2 }
        : { indicatorCenter: indicator.top + indicator.height / 2, connectorCenter: connector.top + connector.height / 2 }
    })

    expect(Math.abs(geometry.indicatorCenter - geometry.connectorCenter)).toBeLessThanOrEqual(1)
  }
})

test('inline submenu keeps a measured leave transition', async ({ page }) => {
  await page.goto('/components/menu')

  const demo = page.locator('.aheart-demo-panel').nth(1)
  const trigger = demo.getByRole('menuitem', { name: 'Workspace' })
  const submenu = demo.locator('.aheart-menu__submenu-list').first()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(submenu).toHaveCSS('opacity', '1')
  await submenu.evaluate((element) => {
    const panel = element.closest('.aheart-demo-panel') as HTMLElement
    panel.dataset.submenuTransitions = element.className
    new MutationObserver(() => {
      panel.dataset.submenuTransitions += ` ${element.className}`
    }).observe(element, { attributes: true, attributeFilter: ['class'] })
  })

  await trigger.click()

  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => demo.getAttribute('data-submenu-transitions')).toContain('is-leave')

  await trigger.click()
  await expect(submenu).toHaveClass(/is-entered/)
  await expect(submenu).toHaveCSS('opacity', '1')
})

test('dropdown uses real viewport coordinates and restores focus on Escape', async ({ page }) => {
  await page.goto('/components/dropdown')

  const trigger = page.getByRole('button', { name: 'Click me', exact: true })
  await trigger.click()

  const overlay = page.locator('.aheart-dropdown__overlay').filter({ hasText: 'Profile' })
  await expect(overlay).toBeVisible()
  await expect(overlay).toHaveCSS('opacity', '1')

  const triggerBox = await trigger.boundingBox()
  const overlayBox = await overlay.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(overlayBox).not.toBeNull()
  expect(overlayBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1)
  expect(overlayBox!.x).toBeGreaterThanOrEqual(0)
  expect(overlayBox!.x + overlayBox!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth))

  await page.keyboard.press('Escape')
  await expect(overlay).toHaveClass(/is-leave|is-hidden/)
  await expect(trigger).toBeFocused()
})

test('modal closes from the visible background and restores its trigger', async ({ page }) => {
  await page.goto('/components/modal')

  const trigger = page.getByRole('button', { name: 'Open modal', exact: true })
  await trigger.click()

  const modal = page.locator('.aheart-modal').first()
  await expect(modal).toBeVisible()
  await expect(modal).toHaveClass(/is-entered/)
  await expect(modal.locator('.aheart-modal__dialog')).toHaveCSS('opacity', '1')
  await expect.poll(() => modal.evaluate((element) => element.contains(document.activeElement))).toBe(true)

  await page.mouse.click(12, 120)
  await expect(modal).toHaveClass(/is-leave|is-hidden/)
  await expect(trigger).toBeFocused()
})

test('popconfirm renders readable confirmation actions', async ({ page }) => {
  await page.goto('/components/popconfirm')

  await page.getByRole('button', { name: 'Delete', exact: true }).first().click()
  const popup = page.locator('.aheart-popconfirm__popup.is-entered').first()
  await expect(popup).toBeVisible()
  await expect(popup).toHaveCSS('opacity', '1')

  const confirm = popup.locator('.aheart-popconfirm__ok')
  const cancel = popup.locator('.aheart-popconfirm__cancel')
  await expect(confirm).not.toHaveText('')
  await expect(cancel).not.toHaveText('')
})
