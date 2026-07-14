import type { InjectionKey, Ref } from 'vue'
import type { DragData } from './types'

export interface SortableItemData extends DragData {
  type: 'aheart-sortable'
  listId: string
  group?: string
  index: number
}

export interface SortableContextValue {
  listId: string
  group?: string
  disabled: Ref<boolean>
  move: (source: SortableItemData, targetIndex: number, keyboard?: boolean) => void
}

export const sortableContextKey: InjectionKey<SortableContextValue> = Symbol('aheart-sortable-context')
