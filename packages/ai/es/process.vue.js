import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, normalizeClass, toDisplayString, createCommentVNode } from "vue";
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-process",
  "aria-label": "执行进度"
};
const _hoisted_2 = { key: 0 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIProcess" },
  __name: "process",
  props: {
    items: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.items.length ? (openBlock(), createElementBlock("section", _hoisted_1, [
        _cache[0] || (_cache[0] = createElementVNode("h3", null, "执行进度", -1)),
        createElementVNode("ol", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
            return openBlock(), createElementBlock("li", {
              key: item.id,
              class: normalizeClass(`is-${item.status}`)
            }, [
              createElementVNode("span", null, toDisplayString(item.label), 1),
              item.detail ? (openBlock(), createElementBlock("small", _hoisted_2, toDisplayString(item.detail), 1)) : createCommentVNode("", true)
            ], 2);
          }), 128))
        ])
      ])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
