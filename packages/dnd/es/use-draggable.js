import { draggable } from "@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js";
import { ref, watchEffect, toValue } from "vue";
import { endDrag, startDrag } from "./drag-state.js";
function useDraggable(element, options) {
  const isDragging = ref(false);
  watchEffect((onCleanup) => {
    const target = element.value;
    if (!target) return;
    const cleanup = draggable({
      element: target,
      getInitialData: () => toValue(options.data),
      canDrag: () => !toValue(options.disabled ?? false),
      onDragStart: () => {
        var _a;
        isDragging.value = true;
        startDrag(toValue(options.data));
        (_a = options.onDragStart) == null ? void 0 : _a.call(options);
      },
      onDrop: () => {
        var _a;
        isDragging.value = false;
        endDrag();
        (_a = options.onDrop) == null ? void 0 : _a.call(options);
      }
    });
    onCleanup(cleanup);
  });
  return { isDragging };
}
export {
  useDraggable
};
