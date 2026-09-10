import { computed, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { FloatingPlacement } from './floating-core'

interface PopupViewportBudgetOptions {
  trigger: Ref<HTMLElement | null>
  popup: Ref<HTMLElement | null>
  placement: Ref<FloatingPlacement>
  open: ComputedRef<boolean>
  maximum: ComputedRef<number>
  search?: Ref<HTMLInputElement | null>
}

export function usePopupViewportBudget(options: PopupViewportBudgetOptions) {
  const budget = ref<{ treeHeight: number; popupHeight: number }>()
  let frame: number | undefined
  let ownerWindow: Window & typeof globalThis | null = null
  let resizeObserver: ResizeObserver | undefined
  let visualViewport: VisualViewport | null | undefined

  const cancelFrame = () => {
    if (frame !== undefined) ownerWindow?.cancelAnimationFrame?.(frame)
    frame = undefined
  }
  const read = () => {
    const trigger = options.trigger.value
    const popup = options.popup.value
    const view = trigger?.ownerDocument.defaultView
    if (!trigger || !popup || !view || !options.open.value) return
    ownerWindow = view
    const rect = trigger.getBoundingClientRect()
    const visualViewport = view.visualViewport
    const viewportTop = visualViewport?.offsetTop ?? 0
    const viewportHeight = visualViewport?.height || view.innerHeight || trigger.ownerDocument.documentElement.clientHeight
    const placement = options.placement.value
    const side = placement.startsWith('top') ? 'top' : placement.startsWith('bottom') ? 'bottom' : 'all'
    const available = side === 'top' ? rect.top - viewportTop - 8 : side === 'bottom' ? viewportTop + viewportHeight - rect.bottom - 8 : viewportHeight - 16
    const styles = view.getComputedStyle(popup)
    const chrome = Number.parseFloat(styles.borderTopWidth || '0') + Number.parseFloat(styles.borderBottomWidth || '0') + Number.parseFloat(styles.paddingTop || '0') + Number.parseFloat(styles.paddingBottom || '0')
    const search = options.search?.value
    const searchHeight = search ? search.getBoundingClientRect().height + Number.parseFloat(view.getComputedStyle(search).marginBottom || '0') : 0
    const treeHeight = Math.max(0, Math.min(options.maximum.value, available - chrome - searchHeight))
    budget.value = { treeHeight, popupHeight: treeHeight + chrome + searchHeight }
  }
  const schedule = () => {
    if (frame !== undefined) return
    const view = options.trigger.value?.ownerDocument.defaultView
    if (!view) return
    ownerWindow = view
    if (view.requestAnimationFrame) frame = view.requestAnimationFrame(() => { frame = undefined; read() })
    else read()
  }
  const cleanup = () => {
    cancelFrame()
    resizeObserver?.disconnect()
    resizeObserver = undefined
    visualViewport?.removeEventListener('resize', schedule)
    visualViewport?.removeEventListener('scroll', schedule)
    ownerWindow?.removeEventListener('resize', schedule)
    options.trigger.value?.ownerDocument.removeEventListener('scroll', schedule, true)
    visualViewport = undefined
  }
  watch([options.trigger, options.popup, options.placement, options.open, options.maximum, options.search ?? ref(null)], () => {
    cleanup()
    const trigger = options.trigger.value
    const popup = options.popup.value
    if (!trigger || !popup || !options.open.value) { budget.value = undefined; return }
    const view = trigger.ownerDocument.defaultView
    if (!view) return
    ownerWindow = view
    resizeObserver = view.ResizeObserver ? new view.ResizeObserver(schedule) : undefined
    resizeObserver?.observe(trigger)
    resizeObserver?.observe(popup)
    if (options.search?.value) resizeObserver?.observe(options.search.value)
    visualViewport = view.visualViewport
    visualViewport?.addEventListener('resize', schedule)
    visualViewport?.addEventListener('scroll', schedule)
    view.addEventListener('resize', schedule)
    trigger.ownerDocument.addEventListener('scroll', schedule, true)
    schedule()
  }, { flush: 'post', immediate: true })
  onBeforeUnmount(cleanup)
  return computed(() => budget.value ?? { treeHeight: options.maximum.value, popupHeight: options.maximum.value })
}
