import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { switchProps, switchEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-checked", "aria-busy", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASwitch"
  },
  __name: "switch",
  props: switchProps,
  emits: switchEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const internalChecked = ref(props.defaultChecked ?? props.defaultValue ?? false);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = computed(() => props.checked !== void 0 || props.value !== void 0 || props.modelValue !== void 0);
    const mergedChecked = computed(() => props.checked ?? props.value ?? props.modelValue ?? internalChecked.value);
    const switchClass = computed(() => {
      var _a;
      return [
        `aheart-switch--${resolvedSize.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-checked": mergedChecked.value,
          "is-loading": props.loading
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const indicatorClass = computed(() => {
      var _a;
      return ["aheart-switch__handle", (_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const indicatorStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.indicator;
    });
    const contentClass = computed(() => {
      var _a;
      return ["aheart-switch__label", (_a = props.classNames) == null ? void 0 : _a.content];
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const handleClick = (event) => {
      if (isDisabled.value || props.loading) {
        return;
      }
      const checked = !mergedChecked.value;
      if (!isControlled.value) {
        internalChecked.value = checked;
      }
      emit("update:modelValue", checked);
      emit("update:checked", checked);
      emit("update:value", checked);
      emit("change", checked, event);
      emit("click", checked, event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["aheart-switch", switchClass.value]),
        style: normalizeStyle(rootStyle.value),
        type: "button",
        role: "switch",
        "aria-checked": mergedChecked.value ? "true" : "false",
        "aria-busy": _ctx.loading ? "true" : void 0,
        disabled: isDisabled.value || _ctx.loading,
        onClick: handleClick
      }, [
        createElementVNode("span", {
          class: normalizeClass(indicatorClass.value),
          style: normalizeStyle(indicatorStyle.value),
          "aria-hidden": "true"
        }, null, 6),
        createElementVNode("span", {
          class: normalizeClass(contentClass.value),
          style: normalizeStyle(contentStyle.value)
        }, [
          mergedChecked.value ? renderSlot(_ctx.$slots, "checkedChildren", { key: 0 }, () => [
            createTextVNode(toDisplayString(_ctx.checkedChildren), 1)
          ]) : renderSlot(_ctx.$slots, "unCheckedChildren", { key: 1 }, () => [
            createTextVNode(toDisplayString(_ctx.unCheckedChildren), 1)
          ])
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
