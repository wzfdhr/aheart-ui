"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const adapter = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
const vue = require("vue");
const dragState = require("./drag-state.js");
function useDraggable(element, options) {
  const isDragging = vue.ref(false);
  vue.watchEffect((onCleanup) => {
    const target = element.value;
    if (!target) return;
    const cleanup = adapter.draggable({
      element: target,
      getInitialData: () => vue.toValue(options.data),
      canDrag: () => !vue.toValue(options.disabled ?? false),
      onDragStart: () => {
        var _a;
        isDragging.value = true;
        dragState.startDrag(vue.toValue(options.data));
        (_a = options.onDragStart) == null ? void 0 : _a.call(options);
      },
      onDrop: () => {
        var _a;
        isDragging.value = false;
        dragState.endDrag();
        (_a = options.onDrop) == null ? void 0 : _a.call(options);
      }
    });
    onCleanup(cleanup);
  });
  return { isDragging };
}
exports.useDraggable = useDraggable;
