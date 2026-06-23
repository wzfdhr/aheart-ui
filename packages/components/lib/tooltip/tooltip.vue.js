"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const floating = require("../utils/floating.js");
require("../utils/floating.css.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATooltip"
  },
  __name: "tooltip",
  props: types.tooltipProps,
  emits: types.tooltipEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "ATooltipRenderNode",
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
    const hasTitleContent = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const innerOpen = vue.ref(props.defaultOpen);
    const hasRenderedPopup = vue.ref(Boolean(props.defaultOpen || props.open));
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const popupRef = vue.ref(null);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const hasTitle = vue.computed(() => Boolean(slots.title) || hasTitleContent(props.title));
    const visible = vue.computed(() => hasTitle.value && mergedOpen.value);
    const shouldRenderPopup = vue.computed(() => hasTitle.value && (visible.value || !props.destroyOnHidden && hasRenderedPopup.value));
    const getDefaultPopupContainer = () => typeof document === "undefined" ? false : document.body;
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && triggerRef.value) {
        return props.getPopupContainer(triggerRef.value);
      }
      return getDefaultPopupContainer();
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const tooltipClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-open": visible.value
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
    const contentClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
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
          "aheart-tooltip__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
    let enterTimer;
    let leaveTimer;
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
    const clearTimers = () => {
      if (enterTimer) {
        clearTimeout(enterTimer);
        enterTimer = void 0;
      }
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = void 0;
      }
    };
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const requestOpenWithDelay = (open, delay) => {
      clearTimers();
      if (delay > 0) {
        const timer = setTimeout(() => requestOpen(open), delay * 1e3);
        if (open) {
          enterTimer = timer;
        } else {
          leaveTimer = timer;
        }
        return;
      }
      requestOpen(open);
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpenWithDelay(true, props.mouseEnterDelay);
      }
    };
    const containsRelatedTarget = (event, element) => event.relatedTarget instanceof Node && Boolean(element == null ? void 0 : element.contains(event.relatedTarget));
    const isHoveringTriggerOrPopup = (event) => containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value);
    const handleMouseLeave = (event) => {
      if (normalizedTriggers.value.has("hover") && !isHoveringTriggerOrPopup(event)) {
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
    vue.onBeforeUnmount(clearTimers);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-tooltip", tooltipClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: vue.normalizeClass(["aheart-tooltip__trigger", triggerClass.value]),
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
            class: vue.normalizeClass(["aheart-tooltip__popup", popupClass.value]),
            style: vue.normalizeStyle(popupStyle.value),
            role: "tooltip",
            onMouseenter: handleMouseEnter,
            onMouseleave: handleMouseLeave
          }, [
            showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(["aheart-floating__arrow aheart-tooltip__arrow", arrowClass.value]),
              style: vue.normalizeStyle(arrowStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-tooltip__container", containerClass.value]),
              style: vue.normalizeStyle(containerStyle.value)
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-tooltip__content", contentClass.value]),
                style: vue.normalizeStyle(contentStyle.value)
              }, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
                ])
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
