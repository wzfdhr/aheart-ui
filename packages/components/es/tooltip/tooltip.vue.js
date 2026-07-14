import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, Teleport, withDirectives, unref, createCommentVNode, createVNode, vShow } from "vue";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { tooltipProps, tooltipEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-hidden"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATooltip"
  },
  __name: "tooltip",
  props: tooltipProps,
  emits: tooltipEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
      name: "ATooltipRenderNode",
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
    const hasTitleContent = (value) => value !== void 0 && value !== null && value !== false && value !== "";
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
    const hasTitle = computed(() => Boolean(slots.title) || hasTitleContent(props.title));
    const visible = computed(() => hasTitle.value && mergedOpen.value);
    const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyTooltipOnHide);
    const motion = useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderPopup = computed(() => hasTitle.value && motion.isMounted.value);
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
    const tooltipClass = computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": visible.value
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
    const contentClass = computed(() => resolvedClassNames.value.content);
    const contentStyle = computed(() => resolvedStyles.value.content);
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-tooltip__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
    let enterTimer;
    let leaveTimer;
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
    const clearTimers = () => {
      if (enterTimer) {
        clearTimeout(enterTimer);
        enterTimer = void 0;
      }
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = void 0;
      }
    };
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const requestOpenWithDelay = (open, delay) => {
      clearTimers();
      if (delay > 0) {
        const timer = setTimeout(() => requestOpen(open), delay * 1e3);
        if (open) {
          enterTimer = timer;
        } else {
          leaveTimer = timer;
        }
        return;
      }
      requestOpen(open);
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpenWithDelay(true, props.mouseEnterDelay);
      }
    };
    const containsRelatedTarget = (event, element) => event.relatedTarget instanceof Node && Boolean(element == null ? void 0 : element.contains(event.relatedTarget));
    const isHoveringTriggerOrPopup = (event) => containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value);
    const handleMouseLeave = (event) => {
      if (normalizedTriggers.value.has("hover") && !isHoveringTriggerOrPopup(event)) {
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
    useFloatingDismiss({
      open: visible,
      trigger: triggerRef,
      floating: popupRef,
      onDismiss: () => requestOpen(false)
    });
    onBeforeUnmount(clearTimers);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-tooltip", tooltipClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: normalizeClass(["aheart-tooltip__trigger", triggerClass.value]),
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
            class: normalizeClass(["aheart-tooltip__popup", popupClass.value]),
            style: normalizeStyle(popupStyle.value),
            role: "tooltip",
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (openBlock(), createElementBlock("span", {
              key: 0,
              ref_key: "arrowRef",
              ref: arrowRef,
              class: normalizeClass(["aheart-floating__arrow aheart-tooltip__arrow", arrowClass.value]),
              style: normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : createCommentVNode("", true),
            createElementVNode("span", {
              class: normalizeClass(["aheart-tooltip__container", containerClass.value]),
              style: normalizeStyle(containerStyle.value)
            }, [
              createElementVNode("span", {
                class: normalizeClass(["aheart-tooltip__content", contentClass.value]),
                style: normalizeStyle(contentStyle.value)
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createVNode(unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                ])
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
