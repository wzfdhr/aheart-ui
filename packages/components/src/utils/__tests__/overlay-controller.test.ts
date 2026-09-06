import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isTargetInOverlayTree,
  isTopmost,
  getRecentPointerTarget,
  lockBodyScroll,
  prepareOverlayDocument,
  registerOverlay,
  unregisterOverlay,
  unlockBodyScroll
} from '../overlay-controller'

describe('overlay-controller', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  })

  it('keeps a single document stack across overlay kinds and only reports the topmost layer', () => {
    const modal = Symbol('modal')
    const drawer = Symbol('drawer')
    const onEscape = vi.fn()
    registerOverlay({ id: modal, onEscape })
    registerOverlay({ id: drawer, escapeEnabled: false, onEscape })

    expect(isTopmost(drawer)).toBe(true)
    expect(isTopmost(modal)).toBe(false)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).not.toHaveBeenCalled()

    unregisterOverlay(drawer)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).toHaveBeenCalledTimes(1)
    unregisterOverlay(modal)
  })

  it('stops a handled Escape before a component-local fallback can run', () => {
    const overlay = Symbol('overlay')
    const content = document.createElement('div')
    document.body.appendChild(content)
    const onEscape = vi.fn()
    const localKeydown = vi.fn()
    content.addEventListener('keydown', localKeydown)
    registerOverlay({ id: overlay, getContent: () => content, onEscape })

    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }))
    expect(onEscape).toHaveBeenCalledTimes(1)
    expect(localKeydown).not.toHaveBeenCalled()

    unregisterOverlay(overlay)
    content.remove()
  })

  it('recognizes teleported descendants opened from an overlay content', () => {
    const parent = document.createElement('section')
    const trigger = document.createElement('button')
    const childContent = document.createElement('div')
    const grandchildTrigger = document.createElement('button')
    const grandchildContent = document.createElement('div')
    parent.append(trigger)
    childContent.append(grandchildTrigger)
    document.body.append(parent, childContent, grandchildContent)
    const parentId = Symbol('parent')
    const childId = Symbol('child')
    const grandchildId = Symbol('grandchild')
    registerOverlay({ id: parentId, getContent: () => parent })
    registerOverlay({ id: childId, getTrigger: () => trigger, getContent: () => childContent })
    registerOverlay({ id: grandchildId, getTrigger: () => grandchildTrigger, getContent: () => grandchildContent })

    expect(isTargetInOverlayTree(parentId, childContent)).toBe(true)
    expect(isTargetInOverlayTree(parentId, grandchildContent)).toBe(true)
    unregisterOverlay(grandchildId)
    unregisterOverlay(childId)
    unregisterOverlay(parentId)
    parent.remove()
    childContent.remove()
    grandchildContent.remove()
  })

  it('reference-counts body scroll locking and restores the original value', () => {
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = '7px'
    lockBodyScroll()
    lockBodyScroll()
    expect(document.body.style.overflow).toBe('hidden')
    unlockBodyScroll()
    expect(document.body.style.overflow).toBe('hidden')
    unlockBodyScroll()
    expect(document.body.style.overflow).toBe('auto')
    expect(document.body.style.paddingRight).toBe('7px')
  })

  it('keeps blocking overlay visuals in stack order while respecting an explicit base', () => {
    const modal = Symbol('modal')
    const drawer = Symbol('drawer')
    const modalZIndex = vi.fn()
    const drawerZIndex = vi.fn()

    registerOverlay({ id: modal, getBaseZIndex: () => 2000, onZIndexChange: modalZIndex })
    registerOverlay({ id: drawer, getBaseZIndex: () => 1000, onZIndexChange: drawerZIndex })

    expect(modalZIndex).toHaveBeenLastCalledWith(2000)
    expect(drawerZIndex).toHaveBeenLastCalledWith(2010)
    unregisterOverlay(drawer)
    unregisterOverlay(modal)
  })

  it('tracks the pointer opener and clears it when keyboard input takes over', () => {
    const trigger = document.createElement('button')
    const label = document.createElement('span')
    trigger.appendChild(label)
    document.body.appendChild(trigger)
    prepareOverlayDocument()

    label.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    expect(getRecentPointerTarget()).toBe(trigger)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(getRecentPointerTarget()).toBeNull()

    trigger.remove()
  })
})
