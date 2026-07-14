"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const safeMarkdown = require("./safe-markdown.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-sources",
  "aria-label": "参考来源"
};
const _hoisted_2 = ["href"];
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 2 };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAISources" },
  __name: "sources",
  props: {
    sources: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.sources.length ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
        _cache[0] || (_cache[0] = vue.createElementVNode("h3", null, "参考来源", -1)),
        vue.createElementVNode("ul", null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.sources, (source) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: source.id
            }, [
              vue.unref(safeMarkdown.getSafeUrl)(source.url) ? (vue.openBlock(), vue.createElementBlock("a", {
                key: 0,
                href: vue.unref(safeMarkdown.getSafeUrl)(source.url),
                target: "_blank",
                rel: "noreferrer"
              }, vue.toDisplayString(source.title), 9, _hoisted_2)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(source.title), 1)),
              source.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_4, vue.toDisplayString(source.description), 1)) : vue.createCommentVNode("", true)
            ]);
          }), 128))
        ])
      ])) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
