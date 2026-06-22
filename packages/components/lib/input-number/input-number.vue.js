"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["value", "placeholder", "disabled", "min", "max", "step"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-input-number__controls"
};
const _hoisted_3 = ["disabled"];
const _hoisted_4 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AInputNumber"
  },
  __name: "input-number",
  props: types.inputNumberProps,
  emits: types.inputNumberEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const displayValue = vue.computed(() => props.modelValue === void 0 ? "" : String(props.modelValue));
    const inputNumberClass = vue.computed(() => [
      `aheart-input-number--${resolvedSize.value}`,
      {
        "is-disabled": isDisabled.value
      }
    ]);
    const clampValue = (value) => {
      if (props.min !== void 0 && value < props.min) {
        return props.min;
      }
      if (props.max !== void 0 && value > props.max) {
        return props.max;
      }
      return value;
    };
    const emitValue = (value) => {
      emit("update:modelValue", value);
      emit("change", value);
    };
    const handleInput = (event) => {
      const rawValue = event.target.value;
      if (rawValue === "") {
        emitValue(void 0);
        return;
      }
      const parsedValue = Number(rawValue);
      if (!Number.isNaN(parsedValue)) {
        emitValue(clampValue(parsedValue));
      }
    };
    const handleStep = (offset) => {
      if (isDisabled.value) {
        return;
      }
      emitValue(clampValue((props.modelValue ?? 0) + offset));
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-input-number", inputNumberClass.value])
      }, [
        vue.createElementVNode("input", {
          class: "aheart-input-number__control",
          type: "number",
          value: displayValue.value,
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          min: _ctx.min,
          max: _ctx.max,
          step: _ctx.step,
          onInput: handleInput
        }, null, 40, _hoisted_1),
        _ctx.controls ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
          vue.createElementVNode("button", {
            class: "aheart-input-number__increase",
            type: "button",
            "aria-label": "Increase",
            disabled: isDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => handleStep(_ctx.step))
          }, " + ", 8, _hoisted_3),
          vue.createElementVNode("button", {
            class: "aheart-input-number__decrease",
            type: "button",
            "aria-label": "Decrease",
            disabled: isDisabled.value,
            onClick: _cache[1] || (_cache[1] = ($event) => handleStep(-_ctx.step))
          }, " − ", 8, _hoisted_4)
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
