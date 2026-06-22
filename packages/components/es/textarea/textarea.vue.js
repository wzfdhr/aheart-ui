import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { textareaProps, textareaEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["id", "value", "placeholder", "rows", "disabled", "readonly", "maxlength"];
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
    const allowClearConfig = computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const showClear = computed(() => Boolean(props.allowClear) && !isDisabled.value && Boolean(currentValue.value));
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const textareaClass = computed(() => {
      var _a;
      return [
        `aheart-textarea--${resolvedSize.value}`,
        `aheart-textarea--${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          [`aheart-textarea--${props.status}`]: props.status,
          "is-autosize": hasAutoSize.value,
          "is-disabled": isDisabled.value,
          "is-readonly": props.readOnly
        }
      ];
    });
    const autoSizeStyle = computed(() => {
      if (!props.autoSize || typeof props.autoSize === "boolean") {
        return void 0;
      }
      return {
        ...props.autoSize.minRows ? { "--aheart-textarea-min-rows": props.autoSize.minRows } : {},
        ...props.autoSize.maxRows ? { "--aheart-textarea-max-rows": props.autoSize.maxRows } : {}
      };
    });
    const textareaStyle = computed(() => {
      var _a;
      return [autoSizeStyle.value, props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const controlClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.textarea;
    });
    const controlStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.textarea;
    });
    const clearClass = computed(() => {
      var _a;
      return ["aheart-textarea__clear", (_a = props.classNames) == null ? void 0 : _a.clear];
    });
    const clearStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.clear;
    });
    const countClass = computed(() => {
      var _a;
      return ["aheart-textarea__count", (_a = props.classNames) == null ? void 0 : _a.count];
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-textarea", textareaClass.value]),
        style: normalizeStyle(textareaStyle.value)
      }, [
        createElementVNode("textarea", {
          class: normalizeClass(["aheart-textarea__control", controlClass.value]),
          style: normalizeStyle(controlStyle.value),
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
        }, null, 46, _hoisted_1),
        showClear.value ? (openBlock(), createElementBlock("button", {
          key: 0,
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
        showCountDisplay.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(countClass.value),
          style: normalizeStyle(countStyle.value)
        }, toDisplayString(countText.value), 7)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
