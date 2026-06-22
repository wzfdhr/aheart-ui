import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import _sfc_main$1 from "./checkbox.vue.js";
import { checkboxGroupProps, checkboxGroupEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACheckboxGroup"
  },
  __name: "checkbox-group",
  props: checkboxGroupProps,
  emits: checkboxGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const checkboxGroupClass = computed(() => [
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-checkbox-group", checkboxGroupClass.value])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (option) => {
          return openBlock(), createBlock(_sfc_main$1, {
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
export {
  _sfc_main as default
};
