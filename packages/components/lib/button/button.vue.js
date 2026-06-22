"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-button__content" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: types.buttonProps,
  emits: types.buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => {
      const providerSize = config.value.size === "middle" ? "normal" : config.value.size;
      return context.resolveConfigValue(props.size, providerSize, "normal");
    });
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const isInteractiveDisabled = vue.computed(() => isDisabled.value || props.loading);
    const rootTag = vue.computed(() => props.href ? "a" : "button");
    const resolvedNativeType = vue.computed(() => props.htmlType || props.nativeType);
    const isDanger = vue.computed(() => props.danger || props.type === "danger");
    const buttonClass = vue.computed(() => [
      `aheart-button--${props.type}`,
      `aheart-button--${resolvedSize.value}`,
      {
        "is-block": props.block,
        "is-round": props.round || props.shape === "round",
        "is-circle": props.shape === "circle",
        "is-loading": props.loading,
        "is-danger": isDanger.value,
        "is-ghost": props.ghost,
        "is-anchor": rootTag.value === "a"
      }
    ]);
    const handleClick = (event) => {
      if (isInteractiveDisabled.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      emit("click", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(rootTag.value), {
        class: vue.normalizeClass(["aheart-button", buttonClass.value]),
        type: rootTag.value === "button" ? resolvedNativeType.value : void 0,
        href: rootTag.value === "a" && !isInteractiveDisabled.value ? _ctx.href : void 0,
        target: rootTag.value === "a" ? _ctx.target : void 0,
        disabled: rootTag.value === "button" ? isInteractiveDisabled.value : void 0,
        "aria-disabled": rootTag.value === "a" && isInteractiveDisabled.value ? "true" : void 0,
        tabindex: rootTag.value === "a" && isInteractiveDisabled.value ? -1 : void 0,
        "aria-busy": _ctx.loading,
        onClick: handleClick
      }, {
        default: vue.withCtx(() => [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_2, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              _cache[0] || (_cache[0] = vue.createTextVNode("按钮", -1))
            ])
          ])
        ]),
        _: 3
      }, 8, ["class", "type", "href", "target", "disabled", "aria-disabled", "tabindex", "aria-busy"]);
    };
  }
});
exports.default = _sfc_main;
