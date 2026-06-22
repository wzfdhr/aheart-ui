import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, createCommentVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { textareaProps, textareaEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["id", "value", "placeholder", "rows", "disabled", "readonly", "maxlength"];
const _hoisted_2 = {
  key: 1,
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
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAutoSize = computed(() => Boolean(props.autoSize));
    const textareaClass = computed(() => [
      `aheart-textarea--${resolvedSize.value}`,
      `aheart-textarea--${resolvedVariant.value}`,
      {
        [`aheart-textarea--${props.status}`]: props.status,
        "is-autosize": hasAutoSize.value,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
      }
    ]);
    const textareaStyle = computed(() => {
      if (!props.autoSize || typeof props.autoSize === "boolean") {
        return void 0;
      }
      return {
        ...props.autoSize.minRows ? { "--aheart-textarea-min-rows": props.autoSize.minRows } : {},
        ...props.autoSize.maxRows ? { "--aheart-textarea-max-rows": props.autoSize.maxRows } : {}
      };
    });
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
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        emit("pressEnter", event);
      }
    };
    const handleClear = () => {
      emit("update:modelValue", "");
      emit("input", "");
      emit("clear");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-textarea", textareaClass.value]),
        style: normalizeStyle(textareaStyle.value)
      }, [
        createElementVNode("textarea", {
          class: "aheart-textarea__control",
          id: _ctx.id,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_1),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "aheart-textarea__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : createCommentVNode("", true),
        _ctx.showCount ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(countText.value), 1)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
