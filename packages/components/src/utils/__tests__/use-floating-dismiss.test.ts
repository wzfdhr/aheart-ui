import { effectScope, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFloatingDismiss } from '../use-floating-dismiss'

describe('useFloatingDismiss', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('dismisses from an outside pointer without treating popup content as outside', async () => {
    const open = ref(true)
    const trigger = document.createElement('button')
    const popup = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(trigger, popup, outside)
    const requestClose = vi.fn(() => {
      open.value = false
    })
    const scope = effectScope()
    scope.run(() => useFloatingDismiss({ open, trigger: ref(trigger), floating: ref(popup), onDismiss: requestClose }))

    popup.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    expect(requestClose).not.toHaveBeenCalled()

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    expect(requestClose).toHaveBeenCalledTimes(1)
    await nextTick()
    scope.stop()
  })

  it('dismisses on Escape and restores focus to the trigger', async () => {
    const open = ref(true)
    const trigger = document.createElement('button')
    const popup = document.createElement('div')
    document.body.append(trigger, popup)
    popup.tabIndex = 0
    popup.focus()
    const scope = effectScope()
    scope.run(() =>
      useFloatingDismiss({
        open,
        trigger: ref(trigger),
        floating: ref(popup),
        onDismiss: () => {
          open.value = false
        }
      })
    )

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(open.value).toBe(false)
    expect(document.activeElement).toBe(trigger)
    scope.stop()
  })

  it('restores focus to an interactive descendant when the trigger wrapper is not focusable', async () => {
    const open = ref(true)
    const trigger = document.createElement('span')
    const button = document.createElement('button')
    const popup = document.createElement('div')
    popup.tabIndex = 0
    trigger.appendChild(button)
    document.body.append(trigger, popup)
    popup.focus()
    const scope = effectScope()
    scope.run(() =>
      useFloatingDismiss({
        open,
        trigger: ref(trigger),
        floating: ref(popup),
        onDismiss: () => {
          open.value = false
        }
      })
    )

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(button)
    scope.stop()
  })

  it('keeps focus in the popup when a controlled owner rejects dismissal', async () => {
    const open = ref(true)
    const trigger = document.createElement('button')
    const popup = document.createElement('div')
    popup.tabIndex = 0
    document.body.append(trigger, popup)
    popup.focus()
    const requestClose = vi.fn()
    const scope = effectScope()
    scope.run(() =>
      useFloatingDismiss({
        open,
        trigger: ref(trigger),
        floating: ref(popup),
        onDismiss: requestClose
      })
    )

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(requestClose).toHaveBeenCalledWith('escape', expect.any(KeyboardEvent))
    expect(open.value).toBe(true)
    expect(document.activeElement).toBe(popup)
    scope.stop()
  })
})
