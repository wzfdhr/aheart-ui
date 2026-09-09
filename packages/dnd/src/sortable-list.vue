<script lang="ts">
let sortableListIdCounter = 0
let sortableListDisplayOrder = 0
</script>

<template>
  <ul
    ref="root"
    class="aheart-dnd-sortable-list"
    :data-aheart-sortable-list-id="listId"
    :data-aheart-sortable-group="group"
    :data-aheart-sortable-disabled="disabled ? 'true' : undefined"
    role="list"
  >
    <SortableItem v-for="(item, index) in items" :key="getItemKey(item)" :item="item" :index="index" :item-key="getItemKey(item)" :revision="revisionValue">
      <template #default="slotProps">
        <slot
          name="item"
          v-bind="slotProps as SortableListItemSlotProps"
        />
      </template>
    </SortableItem>
  </ul>
</template>

<script setup lang="ts" generic="TItem extends object = Record<string, unknown>">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import SortableItem from './sortable-item.vue'
import { sortableContextKey, type SortableHandleProps, type SortableItemData } from './sortable-context'
import { beginSortableSession, closeSortableSessionsForList, invalidateSortableRevision, invalidateSortableScope, moveSortableItem, registerSortableList } from './sortable-registry'
import { useDroppable } from './use-droppable'
import { registerSortableAutoScroll } from './sortable-auto-scroll'
import { acquireDndLiveRegion, announceDnd, announceDndNow, disposeDndLiveRegion, replayDnd } from './dnd-announcer'
import type { SortableChangeContext, SortableMoveEvent, SortableMoveRejectEvent, SortableRevision } from './types'

defineOptions({ name: 'ASortableList' })
type SortableListItemSlotProps = {
  item: TItem
  index: number
  handleProps: SortableHandleProps
}
defineSlots<{
  item?: (props: SortableListItemSlotProps) => unknown
}>()

const props = withDefaults(defineProps<{
  items: TItem[]
  itemKey: string
  group?: string
  disabled?: boolean
  revision?: SortableRevision
  label?: string
  itemLabel?: (item: TItem, index: number) => string
  scopeKey?: string | number
}>(), { disabled: false })
const emit = defineEmits<{
  'update:items': [items: TItem[]]
  change: [items: TItem[], context?: SortableChangeContext]
  moveStart: [event: SortableMoveEvent]
  moveCommit: [event: SortableMoveEvent]
  moveReject: [event: SortableMoveRejectEvent]
}>()

const listId = ref<string>()
const displayOrder = ref(0)
const disabled = computed(() => props.disabled)
const root = ref<HTMLElement>()
const getItemKey = (item: TItem) => {
  const value = (item as Record<string, unknown>)[props.itemKey]
  return value === undefined || value === null || value === '' ? '' : String(value)
}
const fallbackRevision = ref<SortableRevision>(0)
const revisionValue = computed(() => props.revision ?? fallbackRevision.value)
const updateItems = (items: unknown[], context?: SortableChangeContext) => {
  const nextItems = items as TItem[]
  emit('update:items', nextItems)
  emit('change', nextItems, context)
}
let unregister = () => {}
let releaseLiveRegion = () => {}
let mountedActive = false
let ownerDetachObserver: MutationObserver | undefined
const listLabel = computed(() => props.label ?? `列表 ${displayOrder.value || 1}`)
onMounted(() => {
  mountedActive = true
  const ownerDocument = root.value?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  const randomUUID = ownerWindow?.crypto?.randomUUID
  const generatedId = randomUUID
    ? randomUUID.call(ownerWindow.crypto)
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`
  listId.value = `aheart-sortable-${generatedId}`
  displayOrder.value = ++sortableListDisplayOrder
  unregister = registerSortableList(listId.value, {
    group: () => props.group,
    items: () => props.items,
    update: updateItems,
    keyOf: (item) => getItemKey(item as TItem),
    revision: () => props.revision ?? fallbackRevision.value,
    scopeKey: () => props.scopeKey,
    ownerDocument: () => ownerDocument,
    disabled: () => props.disabled,
    label: () => listLabel.value,
    itemLabel: (item, index) => props.itemLabel?.(item as TItem, index) ?? getItemKey(item as TItem),
    onMoveStart: (event) => emit('moveStart', event),
    onMoveCommit: (event) => emit('moveCommit', event),
    onMoveReject: (event) => emit('moveReject', event),
    onAnnounce: (message) => { if (mountedActive) replayDnd(ownerDocument, message) },
    onAnnounceNow: (message) => { if (mountedActive) announceDndNow(ownerDocument, message) }
  })
  if (ownerDocument) releaseLiveRegion = acquireDndLiveRegion(ownerDocument)
  const frameElement = ownerWindow?.frameElement
  const ParentObserver = frameElement?.ownerDocument.defaultView?.MutationObserver
  if (frameElement && ParentObserver) {
    ownerDetachObserver = new ParentObserver(() => {
      if (!frameElement.isConnected) {
        unregister()
        releaseLiveRegion()
        if (ownerDocument) disposeDndLiveRegion(ownerDocument)
        unregisterAutoScroll()
        mountedActive = false
        ownerDetachObserver?.disconnect()
      }
    })
    ownerDetachObserver.observe(frameElement.ownerDocument, { childList: true, subtree: true })
  }
  root.value?.addEventListener('aheart-sortable-announce', handleAnnouncement)
})
onBeforeUnmount(() => {
  ownerDetachObserver?.disconnect()
  root.value?.removeEventListener('aheart-sortable-announce', handleAnnouncement)
  unregister()
  mountedActive = false
  releaseLiveRegion()
})
let unregisterAutoScroll = () => {}
onMounted(() => {
  unregisterAutoScroll = registerSortableAutoScroll(root.value)
})
onBeforeUnmount(() => unregisterAutoScroll())
const handleAnnouncement = (event: Event) => {
  const ownerDocument = root.value?.ownerDocument
  if (ownerDocument) replayDnd(ownerDocument, (event as CustomEvent<string>).detail)
}
let lastFingerprint: Array<readonly [string, TItem]> | undefined
let warnedInvalidKey = false
watch(() => props.items.map((item) => [getItemKey(item), item] as const), (entries) => {
  const keys = entries.map(([key]) => key)
  const isDevelopment = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV !== false
  if ((keys.some((key) => !key) || new Set(keys).size !== keys.length) && !warnedInvalidKey && isDevelopment) {
    warnedInvalidKey = true
    console.warn('[aheart-ui/dnd] SortableList contains a missing or duplicate itemKey; the move is rejected safely.')
  }
  const changed = !lastFingerprint || entries.length !== lastFingerprint.length || entries.some(([key, item], index) => key !== lastFingerprint![index][0] || item !== lastFingerprint![index][1])
  if (changed) {
    fallbackRevision.value = Number(fallbackRevision.value) + 1
    if (lastFingerprint && listId.value) invalidateSortableRevision(listId.value)
  }
  lastFingerprint = entries
}, { immediate: true, flush: 'sync' })
watch(() => props.scopeKey, (scope, previous) => {
  if (scope !== previous) {
    if (listId.value) invalidateSortableScope(listId.value)
    const ownerDocument = root.value?.ownerDocument
    if (ownerDocument) announceDnd(ownerDocument, '页面已切换，拖动已取消')
  }
})
watch(() => props.group, () => { if (listId.value) closeSortableSessionsForList(listId.value) })
const move = (inputSource: SortableItemData, targetIndex: number, keyboard = false) => {
  if (disabled.value) return false
  const currentListId = listId.value
  if (!currentListId) return false
  const source = inputSource.sessionId ? inputSource : beginSortableSession({ ...inputSource, input: keyboard ? 'keyboard' : 'pointer' })
  moveSortableItem(source, currentListId, targetIndex)
}

provide(sortableContextKey, {
  get listId() {
    return listId.value ?? ''
  },
  get group() {
    return props.group
  },
  get scopeKey() {
    return props.scopeKey
  },
  disabled,
  move
})
useDroppable(root, {
  data: () => {
    const currentListId = listId.value
    return currentListId
      ? { type: 'aheart-sortable', listId: currentListId, group: props.group, targetIndex: props.items.length, position: { kind: 'end' as const } }
      : undefined
  },
  accept: 'aheart-sortable',
  disabled,
  onDrop: (source) => {
    if (source.type !== 'aheart-sortable') return
    move(source as SortableItemData, props.items.length)
  }
})
</script>
