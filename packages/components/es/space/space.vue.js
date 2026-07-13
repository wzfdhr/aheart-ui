import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createElementVNode, createBlock, resolveDynamicComponent, createVNode, unref, createCommentVNode, Comment } from "vue";
import { spaceProps } from "./types.js";
import "./style.css.js";
import { useAheartConfig } from "../config/context.js";
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
    const ARenderNode = defineComponent({
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
    const resolvedDirection = computed(() => props.orientation || (props.vertical ? "vertical" : props.direction));
    const separatorNode = computed(() => props.separator ?? props.split);
    const semanticInfo = computed(() => ({
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
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
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
    const spaceClass = computed(() => [
      props.className,
      props.rootClassName,
      semanticClassNames.value.root,
      `aheart-space--${resolvedDirection.value}`,
      {
        [`aheart-space--align-${props.align}`]: props.align,
        "is-wrap": props.wrap
      }
    ]);
    const spaceStyle = computed(() => {
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-space", spaceClass.value]),
        style: normalizeStyle(spaceStyle.value)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedChildren.value, (child, index) => {
          return openBlock(), createElementBlock(Fragment, { key: index }, [
            createElementVNode("div", {
              class: normalizeClass(["aheart-space__item", semanticClassNames.value.item]),
              style: normalizeStyle(semanticStyles.value.item)
            }, [
              (openBlock(), createBlock(resolveDynamicComponent(child)))
            ], 6),
            separatorNode.value !== void 0 && separatorNode.value !== null && index < normalizedChildren.value.length - 1 ? (openBlock(), createElementBlock("span", {
              key: 0,
              class: normalizeClass(["aheart-space__separator", semanticClassNames.value.separator]),
              style: normalizeStyle(semanticStyles.value.separator)
            }, [
              createVNode(unref(ARenderNode), { node: separatorNode.value }, null, 8, ["node"])
            ], 6)) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
