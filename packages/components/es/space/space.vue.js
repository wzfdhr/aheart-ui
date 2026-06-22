import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createBlock, resolveDynamicComponent, Comment } from "vue";
import { useAheartConfig } from "../config/context.js";
import { spaceProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASpace"
  },
  __name: "space",
  props: spaceProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const config = useAheartConfig();
    const flattenChildren = (children) => {
      return children.flatMap((child) => {
        if (child.type === Comment) {
          return [];
        }
        if (child.type === Fragment && Array.isArray(child.children)) {
          return flattenChildren(child.children);
        }
        return [child];
      });
    };
    const normalizedChildren = computed(() => {
      var _a;
      return flattenChildren(((_a = slots.default) == null ? void 0 : _a.call(slots)) || []);
    });
    const sizeToGap = (size) => {
      if (Array.isArray(size)) {
        return [`${size[0]}px`, `${size[1]}px`];
      }
      if (typeof size === "number") {
        return [`${size}px`, `${size}px`];
      }
      const resolved = size || config.value.size || "middle";
      const tokenMap = {
        large: "var(--aheart-spacing-lg)",
        middle: "var(--aheart-spacing-md)",
        small: "var(--aheart-spacing-sm)"
      };
      return [tokenMap[resolved], tokenMap[resolved]];
    };
    const spaceClass = computed(() => [
      `aheart-space--${props.direction}`,
      {
        [`aheart-space--align-${props.align}`]: props.align,
        "is-wrap": props.wrap
      }
    ]);
    const spaceStyle = computed(() => {
      const [horizontal, vertical] = sizeToGap(props.size);
      return {
        "--aheart-space-gap-horizontal": horizontal,
        "--aheart-space-gap-vertical": vertical
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-space", spaceClass.value]),
        style: normalizeStyle(spaceStyle.value)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedChildren.value, (child, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: "aheart-space__item"
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(child)))
          ]);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
