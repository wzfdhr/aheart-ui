import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { inputProps, inputEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AInput"
  },
  __name: "input",
  props: inputProps,
  emits: inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = computed(() => props.modelValue ?? "");
    const inputClass = computed(() => [
      `aheart-input--${resolvedSize.value}`,
      {
        [`aheart-input--${props.status}`]: props.status,
        "is-disabled": isDisabled.value
      }
    ]);
    const countText = computed(() => {
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-input", inputClass.value])
      }, [
        _ctx.$slots.prefix ? (openBlock(), createElementBlock("span", _hoisted_1, [
          renderSlot(_ctx.$slots, "prefix")
        ])) : createCommentVNode("", true),
        createElementVNode("input", {
          class: "aheart-input__control",
          type: _ctx.type,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange
        }, null, 40, _hoisted_2),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: "aheart-input__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : createCommentVNode("", true),
        _ctx.$slots.suffix ? (openBlock(), createElementBlock("span", _hoisted_3, [
          renderSlot(_ctx.$slots, "suffix")
        ])) : createCommentVNode("", true),
        _ctx.showCount ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(countText.value), 1)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
