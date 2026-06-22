"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const radio_vue_vue_type_script_setup_true_lang = require("./radio.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["name", "value", "checked", "disabled", "onChange"];
const _hoisted_2 = { class: "aheart-radio-button__label" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ARadioGroup"
  },
  __name: "radio-group",
  props: types.radioGroupProps,
  emits: types.radioGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const radioGroupClass = vue.computed(() => [
      `aheart-radio-group--${props.direction}`,
      `aheart-radio-group--${resolvedSize.value}`,
      {
        "aheart-radio-group--button": props.optionType === "button",
        "aheart-radio-group--solid": props.buttonStyle === "solid",
        "aheart-radio-group--block": props.block,
        "is-disabled": isDisabled.value
      }
    ]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const isSelected = (value) => props.modelValue === value;
    const getButtonClass = (option) => ({
      "is-checked": isSelected(option.value),
      "is-disabled": isDisabled.value || option.disabled
    });
    const handleOptionChange = (option) => {
      if (isDisabled.value || option.disabled) {
        return;
      }
      emit("update:modelValue", option.value);
      emit("change", option.value);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-radio-group", radioGroupClass.value])
      }, [
        _ctx.optionType === "button" ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(_ctx.options, (option) => {
          return vue.openBlock(), vue.createElementBlock("label", {
            key: getOptionKey(option.value),
            class: vue.normalizeClass(["aheart-radio-button", getButtonClass(option)])
          }, [
            vue.createElementVNode("input", {
              class: "aheart-radio-button__input",
              type: "radio",
              name: _ctx.name,
              value: option.value,
              checked: isSelected(option.value),
              disabled: isDisabled.value || option.disabled,
              onChange: ($event) => handleOptionChange(option)
            }, null, 40, _hoisted_1),
            vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(option.label), 1)
          ], 2);
        }), 128)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(_ctx.options, (option) => {
          return vue.openBlock(), vue.createBlock(radio_vue_vue_type_script_setup_true_lang.default, {
            key: getOptionKey(option.value),
            "model-value": isSelected(option.value),
            value: option.value,
            name: _ctx.name,
            label: option.label,
            disabled: isDisabled.value || option.disabled,
            onChange: () => handleOptionChange(option)
          }, null, 8, ["model-value", "value", "name", "label", "disabled", "onChange"]);
        }), 128))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
