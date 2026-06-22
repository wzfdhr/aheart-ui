"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-alert__icon",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-alert__content" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-alert__message"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-alert__description"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AAlert"
  },
  __name: "alert",
  props: types.alertProps,
  emits: types.alertEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×"
    };
    const iconText = vue.computed(() => iconMap[props.type]);
    const alertClass = vue.computed(() => `aheart-alert--${props.type}`);
    const handleClose = (event) => {
      emit("close", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-alert", alertClass.value]),
        role: "alert"
      }, [
        _ctx.showIcon ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, vue.toDisplayString(iconText.value), 1)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2, [
          _ctx.message ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, vue.toDisplayString(_ctx.message), 1)) : vue.createCommentVNode("", true),
          _ctx.description || _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
            ])
          ])) : vue.createCommentVNode("", true)
        ]),
        _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "aheart-alert__close",
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, " × ")) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
