"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["type", "disabled", "aria-busy"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _hoisted_3 = { class: "aheart-button__content" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: types.buttonProps,
  setup(__props) {
    const props = __props;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => {
      const providerSize = config.value.size === "middle" ? "normal" : config.value.size;
      return context.resolveConfigValue(props.size, providerSize, "normal");
    });
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const buttonClass = vue.computed(() => [
      `aheart-button--${props.type}`,
      `aheart-button--${resolvedSize.value}`,
      {
        "is-block": props.block,
        "is-round": props.round,
        "is-loading": props.loading
      }
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("button", {
        class: vue.normalizeClass(["aheart-button", buttonClass.value]),
        type: _ctx.nativeType,
        disabled: isDisabled.value || _ctx.loading,
        "aria-busy": _ctx.loading
      }, [
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2)) : vue.createCommentVNode("", true),
        vue.createElementVNode("span", _hoisted_3, [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            _cache[0] || (_cache[0] = vue.createTextVNode("按钮", -1))
          ])
        ])
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
