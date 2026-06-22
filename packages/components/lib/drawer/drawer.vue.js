"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../skeleton/index.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: types.drawerProps,
  emits: types.drawerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const hasRendered = vue.ref(props.open || props.forceRender);
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const isVertical = vue.computed(() => props.placement === "top" || props.placement === "bottom");
    const shouldDestroy = vue.computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = vue.computed(() => props.open || props.forceRender || hasRendered.value);
    const hasExtra = vue.computed(() => Boolean(slots.extra) || props.extra !== void 0);
    const hasHeader = vue.computed(() => Boolean(props.title || slots.title || hasExtra.value || props.closable));
    const resolvedSize = vue.computed(() => {
      if (props.size === "large") {
        return 736;
      }
      if (props.size === "default") {
        return 378;
      }
      return props.size;
    });
    const panelStyle = vue.computed(
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
    const rootStyle = vue.computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const maskStyle = vue.computed(() => semanticStyle("mask"));
    const hasFooter = vue.computed(() => props.footer || Boolean(slots.footer));
    const rootClass = vue.computed(() => ["aheart-drawer", props.rootClassName, semanticClass("root")]);
    const maskClass = vue.computed(() => ["aheart-drawer__mask", semanticClass("mask")]);
    const panelClass = vue.computed(() => [
      "aheart-drawer__panel",
      `aheart-drawer__panel--${props.placement}`,
      props.className,
      semanticClass("section")
    ]);
    const headerClass = vue.computed(() => ["aheart-drawer__header", semanticClass("header")]);
    const titleClass = vue.computed(() => ["aheart-drawer__title", semanticClass("title")]);
    const extraClass = vue.computed(() => ["aheart-drawer__extra", semanticClass("extra")]);
    const bodyClass = vue.computed(() => ["aheart-drawer__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = vue.computed(() => ["aheart-drawer__footer", semanticClass("footer")]);
    const closeClass = vue.computed(() => ["aheart-drawer__close", semanticClass("close")]);
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
          style: vue.normalizeStyle(maskStyle.value),
          onClick: handleMaskClick
        }, null, 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("section", {
          class: vue.normalizeClass(panelClass.value),
          style: vue.normalizeStyle(panelStyle.value),
          role: "dialog",
          "aria-modal": "true"
        }, [
          hasHeader.value ? (vue.openBlock(), vue.createElementBlock("header", {
            key: 0,
            class: vue.normalizeClass(headerClass.value),
            style: vue.normalizeStyle(semanticStyle("header"))
          }, [
            _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              class: vue.normalizeClass(closeClass.value),
              style: vue.normalizeStyle(semanticStyle("close")),
              type: "button",
              "aria-label": "Close",
              onClick: close
            }, " × ", 6)) : vue.createCommentVNode("", true),
            _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: vue.normalizeClass(titleClass.value),
              style: vue.normalizeStyle(semanticStyle("title"))
            }, [
              vue.renderSlot(_ctx.$slots, "title", {}, () => [
                vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
              ])
            ], 6)) : vue.createCommentVNode("", true),
            hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 2,
              class: vue.normalizeClass(extraClass.value),
              style: vue.normalizeStyle(semanticStyle("extra"))
            }, [
              vue.renderSlot(_ctx.$slots, "extra", {}, () => [
                vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
              ])
            ], 6)) : vue.createCommentVNode("", true)
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(bodyClass.value),
            style: vue.normalizeStyle(semanticStyle("body"))
          }, [
            _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
              key: 0,
              active: "",
              paragraph: { rows: 4 }
            })) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
          ], 6),
          hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", {
            key: 1,
            class: vue.normalizeClass(footerClass.value),
            style: vue.normalizeStyle(semanticStyle("footer"))
          }, [
            vue.renderSlot(_ctx.$slots, "footer")
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)
      ], 38)), [
        [vue.vShow, _ctx.open]
      ]) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
