"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-busy"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASpin"
  },
  __name: "spin",
  props: types.spinProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const visible = vue.ref(false);
    let delayTimer;
    const ARenderNode = vue.defineComponent({
      name: "ASpinRenderNode",
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
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const clearDelayTimer = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = void 0;
      }
    };
    const syncVisibleState = () => {
      clearDelayTimer();
      if (!props.spinning) {
        visible.value = false;
        return;
      }
      const delay = props.delay ?? 0;
      if (delay > 0) {
        visible.value = false;
        delayTimer = setTimeout(() => {
          if (props.spinning) {
            visible.value = true;
          }
        }, delay);
        return;
      }
      visible.value = true;
    };
    vue.watch(() => [props.spinning, props.delay], syncVisibleState, { immediate: true });
    vue.onBeforeUnmount(clearDelayTimer);
    const hasDefaultSlot = vue.computed(() => Boolean(slots.default));
    const hasCustomIndicator = vue.computed(() => props.indicator !== void 0 && props.indicator !== null);
    const indicatorNode = vue.computed(
      () => typeof props.indicator === "function" ? props.indicator() : props.indicator
    );
    const hasDescriptionSlot = vue.computed(() => Boolean(slots.description));
    const descriptionNode = vue.computed(() => props.description ?? props.tip);
    const hasDescription = vue.computed(() => hasDescriptionSlot.value || hasRenderable(descriptionNode.value));
    const percentText = vue.computed(() => {
      if (props.percent === void 0 || props.percent === null) {
        return "";
      }
      return props.percent === "auto" ? "auto" : `${props.percent}%`;
    });
    const spinRootClass = vue.computed(() => [
      visible.value ? "aheart-spin" : "aheart-spin-wrapper",
      `aheart-spin--${props.size}`,
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "aheart-spin-nested": hasDefaultSlot.value,
        "aheart-spin-fullscreen": props.fullscreen,
        "is-spinning": visible.value
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
    const sectionClass = vue.computed(() => [props.wrapperClassName, props.classNames.section]);
    const sectionStyle = vue.computed(() => props.styles.section);
    const containerClass = vue.computed(() => [
      props.classNames.container,
      {
        "is-blur": visible.value
      }
    ]);
    const containerStyle = vue.computed(() => props.styles.container);
    const indicatorClass = vue.computed(() => [
      props.classNames.indicator,
      {
        "is-custom": hasCustomIndicator.value
      }
    ]);
    const indicatorStyle = vue.computed(() => props.styles.indicator);
    const descriptionClass = vue.computed(() => [props.classNames.description, props.classNames.tip]);
    const descriptionStyle = vue.computed(() => [props.styles.description, props.styles.tip]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(spinRootClass.value),
        style: vue.normalizeStyle(rootStyle.value),
        "aria-busy": _ctx.spinning ? "true" : "false"
      }, [
        hasDefaultSlot.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-spin-section", sectionClass.value]),
          style: vue.normalizeStyle(sectionStyle.value)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["aheart-spin-container", containerClass.value]),
            style: vue.normalizeStyle(containerStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 6),
          visible.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(["aheart-spin__indicator", indicatorClass.value]),
            style: vue.normalizeStyle(indicatorStyle.value),
            role: "status",
            "aria-live": "polite"
          }, [
            hasCustomIndicator.value ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
              key: 0,
              node: indicatorNode.value
            }, null, 8, ["node"])) : (vue.openBlock(), vue.createElementBlock("span", {
              key: 1,
              class: vue.normalizeClass(["aheart-spin__dot", _ctx.classNames.dot]),
              style: vue.normalizeStyle(_ctx.styles.dot),
              "aria-hidden": "true"
            }, null, 6)),
            hasDescription.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass(["aheart-spin__tip aheart-spin__description", descriptionClass.value]),
              style: vue.normalizeStyle(descriptionStyle.value)
            }, [
              vue.renderSlot(_ctx.$slots, "description", {}, () => [
                vue.createVNode(vue.unref(ARenderNode), { node: descriptionNode.value }, null, 8, ["node"])
              ])
            ], 6)) : vue.createCommentVNode("", true),
            percentText.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 3,
              class: vue.normalizeClass(["aheart-spin__percent", _ctx.classNames.percent]),
              style: vue.normalizeStyle(_ctx.styles.percent)
            }, vue.toDisplayString(percentText.value), 7)) : vue.createCommentVNode("", true)
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)) : visible.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(["aheart-spin__indicator", indicatorClass.value]),
          style: vue.normalizeStyle(indicatorStyle.value),
          role: "status",
          "aria-live": "polite"
        }, [
          hasCustomIndicator.value ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
            key: 0,
            node: indicatorNode.value
          }, null, 8, ["node"])) : (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(["aheart-spin__dot", _ctx.classNames.dot]),
            style: vue.normalizeStyle(_ctx.styles.dot),
            "aria-hidden": "true"
          }, null, 6)),
          hasDescription.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(["aheart-spin__tip aheart-spin__description", descriptionClass.value]),
            style: vue.normalizeStyle(descriptionStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "description", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: descriptionNode.value }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          percentText.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 3,
            class: vue.normalizeClass(["aheart-spin__percent", _ctx.classNames.percent]),
            style: vue.normalizeStyle(_ctx.styles.percent)
          }, vue.toDisplayString(percentText.value), 7)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
