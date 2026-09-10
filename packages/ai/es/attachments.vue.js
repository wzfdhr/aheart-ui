import { defineComponent as i, openBlock as t, createElementBlock as a, Fragment as u, renderList as f, unref as r, toDisplayString as o, createCommentVNode as l } from "vue";
import { getSafeUrl as s } from "./safe-markdown.js";
const h = {
  key: 0,
  class: "aheart-ai-attachments",
  "aria-label": "附件"
}, d = ["href"], _ = { key: 1 }, k = ["aria-label", "onClick"], C = /* @__PURE__ */ i({
  name: "AAIAttachments",
  __name: "attachments",
  props: {
    items: { default: () => [] },
    removable: { type: Boolean, default: !1 }
  },
  emits: ["remove"],
  setup(n, { emit: m }) {
    const c = m;
    return (b, p) => n.items.length ? (t(), a("ul", h, [
      (t(!0), a(u, null, f(n.items, (e) => (t(), a("li", {
        key: e.id
      }, [
        r(s)(e.url) ? (t(), a("a", {
          key: 0,
          href: r(s)(e.url),
          target: "_blank",
          rel: "noreferrer"
        }, o(e.name), 9, d)) : (t(), a("span", _, o(e.name), 1)),
        n.removable ? (t(), a("button", {
          key: 2,
          type: "button",
          "aria-label": `移除 ${e.name}`,
          onClick: (y) => c("remove", e)
        }, "移除", 8, k)) : l("", !0)
      ]))), 128))
    ])) : l("", !0);
  }
});
export {
  C as default
};
