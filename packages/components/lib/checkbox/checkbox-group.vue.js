"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const usePropPresence = require("../utils/use-prop-presence.js");
const checkbox_vue_vue_type_script_setup_true_lang = require("./checkbox.vue.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
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
    const internalValue = vue.ref(props.defaultValue ? [...props.defaultValue] : []);
    const ACheckboxGroupRenderNode = vue.defineComponent({
      name: "ACheckboxGroupRenderNode",
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
    const hasValue = usePropPresence.usePropPresence("value");
    const hasModelValue = usePropPresence.usePropPresence("modelValue", "model-value");
    const isControlled = vue.computed(() => hasValue.value || hasModelValue.value);
    const mergedValue = vue.computed(() => hasValue.value ? props.value ?? [] : hasModelValue.value ? props.modelValue ?? [] : internalValue.value);
    const normalizedOptions = vue.computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const checkboxGroupClass = vue.computed(() => [
      `aheart-checkbox-group--${props.direction}`,
      props.className,
      props.rootClassName,
      {
        "is-disabled": isDisabled.value
      }
    ]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const isChecked = (value) => mergedValue.value.includes(value);
    const handleOptionChange = (value, checked) => {
      const nextValue = checked ? Array.from(/* @__PURE__ */ new Set([...mergedValue.value, value])) : mergedValue.value.filter((currentValue) => currentValue !== value);
      if (!isControlled.value) {
        internalValue.value = nextValue;
      }
      emit("update:modelValue", nextValue);
      emit("update:value", nextValue);
      emit("change", nextValue);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-checkbox-group", checkboxGroupClass.value]),
        style: vue.normalizeStyle(_ctx.style)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedOptions.value, (option) => {
          return vue.openBlock(), vue.createBlock(checkbox_vue_vue_type_script_setup_true_lang.default, {
            key: getOptionKey(option.value),
            "model-value": isChecked(option.value),
            value: option.value,
            name: _ctx.name,
            disabled: isDisabled.value || option.disabled,
            "class-name": option.className,
            style: vue.normalizeStyle(option.style),
            title: option.title,
            onChange: (checked) => handleOptionChange(option.value, checked)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ACheckboxGroupRenderNode), {
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
