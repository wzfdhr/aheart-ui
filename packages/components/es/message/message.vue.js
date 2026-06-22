import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle, Fragment, renderList, normalizeClass, createElementVNode, toDisplayString } from "vue";
import { messageProps, messageEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  class: "aheart-message-notice__icon",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-message-notice__content" };
const _hoisted_3 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AMessage"
  },
  __name: "message",
  props: messageProps,
  emits: messageEmits,
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
    const messageStyle = computed(() => ({
      top: normalizeTop(props.top)
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "aheart-message",
        style: normalizeStyle(messageStyle.value)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.notices, (notice) => {
          return openBlock(), createElementBlock("div", {
            key: notice.key,
            class: normalizeClass(["aheart-message-notice", `aheart-message-notice--${notice.type}`]),
            role: "status",
            "aria-live": "polite"
          }, [
            createElementVNode("span", _hoisted_1, toDisplayString(iconMap[notice.type]), 1),
            createElementVNode("span", _hoisted_2, toDisplayString(notice.content), 1),
            createElementVNode("button", {
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
export {
  _sfc_main as default
};
