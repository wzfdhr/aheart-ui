"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../skeleton/index.js");
const usePointerDrag = require("../utils/use-pointer-drag.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-hidden"];
const _hoisted_2 = ["aria-label"];
const _hoisted_3 = ["disabled"];
const _hoisted_4 = ["disabled"];
const DRAWER_PUSH_CONTEXT = Symbol("ADrawerPushContext");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: types.drawerProps,
  emits: types.drawerEmits,
  setup(__props, { emit: __emit }) {
    const ADrawerRenderNode = vue.defineComponent({
      name: "ADrawerRenderNode",
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
    const ADrawerRenderWrapper = vue.defineComponent({
      name: "ADrawerRenderWrapper",
      props: {
        renderer: Function
      },
      setup(renderProps, { slots: slots2 }) {
        return () => {
          var _a;
          const node = ((_a = slots2.default) == null ? void 0 : _a.call(slots2)) ?? null;
          return renderProps.renderer ? renderProps.renderer(node) : node;
        };
      }
    });
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const FOCUSABLE_SELECTOR = [
      "a[href]",
      "area[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "iframe",
      "object",
      "embed",
      '[contenteditable="true"]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    const dialogLabel = vue.computed(() => typeof props.title === "string" || typeof props.title === "number" ? String(props.title) : void 0);
    const triggerElement = vue.ref(null);
    const panelRef = vue.ref(null);
    const leaveFocusElement = vue.ref(null);
    const resizedSize = vue.ref();
    const resizeStart = vue.ref(null);
    const parentPushContext = vue.inject(DRAWER_PUSH_CONTEXT, null);
    const drawerId = Symbol("ADrawer");
    const openChildDrawers = vue.ref(/* @__PURE__ */ new Map());
    const setChildOpen = (id, open) => {
      const nextOpenChildren = new Map(openChildDrawers.value);
      if (open) {
        nextOpenChildren.set(id, true);
      } else {
        nextOpenChildren.delete(id);
      }
      openChildDrawers.value = nextOpenChildren;
    };
    vue.provide(DRAWER_PUSH_CONTEXT, { setChildOpen });
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const parseNumericSize = (size) => {
      if (typeof size === "number") {
        return size;
      }
      const match = typeof size === "string" ? size.trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/) : null;
      return match ? Number(match[1]) : void 0;
    };
    const clampResizeSize = (size) => {
      const cappedSize = props.maxSize === void 0 ? size : Math.min(size, props.maxSize);
      return Math.max(0, cappedSize);
    };
    const formatPushDistance = (distance, negative) => {
      if (typeof distance === "number") {
        return `${negative ? "-" : ""}${distance}px`;
      }
      return negative ? `calc(0px - ${distance})` : distance;
    };
    const getDefaultContainer = () => typeof document === "undefined" ? false : document.body;
    const resolvedContainer = vue.computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = vue.computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = vue.computed(() => teleportTarget.value !== false);
    const teleportTo = vue.computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const isVertical = vue.computed(() => props.placement === "top" || props.placement === "bottom");
    const hasOpenChildDrawer = vue.computed(() => openChildDrawers.value.size > 0);
    const pushConfig = vue.computed(() => typeof props.push === "object" && props.push !== null ? props.push : void 0);
    const isPushEnabled = vue.computed(() => props.push !== false);
    const resolvedPushDistance = vue.computed(() => {
      var _a;
      return ((_a = pushConfig.value) == null ? void 0 : _a.distance) ?? 180;
    });
    const pushTransform = vue.computed(() => {
      if (!hasOpenChildDrawer.value || !isPushEnabled.value) {
        return void 0;
      }
      switch (props.placement) {
        case "left":
          return `translateX(${formatPushDistance(resolvedPushDistance.value, false)})`;
        case "top":
          return `translateY(${formatPushDistance(resolvedPushDistance.value, false)})`;
        case "bottom":
          return `translateY(${formatPushDistance(resolvedPushDistance.value, true)})`;
        case "right":
        default:
          return `translateX(${formatPushDistance(resolvedPushDistance.value, true)})`;
      }
    });
    const resizableConfig = vue.computed(
      () => typeof props.resizable === "object" && props.resizable !== null ? props.resizable : void 0
    );
    const isResizable = vue.computed(() => props.resizable === true || resizableConfig.value !== void 0);
    const shouldDestroy = vue.computed(() => props.destroyOnHidden || props.destroyOnClose || props.destroyInactivePanel);
    const motion = useMotionPresence.useMotionPresence(() => props.open, {
      forceRender: () => props.forceRender,
      destroyOnHidden: () => shouldDestroy.value,
      duration: 240
    });
    const shouldRender = motion.isMounted;
    const isRenderableNode = (value) => value !== void 0 && value !== null && value !== false && value !== true && value !== "";
    const isMaskConfig = (value) => typeof value === "object" && value !== null;
    const maskConfig = vue.computed(() => isMaskConfig(props.mask) ? props.mask : void 0);
    const showMask = vue.computed(() => {
      var _a;
      return props.mask !== false && ((_a = maskConfig.value) == null ? void 0 : _a.enabled) !== false;
    });
    const isMaskBlurred = vue.computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.blur) === true;
    });
    const isMaskClosable = vue.computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.closable) ?? props.maskClosable;
    });
    const isClosableConfig = (value) => typeof value === "object" && value !== null;
    const isFocusableConfig = (value) => typeof value === "object" && value !== null;
    const closableConfig = vue.computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const focusableConfig = vue.computed(() => isFocusableConfig(props.focusable) ? props.focusable : void 0);
    const shouldFocusTriggerAfterClose = vue.computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.focusTriggerAfterClose) ?? true;
    });
    const shouldTrapFocus = vue.computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.trap) ?? showMask.value;
    });
    const resolvedCloseIcon = vue.computed(() => {
      var _a;
      if (((_a = closableConfig.value) == null ? void 0 : _a.closeIcon) !== void 0) {
        return closableConfig.value.closeIcon;
      }
      if (props.closeIcon !== void 0) {
        return props.closeIcon;
      }
      return "×";
    });
    const showCloseButton = vue.computed(
      () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
    );
    const isCloseButtonDisabled = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.disabled) === true;
    });
    const closePlacement = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.placement) ?? "start";
    });
    const isCloseAtEnd = vue.computed(() => closePlacement.value === "end");
    const hasTitle = vue.computed(() => Boolean(slots.title) || isRenderableNode(props.title));
    const hasExtra = vue.computed(() => Boolean(slots.extra) || isRenderableNode(props.extra));
    const hasHeader = vue.computed(() => hasTitle.value || hasExtra.value || showCloseButton.value);
    const resolvedSize = vue.computed(() => {
      if (props.size === "large") {
        return 736;
      }
      if (props.size === "default") {
        return 378;
      }
      return props.size;
    });
    const configuredPanelSize = vue.computed(
      () => isVertical.value ? props.height ?? resolvedSize.value : props.width ?? resolvedSize.value
    );
    const currentBaseSize = vue.computed(
      () => parseNumericSize(configuredPanelSize.value) ?? parseNumericSize(resolvedSize.value) ?? 378
    );
    const activePanelSize = vue.computed(() => resizedSize.value ?? currentBaseSize.value);
    const normalizedPanelSize = vue.computed(
      () => resizedSize.value === void 0 ? normalizeSize(configuredPanelSize.value) : `${resizedSize.value}px`
    );
    const panelStyle = vue.computed(() => {
      const style = isVertical.value ? {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle("section"),
        height: normalizedPanelSize.value
      } : {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle("section"),
        width: normalizedPanelSize.value
      };
      if (!pushTransform.value) {
        return style;
      }
      return {
        ...style,
        transform: [style.transform ? String(style.transform) : void 0, pushTransform.value].filter(Boolean).join(" ")
      };
    });
    const rootStyle = vue.computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const mergedMaskStyle = vue.computed(() => ({
      ...props.maskStyle,
      ...semanticStyle("mask")
    }));
    const mergedHeaderStyle = vue.computed(() => ({
      ...props.headerStyle,
      ...semanticStyle("header")
    }));
    const mergedBodyStyle = vue.computed(() => ({
      ...props.bodyStyle,
      ...semanticStyle("body")
    }));
    const mergedFooterStyle = vue.computed(() => ({
      ...props.footerStyle,
      ...semanticStyle("footer")
    }));
    const shouldHideFooter = vue.computed(() => props.footer === false || props.footer === null);
    const shouldRenderFooterProp = vue.computed(() => isRenderableNode(props.footer));
    const hasFooter = vue.computed(
      () => !shouldHideFooter.value && (Boolean(slots.footer) || props.footer === true || shouldRenderFooterProp.value)
    );
    const rootClass = vue.computed(() => ["aheart-drawer", `is-${motion.phase.value}`, props.rootClassName, semanticClass("root")]);
    const maskClass = vue.computed(() => [
      "aheart-drawer__mask",
      { "is-blur": isMaskBlurred.value },
      semanticClass("mask")
    ]);
    const panelClass = vue.computed(() => [
      "aheart-drawer__panel",
      `aheart-drawer__panel--${props.placement}`,
      props.className,
      semanticClass("section")
    ]);
    const headerClass = vue.computed(() => ["aheart-drawer__header", semanticClass("header")]);
    const titleClass = vue.computed(() => ["aheart-drawer__title", semanticClass("title")]);
    const extraClass = vue.computed(() => ["aheart-drawer__extra", semanticClass("extra")]);
    const bodyClass = vue.computed(() => ["aheart-drawer__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = vue.computed(() => ["aheart-drawer__footer", semanticClass("footer")]);
    const draggerClass = vue.computed(() => [
      "aheart-drawer__dragger",
      `aheart-drawer__dragger--${props.placement}`,
      { "is-resizing": resizeStart.value !== null },
      semanticClass("dragger")
    ]);
    const closeClass = vue.computed(() => [
      "aheart-drawer__close",
      { "is-end": isCloseAtEnd.value },
      semanticClass("close")
    ]);
    vue.watch(
      () => props.open,
      (open, previousOpen) => {
        var _a;
        if (open && !previousOpen) {
          leaveFocusElement.value = null;
          if (motion.phase.value === "hidden")
            captureTriggerElement();
        }
        if (!open) {
          const activeElement = document.activeElement;
          leaveFocusElement.value = activeElement instanceof HTMLElement && ((_a = panelRef.value) == null ? void 0 : _a.contains(activeElement)) ? activeElement : null;
          void vue.nextTick(() => {
            if (motion.phase.value === "leave" && leaveFocusElement.value && document.contains(leaveFocusElement.value)) {
              leaveFocusElement.value.focus();
            }
          });
        }
        emit("afterOpenChange", open);
      },
      { flush: "sync" }
    );
    vue.watch(
      () => motion.phase.value,
      (phase) => {
        if (phase === "hidden" && !props.open) {
          void vue.nextTick(() => restoreTriggerFocus());
          leaveFocusElement.value = null;
        }
      }
    );
    vue.watch(
      () => props.open,
      (open) => {
        parentPushContext == null ? void 0 : parentPushContext.setChildOpen(drawerId, open);
      },
      { immediate: true }
    );
    vue.onBeforeUnmount(() => {
      parentPushContext == null ? void 0 : parentPushContext.setChildOpen(drawerId, false);
    });
    const resolveSemanticConfig = (config, part) => {
      const resolved = typeof config === "function" ? config({ props }) : config;
      return resolved == null ? void 0 : resolved[part];
    };
    const semanticClass = (part) => resolveSemanticConfig(props.classNames, part);
    const semanticStyle = (part) => resolveSemanticConfig(props.styles, part);
    const captureTriggerElement = () => {
      triggerElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    };
    const restoreTriggerFocus = () => {
      const target = triggerElement.value;
      if (!shouldFocusTriggerAfterClose.value || !target || !document.contains(target)) {
        return;
      }
      target.focus();
    };
    const isFocusableElementAvailable = (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true" && element.tabIndex >= 0 && !(element instanceof HTMLInputElement && element.type === "hidden");
    const getFocusableElements = () => {
      const panel = panelRef.value;
      if (!panel) {
        return [];
      }
      return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable);
    };
    const handleTrapTab = (event) => {
      if (!props.open || !shouldTrapFocus.value || event.key !== "Tab") {
        return;
      }
      const panel = panelRef.value;
      if (!panel) {
        return;
      }
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0] ?? panel;
      const lastElement = focusableElements[focusableElements.length - 1] ?? panel;
      const activeElement = document.activeElement;
      if (event.shiftKey) {
        if (activeElement === firstElement || !panel.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }
      if (activeElement === lastElement || !panel.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    function getNextResizeSize(event) {
      const start = resizeStart.value;
      if (!start) {
        return activePanelSize.value;
      }
      switch (props.placement) {
        case "left":
          return clampResizeSize(start.size + event.clientX - start.clientX);
        case "top":
          return clampResizeSize(start.size + event.clientY - start.clientY);
        case "bottom":
          return clampResizeSize(start.size + start.clientY - event.clientY);
        case "right":
        default:
          return clampResizeSize(start.size + start.clientX - event.clientX);
      }
    }
    function handleResizeMove(event) {
      var _a, _b;
      if (!resizeStart.value) {
        return;
      }
      event.preventDefault();
      const nextSize = getNextResizeSize(event);
      resizedSize.value = nextSize;
      (_b = (_a = resizableConfig.value) == null ? void 0 : _a.onResize) == null ? void 0 : _b.call(_a, nextSize);
    }
    function handleResizeEnd() {
      var _a, _b;
      if (!resizeStart.value) {
        return;
      }
      resizeStart.value = null;
      (_b = (_a = resizableConfig.value) == null ? void 0 : _a.onResizeEnd) == null ? void 0 : _b.call(_a);
    }
    const { isDragging: isResizing, start: startPointerResize } = usePointerDrag.usePointerDrag({
      cursor: () => props.placement === "top" || props.placement === "bottom" ? "row-resize" : "col-resize",
      onMove: handleResizeMove,
      onEnd: (reason) => {
        if (reason === "end") {
          handleResizeEnd();
        } else {
          resizeStart.value = null;
        }
      }
    });
    function handleResizeStart(event) {
      var _a, _b;
      if (!isResizable.value) {
        return;
      }
      startPointerResize(event);
      if (!isResizing.value) {
        return;
      }
      resizeStart.value = {
        size: activePanelSize.value,
        clientX: event.clientX,
        clientY: event.clientY
      };
      (_b = (_a = resizableConfig.value) == null ? void 0 : _a.onResizeStart) == null ? void 0 : _b.call(_a);
    }
    const close = () => {
      emit("update:open", false);
      emit("close");
    };
    const handleCloseButtonClick = () => {
      if (isCloseButtonDisabled.value) {
        return;
      }
      close();
    };
    const handleMaskClick = () => {
      if (isMaskClosable.value) {
        close();
      }
    };
    const handleKeydown = (event) => {
      handleTrapTab(event);
      if (props.keyboard && event.key === "Escape") {
        close();
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.Teleport, {
        to: teleportTo.value,
        disabled: !shouldTeleport.value
      }, [
        vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(rootClass.value),
          style: vue.normalizeStyle(rootStyle.value),
          role: "presentation",
          "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0,
          tabindex: "-1",
          onKeydown: handleKeydown
        }, [
          showMask.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(maskClass.value),
            style: vue.normalizeStyle(mergedMaskStyle.value),
            onClick: handleMaskClick
          }, null, 6)) : vue.createCommentVNode("", true),
          vue.createVNode(vue.unref(ADrawerRenderWrapper), { renderer: _ctx.drawerRender }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("section", {
                ref_key: "panelRef",
                ref: panelRef,
                class: vue.normalizeClass(panelClass.value),
                style: vue.normalizeStyle(panelStyle.value),
                role: "dialog",
                "aria-modal": "true",
                "aria-label": dialogLabel.value,
                tabindex: "-1"
              }, [
                hasHeader.value ? (vue.openBlock(), vue.createElementBlock("header", {
                  key: 0,
                  class: vue.normalizeClass(headerClass.value),
                  style: vue.normalizeStyle(mergedHeaderStyle.value)
                }, [
                  showCloseButton.value && !isCloseAtEnd.value ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 0,
                    class: vue.normalizeClass(closeClass.value),
                    style: vue.normalizeStyle(semanticStyle("close")),
                    disabled: isCloseButtonDisabled.value,
                    type: "button",
                    "aria-label": "Close",
                    onClick: handleCloseButtonClick
                  }, [
                    vue.createVNode(vue.unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                  ], 14, _hoisted_3)) : vue.createCommentVNode("", true),
                  hasTitle.value ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 1,
                    class: vue.normalizeClass(titleClass.value),
                    style: vue.normalizeStyle(semanticStyle("title"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "title", {}, () => [
                      vue.createVNode(vue.unref(ADrawerRenderNode), { node: _ctx.title }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true),
                  hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 2,
                    class: vue.normalizeClass(extraClass.value),
                    style: vue.normalizeStyle(semanticStyle("extra"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "extra", {}, () => [
                      vue.createVNode(vue.unref(ADrawerRenderNode), { node: _ctx.extra }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true),
                  showCloseButton.value && isCloseAtEnd.value ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 3,
                    class: vue.normalizeClass(closeClass.value),
                    style: vue.normalizeStyle(semanticStyle("close")),
                    disabled: isCloseButtonDisabled.value,
                    type: "button",
                    "aria-label": "Close",
                    onClick: handleCloseButtonClick
                  }, [
                    vue.createVNode(vue.unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                  ], 14, _hoisted_4)) : vue.createCommentVNode("", true)
                ], 6)) : vue.createCommentVNode("", true),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(bodyClass.value),
                  style: vue.normalizeStyle(mergedBodyStyle.value)
                }, [
                  _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
                    key: 0,
                    active: "",
                    paragraph: { rows: 4 }
                  })) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
                ], 6),
                hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", {
                  key: 1,
                  class: vue.normalizeClass(footerClass.value),
                  style: vue.normalizeStyle(mergedFooterStyle.value)
                }, [
                  vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                    shouldRenderFooterProp.value ? (vue.openBlock(), vue.createBlock(vue.unref(ADrawerRenderNode), {
                      key: 0,
                      node: _ctx.footer
                    }, null, 8, ["node"])) : vue.createCommentVNode("", true)
                  ])
                ], 6)) : vue.createCommentVNode("", true),
                isResizable.value ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 2,
                  class: vue.normalizeClass(draggerClass.value),
                  style: vue.normalizeStyle(semanticStyle("dragger")),
                  type: "button",
                  "aria-label": "Resize drawer",
                  onPointerdown: handleResizeStart
                }, null, 38)) : vue.createCommentVNode("", true)
              ], 14, _hoisted_2)
            ]),
            _: 3
          }, 8, ["renderer"])
        ], 46, _hoisted_1)), [
          [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
        ]) : vue.createCommentVNode("", true)
      ], 8, ["to", "disabled"]);
    };
  }
});
exports.default = _sfc_main;
