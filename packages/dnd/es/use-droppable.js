import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js";
import { watchEffect, toValue } from "vue";
function useDroppable(element, options) {
  watchEffect((onCleanup) => {
    const target = element.value;
    if (!target) return;
    const cleanup = dropTargetForElements({
      element: target,
      getData: () => toValue(options.data) ?? {},
      canDrop: ({ source }) => {
        if (toValue(options.disabled ?? false)) return false;
        const accept = toValue(options.accept ?? []);
        const acceptedTypes = Array.isArray(accept) ? accept : [accept];
        return acceptedTypes.length === 0 || acceptedTypes.includes(String(source.data.type ?? ""));
      },
      onDrop: ({ source }) => {
        var _a;
        return (_a = options.onDrop) == null ? void 0 : _a.call(options, source.data);
      }
    });
    onCleanup(cleanup);
  });
}
export {
  useDroppable
};
