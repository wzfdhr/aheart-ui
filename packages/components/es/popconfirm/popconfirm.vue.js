import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, Teleport, withDirectives, unref, createCommentVNode, createVNode, mergeProps, withCtx, createTextVNode, toDisplayString, vShow } from "vue";
import Button from "../button/index.js";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { popconfirmProps, popconfirmEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-hidden"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: popconfirmProps,
  emits: popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
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
    const slots = useSlots();
    const innerOpen = ref(props.defaultOpen);
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const popupRef = ref(null);
    const arrowRef = ref(null);
    const effectivePlacement = ref(props.placement);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const visible = computed(() => !props.disabled && mergedOpen.value);
    const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyTooltipOnHide);
    const motion = useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderPopup = computed(() => !props.disabled && motion.isMounted.value);
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({
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
    const resolvedIcon = computed(() => props.icon === void 0 ? "!" : props.icon);
    const hasIcon = computed(() => Boolean(slots.icon) || hasRenderable(resolvedIcon.value));
    const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasDescription = computed(() => Boolean(slots.description) || hasRenderable(props.description));
    const semanticInfo = computed(() => ({
      open: visible.value,
      placement: effectivePlacement.value
    }));
    const resolvedClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const resolvedStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const popconfirmClass = computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": visible.value,
        "is-disabled": props.disabled
      }
    ]);
    const rootStyle = computed(() => [props.style, resolvedStyles.value.root]);
    const triggerClass = computed(() => resolvedClassNames.value.trigger);
    const triggerStyle = computed(() => resolvedStyles.value.trigger);
    const popupClass = computed(() => [
      `aheart-floating--${effectivePlacement.value}`,
      `is-${motion.phase.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const popupStyle = computed(() => [
      floatingPosition.popupStyle.value,
      getFloatingPopupStyle(props.color, props.zIndex),
      props.overlayStyle,
      resolvedStyles.value.popup
    ]);
    const containerClass = computed(() => resolvedClassNames.value.container);
    const containerStyle = computed(() => [props.overlayInnerStyle, resolvedStyles.value.container]);
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-popconfirm__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
    const messageClass = computed(() => resolvedClassNames.value.message);
    const messageStyle = computed(() => resolvedStyles.value.message);
    const iconClass = computed(() => resolvedClassNames.value.icon);
    const iconStyle = computed(() => resolvedStyles.value.icon);
    const textClass = computed(() => resolvedClassNames.value.text);
    const textStyle = computed(() => resolvedStyles.value.text);
    const titleClass = computed(() => resolvedClassNames.value.title);
    const titleStyle = computed(() => resolvedStyles.value.title);
    const descriptionClass = computed(() => resolvedClassNames.value.description);
    const descriptionStyle = computed(() => resolvedStyles.value.description);
    const actionsClass = computed(() => resolvedClassNames.value.actions);
    const actionsStyle = computed(() => resolvedStyles.value.actions);
    const cancelButtonClass = computed(() => resolvedClassNames.value.cancelButton);
    const cancelButtonStyle = computed(() => resolvedStyles.value.cancelButton);
    const okButtonClass = computed(() => resolvedClassNames.value.okButton);
    const okButtonStyle = computed(() => resolvedStyles.value.okButton);
    const resolvedCancelButtonProps = computed(() => ({
      size: "small",
      ...props.cancelButtonProps
    }));
    const resolvedOkButtonProps = computed(() => ({
      size: "small",
      type: props.okType,
      ...props.okButtonProps
    }));
    watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    watch(
      () => floatingPosition.placement.value,
      (placement) => {
        effectivePlacement.value = placement;
      },
      { immediate: true }
    );
    watch(
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
    useFloatingDismiss({
      open: visible,
      trigger: triggerRef,
      floating: popupRef,
      onDismiss: () => requestOpen(false)
    });
    onBeforeUnmount(() => {
      clearHoverTimers();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-popconfirm", popconfirmClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: normalizeClass(["aheart-popconfirm__trigger", triggerClass.value]),
          style: normalizeStyle(triggerStyle.value),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 38),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          shouldRenderPopup.value ? withDirectives((openBlock(), createElementBlock("span", {
            key: 0,
            ref_key: "popupRef",
            ref: popupRef,
            class: normalizeClass(["aheart-popconfirm__popup", popupClass.value]),
            style: normalizeStyle(popupStyle.value),
            role: "dialog",
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave,
            onClick: handlePopupClick
          }, [
            showArrow.value ? (openBlock(), createElementBlock("span", {
              key: 0,
              ref_key: "arrowRef",
              ref: arrowRef,
              class: normalizeClass(["aheart-floating__arrow aheart-popconfirm__arrow", arrowClass.value]),
              style: normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : createCommentVNode("", true),
            createElementVNode("span", {
              class: normalizeClass(["aheart-popconfirm__container", containerClass.value]),
              style: normalizeStyle(containerStyle.value)
            }, [
              createElementVNode("span", {
                class: normalizeClass(["aheart-popconfirm__message", messageClass.value]),
                style: normalizeStyle(messageStyle.value)
              }, [
                hasIcon.value ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass(["aheart-popconfirm__icon", iconClass.value]),
                  style: normalizeStyle(iconStyle.value),
                  "aria-hidden": "true"
                }, [
                  renderSlot(_ctx.$slots, "icon", {}, () => [
                    createVNode(unref(ARenderNode), { node: resolvedIcon.value }, null, 8, ["node"])
                  ])
                ], 6)) : createCommentVNode("", true),
                createElementVNode("span", {
                  class: normalizeClass(["aheart-popconfirm__text", textClass.value]),
                  style: normalizeStyle(textStyle.value)
                }, [
                  hasTitle.value ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass(["aheart-popconfirm__title", titleClass.value]),
                    style: normalizeStyle(titleStyle.value)
                  }, [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      createVNode(unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                    ])
                  ], 6)) : createCommentVNode("", true),
                  hasDescription.value ? (openBlock(), createElementBlock("span", {
                    key: 1,
                    class: normalizeClass(["aheart-popconfirm__description", descriptionClass.value]),
                    style: normalizeStyle(descriptionStyle.value)
                  }, [
                    renderSlot(_ctx.$slots, "description", {}, () => [
                      createVNode(unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
                    ])
                  ], 6)) : createCommentVNode("", true)
                ], 6)
              ], 6),
              createElementVNode("span", {
                class: normalizeClass(["aheart-popconfirm__actions", actionsClass.value]),
                style: normalizeStyle(actionsStyle.value)
              }, [
                _ctx.showCancel ? (openBlock(), createBlock(unref(Button), mergeProps({ key: 0 }, resolvedCancelButtonProps.value, {
                  class: ["aheart-popconfirm__cancel", cancelButtonClass.value],
                  style: cancelButtonStyle.value,
                  onClick: handleCancel
                }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])) : createCommentVNode("", true),
                createVNode(unref(Button), mergeProps(resolvedOkButtonProps.value, {
                  class: ["aheart-popconfirm__ok", okButtonClass.value],
                  style: okButtonStyle.value,
                  onClick: handleConfirm
                }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])
              ], 6)
            ], 6)
          ], 46, _hoisted_1)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};
