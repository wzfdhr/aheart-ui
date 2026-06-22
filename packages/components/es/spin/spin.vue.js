import { defineComponent, useSlots, ref, watch, onBeforeUnmount, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, unref, toDisplayString, createCommentVNode } from "vue";
import { spinProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-busy"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASpin"
  },
  __name: "spin",
  props: spinProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const visible = ref(false);
    let delayTimer;
    const ARenderNode = defineComponent({
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
    watch(() => [props.spinning, props.delay], syncVisibleState, { immediate: true });
    onBeforeUnmount(clearDelayTimer);
    const hasDefaultSlot = computed(() => Boolean(slots.default));
    const hasCustomIndicator = computed(() => props.indicator !== void 0 && props.indicator !== null);
    const indicatorNode = computed(
      () => typeof props.indicator === "function" ? props.indicator() : props.indicator
    );
    const percentText = computed(() => {
      if (props.percent === void 0 || props.percent === null) {
        return "";
      }
      return props.percent === "auto" ? "auto" : `${props.percent}%`;
    });
    const spinRootClass = computed(() => [
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
    const rootStyle = computed(() => [props.style, props.styles.root]);
    const sectionClass = computed(() => [props.wrapperClassName, props.classNames.section]);
    const sectionStyle = computed(() => props.styles.section);
    const containerClass = computed(() => [
      props.classNames.container,
      {
        "is-blur": visible.value
      }
    ]);
    const containerStyle = computed(() => props.styles.container);
    const indicatorClass = computed(() => [
      props.classNames.indicator,
      {
        "is-custom": hasCustomIndicator.value
      }
    ]);
    const indicatorStyle = computed(() => props.styles.indicator);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(spinRootClass.value),
        style: normalizeStyle(rootStyle.value),
        "aria-busy": _ctx.spinning ? "true" : "false"
      }, [
        hasDefaultSlot.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-spin-section", sectionClass.value]),
          style: normalizeStyle(sectionStyle.value)
        }, [
          createElementVNode("div", {
            class: normalizeClass(["aheart-spin-container", containerClass.value]),
            style: normalizeStyle(containerStyle.value)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 6),
          visible.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["aheart-spin__indicator", indicatorClass.value]),
            style: normalizeStyle(indicatorStyle.value),
            role: "status",
            "aria-live": "polite"
          }, [
            hasCustomIndicator.value ? (openBlock(), createBlock(unref(ARenderNode), {
              key: 0,
              node: indicatorNode.value
            }, null, 8, ["node"])) : (openBlock(), createElementBlock("span", {
              key: 1,
              class: normalizeClass(["aheart-spin__dot", _ctx.classNames.dot]),
              style: normalizeStyle(_ctx.styles.dot),
              "aria-hidden": "true"
            }, null, 6)),
            _ctx.tip ? (openBlock(), createElementBlock("span", {
              key: 2,
              class: normalizeClass(["aheart-spin__tip", _ctx.classNames.tip]),
              style: normalizeStyle(_ctx.styles.tip)
            }, toDisplayString(_ctx.tip), 7)) : createCommentVNode("", true),
            percentText.value ? (openBlock(), createElementBlock("span", {
              key: 3,
              class: normalizeClass(["aheart-spin__percent", _ctx.classNames.percent]),
              style: normalizeStyle(_ctx.styles.percent)
            }, toDisplayString(percentText.value), 7)) : createCommentVNode("", true)
          ], 6)) : createCommentVNode("", true)
        ], 6)) : visible.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["aheart-spin__indicator", indicatorClass.value]),
          style: normalizeStyle(indicatorStyle.value),
          role: "status",
          "aria-live": "polite"
        }, [
          hasCustomIndicator.value ? (openBlock(), createBlock(unref(ARenderNode), {
            key: 0,
            node: indicatorNode.value
          }, null, 8, ["node"])) : (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["aheart-spin__dot", _ctx.classNames.dot]),
            style: normalizeStyle(_ctx.styles.dot),
            "aria-hidden": "true"
          }, null, 6)),
          _ctx.tip ? (openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(["aheart-spin__tip", _ctx.classNames.tip]),
            style: normalizeStyle(_ctx.styles.tip)
          }, toDisplayString(_ctx.tip), 7)) : createCommentVNode("", true),
          percentText.value ? (openBlock(), createElementBlock("span", {
            key: 3,
            class: normalizeClass(["aheart-spin__percent", _ctx.classNames.percent]),
            style: normalizeStyle(_ctx.styles.percent)
          }, toDisplayString(percentText.value), 7)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
