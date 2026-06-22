"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-busy"];
const _hoisted_2 = {
  key: 1,
  class: "aheart-spin__indicator",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-spin__tip"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASpin"
  },
  __name: "spin",
  props: types.spinProps,
  setup(__props) {
    const props = __props;
    const spinRootClass = vue.computed(() => [
      props.spinning ? "aheart-spin" : "aheart-spin-wrapper",
      `aheart-spin--${props.size}`,
      {
        "aheart-spin-nested": true
      }
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(spinRootClass.value),
        "aria-busy": _ctx.spinning ? "true" : "false"
      }, [
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-spin-container", { "is-blur": _ctx.spinning }])
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2)) : vue.createCommentVNode("", true),
        _ctx.spinning ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
          _cache[0] || (_cache[0] = vue.createElementVNode("span", {
            class: "aheart-spin__dot",
            "aria-hidden": "true"
          }, null, -1)),
          _ctx.tip ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.tip), 1)) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
