"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index$1 = require("../button/index.js");
const index = require("../skeleton/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AModal"
  },
  __name: "modal",
  props: types.modalProps,
  emits: types.modalEmits,
  setup(__props, { emit: __emit }) {
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
    const modalWidthBreakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
    const hasRendered = vue.ref(props.open || props.forceRender);
    const triggerElement = vue.ref(null);
    const dialogRef = vue.ref(null);
    const AModalRenderNode = vue.defineComponent({
      name: "AModalRenderNode",
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
    const AModalRenderWrapper = vue.defineComponent({
      name: "AModalRenderWrapper",
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
    const isClosableConfig = (value) => typeof value === "object" && value !== null;
    const isMaskConfig = (value) => typeof value === "object" && value !== null;
    const isFocusableConfig = (value) => typeof value === "object" && value !== null;
    const hasRenderable = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== void 0 && value !== null && value !== false && value !== true && value !== "";
    };
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const isResponsiveWidth = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
    const getDefaultContainer = () => typeof document === "undefined" ? false : document.body;
    const resolvedContainer = vue.computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = vue.computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = vue.computed(() => teleportTarget.value !== false);
    const teleportTo = vue.computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const fixedDialogWidth = vue.computed(() => {
      const width = props.width;
      return isResponsiveWidth(width) ? void 0 : normalizeSize(width);
    });
    const responsiveWidthVars = vue.computed(() => {
      const width = props.width;
      if (!isResponsiveWidth(width)) {
        return {};
      }
      const style = {};
      modalWidthBreakpoints.forEach((breakpoint) => {
        const breakpointWidth = width[breakpoint];
        if (breakpointWidth !== void 0 && breakpointWidth !== null) {
          style[`--aheart-modal-${breakpoint}-width`] = normalizeSize(breakpointWidth);
        }
      });
      return style;
    });
    const shouldDestroy = vue.computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = vue.computed(() => props.open || props.forceRender || hasRendered.value);
    const dialogStyle = vue.computed(() => ({
      ...props.style,
      ...responsiveWidthVars.value,
      ...semanticStyles("dialog", "container"),
      width: fixedDialogWidth.value
    }));
    const rootStyle = vue.computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const hasTitle = vue.computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasHeader = vue.computed(() => hasTitle.value || showCloseButton.value);
    const hasFooter = vue.computed(
      () => !props.loading && (Boolean(slots.footer) || props.footer !== false && props.footer !== null)
    );
    const rootClass = vue.computed(() => ["aheart-modal", props.rootClassName, semanticClass("root")]);
    const maskConfig = vue.computed(() => isMaskConfig(props.mask) ? props.mask : void 0);
    const isMaskVisible = vue.computed(() => {
      var _a;
      return props.mask === false ? false : ((_a = maskConfig.value) == null ? void 0 : _a.enabled) !== false;
    });
    const isMaskBlurred = vue.computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.blur) === true;
    });
    const isMaskClosable = vue.computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.closable) ?? props.maskClosable;
    });
    const maskClass = vue.computed(() => [
      "aheart-modal__mask",
      {
        "is-blur": isMaskBlurred.value
      },
      semanticClass("mask")
    ]);
    const wrapClass = vue.computed(() => ["aheart-modal__wrap", props.wrapClassName, semanticClasses("wrap", "wrapper")]);
    const wrapStyle = vue.computed(() => semanticStyles("wrap", "wrapper"));
    const dialogClass = vue.computed(() => [
      "aheart-modal__dialog",
      {
        "is-centered": props.centered
      },
      props.className,
      semanticClasses("dialog", "container")
    ]);
    const headerClass = vue.computed(() => ["aheart-modal__header", semanticClass("header")]);
    const titleClass = vue.computed(() => ["aheart-modal__title", semanticClass("title")]);
    const bodyClass = vue.computed(() => ["aheart-modal__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = vue.computed(() => ["aheart-modal__footer", semanticClass("footer")]);
    const closeClass = vue.computed(() => ["aheart-modal__close", semanticClass("close")]);
    const closableConfig = vue.computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const focusableConfig = vue.computed(() => isFocusableConfig(props.focusable) ? props.focusable : void 0);
    const shouldFocusTriggerAfterClose = vue.computed(
      () => {
        var _a;
        return ((_a = focusableConfig.value) == null ? void 0 : _a.focusTriggerAfterClose) ?? props.focusTriggerAfterClose ?? true;
      }
    );
    const shouldTrapFocus = vue.computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.trap) ?? isMaskVisible.value;
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
    const resolvedCancelButtonProps = vue.computed(() => props.cancelButtonProps ?? {});
    const resolvedOkButtonProps = vue.computed(() => {
      var _a, _b;
      return {
        ...props.okButtonProps,
        type: ((_a = props.okButtonProps) == null ? void 0 : _a.type) ?? props.okType,
        loading: props.confirmLoading || Boolean((_b = props.okButtonProps) == null ? void 0 : _b.loading)
      };
    });
    const createFooterButton = (className, buttonProps, onClick, content) => {
      const { class: customClass, ...restButtonProps } = buttonProps;
      return vue.h(
        index$1.default,
        {
          ...restButtonProps,
          class: [className, customClass],
          onClick
        },
        () => content
      );
    };
    const cancelButtonNode = vue.computed(
      () => createFooterButton("aheart-modal__cancel", resolvedCancelButtonProps.value, handleCancel, props.cancelText)
    );
    const okButtonNode = vue.computed(
      () => createFooterButton("aheart-modal__ok", resolvedOkButtonProps.value, handleOk, props.okText)
    );
    const defaultFooterNode = vue.computed(() => [cancelButtonNode.value, okButtonNode.value]);
    const footerRenderExtra = vue.computed(() => ({
      okButton: okButtonNode.value,
      cancelButton: cancelButtonNode.value,
      OkBtn: () => okButtonNode.value,
      CancelBtn: () => cancelButtonNode.value
    }));
    const footerContent = vue.computed(() => {
      if (typeof props.footer === "function") {
        return props.footer(defaultFooterNode.value, footerRenderExtra.value);
      }
      if (props.footer === true) {
        return defaultFooterNode.value;
      }
      return props.footer;
    });
    vue.watch(
      () => props.open,
      (open, previousOpen) => {
        var _a, _b;
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
          emit("afterClose");
          (_b = (_a = closableConfig.value) == null ? void 0 : _a.afterClose) == null ? void 0 : _b.call(_a);
          void vue.nextTick(() => restoreTriggerFocus());
        }
      }
    );
    vue.watch(
      () => props.forceRender,
      (forceRender) => {
        if (forceRender) {
          hasRendered.value = true;
        }
      }
    );
    const resolveSemanticConfig = (config, part) => {
      const resolved = typeof config === "function" ? config({ props }) : config;
      return resolved == null ? void 0 : resolved[part];
    };
    const semanticClass = (part) => resolveSemanticConfig(props.classNames, part);
    const semanticStyle = (part) => resolveSemanticConfig(props.styles, part);
    const semanticClasses = (...parts) => parts.map((part) => semanticClass(part));
    const semanticStyles = (...parts) => {
      const merged = parts.reduce(
        (styles, part) => ({
          ...styles,
          ...semanticStyle(part)
        }),
        {}
      );
      return Object.keys(merged).length > 0 ? merged : void 0;
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
      const dialog = dialogRef.value;
      if (!dialog) {
        return [];
      }
      return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable);
    };
    const handleTrapTab = (event) => {
      if (!props.open || !shouldTrapFocus.value || event.key !== "Tab") {
        return;
      }
      const dialog = dialogRef.value;
      if (!dialog) {
        return;
      }
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0] ?? dialog;
      const lastElement = focusableElements[focusableElements.length - 1] ?? dialog;
      const activeElement = document.activeElement;
      if (event.shiftKey) {
        if (activeElement === firstElement || !dialog.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }
      if (activeElement === lastElement || !dialog.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    const notifyClosableClose = () => {
      var _a, _b;
      (_b = (_a = closableConfig.value) == null ? void 0 : _a.onClose) == null ? void 0 : _b.call(_a);
    };
    const close = () => {
      notifyClosableClose();
      emit("update:open", false);
      emit("close");
    };
    const handleCloseButtonClick = () => {
      if (isCloseButtonDisabled.value) {
        return;
      }
      close();
    };
    const handleOk = () => {
      emit("ok");
    };
    const handleCancel = () => {
      emit("cancel");
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
        shouldRender.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(rootClass.value),
          style: vue.normalizeStyle(rootStyle.value),
          role: "presentation",
          tabindex: "-1",
          onKeydown: handleKeydown
        }, [
          isMaskVisible.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(maskClass.value),
            style: vue.normalizeStyle(semanticStyle("mask")),
            onClick: handleMaskClick
          }, null, 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(wrapClass.value),
            style: vue.normalizeStyle(wrapStyle.value)
          }, [
            vue.createVNode(vue.unref(AModalRenderWrapper), { renderer: _ctx.modalRender }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("section", {
                  ref_key: "dialogRef",
                  ref: dialogRef,
                  class: vue.normalizeClass(dialogClass.value),
                  style: vue.normalizeStyle(dialogStyle.value),
                  role: "dialog",
                  "aria-modal": "true",
                  tabindex: "-1"
                }, [
                  hasHeader.value ? (vue.openBlock(), vue.createElementBlock("header", {
                    key: 0,
                    class: vue.normalizeClass(headerClass.value),
                    style: vue.normalizeStyle(semanticStyle("header"))
                  }, [
                    hasTitle.value ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: vue.normalizeClass(titleClass.value),
                      style: vue.normalizeStyle(semanticStyle("title"))
                    }, [
                      vue.renderSlot(_ctx.$slots, "title", {}, () => [
                        vue.createVNode(vue.unref(AModalRenderNode), { node: _ctx.title }, null, 8, ["node"])
                      ])
                    ], 6)) : vue.createCommentVNode("", true),
                    showCloseButton.value ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      class: vue.normalizeClass(closeClass.value),
                      style: vue.normalizeStyle(semanticStyle("close")),
                      disabled: isCloseButtonDisabled.value,
                      type: "button",
                      "aria-label": "Close",
                      onClick: handleCloseButtonClick
                    }, [
                      vue.createVNode(vue.unref(AModalRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                    ], 14, _hoisted_1)) : vue.createCommentVNode("", true)
                  ], 6)) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(bodyClass.value),
                    style: vue.normalizeStyle(semanticStyle("body"))
                  }, [
                    _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
                      key: 0,
                      active: "",
                      paragraph: { rows: 3 }
                    })) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
                  ], 6),
                  hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", {
                    key: 1,
                    class: vue.normalizeClass(footerClass.value),
                    style: vue.normalizeStyle(semanticStyle("footer"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                      vue.createVNode(vue.unref(AModalRenderNode), { node: footerContent.value }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true)
                ], 6)
              ]),
              _: 3
            }, 8, ["renderer"])
          ], 6)
        ], 38)), [
          [vue.vShow, _ctx.open]
        ]) : vue.createCommentVNode("", true)
      ], 8, ["to", "disabled"]);
    };
  }
});
exports.default = _sfc_main;
