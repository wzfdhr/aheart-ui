"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const radio_vue_vue_type_script_setup_true_lang = require("./radio.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title"];
const _hoisted_2 = ["name", "value", "checked", "disabled", "onChange"];
const _hoisted_3 = { class: "aheart-radio-button__label" };
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
    const internalValue = vue.ref(props.defaultValue);
    const ARadioGroupRenderNode = vue.defineComponent({
      name: "ARadioGroupRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isControlled = vue.computed(() => props.value !== void 0 || props.modelValue !== void 0);
    const mergedValue = vue.computed(() => props.value ?? props.modelValue ?? internalValue.value);
    const resolvedDirection = vue.computed(
      () => props.orientation ?? (props.vertical ? "vertical" : props.direction)
    );
    const normalizedOptions = vue.computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const radioGroupClass = vue.computed(() => [
      `aheart-radio-group--${resolvedDirection.value}`,
      `aheart-radio-group--${resolvedSize.value}`,
      props.className,
      props.rootClassName,
      {
        "aheart-radio-group--button": props.optionType === "button",
        "aheart-radio-group--solid": props.buttonStyle === "solid",
        "aheart-radio-group--block": props.block,
        "is-disabled": isDisabled.value
      }
    ]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const isSelected = (value) => mergedValue.value === value;
    const getButtonClass = (option) => [
      option.className,
      {
        "is-checked": isSelected(option.value),
        "is-disabled": isDisabled.value || option.disabled
      }
    ];
    const handleOptionChange = (option) => {
      if (isDisabled.value || option.disabled) {
        return;
      }
      if (!isControlled.value) {
        internalValue.value = option.value;
      }
      emit("update:modelValue", option.value);
      emit("update:value", option.value);
      emit("change", option.value);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-radio-group", radioGroupClass.value]),
        style: vue.normalizeStyle(_ctx.style)
      }, [
        _ctx.optionType === "button" ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(normalizedOptions.value, (option) => {
          return vue.openBlock(), vue.createElementBlock("label", {
            key: getOptionKey(option.value),
            class: vue.normalizeClass(["aheart-radio-button", getButtonClass(option)]),
            style: vue.normalizeStyle(option.style),
            title: option.title
          }, [
            vue.createElementVNode("input", {
              class: "aheart-radio-button__input",
              type: "radio",
              name: _ctx.name,
              value: option.value,
              checked: isSelected(option.value),
              disabled: isDisabled.value || option.disabled,
              onChange: ($event) => handleOptionChange(option)
            }, null, 40, _hoisted_2),
            vue.createElementVNode("span", _hoisted_3, [
              vue.createVNode(vue.unref(ARadioGroupRenderNode), {
                node: option.label
              }, null, 8, ["node"])
            ])
          ], 14, _hoisted_1);
        }), 128)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(normalizedOptions.value, (option) => {
          return vue.openBlock(), vue.createBlock(radio_vue_vue_type_script_setup_true_lang.default, {
            key: getOptionKey(option.value),
            "model-value": isSelected(option.value),
            value: option.value,
            name: _ctx.name,
            disabled: isDisabled.value || option.disabled,
            "class-name": option.className,
            style: vue.normalizeStyle(option.style),
            title: option.title,
            onChange: () => handleOptionChange(option)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ARadioGroupRenderNode), {
                node: option.label
              }, null, 8, ["node"])
            ]),
            _: 2
          }, 1032, ["model-value", "value", "name", "disabled", "class-name", "style", "title", "onChange"]);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
