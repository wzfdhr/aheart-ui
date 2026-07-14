import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'
import { endDrag, startDrag } from './drag-state'
import type { DragData } from './types'

export interface UseDraggableOptions {
  data: MaybeRefOrGetter<DragData>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  onDragStart?: () => void
  onDrop?: () => void
}

export function useDraggable(element: Ref<HTMLElement | undefined>, options: UseDraggableOptions) {
  const isDragging = ref(false)

  watchEffect((onCleanup) => {
    const target = element.value
    if (!target) return
    const cleanup = draggable({
      element: target,
      getInitialData: () => toValue(options.data),
      canDrag: () => !toValue(options.disabled ?? false),
      onDragStart: () => {
        isDragging.value = true
        startDrag(toValue(options.data))
        options.onDragStart?.()
      },
      onDrop: () => {
        isDragging.value = false
        endDrag()
        options.onDrop?.()
      }
    })
    onCleanup(cleanup)
  })

  return { isDragging }
}
