import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode } from "vue";
import { dividerProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-orientation"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-divider__text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADivider"
  },
  __name: "divider",
  props: dividerProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const dividerClass = computed(() => [
      `aheart-divider--${props.type}`,
      `aheart-divider--${props.orientation}`,
      {
        "has-text": Boolean(slots.default && props.type === "horizontal"),
        "is-dashed": props.dashed,
        "is-plain": props.plain
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-divider", dividerClass.value]),
        role: "separator",
        "aria-orientation": _ctx.type
      }, [
        _ctx.$slots.default && _ctx.type === "horizontal" ? (openBlock(), createElementBlock("span", _hoisted_2, [
          renderSlot(_ctx.$slots, "default")
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
