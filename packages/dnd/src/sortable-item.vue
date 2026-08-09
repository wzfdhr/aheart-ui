<template>
  <li
    ref="root"
    class="aheart-dnd-sortable-item"
    :class="{ 'aheart-dnd-dragging': isDragging || isTouchDragging }"
    :data-sortable-index="index"
    :tabindex="itemDisabled ? -1 : 0"
    :aria-disabled="itemDisabled ? 'true' : undefined"
    @pointerdown="handlePointerDown"
    @dragstart.capture="handleNativeDragStart"
    @keydown="handleKeydown"
  >
    <slot :item="item" :index="index" />
  </li>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref } from 'vue'
import { endDrag, startDrag } from './drag-state'
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
let touchSession: {
  pointerId: number
  startX: number
  startY: number
  data: SortableItemData
  document: Document
  started: boolean
} | undefined

const removeTouchListeners = (session: NonNullable<typeof touchSession>) => {
  session.document.removeEventListener('pointermove', handleTouchPointerMove)
  session.document.removeEventListener('pointerup', handleTouchPointerUp)
  session.document.removeEventListener('pointercancel', handleTouchPointerCancel)
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
const handlePointerDown = (event: PointerEvent) => {
  if (touchSession || itemDisabled.value) return
  if (event.pointerType !== 'touch' || !event.isPrimary || event.button !== 0) return
  const ownerDocument = root.value?.ownerDocument
  if (!ownerDocument) return
  touchSession = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    data: { ...data.value },
    document: ownerDocument,
    started: false
  }
  ownerDocument.addEventListener('pointermove', handleTouchPointerMove, { passive: false })
  ownerDocument.addEventListener('pointerup', handleTouchPointerUp)
  ownerDocument.addEventListener('pointercancel', handleTouchPointerCancel)
}
const handleNativeDragStart = () => {
  // A native drag owns the interaction once it starts; the fallback must not submit it too.
  clearTouchSession(false)
}
onBeforeUnmount(() => clearTouchSession())

const { isDragging } = useDraggable(root, { data, disabled: itemDisabled })
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
