import { nextTick, onScopeDispose, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { registerOverlay } from './overlay-controller'

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
  const overlayId = Symbol('aheart-floating-overlay')
  let unregister: (() => void) | undefined
  let restoreZIndex: (() => void) | undefined

  const cleanup = () => {
    unregister?.()
    unregister = undefined
    restoreZIndex?.()
    restoreZIndex = undefined
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

    const trigger = toValue(options.trigger)
    const floating = toValue(options.floating)
    const ownerDocument = trigger?.ownerDocument ?? floating?.ownerDocument ?? document
    const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
    const floatingElement = HTMLElementConstructor && floating instanceof HTMLElementConstructor
      ? floating as HTMLElement
      : null
    const originalZIndex = floatingElement?.style.zIndex ?? ''
    const computedZIndex = Number.parseFloat(
      floatingElement ? ownerDocument.defaultView?.getComputedStyle(floatingElement).zIndex ?? '' : ''
    )
    const baseZIndex = Number.isFinite(computedZIndex) ? computedZIndex : 0
    restoreZIndex = floatingElement
      ? () => {
          floatingElement.style.zIndex = originalZIndex
        }
      : undefined
    unregister = registerOverlay({
      id: overlayId,
      document: ownerDocument,
      getTrigger: () => toValue(options.trigger),
      getContent: () => toValue(options.floating),
      escapeEnabled: () => toValue(options.open),
      getBaseZIndex: () => baseZIndex,
      onZIndexChange: (zIndex) => {
        const content = toValue(options.floating)
        if (HTMLElementConstructor && content instanceof HTMLElementConstructor) {
          ;(content as HTMLElement).style.zIndex = String(zIndex)
        }
      },
      onPointerDownOutside: (event) => {
        if (toValue(options.open)) options.onDismiss('outside', event)
      },
      onEscape: (event) => {
        options.onDismiss('escape', event)

        if (toValue(options.restoreFocus) !== false) {
          void nextTick(() => {
            if (!toValue(options.open)) focusTrigger()
          })
        }
      }
    })
    onCleanup(cleanup)
  })

  onScopeDispose(cleanup)
}
