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
    const props = __props;
    const emit = __emit;
    const innerOpen = vue.ref(props.defaultOpen);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const visible = vue.computed(() => !props.disabled && mergedOpen.value);
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
      return [`aheart-floating--${props.placement}`, (_a = props.classNames) == null ? void 0 : _a.popup];
    });
    const popupStyle = vue.computed(() => {
      var _a;
      return [floating.getFloatingPopupStyle(props.color, props.zIndex), (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const arrowClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.arrow;
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
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(true);
      }
    };
    const handleMouseLeave = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(false);
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
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-popconfirm", popconfirmClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
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
        visible.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-popconfirm__popup", popupClass.value]),
          style: vue.normalizeStyle(popupStyle.value),
          role: "dialog",
          onClick: handlePopupClick
        }, [
          _ctx.arrow ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-floating__arrow aheart-popconfirm__arrow", arrowClass.value]),
            style: vue.normalizeStyle(arrowStyle.value),
            "aria-hidden": "true"
          }, null, 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-popconfirm__message", messageClass.value]),
            style: vue.normalizeStyle(messageStyle.value)
          }, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-popconfirm__icon", iconClass.value]),
              style: vue.normalizeStyle(iconStyle.value),
              "aria-hidden": "true"
            }, [
              vue.renderSlot(_ctx.$slots, "icon", {}, () => [
                vue.createTextVNode(vue.toDisplayString(_ctx.icon ?? "!"), 1)
              ])
            ], 6),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-popconfirm__text", textClass.value]),
              style: vue.normalizeStyle(textStyle.value)
            }, [
              _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(["aheart-popconfirm__title", titleClass.value]),
                style: vue.normalizeStyle(titleStyle.value)
              }, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                ])
              ], 6)) : vue.createCommentVNode("", true),
              _ctx.description || _ctx.$slots.description ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(["aheart-popconfirm__description", descriptionClass.value]),
                style: vue.normalizeStyle(descriptionStyle.value)
              }, [
                vue.renderSlot(_ctx.$slots, "description", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
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
        ], 6)) : vue.createCommentVNode("", true)
      ], 38);
    };
  }
});
exports.default = _sfc_main;
