import { expect, test, type Frame, type Page } from '@playwright/test'

type Fixture = {
  name: string
  path: string
  trigger: string
  panel: string
  openedFocus?: string
}

const fixtures: Fixture[] = [
  {
    name: 'Select',
    path: '/components/select',
    trigger: '.aheart-select__selector',
    panel: '.aheart-select__popup'
  },
  {
    name: 'TreeSelect',
    path: '/components/tree-select',
    trigger: '.aheart-tree-select__trigger',
    panel: '.aheart-tree-select__panel',
    openedFocus: '.aheart-tree[role="tree"] [role="treeitem"]'
  },
  {
    name: 'Cascader',
    path: '/components/cascader',
    trigger: '.aheart-cascader__trigger',
    panel: '.aheart-cascader__panel',
    openedFocus: '.aheart-cascader__option'
  }
]

async function mountSameOriginIframe(page: Page, path: string): Promise<Frame> {
  const iframe = page.locator('iframe[data-d4-iframe]')
  await page.evaluate((src) => {
    const element = document.createElement('iframe')
    element.dataset.d4Iframe = 'true'
    element.title = 'D4 same-origin component fixture'
    element.src = src
    element.style.cssText = 'width: 100%; height: 720px; border: 0;'
    document.body.append(element)
  }, path)
  await expect(iframe).toHaveCount(1)
  const iframeHandle = await iframe.elementHandle()
  const frame = await iframeHandle?.contentFrame()
  if (!frame) throw new Error('D4 iframe did not expose a same-origin frame')
  await frame.locator('#app').waitFor()
  await frame.waitForFunction(() => Boolean((document.querySelector('#app') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__))
  await frame.evaluate(() => {
    const documentWithMarker = document as Document & { __d4DocumentMarker?: string }
    documentWithMarker.__d4DocumentMarker ??= `d4-${Math.random().toString(36).slice(2)}`
  })
  return frame
}

async function documentMarker(frame: Frame) {
  return frame.evaluate(() => {
    const documentWithMarker = document as Document & { __d4DocumentMarker?: string }
    return documentWithMarker.__d4DocumentMarker ?? ''
  })
}

async function dispatchUnconsumedInput(frame: Frame) {
  return frame.evaluate(() => {
    const target = document.activeElement ?? document.body
    const keydown = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    target.dispatchEvent(keydown)
    const pointerdown = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 4, clientY: 4 })
    target.dispatchEvent(pointerdown)
    return {
      keydownDefaultPrevented: keydown.defaultPrevented,
      pointerdownDefaultPrevented: pointerdown.defaultPrevented,
      activeElement: target === document.activeElement
    }
  })
}

for (const fixture of fixtures) {
  test(`same-origin iframe ${fixture.name} focus, Escape restore, and SPA unmount cleanup`, async ({ page }) => {
    await page.goto('/')
    const frame = await mountSameOriginIframe(page, fixture.path)
    const trigger = frame.locator(fixture.trigger).first()
    const panel = frame.locator(fixture.panel).first()

    await trigger.focus()
    await expect(trigger).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('IFRAME')
    await trigger.press('ArrowDown')
    await expect(panel).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const innerTarget = fixture.openedFocus ? frame.locator(fixture.openedFocus).first() : trigger
    if (fixture.openedFocus) await expect(innerTarget).toBeFocused()

    const outerEscape = await page.evaluate(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      document.dispatchEvent(event)
      return event.defaultPrevented
    })
    expect(outerEscape).toBe(false)
    await expect(panel).toBeVisible()

    await innerTarget.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
    await expect(panel).toBeHidden()

    const markerBeforeNavigation = await documentMarker(frame)
    expect(markerBeforeNavigation).toMatch(/^d4-/)
    await trigger.press('ArrowDown')
    await expect(panel).toBeVisible()
    const guideLink = frame.locator('a[href*="/guide/introduction"]').first()
    await expect(guideLink).toHaveCount(1)
    await guideLink.evaluate((element) => (element as HTMLAnchorElement).click())
    await expect.poll(() => frame.url()).toContain('/guide/introduction')
    await frame.locator('#app').waitFor()
    expect(await documentMarker(frame)).toBe(markerBeforeNavigation)
    await expect(frame.locator(fixture.trigger)).toHaveCount(0)
    await expect(frame.locator(fixture.panel)).toHaveCount(0)

    await frame.evaluate(() => {
      const button = document.createElement('button')
      button.id = 'd4-post-navigation-focus'
      button.type = 'button'
      button.textContent = 'post navigation focus'
      document.body.append(button)
      button.focus()
    })
    const postNavigationFocus = frame.locator('#d4-post-navigation-focus')
    await expect(postNavigationFocus).toBeFocused()
    expect(await dispatchUnconsumedInput(frame)).toEqual({
      keydownDefaultPrevented: false,
      pointerdownDefaultPrevented: false,
      activeElement: true
    })
    await expect(postNavigationFocus).toBeFocused()
  })
}
