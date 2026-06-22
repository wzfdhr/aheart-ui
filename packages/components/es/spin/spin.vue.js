import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import { spinProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-busy"];
const _hoisted_2 = {
  key: 1,
  class: "aheart-spin__indicator",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-spin__tip"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASpin"
  },
  __name: "spin",
  props: spinProps,
  setup(__props) {
    const props = __props;
    const spinRootClass = computed(() => [
      props.spinning ? "aheart-spin" : "aheart-spin-wrapper",
      `aheart-spin--${props.size}`,
      {
        "aheart-spin-nested": true
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(spinRootClass.value),
        "aria-busy": _ctx.spinning ? "true" : "false"
      }, [
        _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-spin-container", { "is-blur": _ctx.spinning }])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)) : createCommentVNode("", true),
        _ctx.spinning ? (openBlock(), createElementBlock("div", _hoisted_2, [
          _cache[0] || (_cache[0] = createElementVNode("span", {
            class: "aheart-spin__dot",
            "aria-hidden": "true"
          }, null, -1)),
          _ctx.tip ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.tip), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
