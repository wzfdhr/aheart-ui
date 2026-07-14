"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = { class: "aheart-splitter__panel" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASplitterPanel"
  },
  __name: "splitter-panel",
  props: {
    min: [Number, String],
    max: [Number, String],
    collapsible: Boolean
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        vue.renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
exports.default = _sfc_main;
