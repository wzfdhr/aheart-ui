import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createCommentVNode, Fragment, createElementVNode } from "vue";
import { badgeProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title"];
const _hoisted_2 = ["title"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-badge__status-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ABadge"
  },
  __name: "badge",
  props: badgeProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const hasDefaultSlot = computed(() => Boolean(slots.default));
    const isStandalone = computed(() => !hasDefaultSlot.value);
    const isZeroCount = computed(() => props.count === 0);
    const showIndicatorWithCount = computed(() => !isZeroCount.value || props.showZero);
    const showDotIndicator = computed(() => props.dot && showIndicatorWithCount.value);
    const showCountIndicator = computed(() => !props.dot && props.count !== void 0 && showIndicatorWithCount.value);
    const normalizedSize = computed(() => props.size === "small" ? "small" : "medium");
    const displayCount = computed(() => {
      if (typeof props.count === "number" && props.count > props.overflowCount) {
        return `${props.overflowCount}+`;
      }
      return props.count;
    });
    const rootStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.root;
    });
    const internalIndicatorStyle = computed(() => {
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
    const indicatorStyle = computed(() => {
      var _a;
      return [internalIndicatorStyle.value, (_a = props.styles) == null ? void 0 : _a.indicator];
    });
    const badgeClass = computed(() => {
      var _a;
      return [
        {
          "aheart-badge--status": props.status,
          "aheart-badge--standalone": isStandalone.value
        },
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const indicatorClass = computed(() => ({
      "is-standalone": isStandalone.value
    }));
    const countClass = computed(() => {
      var _a;
      return [
        "aheart-badge__count",
        `aheart-badge__count--${normalizedSize.value}`,
        indicatorClass.value,
        (_a = props.classNames) == null ? void 0 : _a.indicator
      ];
    });
    const dotClass = computed(() => {
      var _a;
      return ["aheart-badge__dot", indicatorClass.value, (_a = props.classNames) == null ? void 0 : _a.indicator];
    });
    const statusDotClass = computed(() => {
      var _a;
      return [
        "aheart-badge__status-dot",
        `aheart-badge__status-dot--${props.status}`,
        (_a = props.classNames) == null ? void 0 : _a.indicator
      ];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-badge", badgeClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default"),
        showDotIndicator.value ? (openBlock(), createElementBlock("sup", {
          key: 0,
          class: normalizeClass(dotClass.value),
          style: normalizeStyle(indicatorStyle.value),
          title: _ctx.title
        }, null, 14, _hoisted_1)) : showCountIndicator.value ? (openBlock(), createElementBlock("sup", {
          key: 1,
          class: normalizeClass(countClass.value),
          style: normalizeStyle(indicatorStyle.value),
          title: _ctx.title
        }, [
          renderSlot(_ctx.$slots, "count", {}, () => [
            createTextVNode(toDisplayString(displayCount.value), 1)
          ])
        ], 14, _hoisted_2)) : createCommentVNode("", true),
        _ctx.status ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createElementVNode("span", {
            class: normalizeClass(statusDotClass.value),
            style: normalizeStyle(indicatorStyle.value)
          }, null, 6),
          _ctx.text ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.text), 1)) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
