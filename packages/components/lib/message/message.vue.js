"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  class: "aheart-message-notice__icon",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-message-notice__content" };
const _hoisted_3 = ["onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AMessage"
  },
  __name: "message",
  props: types.messageProps,
  emits: types.messageEmits,
  setup(__props) {
    const props = __props;
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×",
      loading: "…"
    };
    const normalizeTop = (top) => typeof top === "number" ? `${top}px` : top;
    const messageStyle = vue.computed(() => ({
      top: normalizeTop(props.top)
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: "aheart-message",
        style: vue.normalizeStyle(messageStyle.value)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.notices, (notice) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: notice.key,
            class: vue.normalizeClass(["aheart-message-notice", `aheart-message-notice--${notice.type}`]),
            role: "status",
            "aria-live": "polite"
          }, [
            vue.createElementVNode("span", _hoisted_1, vue.toDisplayString(iconMap[notice.type]), 1),
            vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(notice.content), 1),
            vue.createElementVNode("button", {
              class: "aheart-message-notice__close",
              type: "button",
              "aria-label": "Close",
              onClick: ($event) => _ctx.$emit("close", notice.key)
            }, " × ", 8, _hoisted_3)
          ], 2);
        }), 128))
      ], 4);
    };
  }
});
exports.default = _sfc_main;
