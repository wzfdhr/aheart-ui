import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString, createCommentVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { textareaProps, textareaEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["value", "placeholder", "rows", "disabled", "maxlength"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-textarea__count"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATextarea"
  },
  __name: "textarea",
  props: textareaProps,
  emits: textareaEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = computed(() => props.modelValue ?? "");
    const textareaClass = computed(() => [
      `aheart-textarea--${resolvedSize.value}`,
      {
        [`aheart-textarea--${props.status}`]: props.status,
        "is-autosize": props.autoSize,
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-textarea", textareaClass.value])
      }, [
        createElementVNode("textarea", {
          class: "aheart-textarea__control",
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange
        }, null, 40, _hoisted_1),
        _ctx.showCount ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(countText.value), 1)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
