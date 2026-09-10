import { defineComponent as i, openBlock as t, createElementBlock as s, createElementVNode as l, Fragment as c, renderList as u, normalizeClass as m, toDisplayString as r, createCommentVNode as o } from "vue";
const d = {
  key: 0,
  class: "aheart-ai-process",
  "aria-label": "执行进度"
}, p = { key: 0 }, k = /* @__PURE__ */ i({
  name: "AAIProcess",
  __name: "process",
  props: {
    items: { default: () => [] }
  },
  setup(n) {
    return (_, a) => n.items.length ? (t(), s("section", d, [
      a[0] || (a[0] = l("h3", null, "执行进度", -1)),
      l("ol", null, [
        (t(!0), s(c, null, u(n.items, (e) => (t(), s("li", {
          key: e.id,
          class: m(`is-${e.status}`)
        }, [
          l("span", null, r(e.label), 1),
          e.detail ? (t(), s("small", p, r(e.detail), 1)) : o("", !0)
        ], 2))), 128))
      ])
    ])) : o("", !0);
  }
});
export {
  k as default
};
