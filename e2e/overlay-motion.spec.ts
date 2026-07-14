import { expect, test } from '@playwright/test'

const motionCases = [
  { path: '/components/modal', trigger: 'Open modal', overlay: '.aheart-modal', close: '.aheart-modal__close' },
  { path: '/components/drawer', trigger: 'Open drawer', overlay: '.aheart-drawer', close: '.aheart-drawer__close' },
  { path: '/components/dropdown', trigger: 'Click me', overlay: '.aheart-dropdown__overlay', close: undefined },
  { path: '/components/popover', trigger: 'Open popover', overlay: '.aheart-popover__popup', close: undefined }
] as const

for (const motionCase of motionCases) {
  test(`${motionCase.path} uses a presence phase for its floating surface`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.goto(motionCase.path)

    await page.getByRole('button', { name: motionCase.trigger, exact: true }).click()
    const overlay = page.locator(`${motionCase.overlay}.is-entered`).first()
    await expect(overlay).toBeVisible()
    await expect(overlay).toHaveClass(/is-entered/)

    await page.evaluate((selector) => {
      const state = window as Window & { __aheartLeaveSeen?: boolean }
      const target = document.querySelector(selector)
      state.__aheartLeaveSeen = false

      if (!target) return
      const observer = new MutationObserver(() => {
        if (target.classList.contains('is-leave')) {
          state.__aheartLeaveSeen = true
          observer.disconnect()
        }
      })
      observer.observe(target, { attributeFilter: ['class'] })
    }, `${motionCase.overlay}.is-entered`)

    if (motionCase.close) {
      await overlay.locator(motionCase.close).first().click()
    } else {
      await page.getByRole('button', { name: motionCase.trigger, exact: true }).click()
    }

    await expect
      .poll(() =>
        page.evaluate(
          () => Boolean((window as Window & { __aheartLeaveSeen?: boolean }).__aheartLeaveSeen)
        )
      )
      .toBe(true)
  })
}

test('reduced motion settles modal presence without a delayed leave phase', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/modal')

  await page.getByRole('button', { name: 'Open modal', exact: true }).click()
  const overlay = page.locator('.aheart-modal').first()
  await expect(overlay).toHaveClass(/is-entered/)
  await overlay.locator('.aheart-modal__cancel').click()
  await expect(overlay).toHaveClass(/is-hidden/)
})
