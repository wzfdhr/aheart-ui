<template>
  <div
    ref="scrollRef"
    :class="className"
    :style="listStyle"
    :data-virtual-scroll-owner="active ? 'true' : undefined"
  >
    <div v-if="virtualMode" class="aheart-cascader__virtual-content" :style="contentStyle">
      <div
        v-for="row in rows"
        :key="row.key"
        class="aheart-cascader__virtual-row"
        :data-virtual-index="row.index"
        :data-index="row.index"
        :data-virtual-key="row.key"
        :style="rowStyle(row.item)"
        :ref="element => setRowRef(element, row.index, row.key)"
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
const viewportMeasured = ref(false)
const fallback = ref(false)
let alive = true
let ownerWindow: Window & typeof globalThis | null = null
const observationCleanups = new Set<() => void>()
let measurementFrame: number | undefined
const pendingKey = ref<string>()
let focusRetry = 0
let focusTimer: number | undefined
let focusGeneration = 0
const pendingRows = new Set<HTMLElement>()
const rowObservers = new Map<string, { element: HTMLElement; observer: ResizeObserver }>()
const measurementVersion = ref(0)
const logicalEstimate = ref<number>()

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
  if (measurementFrame !== undefined) ownerWindow?.cancelAnimationFrame?.(measurementFrame)
  measurementFrame = undefined
}

const scheduleRowMeasurement = () => {
  if (!alive || !active.value || measurementFrame !== undefined) return
  const flush = () => {
    measurementFrame = undefined
    const userAgent = ownerWindow?.navigator?.userAgent ?? ''
    if (/AppleWebKit/i.test(userAgent) && /Safari/i.test(userAgent) && !/Chrome|CriOS|Chromium/i.test(userAgent) && ownerWindow) {
      ownerWindow.setTimeout(commit, 0)
      return
    }
    commit()
  }
  const commit = () => {
    if (!alive || !active.value) { pendingRows.clear(); return }
    for (const row of pendingRows) {
      if (!row.isConnected || !scrollRef.value?.contains(row)) continue
      const rawSize = row.getBoundingClientRect().height || row.offsetHeight || props.config.estimateSize
      const size = Number.isInteger(rawSize) ? rawSize : Math.ceil(rawSize) + 4
      const key = row.dataset.virtualKey
      if (!key) continue
      const index = props.items.findIndex((option, itemIndex) => props.rowKey(itemIndex, option) === key)
      const item = virtualizer.value.getVirtualItems().find(current => current.index === index)
      if (index >= 0 && item && Math.abs(item.size - size) > 0.5) {
        virtualizer.value.resizeItem(index, size)
        logicalEstimate.value ??= size
        measurementVersion.value++
      }
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
  let lastWidth = -1
  let lastHeight = -1
  const read = () => {
    const height = Math.min(element.clientHeight || props.config.height, props.config.height)
    const width = element.clientWidth || 180
    if (width === lastWidth && height === lastHeight) return
    lastWidth = width
    lastHeight = height
    viewportHeight.value = height
    viewportMeasured.value = true
    callback({ width, height })
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
  return cleanup
}

const getItemKey = computed(() => (index: number) => props.rowKey(index, props.items[index]))
const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => {
  const capturedPendingKey = pendingKey.value
  return ({
  count: virtualMode.value ? props.items.length : 0,
  enabled: active.value,
  getScrollElement: () => active.value ? scrollRef.value : null,
  getItemKey: getItemKey.value,
  estimateSize: () => logicalEstimate.value ?? props.config.estimateSize,
  initialRect: { width: 180, height: Math.max(1, viewportMeasured.value ? viewportHeight.value : props.config.height) },
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
    const currentPendingKey = capturedPendingKey
    const pendingIndex = currentPendingKey === undefined ? -1 : props.items.findIndex((option, index) => props.rowKey(index, option) === currentPendingKey)
    for (const index of [props.activeIndex, pendingIndex, ...props.pinnedIndexes]) {
      if (index >= 0 && index < props.items.length && !indexes.includes(index)) indexes.push(index)
    }
    return indexes.sort((left, right) => left - right)
  }
  })
}))

const cachedRows = ref<Array<{ index: number; item: VirtualItem; key: string }>>([])
const rows = computed(() => {
  if (!virtualMode.value) return []
  const virtualRows = virtualizer.value.getVirtualItems()
  const measurements = (virtualizer.value as unknown as { getMeasurements: () => VirtualItem[] }).getMeasurements()
  const currentKeys = new Set(props.items.map((option, index) => props.rowKey(index, option)))
  const pinned = [props.activeIndex, ...props.pinnedIndexes]
  if (pendingKey.value !== undefined) {
    const pendingIndex = props.items.findIndex((option, index) => props.rowKey(index, option) === pendingKey.value)
    if (pendingIndex >= 0) pinned.push(pendingIndex)
  }
  const nextRows = [...virtualRows, ...pinned.map(index => measurements[index]).filter((item): item is VirtualItem => Boolean(item))]
    .filter(item => item.index >= 0 && item.index < props.items.length)
    .filter((item, index, all) => all.findIndex(candidate => candidate.index === item.index) === index)
    .map(item => ({ index: item.index, item, key: getItemKey.value(item.index) }))
    .filter(row => currentKeys.has(row.key))
  if (nextRows.length) cachedRows.value = nextRows
  if (nextRows.length || active.value) return nextRows
  const fallbackCount = Math.min(24, props.items.length)
  return Array.from({ length: fallbackCount }, (_, index) => ({
    index,
    key: props.rowKey(index, props.items[index]),
    item: { index, key: props.rowKey(index, props.items[index]), start: index * props.config.estimateSize, end: (index + 1) * props.config.estimateSize, size: props.config.estimateSize, lane: 0 } as VirtualItem
  }))
})
const contentStyle = computed<CSSProperties>(() => virtualMode.value ? {
  position: 'relative', blockSize: `${Math.max(props.config.height, virtualizer.value.getTotalSize())}px`, minBlockSize: '100%'
} : {})

const listStyle = computed<CSSProperties>(() => virtualMode.value
  ? { maxBlockSize: `${props.config.height}px`, blockSize: `${viewportMeasured.value ? Math.min(viewportHeight.value, props.config.height) : props.config.height}px`, overflowY: 'auto', overflowX: 'hidden', position: 'relative', minBlockSize: '0' }
  : { maxBlockSize: `${props.config.height}px`, overflowY: 'auto', overflowX: 'hidden', minBlockSize: '0' })

const rowStyle = (item: VirtualItem | undefined): CSSProperties | undefined => item ? {
  position: 'absolute', insetInline: '0', top: '0', transform: `translateY(${item.start}px)`
} : undefined
const tabIndex = (index: number) => props.disabledIndex(index, props.items[index]) ? -1 : index === props.activeIndex ? 0 : -1

const focusIndex = (index: number) => {
  if (!props.items.length) return
  const clamped = Math.max(0, Math.min(props.items.length - 1, index))
  const requestedKey = props.rowKey(clamped, props.items[clamped])
  pendingKey.value = requestedKey
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
    if (generation !== focusGeneration || pendingKey.value !== requestedKey || !alive) return
    const currentIndex = props.items.findIndex((option, index) => props.rowKey(index, option) === requestedKey)
    if (currentIndex < 0) { pendingKey.value = undefined; return }
    const target = scrollRef.value?.querySelector<HTMLElement>(`[data-virtual-index="${currentIndex}"] .aheart-cascader__option`)
    if (target && !props.disabledIndex(currentIndex, props.items[currentIndex])) {
      target.focus()
      return
    }
    if (!active.value) {
      const fallbackTarget = scrollRef.value?.querySelectorAll<HTMLElement>('.aheart-cascader__option')[currentIndex]
      if (fallbackTarget) { fallbackTarget.focus(); return }
    }
    if (focusRetry++ < 4 && alive) {
      const view = scrollRef.value?.ownerDocument.defaultView
      if (view?.requestAnimationFrame) focusTimer = view.requestAnimationFrame(() => { focusTimer = undefined; void nextTick(commit) })
      else if (view) focusTimer = view.setTimeout(() => { focusTimer = undefined; void nextTick(commit) }, 0)
    } else if (pendingKey.value === requestedKey) pendingKey.value = undefined
  }
  if (active.value) virtualizer.value.measure()
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
  pendingKey.value = undefined
  focusRetry = 0
  if (focusTimer !== undefined) ownerWindow?.cancelAnimationFrame?.(focusTimer)
  if (focusTimer !== undefined) ownerWindow?.clearTimeout?.(focusTimer)
  focusTimer = undefined
}
const suspend = () => {
  cancelFocus()
  for (const cleanup of [...observationCleanups]) cleanup()
  pendingRows.clear()
  for (const entry of rowObservers.values()) entry.observer.disconnect()
  rowObservers.clear()
}

onMounted(() => {
  fallback.value = !canUseVirtualRuntime()
  const view = scrollRef.value?.ownerDocument.defaultView
  ownerWindow = view ?? null
})
watch([() => props.items, () => props.config], () => {
  logicalEstimate.value = undefined
  pruneRowObservers()
  cachedRows.value = cachedRows.value.filter(row => props.items.some((option, index) => props.rowKey(index, option) === row.key))
}, { flush: 'post' })
watch(active, value => {
  if (!value) suspend()
  else {
    void nextTick(bindMountedRows)
  }
}, { flush: 'post' })
onBeforeUnmount(() => {
  alive = false
  cancelSchedule()
  suspend()
})

defineExpose<CascaderVirtualListExpose>({ focusIndex, focusFirst, focusLast, cancelFocus, suspend })

const setRowRef = (element: unknown, index: number, key: string) => {
  if (!element || typeof element !== 'object' || '$el' in element || key === undefined) {
    rowObservers.get(key)?.observer.disconnect()
    rowObservers.delete(key)
    return
  }
  const row = element as HTMLElement
  if (row.nodeType !== 1) return
  const view = row.ownerDocument.defaultView
  if (!view?.ResizeObserver) return
  ownerWindow ??= view
  const existing = rowObservers.get(key)
  if (existing?.element === row) return
  existing?.observer.disconnect()
  const observer = new view.ResizeObserver(() => {
    pendingRows.add(row)
    scheduleRowMeasurement()
  })
  observer.observe(row)
  rowObservers.set(key, { element: row, observer })
  pendingRows.add(row)
  scheduleRowMeasurement()
}
const pruneRowObservers = () => {
  const keys = new Set(props.items.map((option, index) => props.rowKey(index, option)))
  for (const [key, entry] of rowObservers) if (!keys.has(key) || !entry.element.isConnected) {
    entry.observer.disconnect()
    rowObservers.delete(key)
  }
}
const bindMountedRows = () => {
  const owner = scrollRef.value
  if (!owner || !active.value) return
  owner.querySelectorAll<HTMLElement>('[data-virtual-index]').forEach(row => {
    const index = Number(row.dataset.virtualIndex)
    const key = row.dataset.virtualKey
    if (Number.isInteger(index) && key) setRowRef(row, index, key)
  })
}
</script>
