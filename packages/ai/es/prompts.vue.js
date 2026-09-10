import { defineComponent as r, openBlock as t, createElementBlock as n, Fragment as c, renderList as d, createElementVNode as o, toDisplayString as l, createCommentVNode as m } from "vue";
const u = {
  class: "aheart-ai-prompts",
  "aria-label": "建议任务"
}, p = ["disabled", "onClick"], _ = { key: 0 }, h = /* @__PURE__ */ r({
  name: "AAIPrompts",
  __name: "prompts",
  props: {
    prompts: { default: () => [] },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["select"],
  setup(s, { emit: a }) {
    const i = a;
    return (b, f) => (t(), n("ul", u, [
      (t(!0), n(c, null, d(s.prompts, (e) => (t(), n("li", {
        key: e.key
      }, [
        o("button", {
          type: "button",
          disabled: s.disabled,
          onClick: (k) => i("select", e)
        }, [
          o("strong", null, l(e.label), 1),
          e.description ? (t(), n("span", _, l(e.description), 1)) : m("", !0)
        ], 8, p)
      ]))), 128))
    ]));
  }
});
export {
  h as default
};
