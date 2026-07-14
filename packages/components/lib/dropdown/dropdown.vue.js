"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../menu/index.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-expanded", "aria-disabled"];
const _hoisted_2 = ["aria-hidden"];
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
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const overlayRef = vue.ref(null);
    const arrowRef = vue.ref(null);
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
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 });
    const shouldRenderOverlay = vue.computed(() => hasOverlayContent.value && motion.isMounted.value);
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
      floating: overlayRef,
      arrow: arrowRef,
      open: () => shouldRenderOverlay.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      offset: 8,
      autoAdjustOverflow: () => props.autoAdjustOverflow,
      arrowSize: 8
    });
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
      `aheart-floating--${effectivePlacement.value}`,
      `is-${motion.phase.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const overlayStyle = vue.computed(() => [
      floatingPosition.popupStyle.value,
      props.overlayStyle,
      resolvedStyles.value.popup
    ]);
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
    const arrowStyle = vue.computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
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
    vue.watch(
      () => floatingPosition.placement.value,
      (placement) => {
        effectivePlacement.value = placement;
      },
      { immediate: true }
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
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: overlayRef,
      onDismiss: () => setOpen(false, { source: "trigger" })
    });
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
            "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              ref_key: "arrowRef",
              ref: arrowRef,
              class: vue.normalizeClass(["aheart-dropdown__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.renderSlot(_ctx.$slots, "popup", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: popupContent.value }, null, 8, ["node"])
            ])
          ], 46, _hoisted_2)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
exports.default = _sfc_main;
