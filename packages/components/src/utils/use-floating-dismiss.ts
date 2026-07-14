import { nextTick, onScopeDispose, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>

export type FloatingDismissReason = 'outside' | 'escape'

export interface UseFloatingDismissOptions {
  open: MaybeRefOrGetter<boolean>
  trigger: ElementSource
  floating: ElementSource
  onDismiss: (reason: FloatingDismissReason, event: Event) => void
  restoreFocus?: MaybeRefOrGetter<boolean | undefined>
}

export function useFloatingDismiss(options: UseFloatingDismissOptions) {
  let removeListeners: (() => void) | undefined

  const cleanup = () => {
    removeListeners?.()
    removeListeners = undefined
  }

  const focusTrigger = () => {
    const trigger = toValue(options.trigger)
    if (!trigger) return

    const focusableSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')
    const target = trigger.matches(focusableSelector)
      ? trigger
      : trigger.querySelector<HTMLElement>(focusableSelector)

    target?.focus()
  }

  watchEffect((onCleanup) => {
    cleanup()

    if (typeof document === 'undefined' || !toValue(options.open)) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const trigger = toValue(options.trigger)
      const floating = toValue(options.floating)
      const path = event.composedPath()

      if ((trigger && path.includes(trigger)) || (floating && path.includes(floating))) {
        return
      }

      options.onDismiss('outside', event)
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()
      options.onDismiss('escape', event)

      if (toValue(options.restoreFocus) !== false) {
        void nextTick(() => {
          if (!toValue(options.open)) focusTrigger()
        })
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeydown, true)
    removeListeners = () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeydown, true)
    }
    onCleanup(cleanup)
  })

  onScopeDispose(cleanup)
}
