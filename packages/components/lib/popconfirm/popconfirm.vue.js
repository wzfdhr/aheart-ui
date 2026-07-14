"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../button/index.js");
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
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: types.popconfirmProps,
  emits: types.popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "APopconfirmRenderNode",
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
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const visible = vue.computed(() => !props.disabled && mergedOpen.value);
    const shouldDestroyOnHidden = vue.computed(() => props.destroyOnHidden || props.destroyTooltipOnHide);
    const motion = useMotionPresence.useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderPopup = vue.computed(() => !props.disabled && motion.isMounted.value);
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
    const resolvedIcon = vue.computed(() => props.icon === void 0 ? "!" : props.icon);
    const hasIcon = vue.computed(() => Boolean(slots.icon) || hasRenderable(resolvedIcon.value));
    const hasTitle = vue.computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasDescription = vue.computed(() => Boolean(slots.description) || hasRenderable(props.description));
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
    const popconfirmClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": visible.value,
        "is-disabled": props.disabled
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
    const showArrow = vue.computed(() => props.arrow !== false);
    const arrowPointsAtCenter = vue.computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = vue.computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-popconfirm__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = vue.computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
    const messageClass = vue.computed(() => resolvedClassNames.value.message);
    const messageStyle = vue.computed(() => resolvedStyles.value.message);
    const iconClass = vue.computed(() => resolvedClassNames.value.icon);
    const iconStyle = vue.computed(() => resolvedStyles.value.icon);
    const textClass = vue.computed(() => resolvedClassNames.value.text);
    const textStyle = vue.computed(() => resolvedStyles.value.text);
    const titleClass = vue.computed(() => resolvedClassNames.value.title);
    const titleStyle = vue.computed(() => resolvedStyles.value.title);
    const descriptionClass = vue.computed(() => resolvedClassNames.value.description);
    const descriptionStyle = vue.computed(() => resolvedStyles.value.description);
    const actionsClass = vue.computed(() => resolvedClassNames.value.actions);
    const actionsStyle = vue.computed(() => resolvedStyles.value.actions);
    const cancelButtonClass = vue.computed(() => resolvedClassNames.value.cancelButton);
    const cancelButtonStyle = vue.computed(() => resolvedStyles.value.cancelButton);
    const okButtonClass = vue.computed(() => resolvedClassNames.value.okButton);
    const okButtonStyle = vue.computed(() => resolvedStyles.value.okButton);
    const resolvedCancelButtonProps = vue.computed(() => ({
      size: "small",
      ...props.cancelButtonProps
    }));
    const resolvedOkButtonProps = vue.computed(() => ({
      size: "small",
      type: props.okType,
      ...props.okButtonProps
    }));
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
    vue.watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) {
          effectivePlacement.value = props.placement;
        }
      }
    );
    const requestOpen = (open) => {
      if (props.disabled) {
        return;
      }
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    let mouseEnterTimer;
    let mouseLeaveTimer;
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
    const handlePopupClick = (event) => {
      emit("popupClick", event);
    };
    const handleConfirm = () => {
      emit("confirm");
      requestOpen(false);
    };
    const handleCancel = () => {
      emit("cancel");
      requestOpen(false);
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
        class: vue.normalizeClass(["aheart-popconfirm", popconfirmClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: vue.normalizeClass(["aheart-popconfirm__trigger", triggerClass.value]),
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
            class: vue.normalizeClass(["aheart-popconfirm__popup", popupClass.value]),
            style: vue.normalizeStyle(popupStyle.value),
            role: "dialog",
            "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave,
            onClick: handlePopupClick
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              ref_key: "arrowRef",
              ref: arrowRef,
              class: vue.normalizeClass(["aheart-floating__arrow aheart-popconfirm__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-popconfirm__container", containerClass.value]),
              style: vue.normalizeStyle(containerStyle.value)
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-popconfirm__message", messageClass.value]),
                style: vue.normalizeStyle(messageStyle.value)
              }, [
                hasIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass(["aheart-popconfirm__icon", iconClass.value]),
                  style: vue.normalizeStyle(iconStyle.value),
                  "aria-hidden": "true"
                }, [
                  vue.renderSlot(_ctx.$slots, "icon", {}, () => [
                    vue.createVNode(vue.unref(ARenderNode), { node: resolvedIcon.value }, null, 8, ["node"])
                  ])
                ], 6)) : vue.createCommentVNode("", true),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(["aheart-popconfirm__text", textClass.value]),
                  style: vue.normalizeStyle(textStyle.value)
                }, [
                  hasTitle.value ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(["aheart-popconfirm__title", titleClass.value]),
                    style: vue.normalizeStyle(titleStyle.value)
                  }, [
                    vue.renderSlot(_ctx.$slots, "title", {}, () => [
                      vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true),
                  hasDescription.value ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(["aheart-popconfirm__description", descriptionClass.value]),
                    style: vue.normalizeStyle(descriptionStyle.value)
                  }, [
                    vue.renderSlot(_ctx.$slots, "description", {}, () => [
                      vue.createVNode(vue.unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true)
                ], 6)
              ], 6),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-popconfirm__actions", actionsClass.value]),
                style: vue.normalizeStyle(actionsStyle.value)
              }, [
                _ctx.showCancel ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), vue.mergeProps({ key: 0 }, resolvedCancelButtonProps.value, {
                  class: ["aheart-popconfirm__cancel", cancelButtonClass.value],
                  style: cancelButtonStyle.value,
                  onClick: handleCancel
                }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])) : vue.createCommentVNode("", true),
                vue.createVNode(vue.unref(index.default), vue.mergeProps(resolvedOkButtonProps.value, {
                  class: ["aheart-popconfirm__ok", okButtonClass.value],
                  style: okButtonStyle.value,
                  onClick: handleConfirm
                }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])
              ], 6)
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
