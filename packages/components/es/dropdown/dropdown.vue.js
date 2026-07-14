import { defineComponent, useSlots, ref, computed, h, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, Teleport, withDirectives, unref, createCommentVNode, createVNode, vShow, nextTick } from "vue";
import Menu from "../menu/index.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { dropdownProps, dropdownEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["aria-expanded", "aria-disabled"];
const _hoisted_2 = ["aria-hidden"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADropdown"
  },
  __name: "dropdown",
  props: dropdownProps,
  emits: dropdownEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const slots = useSlots();
    const ARenderNode = defineComponent({
      name: "ADropdownRenderNode",
      props: {
        node: null
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const innerOpen = ref(props.defaultOpen);
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const overlayRef = ref(null);
    const effectivePlacement = ref(props.placement);
    let mouseEnterTimer;
    let mouseLeaveTimer;
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = computed(() => new Set(props.trigger));
    const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyPopupOnHide);
    const hasMenu = computed(() => {
      var _a, _b;
      return Boolean((_b = (_a = props.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length);
    });
    const hasOverlayContent = computed(() => hasMenu.value || Boolean(slots.popup || props.popupRender || props.dropdownRender));
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderOverlay = computed(() => hasOverlayContent.value && motion.isMounted.value);
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const semanticInfo = computed(() => ({
      open: mergedOpen.value,
      placement: effectivePlacement.value
    }));
    const resolvedClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const resolvedStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const dropdownClass = computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": mergedOpen.value,
        "is-disabled": isDisabled.value
      }
    ]);
    const rootStyle = computed(() => [props.style, resolvedStyles.value.root]);
    const triggerClass = computed(() => resolvedClassNames.value.trigger);
    const triggerStyle = computed(() => resolvedStyles.value.trigger);
    const overlayClass = computed(() => [
      `aheart-dropdown__overlay--${effectivePlacement.value}`,
      `is-${motion.phase.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const overlayStyle = computed(() => [props.overlayStyle, resolvedStyles.value.popup]);
    const menuClass = computed(() => resolvedClassNames.value.menu);
    const menuStyle = computed(() => resolvedStyles.value.menu);
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-dropdown__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = computed(() => resolvedStyles.value.arrow);
    const defaultMenuNode = computed(() => {
      var _a, _b, _c, _d;
      if (!hasMenu.value) {
        return null;
      }
      return h(
        "div",
        {
          class: ["aheart-dropdown__menu", menuClass.value],
          style: menuStyle.value
        },
        [
          h(Menu, {
            items: (_a = props.menu) == null ? void 0 : _a.items,
            selectable: ((_b = props.menu) == null ? void 0 : _b.selectable) ?? false,
            selectedKeys: (_c = props.menu) == null ? void 0 : _c.selectedKeys,
            defaultSelectedKeys: (_d = props.menu) == null ? void 0 : _d.defaultSelectedKeys,
            onClick: handleMenuClick
          })
        ]
      );
    });
    const popupContent = computed(() => {
      const menus = defaultMenuNode.value;
      if (props.popupRender) {
        return props.popupRender(menus);
      }
      if (props.dropdownRender) {
        return props.dropdownRender(menus);
      }
      return menus;
    });
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
      if (!props.autoAdjustOverflow || !triggerRef.value || !overlayRef.value) {
        return props.placement;
      }
      const triggerRect = triggerRef.value.getBoundingClientRect();
      const overlayRect = overlayRef.value.getBoundingClientRect();
      const viewport = getViewportSize();
      let side = getPlacementSide(props.placement);
      let align = getPlacementAlign(props.placement);
      const overlayHeight = overlayRect.height;
      const overlayWidth = overlayRect.width;
      if (overlayHeight > 0 && viewport.height > 0) {
        const spaceAbove = triggerRect.top;
        const spaceBelow = viewport.height - triggerRect.bottom;
        if (side === "bottom" && overlayHeight > spaceBelow && spaceAbove > spaceBelow) {
          side = "top";
        } else if (side === "top" && overlayHeight > spaceAbove && spaceBelow > spaceAbove) {
          side = "bottom";
        }
      }
      if (overlayWidth > 0 && viewport.width > 0) {
        const spaceLeft = triggerRect.left;
        const spaceRight = viewport.width - triggerRect.right;
        if (side === "left" && overlayWidth > spaceLeft && spaceRight > spaceLeft) {
          side = "right";
        } else if (side === "right" && overlayWidth > spaceRight && spaceLeft > spaceRight) {
          side = "left";
        }
      }
      if ((side === "top" || side === "bottom") && overlayWidth > 0 && viewport.width > 0) {
        const leftAlignedRight = triggerRect.left + overlayWidth;
        const rightAlignedLeft = triggerRect.right - overlayWidth;
        const centerLeft = triggerRect.left + triggerRect.width / 2 - overlayWidth / 2;
        const centerRight = centerLeft + overlayWidth;
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
      if ((side === "left" || side === "right") && overlayHeight > 0 && viewport.height > 0) {
        const topAlignedBottom = triggerRect.top + overlayHeight;
        const bottomAlignedTop = triggerRect.bottom - overlayHeight;
        const centerTop = triggerRect.top + triggerRect.height / 2 - overlayHeight / 2;
        const centerBottom = centerTop + overlayHeight;
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
      if (!mergedOpen.value) {
        effectivePlacement.value = props.placement;
        return;
      }
      void nextTick(updateEffectivePlacement);
    };
    watch(
      mergedOpen,
      (open) => {
        if (open) {
          schedulePlacementUpdate();
          return;
        }
        effectivePlacement.value = props.placement;
      },
      { immediate: true }
    );
    watch(
      [() => props.placement, () => props.autoAdjustOverflow],
      () => {
        effectivePlacement.value = props.placement;
        schedulePlacementUpdate();
      }
    );
    const setOpen = (open, options = {}) => {
      if (isDisabled.value) {
        return;
      }
      const { source = "trigger", emitOpenChange = true } = options;
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      if (emitOpenChange) {
        emit("openChange", open, { source });
      }
    };
    const containsRelatedTarget = (event, element) => event.relatedTarget instanceof Node && Boolean(element == null ? void 0 : element.contains(event.relatedTarget));
    const isHoveringTriggerOrOverlay = (event) => containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, overlayRef.value);
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
    const setOpenWithHoverDelay = (open, delay) => {
      const timerDelay = delayToMs(delay);
      if (timerDelay === 0) {
        setOpen(open, { source: "trigger" });
        return;
      }
      const timer = setTimeout(() => {
        if (open) {
          mouseEnterTimer = void 0;
        } else {
          mouseLeaveTimer = void 0;
        }
        setOpen(open, { source: "trigger" });
      }, timerDelay);
      if (open) {
        mouseEnterTimer = timer;
      } else {
        mouseLeaveTimer = timer;
      }
    };
    const handleTriggerClick = () => {
      if (!triggerSet.value.has("click")) {
        return;
      }
      setOpen(!mergedOpen.value, { source: "trigger" });
    };
    const handleMouseEnter = () => {
      if (triggerSet.value.has("hover")) {
        clearMouseLeaveTimer();
        clearMouseEnterTimer();
        setOpenWithHoverDelay(true, props.mouseEnterDelay);
      }
    };
    const handleMouseLeave = (event) => {
      if (triggerSet.value.has("hover") && !isHoveringTriggerOrOverlay(event)) {
        clearMouseEnterTimer();
        clearMouseLeaveTimer();
        setOpenWithHoverDelay(false, props.mouseLeaveDelay);
      }
    };
    const handleContextmenu = (event) => {
      if (triggerSet.value.has("contextMenu")) {
        event.preventDefault();
        setOpen(true, { source: "trigger" });
      }
    };
    const handleMenuClick = (info) => {
      var _a;
      emit("click", info);
      if (((_a = props.menu) == null ? void 0 : _a.closeOnClick) === false) {
        return;
      }
      setOpen(false, { source: "menu", emitOpenChange: false });
    };
    onBeforeUnmount(clearHoverTimers);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-dropdown", dropdownClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: normalizeClass(["aheart-dropdown__trigger", triggerClass.value]),
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": isDisabled.value ? "true" : void 0,
          style: normalizeStyle(triggerStyle.value),
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 46, _hoisted_1),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          shouldRenderOverlay.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "overlayRef",
            ref: overlayRef,
            class: normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
            style: normalizeStyle(overlayStyle.value),
            role: "presentation",
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (openBlock(), createElementBlock("span", {
              key: 0,
              class: normalizeClass(["aheart-dropdown__arrow", arrowClass.value]),
              style: normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "popup", {}, () => [
              createVNode(unref(ARenderNode), { node: popupContent.value }, null, 8, ["node"])
            ])
          ], 46, _hoisted_2)), [
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
