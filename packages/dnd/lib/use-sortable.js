"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const useDraggable = require("./use-draggable.js");
const useDroppable = require("./use-droppable.js");
function useSortable(element, options) {
  const draggableState = useDraggable.useDraggable(element, {
    data: options.data,
    disabled: options.disabled,
    onDragStart: options.onDragStart
  });
  useDroppable.useDroppable(element, {
    data: options.dropData,
    accept: options.accept,
    disabled: options.disabled,
    onDrop: options.onDrop
  });
  return draggableState;
}
exports.useSortable = useSortable;
