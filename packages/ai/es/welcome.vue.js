import { defineComponent, openBlock, createElementBlock, createElementVNode, toDisplayString, createCommentVNode, renderSlot } from "vue";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIWelcome" },
  __name: "welcome",
  props: {
    title: { default: "你好，我能为你做些什么？" },
    description: { default: void 0 }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createElementVNode("h2", _hoisted_2, toDisplayString(__props.title), 1),
        __props.description ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(__props.description), 1)) : createCommentVNode("", true),
        _ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_4, [
          renderSlot(_ctx.$slots, "default")
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
