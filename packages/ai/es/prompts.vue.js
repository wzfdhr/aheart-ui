import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createElementVNode, toDisplayString, createCommentVNode } from "vue";
const _hoisted_1 = {
  class: "aheart-ai-prompts",
  "aria-label": "建议任务"
};
const _hoisted_2 = ["disabled", "onClick"];
const _hoisted_3 = { key: 0 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIPrompts" },
  __name: "prompts",
  props: {
    prompts: { default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ul", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.prompts, (prompt) => {
          return openBlock(), createElementBlock("li", {
            key: prompt.key
          }, [
            createElementVNode("button", {
              type: "button",
              disabled: __props.disabled,
              onClick: ($event) => emit("select", prompt)
            }, [
              createElementVNode("strong", null, toDisplayString(prompt.label), 1),
              prompt.description ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(prompt.description), 1)) : createCommentVNode("", true)
            ], 8, _hoisted_2)
          ]);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
