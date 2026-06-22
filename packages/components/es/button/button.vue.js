import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, createElementBlock, createCommentVNode, createElementVNode, renderSlot, createTextVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { buttonProps, buttonEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-button__content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: buttonProps,
  emits: buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const resolvedSize = computed(() => {
      const providerSize = config.value.size === "middle" ? "normal" : config.value.size;
      return resolveConfigValue(props.size, providerSize, "normal");
    });
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isInteractiveDisabled = computed(() => isDisabled.value || props.loading);
    const rootTag = computed(() => props.href ? "a" : "button");
    const resolvedNativeType = computed(() => props.htmlType || props.nativeType);
    const isDanger = computed(() => props.danger || props.type === "danger");
    const buttonClass = computed(() => [
      `aheart-button--${props.type}`,
      `aheart-button--${resolvedSize.value}`,
      {
        "is-block": props.block,
        "is-round": props.round || props.shape === "round",
        "is-circle": props.shape === "circle",
        "is-loading": props.loading,
        "is-danger": isDanger.value,
        "is-ghost": props.ghost,
        "is-anchor": rootTag.value === "a"
      }
    ]);
    const handleClick = (event) => {
      if (isInteractiveDisabled.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      emit("click", event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(rootTag.value), {
        class: normalizeClass(["aheart-button", buttonClass.value]),
        type: rootTag.value === "button" ? resolvedNativeType.value : void 0,
        href: rootTag.value === "a" && !isInteractiveDisabled.value ? _ctx.href : void 0,
        target: rootTag.value === "a" ? _ctx.target : void 0,
        disabled: rootTag.value === "button" ? isInteractiveDisabled.value : void 0,
        "aria-disabled": rootTag.value === "a" && isInteractiveDisabled.value ? "true" : void 0,
        tabindex: rootTag.value === "a" && isInteractiveDisabled.value ? -1 : void 0,
        "aria-busy": _ctx.loading,
        onClick: handleClick
      }, {
        default: withCtx(() => [
          _ctx.loading ? (openBlock(), createElementBlock("span", _hoisted_1)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_2, [
            renderSlot(_ctx.$slots, "default", {}, () => [
              _cache[0] || (_cache[0] = createTextVNode("按钮", -1))
            ])
          ])
        ]),
        _: 3
      }, 8, ["class", "type", "href", "target", "disabled", "aria-disabled", "tabindex", "aria-busy"]);
    };
  }
});
export {
  _sfc_main as default
};
