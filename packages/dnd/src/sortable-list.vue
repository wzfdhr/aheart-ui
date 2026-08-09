<template>
  <ul ref="root" class="aheart-dnd-sortable-list" :data-aheart-sortable-list-id="listId" role="list">
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
import { moveSortableItem, moveSortableItemToAdjacentList, registerSortableList } from './sortable-registry'
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

const listId = `aheart-sortable-${Math.random().toString(36).slice(2)}`
const disabled = computed(() => props.disabled)
const announcement = ref('')
const root = ref<HTMLElement>()
const updateItems = (items: unknown[]) => {
  const nextItems = items as Record<string, unknown>[]
  emit('update:items', nextItems)
  emit('change', nextItems)
}
const unregister = registerSortableList(listId, {
  group: () => props.group,
  disabled: () => disabled.value,
  items: () => props.items,
  update: updateItems,
  announce: (message) => { announcement.value = message }
})
onBeforeUnmount(unregister)
let unregisterAutoScroll = () => {}
onMounted(() => {
  unregisterAutoScroll = registerSortableAutoScroll(root.value)
})
onBeforeUnmount(() => unregisterAutoScroll())
const move = (source: SortableItemData, targetIndex: number, keyboard = false) => {
  if (disabled.value) return false
  const result = moveSortableItem(source, listId, targetIndex)
  if (result && keyboard) announcement.value = `已移动到第 ${result.targetIndex + 1} 项`
  return result
}

const moveAdjacent = (source: SortableItemData, direction: -1 | 1) => moveSortableItemToAdjacentList(source, direction)

provide(sortableContextKey, { listId, group: props.group, disabled, move, moveAdjacent })
useDroppable(root, {
  data: () => ({ type: 'aheart-sortable', listId, group: props.group, targetIndex: props.items.length }),
  accept: 'aheart-sortable',
  disabled,
  onDrop: (source) => {
    if (source.type !== 'aheart-sortable') return
    move(source as SortableItemData, props.items.length)
  }
})
</script>
