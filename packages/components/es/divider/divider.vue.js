import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createCommentVNode } from "vue";
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
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const resolvedType = computed(() => props.vertical ? "vertical" : props.type);
    const resolvedTitlePlacement = computed(() => props.titlePlacement || props.orientation);
    const resolvedVariant = computed(() => props.dashed ? "dashed" : props.variant);
    const dividerClass = computed(() => [
      `aheart-divider--${resolvedType.value}`,
      `aheart-divider--${resolvedTitlePlacement.value}`,
      `aheart-divider--${props.size}`,
      {
        "has-text": Boolean(slots.default && resolvedType.value === "horizontal"),
        [`is-${resolvedVariant.value}`]: resolvedVariant.value,
        "is-plain": props.plain
      }
    ]);
    const dividerStyle = computed(
      () => props.orientationMargin ? {
        "--aheart-divider-orientation-margin": normalizeSize(props.orientationMargin)
      } : void 0
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-divider", dividerClass.value]),
        style: normalizeStyle(dividerStyle.value),
        role: "separator",
        "aria-orientation": resolvedType.value
      }, [
        _ctx.$slots.default && resolvedType.value === "horizontal" ? (openBlock(), createElementBlock("span", _hoisted_2, [
          renderSlot(_ctx.$slots, "default")
        ])) : createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
