<script lang="ts">
let sortableListIdCounter = 0
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
    <SortableItem v-for="(item, index) in items" :key="String(item[itemKey])" :item="item" :index="index">
      <template #default="slotProps">
        <slot
          name="item"
          v-bind="slotProps as SortableListItemSlotProps"
        />
      </template>
    </SortableItem>
  </ul>
  <div class="aheart-dnd-live-region" aria-live="polite">{{ announcement }}</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SortableItem from './sortable-item.vue'
import { sortableContextKey, type SortableHandleProps, type SortableItemData } from './sortable-context'
import { moveSortableItem, registerSortableList } from './sortable-registry'
import { useDroppable } from './use-droppable'
import { registerSortableAutoScroll } from './sortable-auto-scroll'

defineOptions({ name: 'ASortableList' })
type SortableListItemSlotProps = {
  item: Record<string, unknown>
  index: number
  handleProps: SortableHandleProps
}
defineSlots<{
  item?: (props: { item: Record<string, unknown>; index: number; handleProps: SortableHandleProps }) => unknown
}>()

const props = withDefaults(defineProps<{
  items: Record<string, unknown>[]
  itemKey: string
  group?: string
  disabled?: boolean
}>(), { disabled: false })
const emit = defineEmits<{
  'update:items': [items: Record<string, unknown>[]]
  change: [items: Record<string, unknown>[]]
}>()

const listId = ref<string>()
const disabled = computed(() => props.disabled)
const announcement = ref('')
const root = ref<HTMLElement>()
const updateItems = (items: unknown[]) => {
  const nextItems = items as Record<string, unknown>[]
  emit('update:items', nextItems)
  emit('change', nextItems)
}
let unregister = () => {}
onMounted(() => {
  const ownerWindow = root.value?.ownerDocument.defaultView
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
  root.value?.addEventListener('aheart-sortable-announce', handleAnnouncement)
})
onBeforeUnmount(() => {
  root.value?.removeEventListener('aheart-sortable-announce', handleAnnouncement)
  unregister()
})
let unregisterAutoScroll = () => {}
onMounted(() => {
  unregisterAutoScroll = registerSortableAutoScroll(root.value)
})
onBeforeUnmount(() => unregisterAutoScroll())
const handleAnnouncement = (event: Event) => {
  announcement.value = (event as CustomEvent<string>).detail
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
