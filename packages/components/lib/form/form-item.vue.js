"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["data-name"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-form-item__label"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-form-item__required",
  "aria-hidden": "true"
};
const _hoisted_4 = { class: "aheart-form-item__control" };
const _hoisted_5 = { class: "aheart-form-item__content" };
const _hoisted_6 = {
  key: 0,
  class: "aheart-form-item__feedback",
  "aria-hidden": "true"
};
const _hoisted_7 = {
  key: 0,
  class: "aheart-form-item__help"
};
const _hoisted_8 = {
  key: 1,
  class: "aheart-form-item__extra"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AFormItem"
  },
  __name: "form-item",
  props: types.formItemProps,
  setup(__props) {
    const props = __props;
    const formItemClass = vue.computed(() => ({
      [`aheart-form-item--${props.validateStatus}`]: props.validateStatus,
      "is-required": props.required,
      "has-feedback": props.hasFeedback
    }));
    const feedbackIcon = vue.computed(() => {
      const iconMap = {
        success: "✓",
        warning: "!",
        error: "×",
        validating: "…"
      };
      return props.validateStatus ? iconMap[props.validateStatus] : "";
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": _ctx.name
      }, [
        _ctx.label || _ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock("label", _hoisted_2, [
          _ctx.required ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "*")) : vue.createCommentVNode("", true),
          vue.renderSlot(_ctx.$slots, "label", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
          ])
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_4, [
          vue.createElementVNode("div", _hoisted_5, [
            vue.renderSlot(_ctx.$slots, "default"),
            _ctx.hasFeedback ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, vue.toDisplayString(feedbackIcon.value), 1)) : vue.createCommentVNode("", true)
          ]),
          _ctx.help || _ctx.$slots.help ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
            vue.renderSlot(_ctx.$slots, "help", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.help), 1)
            ])
          ])) : vue.createCommentVNode("", true),
          _ctx.extra || _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
            ])
          ])) : vue.createCommentVNode("", true)
        ])
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
