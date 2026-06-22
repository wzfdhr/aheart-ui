"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ABadgeRibbon"
  },
  __name: "ribbon",
  props: types.badgeRibbonProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = vue.defineComponent({
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
    const wrapperClass = vue.computed(() => {
      var _a;
      return [
        `aheart-ribbon--${props.placement}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const wrapperStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const colorStyle = vue.computed(() => props.color ? { backgroundColor: props.color } : void 0);
    const indicatorClass = vue.computed(() => {
      var _a;
      return [(_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const indicatorStyle = vue.computed(() => {
      var _a;
      return [colorStyle.value, (_a = props.styles) == null ? void 0 : _a.indicator];
    });
    const contentClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const cornerStyle = vue.computed(() => props.color ? { color: props.color } : void 0);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-ribbon-wrapper", wrapperClass.value]),
        style: vue.normalizeStyle(wrapperStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default"),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["aheart-ribbon__indicator", indicatorClass.value]),
          style: vue.normalizeStyle(indicatorStyle.value)
        }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-ribbon__content", contentClass.value]),
            style: vue.normalizeStyle(contentStyle.value)
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: _ctx.text }, null, 8, ["node"])
          ], 6),
          vue.createElementVNode("span", {
            class: "aheart-ribbon__corner",
            style: vue.normalizeStyle(cornerStyle.value),
            "aria-hidden": "true"
          }, null, 4)
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
