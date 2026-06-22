import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createElementVNode, createVNode, unref } from "vue";
import { badgeRibbonProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ABadgeRibbon"
  },
  __name: "ribbon",
  props: badgeRibbonProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = defineComponent({
      name: "ABadgeRibbonRenderNode",
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
    const wrapperClass = computed(() => {
      var _a;
      return [
        `aheart-ribbon--${props.placement}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const wrapperStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const colorStyle = computed(() => props.color ? { backgroundColor: props.color } : void 0);
    const indicatorClass = computed(() => {
      var _a;
      return [(_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const indicatorStyle = computed(() => {
      var _a;
      return [colorStyle.value, (_a = props.styles) == null ? void 0 : _a.indicator];
    });
    const contentClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const cornerStyle = computed(() => props.color ? { color: props.color } : void 0);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-ribbon-wrapper", wrapperClass.value]),
        style: normalizeStyle(wrapperStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default"),
        createElementVNode("div", {
          class: normalizeClass(["aheart-ribbon__indicator", indicatorClass.value]),
          style: normalizeStyle(indicatorStyle.value)
        }, [
          createElementVNode("span", {
            class: normalizeClass(["aheart-ribbon__content", contentClass.value]),
            style: normalizeStyle(contentStyle.value)
          }, [
            createVNode(unref(ARenderNode), { node: _ctx.text }, null, 8, ["node"])
          ], 6),
          createElementVNode("span", {
            class: "aheart-ribbon__corner",
            style: normalizeStyle(cornerStyle.value),
            "aria-hidden": "true"
          }, null, 4)
        ], 6)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
