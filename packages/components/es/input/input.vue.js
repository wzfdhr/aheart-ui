import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, createElementVNode, normalizeStyle, renderSlot, createTextVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { inputProps, inputEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-input__addon aheart-input__addon--before"
};
const _hoisted_2 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-input__addon aheart-input__addon--after"
};
const _hoisted_4 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
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
    const allowClearConfig = computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const showClear = computed(() => Boolean(props.allowClear) && !isDisabled.value && Boolean(currentValue.value));
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const inputClass = computed(() => {
      var _a;
      return [
        `aheart-input--${resolvedSize.value}`,
        `aheart-input--${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          [`aheart-input--${props.status}`]: props.status,
          "is-disabled": isDisabled.value,
          "is-readonly": props.readOnly
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const controlClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.input;
    });
    const controlStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.input;
    });
    const prefixClass = computed(() => {
      var _a;
      return ["aheart-input__prefix", (_a = props.classNames) == null ? void 0 : _a.prefix];
    });
    const prefixStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prefix;
    });
    const suffixClass = computed(() => {
      var _a;
      return ["aheart-input__suffix", (_a = props.classNames) == null ? void 0 : _a.suffix];
    });
    const suffixStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.suffix;
    });
    const clearClass = computed(() => {
      var _a;
      return ["aheart-input__clear", (_a = props.classNames) == null ? void 0 : _a.clear];
    });
    const clearStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.clear;
    });
    const countClass = computed(() => {
      var _a;
      return ["aheart-input__count", (_a = props.classNames) == null ? void 0 : _a.count];
    });
    const countStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.count;
    });
    const countLength = computed(() => {
      var _a, _b;
      return ((_b = (_a = props.count) == null ? void 0 : _a.strategy) == null ? void 0 : _b.call(_a, currentValue.value)) ?? currentValue.value.length;
    });
    const countMaxLength = computed(() => {
      var _a;
      return ((_a = props.count) == null ? void 0 : _a.max) ?? props.maxlength;
    });
    const countInfo = computed(() => ({
      count: countLength.value,
      maxLength: countMaxLength.value,
      value: currentValue.value
    }));
    const showCountFormatter = computed(
      () => typeof props.showCount === "object" && props.showCount !== null ? props.showCount.formatter : void 0
    );
    const showCountDisplay = computed(() => {
      var _a, _b, _c;
      if (((_a = props.count) == null ? void 0 : _a.show) === false) {
        return false;
      }
      return Boolean(props.showCount) || ((_b = props.count) == null ? void 0 : _b.show) === true || typeof ((_c = props.count) == null ? void 0 : _c.show) === "function";
    });
    const countText = computed(() => {
      var _a;
      if (typeof ((_a = props.count) == null ? void 0 : _a.show) === "function") {
        return props.count.show(countInfo.value);
      }
      if (showCountFormatter.value) {
        return showCountFormatter.value(countInfo.value);
      }
      return countMaxLength.value ? `${countLength.value} / ${countMaxLength.value}` : String(countLength.value);
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
          class: normalizeClass(["aheart-input", inputClass.value]),
          style: normalizeStyle(rootStyle.value)
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(prefixClass.value),
            style: normalizeStyle(prefixStyle.value)
          }, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createTextVNode(toDisplayString(_ctx.prefix), 1)
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("input", {
            class: normalizeClass(["aheart-input__control", controlClass.value]),
            style: normalizeStyle(controlStyle.value),
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
          }, null, 46, _hoisted_2),
          showClear.value ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: normalizeClass(clearClass.value),
            style: normalizeStyle(clearStyle.value),
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, [
            renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              createTextVNode(toDisplayString(clearIconContent.value), 1)
            ])
          ], 6)) : createCommentVNode("", true),
          hasSuffix.value ? (openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(suffixClass.value),
            style: normalizeStyle(suffixStyle.value)
          }, [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              createTextVNode(toDisplayString(_ctx.suffix), 1)
            ])
          ], 6)) : createCommentVNode("", true),
          showCountDisplay.value ? (openBlock(), createElementBlock("span", {
            key: 3,
            class: normalizeClass(countClass.value),
            style: normalizeStyle(countStyle.value)
          }, toDisplayString(countText.value), 7)) : createCommentVNode("", true)
        ], 6),
        _ctx.addonAfter ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.addonAfter), 1)) : createCommentVNode("", true)
      ], 2)) : (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass(["aheart-input", inputClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(prefixClass.value),
          style: normalizeStyle(prefixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "prefix", {}, () => [
            createTextVNode(toDisplayString(_ctx.prefix), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("input", {
          class: normalizeClass(["aheart-input__control", controlClass.value]),
          style: normalizeStyle(controlStyle.value),
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
        }, null, 46, _hoisted_4),
        showClear.value ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: normalizeClass(clearClass.value),
          style: normalizeStyle(clearStyle.value),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            createTextVNode(toDisplayString(clearIconContent.value), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        hasSuffix.value ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(suffixClass.value),
          style: normalizeStyle(suffixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createTextVNode(toDisplayString(_ctx.suffix), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        showCountDisplay.value ? (openBlock(), createElementBlock("span", {
          key: 3,
          class: normalizeClass(countClass.value),
          style: normalizeStyle(countStyle.value)
        }, toDisplayString(countText.value), 7)) : createCommentVNode("", true)
      ], 6));
    };
  }
});
export {
  _sfc_main as default
};
