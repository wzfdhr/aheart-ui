import { defineComponent, openBlock, createBlock, Teleport, unref, createElementBlock, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { isDragActive, currentDragData } from "./drag-state.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-dnd-overlay",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADragOverlay" },
  __name: "drag-overlay",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        unref(isDragActive) ? (openBlock(), createElementBlock("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default", { data: unref(currentDragData) }, () => {
            var _a, _b;
            return [
              createTextVNode(toDisplayString(((_a = unref(currentDragData)) == null ? void 0 : _a.label) ?? ((_b = unref(currentDragData)) == null ? void 0 : _b.type)), 1)
            ];
          })
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
