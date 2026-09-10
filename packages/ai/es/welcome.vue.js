import { defineComponent as i, openBlock as t, createElementBlock as o, createElementVNode as l, toDisplayString as s, createCommentVNode as c, renderSlot as n } from "vue";
const r = { class: "aheart-ai-welcome" }, d = { class: "aheart-ai-welcome__title" }, m = {
  key: 0,
  class: "aheart-ai-welcome__description"
}, _ = {
  key: 1,
  class: "aheart-ai-welcome__content"
}, p = /* @__PURE__ */ i({
  name: "AAIWelcome",
  __name: "welcome",
  props: {
    title: { default: "你好，我能为你做些什么？" },
    description: { default: void 0 }
  },
  setup(e) {
    return (a, h) => (t(), o("section", r, [
      l("h2", d, s(e.title), 1),
      e.description ? (t(), o("p", m, s(e.description), 1)) : c("", !0),
      a.$slots.default ? (t(), o("div", _, [
        n(a.$slots, "default")
      ])) : c("", !0)
    ]));
  }
});
export {
  p as default
};
