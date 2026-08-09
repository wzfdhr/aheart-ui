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
  if (sourceController.disabled() || targetController.disabled()) return false;
  if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) return false;
  const sourceItems = sourceController.items();
  const targetItems = targetController.items();
  if (source.index < 0 || source.index >= sourceItems.length || targetIndex < 0 || targetIndex > targetItems.length) return false;
  if (source.listId === targetListId) {
    const finishIndex = Math.min(targetIndex, targetItems.length - 1);
    if (source.index === finishIndex) return false;
    targetController.update(reorder({ list: targetItems, startIndex: source.index, finishIndex }));
    return { targetListId, targetIndex: finishIndex, crossedList: false };
  }
  const item = sourceItems[source.index];
  sourceController.update(sourceItems.filter((_item, index) => index !== source.index));
  const nextTargetItems = [...targetItems];
  nextTargetItems.splice(targetIndex, 0, item);
  targetController.update(nextTargetItems);
  return { targetListId, targetIndex, crossedList: true };
}
function moveSortableItemToAdjacentList(source, direction) {
  const sourceIndex = [...controllers.keys()].indexOf(source.listId);
  const sourceController = controllers.get(source.listId);
  if (sourceIndex === -1 || !sourceController || sourceController.disabled()) return false;
  const entries = [...controllers.entries()];
  for (let index = sourceIndex + direction; index >= 0 && index < entries.length; index += direction) {
    const [targetListId, targetController] = entries[index];
    if (targetController.disabled() || !sourceController.group() || sourceController.group() !== targetController.group()) continue;
    const result = moveSortableItem(source, targetListId, targetController.items().length);
    if (!result) return false;
    const directionLabel = direction === -1 ? "上一个" : "下一个";
    sourceController.announce(`已跨列表移至${directionLabel}列表第 ${result.targetIndex + 1} 项`);
    targetController.announce(`已跨列表移入第 ${result.targetIndex + 1} 项`);
    return result;
  }
  return false;
}
export {
  moveSortableItem,
  moveSortableItemToAdjacentList,
  registerSortableList
};
