import { defineComponent, useSlots, ref, computed, h, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createBlock, Teleport, withDirectives, unref, createCommentVNode, createVNode, vShow } from "vue";
import Menu from "../menu/index.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
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
    const arrowRef = ref(null);
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
    const floatingPosition = useFloatingPosition({
      reference: triggerRef,
      floating: overlayRef,
      arrow: arrowRef,
      open: () => shouldRenderOverlay.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      offset: 8,
      autoAdjustOverflow: () => props.autoAdjustOverflow,
      arrowSize: 8
    });
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
      `aheart-floating--${effectivePlacement.value}`,
      `is-${motion.phase.value}`,
      props.overlayClassName,
      resolvedClassNames.value.popup
    ]);
    const overlayStyle = computed(() => [
      floatingPosition.popupStyle.value,
      props.overlayStyle,
      resolvedStyles.value.popup
    ]);
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
    const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow]);
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
    watch(
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
    useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: overlayRef,
      onDismiss: () => setOpen(false, { source: "trigger" })
    });
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
              ref_key: "arrowRef",
              ref: arrowRef,
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
