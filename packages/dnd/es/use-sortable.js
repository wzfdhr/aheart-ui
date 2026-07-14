import { useDraggable } from "./use-draggable.js";
import { useDroppable } from "./use-droppable.js";
function useSortable(element, options) {
  const draggableState = useDraggable(element, {
    data: options.data,
    disabled: options.disabled,
    onDragStart: options.onDragStart
  });
  useDroppable(element, {
    data: options.dropData,
    accept: options.accept,
    disabled: options.disabled,
    onDrop: options.onDrop
  });
  return draggableState;
}
export {
  useSortable
};
