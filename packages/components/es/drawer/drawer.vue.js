import { defineComponent, useSlots, ref, computed, watch, openBlock, createBlock, Teleport, withDirectives, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createElementVNode, renderSlot, createTextVNode, toDisplayString, unref, vShow } from "vue";
import Skeleton from "../skeleton/index.js";
import { drawerProps, drawerEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: drawerProps,
  emits: drawerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const hasRendered = ref(props.open || props.forceRender);
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const getDefaultContainer = () => typeof document === "undefined" ? false : document.body;
    const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = computed(() => teleportTarget.value !== false);
    const teleportTo = computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const isVertical = computed(() => props.placement === "top" || props.placement === "bottom");
    const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value);
    const hasExtra = computed(() => Boolean(slots.extra) || props.extra !== void 0);
    const hasHeader = computed(() => Boolean(props.title || slots.title || hasExtra.value || props.closable));
    const resolvedSize = computed(() => {
      if (props.size === "large") {
        return 736;
      }
      if (props.size === "default") {
        return 378;
      }
      return props.size;
    });
    const panelStyle = computed(
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
    const rootStyle = computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const maskStyle = computed(() => semanticStyle("mask"));
    const hasFooter = computed(() => props.footer || Boolean(slots.footer));
    const rootClass = computed(() => ["aheart-drawer", props.rootClassName, semanticClass("root")]);
    const maskClass = computed(() => ["aheart-drawer__mask", semanticClass("mask")]);
    const panelClass = computed(() => [
      "aheart-drawer__panel",
      `aheart-drawer__panel--${props.placement}`,
      props.className,
      semanticClass("section")
    ]);
    const headerClass = computed(() => ["aheart-drawer__header", semanticClass("header")]);
    const titleClass = computed(() => ["aheart-drawer__title", semanticClass("title")]);
    const extraClass = computed(() => ["aheart-drawer__extra", semanticClass("extra")]);
    const bodyClass = computed(() => ["aheart-drawer__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = computed(() => ["aheart-drawer__footer", semanticClass("footer")]);
    const closeClass = computed(() => ["aheart-drawer__close", semanticClass("close")]);
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
          _ctx.mask ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(maskClass.value),
            style: normalizeStyle(maskStyle.value),
            onClick: handleMaskClick
          }, null, 6)) : createCommentVNode("", true),
          createElementVNode("section", {
            class: normalizeClass(panelClass.value),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            hasHeader.value ? (openBlock(), createElementBlock("header", {
              key: 0,
              class: normalizeClass(headerClass.value),
              style: normalizeStyle(semanticStyle("header"))
            }, [
              _ctx.closable ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: normalizeClass(closeClass.value),
                style: normalizeStyle(semanticStyle("close")),
                type: "button",
                "aria-label": "Close",
                onClick: close
              }, " × ", 6)) : createCommentVNode("", true),
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: normalizeClass(titleClass.value),
                style: normalizeStyle(semanticStyle("title"))
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ], 6)) : createCommentVNode("", true),
              hasExtra.value ? (openBlock(), createElementBlock("div", {
                key: 2,
                class: normalizeClass(extraClass.value),
                style: normalizeStyle(semanticStyle("extra"))
              }, [
                renderSlot(_ctx.$slots, "extra", {}, () => [
                  createTextVNode(toDisplayString(_ctx.extra), 1)
                ])
              ], 6)) : createCommentVNode("", true)
            ], 6)) : createCommentVNode("", true),
            createElementVNode("div", {
              class: normalizeClass(bodyClass.value),
              style: normalizeStyle(semanticStyle("body"))
            }, [
              _ctx.loading ? (openBlock(), createBlock(unref(Skeleton), {
                key: 0,
                active: "",
                paragraph: { rows: 4 }
              })) : renderSlot(_ctx.$slots, "default", { key: 1 })
            ], 6),
            hasFooter.value ? (openBlock(), createElementBlock("footer", {
              key: 1,
              class: normalizeClass(footerClass.value),
              style: normalizeStyle(semanticStyle("footer"))
            }, [
              renderSlot(_ctx.$slots, "footer")
            ], 6)) : createCommentVNode("", true)
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
