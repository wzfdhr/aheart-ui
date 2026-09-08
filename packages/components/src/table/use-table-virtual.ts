import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { defaultRangeExtractor, observeElementRect, useVirtualizer } from '@tanstack/vue-virtual'
import type { NormalizedTableVirtual } from './virtual-options'

export function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>, getItemKey: (index: number) => string = index => String(index)) {
  const pinnedIndex = ref<number | undefined>()
  // Keep each logical row's measured parts independently. Expanded rows are
  // companions of the base row, and ResizeObserver may report either side on
  // a later callback. The logical index is the stable virtual identity.
  const measuredParts = new Map<number, Map<string, number>>()
  const measured = ref(new Map<number, number>())
  const alive = ref(true)
  const observeRect: typeof observeElementRect = (instance, callback) => {
    const view = instance.scrollElement?.ownerDocument.defaultView
    let frame: number | undefined
    const stop = observeElementRect(instance, rect => {
      const normalizedRect = { ...rect, height: Math.max(rect.height, options.value.height) }
      if (!view?.requestAnimationFrame) callback(normalizedRect)
      else {
        if (frame !== undefined) view.cancelAnimationFrame(frame)
        frame = view.requestAnimationFrame(() => { frame = undefined; if (alive.value) callback(normalizedRect) })
      }
    })
    return () => { stop?.(); if (frame !== undefined) view?.cancelAnimationFrame(frame) }
  }
  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => ({
    count: options.value.enabled ? count.value : 0,
    enabled: options.value.enabled,
    getScrollElement: () => options.value.enabled ? scrollElement.value : null,
    estimateSize: () => options.value.estimateSize,
    initialRect: { width: 0, height: Math.max(1, options.value.height) },
    overscan: options.value.overscan,
    getItemKey,
    observeElementRect: observeRect,
    rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range)
      if (pinnedIndex.value !== undefined && pinnedIndex.value >= 0 && pinnedIndex.value < count.value && !indexes.includes(pinnedIndex.value)) indexes.push(pinnedIndex.value)
      return indexes.sort((a, b) => a - b)
    }
  })))
  const onScroll = () => {
    const offset = scrollElement.value?.scrollTop ?? 0
    virtualizer.value.scrollToOffset(offset)
    virtualizer.value.measure()
  }
  const range = computed(() => {
    if (!options.value.enabled) return { start: 0, end: count.value, top: 0, bottom: 0 }
    const items = virtualizer.value.getVirtualItems()
    const start = items[0]?.index ?? 0
    const end = (items[items.length - 1]?.index ?? -1) + 1
    return { start, end, top: items[0]?.start ?? 0, bottom: Math.max(0, virtualizer.value.getTotalSize() - (items.at(-1)?.end ?? 0)) }
  })
  const setPinnedIndex = (index: number | undefined) => { pinnedIndex.value = index; virtualizer.value.measure() }
  const setMeasured = (index: number, height: number, part = 'base') => {
    if (!alive.value || !options.value.enabled || height <= 0) return
    const parts = new Map(measuredParts.get(index) ?? [])
    parts.set(part, height)
    measuredParts.set(index, parts)
    const next = new Map(measured.value)
    next.set(index, Array.from(parts.values()).reduce((sum, value) => sum + value, 0))
    measured.value = next
    virtualizer.value.resizeItem(index, next.get(index)!)
  }
  const clearMeasured = (index: number, part?: string) => {
    const parts = measuredParts.get(index)
    if (!parts) return
    if (part) parts.delete(part)
    else parts.clear()
    const next = new Map(measured.value)
    if (parts.size === 0) {
      measuredParts.delete(index)
      next.delete(index)
    } else {
      measuredParts.set(index, parts)
      next.set(index, Array.from(parts.values()).reduce((sum, value) => sum + value, 0))
    }
    measured.value = next
    virtualizer.value.measure()
  }
  watch([options, scrollElement], () => virtualizer.value.measure(), { flush: 'sync' })
  onBeforeUnmount(() => { alive.value = false; measuredParts.clear(); virtualizer.value.setOptions({ ...virtualizer.value.options, enabled: false }) })
  return { virtualizer, range, measured, setMeasured, clearMeasured, setPinnedIndex, onScroll, pinnedIndex }
}
