import { expect, test, type Frame, type Page } from '@playwright/test'

async function checkActive(context: Page | Frame, suffix: string) {
  const trigger = context.locator('#select-virtual-demo')
  await expect.poll(() => trigger.getAttribute('aria-activedescendant')).toBeTruthy()
  await expect.poll(() => trigger.evaluate(element => {
    const row = element.ownerDocument.getElementById(element.getAttribute('aria-activedescendant')!)
    const popup = row?.closest('.aheart-select__popup')
    if (!row || !popup) return { text: '', visible: false }
    const r = row.getBoundingClientRect(), p = popup.getBoundingClientRect()
    return { text: row.textContent ?? '', visible: r.top >= p.top - 1 && r.bottom <= p.bottom + 1 }
  })).toEqual({ text: expect.stringContaining(suffix), visible: true })
}

test('Select virtual tail, disabled navigation, dynamic height and scroll anchoring', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/components/select')
  await page.waitForFunction(() => Boolean((document.querySelector('#app') as any)?.__vue_app__))
  const trigger = page.locator('#select-virtual-demo')
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  await checkActive(page, 'Row 0999')
  const popup = page.locator('.aheart-select__popup:has(.is-virtual)')
  await expect(popup.locator('[role="option"]')).not.toHaveCount(1000)
  await trigger.press('Home')
  await checkActive(page, 'Row 0000')
  for (let i = 0; i < 20; i++) await trigger.press('ArrowDown')
  await checkActive(page, 'Row 0021')
  await trigger.press('Home')
  await checkActive(page, 'Row 0000')
  await popup.dispatchEvent('wheel', { deltaY: 1500 })
  await popup.evaluate(element => { element.scrollTop = 1500 })
  await expect.poll(() => popup.evaluate(el => el.scrollTop)).toBeGreaterThan(1400)
  // Allow the scroll window to settle before selecting a visible anchor by stable ID.
  await expect.poll(() => popup.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    return Array.from(element.querySelectorAll('[role="option"]')).some(row => {
      const rect = row.getBoundingClientRect()
      return rect.top >= bounds.top && rect.bottom <= bounds.bottom
    })
  })).toBe(true)
  // iOS defers estimate compensation until scrolling ends to preserve momentum.
  // Establish the baseline after a quiet scroll interval, not before a queued correction.
  await popup.evaluate(element => new Promise<void>(resolve => {
    const view = element.ownerDocument.defaultView!
    let timer: number
    const arm = () => {
      view.clearTimeout(timer)
      timer = view.setTimeout(() => { element.removeEventListener('scroll', arm); resolve() }, 200)
    }
    element.addEventListener('scroll', arm, { passive: true })
    arm()
  }))
  await popup.evaluate(async element => {
    let previous = '', stable = 0
    for (let frame = 0; frame < 40; frame++) {
      await new Promise(resolve => requestAnimationFrame(resolve))
      const sample = `${element.scrollTop}|${Array.from(element.querySelectorAll('[role="option"]'), row => `${row.id}:${row.getBoundingClientRect().top}:${row.getBoundingClientRect().height}`).join('|')}`
      stable = sample === previous ? stable + 1 : 0
      if (stable >= 3) return
      previous = sample
    }
    throw new Error('Virtual scroll geometry did not settle before resize test')
  })
  const anchor = await popup.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const row = Array.from(element.querySelectorAll('[role="option"]')).find(row => row.getBoundingClientRect().top >= bounds.top + 2)!
    return { id: row.id, offset: row.getBoundingClientRect().top - bounds.top }
  })
  const first = popup.locator('[data-index="0"]')
  const before = await first.evaluate(el => el.getBoundingClientRect().height)
  await page.getByRole('button', { name: '切换首项高度' }).evaluate(element => (element as HTMLButtonElement).click())
  await expect.poll(() => first.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(before + 90)
  await expect.poll(() => popup.evaluate((element, anchor) => {
    const row = element.ownerDocument.getElementById(anchor.id)
    return row ? Math.abs(row.getBoundingClientRect().top - element.getBoundingClientRect().top - anchor.offset) : 999
  }, anchor)).toBeLessThan(3)
  await trigger.press('End')
  await checkActive(page, 'Row 0999')
  await page.screenshot({ path: test.info().outputPath('select-virtual-tail.png') })
  await trigger.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(popup).toHaveCount(0)
  expect(errors).toEqual([])
})

test('Select virtual uses iframe realm and disposes after SPA unmount', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const frame = document.createElement('iframe')
    frame.id = 'virtual-frame'
    frame.src = '/components/select'
    frame.style.cssText = 'width:100%;height:720px'
    document.body.append(frame)
  })
  const handle = await page.locator('#virtual-frame').elementHandle()
  const frame = (await handle!.contentFrame())!
  await frame.locator('#app').waitFor()
  await frame.waitForFunction(() => Boolean((document.querySelector('#app') as any)?.__vue_app__))
  const trigger = frame.locator('#select-virtual-demo')
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  await checkActive(frame, 'Row 0999')
  await expect(page.locator('.aheart-select__popup')).toHaveCount(0)
  await trigger.press('Home')
  await checkActive(frame, 'Row 0000')
  await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await trigger.press('Escape')
  await expect(trigger).toBeFocused()
  await trigger.press('ArrowDown')
  await frame.locator('a[href*="/guide/introduction"]').first().evaluate(element => (element as HTMLAnchorElement).click())
  await expect(frame.locator('.aheart-select__popup')).toHaveCount(0)
  await expect(frame.locator('#select-virtual-demo')).toHaveCount(0)
  const result = await frame.evaluate(() => {
    const button = document.createElement('button')
    document.body.append(button)
    button.focus()
    const key = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    button.dispatchEvent(key)
    return { active: document.activeElement === button, prevented: key.defaultPrevented }
  })
  expect(result).toEqual({ active: true, prevented: false })
})
