import { defineComponent, openBlock, createElementBlock, Fragment, renderList, toDisplayString, createCommentVNode } from "vue";
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-actions",
  "aria-label": "消息操作"
};
const _hoisted_2 = ["disabled", "onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIActions" },
  __name: "actions",
  props: {
    actions: { default: () => [] }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return __props.actions.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.actions, (action) => {
          return openBlock(), createElementBlock("button", {
            key: action.key,
            type: "button",
            disabled: action.disabled,
            onClick: ($event) => emit("select", action)
          }, toDisplayString(action.label), 9, _hoisted_2);
        }), 128))
      ])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
