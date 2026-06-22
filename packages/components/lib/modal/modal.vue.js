"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index$1 = require("../button/index.js");
const index = require("../skeleton/index.js");
const types = require("./types.js");
require("./style.css.js");
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
    const hasRendered = vue.ref(props.open || props.forceRender);
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const shouldDestroy = vue.computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = vue.computed(() => props.open || props.forceRender || hasRendered.value);
    const dialogStyle = vue.computed(() => ({
      ...props.style,
      ...semanticStyle("dialog"),
      width: normalizeSize(props.width)
    }));
    const rootStyle = vue.computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const hasFooter = vue.computed(() => props.footer || Boolean(slots.footer));
    const rootClass = vue.computed(() => ["aheart-modal", props.rootClassName, semanticClass("root")]);
    const maskClass = vue.computed(() => ["aheart-modal__mask", semanticClass("mask")]);
    const wrapClass = vue.computed(() => ["aheart-modal__wrap", semanticClass("wrap")]);
    const dialogClass = vue.computed(() => [
      "aheart-modal__dialog",
      {
        "is-centered": props.centered
      },
      props.className,
      semanticClass("dialog")
    ]);
    const headerClass = vue.computed(() => ["aheart-modal__header", semanticClass("header")]);
    const titleClass = vue.computed(() => ["aheart-modal__title", semanticClass("title")]);
    const bodyClass = vue.computed(() => ["aheart-modal__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = vue.computed(() => ["aheart-modal__footer", semanticClass("footer")]);
    const closeClass = vue.computed(() => ["aheart-modal__close", semanticClass("close")]);
    const resolvedCancelButtonProps = vue.computed(() => props.cancelButtonProps ?? {});
    const resolvedOkButtonProps = vue.computed(() => {
      var _a, _b;
      return {
        ...props.okButtonProps,
        type: ((_a = props.okButtonProps) == null ? void 0 : _a.type) ?? props.okType,
        loading: props.confirmLoading || Boolean((_b = props.okButtonProps) == null ? void 0 : _b.loading)
      };
    });
    vue.watch(
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
    vue.watch(
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
      return shouldRender.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(rootClass.value),
        style: vue.normalizeStyle(rootStyle.value),
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(maskClass.value),
          style: vue.normalizeStyle(semanticStyle("mask")),
          onClick: handleMaskClick
        }, null, 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(wrapClass.value),
          style: vue.normalizeStyle(semanticStyle("wrap"))
        }, [
          vue.createElementVNode("section", {
            class: vue.normalizeClass(dialogClass.value),
            style: vue.normalizeStyle(dialogStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            _ctx.title || _ctx.$slots.title || _ctx.closable ? (vue.openBlock(), vue.createElementBlock("header", {
              key: 0,
              class: vue.normalizeClass(headerClass.value),
              style: vue.normalizeStyle(semanticStyle("header"))
            }, [
              _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(titleClass.value),
                style: vue.normalizeStyle(semanticStyle("title"))
              }, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                ])
              ], 6)) : vue.createCommentVNode("", true),
              _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                class: vue.normalizeClass(closeClass.value),
                style: vue.normalizeStyle(semanticStyle("close")),
                type: "button",
                "aria-label": "Close",
                onClick: close
              }, " × ", 6)) : vue.createCommentVNode("", true)
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
                vue.createVNode(vue.unref(index$1.default), vue.mergeProps({ class: "aheart-modal__cancel" }, resolvedCancelButtonProps.value, { onClick: handleCancel }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }, 16),
                vue.createVNode(vue.unref(index$1.default), vue.mergeProps({ class: "aheart-modal__ok" }, resolvedOkButtonProps.value, { onClick: handleOk }), {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 16)
              ])
            ], 6)) : vue.createCommentVNode("", true)
          ], 6)
        ], 6)
      ], 38)), [
        [vue.vShow, _ctx.open]
      ]) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
