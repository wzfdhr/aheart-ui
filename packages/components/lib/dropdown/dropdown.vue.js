"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../menu/index.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-expanded", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADropdown"
  },
  __name: "dropdown",
  props: types.dropdownProps,
  emits: types.dropdownEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ADropdownRenderNode",
      props: {
        node: null
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const innerOpen = vue.ref(props.defaultOpen);
    const hasRenderedOverlay = vue.ref(Boolean(props.defaultOpen || props.open));
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const overlayRef = vue.ref(null);
    const effectivePlacement = vue.ref(props.placement);
    let mouseEnterTimer;
    let mouseLeaveTimer;
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = vue.computed(() => new Set(props.trigger));
    const shouldDestroyOnHidden = vue.computed(() => props.destroyOnHidden || props.destroyPopupOnHide);
    const hasMenu = vue.computed(() => {
      var _a, _b;
      return Boolean((_b = (_a = props.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length);
    });
    const hasOverlayContent = vue.computed(() => hasMenu.value || Boolean(slots.popup || props.popupRender || props.dropdownRender));
    const shouldRenderOverlay = vue.computed(
      () => hasOverlayContent.value && (mergedOpen.value || !shouldDestroyOnHidden.value && hasRenderedOverlay.value)
    );
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const semanticInfo = vue.computed(() => ({
      open: mergedOpen.value,
      placement: effectivePlacement.value
    }));
    const resolvedClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const resolvedStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const dropdownClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        "is-open": mergedOpen.value,
        "is-disabled": isDisabled.value
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, resolvedStyles.value.root]);
    const triggerClass = vue.computed(() => resolvedClassNames.value.trigger);
    const triggerStyle = vue.computed(() => resolvedStyles.value.trigger);
    const overlayClass = vue.computed(() => [
      `aheart-dropdown__overlay--${effectivePlacement.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const overlayStyle = vue.computed(() => [props.overlayStyle, resolvedStyles.value.popup]);
    const menuClass = vue.computed(() => resolvedClassNames.value.menu);
    const menuStyle = vue.computed(() => resolvedStyles.value.menu);
    const showArrow = vue.computed(() => props.arrow !== false);
    const arrowPointsAtCenter = vue.computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = vue.computed(() => [
      resolvedClassNames.value.arrow,
      {
        "aheart-dropdown__arrow--point-at-center": arrowPointsAtCenter.value
      }
    ]);
    const arrowStyle = vue.computed(() => resolvedStyles.value.arrow);
    const defaultMenuNode = vue.computed(() => {
      var _a, _b, _c, _d;
      if (!hasMenu.value) {
        return null;
      }
      return vue.h(
        "div",
        {
          class: ["aheart-dropdown__menu", menuClass.value],
          style: menuStyle.value
        },
        [
          vue.h(index.default, {
            items: (_a = props.menu) == null ? void 0 : _a.items,
            selectable: ((_b = props.menu) == null ? void 0 : _b.selectable) ?? false,
            selectedKeys: (_c = props.menu) == null ? void 0 : _c.selectedKeys,
            defaultSelectedKeys: (_d = props.menu) == null ? void 0 : _d.defaultSelectedKeys,
            onClick: handleMenuClick
          })
        ]
      );
    });
    const popupContent = vue.computed(() => {
      const menus = defaultMenuNode.value;
      if (props.popupRender) {
        return props.popupRender(menus);
      }
      if (props.dropdownRender) {
        return props.dropdownRender(menus);
      }
      return menus;
    });
    vue.watch(
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
      void vue.nextTick(updateEffectivePlacement);
    };
    vue.watch(
      mergedOpen,
      (open) => {
        if (open) {
          hasRenderedOverlay.value = true;
          schedulePlacementUpdate();
          return;
        }
        effectivePlacement.value = props.placement;
      },
      { immediate: true }
    );
    vue.watch(
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
    vue.onBeforeUnmount(clearHoverTimers);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-dropdown", dropdownClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: vue.normalizeClass(["aheart-dropdown__trigger", triggerClass.value]),
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": isDisabled.value ? "true" : void 0,
          style: vue.normalizeStyle(triggerStyle.value),
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onContextmenu: handleContextmenu
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 46, _hoisted_1),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          shouldRenderOverlay.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "overlayRef",
            ref: overlayRef,
            class: vue.normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
            style: vue.normalizeStyle(overlayStyle.value),
            role: "presentation",
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(["aheart-dropdown__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.renderSlot(_ctx.$slots, "popup", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: popupContent.value }, null, 8, ["node"])
            ])
          ], 38)), [
            [vue.vShow, mergedOpen.value]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
exports.default = _sfc_main;
