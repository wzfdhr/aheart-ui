"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-orientation"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-divider__text"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADivider"
  },
  __name: "divider",
  props: types.dividerProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const dividerClass = vue.computed(() => [
      `aheart-divider--${props.type}`,
      `aheart-divider--${props.orientation}`,
      {
        "has-text": Boolean(slots.default && props.type === "horizontal"),
        "is-dashed": props.dashed,
        "is-plain": props.plain
      }
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-divider", dividerClass.value]),
        role: "separator",
        "aria-orientation": _ctx.type
      }, [
        _ctx.$slots.default && _ctx.type === "horizontal" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
          vue.renderSlot(_ctx.$slots, "default")
        ])) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
