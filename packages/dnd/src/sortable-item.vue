<template>
  <li
    ref="root"
    class="aheart-dnd-sortable-item"
    :class="{ 'aheart-dnd-dragging': isDragging }"
    :data-sortable-index="index"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <slot :item="item" :index="index" />
  </li>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { sortableContextKey, type SortableItemData } from './sortable-context'
import { useDraggable } from './use-draggable'
import { useDroppable } from './use-droppable'

defineOptions({ name: 'ASortableItem' })

const props = defineProps<{
  item: unknown
  index: number
}>()
const context = inject(sortableContextKey)
if (!context) throw new Error('ASortableItem must be used inside ASortableList.')

const root = ref<HTMLElement>()
const data = computed<SortableItemData>(() => ({
  type: 'aheart-sortable',
  listId: context.listId,
  group: context.group,
  index: props.index
}))
const { isDragging } = useDraggable(root, { data, disabled: context.disabled })
useDroppable(root, {
  data,
  accept: 'aheart-sortable',
  disabled: context.disabled,
  onDrop: (source) => {
    if (source.type !== 'aheart-sortable' || source.group !== context.group) return
    context.move(source as SortableItemData, props.index)
  }
})
const handleKeydown = (event: KeyboardEvent) => {
  if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
  event.preventDefault()
  context.move(data.value, props.index + (event.key === 'ArrowUp' ? -1 : 1), true)
}
</script>
