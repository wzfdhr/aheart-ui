<template>
  <component :is="tag" ref="root" class="aheart-dnd-draggable" :class="{ 'aheart-dnd-dragging': isDragging }" :aria-disabled="disabled || undefined" :aria-label="label" role="button" :aria-keyshortcuts="keyboard ? 'Space Enter Escape' : undefined" :tabindex="keyboard && !disabled ? 0 : -1">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useDraggable } from './use-draggable'
import type { DragData, DraggableOptions } from './types'
import { cancelKeyboardScope, registerKeyboardSource } from './keyboard-service'
import { announceDnd } from './dnd-announcer'
import { endDrag, startDrag } from './drag-state'

defineOptions({ name: 'ADraggable' })

const props = withDefaults(defineProps<DraggableOptions>(), { tag: 'div', keyboard: true })
const emit = defineEmits<{
  dragStart: []
  drop: []
  keyboardGrab: [{ sessionId: string; data: DragData; source: { label: string; scopeKey?: string | number } }]
  keyboardCancel: [{ sessionId: string; data: DragData; source: { label: string; scopeKey?: string | number }; reason: 'cancelled' | 'replaced' | 'unmounted' | 'scope-changed' | 'page-hidden' | 'owner-detached' }]
}>()
const root = ref<HTMLElement>()
watch(() => props.scopeKey, (scope) => { if (root.value) cancelKeyboardScope(root.value.ownerDocument, scope) })
const { isDragging } = useDraggable(root, {
  data: () => props.data,
  disabled: () => props.disabled,
  onDragStart: () => emit('dragStart'),
  onDrop: () => emit('drop')
})
watchEffect((onCleanup) => {
  const element = root.value
  if (!element || !props.keyboard) return
  const label = () => props.label ?? '可拖动项目'
  const cleanup = registerKeyboardSource({
    element,
    getData: () => ({ ...props.data }),
    getLabel: label,
    getScope: () => props.scopeKey,
    isDisabled: () => Boolean(props.disabled),
    onGrab: (event) => { startDrag(event.data, element.ownerDocument); emit('dragStart'); emit('keyboardGrab', event) },
    onCancel: (event) => { endDrag(element.ownerDocument); emit('keyboardCancel', event); announceDnd(element.ownerDocument, `拖动已取消：${event.reason}`) }
  })
  onCleanup(cleanup)
})
</script>
