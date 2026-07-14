<template>
  <component :is="tag" ref="root" class="aheart-dnd-draggable" :class="{ 'aheart-dnd-dragging': isDragging }" :aria-disabled="disabled || undefined">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from './use-draggable'
import type { DragData } from './types'

defineOptions({ name: 'ADraggable' })

const props = withDefaults(defineProps<{
  data: DragData
  disabled?: boolean
  tag?: string
}>(), { tag: 'div' })
const emit = defineEmits<{
  dragStart: []
  drop: []
}>()
const root = ref<HTMLElement>()
const { isDragging } = useDraggable(root, {
  data: () => props.data,
  disabled: () => props.disabled,
  onDragStart: () => emit('dragStart'),
  onDrop: () => emit('drop')
})
</script>
