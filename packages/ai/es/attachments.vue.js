import { defineComponent, openBlock, createElementBlock, Fragment, renderList, unref, toDisplayString, createCommentVNode } from "vue";
import { getSafeUrl } from "./safe-markdown.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-attachments",
  "aria-label": "附件"
};
const _hoisted_2 = ["href"];
const _hoisted_3 = { key: 1 };
const _hoisted_4 = ["aria-label", "onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
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
      return __props.items.length ? (openBlock(), createElementBlock("ul", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
          return openBlock(), createElementBlock("li", {
            key: item.id
          }, [
            unref(getSafeUrl)(item.url) ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: unref(getSafeUrl)(item.url),
              target: "_blank",
              rel: "noreferrer"
            }, toDisplayString(item.name), 9, _hoisted_2)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(item.name), 1)),
            __props.removable ? (openBlock(), createElementBlock("button", {
              key: 2,
              type: "button",
              "aria-label": `移除 ${item.name}`,
              onClick: ($event) => emit("remove", item)
            }, "移除", 8, _hoisted_4)) : createCommentVNode("", true)
          ]);
        }), 128))
      ])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
