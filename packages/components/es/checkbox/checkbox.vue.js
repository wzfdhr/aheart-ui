import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { checkboxProps, checkboxEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "aheart-checkbox__box" };
const _hoisted_3 = ["name", "value", "checked", "disabled", "aria-checked"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACheckbox"
  },
  __name: "checkbox",
  props: checkboxProps,
  emits: checkboxEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const rootRef = ref();
    const inputRef = ref();
    const internalChecked = ref(props.defaultChecked ?? false);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = computed(() => props.checked !== void 0 || props.modelValue !== void 0);
    const mergedChecked = computed(() => props.checked ?? props.modelValue ?? internalChecked.value);
    const checkboxClass = computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-checked": mergedChecked.value,
          "is-indeterminate": props.indeterminate,
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
      return ["aheart-checkbox__inner", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const labelClass = computed(() => {
      var _a;
      return ["aheart-checkbox__label", (_a = props.classNames) == null ? void 0 : _a.label];
    });
    const labelStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.label;
    });
    const handleChange = (event) => {
      const checked = event.target.checked;
      if (!isControlled.value) {
        internalChecked.value = checked;
      }
      emit("update:modelValue", checked);
      emit("update:checked", checked);
      emit("change", checked, event);
    };
    const handleFocus = (event) => {
      emit("focus", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const focus = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    __expose({
      focus,
      blur,
      nativeElement: rootRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-checkbox", checkboxClass.value]),
        style: normalizeStyle(rootStyle.value),
        title: _ctx.title
      }, [
        createElementVNode("span", _hoisted_2, [
          createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            class: "aheart-checkbox__input",
            type: "checkbox",
            name: _ctx.name,
            value: _ctx.value,
            checked: mergedChecked.value,
            disabled: isDisabled.value,
            "aria-checked": _ctx.indeterminate ? "mixed" : mergedChecked.value ? "true" : "false",
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur
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
