"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-checked", "aria-busy", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASwitch"
  },
  __name: "switch",
  props: types.switchProps,
  emits: types.switchEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const switchRef = vue.ref();
    const internalChecked = vue.ref(props.defaultChecked ?? props.defaultValue ?? false);
    const ASwitchRenderNode = vue.defineComponent({
      name: "ASwitchRenderNode",
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
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = vue.computed(() => props.checked !== void 0 || props.value !== void 0 || props.modelValue !== void 0);
    const mergedChecked = vue.computed(() => props.checked ?? props.value ?? props.modelValue ?? internalChecked.value);
    const switchClass = vue.computed(() => {
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
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const indicatorClass = vue.computed(() => {
      var _a;
      return ["aheart-switch__handle", (_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const indicatorStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.indicator;
    });
    const contentClass = vue.computed(() => {
      var _a;
      return ["aheart-switch__label", (_a = props.classNames) == null ? void 0 : _a.content];
    });
    const contentStyle = vue.computed(() => {
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
    const focus = () => {
      var _a;
      (_a = switchRef.value) == null ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = switchRef.value) == null ? void 0 : _a.blur();
    };
    vue.onMounted(() => {
      if (props.autoFocus) {
        vue.nextTick(focus);
      }
    });
    __expose({
      focus,
      blur,
      nativeElement: switchRef
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("button", {
        ref_key: "switchRef",
        ref: switchRef,
        class: vue.normalizeClass(["aheart-switch", switchClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        type: "button",
        role: "switch",
        "aria-checked": mergedChecked.value ? "true" : "false",
        "aria-busy": _ctx.loading ? "true" : void 0,
        disabled: isDisabled.value || _ctx.loading,
        onClick: handleClick
      }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(indicatorClass.value),
          style: vue.normalizeStyle(indicatorStyle.value),
          "aria-hidden": "true"
        }, null, 6),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(contentClass.value),
          style: vue.normalizeStyle(contentStyle.value)
        }, [
          mergedChecked.value ? vue.renderSlot(_ctx.$slots, "checkedChildren", { key: 0 }, () => [
            vue.createVNode(vue.unref(ASwitchRenderNode), { node: _ctx.checkedChildren }, null, 8, ["node"])
          ]) : vue.renderSlot(_ctx.$slots, "unCheckedChildren", { key: 1 }, () => [
            vue.createVNode(vue.unref(ASwitchRenderNode), { node: _ctx.unCheckedChildren }, null, 8, ["node"])
          ])
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
