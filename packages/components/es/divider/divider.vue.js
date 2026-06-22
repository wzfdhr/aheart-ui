import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { dividerProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-orientation"];
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
    const hasText = computed(() => Boolean(slots.default && resolvedType.value === "horizontal"));
    const dividerClass = computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      `aheart-divider--${resolvedType.value}`,
      `aheart-divider--${resolvedTitlePlacement.value}`,
      `aheart-divider--${props.size}`,
      {
        "has-text": hasText.value,
        [`is-${resolvedVariant.value}`]: resolvedVariant.value,
        "is-plain": props.plain
      }
    ]);
    const dividerStyle = computed(() => [
      props.orientationMargin ? {
        "--aheart-divider-orientation-margin": normalizeSize(props.orientationMargin)
      } : void 0,
      props.style,
      props.styles.root
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-divider", dividerClass.value]),
        style: normalizeStyle(dividerStyle.value),
        role: "separator",
        "aria-orientation": resolvedType.value
      }, [
        createElementVNode("span", {
          class: normalizeClass(["aheart-divider__line", _ctx.classNames.line]),
          style: normalizeStyle(_ctx.styles.line),
          "aria-hidden": "true"
        }, null, 6),
        hasText.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-divider__text", _ctx.classNames.text]),
          style: normalizeStyle(_ctx.styles.text)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 6)) : createCommentVNode("", true),
        hasText.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(["aheart-divider__line", _ctx.classNames.line]),
          style: normalizeStyle(_ctx.styles.line),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
