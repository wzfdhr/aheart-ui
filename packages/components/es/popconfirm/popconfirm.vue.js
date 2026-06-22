import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createCommentVNode, createTextVNode, toDisplayString, createBlock, unref, mergeProps, withCtx, createVNode } from "vue";
import Button from "../button/index.js";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { popconfirmProps, popconfirmEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: popconfirmProps,
  emits: popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const innerOpen = ref(props.defaultOpen);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const visible = computed(() => !props.disabled && mergedOpen.value);
    const popconfirmClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const popupClass = computed(() => {
      var _a;
      return [`aheart-floating--${props.placement}`, (_a = props.classNames) == null ? void 0 : _a.popup];
    });
    const popupStyle = computed(() => {
      var _a;
      return [getFloatingPopupStyle(props.color, props.zIndex), (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const arrowClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.arrow;
    });
    const arrowStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
    const messageClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.message;
    });
    const messageStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.message;
    });
    const iconClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.icon;
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const textClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.text;
    });
    const textStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.text;
    });
    const titleClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.title;
    });
    const titleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const descriptionClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.description;
    });
    const descriptionStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const actionsClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.actions;
    });
    const actionsStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    const cancelButtonClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.cancelButton;
    });
    const cancelButtonStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cancelButton;
    });
    const okButtonClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.okButton;
    });
    const okButtonStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.okButton;
    });
    const resolvedCancelButtonProps = computed(() => ({
      size: "small",
      ...props.cancelButtonProps
    }));
    const resolvedOkButtonProps = computed(() => ({
      size: "small",
      type: props.okType,
      ...props.okButtonProps
    }));
    watch(
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-popconfirm", popconfirmClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: normalizeClass(["aheart-popconfirm__trigger", triggerClass.value]),
          style: normalizeStyle(triggerStyle.value),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 38),
        visible.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-popconfirm__popup", popupClass.value]),
          style: normalizeStyle(popupStyle.value),
          role: "dialog",
          onClick: handlePopupClick
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-floating__arrow aheart-popconfirm__arrow", arrowClass.value]),
            style: normalizeStyle(arrowStyle.value),
            "aria-hidden": "true"
          }, null, 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-popconfirm__message", messageClass.value]),
            style: normalizeStyle(messageStyle.value)
          }, [
            createElementVNode("span", {
              class: normalizeClass(["aheart-popconfirm__icon", iconClass.value]),
              style: normalizeStyle(iconStyle.value),
              "aria-hidden": "true"
            }, [
              renderSlot(_ctx.$slots, "icon", {}, () => [
                createTextVNode(toDisplayString(_ctx.icon ?? "!"), 1)
              ])
            ], 6),
            createElementVNode("span", {
              class: normalizeClass(["aheart-popconfirm__text", textClass.value]),
              style: normalizeStyle(textStyle.value)
            }, [
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass(["aheart-popconfirm__title", titleClass.value]),
                style: normalizeStyle(titleStyle.value)
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ], 6)) : createCommentVNode("", true),
              _ctx.description || _ctx.$slots.description ? (openBlock(), createElementBlock("span", {
                key: 1,
                class: normalizeClass(["aheart-popconfirm__description", descriptionClass.value]),
                style: normalizeStyle(descriptionStyle.value)
              }, [
                renderSlot(_ctx.$slots, "description", {}, () => [
                  createTextVNode(toDisplayString(_ctx.description), 1)
                ])
              ], 6)) : createCommentVNode("", true)
            ], 6)
          ], 6),
          createElementVNode("span", {
            class: normalizeClass(["aheart-popconfirm__actions", actionsClass.value]),
            style: normalizeStyle(actionsStyle.value)
          }, [
            _ctx.showCancel ? (openBlock(), createBlock(unref(Button), mergeProps({ key: 0 }, resolvedCancelButtonProps.value, {
              class: ["aheart-popconfirm__cancel", cancelButtonClass.value],
              style: cancelButtonStyle.value,
              onClick: handleCancel
            }), {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.cancelText), 1)
              ]),
              _: 1
            }, 16, ["class", "style"])) : createCommentVNode("", true),
            createVNode(unref(Button), mergeProps(resolvedOkButtonProps.value, {
              class: ["aheart-popconfirm__ok", okButtonClass.value],
              style: okButtonStyle.value,
              onClick: handleConfirm
            }), {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.okText), 1)
              ]),
              _: 1
            }, 16, ["class", "style"])
          ], 6)
        ], 6)) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};
