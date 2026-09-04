<script lang="ts">
let sortableListIdCounter = 0

type LiveRegionState = {
  element: HTMLElement
  count: number
  token: number
}

const liveRegions = new WeakMap<Document, LiveRegionState>()

const acquireLiveRegion = (ownerDocument: Document) => {
  let state = liveRegions.get(ownerDocument)
  if (!state) {
    const element = ownerDocument.createElement('div')
    element.className = 'aheart-dnd-live-region'
    element.setAttribute('aria-live', 'polite')
    element.setAttribute('aria-atomic', 'true')
    ;(ownerDocument.body ?? ownerDocument.documentElement).append(element)
    state = { element, count: 0, token: 0 }
    liveRegions.set(ownerDocument, state)
  }
  state.count += 1

  let released = false
  return () => {
    if (released) return
    released = true
    state!.count -= 1
    if (state!.count > 0) return
    state!.token += 1
    state!.element.remove()
    liveRegions.delete(ownerDocument)
  }
}

const announceLiveRegion = (ownerDocument: Document, announcement: string) => {
  const state = liveRegions.get(ownerDocument)
  if (!state) return
  state.token += 1
  state.element.textContent = ''
  const token = state.token
  Promise.resolve().then(() => {
    if (liveRegions.get(ownerDocument) !== state || state.token !== token) return
    state.element.textContent = announcement
  })
}
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
    <SortableItem v-for="(item, index) in items" :key="getItemKey(item)" :item="item" :index="index">
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
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SortableItem from './sortable-item.vue'
import { sortableContextKey, type SortableHandleProps, type SortableItemData } from './sortable-context'
import { moveSortableItem, registerSortableList } from './sortable-registry'
import { useDroppable } from './use-droppable'
import { registerSortableAutoScroll } from './sortable-auto-scroll'

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
}>(), { disabled: false })
const emit = defineEmits<{
  'update:items': [items: TItem[]]
  change: [items: TItem[]]
}>()

const listId = ref<string>()
const disabled = computed(() => props.disabled)
const root = ref<HTMLElement>()
const getItemKey = (item: TItem) => String((item as Record<string, unknown>)[props.itemKey])
const updateItems = (items: unknown[]) => {
  const nextItems = items as TItem[]
  emit('update:items', nextItems)
  emit('change', nextItems)
}
let unregister = () => {}
let releaseLiveRegion = () => {}
onMounted(() => {
  const ownerDocument = root.value?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  const randomUUID = ownerWindow?.crypto?.randomUUID
  const generatedId = randomUUID
    ? randomUUID.call(ownerWindow.crypto)
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`
  listId.value = `aheart-sortable-${generatedId}`
  unregister = registerSortableList(listId.value, {
    group: () => props.group,
    items: () => props.items,
    update: updateItems,
  })
  if (ownerDocument) releaseLiveRegion = acquireLiveRegion(ownerDocument)
  root.value?.addEventListener('aheart-sortable-announce', handleAnnouncement)
})
onBeforeUnmount(() => {
  root.value?.removeEventListener('aheart-sortable-announce', handleAnnouncement)
  releaseLiveRegion()
  unregister()
})
let unregisterAutoScroll = () => {}
onMounted(() => {
  unregisterAutoScroll = registerSortableAutoScroll(root.value)
})
onBeforeUnmount(() => unregisterAutoScroll())
const handleAnnouncement = (event: Event) => {
  const ownerDocument = root.value?.ownerDocument
  if (ownerDocument) announceLiveRegion(ownerDocument, (event as CustomEvent<string>).detail)
}
const move = (source: SortableItemData, targetIndex: number) => {
  if (disabled.value) return false
  const currentListId = listId.value
  if (!currentListId) return false
  moveSortableItem(source, currentListId, targetIndex)
}

provide(sortableContextKey, {
  get listId() {
    return listId.value ?? ''
  },
  group: props.group,
  disabled,
  move
})
useDroppable(root, {
  data: () => {
    const currentListId = listId.value
    return currentListId
      ? { type: 'aheart-sortable', listId: currentListId, group: props.group, targetIndex: props.items.length }
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
