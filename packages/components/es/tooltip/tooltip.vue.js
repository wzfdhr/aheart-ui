import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, Teleport, withDirectives, createCommentVNode, createVNode, unref, vShow, nextTick } from "vue";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { tooltipProps, tooltipEmits } from "./types.js";
import "./style.css.js";
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
    const hasRenderedPopup = ref(Boolean(props.defaultOpen || props.open));
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const popupRef = ref(null);
    const effectivePlacement = ref(props.placement);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const hasTitle = computed(() => Boolean(slots.title) || hasTitleContent(props.title));
    const visible = computed(() => hasTitle.value && mergedOpen.value);
    const shouldRenderPopup = computed(() => hasTitle.value && (visible.value || !props.destroyOnHidden && hasRenderedPopup.value));
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const tooltipClass = computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-open": visible.value
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const popupClass = computed(() => {
      var _a;
      return [`aheart-floating--${effectivePlacement.value}`, props.overlayClassName, (_a = props.classNames) == null ? void 0 : _a.popup];
    });
    const popupStyle = computed(() => {
      var _a;
      return [getFloatingPopupStyle(props.color, props.zIndex), props.overlayStyle, (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const containerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.container;
    });
    const containerStyle = computed(() => {
      var _a;
      return [props.overlayInnerStyle, (_a = props.styles) == null ? void 0 : _a.container];
    });
    const contentClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => {
      var _a;
      return [
        (_a = props.classNames) == null ? void 0 : _a.arrow,
        {
          "aheart-tooltip__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
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
    const getPlacementSide = (placement) => {
      if (placement.startsWith("top")) {
        return "top";
      }
      if (placement.startsWith("bottom")) {
        return "bottom";
      }
      if (placement.startsWith("left")) {
        return "left";
      }
      return "right";
    };
    const getPlacementAlign = (placement) => {
      if (placement.endsWith("Left")) {
        return "Left";
      }
      if (placement.endsWith("Right")) {
        return "Right";
      }
      if (placement.endsWith("Top")) {
        return "Top";
      }
      if (placement.endsWith("Bottom")) {
        return "Bottom";
      }
      return "";
    };
    const createPlacement = (side, align) => `${side}${align}`;
    const getViewportSize = () => {
      if (typeof window === "undefined") {
        return { width: 0, height: 0 };
      }
      return {
        width: window.innerWidth || document.documentElement.clientWidth || 0,
        height: window.innerHeight || document.documentElement.clientHeight || 0
      };
    };
    const resolveAdjustedPlacement = () => {
      if (!props.autoAdjustOverflow || !triggerRef.value || !popupRef.value) {
        return props.placement;
      }
      const triggerRect = triggerRef.value.getBoundingClientRect();
      const popupRect = popupRef.value.getBoundingClientRect();
      const viewport = getViewportSize();
      let side = getPlacementSide(props.placement);
      let align = getPlacementAlign(props.placement);
      const popupHeight = popupRect.height;
      const popupWidth = popupRect.width;
      if (popupHeight > 0 && viewport.height > 0) {
        const spaceAbove = triggerRect.top;
        const spaceBelow = viewport.height - triggerRect.bottom;
        if (side === "top" && popupHeight > spaceAbove && spaceBelow > spaceAbove) {
          side = "bottom";
        } else if (side === "bottom" && popupHeight > spaceBelow && spaceAbove > spaceBelow) {
          side = "top";
        }
      }
      if (popupWidth > 0 && viewport.width > 0) {
        const spaceLeft = triggerRect.left;
        const spaceRight = viewport.width - triggerRect.right;
        if (side === "left" && popupWidth > spaceLeft && spaceRight > spaceLeft) {
          side = "right";
        } else if (side === "right" && popupWidth > spaceRight && spaceLeft > spaceRight) {
          side = "left";
        }
      }
      if ((side === "top" || side === "bottom") && popupWidth > 0 && viewport.width > 0) {
        const leftAlignedRight = triggerRect.left + popupWidth;
        const rightAlignedLeft = triggerRect.right - popupWidth;
        const centerLeft = triggerRect.left + triggerRect.width / 2 - popupWidth / 2;
        const centerRight = centerLeft + popupWidth;
        if (align === "Left" && leftAlignedRight > viewport.width && rightAlignedLeft >= 0) {
          align = "Right";
        } else if (align === "Right" && rightAlignedLeft < 0 && leftAlignedRight <= viewport.width) {
          align = "Left";
        } else if (align === "" && centerLeft < 0 && leftAlignedRight <= viewport.width) {
          align = "Left";
        } else if (align === "" && centerRight > viewport.width && rightAlignedLeft >= 0) {
          align = "Right";
        }
      }
      if ((side === "left" || side === "right") && popupHeight > 0 && viewport.height > 0) {
        const topAlignedBottom = triggerRect.top + popupHeight;
        const bottomAlignedTop = triggerRect.bottom - popupHeight;
        const centerTop = triggerRect.top + triggerRect.height / 2 - popupHeight / 2;
        const centerBottom = centerTop + popupHeight;
        if (align === "Top" && topAlignedBottom > viewport.height && bottomAlignedTop >= 0) {
          align = "Bottom";
        } else if (align === "Bottom" && bottomAlignedTop < 0 && topAlignedBottom <= viewport.height) {
          align = "Top";
        } else if (align === "" && centerTop < 0 && topAlignedBottom <= viewport.height) {
          align = "Top";
        } else if (align === "" && centerBottom > viewport.height && bottomAlignedTop >= 0) {
          align = "Bottom";
        }
      }
      return createPlacement(side, align);
    };
    const updateEffectivePlacement = () => {
      effectivePlacement.value = resolveAdjustedPlacement();
    };
    const schedulePlacementUpdate = () => {
      if (!visible.value) {
        effectivePlacement.value = props.placement;
        return;
      }
      void nextTick(updateEffectivePlacement);
    };
    watch(
      visible,
      (open) => {
        if (open) {
          hasRenderedPopup.value = true;
          schedulePlacementUpdate();
          return;
        }
        effectivePlacement.value = props.placement;
      },
      { immediate: true }
    );
    watch(
      [() => props.placement, () => props.autoAdjustOverflow, () => props.title],
      () => {
        effectivePlacement.value = props.placement;
        schedulePlacementUpdate();
      }
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
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (openBlock(), createElementBlock("span", {
              key: 0,
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
          ], 38)), [
            [vShow, visible.value]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};
