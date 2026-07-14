import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { toValue, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'
import type { DragData, DragType } from './types'

export interface UseDroppableOptions {
  data?: MaybeRefOrGetter<DragData | undefined>
  accept?: MaybeRefOrGetter<DragType | DragType[] | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  onDrop?: (data: DragData) => void
}

export function useDroppable(element: Ref<HTMLElement | undefined>, options: UseDroppableOptions) {
  watchEffect((onCleanup) => {
    const target = element.value
    if (!target) return
    const cleanup = dropTargetForElements({
      element: target,
      getData: () => toValue(options.data) ?? {},
      canDrop: ({ source }) => {
        if (toValue(options.disabled ?? false)) return false
        const accept = toValue(options.accept ?? [])
        const acceptedTypes = Array.isArray(accept) ? accept : [accept]
        return acceptedTypes.length === 0 || acceptedTypes.includes(String(source.data.type ?? ''))
      },
      onDrop: ({ source }) => options.onDrop?.(source.data as DragData)
    })
    onCleanup(cleanup)
  })
}
