import { computed, nextTick, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue'
import { defaultRangeExtractor, observeElementRect, useVirtualizer, type Virtualizer } from '@tanstack/vue-virtual'
import { normalizeSelectVirtual } from './virtual-options'
import type { SelectOption } from './types'

/** Internal adapter: Select owns values, filtering, selection, focus and IDs. */
export function useSelectVirtual(input: {
  config: () => unknown
  open: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  popup: Ref<HTMLElement | null>
  options: ComputedRef<SelectOption[]>
  activeIndex: ComputedRef<number>
  activeKey: Ref<string | undefined>
  key: (option: SelectOption) => string
}) {
  const config = computed(() => normalizeSelectVirtual(input.config(), (import.meta as { env?: { DEV?: boolean } }).env?.DEV ? console.warn : undefined))
  const enabled = computed(() => Boolean(config.value && input.open.value && !input.disabled.value))
  const geometry = ref({ top: 4, bottom: 4, gap: 2 })
  let alive = true
  let scrollVersion = 0
  let activeScroll: { version: number; index: number } | undefined
  // Schedule observer-caused writes outside ResizeObserver delivery, on the popup's own realm.
  const observeRect: typeof observeElementRect = (instance, callback) => {
    const view = instance.scrollElement?.ownerDocument.defaultView
    let frame: number | undefined
    const stop = observeElementRect(instance, rect => {
      if (!view?.requestAnimationFrame) { callback(rect); return }
      if (frame !== undefined) view.cancelAnimationFrame(frame)
      frame = view.requestAnimationFrame(() => { frame = undefined; if (alive) callback(rect) })
    })
    return () => { stop?.(); if (frame !== undefined) view?.cancelAnimationFrame(frame) }
  }
  const getItemKey = computed(() => {
    const options = input.options.value
    return (index: number) => input.key(options[index])
  })
  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => {
    const active = input.activeIndex.value
    return {
    count: enabled.value ? input.options.value.length : 0,
    enabled: enabled.value,
    getScrollElement: () => enabled.value ? input.popup.value : null,
    getItemKey: getItemKey.value,
    estimateSize: () => config.value?.estimateSize ?? 32,
    initialRect: { width: 0, height: Math.max(1, (config.value?.height ?? 288) - 2) },
    overscan: config.value?.overscan ?? 3,
    gap: geometry.value.gap,
    scrollMargin: geometry.value.top,
    scrollPaddingStart: geometry.value.top,
    scrollPaddingEnd: geometry.value.bottom,
    useAnimationFrameWithResizeObserver: false,
    observeElementRect: observeRect,
    measureElement: (element: HTMLElement, _entry: ResizeObserverEntry | undefined, instance: Virtualizer<HTMLElement, HTMLElement>) => {
      queueMeasurement(element)
      // Keep the observer delivery read-only; resizeItem commits on the realm's next frame.
      return instance.getVirtualItems().find(item => item.index === Number(element.dataset.index))?.size ?? config.value?.estimateSize ?? 32
    },
    rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range)
      if (active >= 0 && active < input.options.value.length && !indexes.includes(active)) indexes.push(active)
      return indexes.sort((a, b) => a - b)
    }
  }}))

  // Read the actual popup realm. Never create an observer or scheduler on a global window.
  watch(input.popup, (popup) => {
    if (!popup) return
    const view = popup.ownerDocument.defaultView
    const style = view?.getComputedStyle(popup)
    const list = popup.firstElementChild
    const listStyle = list && view?.getComputedStyle(list)
    const gap = Number.parseFloat(listStyle?.rowGap ?? '')
    const next = {
      top: Number.parseFloat(style?.paddingTop ?? '') || 0,
      bottom: Number.parseFloat(style?.paddingBottom ?? '') || 0,
      gap: Number.isFinite(gap) ? gap : 2
    }
    if (Object.keys(next).some(key => next[key as keyof typeof next] !== geometry.value[key as keyof typeof next])) geometry.value = next
  }, { flush: 'post' })

  const scrollToActive = async () => {
    const version = ++scrollVersion
    await nextTick()
    if (!alive || version !== scrollVersion || !enabled.value || !input.popup.value?.isConnected) return
    const index = input.activeIndex.value
    if (index >= 0) {
      activeScroll = { version, index }
      virtualizer.value.scrollToIndex(index, { align: 'auto' })
    }
  }
  watch([input.activeKey, input.activeIndex, input.open, input.popup, config], () => { void scrollToActive() }, { flush: 'post' })
  watch(input.popup, (popup, _previous, cleanup) => {
    if (!popup) return
    const cancelRequestedScroll = () => { activeScroll = undefined; scrollVersion++ }
    const events = ['wheel', 'touchstart', 'pointerdown'] as const
    for (const event of events) popup.addEventListener(event, cancelRequestedScroll, { passive: true })
    cleanup(() => { for (const event of events) popup.removeEventListener(event, cancelRequestedScroll) })
  }, { flush: 'post' })
  onBeforeUnmount(() => { alive = false; scrollVersion++ })

  let observerWindow: Window | null = null
  let measureFrame: number | undefined
  let measureTimer: number | undefined
  const observed = new Set<HTMLElement>()
  const pending = new Set<HTMLElement>()
  const resetMeasurements = () => {
    if (measureFrame !== undefined) observerWindow?.cancelAnimationFrame(measureFrame)
    if (measureTimer !== undefined) observerWindow?.clearTimeout(measureTimer)
    measureFrame = measureTimer = undefined
    observed.clear()
    pending.clear()
    observerWindow = null
    activeScroll = undefined
  }
  const queueMeasurement = (element: HTMLElement) => {
    observerWindow ??= element.ownerDocument.defaultView
    pending.add(element)
    if (measureFrame !== undefined || measureTimer !== undefined) return
    const flush = () => {
      measureFrame = measureTimer = undefined
      if (!alive || !enabled.value) { pending.clear(); return }
      virtualizer.value.measureElement(null)
      for (const row of observed) if (!row.isConnected) observed.delete(row)
      const popup = input.popup.value
      const active = virtualizer.value.getVirtualItems().find(item => item.index === input.activeIndex.value)
      // Cached geometry is still the pre-measure layout. Keep a previously visible active
      // item visible after reflow, but never pull back an active item the user scrolled away from.
      const keepActiveVisible = popup && active && active.start >= popup.scrollTop - 2 && active.end <= popup.scrollTop + popup.clientHeight + 2
      for (const row of pending) {
        if (!row.isConnected || !input.popup.value?.contains(row)) continue
        const index = Number(row.dataset.index)
        if (Number.isInteger(index) && index >= 0 && index < input.options.value.length) virtualizer.value.resizeItem(index, row.offsetHeight)
      }
      pending.clear()
      if (keepActiveVisible && !activeScroll) activeScroll = { version: scrollVersion, index: input.activeIndex.value }
      // A deferred measured height can change the first tail target after scrollToIndex's
      // initial estimate. Reconcile only a requested keyboard/open target, never a user's scroll.
      void nextTick(() => {
        const target = activeScroll, popup = input.popup.value
        if (!target || target.version !== scrollVersion || !alive || !enabled.value || !popup) return
        virtualizer.value.scrollToIndex(target.index, { align: 'auto' })
        const row = popup.querySelector<HTMLElement>(`[data-index="${target.index}"]`)
        if (row) {
          const r = row.getBoundingClientRect(), p = popup.getBoundingClientRect()
          if (r.top >= p.top && r.bottom <= p.bottom) activeScroll = undefined
        }
      })
    }
    if (observerWindow?.requestAnimationFrame) measureFrame = observerWindow.requestAnimationFrame(flush)
    else if (observerWindow) measureTimer = observerWindow.setTimeout(flush, 0)
  }
  watch([enabled, input.popup], resetMeasurements, { flush: 'sync' })
  onBeforeUnmount(resetMeasurements)

  const rows = computed(() => config.value
    ? virtualizer.value.getVirtualItems().map(item => ({ option: input.options.value[item.index], index: item.index, item }))
    : input.options.value.map((option, index) => ({ option, index, item: undefined })))
  const listStyle = computed(() => config.value && input.options.value.length > 0 ? { height: `${virtualizer.value.getTotalSize()}px`, position: 'relative' as const, display: 'block' } : undefined)
  const popupStyle = computed(() => config.value ? { maxHeight: `min(${config.value.height}px, calc(100dvh - 16px))`, overflowAnchor: 'none' as const } : undefined)
  const rowStyle = (row: typeof rows.value[number]) => row.item ? {
    position: 'absolute' as const, top: '0', left: '0', width: '100%',
    transform: `translateY(${row.item.start - geometry.value.top}px)`
  } : undefined
  const measure = (element: unknown) => {
    if (!alive || !enabled.value) return
    // Function-ref nulls accompany removed rows. Drop observers even while the popup stays open.
    if (!element) {
      for (const row of observed) if (!row.isConnected || !input.popup.value?.contains(row)) {
        observed.delete(row); pending.delete(row)
      }
      virtualizer.value.measureElement(null)
      return
    }
    const row = element as HTMLElement
    if (row.nodeType !== 1 || observed.has(row)) return
    observerWindow ??= row.ownerDocument.defaultView
    observed.add(row)
    virtualizer.value.measureElement(row)
  }
  return { config, rows, listStyle, popupStyle, rowStyle, measure }
}
