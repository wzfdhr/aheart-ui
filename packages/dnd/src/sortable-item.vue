<script lang="ts">
let activeTouchOwner: (() => void) | undefined
</script>

<template>
  <li
    ref="root"
    class="aheart-dnd-sortable-item"
    :class="{ 'aheart-dnd-dragging': isDragging || isTouchDragging }"
    :data-sortable-index="index"
    :tabindex="itemDisabled ? -1 : 0"
    :aria-disabled="itemDisabled ? 'true' : undefined"
    @dragstart.capture="handleNativeDragStart"
    @dragend.capture="handleNativeDragEnd"
    @keydown="handleKeydown"
  >
    <slot :item="item" :index="index" :handle-props="handleProps" />
  </li>
</template>

<script setup lang="ts">
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { computed, inject, nextTick, onBeforeUnmount, ref, watch, watchEffect, type ComponentPublicInstance } from 'vue'
import { cancelNativeDrag, endDrag, startDrag } from './drag-state'
import { sortableContextKey, type SortableHandleProps, type SortableItemData } from './sortable-context'
import { beginSortableSession, closeSortableSession, findAdjacentSortableList, moveSortableItem } from './sortable-registry'
import { useDroppable } from './use-droppable'

defineOptions({ name: 'ASortableItem' })
defineSlots<{
  default?: (props: { item: unknown; index: number; handleProps: SortableHandleProps }) => unknown
}>()

const props = defineProps<{
  item: unknown
  index: number
  itemKey?: string
  revision?: string | number
}>()
const context = inject(sortableContextKey)
if (!context) throw new Error('ASortableItem must be used inside ASortableList.')
const sortableContext = context
watch(() => sortableContext.group, () => {
  closeSortableSession(activeSession?.sessionId)
  activeSession = undefined
})

const root = ref<HTMLElement>()
const itemDisabled = computed(() => sortableContext.disabled.value || (
  typeof props.item === 'object' && props.item !== null && 'disabled' in props.item && props.item.disabled === true
))
const data = computed<SortableItemData>(() => ({
  type: 'aheart-sortable',
  listId: sortableContext.listId,
  group: sortableContext.group,
  index: props.index,
  itemKey: props.itemKey,
  revision: props.revision,
  scopeKey: sortableContext.scopeKey
}))
let activeSession: SortableItemData | undefined
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
  if (activeTouchOwner === releaseTouchOwnership) activeTouchOwner = undefined
  removeTouchListeners(session)
  if (session.started) {
    isTouchDragging.value = false
    if (clearDragState) endDrag(session.document)
  }
  closeSortableSession(session.data.sessionId)
}
function releaseTouchOwnership() {
  clearTouchSession()
}
const completeMove = (
  ownerDocument: Document,
  sourceElement: HTMLElement,
  targetListId: string,
  targetIndex: number,
  focusHandle: boolean,
  _announcement: string
) => {
  void nextTick(() => {
    const destinationList = Array.from(ownerDocument.querySelectorAll<HTMLElement>('.aheart-dnd-sortable-list'))
      .find((element) => element.dataset.aheartSortableListId === targetListId)
    const destinationItem = destinationList?.querySelector<HTMLElement>(`[data-sortable-index="${targetIndex}"]`)
    const moved = sourceElement.isConnected
      ? destinationItem === sourceElement
      : Boolean(destinationItem)
    if (!moved || !destinationList || !destinationItem) return
    const destinationHandle = focusHandle
      ? destinationItem?.querySelector<HTMLElement>('[data-aheart-dnd-handle]')
      : undefined
    ;(destinationHandle ?? destinationItem)?.focus({ preventScroll: true })
  })
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
    startDrag(touchSession.data, touchSession.document)
  }
  event.preventDefault()
}
function handleTouchPointerUp(event: PointerEvent) {
  if (!touchSession || event.pointerId !== touchSession.pointerId) return
  const session = touchSession
  if (session.started) {
    event.preventDefault()
    const target = session.document.elementFromPoint(event.clientX, event.clientY)
    const targetItem = target?.closest<HTMLElement>('.aheart-dnd-sortable-item')
    const targetList = target?.closest<HTMLElement>('.aheart-dnd-sortable-list')
    const targetListId = targetList?.dataset.aheartSortableListId
    if (
      targetListId
      && targetList.dataset.aheartSortableDisabled !== 'true'
      && (!targetItem || targetItem.getAttribute('aria-disabled') !== 'true')
    ) {
      const targetIndex = targetItem
          ? Number(targetItem.dataset.sortableIndex)
          : targetList.querySelectorAll('.aheart-dnd-sortable-item').length
      if (Number.isInteger(targetIndex)) {
        const sourceElement = root.value
        const moved = moveSortableItem(session.data, targetListId, targetIndex)
        if (moved && sourceElement) {
          completeMove(
            session.document,
            sourceElement,
            targetListId,
            targetIndex,
            session.data.listId !== targetListId,
            session.data.listId === targetListId ? `已移动到第 ${targetIndex + 1} 项` : `已跨列表移动到第 ${targetIndex + 1} 项`
          )
        }
      }
    }
  }
  clearTouchSession()
}
function handleTouchPointerCancel(event: PointerEvent) {
  if (!touchSession || event.pointerId !== touchSession.pointerId) return
  clearTouchSession()
}
function handleTouchInterruption() {
  closeSortableSession(touchSession?.data.sessionId)
  clearTouchSession()
}
function handleTouchVisibilityChange() {
  if (touchSession?.document.visibilityState === 'hidden') {
    closeSortableSession(touchSession.data.sessionId)
    clearTouchSession()
  }
}
const handlePointerDown = (event: PointerEvent) => {
  if (touchSession || activeTouchOwner || itemDisabled.value) return
  if (event.pointerType !== 'touch' || !event.isPrimary || event.button !== 0) return
  const ownerDocument = root.value?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  if (!ownerDocument || !ownerWindow) return
  touchSession = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    data: beginSortableSession({ ...data.value, input: 'touch' }),
    document: ownerDocument,
    window: ownerWindow,
    started: false
  }
  activeTouchOwner = releaseTouchOwnership
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
const handleNativeDragEnd = () => {
  const ownerDocument = root.value?.ownerDocument
  closeSortableSession(activeSession?.sessionId)
  activeSession = undefined
  isDragging.value = false
  if (ownerDocument) endDrag(ownerDocument)
}
onBeforeUnmount(() => clearTouchSession())

const setDragHandle = (element: Element | ComponentPublicInstance | null) => {
  const candidate = element && '$el' in element ? element.$el : element
  const ElementConstructor = candidate?.ownerDocument?.defaultView?.Element
  dragHandle.value = ElementConstructor && candidate instanceof ElementConstructor ? candidate : undefined
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
    getInitialData: () => {
      activeSession ??= beginSortableSession({ ...data.value, input: 'pointer' })
      return activeSession
    },
    canDrag: () => !itemDisabled.value,
    onDragStart: () => {
      isDragging.value = true
      activeSession ??= beginSortableSession({ ...data.value, input: 'pointer' })
      startDrag(activeSession, target.ownerDocument)
    },
    onDrop: () => {
      isDragging.value = false
      closeSortableSession(activeSession?.sessionId)
      activeSession = undefined
      endDrag(target.ownerDocument)
    }
  })
  onCleanup(() => {
    const sessionId = activeSession?.sessionId
    cleanup()
    if (isDragging.value) {
      cancelNativeDrag(target.ownerDocument.defaultView ?? undefined)
      isDragging.value = false
      closeSortableSession(activeSession?.sessionId)
      activeSession = undefined
      endDrag(target.ownerDocument)
    }
    closeSortableSession(sessionId)
    activeSession = undefined
  })
})
useDroppable(root, {
  data: () => ({ ...data.value, position: { kind: 'item' as const, itemKey: props.itemKey ?? String(props.index) } }),
  accept: 'aheart-sortable',
  disabled: itemDisabled,
  onDrop: (source) => {
    if (source.type !== 'aheart-sortable') return
    sortableContext.move({ ...(source as SortableItemData), position: { kind: 'item', itemKey: props.itemKey ?? String(props.index) } }, props.index)
  }
})
const handleKeydown = (event: KeyboardEvent) => {
  if (itemDisabled.value) return
  if (!event.altKey || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
  event.preventDefault()
  const target = event.target && typeof event.target === 'object' && 'closest' in event.target
    ? event.target as Element
    : undefined
  const ownerDocument = target?.ownerDocument ?? root.value?.ownerDocument
  const sourceElement = root.value
  if (!ownerDocument || !sourceElement) return
  const focusHandle = Boolean(target?.closest('[data-aheart-dnd-handle]'))
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const targetIndex = props.index + (event.key === 'ArrowUp' ? -1 : 1)
    const session = beginSortableSession({ ...data.value, input: 'keyboard', keyboard: true })
    context.move({ ...session }, targetIndex, true)
    completeMove(ownerDocument, sourceElement, sortableContext.listId, targetIndex, focusHandle, `已移动到第 ${targetIndex + 1} 项`)
    return
  }

  const lists = Array.from(ownerDocument.querySelectorAll<HTMLElement>('.aheart-dnd-sortable-list'))
  const sourceListIndex = lists.findIndex((list) => list.dataset.aheartSortableListId === sortableContext.listId)
  const direction = event.key === 'ArrowLeft' ? -1 : 1
  const registeredTarget = findAdjacentSortableList(sortableContext.listId, direction)
  if (registeredTarget) {
    const session = beginSortableSession({ ...data.value, input: 'keyboard', keyboard: true })
    if (moveSortableItem(session, registeredTarget.listId, registeredTarget.length)) {
      completeMove(ownerDocument, sourceElement, registeredTarget.listId, registeredTarget.length, focusHandle, `已跨列表移动到第 ${registeredTarget.length + 1} 项`)
    }
    return
  }
  for (let index = sourceListIndex + direction; index >= 0 && index < lists.length; index += direction) {
    const targetList = lists[index]
    const targetListId = targetList.dataset.aheartSortableListId
    if (
      !targetListId
      || targetList.dataset.aheartSortableDisabled === 'true'
      || !sortableContext.group
      || targetList.dataset.aheartSortableGroup !== sortableContext.group
    ) continue

    const targetIndex = targetList.querySelectorAll('.aheart-dnd-sortable-item').length
    const session = beginSortableSession({ ...data.value, input: 'keyboard', keyboard: true })
    if (moveSortableItem(session, targetListId, targetIndex)) {
      completeMove(ownerDocument, sourceElement, targetListId, targetIndex, focusHandle, `已跨列表移动到第 ${targetIndex + 1} 项`)
    }
    return
  }
}
</script>
