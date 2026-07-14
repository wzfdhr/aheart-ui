import { computed, shallowRef } from 'vue'
import type { DragData } from './types'

const activeDragData = shallowRef<DragData | undefined>()

export const isDragActive = computed(() => activeDragData.value !== undefined)
export const currentDragData = computed(() => activeDragData.value)

export const startDrag = (data: DragData) => {
  activeDragData.value = data
}

export const endDrag = () => {
  activeDragData.value = undefined
}
