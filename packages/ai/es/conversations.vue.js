import { defineComponent, openBlock, createElementBlock, Fragment, renderList, normalizeClass, toDisplayString } from "vue";
const _hoisted_1 = {
  class: "aheart-ai-conversations",
  "aria-label": "会话列表"
};
const _hoisted_2 = ["disabled", "aria-current", "onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
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
      return openBlock(), createElementBlock("nav", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.conversations, (conversation) => {
          return openBlock(), createElementBlock("button", {
            key: conversation.key,
            type: "button",
            class: normalizeClass({ "is-active": conversation.key === __props.modelValue }),
            disabled: conversation.disabled,
            "aria-current": conversation.key === __props.modelValue ? "page" : void 0,
            onClick: ($event) => emit("update:modelValue", conversation.key)
          }, toDisplayString(conversation.label), 11, _hoisted_2);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
