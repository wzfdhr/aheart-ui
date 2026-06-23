import { defineComponent, useSlots, ref, computed, watch, withDirectives, openBlock, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createElementVNode, renderSlot, createTextVNode, toDisplayString, createVNode, unref, createBlock, mergeProps, withCtx, vShow } from "vue";
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
    const hasRendered = ref(props.open || props.forceRender);
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
    const isClosableConfig = (value) => typeof value === "object" && value !== null;
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value);
    const dialogStyle = computed(() => ({
      ...props.style,
      ...semanticStyle("dialog"),
      width: normalizeSize(props.width)
    }));
    const rootStyle = computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const hasFooter = computed(() => props.footer || Boolean(slots.footer));
    const rootClass = computed(() => ["aheart-modal", props.rootClassName, semanticClass("root")]);
    const maskClass = computed(() => ["aheart-modal__mask", semanticClass("mask")]);
    const wrapClass = computed(() => ["aheart-modal__wrap", semanticClass("wrap")]);
    const dialogClass = computed(() => [
      "aheart-modal__dialog",
      {
        "is-centered": props.centered
      },
      props.className,
      semanticClass("dialog")
    ]);
    const headerClass = computed(() => ["aheart-modal__header", semanticClass("header")]);
    const titleClass = computed(() => ["aheart-modal__title", semanticClass("title")]);
    const bodyClass = computed(() => ["aheart-modal__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = computed(() => ["aheart-modal__footer", semanticClass("footer")]);
    const closeClass = computed(() => ["aheart-modal__close", semanticClass("close")]);
    const closableConfig = computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
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
    watch(
      () => props.open,
      (open) => {
        if (open) {
          hasRendered.value = true;
        } else if (shouldDestroy.value && !props.forceRender) {
          hasRendered.value = false;
        }
        emit("afterOpenChange", open);
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
    const handleOk = () => {
      emit("ok");
    };
    const handleCancel = () => {
      emit("cancel");
      close();
    };
    const handleMaskClick = () => {
      if (props.maskClosable) {
        close();
      }
    };
    const handleKeydown = (event) => {
      if (props.keyboard && event.key === "Escape") {
        close();
      }
    };
    return (_ctx, _cache) => {
      return shouldRender.value ? withDirectives((openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(rootClass.value),
        style: normalizeStyle(rootStyle.value),
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(maskClass.value),
          style: normalizeStyle(semanticStyle("mask")),
          onClick: handleMaskClick
        }, null, 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(wrapClass.value),
          style: normalizeStyle(semanticStyle("wrap"))
        }, [
          createElementVNode("section", {
            class: normalizeClass(dialogClass.value),
            style: normalizeStyle(dialogStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            _ctx.title || _ctx.$slots.title || showCloseButton.value ? (openBlock(), createElementBlock("header", {
              key: 0,
              class: normalizeClass(headerClass.value),
              style: normalizeStyle(semanticStyle("header"))
            }, [
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(titleClass.value),
                style: normalizeStyle(semanticStyle("title"))
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
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
                createVNode(unref(Button), mergeProps({ class: "aheart-modal__cancel" }, resolvedCancelButtonProps.value, { onClick: handleCancel }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }, 16),
                createVNode(unref(Button), mergeProps({ class: "aheart-modal__ok" }, resolvedOkButtonProps.value, { onClick: handleOk }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 16)
              ])
            ], 6)) : createCommentVNode("", true)
          ], 6)
        ], 6)
      ], 38)), [
        [vShow, _ctx.open]
      ]) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
