import { defineComponent, useSlots, ref, computed, watch, nextTick, openBlock, createBlock, Teleport, withDirectives, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createElementVNode, createVNode, unref, withCtx, renderSlot, vShow, h } from "vue";
import Button from "../button/index.js";
import Skeleton from "../skeleton/index.js";
import { modalProps, modalEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AModal"
  },
  __name: "modal",
  props: modalProps,
  emits: modalEmits,
  setup(__props, { emit: __emit }) {
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
    const modalWidthBreakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
    const hasRendered = ref(props.open || props.forceRender);
    const triggerElement = ref(null);
    const dialogRef = ref(null);
    const AModalRenderNode = defineComponent({
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
    const AModalRenderWrapper = defineComponent({
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
    const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = computed(() => teleportTarget.value !== false);
    const teleportTo = computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const fixedDialogWidth = computed(() => {
      const width = props.width;
      return isResponsiveWidth(width) ? void 0 : normalizeSize(width);
    });
    const responsiveWidthVars = computed(() => {
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
    const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value);
    const dialogStyle = computed(() => ({
      ...props.style,
      ...responsiveWidthVars.value,
      ...semanticStyles("dialog", "container"),
      width: fixedDialogWidth.value
    }));
    const rootStyle = computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasHeader = computed(() => hasTitle.value || showCloseButton.value);
    const hasFooter = computed(
      () => !props.loading && (Boolean(slots.footer) || props.footer !== false && props.footer !== null)
    );
    const rootClass = computed(() => ["aheart-modal", props.rootClassName, semanticClass("root")]);
    const maskConfig = computed(() => isMaskConfig(props.mask) ? props.mask : void 0);
    const isMaskVisible = computed(() => {
      var _a;
      return props.mask === false ? false : ((_a = maskConfig.value) == null ? void 0 : _a.enabled) !== false;
    });
    const isMaskBlurred = computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.blur) === true;
    });
    const isMaskClosable = computed(() => {
      var _a;
      return ((_a = maskConfig.value) == null ? void 0 : _a.closable) ?? props.maskClosable;
    });
    const maskClass = computed(() => [
      "aheart-modal__mask",
      {
        "is-blur": isMaskBlurred.value
      },
      semanticClass("mask")
    ]);
    const wrapClass = computed(() => ["aheart-modal__wrap", props.wrapClassName, semanticClasses("wrap", "wrapper")]);
    const wrapStyle = computed(() => semanticStyles("wrap", "wrapper"));
    const dialogClass = computed(() => [
      "aheart-modal__dialog",
      {
        "is-centered": props.centered
      },
      props.className,
      semanticClasses("dialog", "container")
    ]);
    const headerClass = computed(() => ["aheart-modal__header", semanticClass("header")]);
    const titleClass = computed(() => ["aheart-modal__title", semanticClass("title")]);
    const bodyClass = computed(() => ["aheart-modal__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = computed(() => ["aheart-modal__footer", semanticClass("footer")]);
    const closeClass = computed(() => ["aheart-modal__close", semanticClass("close")]);
    const closableConfig = computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const focusableConfig = computed(() => isFocusableConfig(props.focusable) ? props.focusable : void 0);
    const shouldFocusTriggerAfterClose = computed(
      () => {
        var _a;
        return ((_a = focusableConfig.value) == null ? void 0 : _a.focusTriggerAfterClose) ?? props.focusTriggerAfterClose ?? true;
      }
    );
    const shouldTrapFocus = computed(() => {
      var _a;
      return ((_a = focusableConfig.value) == null ? void 0 : _a.trap) ?? isMaskVisible.value;
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
    const resolvedCancelButtonProps = computed(() => props.cancelButtonProps ?? {});
    const resolvedOkButtonProps = computed(() => {
      var _a, _b;
      return {
        ...props.okButtonProps,
        type: ((_a = props.okButtonProps) == null ? void 0 : _a.type) ?? props.okType,
        loading: props.confirmLoading || Boolean((_b = props.okButtonProps) == null ? void 0 : _b.loading)
      };
    });
    const createFooterButton = (className, buttonProps, onClick, content) => {
      const { class: customClass, ...restButtonProps } = buttonProps;
      return h(
        Button,
        {
          ...restButtonProps,
          class: [className, customClass],
          onClick
        },
        () => content
      );
    };
    const cancelButtonNode = computed(
      () => createFooterButton("aheart-modal__cancel", resolvedCancelButtonProps.value, handleCancel, props.cancelText)
    );
    const okButtonNode = computed(
      () => createFooterButton("aheart-modal__ok", resolvedOkButtonProps.value, handleOk, props.okText)
    );
    const defaultFooterNode = computed(() => [cancelButtonNode.value, okButtonNode.value]);
    const footerRenderExtra = computed(() => ({
      okButton: okButtonNode.value,
      cancelButton: cancelButtonNode.value,
      OkBtn: () => okButtonNode.value,
      CancelBtn: () => cancelButtonNode.value
    }));
    const footerContent = computed(() => {
      if (typeof props.footer === "function") {
        return props.footer(defaultFooterNode.value, footerRenderExtra.value);
      }
      if (props.footer === true) {
        return defaultFooterNode.value;
      }
      return props.footer;
    });
    watch(
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
          isMaskVisible.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(maskClass.value),
            style: normalizeStyle(semanticStyle("mask")),
            onClick: handleMaskClick
          }, null, 6)) : createCommentVNode("", true),
          createElementVNode("div", {
            class: normalizeClass(wrapClass.value),
            style: normalizeStyle(wrapStyle.value)
          }, [
            createVNode(unref(AModalRenderWrapper), { renderer: _ctx.modalRender }, {
              default: withCtx(() => [
                createElementVNode("section", {
                  ref_key: "dialogRef",
                  ref: dialogRef,
                  class: normalizeClass(dialogClass.value),
                  style: normalizeStyle(dialogStyle.value),
                  role: "dialog",
                  "aria-modal": "true",
                  tabindex: "-1"
                }, [
                  hasHeader.value ? (openBlock(), createElementBlock("header", {
                    key: 0,
                    class: normalizeClass(headerClass.value),
                    style: normalizeStyle(semanticStyle("header"))
                  }, [
                    hasTitle.value ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: normalizeClass(titleClass.value),
                      style: normalizeStyle(semanticStyle("title"))
                    }, [
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        createVNode(unref(AModalRenderNode), { node: _ctx.title }, null, 8, ["node"])
                      ])
                    ], 6)) : createCommentVNode("", true),
                    showCloseButton.value ? (openBlock(), createElementBlock("button", {
                      key: 1,
                      class: normalizeClass(closeClass.value),
                      style: normalizeStyle(semanticStyle("close")),
                      disabled: isCloseButtonDisabled.value,
                      type: "button",
                      "aria-label": "Close",
                      onClick: handleCloseButtonClick
                    }, [
                      createVNode(unref(AModalRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                    ], 14, _hoisted_1)) : createCommentVNode("", true)
                  ], 6)) : createCommentVNode("", true),
                  createElementVNode("div", {
                    class: normalizeClass(bodyClass.value),
                    style: normalizeStyle(semanticStyle("body"))
                  }, [
                    _ctx.loading ? (openBlock(), createBlock(unref(Skeleton), {
                      key: 0,
                      active: "",
                      paragraph: { rows: 3 }
                    })) : renderSlot(_ctx.$slots, "default", { key: 1 })
                  ], 6),
                  hasFooter.value ? (openBlock(), createElementBlock("footer", {
                    key: 1,
                    class: normalizeClass(footerClass.value),
                    style: normalizeStyle(semanticStyle("footer"))
                  }, [
                    renderSlot(_ctx.$slots, "footer", {}, () => [
                      createVNode(unref(AModalRenderNode), { node: footerContent.value }, null, 8, ["node"])
                    ])
                  ], 6)) : createCommentVNode("", true)
                ], 6)
              ]),
              _: 3
            }, 8, ["renderer"])
          ], 6)
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
