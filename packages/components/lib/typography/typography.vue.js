"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-typography" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATypography"
  },
  __name: "typography",
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("article", _hoisted_1, [
        vue.renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
exports.default = _sfc_main;
