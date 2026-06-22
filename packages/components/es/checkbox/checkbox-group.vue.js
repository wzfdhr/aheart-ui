import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createBlock } from "vue";
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
    const internalValue = ref(props.defaultValue ? [...props.defaultValue] : []);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = computed(() => props.value !== void 0 || props.modelValue !== void 0);
    const mergedValue = computed(() => props.value ?? props.modelValue ?? internalValue.value);
    const normalizedOptions = computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const checkboxGroupClass = computed(() => [
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-checkbox-group", checkboxGroupClass.value]),
        style: normalizeStyle(_ctx.style)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedOptions.value, (option) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: getOptionKey(option.value),
            "model-value": isChecked(option.value),
            value: option.value,
            name: _ctx.name,
            label: option.label,
            disabled: isDisabled.value || option.disabled,
            "class-name": option.className,
            style: normalizeStyle(option.style),
            title: option.title,
            onChange: (checked) => handleOptionChange(option.value, checked)
          }, null, 8, ["model-value", "value", "name", "label", "disabled", "class-name", "style", "title", "onChange"]);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
