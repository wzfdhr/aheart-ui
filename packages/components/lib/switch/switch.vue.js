"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-checked", "aria-busy", "disabled"];
const _hoisted_2 = { class: "aheart-switch__label" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASwitch"
  },
  __name: "switch",
  props: types.switchProps,
  emits: types.switchEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const switchClass = vue.computed(() => [
      `aheart-switch--${resolvedSize.value}`,
      {
        "is-checked": props.modelValue,
        "is-loading": props.loading
      }
    ]);
    const handleClick = () => {
      if (isDisabled.value || props.loading) {
        return;
      }
      const checked = !props.modelValue;
      emit("update:modelValue", checked);
      emit("change", checked);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("button", {
        class: vue.normalizeClass(["aheart-switch", switchClass.value]),
        type: "button",
        role: "switch",
        "aria-checked": _ctx.modelValue ? "true" : "false",
        "aria-busy": _ctx.loading ? "true" : void 0,
        disabled: isDisabled.value || _ctx.loading,
        onClick: handleClick
      }, [
        _cache[0] || (_cache[0] = vue.createElementVNode("span", {
          class: "aheart-switch__handle",
          "aria-hidden": "true"
        }, null, -1)),
        vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(_ctx.modelValue ? _ctx.checkedChildren : _ctx.unCheckedChildren), 1)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
