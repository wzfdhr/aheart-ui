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
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const resolvedType = vue.computed(() => props.vertical ? "vertical" : props.type);
    const resolvedTitlePlacement = vue.computed(() => props.titlePlacement || props.orientation);
    const resolvedVariant = vue.computed(() => props.dashed ? "dashed" : props.variant);
    const dividerClass = vue.computed(() => [
      `aheart-divider--${resolvedType.value}`,
      `aheart-divider--${resolvedTitlePlacement.value}`,
      `aheart-divider--${props.size}`,
      {
        "has-text": Boolean(slots.default && resolvedType.value === "horizontal"),
        [`is-${resolvedVariant.value}`]: resolvedVariant.value,
        "is-plain": props.plain
      }
    ]);
    const dividerStyle = vue.computed(
      () => props.orientationMargin ? {
        "--aheart-divider-orientation-margin": normalizeSize(props.orientationMargin)
      } : void 0
    );
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-divider", dividerClass.value]),
        style: vue.normalizeStyle(dividerStyle.value),
        role: "separator",
        "aria-orientation": resolvedType.value
      }, [
        _ctx.$slots.default && resolvedType.value === "horizontal" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
          vue.renderSlot(_ctx.$slots, "default")
        ])) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
