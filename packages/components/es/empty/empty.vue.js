import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, renderSlot, toDisplayString, createCommentVNode } from "vue";
import { useAheartConfig } from "../config/context.js";
import { emptyProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-empty" };
const _hoisted_2 = { class: "aheart-empty__image" };
const _hoisted_3 = { class: "aheart-empty__description" };
const _hoisted_4 = {
  key: 0,
  class: "aheart-empty__footer"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AEmpty"
  },
  __name: "empty",
  props: emptyProps,
  setup(__props) {
    const props = __props;
    const config = useAheartConfig();
    const resolvedDescription = computed(() => {
      var _a, _b;
      return props.description || ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) || "No Data";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "image", {}, () => [
            _cache[0] || (_cache[0] = createElementVNode("span", {
              class: "aheart-empty__default-image",
              "aria-hidden": "true"
            }, "∅", -1))
          ])
        ]),
        createElementVNode("div", _hoisted_3, toDisplayString(resolvedDescription.value), 1),
        _ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_4, [
          renderSlot(_ctx.$slots, "default")
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
