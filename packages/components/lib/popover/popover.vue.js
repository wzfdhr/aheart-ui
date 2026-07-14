"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const floating = require("../utils/floating.js");
require("../utils/floating.css.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-hidden"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APopover"
  },
  __name: "popover",
  props: types.popoverProps,
  emits: types.popoverEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "APopoverRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => typeof renderProps.node === "function" ? renderProps.node() : renderProps.node;
      }
    });
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false;
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const innerOpen = vue.ref(props.defaultOpen);
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const popupRef = vue.ref(null);
    const arrowRef = vue.ref(null);
    const effectivePlacement = vue.ref(props.placement);
    let mouseEnterTimer;
    let mouseLeaveTimer;
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const hasTitle = vue.computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasContent = vue.computed(() => Boolean(slots.content) || hasRenderable(props.content));
    const hasPopupContent = vue.computed(() => hasTitle.value || hasContent.value);
    const visible = vue.computed(() => hasPopupContent.value && mergedOpen.value);
    const shouldDestroyOnHidden = vue.computed(() => props.destroyOnHidden || props.destroyTooltipOnHide);
    const motion = useMotionPresence.useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderPopup = vue.computed(() => hasPopupContent.value && motion.isMounted.value);
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: triggerRef,
      floating: popupRef,
      arrow: arrowRef,
      open: () => shouldRenderPopup.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      offset: 8,
      alignOffset: () => {
        var _a;
        return (_a = props.align) == null ? void 0 : _a.offset;
      },
      autoAdjustOverflow: () => props.autoAdjustOverflow,
      arrowSize: 8
    });
    const semanticInfo = vue.computed(() => ({
      open: visible.value,
      placement: effectivePlacement.value
    }));
    const resolvedClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const resolvedStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const popoverClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": visible.value
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, resolvedStyles.value.root]);
    const triggerClass = vue.computed(() => resolvedClassNames.value.trigger);
    const triggerStyle = vue.computed(() => resolvedStyles.value.trigger);
    const popupClass = vue.computed(() => [
      `aheart-floating--${effectivePlacement.value}`,
      `is-${motion.phase.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const popupStyle = vue.computed(() => [
      floatingPosition.popupStyle.value,
      floating.getFloatingPopupStyle(props.color, props.zIndex),
      props.overlayStyle,
      resolvedStyles.value.popup
    ]);
    const containerClass = vue.computed(() => resolvedClassNames.value.container);
    const containerStyle = vue.computed(() => [props.overlayInnerStyle, resolvedStyles.value.container]);
    const titleClass = vue.computed(() => resolvedClassNames.value.title);
    const titleStyle = vue.computed(() => resolvedStyles.value.title);
    const contentClass = vue.computed(() => resolvedClassNames.value.content);
    const contentStyle = vue.computed(() => resolvedStyles.value.content);
    const showArrow = vue.computed(() => props.arrow !== false);
    const arrowPointsAtCenter = vue.computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = vue.computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-popover__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = vue.computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
    vue.watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    vue.watch(
      () => floatingPosition.placement.value,
      (placement) => {
        effectivePlacement.value = placement;
      },
      { immediate: true }
    );
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const clearMouseEnterTimer = () => {
      if (mouseEnterTimer) {
        clearTimeout(mouseEnterTimer);
        mouseEnterTimer = void 0;
      }
    };
    const clearMouseLeaveTimer = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
        mouseLeaveTimer = void 0;
      }
    };
    const clearHoverTimers = () => {
      clearMouseEnterTimer();
      clearMouseLeaveTimer();
    };
    const delayToMs = (delay) => Math.max(0, delay * 1e3);
    const requestOpenWithDelay = (open, delay) => {
      const timerDelay = delayToMs(delay);
      if (timerDelay === 0) {
        requestOpen(open);
        return;
      }
      const timer = setTimeout(() => {
        if (open) {
          mouseEnterTimer = void 0;
        } else {
          mouseLeaveTimer = void 0;
        }
        requestOpen(open);
      }, timerDelay);
      if (open) {
        mouseEnterTimer = timer;
      } else {
        mouseLeaveTimer = timer;
      }
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        clearMouseLeaveTimer();
        clearMouseEnterTimer();
        requestOpenWithDelay(true, props.mouseEnterDelay);
      }
    };
    const containsRelatedTarget = (event, element) => event.relatedTarget instanceof Node && Boolean(element == null ? void 0 : element.contains(event.relatedTarget));
    const isHoveringTriggerOrPopup = (event) => containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value);
    const handleMouseLeave = (event) => {
      if (normalizedTriggers.value.has("hover") && !isHoveringTriggerOrPopup(event)) {
        clearMouseEnterTimer();
        clearMouseLeaveTimer();
        requestOpenWithDelay(false, props.mouseLeaveDelay);
      }
    };
    const handleFocusIn = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(true);
      }
    };
    const handleFocusOut = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(false);
      }
    };
    const handleClick = () => {
      if (normalizedTriggers.value.has("click")) {
        requestOpen(!mergedOpen.value);
      }
    };
    const handleContextmenu = (event) => {
      if (normalizedTriggers.value.has("contextMenu")) {
        event.preventDefault();
        requestOpen(true);
      }
    };
    useFloatingDismiss.useFloatingDismiss({
      open: visible,
      trigger: triggerRef,
      floating: popupRef,
      onDismiss: () => requestOpen(false)
    });
    vue.onBeforeUnmount(() => {
      clearHoverTimers();
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-popover", popoverClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: vue.normalizeClass(["aheart-popover__trigger", triggerClass.value]),
          style: vue.normalizeStyle(triggerStyle.value),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 38),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          shouldRenderPopup.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            ref_key: "popupRef",
            ref: popupRef,
            class: vue.normalizeClass(["aheart-popover__popup", popupClass.value]),
            style: vue.normalizeStyle(popupStyle.value),
            role: "dialog",
            "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              ref_key: "arrowRef",
              ref: arrowRef,
              class: vue.normalizeClass(["aheart-floating__arrow aheart-popover__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-popover__container", containerClass.value]),
              style: vue.normalizeStyle(containerStyle.value)
            }, [
              hasTitle.value ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(["aheart-popover__title", titleClass.value]),
                style: vue.normalizeStyle(titleStyle.value)
              }, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                ])
              ], 6)) : vue.createCommentVNode("", true),
              hasContent.value ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(["aheart-popover__content", contentClass.value]),
                style: vue.normalizeStyle(contentStyle.value)
              }, [
                vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  vue.createVNode(vue.unref(ARenderNode), { node: _ctx.content }, null, 8, ["node"])
                ])
              ], 6)) : vue.createCommentVNode("", true)
            ], 6)
          ], 46, _hoisted_1)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
exports.default = _sfc_main;
