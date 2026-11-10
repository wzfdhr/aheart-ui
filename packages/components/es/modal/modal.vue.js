import { defineComponent, useSlots, getCurrentInstance, ref, computed, watch, nextTick, onBeforeMount, onMounted, onBeforeUnmount, openBlock, createBlock, Teleport, unref, withDirectives, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createElementVNode, withModifiers, createVNode, withCtx, renderSlot, vShow, h } from "vue";
import Button from "../button/index.js";
import Skeleton from "../skeleton/index.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { useTeleportReady } from "../utils/use-teleport-ready.js";
import { modalProps, modalEmits } from "./types.js";
import { getRecentPointerTarget, prepareOverlayDocument, isTopmost, registerOverlay, lockBodyScroll, refreshOverlayStack, unregisterOverlay, unlockBodyScroll } from "../utils/overlay-controller.js";
import { useAheartConfig } from "../config/context.js";
const _hoisted_1 = ["aria-hidden"];
const _hoisted_2 = ["aria-label", "aria-labelledby"];
const _hoisted_3 = ["disabled", "aria-label"];
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
    const config = useAheartConfig();
    const instance = getCurrentInstance();
    const FOCUSABLE_SELECTOR = [
      "a[href]",
      "area[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "audio[controls]",
      "video[controls]",
      "iframe",
      "object",
      "embed",
      '[contenteditable]:not([contenteditable="false"])',
      "details > summary:first-of-type",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    const modalWidthBreakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
    const triggerElement = ref(null);
    const dialogRef = ref(null);
    const leaveFocusElement = ref(null);
    const modalStackId = Symbol("aheart-modal");
    const titleId = `aheart-modal-title-${(instance == null ? void 0 : instance.uid) ?? "dialog"}`;
    let pendingCloseCompletion = false;
    let overlayRegistered = false;
    let overlayDocument = null;
    const effectiveZIndex = ref(props.zIndex);
    const getModalDocument = () => {
      var _a, _b;
      const target = teleportTarget.value;
      return ((_a = dialogRef.value) == null ? void 0 : _a.ownerDocument) ?? ((_b = triggerElement.value) == null ? void 0 : _b.ownerDocument) ?? (typeof target === "object" && target ? target.ownerDocument : document);
    };
    const isModalTopmost = () => isTopmost(modalStackId, overlayDocument ?? getModalDocument());
    const registerModalOverlay = () => {
      if (overlayRegistered)
        return;
      const ownerDocument = getModalDocument();
      registerOverlay({
        id: modalStackId,
        document: ownerDocument,
        getTrigger: () => triggerElement.value,
        getContent: () => dialogRef.value,
        escapeEnabled: () => props.open && props.keyboard,
        getBaseZIndex: () => props.zIndex,
        onZIndexChange: (zIndex) => {
          effectiveZIndex.value = zIndex;
        },
        onEscape: close
      });
      lockBodyScroll(ownerDocument);
      overlayDocument = ownerDocument;
      overlayRegistered = true;
    };
    const unregisterModalOverlay = () => {
      if (!overlayRegistered)
        return;
      const ownerDocument = overlayDocument ?? getModalDocument();
      unregisterOverlay(modalStackId, ownerDocument);
      unlockBodyScroll(ownerDocument);
      overlayDocument = null;
      overlayRegistered = false;
    };
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
      if (typeof window === "undefined" && typeof container === "function")
        return false;
      return typeof container === "function" ? container() : container;
    });
    const teleportReady = useTeleportReady();
    const shouldTeleport = computed(() => teleportReady.value && teleportTarget.value !== false);
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
    const motion = useMotionPresence(() => props.open, {
      forceRender: () => props.forceRender,
      destroyOnHidden: () => shouldDestroy.value,
      duration: 180
    });
    const shouldRender = motion.isMounted;
    const dialogStyle = computed(() => ({
      ...props.style,
      ...responsiveWidthVars.value,
      ...semanticStyles("dialog", "container"),
      width: fixedDialogWidth.value
    }));
    const rootStyle = computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: effectiveZIndex.value
    }));
    const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasHeader = computed(() => hasTitle.value || showCloseButton.value);
    const hasFooter = computed(
      () => !props.loading && (Boolean(slots.footer) || props.footer !== false && props.footer !== null)
    );
    const rootClass = computed(() => ["aheart-modal", `is-${motion.phase.value}`, props.rootClassName, semanticClass("root")]);
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
    const hasExplicitProp = (name) => Object.prototype.hasOwnProperty.call((instance == null ? void 0 : instance.vnode.props) ?? {}, name);
    const resolvedOkText = computed(
      () => {
        var _a, _b;
        return hasExplicitProp("okText") ? props.okText : ((_b = (_a = config.value.locale) == null ? void 0 : _a.modal) == null ? void 0 : _b.okText) ?? "OK";
      }
    );
    const resolvedCancelText = computed(
      () => {
        var _a, _b;
        return hasExplicitProp("cancelText") ? props.cancelText : ((_b = (_a = config.value.locale) == null ? void 0 : _a.modal) == null ? void 0 : _b.cancelText) ?? "Cancel";
      }
    );
    const closeAriaLabel = computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.modal) == null ? void 0 : _b.close) ?? "Close";
    });
    const dialogAriaLabel = computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.modal) == null ? void 0 : _b.ariaLabel) ?? "Dialog";
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
      () => createFooterButton("aheart-modal__cancel", resolvedCancelButtonProps.value, handleCancel, resolvedCancelText.value)
    );
    const okButtonNode = computed(
      () => createFooterButton("aheart-modal__ok", resolvedOkButtonProps.value, handleOk, resolvedOkText.value)
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
          pendingCloseCompletion = false;
          leaveFocusElement.value = null;
          if (motion.phase.value === "hidden")
            captureTriggerElement();
          registerModalOverlay();
          emit("afterOpenChange", true);
        }
        if (!open) {
          pendingCloseCompletion = true;
          const ownerDocument = overlayDocument ?? getModalDocument();
          const activeElement = ownerDocument.activeElement;
          const HTMLElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.HTMLElement;
          leaveFocusElement.value = HTMLElementConstructor && activeElement instanceof HTMLElementConstructor && ((_b = dialogRef.value) == null ? void 0 : _b.contains(activeElement)) ? activeElement : null;
          void nextTick(() => {
            if (motion.phase.value === "leave" && leaveFocusElement.value && ownerDocument.contains(leaveFocusElement.value)) {
              leaveFocusElement.value.focus();
            }
          });
        }
      },
      { flush: "sync" }
    );
    watch(
      () => props.zIndex,
      (zIndex) => {
        if (overlayRegistered)
          refreshOverlayStack(overlayDocument ?? getModalDocument());
        else
          effectiveZIndex.value = zIndex;
      }
    );
    watch(
      () => props.open,
      (open) => {
        if (open && isModalTopmost())
          focusDialog();
      },
      { flush: "post" }
    );
    watch(
      () => motion.phase.value,
      (phase) => {
        var _a, _b;
        if (phase === "entered" && props.open && isModalTopmost()) {
          void nextTick(() => focusDialog());
          return;
        }
        if (phase === "hidden" && !props.open && pendingCloseCompletion) {
          unregisterModalOverlay();
          pendingCloseCompletion = false;
          emit("afterOpenChange", false);
          emit("afterClose");
          (_b = (_a = closableConfig.value) == null ? void 0 : _a.afterClose) == null ? void 0 : _b.call(_a);
          void nextTick(() => restoreTriggerFocus());
          leaveFocusElement.value = null;
        }
      }
    );
    const resolveSemanticConfig = (config2, part) => {
      const resolved = typeof config2 === "function" ? config2({ props }) : config2;
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
      var _a;
      const ownerDocument = getModalDocument();
      const HTMLElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.HTMLElement;
      const pointerTarget = getRecentPointerTarget(ownerDocument);
      triggerElement.value = HTMLElementConstructor && pointerTarget instanceof HTMLElementConstructor ? pointerTarget : HTMLElementConstructor && ownerDocument.activeElement instanceof HTMLElementConstructor ? ownerDocument.activeElement : null;
    };
    const restoreTriggerFocus = () => {
      const target = triggerElement.value;
      if (!shouldFocusTriggerAfterClose.value || !target || !target.ownerDocument.contains(target)) {
        return;
      }
      target.focus();
    };
    const isEditableHost = (element) => {
      var _a;
      const isEditable = (node) => node && (node.isContentEditable || ["", "true", "plaintext-only"].includes(node.getAttribute("contenteditable") ?? "false"));
      const parentHost = ((_a = element.parentElement) == null ? void 0 : _a.closest("[contenteditable]")) ?? null;
      return !element.hasAttribute("tabindex") && isEditable(element) && !isEditable(parentHost);
    };
    const isFocusableElementAvailable = (element) => {
      if (element.tabIndex < 0 && !isEditableHost(element) || element.matches(":disabled") || element.tagName === "INPUT" && element.type === "hidden")
        return false;
      const view = element.ownerDocument.defaultView;
      const visibility = view == null ? void 0 : view.getComputedStyle(element).visibility;
      if (visibility === "hidden" || visibility === "collapse")
        return false;
      for (let node = element; node; node = node.parentElement) {
        if (node.hidden || node.hasAttribute("inert") || node.getAttribute("aria-hidden") === "true")
          return false;
        if ((view == null ? void 0 : view.getComputedStyle(node).display) === "none")
          return false;
        if (node !== element && node.tagName === "DETAILS" && !node.hasAttribute("open")) {
          const summary = Array.from(node.children).find((child) => child.tagName === "SUMMARY");
          if (!(summary == null ? void 0 : summary.contains(element)))
            return false;
        }
        if (node === dialogRef.value)
          break;
      }
      return true;
    };
    const getFocusableElements = (tabOrder = false) => {
      const dialog = dialogRef.value;
      if (!dialog)
        return [];
      const candidates = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable);
      if (tabOrder)
        candidates.sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER) - (b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER));
      const groups = /* @__PURE__ */ new Map();
      for (const element of candidates) {
        if (element.tagName !== "INPUT")
          continue;
        const input = element;
        if (input.type !== "radio" || !input.name)
          continue;
        const owner = input.form ?? input.getRootNode();
        if (!groups.has(owner))
          groups.set(owner, /* @__PURE__ */ new Map());
        const names = groups.get(owner);
        if (!names.has(input.name))
          names.set(input.name, []);
        names.get(input.name).push(input);
      }
      const excluded = /* @__PURE__ */ new Set();
      for (const names of groups.values()) {
        for (const group of names.values()) {
          const target = group.find((input) => input === dialog.ownerDocument.activeElement) ?? group.find((input) => input.checked) ?? group[0];
          for (const input of group)
            if (input !== target)
              excluded.add(input);
        }
      }
      return candidates.filter((element) => !excluded.has(element));
    };
    const focusElement = (element) => {
      element.focus();
      const active = element.ownerDocument.activeElement;
      return active === element || element.contains(active);
    };
    const focusDialog = () => {
      if (!props.open) {
        return;
      }
      const dialog = dialogRef.value;
      for (const target of getFocusableElements()) {
        if (focusElement(target))
          return;
      }
      dialog == null ? void 0 : dialog.focus();
    };
    onBeforeMount(() => {
      if (props.open)
        registerModalOverlay();
    });
    onMounted(() => {
      prepareOverlayDocument(getModalDocument());
      if (!props.open || !isModalTopmost()) {
        return;
      }
      captureTriggerElement();
      focusDialog();
    });
    onBeforeUnmount(() => {
      unregisterModalOverlay();
    });
    const handleTrapTab = (event) => {
      if (!props.open || !isModalTopmost() || !shouldTrapFocus.value || event.key !== "Tab") {
        return;
      }
      const dialog = dialogRef.value;
      if (!dialog) {
        return;
      }
      const focusableElements = getFocusableElements(true);
      if (event.defaultPrevented)
        return;
      const active = dialog.ownerDocument.activeElement;
      const current = active ? focusableElements.indexOf(active) : -1;
      const composite = active && (active.shadowRoot || ["AUDIO", "VIDEO", "SELECT"].includes(active.tagName) || active.tagName === "INPUT" && ["date", "datetime-local", "month", "week", "time", "file"].includes(active.type));
      if (composite && current >= 0 && (event.shiftKey ? current > 0 : current < focusableElements.length - 1))
        return;
      event.preventDefault();
      if (!focusableElements.length) {
        dialog.focus();
        return;
      }
      const next = current < 0 ? event.shiftKey ? focusableElements.length - 1 : 0 : (current + (event.shiftKey ? -1 : 1) + focusableElements.length) % focusableElements.length;
      const direction = event.shiftKey ? -1 : 1;
      for (let offset = 0; offset < focusableElements.length; offset += 1) {
        const index = (next + offset * direction + focusableElements.length) % focusableElements.length;
        if (focusElement(focusableElements[index]))
          return;
      }
      dialog.focus();
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
      const ownerDocument = overlayDocument ?? getModalDocument();
      if (!event.composedPath().includes(ownerDocument) && props.open && props.keyboard && event.key === "Escape" && isModalTopmost()) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: teleportTo.value,
        disabled: !shouldTeleport.value
      }, [
        unref(shouldRender) ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(rootClass.value),
          style: normalizeStyle(rootStyle.value),
          role: "presentation",
          "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
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
            style: normalizeStyle(wrapStyle.value),
            onClick: withModifiers(handleMaskClick, ["self"])
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
                  "aria-label": hasTitle.value ? void 0 : dialogAriaLabel.value,
                  "aria-labelledby": hasTitle.value ? titleId : void 0,
                  tabindex: "-1"
                }, [
                  hasHeader.value ? (openBlock(), createElementBlock("header", {
                    key: 0,
                    class: normalizeClass(headerClass.value),
                    style: normalizeStyle(semanticStyle("header"))
                  }, [
                    hasTitle.value ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      id: titleId,
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
                      "aria-label": closeAriaLabel.value,
                      onClick: handleCloseButtonClick
                    }, [
                      createVNode(unref(AModalRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
                    ], 14, _hoisted_3)) : createCommentVNode("", true)
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
                ], 14, _hoisted_2)
              ]),
              _: 3
            }, 8, ["renderer"])
          ], 6)
        ], 46, _hoisted_1)), [
          [vShow, unref(motion).phase.value !== "hidden"]
        ]) : createCommentVNode("", true)
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
