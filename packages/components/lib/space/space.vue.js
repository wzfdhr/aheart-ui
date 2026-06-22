"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASpace"
  },
  __name: "space",
  props: types.spaceProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const flattenChildren = (children) => {
      return children.flatMap((child) => {
        if (child.type === vue.Comment) {
          return [];
        }
        if (child.type === vue.Fragment && Array.isArray(child.children)) {
          return flattenChildren(child.children);
        }
        return [child];
      });
    };
    const normalizedChildren = vue.computed(() => {
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
    const spaceClass = vue.computed(() => [
      `aheart-space--${props.direction}`,
      {
        [`aheart-space--align-${props.align}`]: props.align,
        "is-wrap": props.wrap
      }
    ]);
    const spaceStyle = vue.computed(() => {
      const [horizontal, vertical] = sizeToGap(props.size);
      return {
        "--aheart-space-gap-horizontal": horizontal,
        "--aheart-space-gap-vertical": vertical
      };
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-space", spaceClass.value]),
        style: vue.normalizeStyle(spaceStyle.value)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedChildren.value, (child, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: index,
            class: "aheart-space__item"
          }, [
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(child)))
          ]);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
