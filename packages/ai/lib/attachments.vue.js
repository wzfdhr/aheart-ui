"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const safeMarkdown = require("./safe-markdown.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-attachments",
  "aria-label": "附件"
};
const _hoisted_2 = ["href"];
const _hoisted_3 = { key: 1 };
const _hoisted_4 = ["aria-label", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIAttachments" },
  __name: "attachments",
  props: {
    items: { default: () => [] },
    removable: { type: Boolean, default: false }
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return __props.items.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_1, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (item) => {
          return vue.openBlock(), vue.createElementBlock("li", {
            key: item.id
          }, [
            vue.unref(safeMarkdown.getSafeUrl)(item.url) ? (vue.openBlock(), vue.createElementBlock("a", {
              key: 0,
              href: vue.unref(safeMarkdown.getSafeUrl)(item.url),
              target: "_blank",
              rel: "noreferrer"
            }, vue.toDisplayString(item.name), 9, _hoisted_2)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(item.name), 1)),
            __props.removable ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 2,
              type: "button",
              "aria-label": `移除 ${item.name}`,
              onClick: ($event) => emit("remove", item)
            }, "移除", 8, _hoisted_4)) : vue.createCommentVNode("", true)
          ]);
        }), 128))
      ])) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
