<template>
  <ul ref="root" class="aheart-dnd-sortable-list" role="list">
    <SortableItem v-for="(item, index) in items" :key="String(item[itemKey])" :item="item" :index="index">
      <template #default="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>
    </SortableItem>
  </ul>
  <div class="aheart-dnd-live-region" aria-live="polite">{{ announcement }}</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref } from 'vue'
import SortableItem from './sortable-item.vue'
import { sortableContextKey, type SortableItemData } from './sortable-context'
import { moveSortableItem, registerSortableList } from './sortable-registry'
import { useDroppable } from './use-droppable'

defineOptions({ name: 'ASortableList' })

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
const unregister = registerSortableList(listId, { group: () => props.group, items: () => props.items, update: updateItems })
onBeforeUnmount(unregister)
const move = (source: SortableItemData, targetIndex: number, keyboard = false) => {
  if (!disabled.value && moveSortableItem(source, listId, targetIndex) && keyboard) {
    announcement.value = `已移动到第 ${targetIndex + 1} 项`
  }
}

provide(sortableContextKey, { listId, group: props.group, disabled, move })
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
