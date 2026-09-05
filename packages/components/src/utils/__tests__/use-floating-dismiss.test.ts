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

  it('treats a teleported child popup as inside its parent overlay tree', async () => {
    const parentOpen = ref(true)
    const childOpen = ref(true)
    const parentTrigger = document.createElement('button')
    const parentPopup = document.createElement('div')
    const childTrigger = document.createElement('button')
    const childPopup = document.createElement('div')
    const outside = document.createElement('button')
    parentPopup.appendChild(childTrigger)
    document.body.append(parentTrigger, parentPopup, childPopup, outside)
    const dismissParent = vi.fn(() => {
      parentOpen.value = false
    })
    const dismissChild = vi.fn(() => {
      childOpen.value = false
    })
    const scope = effectScope()

    scope.run(() => {
      useFloatingDismiss({
        open: parentOpen,
        trigger: ref(parentTrigger),
        floating: ref(parentPopup),
        onDismiss: dismissParent
      })
      useFloatingDismiss({
        open: childOpen,
        trigger: ref(childTrigger),
        floating: ref(childPopup),
        onDismiss: dismissChild
      })
    })

    childPopup.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    expect(dismissParent).not.toHaveBeenCalled()
    expect(dismissChild).not.toHaveBeenCalled()

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    expect(dismissChild).toHaveBeenCalledTimes(1)
    expect(dismissParent).not.toHaveBeenCalled()
    await nextTick()

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    expect(dismissParent).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('dismisses and restores focus for only the topmost nested overlay on Escape', async () => {
    const parentOpen = ref(true)
    const childOpen = ref(true)
    const parentTrigger = document.createElement('button')
    const parentPopup = document.createElement('div')
    const childTrigger = document.createElement('button')
    const childPopup = document.createElement('div')
    parentPopup.appendChild(childTrigger)
    document.body.append(parentTrigger, parentPopup, childPopup)
    childPopup.tabIndex = 0
    childPopup.focus()
    const dismissParent = vi.fn(() => {
      parentOpen.value = false
    })
    const dismissChild = vi.fn(() => {
      childOpen.value = false
    })
    const scope = effectScope()

    scope.run(() => {
      useFloatingDismiss({
        open: parentOpen,
        trigger: ref(parentTrigger),
        floating: ref(parentPopup),
        onDismiss: dismissParent
      })
      useFloatingDismiss({
        open: childOpen,
        trigger: ref(childTrigger),
        floating: ref(childPopup),
        onDismiss: dismissChild
      })
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(dismissChild).toHaveBeenCalledTimes(1)
    expect(dismissParent).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(childTrigger)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(dismissParent).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(parentTrigger)
    scope.stop()
  })

  it('keeps nested floating visuals in the same order as dismissal ownership', () => {
    const parentPopup = document.createElement('div')
    const childTrigger = document.createElement('button')
    const childPopup = document.createElement('div')
    parentPopup.style.zIndex = '1200'
    childPopup.style.zIndex = '1100'
    parentPopup.appendChild(childTrigger)
    document.body.append(parentPopup, childPopup)
    const scope = effectScope()

    scope.run(() => {
      useFloatingDismiss({
        open: ref(true),
        trigger: ref(document.createElement('button')),
        floating: ref(parentPopup),
        onDismiss: vi.fn()
      })
      useFloatingDismiss({
        open: ref(true),
        trigger: ref(childTrigger),
        floating: ref(childPopup),
        onDismiss: vi.fn()
      })
    })

    expect(parentPopup.style.zIndex).toBe('1200')
    expect(childPopup.style.zIndex).toBe('1210')
    scope.stop()
    expect(childPopup.style.zIndex).toBe('1100')
  })
})
