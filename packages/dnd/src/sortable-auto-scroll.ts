import {
  autoScrollForElements,
  autoScrollWindowForElements
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'

type Registration = {
  count: number
  cleanup: () => void
}

const registrations = new WeakMap<Element, Registration>()
let windowRegistration: Registration | undefined

const scrollableOverflow = new Set(['auto', 'scroll'])

function findScrollableAncestor(element: HTMLElement) {
  let ancestor = element.parentElement
  while (ancestor) {
    const style = window.getComputedStyle(ancestor)
    if (scrollableOverflow.has(style.overflowX) || scrollableOverflow.has(style.overflowY)) return ancestor
    ancestor = ancestor.parentElement
  }
  return undefined
}

export function registerSortableAutoScroll(element: HTMLElement | undefined) {
  const ancestor = element && findScrollableAncestor(element)
  if (!ancestor) {
    if (windowRegistration) {
      windowRegistration.count += 1
    } else {
      windowRegistration = { count: 1, cleanup: autoScrollWindowForElements() }
    }

    let released = false
    return () => {
      if (released) return
      released = true
      if (!windowRegistration) return
      windowRegistration.count -= 1
      if (windowRegistration.count === 0) {
        windowRegistration.cleanup()
        windowRegistration = undefined
      }
    }
  }

  const existing = registrations.get(ancestor)
  if (existing) {
    existing.count += 1
  } else {
    registrations.set(ancestor, { count: 1, cleanup: autoScrollForElements({ element: ancestor }) })
  }

  let released = false
  return () => {
    if (released) return
    released = true
    const registration = registrations.get(ancestor)
    if (!registration) return
    registration.count -= 1
    if (registration.count === 0) {
      registration.cleanup()
      registrations.delete(ancestor)
    }
  }
}
