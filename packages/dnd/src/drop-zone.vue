<template>
  <component :is="tag" ref="root" class="aheart-dnd-drop-zone" :aria-disabled="disabled || undefined" :aria-label="label" role="region" :aria-keyshortcuts="keyboard ? 'Space Enter' : undefined" :tabindex="keyboard ? (disabled ? -1 : 0) : -1">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useDroppable } from './use-droppable'
import type { DragData, DroppableOptions } from './types'
import { cancelKeyboardScope, registerKeyboardZone } from './keyboard-service'
import { endDrag } from './drag-state'

defineOptions({ name: 'ADropZone' })

const props = withDefaults(defineProps<DroppableOptions>(), { tag: 'div', keyboard: true })
const emit = defineEmits<{
  drop: [data: DragData]
  keyboardDrop: [{ sessionId: string; data: DragData; source: { label: string; scopeKey?: string | number }; target: { label: string; scopeKey?: string | number } }]
}>()
const root = ref<HTMLElement>()
watch(() => props.scopeKey, (scope) => { if (root.value) cancelKeyboardScope(root.value.ownerDocument, scope) })
useDroppable(root, {
  data: () => props.data,
  accept: () => props.accept,
  disabled: () => props.disabled,
  onDrop: (data) => emit('drop', data)
})
watchEffect((onCleanup) => {
  const element = root.value
  if (!element || !props.keyboard) return
  const cleanup = registerKeyboardZone({
    element,
    getData: () => ({ ...props.data }),
    getLabel: () => props.label ?? '放置区域',
    getScope: () => props.scopeKey,
    isDisabled: () => Boolean(props.disabled),
    accepts: (data) => {
      const accepted = Array.isArray(props.accept) ? props.accept : props.accept ? [props.accept] : []
      return accepted.length === 0 || accepted.includes(String(data.type ?? ''))
    },
    onGrab: () => undefined,
    onDrop: (data, event) => { endDrag(element.ownerDocument); emit('drop', data); emit('keyboardDrop', event) }
  })
  onCleanup(cleanup)
})
</script>
