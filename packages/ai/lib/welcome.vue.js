"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = { class: "aheart-ai-welcome" };
const _hoisted_2 = { class: "aheart-ai-welcome__title" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-welcome__description"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-ai-welcome__content"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIWelcome" },
  __name: "welcome",
  props: {
    title: { default: "你好，我能为你做些什么？" },
    description: { default: void 0 }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
        vue.createElementVNode("h2", _hoisted_2, vue.toDisplayString(__props.title), 1),
        __props.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_3, vue.toDisplayString(__props.description), 1)) : vue.createCommentVNode("", true),
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
          vue.renderSlot(_ctx.$slots, "default")
        ])) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
