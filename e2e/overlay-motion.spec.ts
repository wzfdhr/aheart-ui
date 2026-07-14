import { expect, test } from '@playwright/test'

const motionCases = [
  { path: '/components/modal', trigger: 'Open modal', overlay: '.aheart-modal', close: '[aria-label="Close"]' },
  { path: '/components/drawer', trigger: 'Open drawer', overlay: '.aheart-drawer', close: '[aria-label="Close"]' },
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

    if (motionCase.close) {
      await overlay.locator(motionCase.close).first().click()
    } else {
      await page.keyboard.press('Escape')
    }

    const leavingOverlay = page.locator(`${motionCase.overlay}.is-leave`).first()
    await expect(leavingOverlay).toBeVisible()
    await expect(leavingOverlay).not.toHaveAttribute('aria-hidden')
  })
}

test('reduced motion settles modal presence without a delayed leave phase', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/modal')

  await page.getByRole('button', { name: 'Open modal', exact: true }).click()
  const overlay = page.locator('.aheart-modal.is-entered').first()
  await expect(overlay).toHaveClass(/is-entered/)
  await overlay.getByRole('button', { name: 'Cancel' }).click()
  await expect(overlay).toHaveClass(/is-hidden/)
})
