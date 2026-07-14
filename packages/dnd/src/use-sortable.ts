import type { MaybeRefOrGetter, Ref } from 'vue'
import { useDraggable } from './use-draggable'
import { useDroppable } from './use-droppable'
import type { DragData, DragType } from './types'

export interface UseSortableOptions {
  data: MaybeRefOrGetter<DragData>
  dropData?: MaybeRefOrGetter<DragData | undefined>
  accept?: MaybeRefOrGetter<DragType | DragType[] | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  onDragStart?: () => void
  onDrop?: (data: DragData) => void
}

export function useSortable(element: Ref<HTMLElement | undefined>, options: UseSortableOptions) {
  const draggableState = useDraggable(element, {
    data: options.data,
    disabled: options.disabled,
    onDragStart: options.onDragStart
  })
  useDroppable(element, {
    data: options.dropData,
    accept: options.accept,
    disabled: options.disabled,
    onDrop: options.onDrop
  })
  return draggableState
}
