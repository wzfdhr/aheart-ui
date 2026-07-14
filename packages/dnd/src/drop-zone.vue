<template>
  <component :is="tag" ref="root" class="aheart-dnd-drop-zone" :aria-disabled="disabled || undefined">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDroppable } from './use-droppable'
import type { DragData, DragType } from './types'

defineOptions({ name: 'ADropZone' })

const props = withDefaults(defineProps<{
  data?: DragData
  accept?: DragType | DragType[]
  disabled?: boolean
  tag?: string
}>(), { tag: 'div' })
const emit = defineEmits<{
  drop: [data: DragData]
}>()
const root = ref<HTMLElement>()
useDroppable(root, {
  data: () => props.data,
  accept: () => props.accept,
  disabled: () => props.disabled,
  onDrop: (data) => emit('drop', data)
})
</script>
