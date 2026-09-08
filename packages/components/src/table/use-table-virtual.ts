import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { defaultRangeExtractor, observeElementRect, useVirtualizer } from '@tanstack/vue-virtual'
import type { NormalizedTableVirtual } from './virtual-options'

export function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>, getItemKey: (index: number) => string = index => String(index), itemKeys?: Ref<readonly string[]>) {
  const pinnedIndexes = ref<number[]>([])
  // Keep each logical row's measured parts independently. Expanded rows are
  // companions of the base row, and ResizeObserver may report either side on
  // a later callback. The logical index is the stable virtual identity.
  const measuredParts = new Map<string, Map<string, number>>()
  const measured = ref(new Map<string, number>())
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
  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => {
    const pins = [...pinnedIndexes.value]
    return {
    count: options.value.enabled ? count.value : 0,
    enabled: options.value.enabled,
    getScrollElement: () => options.value.enabled ? scrollElement.value : null,
    estimateSize: () => options.value.estimateSize,
    initialRect: { width: 0, height: Math.max(1, options.value.height) },
    overscan: options.value.overscan,
    getItemKey: (index: number) => itemKeys?.value[index] ?? getItemKey(index),
    // Make key changes observable to TanStack when pagination/data changes.
    itemKeys: itemKeys?.value,
    observeElementRect: observeRect,
    rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range)
      pins.forEach((pin) => { if (pin >= 0 && pin < count.value && !indexes.includes(pin)) indexes.push(pin) })
      return indexes.sort((a, b) => a - b)
    }
    }
  }))
  const onScroll = () => {
    // TanStack owns the native scroll listener through observeElementOffset.
    // Do not imperatively scroll/measure here; that can reset the observed
    // range before the browser offset callback runs.
  }
  const range = computed(() => {
    if (!options.value.enabled) return { start: 0, end: count.value, top: 0, bottom: 0 }
    const items = virtualizer.value.getVirtualItems()
    const start = items[0]?.index ?? 0
    const end = (items[items.length - 1]?.index ?? -1) + 1
    return { start, end, top: items[0]?.start ?? 0, bottom: Math.max(0, virtualizer.value.getTotalSize() - (items.at(-1)?.end ?? 0)) }
  })
  const items = computed(() => options.value.enabled ? virtualizer.value.getVirtualItems() : [])
  const setPinnedIndexes = (indexes: number[]) => { pinnedIndexes.value = [...new Set(indexes.filter((index) => index >= 0))] }
  const setMeasured = (index: number, height: number, part = 'base') => {
    if (!alive.value || !options.value.enabled || height <= 0) return
    const key = getItemKey(index)
    const parts = new Map(measuredParts.get(key) ?? [])
    parts.set(part, height)
    measuredParts.set(key, parts)
    const next = new Map(measured.value)
    next.set(key, Array.from(parts.values()).reduce((sum, value) => sum + value, 0))
    measured.value = next
    virtualizer.value.resizeItem(index, next.get(key)!)
  }
  const clearMeasured = (index: number, part?: string) => {
    const key = getItemKey(index)
    const parts = measuredParts.get(key)
    if (!parts) return
    if (part) parts.delete(part)
    else parts.clear()
    const next = new Map(measured.value)
    if (parts.size === 0) {
      measuredParts.delete(key)
      next.delete(key)
    } else {
      measuredParts.set(key, parts)
      next.set(key, Array.from(parts.values()).reduce((sum, value) => sum + value, 0))
    }
    measured.value = next
    virtualizer.value.measure()
  }
  watch([options, scrollElement], () => virtualizer.value.measure(), { flush: 'sync' })
  if (itemKeys) watch(itemKeys, () => { measuredParts.clear(); measured.value = new Map(); virtualizer.value.measure() }, { flush: 'sync' })
  onBeforeUnmount(() => { alive.value = false; measuredParts.clear(); virtualizer.value.setOptions({ ...virtualizer.value.options, enabled: false }) })
  return { virtualizer, range, items, measured, setMeasured, clearMeasured, setPinnedIndexes, onScroll, pinnedIndexes }
}
