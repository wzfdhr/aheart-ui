import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { defaultRangeExtractor, useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/vue-virtual'
import type { IndexedTreeNode } from './tree-index'
import { treeKeyToken } from './tree-index'
import type { TreeKey } from './types'
import type { NormalizedTreeVirtual } from './virtual-options'

type RealmWindow = {
  ResizeObserver?: typeof ResizeObserver
  HTMLElement?: typeof HTMLElement
  requestAnimationFrame?: (callback: FrameRequestCallback) => number
  cancelAnimationFrame?: (handle: number) => void
  setTimeout?: (callback: () => void, timeout: number) => number
  clearTimeout?: (handle: number) => void
}

type RowEntry = { element: Element; index: number; observer?: ResizeObserver }

/** Tree's virtualization adapter. The logical TreeIndex remains authoritative. */
export function useTreeVirtual(
  root: Ref<HTMLElement | undefined>,
  config: ComputedRef<NormalizedTreeVirtual | null>,
  nodes: ComputedRef<IndexedTreeNode[]>,
  focusedKey: Ref<TreeKey | undefined>,
  disabled: Ref<boolean>
) {
  const fallback = ref(false)
  const mounted = ref(false)
  const alive = ref(true)
  const actualFocusedKey = ref<TreeKey | undefined>()
  const focusRecoveryKey = ref<TreeKey | undefined>()
  const focusMovedOutside = ref(false)
  const pendingKey = ref<TreeKey | undefined>()
  const pendingVersion = ref(0)
  const rowEntries = new Map<string, RowEntry>()
  const queuedRows = new Set<string>()
  let rowFrame: number | undefined
  let realm: RealmWindow | null = null
  let listenersAttached = false
  let pauseViewport: () => void = () => undefined
  let resumeViewport: () => void = () => undefined

  const indexFor = (key: TreeKey | undefined) => key === undefined ? -1 : nodes.value.findIndex(item => item.key === key)
  const tokenFor = (key: TreeKey) => treeKeyToken(key)
  const pinnedIndexes = computed(() => [focusedKey.value, actualFocusedKey.value, pendingKey.value]
    .map(indexFor).filter(index => index >= 0))
  const rangeExtractorFor = (pins: number[]) => (range: Parameters<typeof defaultRangeExtractor>[0]) => {
    const indexes = defaultRangeExtractor(range)
    for (const index of pins) if (!indexes.includes(index)) indexes.push(index)
    return indexes.sort((a, b) => a - b)
  }

  const observeRect = (instance: { scrollElement: HTMLElement | null }, callback: (rect: { width: number; height: number }) => void) => {
    const element = instance.scrollElement
    const view = element?.ownerDocument.defaultView as RealmWindow | null | undefined
    if (!element || !view) return () => undefined
    let frame: number | undefined
    let timer: number | undefined
    let generation = 0
    let queued = false
    let disposed = false
    let paused = disabled.value
    let observer: ResizeObserver | undefined
    const read = () => {
      const measured = element.getBoundingClientRect()
      const height = element.clientHeight || measured.height || config.value?.height || 320
      const width = element.clientWidth || measured.width
      return { width, height }
    }
    const submit = () => {
      if (queued || disposed || paused || disabled.value) return
      queued = true
      const currentGeneration = generation
      const commit = () => {
        frame = undefined
        timer = undefined
        queued = false
        if (alive.value && currentGeneration === generation) callback(read())
      }
      if (view.requestAnimationFrame && view.cancelAnimationFrame) frame = view.requestAnimationFrame.call(view, commit)
      else if (view.setTimeout && view.clearTimeout) timer = view.setTimeout.call(view, commit, 0)
      else commit()
    }
    const connect = () => {
      if (disposed || paused || disabled.value || observer) return
      const ResizeObserverCtor = view.ResizeObserver
      observer = ResizeObserverCtor ? new ResizeObserverCtor(submit) : undefined
      observer?.observe(element)
      submit()
    }
    const pause = () => {
      paused = true
      generation += 1
      observer?.disconnect()
      observer = undefined
      if (frame !== undefined) view.cancelAnimationFrame?.call(view, frame)
      if (timer !== undefined) view.clearTimeout?.call(view, timer)
      frame = undefined
      timer = undefined
      queued = false
    }
    const resume = () => {
      if (disposed) return
      paused = false
      connect()
    }
    pauseViewport = pause
    resumeViewport = resume
    connect()
    return () => {
      disposed = true
      pause()
      if (pauseViewport === pause) {
        pauseViewport = () => undefined
        resumeViewport = () => undefined
      }
    }
  }

  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(computed(() => {
    const pins = [...pinnedIndexes.value]
    const keys = nodes.value.map(node => tokenFor(node.key))
    return {
    count: config.value && !fallback.value ? nodes.value.length : 0,
    enabled: Boolean(config.value && !fallback.value),
    // Before mounted this intentionally returns null so SSR and hydration use
    // the deterministic initialRect without touching realm capabilities.
    getScrollElement: () => mounted.value && config.value && !fallback.value ? root.value ?? null : null,
    getItemKey: (index: number) => keys[index] ?? `missing-${index}`,
    estimateSize: () => config.value?.estimateSize ?? 28,
    initialRect: { width: 0, height: Math.max(1, config.value?.height ?? 320) },
    overscan: config.value?.overscan ?? 4,
    useCachedMeasurements: true,
    scrollToFn: (offset: number, options?: { adjustments?: number; behavior?: ScrollBehavior }) => {
      const element = root.value
      if (!element) return
      const target = offset + (options?.adjustments ?? 0)
      const behavior = options?.behavior ?? 'auto'
      if (element.scrollTop !== target) element.scrollTop = target
      if (typeof element.scrollTo === 'function') element.scrollTo({ top: target, behavior })
      element.dispatchEvent(new Event('scroll'))
    },
    observeElementRect: observeRect,
    rangeExtractor: rangeExtractorFor(pins)
    }
  }))

  const items = computed(() => config.value && !fallback.value ? virtualizer.value.getVirtualItems() : [])
  const rows = computed(() => items.value.map(item => ({ entry: nodes.value[item.index], item })).filter(row => row.entry))
  const totalSize = computed(() => config.value && !fallback.value ? virtualizer.value.getTotalSize() : 0)

  const cancelPending = (stopReconcile = true) => {
    pendingVersion.value += 1
    pendingKey.value = undefined
    void stopReconcile
  }
  const isMountedKey = (key: TreeKey) => rows.value.some(row => row.entry.key === key)
  const ensureKey = (key: TreeKey) => {
    const index = indexFor(key)
    if (index < 0 || !config.value || fallback.value) return 0
    const version = ++pendingVersion.value
    pendingKey.value = key
    if (!isMountedKey(key)) {
      const offsetInfo = virtualizer.value.getOffsetForIndex(index, 'auto')
      if (offsetInfo) {
        virtualizer.value.options.scrollToFn(offsetInfo[0], { behavior: 'auto' }, virtualizer.value)
      }
    }
    return version
  }
  const isPending = (key: TreeKey, version: number) => alive.value && pendingKey.value === key && pendingVersion.value === version
  const commitFocus = (key: TreeKey) => {
    if (pendingKey.value === key) cancelPending(false)
    focusRecoveryKey.value = key
    focusMovedOutside.value = false
  }

  const keyFromRow = (row: Element | null) => {
    const token = row?.closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken
    return token === undefined ? undefined : nodes.value.find(item => tokenFor(item.key) === token)?.key
  }
  const onFocusIn = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null
    const row = target?.closest<HTMLElement>('[data-tree-token]')
    if (!row || !root.value?.contains(row)) return
    const key = keyFromRow(row)
    actualFocusedKey.value = key
    focusRecoveryKey.value = key
    focusMovedOutside.value = false
    cancelPending(false)
  }
  const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    if (next && root.value?.contains(next)) return
    const old = event.target as HTMLElement | null
    actualFocusedKey.value = undefined
    // A null relatedTarget is also what browsers report when a focused row is
    // removed during a render. Keep the recovery key until the tree watcher can
    // distinguish that recycle from a real focus transfer. A concrete outside
    // target is unambiguously user navigation.
    if (next) {
      focusMovedOutside.value = true
      focusRecoveryKey.value = undefined
    } else if (old) {
      // Explicit blur leaves the row connected; a render-time recycle removes
      // it before this deferred check runs, so only the former clears recovery.
      Promise.resolve().then(() => {
        if (old.isConnected && root.value?.contains(old)) {
          focusMovedOutside.value = true
          focusRecoveryKey.value = undefined
        }
      })
    }
    cancelPending()
  }
  const cancelUserNavigation = () => cancelPending()

  const disconnectRow = (token: string) => {
    const entry = rowEntries.get(token)
    entry?.observer?.disconnect()
    rowEntries.delete(token)
    queuedRows.delete(token)
  }
  const queueRowMeasurement = (token: string) => {
    if (disabled.value) return
    queuedRows.add(token)
    if (rowFrame !== undefined) return
    const view = realm
    if (!view?.requestAnimationFrame || !view.cancelAnimationFrame) return
    rowFrame = view.requestAnimationFrame.call(view, () => {
      rowFrame = undefined
      for (const queuedToken of queuedRows) {
        queuedRows.delete(queuedToken)
        const entry = rowEntries.get(queuedToken)
        if (!entry || !entry.element.isConnected || !config.value || fallback.value) continue
        const height = (entry.element as HTMLElement).getBoundingClientRect().height || (entry.element as HTMLElement).offsetHeight
        if (height > 0) virtualizer.value.resizeItem(entry.index, height)
      }
    })
  }
  const measureRow = (element: Element | null, index: number, stableToken?: string) => {
    const token = stableToken ?? (element?.getAttribute('data-tree-token') ?? undefined)
    if (!token) return
    const previous = rowEntries.get(token)
    if (!element) {
      if (previous && previous.index === index) disconnectRow(token)
      return
    }
    const view = element.ownerDocument.defaultView as RealmWindow | null
    const HTMLElementCtor = view?.HTMLElement
    if (element.nodeType !== 1 || (HTMLElementCtor && !(element instanceof HTMLElementCtor)) || !config.value || fallback.value || !mounted.value) return
    if (disabled.value) {
      const height = (element as HTMLElement).getBoundingClientRect().height || (element as HTMLElement).offsetHeight
      if (height > 0) virtualizer.value.resizeItem(index, height)
      return
    }
    if (previous?.element === element) {
      previous.index = index
      return
    }
    if (previous) disconnectRow(token)
    const row = element as HTMLElement
    const ResizeObserverCtor = view?.ResizeObserver
    const observer = ResizeObserverCtor ? new ResizeObserverCtor(() => queueRowMeasurement(token)) : undefined
    observer?.observe(element)
    rowEntries.set(token, { element, index, observer })
    const height = row.getBoundingClientRect().height || row.offsetHeight
    if (height > 0) virtualizer.value.resizeItem(index, height)
  }
  const cleanupRows = () => {
    for (const token of rowEntries.keys()) disconnectRow(token)
    queuedRows.clear()
    if (rowFrame !== undefined) realm?.cancelAnimationFrame?.call(realm, rowFrame)
    rowFrame = undefined
  }
  const detachRealm = () => {
    const element = root.value
    if (element) {
      element.removeEventListener('focusin', onFocusIn)
      element.removeEventListener('focusout', onFocusOut)
      for (const event of ['wheel', 'touchstart', 'pointerdown'] as const) element.removeEventListener(event, cancelUserNavigation)
    }
    pauseViewport()
    cleanupRows()
    listenersAttached = false
  }
  const attachRealm = (element: HTMLElement) => {
    realm = element.ownerDocument.defaultView as RealmWindow | null
    const view = realm
    const hasRequiredCapabilities = Boolean(view?.ResizeObserver && view.requestAnimationFrame && view.cancelAnimationFrame && view.setTimeout && view.clearTimeout)
    fallback.value = !hasRequiredCapabilities
    if (fallback.value || disabled.value) return
    element.addEventListener('focusin', onFocusIn)
    element.addEventListener('focusout', onFocusOut)
    for (const event of ['wheel', 'touchstart', 'pointerdown'] as const) element.addEventListener(event, cancelUserNavigation, { passive: true })
    listenersAttached = true
    resumeViewport()
  }

  onMounted(() => {
    mounted.value = true
    const element = root.value
    if (!element || !config.value) return
    attachRealm(element)
    if (!fallback.value) {
      for (const row of Array.from(element.querySelectorAll<HTMLElement>('[data-tree-token]'))) {
        const key = keyFromRow(row)
        const index = indexFor(key)
        if (key !== undefined && index >= 0) measureRow(row.parentElement, index, tokenFor(key))
      }
    }
  })
  watch(disabled, (next) => {
    if (!mounted.value || !root.value || !config.value || fallback.value) return
    if (next) {
      cancelPending(false)
      pauseViewport()
      detachRealm()
      return
    }
    attachRealm(root.value)
    for (const row of Array.from(root.value.querySelectorAll<HTMLElement>('[data-tree-token]'))) {
      const key = keyFromRow(row)
      const index = indexFor(key)
      if (key !== undefined && index >= 0) measureRow(row.parentElement, index, tokenFor(key))
    }
  }, { flush: 'post' })
  watch(config, (next, previous) => {
    const element = root.value
    if (!mounted.value || !element) return
    if (!next) {
      detachRealm()
      cancelPending(false)
      fallback.value = false
      return
    }
    if (!previous || !listenersAttached) {
      detachRealm()
      attachRealm(element)
    }
  }, { flush: 'post' })
  watch(() => nodes.value.map(node => tokenFor(node.key)), (keys) => {
    const valid = new Set(keys)
    for (const token of rowEntries.keys()) if (!valid.has(token)) disconnectRow(token)
  }, { flush: 'post' })
  const nodeSignature = (entry: IndexedTreeNode) => [
    entry.node.title,
    entry.node.disabled ? '1' : '0',
    entry.node.isLeaf === undefined ? '' : entry.node.isLeaf ? '1' : '0',
    entry.children.map(tokenFor).join(',')
  ].join('\u0000')
  let signatures = new Map(nodes.value.map(entry => [tokenFor(entry.key), nodeSignature(entry)]))
  let removedTokens = new Set<string>()
  watch(nodes, (next) => {
    if (mounted.value && !fallback.value) {
      const nextSignatures = new Map(next.map(entry => [tokenFor(entry.key), nodeSignature(entry)]))
      const indexes = new Map(next.map((entry, index) => [tokenFor(entry.key), index]))
      for (const [token, signature] of nextSignatures) {
        if ((signatures.has(token) && signatures.get(token) !== signature) || removedTokens.has(token)) {
          const index = indexes.get(token)
          if (index !== undefined) {
            const mountedRow = Array.from(root.value?.querySelectorAll<HTMLElement>('[data-tree-token]') ?? [])
              .find(row => row.dataset.treeToken === token)?.parentElement as HTMLElement | undefined
            const measured = mountedRow?.getBoundingClientRect().height || mountedRow?.offsetHeight
            virtualizer.value.resizeItem(index, measured || config.value?.estimateSize || 28)
          }
        }
      }
      removedTokens = new Set([...signatures.keys()].filter(token => !nextSignatures.has(token)))
      signatures = nextSignatures
    } else {
      signatures = new Map(next.map(entry => [tokenFor(entry.key), nodeSignature(entry)]))
    }
  }, { flush: 'post' })
  onBeforeUnmount(() => {
    alive.value = false
    cancelPending(false)
    cleanupRows()
    detachRealm()
    realm = null
  })

  return { rows, totalSize, items, fallback, ensureKey, isPending, isMountedKey, commitFocus, cancelPending, measureRow, focusRecoveryKey, virtualizer }
}

export type TreeVirtualRow = { entry: IndexedTreeNode; item: VirtualItem }
export type TreeVirtualizer = Virtualizer<HTMLElement, HTMLElement>
