"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const adapter = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
const vue = require("vue");
function useDroppable(element, options) {
  vue.watchEffect((onCleanup) => {
    const target = element.value;
    if (!target) return;
    const cleanup = adapter.dropTargetForElements({
      element: target,
      getData: () => vue.toValue(options.data) ?? {},
      canDrop: ({ source }) => {
        if (vue.toValue(options.disabled ?? false)) return false;
        const accept = vue.toValue(options.accept ?? []);
        const acceptedTypes = Array.isArray(accept) ? accept : [accept];
        return acceptedTypes.length === 0 || acceptedTypes.includes(String(source.data.type ?? ""));
      },
      onDrop: ({ source, location }) => {
        var _a, _b;
        if (location && ((_a = location.current.dropTargets[0]) == null ? void 0 : _a.element) !== target) return;
        (_b = options.onDrop) == null ? void 0 : _b.call(options, source.data);
      }
    });
    onCleanup(cleanup);
  });
}
exports.useDroppable = useDroppable;
