"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = {
  class: "aheart-ai-prompts",
  role: "list"
};
const _hoisted_2 = ["disabled", "onClick"];
const _hoisted_3 = { key: 0 };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.prompts, (prompt) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: prompt.key,
            type: "button",
            role: "listitem",
            disabled: __props.disabled,
            onClick: ($event) => emit("select", prompt)
          }, [
            vue.createElementVNode("strong", null, vue.toDisplayString(prompt.label), 1),
            prompt.description ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(prompt.description), 1)) : vue.createCommentVNode("", true)
          ], 8, _hoisted_2);
        }), 128))
      ]);
    };
  }
});
exports.default = _sfc_main;
