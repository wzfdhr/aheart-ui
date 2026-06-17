import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createCommentVNode, createElementVNode, renderSlot, createTextVNode } from "vue";
import { buttonProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["type", "disabled", "aria-busy"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _hoisted_3 = { class: "aheart-button__content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: buttonProps,
  setup(__props) {
    const props = __props;
    const buttonClass = computed(() => [
      `aheart-button--${props.type}`,
      `aheart-button--${props.size}`,
      {
        "is-block": props.block,
        "is-round": props.round,
        "is-loading": props.loading
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["aheart-button", buttonClass.value]),
        type: _ctx.nativeType,
        disabled: _ctx.disabled || _ctx.loading,
        "aria-busy": _ctx.loading
      }, [
        _ctx.loading ? (openBlock(), createElementBlock("span", _hoisted_2)) : createCommentVNode("", true),
        createElementVNode("span", _hoisted_3, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode("按钮")
          ])
        ])
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
