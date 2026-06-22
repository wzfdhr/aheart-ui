"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-input-number__prefix"
};
const _hoisted_2 = ["id", "value", "placeholder", "disabled", "readonly", "min", "max", "step"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-input-number__suffix"
};
const _hoisted_4 = {
  key: 2,
  class: "aheart-input-number__controls"
};
const _hoisted_5 = ["disabled"];
const _hoisted_6 = ["disabled"];
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
    const resolvedVariant = vue.computed(() => props.variant ?? (props.bordered === false ? "borderless" : "outlined"));
    const isInteractiveDisabled = vue.computed(() => isDisabled.value || props.readOnly);
    const displayValue = vue.computed(() => {
      if (props.formatter) {
        return props.formatter(props.modelValue);
      }
      return props.modelValue === void 0 ? "" : String(props.modelValue);
    });
    const inputNumberClass = vue.computed(() => [
      `aheart-input-number--${resolvedSize.value}`,
      `aheart-input-number--${resolvedVariant.value}`,
      {
        [`aheart-input-number--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
      }
    ]);
    const applyPrecision = (value) => {
      if (props.precision === void 0) {
        return value;
      }
      return Number(value.toFixed(props.precision));
    };
    const clampValue = (value) => {
      const preciseValue = applyPrecision(value);
      if (props.min !== void 0 && preciseValue < props.min) {
        return props.min;
      }
      if (props.max !== void 0 && preciseValue > props.max) {
        return props.max;
      }
      return preciseValue;
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
      const parsedValue = props.parser ? props.parser(rawValue) : Number(rawValue);
      if (parsedValue !== void 0 && !Number.isNaN(parsedValue)) {
        emitValue(clampValue(parsedValue));
      }
    };
    const handleStep = (offset, type) => {
      if (isInteractiveDisabled.value) {
        return;
      }
      const nextValue = clampValue((props.modelValue ?? 0) + offset);
      emitValue(nextValue);
      emit("step", nextValue, { offset, type });
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        emit("pressEnter", event);
        return;
      }
      if (!props.keyboard) {
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleStep(props.step, "up");
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleStep(-props.step, "down");
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-input-number", inputNumberClass.value])
      }, [
        _ctx.prefix ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, vue.toDisplayString(_ctx.prefix), 1)) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: "aheart-input-number__control",
          id: _ctx.id,
          type: "text",
          inputmode: "decimal",
          value: displayValue.value,
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          min: _ctx.min,
          max: _ctx.max,
          step: _ctx.step,
          onInput: handleInput,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_2),
        _ctx.suffix ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.suffix), 1)) : vue.createCommentVNode("", true),
        _ctx.controls ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, [
          vue.createElementVNode("button", {
            class: "aheart-input-number__increase",
            type: "button",
            "aria-label": "Increase",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => handleStep(_ctx.step, "up"))
          }, " + ", 8, _hoisted_5),
          vue.createElementVNode("button", {
            class: "aheart-input-number__decrease",
            type: "button",
            "aria-label": "Decrease",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[1] || (_cache[1] = ($event) => handleStep(-_ctx.step, "down"))
          }, " − ", 8, _hoisted_6)
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
