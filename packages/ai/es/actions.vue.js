import { defineComponent as i, openBlock as t, createElementBlock as n, Fragment as l, renderList as c, toDisplayString as r, createCommentVNode as d } from "vue";
const m = {
  key: 0,
  class: "aheart-ai-actions",
  "aria-label": "消息操作"
}, u = ["disabled", "onClick"], f = /* @__PURE__ */ i({
  name: "AAIActions",
  __name: "actions",
  props: {
    actions: { default: () => [] }
  },
  emits: ["select"],
  setup(s, { emit: a }) {
    const o = a;
    return (_, b) => s.actions.length ? (t(), n("div", m, [
      (t(!0), n(l, null, c(s.actions, (e) => (t(), n("button", {
        key: e.key,
        type: "button",
        disabled: e.disabled,
        onClick: (k) => o("select", e)
      }, r(e.label), 9, u))), 128))
    ])) : d("", !0);
  }
});
export {
  f as default
};
