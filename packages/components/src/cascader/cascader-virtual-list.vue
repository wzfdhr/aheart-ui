<template>
  <div
    ref="scrollRef"
    :class="className"
    :style="listStyle"
    :data-virtual-scroll-owner="active ? 'true' : undefined"
  >
    <div v-if="virtualMode && active" class="aheart-cascader__virtual-content" :style="contentStyle">
      <div
        v-for="row in rows"
        :key="row.key"
        class="aheart-cascader__virtual-row"
        :data-virtual-index="row.index"
        :data-index="row.index"
        :style="rowStyle(row.item)"
        :ref="element => setRowRef(element, row.index)"
      >
        <slot name="row" :index="row.index" :option="items[row.index]" :tabindex="tabIndex(row.index)" />
      </div>
    </div>
    <template v-else-if="!virtualMode">
      <div v-for="(option, index) in items" :key="rowKey(index, option)" class="aheart-cascader__virtual-row">
        <slot name="row" :index="index" :option="option" :tabindex="tabIndex(index)" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties, type PropType } from 'vue'
import { defaultRangeExtractor, useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/vue-virtual'
type VirtualRow = any

export interface CascaderVirtualListExpose {
  focusIndex: (index: number) => void
  focusFirst: () => void
  focusLast: () => void
  cancelFocus: () => void
  suspend: () => void
}

const props = defineProps({
  items: { type: Array as PropType<VirtualRow[]>, required: true },
  config: { type: Object as PropType<{ height: number; estimateSize: number; overscan: number }>, required: true },
  className: { type: String, required: true },
  rowKey: { type: Function as PropType<(index: number, option: VirtualRow) => string>, required: true },
  activeIndex: { type: Number, default: 0 },
  pinnedIndexes: { type: Array as PropType<number[]>, default: () => [] },
  disabledIndex: { type: Function as PropType<(index: number, option: VirtualRow) => boolean>, required: true },
  enabled: { type: Boolean, default: true }
})

const scrollRef = ref<HTMLElement | null>(null)
const viewportHeight = ref(0)
const mounted = ref(false)
const fallback = ref(false)
let alive = true
let ownerWindow: Window & typeof globalThis | null = null
const observationCleanups = new Set<() => void>()
let scheduleFrame: number | undefined
let scheduleTimer: number | undefined
let measurementFrame: number | undefined
let pendingKey: string | undefined
let focusRetry = 0
let focusTimer: number | undefined
let focusGeneration = 0
let observationCleanup: (() => void) | undefined
const pendingRows = new Set<HTMLElement>()

// Keep the deterministic virtual window during SSR and the first hydration render.
// Capability fallback is selected only after the real owner element is mounted.
const virtualMode = computed(() => !fallback.value)
const active = computed(() => virtualMode.value && props.enabled)
const canUseVirtualRuntime = () => {
  const view = scrollRef.value?.ownerDocument.defaultView
  const runtime = view as (Window & { ResizeObserver?: typeof ResizeObserver; requestAnimationFrame?: typeof requestAnimationFrame; cancelAnimationFrame?: typeof cancelAnimationFrame }) | null | undefined
  return Boolean(runtime?.ResizeObserver && typeof Reflect.get(runtime, 'requestAnimationFrame') === 'function' && typeof Reflect.get(runtime, 'cancelAnimationFrame') === 'function')
}

const cancelSchedule = () => {
  if (scheduleFrame !== undefined) ownerWindow?.cancelAnimationFrame?.(scheduleFrame)
  if (scheduleTimer !== undefined) ownerWindow?.clearTimeout?.(scheduleTimer)
  scheduleFrame = undefined
  scheduleTimer = undefined
  if (measurementFrame !== undefined) ownerWindow?.cancelAnimationFrame?.(measurementFrame)
  measurementFrame = undefined
}

const scheduleMeasure = () => {
  if (!alive || !scrollRef.value) return
  const view = scrollRef.value.ownerDocument.defaultView
  ownerWindow = view
  if (scheduleFrame !== undefined || scheduleTimer !== undefined) return
  const flush = () => {
    scheduleFrame = undefined
    scheduleTimer = undefined
    if (!alive || !active.value) return
    virtualizer.value.measure()
  }
  if (view && (view as Window & { requestAnimationFrame?: typeof requestAnimationFrame }).requestAnimationFrame) scheduleFrame = view.requestAnimationFrame(flush)
  else if (view) scheduleTimer = view.setTimeout(flush, 0)
  else flush()
}

const scheduleRowMeasurement = () => {
  if (!alive || !active.value || measurementFrame !== undefined) return
  const flush = () => {
    measurementFrame = undefined
    if (!alive || !active.value) { pendingRows.clear(); return }
    for (const row of pendingRows) {
      if (!row.isConnected || !scrollRef.value?.contains(row)) continue
      const index = Number(row.dataset.virtualIndex)
      const size = row.getBoundingClientRect().height || row.offsetHeight || props.config.estimateSize
      if (Number.isInteger(index) && index >= 0 && index < props.items.length) virtualizer.value.resizeItem(index, size)
    }
    pendingRows.clear()
  }
  if (ownerWindow?.requestAnimationFrame) measurementFrame = ownerWindow.requestAnimationFrame(flush)
  else if (ownerWindow) measurementFrame = ownerWindow.setTimeout(flush, 0)
  else flush()
}

const observeRect = (instance: Virtualizer<HTMLElement, HTMLElement>, callback: (rect: { width: number; height: number }) => void) => {
  const element = instance.scrollElement
  const view = element?.ownerDocument.defaultView
  if (!element || !view) return () => undefined
  ownerWindow = view
  let rectFrame: number | undefined
  const read = () => {
    const height = element.clientHeight || props.config.height
    viewportHeight.value = height
    callback({ width: element.clientWidth || 180, height })
    if (alive && active.value) virtualizer.value.measure()
  }
  const schedule = () => {
    if (rectFrame !== undefined) return
    const flush = () => { rectFrame = undefined; if (alive) read() }
    if (view.requestAnimationFrame) rectFrame = view.requestAnimationFrame(flush)
    else rectFrame = view.setTimeout(flush, 0)
  }
  view.addEventListener('resize', schedule)
  element.ownerDocument.addEventListener('scroll', schedule, true)
  read()
  const localObserver = view.ResizeObserver ? new view.ResizeObserver(schedule) : undefined
  localObserver?.observe(element)
  const cleanup = () => {
    localObserver?.disconnect()
    observationCleanups.delete(cleanup)
    view.removeEventListener('resize', schedule)
    element.ownerDocument.removeEventListener('scroll', schedule, true)
    if (rectFrame !== undefined) {
      view.cancelAnimationFrame?.(rectFrame)
      view.clearTimeout?.(rectFrame)
      rectFrame = undefined
    }
    cancelSchedule()
  }
  observationCleanups.add(cleanup)
  observationCleanup = cleanup
  return cleanup
}

const getItemKey = computed(() => (index: number) => props.rowKey(index, props.items[index]))
const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => ({
  count: active.value ? props.items.length : 0,
  enabled: active.value,
  getScrollElement: () => active.value ? scrollRef.value : null,
  getItemKey: getItemKey.value,
  estimateSize: () => props.config.estimateSize,
  initialRect: { width: 180, height: Math.max(1, viewportHeight.value || props.config.height) },
  overscan: props.config.overscan,
  scrollPaddingStart: 0,
  scrollPaddingEnd: 0,
  useAnimationFrameWithResizeObserver: false,
  observeElementRect: observeRect,
  measureElement: (element: HTMLElement, _entry: ResizeObserverEntry | undefined, instance: Virtualizer<HTMLElement, HTMLElement>) => {
    const measured = element.getBoundingClientRect().height || element.offsetHeight
    return measured > 0 ? measured : instance.getVirtualItems().find(item => item.index === Number(element.dataset.virtualIndex))?.size ?? props.config.estimateSize
  },
  rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
    const indexes = defaultRangeExtractor(range)
    const pendingIndex = pendingKey === undefined ? -1 : props.items.findIndex((option, index) => props.rowKey(index, option) === pendingKey)
    for (const index of [props.activeIndex, pendingIndex, ...props.pinnedIndexes]) {
      if (index >= 0 && index < props.items.length && !indexes.includes(index)) indexes.push(index)
    }
    return indexes.sort((left, right) => left - right)
  }
})))

const rows = computed(() => {
  if (!active.value) return []
  const scrollTop = scrollRef.value?.scrollTop ?? 0
  const height = viewportHeight.value || props.config.height
  const overscanPx = props.config.overscan * props.config.estimateSize
  const virtualRows = virtualizer.value.getVirtualItems()
  const indexes = new Set([
    props.activeIndex,
    ...props.pinnedIndexes,
    ...(pendingKey === undefined ? [] : [props.items.findIndex((option, index) => props.rowKey(index, option) === pendingKey)])
  ])
  return virtualRows
    .filter(item => item.start < scrollTop + height + overscanPx && item.end > scrollTop - overscanPx || indexes.has(item.index))
    .map(item => ({ index: item.index, item, key: getItemKey.value(item.index) }))
})
const contentStyle = computed<CSSProperties>(() => active.value ? {
  position: 'relative', blockSize: `${Math.max(props.config.height, virtualizer.value.getTotalSize())}px`, minBlockSize: '100%'
} : {})

const listStyle = computed<CSSProperties>(() => active.value
  ? { maxBlockSize: `${props.config.height}px`, blockSize: `${viewportHeight.value || props.config.height}px`, overflowY: 'auto', overflowX: 'hidden', position: 'relative', minBlockSize: '0' }
  : { maxBlockSize: `${props.config.height}px`, overflowY: 'auto', overflowX: 'hidden', minBlockSize: '0' })

const rowStyle = (item: VirtualItem | undefined): CSSProperties | undefined => item ? {
  position: 'absolute', insetInline: '0', top: '0', transform: `translateY(${item.start}px)`, minBlockSize: `${item.size}px`
} : undefined
const tabIndex = (index: number) => props.disabledIndex(index, props.items[index]) ? -1 : index === props.activeIndex ? 0 : -1

const focusIndex = (index: number) => {
  if (!props.items.length) return
  const clamped = Math.max(0, Math.min(props.items.length - 1, index))
  const requestedKey = props.rowKey(clamped, props.items[clamped])
  pendingKey = requestedKey
  const generation = ++focusGeneration
  focusRetry = 0
  if (focusTimer !== undefined) ownerWindow?.clearTimeout(focusTimer)
  if (active.value) {
    // scrollToIndex is authoritative in a real browser; assigning the offset and
    // dispatching scroll also makes the handoff deterministic in SSR/jsdom owners.
    if (scrollRef.value) {
      scrollRef.value.scrollTop = clamped * props.config.estimateSize
      const view = scrollRef.value.ownerDocument.defaultView
      if (view) scrollRef.value.dispatchEvent(new view.Event('scroll'))
    }
    virtualizer.value.scrollToIndex(clamped, { align: 'auto' })
  }
  const commit = () => {
    if (generation !== focusGeneration || pendingKey !== requestedKey || !alive) return
    const currentIndex = props.items.findIndex((option, index) => props.rowKey(index, option) === requestedKey)
    if (currentIndex < 0) { pendingKey = undefined; return }
    const target = scrollRef.value?.querySelector<HTMLElement>(`[data-virtual-index="${currentIndex}"] .aheart-cascader__option`)
    if (target && !props.disabledIndex(currentIndex, props.items[currentIndex])) {
      target.focus()
      if (pendingKey === requestedKey) pendingKey = undefined
      return
    }
    if (!active.value) {
      const fallbackTarget = scrollRef.value?.querySelectorAll<HTMLElement>('.aheart-cascader__option')[currentIndex]
      if (fallbackTarget) { fallbackTarget.focus(); pendingKey = undefined; return }
    }
    if (focusRetry++ < 4 && alive) {
      const view = scrollRef.value?.ownerDocument.defaultView
      if (view?.requestAnimationFrame) focusTimer = view.requestAnimationFrame(() => { focusTimer = undefined; void nextTick(commit) })
      else if (view) focusTimer = view.setTimeout(() => { focusTimer = undefined; void nextTick(commit) }, 0)
    } else if (pendingKey === requestedKey) pendingKey = undefined
  }
  void nextTick(commit)
}
const firstEnabled = () => props.items.findIndex((option, index) => !props.disabledIndex(index, option))
const lastEnabled = () => {
  for (let index = props.items.length - 1; index >= 0; index--) if (!props.disabledIndex(index, props.items[index])) return index
  return -1
}
const focusFirst = () => focusIndex(firstEnabled())
const focusLast = () => focusIndex(lastEnabled())
const cancelFocus = () => {
  focusGeneration++
  pendingKey = undefined
  focusRetry = 0
  if (focusTimer !== undefined) ownerWindow?.cancelAnimationFrame?.(focusTimer)
  if (focusTimer !== undefined) ownerWindow?.clearTimeout?.(focusTimer)
  focusTimer = undefined
}
const suspend = () => {
  cancelFocus()
  for (const cleanup of [...observationCleanups]) cleanup()
  observationCleanup = undefined
  pendingRows.clear()
}

onMounted(() => {
  mounted.value = true
  fallback.value = !canUseVirtualRuntime()
  const view = scrollRef.value?.ownerDocument.defaultView
  ownerWindow = view ?? null
  if (active.value) scheduleMeasure()
})
watch([() => props.items, () => props.config, active], () => {
  if (!active.value) {
    suspend()
  } else {
    virtualizer.value.measure()
    scheduleMeasure()
  }
}, { flush: 'post' })
onBeforeUnmount(() => {
  alive = false
  cancelSchedule()
  suspend()
})

defineExpose<CascaderVirtualListExpose>({ focusIndex, focusFirst, focusLast, cancelFocus, suspend })

const setRowRef = (element: unknown, _index: number) => {
  if (!element || typeof element !== 'object' || '$el' in element) return
  const row = element as HTMLElement
  if (row.nodeType === 1) {
    pendingRows.add(row)
    scheduleRowMeasurement()
  }
}
</script>
