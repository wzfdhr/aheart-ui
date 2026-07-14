import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, unref, toDisplayString, createCommentVNode } from "vue";
import { getSafeUrl } from "./safe-markdown.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-sources",
  "aria-label": "参考来源"
};
const _hoisted_2 = ["href"];
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 2 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAISources" },
  __name: "sources",
  props: {
    sources: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.sources.length ? (openBlock(), createElementBlock("section", _hoisted_1, [
        _cache[0] || (_cache[0] = createElementVNode("h3", null, "参考来源", -1)),
        createElementVNode("ul", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.sources, (source) => {
            return openBlock(), createElementBlock("li", {
              key: source.id
            }, [
              unref(getSafeUrl)(source.url) ? (openBlock(), createElementBlock("a", {
                key: 0,
                href: unref(getSafeUrl)(source.url),
                target: "_blank",
                rel: "noreferrer"
              }, toDisplayString(source.title), 9, _hoisted_2)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(source.title), 1)),
              source.description ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(source.description), 1)) : createCommentVNode("", true)
            ]);
          }), 128))
        ])
      ])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
