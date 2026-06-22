import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, createElementVNode, renderSlot, createTextVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { inputProps, inputEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-input__addon aheart-input__addon--before"
};
const _hoisted_2 = {
  key: 0,
  class: "aheart-input__prefix"
};
const _hoisted_3 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_4 = {
  key: 2,
  class: "aheart-input__suffix"
};
const _hoisted_5 = {
  key: 3,
  class: "aheart-input__count"
};
const _hoisted_6 = {
  key: 1,
  class: "aheart-input__addon aheart-input__addon--after"
};
const _hoisted_7 = {
  key: 0,
  class: "aheart-input__prefix"
};
const _hoisted_8 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_9 = {
  key: 2,
  class: "aheart-input__suffix"
};
const _hoisted_10 = {
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
    const slots = useSlots();
    const config = useAheartConfig();
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = computed(() => props.modelValue ?? "");
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAddon = computed(() => Boolean(props.addonBefore || props.addonAfter));
    const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix));
    const hasSuffix = computed(() => Boolean(props.suffix || slots.suffix));
    const inputClass = computed(() => [
      `aheart-input--${resolvedSize.value}`,
      `aheart-input--${resolvedVariant.value}`,
      {
        [`aheart-input--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
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
      return hasAddon.value ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(["aheart-input-group", `aheart-input-group--${resolvedSize.value}`])
      }, [
        _ctx.addonBefore ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.addonBefore), 1)) : createCommentVNode("", true),
        createElementVNode("span", {
          class: normalizeClass(["aheart-input", inputClass.value])
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_2, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createTextVNode(toDisplayString(_ctx.prefix), 1)
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("input", {
            class: "aheart-input__control",
            id: _ctx.id,
            type: _ctx.type,
            value: _ctx.modelValue ?? "",
            placeholder: _ctx.placeholder,
            disabled: isDisabled.value,
            readonly: _ctx.readOnly,
            maxlength: _ctx.maxlength,
            onInput: handleInput,
            onChange: handleChange,
            onKeydown: handleKeydown
          }, null, 40, _hoisted_3),
          _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "aheart-input__clear",
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, " × ")) : createCommentVNode("", true),
          hasSuffix.value ? (openBlock(), createElementBlock("span", _hoisted_4, [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              createTextVNode(toDisplayString(_ctx.suffix), 1)
            ])
          ])) : createCommentVNode("", true),
          _ctx.showCount ? (openBlock(), createElementBlock("span", _hoisted_5, toDisplayString(countText.value), 1)) : createCommentVNode("", true)
        ], 2),
        _ctx.addonAfter ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(_ctx.addonAfter), 1)) : createCommentVNode("", true)
      ], 2)) : (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass(["aheart-input", inputClass.value])
      }, [
        hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_7, [
          renderSlot(_ctx.$slots, "prefix", {}, () => [
            createTextVNode(toDisplayString(_ctx.prefix), 1)
          ])
        ])) : createCommentVNode("", true),
        createElementVNode("input", {
          class: "aheart-input__control",
          id: _ctx.id,
          type: _ctx.type,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_8),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: "aheart-input__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : createCommentVNode("", true),
        hasSuffix.value ? (openBlock(), createElementBlock("span", _hoisted_9, [
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createTextVNode(toDisplayString(_ctx.suffix), 1)
          ])
        ])) : createCommentVNode("", true),
        _ctx.showCount ? (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(countText.value), 1)) : createCommentVNode("", true)
      ], 2));
    };
  }
});
export {
  _sfc_main as default
};
