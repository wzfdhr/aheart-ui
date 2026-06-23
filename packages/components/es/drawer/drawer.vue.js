import { defineComponent, useSlots, ref, computed, watch, nextTick, openBlock, createBlock, Teleport, withDirectives, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createVNode, unref, withCtx, createElementVNode, renderSlot, vShow } from "vue";
import Skeleton from "../skeleton/index.js";
import { drawerProps, drawerEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["disabled"];
const _hoisted_2 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: drawerProps,
  emits: drawerEmits,
  setup(__props, { emit: __emit }) {
    const ADrawerRenderNode = defineComponent({
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
    const ADrawerRenderWrapper = defineComponent({
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
    const slots = useSlots();
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
    const hasRendered = ref(props.open || props.forceRender);
    const triggerElement = ref(null);
    const panelRef = ref(null);
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const getDefaultContainer = () => typeof document === "undefined" ? false : document.body;
    const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = computed(() => teleportTarget.value !== false);
    const teleportTo = computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const isVertical = computed(() => props.placement === "top" || props.placement === "bottom");
    const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value);
    const isRenderableNode = (value) => value !== void 0 && value !== null && value !== false && value !== true && value !== "";
    const isMaskConfig = (value) => typeof value === "object" && value !== null;
    const maskConfig = computed(() => isMaskConfig(props.mask) ? props.mask : void 0);
    const showMask = computed(() => {
      var _a;
      return props.mask !== false && ((_a = maskConfig.value) == null ? void 0 : _a.enabled) !== false;
    });
    const isMaskBlurred = computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.blur) === true;
    });
    const isMaskClosable = computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.closable) ?? props.maskClosable;
    });
    const isClosableConfig = (value) => typeof value === "object" && value !== null;
    const isFocusableConfig = (value) => typeof value === "object" && value !== null;
    const closableConfig = computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const focusableConfig = computed(() => isFocusableConfig(props.focusable) ? props.focusable : void 0);
    const shouldFocusTriggerAfterClose = computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.focusTriggerAfterClose) ?? true;
    });
    const shouldTrapFocus = computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.trap) ?? showMask.value;
    });
    const resolvedCloseIcon = computed(() => {
      var _a;
      if (((_a = closableConfig.value) == null ? void 0 : _a.closeIcon) !== void 0) {
        return closableConfig.value.closeIcon;
      }
      if (props.closeIcon !== void 0) {
        return props.closeIcon;
      }
      return "×";
    });
    const showCloseButton = computed(
      () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
    );
    const isCloseButtonDisabled = computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.disabled) === true;
    });
    const closePlacement = computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.placement) ?? "start";
    });
    const isCloseAtEnd = computed(() => closePlacement.value === "end");
    const hasTitle = computed(() => Boolean(slots.title) || isRenderableNode(props.title));
    const hasExtra = computed(() => Boolean(slots.extra) || isRenderableNode(props.extra));
    const hasHeader = computed(() => hasTitle.value || hasExtra.value || showCloseButton.value);
    const resolvedSize = computed(() => {
      if (props.size === "large") {
        return 736;
      }
      if (props.size === "default") {
        return 378;
      }
      return props.size;
    });
    const panelStyle = computed(
      () => isVertical.value ? {
        ...props.style,
        ...semanticStyle("section"),
        height: normalizeSize(props.height ?? resolvedSize.value)
      } : {
        ...props.style,
        ...semanticStyle("section"),
        width: normalizeSize(props.width ?? resolvedSize.value)
      }
    );
    const rootStyle = computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const maskStyle = computed(() => semanticStyle("mask"));
    const shouldHideFooter = computed(() => props.footer === false || props.footer === null);
    const shouldRenderFooterProp = computed(() => isRenderableNode(props.footer));
    const hasFooter = computed(
      () => !shouldHideFooter.value && (Boolean(slots.footer) || props.footer === true || shouldRenderFooterProp.value)
    );
    const rootClass = computed(() => ["aheart-drawer", props.rootClassName, semanticClass("root")]);
    const maskClass = computed(() => [
      "aheart-drawer__mask",
      { "is-blur": isMaskBlurred.value },
      semanticClass("mask")
    ]);
    const panelClass = computed(() => [
      "aheart-drawer__panel",
      `aheart-drawer__panel--${props.placement}`,
      props.className,
      semanticClass("section")
    ]);
    const headerClass = computed(() => ["aheart-drawer__header", semanticClass("header")]);
    const titleClass = computed(() => ["aheart-drawer__title", semanticClass("title")]);
    const extraClass = computed(() => ["aheart-drawer__extra", semanticClass("extra")]);
    const bodyClass = computed(() => ["aheart-drawer__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = computed(() => ["aheart-drawer__footer", semanticClass("footer")]);
    const closeClass = computed(() => [
      "aheart-drawer__close",
      { "is-end": isCloseAtEnd.value },
      semanticClass("close")
    ]);
    watch(
      () => props.open,
      (open, previousOpen) => {
        if (open && !previousOpen) {
          captureTriggerElement();
        }
        if (open) {
          hasRendered.value = true;
        } else if (shouldDestroy.value && !props.forceRender) {
          hasRendered.value = false;
        }
        emit("afterOpenChange", open);
        if (!open) {
          void nextTick(() => restoreTriggerFocus());
        }
      }
    );
    watch(
      () => props.forceRender,
      (forceRender) => {
        if (forceRender) {
          hasRendered.value = true;
        }
      }
    );
    const semanticClass = (part) => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a[part];
    };
    const semanticStyle = (part) => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a[part];
    };
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
      return openBlock(), createBlock(Teleport, {
        to: teleportTo.value,
        disabled: !shouldTeleport.value
      }, [
        shouldRender.value ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(rootClass.value),
          style: normalizeStyle(rootStyle.value),
          role: "presentation",
          tabindex: "-1",
          onKeydown: handleKeydown
        }, [
          showMask.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(maskClass.value),
            style: normalizeStyle(maskStyle.value),
            onClick: handleMaskClick
          }, null, 6)) : createCommentVNode("", true),
          createVNode(unref(ADrawerRenderWrapper), { renderer: _ctx.drawerRender }, {
            default: withCtx(() => [
              createElementVNode("section", {
                ref_key: "panelRef",
                ref: panelRef,
                class: normalizeClass(panelClass.value),
                style: normalizeStyle(panelStyle.value),
                role: "dialog",
                "aria-modal": "true",
                tabindex: "-1"
              }, [
                hasHeader.value ? (openBlock(), createElementBlock("header", {
                  key: 0,
                  class: normalizeClass(headerClass.value),
                  style: normalizeStyle(semanticStyle("header"))
                }, [
                  showCloseButton.value && !isCloseAtEnd.value ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    class: normalizeClass(closeClass.value),
                    style: normalizeStyle(semanticStyle("close")),
                    disabled: isCloseButtonDisabled.value,
                    type: "button",
                    "aria-label": "Close",
                    onClick: handleCloseButtonClick
                  }, [
                    createVNode(unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                  ], 14, _hoisted_1)) : createCommentVNode("", true),
                  hasTitle.value ? (openBlock(), createElementBlock("div", {
                    key: 1,
                    class: normalizeClass(titleClass.value),
                    style: normalizeStyle(semanticStyle("title"))
                  }, [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      createVNode(unref(ADrawerRenderNode), { node: _ctx.title }, null, 8, ["node"])
                    ])
                  ], 6)) : createCommentVNode("", true),
                  hasExtra.value ? (openBlock(), createElementBlock("div", {
                    key: 2,
                    class: normalizeClass(extraClass.value),
                    style: normalizeStyle(semanticStyle("extra"))
                  }, [
                    renderSlot(_ctx.$slots, "extra", {}, () => [
                      createVNode(unref(ADrawerRenderNode), { node: _ctx.extra }, null, 8, ["node"])
                    ])
                  ], 6)) : createCommentVNode("", true),
                  showCloseButton.value && isCloseAtEnd.value ? (openBlock(), createElementBlock("button", {
                    key: 3,
                    class: normalizeClass(closeClass.value),
                    style: normalizeStyle(semanticStyle("close")),
                    disabled: isCloseButtonDisabled.value,
                    type: "button",
                    "aria-label": "Close",
                    onClick: handleCloseButtonClick
                  }, [
                    createVNode(unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                  ], 14, _hoisted_2)) : createCommentVNode("", true)
                ], 6)) : createCommentVNode("", true),
                createElementVNode("div", {
                  class: normalizeClass(bodyClass.value),
                  style: normalizeStyle(semanticStyle("body"))
                }, [
                  _ctx.loading ? (openBlock(), createBlock(unref(Skeleton), {
                    key: 0,
                    active: "",
                    paragraph: { rows: 4 }
                  })) : renderSlot(_ctx.$slots, "default", { key: 1 })
                ], 6),
                hasFooter.value ? (openBlock(), createElementBlock("footer", {
                  key: 1,
                  class: normalizeClass(footerClass.value),
                  style: normalizeStyle(semanticStyle("footer"))
                }, [
                  renderSlot(_ctx.$slots, "footer", {}, () => [
                    shouldRenderFooterProp.value ? (openBlock(), createBlock(unref(ADrawerRenderNode), {
                      key: 0,
                      node: _ctx.footer
                    }, null, 8, ["node"])) : createCommentVNode("", true)
                  ])
                ], 6)) : createCommentVNode("", true)
              ], 6)
            ]),
            _: 3
          }, 8, ["renderer"])
        ], 38)), [
          [vShow, _ctx.open]
        ]) : createCommentVNode("", true)
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
