"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-input__prefix"
};
const _hoisted_2 = ["type", "value", "placeholder", "disabled", "maxlength"];
const _hoisted_3 = {
  key: 2,
  class: "aheart-input__suffix"
};
const _hoisted_4 = {
  key: 3,
  class: "aheart-input__count"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AInput"
  },
  __name: "input",
  props: types.inputProps,
  emits: types.inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = vue.computed(() => props.modelValue ?? "");
    const inputClass = vue.computed(() => [
      `aheart-input--${resolvedSize.value}`,
      {
        [`aheart-input--${props.status}`]: props.status,
        "is-disabled": isDisabled.value
      }
    ]);
    const countText = vue.computed(() => {
      const length = currentValue.value.length;
      return props.maxlength ? `${length} / ${props.maxlength}` : String(length);
    });
    const getEventValue = (event) => event.target.value;
    const handleInput = (event) => {
      const value = getEventValue(event);
      emit("update:modelValue", value);
      emit("input", value);
    };
    const handleChange = (event) => {
      emit("change", getEventValue(event));
    };
    const handleClear = () => {
      emit("update:modelValue", "");
      emit("input", "");
      emit("clear");
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-input", inputClass.value])
      }, [
        _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "prefix")
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: "aheart-input__control",
          type: _ctx.type,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange
        }, null, 40, _hoisted_2),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "aheart-input__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : vue.createCommentVNode("", true),
        _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, [
          vue.renderSlot(_ctx.$slots, "suffix")
        ])) : vue.createCommentVNode("", true),
        _ctx.showCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, vue.toDisplayString(countText.value), 1)) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
