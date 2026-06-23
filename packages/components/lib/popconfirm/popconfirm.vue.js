"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../button/index.js");
const floating = require("../utils/floating.js");
require("../utils/floating.css.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: types.popconfirmProps,
  emits: types.popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "APopconfirmRenderNode",
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
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false;
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const innerOpen = vue.ref(props.defaultOpen);
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const popupRef = vue.ref(null);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const visible = vue.computed(() => !props.disabled && mergedOpen.value);
    const hasRenderedPopup = vue.ref(Boolean(visible.value));
    const shouldDestroyOnHidden = vue.computed(() => props.destroyOnHidden || props.destroyTooltipOnHide);
    const shouldRenderPopup = vue.computed(
      () => !props.disabled && (visible.value || !shouldDestroyOnHidden.value && hasRenderedPopup.value)
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
    const resolvedIcon = vue.computed(() => props.icon === void 0 ? "!" : props.icon);
    const hasIcon = vue.computed(() => Boolean(slots.icon) || hasRenderable(resolvedIcon.value));
    const hasTitle = vue.computed(() => Boolean(slots.title) || hasRenderable(props.title));
    const hasDescription = vue.computed(() => Boolean(slots.description) || hasRenderable(props.description));
    const popconfirmClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-open": visible.value,
          "is-disabled": props.disabled
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const popupClass = vue.computed(() => {
      var _a;
      return [`aheart-floating--${props.placement}`, props.overlayClassName, (_a = props.classNames) == null ? void 0 : _a.popup];
    });
    const popupStyle = vue.computed(() => {
      var _a;
      return [floating.getFloatingPopupStyle(props.color, props.zIndex), props.overlayStyle, (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const containerClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.container;
    });
    const containerStyle = vue.computed(() => {
      var _a;
      return [props.overlayInnerStyle, (_a = props.styles) == null ? void 0 : _a.container];
    });
    const showArrow = vue.computed(() => props.arrow !== false);
    const arrowPointsAtCenter = vue.computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = vue.computed(() => {
      var _a;
      return [
        (_a = props.classNames) == null ? void 0 : _a.arrow,
        {
          "aheart-popconfirm__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
    const messageClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.message;
    });
    const messageStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.message;
    });
    const iconClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.icon;
    });
    const iconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const textClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.text;
    });
    const textStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.text;
    });
    const titleClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.title;
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const descriptionClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.description;
    });
    const descriptionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const actionsClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.actions;
    });
    const actionsStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    const cancelButtonClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.cancelButton;
    });
    const cancelButtonStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cancelButton;
    });
    const okButtonClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.okButton;
    });
    const okButtonStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.okButton;
    });
    const resolvedCancelButtonProps = vue.computed(() => ({
      size: "small",
      ...props.cancelButtonProps
    }));
    const resolvedOkButtonProps = vue.computed(() => ({
      size: "small",
      type: props.okType,
      ...props.okButtonProps
    }));
    vue.watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    vue.watch(
      visible,
      (open) => {
        if (open) {
          hasRenderedPopup.value = true;
        }
      },
      { immediate: true }
    );
    vue.watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) {
          hasRenderedPopup.value = false;
        }
      }
    );
    const requestOpen = (open) => {
      if (props.disabled) {
        return;
      }
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    let mouseEnterTimer;
    let mouseLeaveTimer;
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
    const requestOpenWithDelay = (open, delay) => {
      const timerDelay = delayToMs(delay);
      if (timerDelay === 0) {
        requestOpen(open);
        return;
      }
      const timer = setTimeout(() => {
        if (open) {
          mouseEnterTimer = void 0;
        } else {
          mouseLeaveTimer = void 0;
        }
        requestOpen(open);
      }, timerDelay);
      if (open) {
        mouseEnterTimer = timer;
      } else {
        mouseLeaveTimer = timer;
      }
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        clearMouseLeaveTimer();
        clearMouseEnterTimer();
        requestOpenWithDelay(true, props.mouseEnterDelay);
      }
    };
    const containsRelatedTarget = (event, element) => event.relatedTarget instanceof Node && Boolean(element == null ? void 0 : element.contains(event.relatedTarget));
    const isHoveringTriggerOrPopup = (event) => containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value);
    const handleMouseLeave = (event) => {
      if (normalizedTriggers.value.has("hover") && !isHoveringTriggerOrPopup(event)) {
        clearMouseEnterTimer();
        clearMouseLeaveTimer();
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
    const handlePopupClick = (event) => {
      emit("popupClick", event);
    };
    const handleConfirm = () => {
      emit("confirm");
      requestOpen(false);
    };
    const handleCancel = () => {
      emit("cancel");
      requestOpen(false);
    };
    vue.onBeforeUnmount(() => {
      clearHoverTimers();
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-popconfirm", popconfirmClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: vue.normalizeClass(["aheart-popconfirm__trigger", triggerClass.value]),
          style: vue.normalizeStyle(triggerStyle.value),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 38),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          shouldRenderPopup.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            ref_key: "popupRef",
            ref: popupRef,
            class: vue.normalizeClass(["aheart-popconfirm__popup", popupClass.value]),
            style: vue.normalizeStyle(popupStyle.value),
            role: "dialog",
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave,
            onClick: handlePopupClick
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(["aheart-floating__arrow aheart-popconfirm__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-popconfirm__container", containerClass.value]),
              style: vue.normalizeStyle(containerStyle.value)
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-popconfirm__message", messageClass.value]),
                style: vue.normalizeStyle(messageStyle.value)
              }, [
                hasIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass(["aheart-popconfirm__icon", iconClass.value]),
                  style: vue.normalizeStyle(iconStyle.value),
                  "aria-hidden": "true"
                }, [
                  vue.renderSlot(_ctx.$slots, "icon", {}, () => [
                    vue.createVNode(vue.unref(ARenderNode), { node: resolvedIcon.value }, null, 8, ["node"])
                  ])
                ], 6)) : vue.createCommentVNode("", true),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(["aheart-popconfirm__text", textClass.value]),
                  style: vue.normalizeStyle(textStyle.value)
                }, [
                  hasTitle.value ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(["aheart-popconfirm__title", titleClass.value]),
                    style: vue.normalizeStyle(titleStyle.value)
                  }, [
                    vue.renderSlot(_ctx.$slots, "title", {}, () => [
                      vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true),
                  hasDescription.value ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(["aheart-popconfirm__description", descriptionClass.value]),
                    style: vue.normalizeStyle(descriptionStyle.value)
                  }, [
                    vue.renderSlot(_ctx.$slots, "description", {}, () => [
                      vue.createVNode(vue.unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
                    ])
                  ], 6)) : vue.createCommentVNode("", true)
                ], 6)
              ], 6),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-popconfirm__actions", actionsClass.value]),
                style: vue.normalizeStyle(actionsStyle.value)
              }, [
                _ctx.showCancel ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), vue.mergeProps({ key: 0 }, resolvedCancelButtonProps.value, {
                  class: ["aheart-popconfirm__cancel", cancelButtonClass.value],
                  style: cancelButtonStyle.value,
                  onClick: handleCancel
                }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])) : vue.createCommentVNode("", true),
                vue.createVNode(vue.unref(index.default), vue.mergeProps(resolvedOkButtonProps.value, {
                  class: ["aheart-popconfirm__ok", okButtonClass.value],
                  style: okButtonStyle.value,
                  onClick: handleConfirm
                }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 16, ["class", "style"])
              ], 6)
            ], 6)
          ], 38)), [
            [vue.vShow, visible.value]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 38);
    };
  }
});
exports.default = _sfc_main;
