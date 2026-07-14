"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-process",
  "aria-label": "执行进度"
};
const _hoisted_2 = { key: 0 };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIProcess" },
  __name: "process",
  props: {
    items: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.items.length ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
        _cache[0] || (_cache[0] = vue.createElementVNode("h3", null, "执行进度", -1)),
        vue.createElementVNode("ol", null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (item) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: item.id,
              class: vue.normalizeClass(`is-${item.status}`)
            }, [
              vue.createElementVNode("span", null, vue.toDisplayString(item.label), 1),
              item.detail ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_2, vue.toDisplayString(item.detail), 1)) : vue.createCommentVNode("", true)
            ], 2);
          }), 128))
        ])
      ])) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
