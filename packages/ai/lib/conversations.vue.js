"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = {
  class: "aheart-ai-conversations",
  "aria-label": "会话列表"
};
const _hoisted_2 = ["disabled", "aria-current", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIConversations" },
  __name: "conversations",
  props: {
    modelValue: { default: void 0 },
    conversations: { default: () => [] }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("nav", _hoisted_1, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.conversations, (conversation) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: conversation.key,
            type: "button",
            class: vue.normalizeClass({ "is-active": conversation.key === __props.modelValue }),
            disabled: conversation.disabled,
            "aria-current": conversation.key === __props.modelValue ? "page" : void 0,
            onClick: ($event) => emit("update:modelValue", conversation.key)
          }, vue.toDisplayString(conversation.label), 11, _hoisted_2);
        }), 128))
      ]);
    };
  }
});
exports.default = _sfc_main;
