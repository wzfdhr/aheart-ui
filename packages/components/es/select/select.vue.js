import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString, createCommentVNode, Fragment, renderList } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { selectProps, selectEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["value", "multiple", "disabled"];
const _hoisted_2 = {
  key: 0,
  value: "",
  disabled: ""
};
const _hoisted_3 = ["value", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASelect"
  },
  __name: "select",
  props: selectProps,
  emits: selectEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const normalizedOptions = computed(() => props.options ?? []);
    const isMultiple = computed(() => props.mode === "multiple");
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const selectValue = computed(() => {
      if (isMultiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
      }
      return typeof props.modelValue === "string" ? props.modelValue : "";
    });
    const hasValue = computed(() => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.length > 0;
      }
      return Boolean(props.modelValue);
    });
    const selectClass = computed(() => [
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-select", selectClass.value])
      }, [
        createElementVNode("select", {
          class: "aheart-select__control",
          value: selectValue.value,
          multiple: isMultiple.value,
          disabled: isDisabled.value,
          onChange: handleChange
        }, [
          _ctx.placeholder && !isMultiple.value ? (openBlock(), createElementBlock("option", _hoisted_2, toDisplayString(_ctx.placeholder), 1)) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedOptions.value, (option) => {
            return openBlock(), createElementBlock("option", {
              key: option.value,
              value: option.value,
              disabled: option.disabled
            }, toDisplayString(option.label), 9, _hoisted_3);
          }), 128))
        ], 40, _hoisted_1),
        _ctx.allowClear && !isDisabled.value && hasValue.value ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "aheart-select__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
