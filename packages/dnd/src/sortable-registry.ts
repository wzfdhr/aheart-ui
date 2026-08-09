import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import type { SortableItemData } from './sortable-context'

interface SortableListController {
  group: () => string | undefined
  items: () => unknown[]
  update: (items: unknown[]) => void
}

const controllers = new Map<string, SortableListController>()

export function registerSortableList(listId: string, controller: SortableListController) {
  controllers.set(listId, controller)
  return () => controllers.delete(listId)
}

export function moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number) {
  const sourceController = controllers.get(source.listId)
  const targetController = controllers.get(targetListId)
  if (!sourceController || !targetController) return false
  if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) return false

  const sourceItems = sourceController.items()
  const targetItems = targetController.items()
  if (source.index < 0 || source.index >= sourceItems.length || targetIndex < 0 || targetIndex > targetItems.length) return false

  if (source.listId === targetListId) {
    const finishIndex = Math.min(targetIndex, targetItems.length - 1)
    if (source.index === finishIndex) return false
    targetController.update(reorder({ list: targetItems, startIndex: source.index, finishIndex }))
    return true
  }

  const item = sourceItems[source.index]
  sourceController.update(sourceItems.filter((_item, index) => index !== source.index))
  const nextTargetItems = [...targetItems]
  nextTargetItems.splice(targetIndex, 0, item)
  targetController.update(nextTargetItems)
  return true
}
