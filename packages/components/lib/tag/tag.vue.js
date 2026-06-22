"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-tag__content" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATag"
  },
  __name: "tag",
  props: types.tagProps,
  emits: types.tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const presetColors = ["default", "primary", "success", "warning", "danger"];
    const isPresetColor = vue.computed(() => presetColors.includes(props.color));
    const tagClass = vue.computed(() => ({
      [`aheart-tag--${props.color}`]: isPresetColor.value,
      "is-custom-color": !isPresetColor.value
    }));
    const tagStyle = vue.computed(() => ({
      "--aheart-tag-color": isPresetColor.value ? void 0 : props.color
    }));
    const handleClose = (event) => {
      emit("close", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-tag", tagClass.value]),
        style: vue.normalizeStyle(tagStyle.value)
      }, [
        vue.createElementVNode("span", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "aheart-tag__close",
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, " × ")) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
