"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-actions",
  "aria-label": "消息操作"
};
const _hoisted_2 = ["disabled", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIActions" },
  __name: "actions",
  props: {
    actions: { default: () => [] }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return __props.actions.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.actions, (action) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: action.key,
            type: "button",
            disabled: action.disabled,
            onClick: ($event) => emit("select", action)
          }, vue.toDisplayString(action.label), 9, _hoisted_2);
        }), 128))
      ])) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
