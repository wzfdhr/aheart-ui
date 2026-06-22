"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["value", "multiple", "disabled"];
const _hoisted_2 = {
  key: 0,
  value: "",
  disabled: ""
};
const _hoisted_3 = ["value", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASelect"
  },
  __name: "select",
  props: types.selectProps,
  emits: types.selectEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const normalizedOptions = vue.computed(() => props.options ?? []);
    const isMultiple = vue.computed(() => props.mode === "multiple");
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const selectValue = vue.computed(() => {
      if (isMultiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
      }
      return typeof props.modelValue === "string" ? props.modelValue : "";
    });
    const hasValue = vue.computed(() => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.length > 0;
      }
      return Boolean(props.modelValue);
    });
    const selectClass = vue.computed(() => [
      `aheart-select--${resolvedSize.value}`,
      {
        [`aheart-select--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-multiple": isMultiple.value
      }
    ]);
    const emitValue = (value) => {
      emit("update:modelValue", value);
      emit("change", value);
    };
    const handleChange = (event) => {
      const target = event.target;
      if (isMultiple.value) {
        emitValue(Array.from(target.selectedOptions).map((option) => option.value));
        return;
      }
      emitValue(target.value);
    };
    const handleClear = () => {
      const value = isMultiple.value ? [] : "";
      emit("update:modelValue", value);
      emit("change", value);
      emit("clear");
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-select", selectClass.value])
      }, [
        vue.createElementVNode("select", {
          class: "aheart-select__control",
          value: selectValue.value,
          multiple: isMultiple.value,
          disabled: isDisabled.value,
          onChange: handleChange
        }, [
          _ctx.placeholder && !isMultiple.value ? (vue.openBlock(), vue.createElementBlock("option", _hoisted_2, vue.toDisplayString(_ctx.placeholder), 1)) : vue.createCommentVNode("", true),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedOptions.value, (option) => {
            return vue.openBlock(), vue.createElementBlock("option", {
              key: option.value,
              value: option.value,
              disabled: option.disabled
            }, vue.toDisplayString(option.label), 9, _hoisted_3);
          }), 128))
        ], 40, _hoisted_1),
        _ctx.allowClear && !isDisabled.value && hasValue.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "aheart-select__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
