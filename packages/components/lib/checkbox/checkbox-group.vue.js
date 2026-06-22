"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const checkbox_vue_vue_type_script_setup_true_lang = require("./checkbox.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACheckboxGroup"
  },
  __name: "checkbox-group",
  props: types.checkboxGroupProps,
  emits: types.checkboxGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const checkboxGroupClass = vue.computed(() => [
      `aheart-checkbox-group--${props.direction}`,
      {
        "is-disabled": isDisabled.value
      }
    ]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const isChecked = (value) => props.modelValue.includes(value);
    const handleOptionChange = (value, checked) => {
      const nextValue = checked ? Array.from(/* @__PURE__ */ new Set([...props.modelValue, value])) : props.modelValue.filter((currentValue) => currentValue !== value);
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-checkbox-group", checkboxGroupClass.value])
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.options, (option) => {
          return vue.openBlock(), vue.createBlock(checkbox_vue_vue_type_script_setup_true_lang.default, {
            key: getOptionKey(option.value),
            "model-value": isChecked(option.value),
            value: option.value,
            name: _ctx.name,
            label: option.label,
            disabled: isDisabled.value || option.disabled,
            onChange: (checked) => handleOptionChange(option.value, checked)
          }, null, 8, ["model-value", "value", "name", "label", "disabled", "onChange"]);
        }), 128))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
