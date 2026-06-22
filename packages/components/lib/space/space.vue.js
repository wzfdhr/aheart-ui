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
    const ARenderNode = vue.defineComponent({
      name: "ASpaceRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
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
    const resolvedDirection = vue.computed(() => props.orientation || (props.vertical ? "vertical" : props.direction));
    const separatorNode = vue.computed(() => props.separator ?? props.split);
    const semanticInfo = vue.computed(() => ({
      props: {
        size: props.size,
        direction: props.direction,
        orientation: props.orientation,
        vertical: props.vertical,
        align: props.align,
        wrap: props.wrap,
        separator: props.separator,
        split: props.split
      }
    }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
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
      props.className,
      props.rootClassName,
      semanticClassNames.value.root,
      `aheart-space--${resolvedDirection.value}`,
      {
        [`aheart-space--align-${props.align}`]: props.align,
        "is-wrap": props.wrap
      }
    ]);
    const spaceStyle = vue.computed(() => {
      const [horizontal, vertical] = sizeToGap(props.size);
      return [
        {
          "--aheart-space-gap-horizontal": horizontal,
          "--aheart-space-gap-vertical": vertical
        },
        props.style,
        semanticStyles.value.root
      ];
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-space", spaceClass.value]),
        style: vue.normalizeStyle(spaceStyle.value)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedChildren.value, (child, index) => {
          return vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: index }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["aheart-space__item", semanticClassNames.value.item]),
              style: vue.normalizeStyle(semanticStyles.value.item)
            }, [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(child)))
            ], 6),
            separatorNode.value !== void 0 && separatorNode.value !== null && index < normalizedChildren.value.length - 1 ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(["aheart-space__separator", semanticClassNames.value.separator]),
              style: vue.normalizeStyle(semanticStyles.value.separator)
            }, [
              vue.createVNode(vue.unref(ARenderNode), { node: separatorNode.value }, null, 8, ["node"])
            ], 6)) : vue.createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
