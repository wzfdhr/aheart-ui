import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, createElementVNode, renderSlot, createTextVNode } from "vue";
import { alertProps, alertEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-alert__icon",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-alert__content" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-alert__message"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-alert__description"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AAlert"
  },
  __name: "alert",
  props: alertProps,
  emits: alertEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×"
    };
    const iconText = computed(() => iconMap[props.type]);
    const alertClass = computed(() => `aheart-alert--${props.type}`);
    const handleClose = (event) => {
      emit("close", event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-alert", alertClass.value]),
        role: "alert"
      }, [
        _ctx.showIcon ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(iconText.value), 1)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_2, [
          _ctx.message ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(_ctx.message), 1)) : createCommentVNode("", true),
          _ctx.description || _ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createTextVNode(toDisplayString(_ctx.description), 1)
            ])
          ])) : createCommentVNode("", true)
        ]),
        _ctx.closable ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: "aheart-alert__close",
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, " × ")) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
