import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { radioProps, radioEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "aheart-radio__box" };
const _hoisted_3 = ["name", "value", "checked", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ARadio"
  },
  __name: "radio",
  props: radioProps,
  emits: radioEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const internalChecked = ref(props.defaultChecked ?? false);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = computed(() => props.checked !== void 0 || props.modelValue !== void 0);
    const mergedChecked = computed(() => props.checked ?? props.modelValue ?? internalChecked.value);
    const radioClass = computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-checked": mergedChecked.value,
          "is-disabled": isDisabled.value
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconClass = computed(() => {
      var _a;
      return ["aheart-radio__inner", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const labelClass = computed(() => {
      var _a;
      return ["aheart-radio__label", (_a = props.classNames) == null ? void 0 : _a.label];
    });
    const labelStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.label;
    });
    const handleChange = (event) => {
      if (isDisabled.value) {
        return;
      }
      if (!isControlled.value) {
        internalChecked.value = true;
      }
      emit("update:modelValue", true);
      emit("update:checked", true);
      emit("change", true, event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        class: normalizeClass(["aheart-radio", radioClass.value]),
        style: normalizeStyle(rootStyle.value),
        title: _ctx.title
      }, [
        createElementVNode("span", _hoisted_2, [
          createElementVNode("input", {
            class: "aheart-radio__input",
            type: "radio",
            name: _ctx.name,
            value: _ctx.value,
            checked: mergedChecked.value,
            disabled: isDisabled.value,
            onChange: handleChange
          }, null, 40, _hoisted_3),
          createElementVNode("span", {
            class: normalizeClass(iconClass.value),
            style: normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, null, 6)
        ]),
        createElementVNode("span", {
          class: normalizeClass(labelClass.value),
          style: normalizeStyle(labelStyle.value)
        }, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(_ctx.label), 1)
          ])
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
