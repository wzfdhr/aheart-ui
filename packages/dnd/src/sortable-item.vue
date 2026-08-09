<template>
  <li
    ref="root"
    class="aheart-dnd-sortable-item"
    :class="{ 'aheart-dnd-dragging': isDragging || isTouchDragging }"
    :data-sortable-index="index"
    :tabindex="itemDisabled ? -1 : 0"
    :aria-disabled="itemDisabled ? 'true' : undefined"
    @dragstart.capture="handleNativeDragStart"
    @keydown="handleKeydown"
  >
    <slot :item="item" :index="index" :handle-props="handleProps" />
  </li>
</template>

<script setup lang="ts">
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { computed, inject, nextTick, onBeforeUnmount, ref, watchEffect, type ComponentPublicInstance } from 'vue'
import { endDrag, startDrag } from './drag-state'
import { sortableContextKey, type SortableHandleProps, type SortableItemData } from './sortable-context'
import { useDroppable } from './use-droppable'

defineOptions({ name: 'ASortableItem' })
defineSlots<{
  default?: (props: { item: Record<string, unknown>; index: number; handleProps: SortableHandleProps }) => unknown
}>()

const props = defineProps<{
  item: Record<string, unknown>
  index: number
}>()
const context = inject(sortableContextKey)
if (!context) throw new Error('ASortableItem must be used inside ASortableList.')
const sortableContext = context

const root = ref<HTMLElement>()
const itemDisabled = computed(() => sortableContext.disabled.value || (
  typeof props.item === 'object' && props.item !== null && 'disabled' in props.item && props.item.disabled === true
))
const data = computed<SortableItemData>(() => ({
  type: 'aheart-sortable',
  listId: sortableContext.listId,
  group: sortableContext.group,
  index: props.index
}))
const isTouchDragging = ref(false)
const dragHandle = ref<Element>()
let touchSession: {
  pointerId: number
  startX: number
  startY: number
  data: SortableItemData
  document: Document
  window: Window
  started: boolean
} | undefined

const removeTouchListeners = (session: NonNullable<typeof touchSession>) => {
  session.document.removeEventListener('pointermove', handleTouchPointerMove)
  session.document.removeEventListener('pointerup', handleTouchPointerUp)
  session.document.removeEventListener('pointercancel', handleTouchPointerCancel)
  session.document.removeEventListener('visibilitychange', handleTouchVisibilityChange)
  session.window.removeEventListener('blur', handleTouchInterruption)
  session.window.removeEventListener('pagehide', handleTouchInterruption)
}
const clearTouchSession = (clearDragState = true) => {
  if (!touchSession) return
  const session = touchSession
  touchSession = undefined
  removeTouchListeners(session)
  if (session.started) {
    isTouchDragging.value = false
    if (clearDragState) endDrag()
  }
}
function handleTouchPointerMove(event: PointerEvent) {
  if (!touchSession || event.pointerId !== touchSession.pointerId) return
  if (itemDisabled.value) {
    clearTouchSession()
    return
  }
  if (!touchSession.started) {
    const distanceX = event.clientX - touchSession.startX
    const distanceY = event.clientY - touchSession.startY
    if (Math.hypot(distanceX, distanceY) < 6) return
    touchSession.started = true
    isTouchDragging.value = true
    startDrag(touchSession.data)
  }
  event.preventDefault()
}
function handleTouchPointerUp(event: PointerEvent) {
  if (!touchSession || event.pointerId !== touchSession.pointerId) return
  const session = touchSession
  const sourceElement = root.value
  if (session.started) {
    event.preventDefault()
    const target = session.document.elementFromPoint(event.clientX, event.clientY)
    const targetItem = target?.closest<HTMLElement>('.aheart-dnd-sortable-item')
    const sourceList = sourceElement?.closest('.aheart-dnd-sortable-list')
    if (
      targetItem
      && targetItem.getAttribute('aria-disabled') !== 'true'
      && sourceList
      && targetItem.closest('.aheart-dnd-sortable-list') === sourceList
    ) {
      const targetIndex = Number(targetItem.dataset.sortableIndex)
      if (Number.isInteger(targetIndex)) sortableContext.move(session.data, targetIndex)
    }
  }
  clearTouchSession()
  if (session.started) {
    void nextTick(() => {
      if (sourceElement?.isConnected && !itemDisabled.value) sourceElement.focus({ preventScroll: true })
    })
  }
}
function handleTouchPointerCancel(event: PointerEvent) {
  if (!touchSession || event.pointerId !== touchSession.pointerId) return
  clearTouchSession()
}
function handleTouchInterruption() {
  clearTouchSession()
}
function handleTouchVisibilityChange() {
  if (touchSession?.document.visibilityState === 'hidden') clearTouchSession()
}
const handlePointerDown = (event: PointerEvent) => {
  if (touchSession || itemDisabled.value) return
  if (event.pointerType !== 'touch' || !event.isPrimary || event.button !== 0) return
  const ownerDocument = root.value?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  if (!ownerDocument || !ownerWindow) return
  touchSession = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    data: { ...data.value },
    document: ownerDocument,
    window: ownerWindow,
    started: false
  }
  ownerDocument.addEventListener('pointermove', handleTouchPointerMove, { passive: false })
  ownerDocument.addEventListener('pointerup', handleTouchPointerUp)
  ownerDocument.addEventListener('pointercancel', handleTouchPointerCancel)
  ownerDocument.addEventListener('visibilitychange', handleTouchVisibilityChange)
  ownerWindow.addEventListener('blur', handleTouchInterruption)
  ownerWindow.addEventListener('pagehide', handleTouchInterruption)
}
const handleNativeDragStart = () => {
  // A native drag owns the interaction once it starts; the fallback must not submit it too.
  clearTouchSession(false)
}
onBeforeUnmount(() => clearTouchSession())

const setDragHandle = (element: Element | ComponentPublicInstance | null) => {
  const candidate = element instanceof Element ? element : element?.$el
  dragHandle.value = candidate instanceof Element ? candidate : undefined
}
const handleProps: SortableHandleProps = {
  class: 'aheart-dnd-sortable-handle',
  'data-aheart-dnd-handle': '',
  ref: setDragHandle,
  onPointerdown: handlePointerDown
}
const isDragging = ref(false)
watchEffect((onCleanup) => {
  const target = root.value
  const handle = dragHandle.value
  if (!target) return
  const cleanup = draggable({
    element: target,
    dragHandle: handle,
    getInitialData: () => data.value,
    canDrag: () => !itemDisabled.value,
    onDragStart: () => {
      isDragging.value = true
      startDrag(data.value)
    },
    onDrop: () => {
      isDragging.value = false
      endDrag()
    }
  })
  onCleanup(() => {
    cleanup()
    if (isDragging.value) {
      isDragging.value = false
      endDrag()
    }
  })
})
useDroppable(root, {
  data,
  accept: 'aheart-sortable',
  disabled: itemDisabled,
  onDrop: (source) => {
    if (source.type !== 'aheart-sortable' || source.group !== sortableContext.group) return
    sortableContext.move(source as SortableItemData, props.index)
  }
})
const handleKeydown = (event: KeyboardEvent) => {
  if (itemDisabled.value) return
  if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
  event.preventDefault()
  context.move(data.value, props.index + (event.key === 'ArrowUp' ? -1 : 1), true)
}
</script>
