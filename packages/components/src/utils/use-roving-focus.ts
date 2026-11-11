import { toValue, type MaybeRefOrGetter } from 'vue'
import type { UseCollectionReturn } from './use-collection'

export type RovingOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseRovingFocusOptions<T extends HTMLElement = HTMLElement> {
  collection: UseCollectionReturn<T> | MaybeRefOrGetter<UseCollectionReturn<T>>
  orientation?: RovingOrientation | MaybeRefOrGetter<RovingOrientation>
  loop?: boolean | MaybeRefOrGetter<boolean>
  preventDefault?: boolean | MaybeRefOrGetter<boolean>
}

/** Shared traversal for DOM focus and aria-activedescendant controls. */
export function getNextEnabledKey(
  entries: readonly { key: string }[],
  currentKey: string | undefined,
  key: string,
  loop = true
) {
  if (!entries.length) return undefined
  if (key === 'Home') return entries[0].key
  if (key === 'End') return entries[entries.length - 1].key
  const forward = key === 'ArrowRight' || key === 'ArrowDown'
  const index = entries.findIndex((item) => item.key === currentKey)
  if (index < 0) return forward ? entries[0].key : entries[entries.length - 1].key
  const next = index + (forward ? 1 : -1)
  if (next >= 0 && next < entries.length) return entries[next].key
  return loop ? entries[(next + entries.length) % entries.length].key : undefined
}

export function useRovingFocus<T extends HTMLElement = HTMLElement>(options: UseRovingFocusOptions<T>) {
  const collection = () => toValue(options.collection)
  const orientation = () => toValue(options.orientation) ?? 'both'
  const loops = () => toValue(options.loop) !== false
  const shouldPrevent = () => toValue(options.preventDefault) !== false

  const isDirection = (key: string) => {
    if (orientation() === 'horizontal') return key === 'ArrowLeft' || key === 'ArrowRight'
    if (orientation() === 'vertical') return key === 'ArrowUp' || key === 'ArrowDown'
    return key.startsWith('Arrow')
  }

  const getNextKey = (currentKey: string | undefined, key: string) => {
    if (key !== 'Home' && key !== 'End' && !isDirection(key)) return undefined
    return getNextEnabledKey(collection().getEnabledItems(), currentKey, key, loops())
  }

  const focus = (key: string, preventScroll = true) => {
    const item = collection().getItem(key)
    if (!item || !item.visible || item.disabled) return false
    // HTMLElement.focus() is ownerDocument-safe, including adopted/iframe DOM.
    item.element.focus({ preventScroll })
    return true
  }

  const onKeydown = (event: KeyboardEvent, currentKey?: string) => {
    const nextKey = getNextKey(currentKey, event.key)
    if (!nextKey) return false
    if (shouldPrevent()) event.preventDefault()
    return focus(nextKey)
  }

  return { getNextKey, focus, onKeydown }
}
