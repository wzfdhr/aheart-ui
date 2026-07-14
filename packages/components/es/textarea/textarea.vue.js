import { defineComponent, ref, computed, watch, onMounted, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, nextTick } from "vue";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { textareaProps, textareaEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["id", "value", "placeholder", "rows", "disabled", "readonly", "maxlength", "aria-invalid"];
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
    const textareaRef = ref();
    const ATextareaRenderNode = defineComponent({
      name: "ATextareaRenderNode",
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
    const measureCount = (value) => {
      var _a, _b;
      return ((_b = (_a = props.count) == null ? void 0 : _a.strategy) == null ? void 0 : _b.call(_a, value)) ?? value.length;
    };
    const formatExceededValue = (value) => {
      var _a, _b;
      const max = (_a = props.count) == null ? void 0 : _a.max;
      if (max === void 0 || !((_b = props.count) == null ? void 0 : _b.exceedFormatter) || measureCount(value) <= max) {
        return value;
      }
      return props.count.exceedFormatter(value, { max });
    };
    const draftValue = ref(formatExceededValue(props.modelValue ?? ""));
    const isControlled = usePropPresence("modelValue", "model-value");
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = computed(() => formatExceededValue(isControlled.value ? props.modelValue ?? "" : draftValue.value));
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAutoSize = computed(() => Boolean(props.autoSize));
    const allowClearConfig = computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const allowClearDisabled = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.disabled) ?? false;
    });
    const showClear = computed(
      () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && !props.readOnly && Boolean(currentValue.value)
    );
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
          "is-readonly": props.readOnly,
          "has-clear": showClear.value,
          "has-count": showCountDisplay.value,
          "is-count-exceeded": countExceeded.value
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
    const countLength = computed(() => measureCount(currentValue.value));
    const countMaxLength = computed(() => {
      var _a;
      return ((_a = props.count) == null ? void 0 : _a.max) ?? props.maxlength;
    });
    const countInfo = computed(() => ({
      count: countLength.value,
      maxLength: countMaxLength.value,
      value: currentValue.value
    }));
    const countExceeded = computed(
      () => countMaxLength.value !== void 0 && countLength.value > countMaxLength.value
    );
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
    const getEventValue = (event) => {
      const target = event.target;
      const value = formatExceededValue(target.value);
      if (target.value !== value) {
        target.value = value;
      }
      return value;
    };
    const resizeTextarea = () => {
      const textarea = textareaRef.value;
      if (!textarea || !props.autoSize || typeof window === "undefined") {
        return;
      }
      textarea.style.height = "auto";
      const style = window.getComputedStyle(textarea);
      const fontSize = Number.parseFloat(style.fontSize) || 14;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5715;
      const verticalPadding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
      const config2 = typeof props.autoSize === "object" ? props.autoSize : void 0;
      const minHeight = (config2 == null ? void 0 : config2.minRows) ? config2.minRows * lineHeight + verticalPadding : 0;
      const maxHeight = (config2 == null ? void 0 : config2.maxRows) ? config2.maxRows * lineHeight + verticalPadding : Number.POSITIVE_INFINITY;
      const contentHeight = Math.max(textarea.scrollHeight, minHeight);
      const height = Math.min(contentHeight, maxHeight);
      textarea.style.height = `${Math.round(height * 100) / 100}px`;
      textarea.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
    };
    const scheduleResize = () => {
      void nextTick(resizeTextarea);
    };
    const handleInput = (event) => {
      const value = getEventValue(event);
      if (!isControlled.value)
        draftValue.value = value;
      emit("update:modelValue", value);
      emit("input", value);
      if (isControlled.value)
        event.target.value = currentValue.value;
      scheduleResize();
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
      if (isDisabled.value || props.readOnly || allowClearDisabled.value)
        return;
      if (!isControlled.value)
        draftValue.value = "";
      emit("update:modelValue", "");
      emit("input", "");
      emit("clear");
      scheduleResize();
    };
    watch(
      () => props.modelValue,
      (value) => {
        draftValue.value = formatExceededValue(value ?? "");
        scheduleResize();
      }
    );
    watch(() => props.autoSize, scheduleResize, { deep: true });
    onMounted(resizeTextarea);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-textarea", textareaClass.value]),
        style: normalizeStyle(textareaStyle.value)
      }, [
        createElementVNode("textarea", {
          ref_key: "textareaRef",
          ref: textareaRef,
          class: normalizeClass(["aheart-textarea__control", controlClass.value]),
          style: normalizeStyle(controlStyle.value),
          id: _ctx.id,
          value: currentValue.value,
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          "aria-invalid": props.status === "error" || countExceeded.value ? "true" : void 0,
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
            createVNode(unref(ATextareaRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        showCountDisplay.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(countClass.value),
          style: normalizeStyle(countStyle.value)
        }, [
          createVNode(unref(ATextareaRenderNode), { node: countText.value }, null, 8, ["node"])
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
