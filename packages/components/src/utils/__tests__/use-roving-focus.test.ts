import { describe, expect, it, vi } from 'vitest'
import { useCollection } from '../use-collection'
import { useRovingFocus } from '../use-roving-focus'

describe('useRovingFocus', () => {
  it('moves by arrows, skips disabled items, and loops', () => {
    const collection = useCollection()
    const elements = ['a', 'b', 'c'].map(() => document.createElement('button'))
    collection.register({ key: 'a', element: elements[0] })
    collection.register({ key: 'b', element: elements[1], disabled: true })
    collection.register({ key: 'c', element: elements[2] })
    const focus = useRovingFocus({ collection })

    expect(focus.getNextKey('a', 'ArrowRight')).toBe('c')
    expect(focus.getNextKey('c', 'ArrowRight')).toBe('a')
    expect(focus.getNextKey(undefined, 'ArrowDown')).toBe('a')
    expect(focus.getNextKey(undefined, 'ArrowUp')).toBe('c')
  })

  it('handles Home/End and focuses through the element ownerDocument', () => {
    const ownerDocument = document.implementation.createHTMLDocument('embedded')
    const collection = useCollection<HTMLButtonElement>()
    const one = ownerDocument.createElement('button')
    const two = ownerDocument.createElement('button')
    ownerDocument.body.append(one, two)
    const focusSpy = vi.spyOn(two, 'focus')
    collection.register({ key: 'one', element: one })
    collection.register({ key: 'two', element: two })
    const focus = useRovingFocus({ collection, loop: false })
    expect(focus.getNextKey('two', 'Home')).toBe('one')
    expect(focus.getNextKey('one', 'End')).toBe('two')
    expect(focus.focus('two')).toBe(true)
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('respects orientation, non-looping boundaries, and preventDefault', () => {
    const collection = useCollection<HTMLButtonElement>()
    collection.register({ key: 'one', element: document.createElement('button') })
    collection.register({ key: 'two', element: document.createElement('button') })
    const focus = useRovingFocus({ collection, orientation: 'vertical', loop: false })

    const ignored = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
    expect(focus.onKeydown(ignored, 'one')).toBe(false)
    expect(ignored.defaultPrevented).toBe(false)

    const boundary = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true })
    expect(focus.onKeydown(boundary, 'one')).toBe(false)
    expect(boundary.defaultPrevented).toBe(false)

    const handled = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
    expect(focus.onKeydown(handled, 'one')).toBe(true)
    expect(handled.defaultPrevented).toBe(true)
  })
})
