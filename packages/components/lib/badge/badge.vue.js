"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title"];
const _hoisted_2 = ["title"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-badge__status-text"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ABadge"
  },
  __name: "badge",
  props: types.badgeProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ABadgeRenderNode",
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
    const hasDefaultSlot = vue.computed(() => Boolean(slots.default));
    const isStandalone = vue.computed(() => !hasDefaultSlot.value);
    const hasCount = vue.computed(() => props.count !== void 0 && props.count !== null && props.count !== false);
    const isZeroCount = vue.computed(() => props.count === 0);
    const showIndicatorWithCount = vue.computed(() => !isZeroCount.value || props.showZero);
    const showDotIndicator = vue.computed(() => props.dot && showIndicatorWithCount.value);
    const showCountIndicator = vue.computed(() => !props.dot && hasCount.value && showIndicatorWithCount.value);
    const normalizedSize = vue.computed(() => props.size === "small" ? "small" : "medium");
    const hasStatusText = vue.computed(() => props.text !== void 0 && props.text !== null && props.text !== false);
    const displayCount = vue.computed(() => {
      if (typeof props.count === "number" && props.count > props.overflowCount) {
        return `${props.overflowCount}+`;
      }
      return props.count;
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const internalIndicatorStyle = vue.computed(() => {
      const style = {};
      if (props.color) {
        style.backgroundColor = props.color;
      }
      if (props.offset && !isStandalone.value) {
        const [x, y] = props.offset;
        style.transform = `translate(50%, -50%) translate(${x}px, ${y}px)`;
      }
      return style;
    });
    const indicatorStyle = vue.computed(() => {
      var _a;
      return [internalIndicatorStyle.value, (_a = props.styles) == null ? void 0 : _a.indicator];
    });
    const badgeClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        {
          "aheart-badge--status": props.status,
          "aheart-badge--standalone": isStandalone.value
        },
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const indicatorClass = vue.computed(() => ({
      "is-standalone": isStandalone.value
    }));
    const countClass = vue.computed(() => {
      var _a;
      return [
        "aheart-badge__count",
        `aheart-badge__count--${normalizedSize.value}`,
        indicatorClass.value,
        (_a = props.classNames) == null ? void 0 : _a.indicator
      ];
    });
    const dotClass = vue.computed(() => {
      var _a;
      return ["aheart-badge__dot", indicatorClass.value, (_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const statusDotClass = vue.computed(() => {
      var _a;
      return [
        "aheart-badge__status-dot",
        `aheart-badge__status-dot--${props.status}`,
        (_a = props.classNames) == null ? void 0 : _a.indicator
      ];
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-badge", badgeClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default"),
        showDotIndicator.value ? (vue.openBlock(), vue.createElementBlock("sup", {
          key: 0,
          class: vue.normalizeClass(dotClass.value),
          style: vue.normalizeStyle(indicatorStyle.value),
          title: _ctx.title
        }, null, 14, _hoisted_1)) : showCountIndicator.value ? (vue.openBlock(), vue.createElementBlock("sup", {
          key: 1,
          class: vue.normalizeClass(countClass.value),
          style: vue.normalizeStyle(indicatorStyle.value),
          title: _ctx.title
        }, [
          vue.renderSlot(_ctx.$slots, "count", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: displayCount.value }, null, 8, ["node"])
          ])
        ], 14, _hoisted_2)) : vue.createCommentVNode("", true),
        _ctx.status ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(statusDotClass.value),
            style: vue.normalizeStyle(indicatorStyle.value)
          }, null, 6),
          hasStatusText.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, [
            vue.createVNode(vue.unref(ARenderNode), { node: _ctx.text }, null, 8, ["node"])
          ])) : vue.createCommentVNode("", true)
        ], 64)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
