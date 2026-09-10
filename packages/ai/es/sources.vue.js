import { defineComponent as c, openBlock as t, createElementBlock as r, createElementVNode as s, Fragment as d, renderList as m, unref as a, toDisplayString as n, createCommentVNode as i } from "vue";
import { getSafeUrl as u } from "./safe-markdown.js";
const f = {
  key: 0,
  class: "aheart-ai-sources",
  "aria-label": "参考来源"
}, p = ["href"], _ = { key: 1 }, h = { key: 2 }, S = /* @__PURE__ */ c({
  name: "AAISources",
  __name: "sources",
  props: {
    sources: { default: () => [] }
  },
  setup(o) {
    return (k, l) => o.sources.length ? (t(), r("section", f, [
      l[0] || (l[0] = s("h3", null, "参考来源", -1)),
      s("ul", null, [
        (t(!0), r(d, null, m(o.sources, (e) => (t(), r("li", {
          key: e.id
        }, [
          a(u)(e.url) ? (t(), r("a", {
            key: 0,
            href: a(u)(e.url),
            target: "_blank",
            rel: "noreferrer"
          }, n(e.title), 9, p)) : (t(), r("span", _, n(e.title), 1)),
          e.description ? (t(), r("p", h, n(e.description), 1)) : i("", !0)
        ]))), 128))
      ])
    ])) : i("", !0);
  }
});
export {
  S as default
};
