import { reorder } from "@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/reorder.js";
const controllers = /* @__PURE__ */ new Map();
function registerSortableList(listId, controller) {
  controllers.set(listId, controller);
  return () => controllers.delete(listId);
}
function moveSortableItem(source, targetListId, targetIndex) {
  const sourceController = controllers.get(source.listId);
  const targetController = controllers.get(targetListId);
  if (!sourceController || !targetController) return false;
  if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) return false;
  const sourceItems = sourceController.items();
  const targetItems = targetController.items();
  if (source.index < 0 || source.index >= sourceItems.length || targetIndex < 0 || targetIndex > targetItems.length) return false;
  if (source.listId === targetListId) {
    const finishIndex = Math.min(targetIndex, targetItems.length - 1);
    if (source.index === finishIndex) return false;
    targetController.update(reorder({ list: targetItems, startIndex: source.index, finishIndex }));
    return true;
  }
  const item = sourceItems[source.index];
  sourceController.update(sourceItems.filter((_item, index) => index !== source.index));
  const nextTargetItems = [...targetItems];
  nextTargetItems.splice(targetIndex, 0, item);
  targetController.update(nextTargetItems);
  return true;
}
export {
  moveSortableItem,
  registerSortableList
};
