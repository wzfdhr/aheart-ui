"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const dragState = require("./drag-state.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-dnd-overlay",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADragOverlay" },
  __name: "drag-overlay",
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.unref(dragState.isDragActive) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "default", { data: vue.unref(dragState.currentDragData) }, () => {
            var _a, _b;
            return [
              vue.createTextVNode(vue.toDisplayString(((_a = vue.unref(dragState.currentDragData)) == null ? void 0 : _a.label) ?? ((_b = vue.unref(dragState.currentDragData)) == null ? void 0 : _b.type)), 1)
            ];
          })
        ])) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
