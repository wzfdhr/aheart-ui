"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const copyable = require("./copyable.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title", "aria-label", "tabindex", "disabled"];
const _hoisted_2 = ["title", "aria-label", "tabindex", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATitle"
  },
  __name: "title",
  props: types.titleProps,
  setup(__props) {
    const props = __props;
    const contentRef = vue.ref(null);
    const tagName = vue.computed(() => `h${props.level}`);
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const actionPlacement = vue.computed(() => {
      var _a;
      return ((_a = props.actions) == null ? void 0 : _a.placement) ?? "end";
    });
    const { isCopyable, copyIcon, copyTitle, copyTabIndex, handleCopy } = copyable.useTypographyCopyable(
      vue.toRef(props, "copyable"),
      contentRef,
      vue.computed(() => props.disabled)
    );
    const titleClass = vue.computed(() => [
      `aheart-typography-title--${props.level}`,
      props.type ? `aheart-typography-title--${props.type}` : void 0,
      {
        "is-disabled": props.disabled,
        "is-mark": props.mark
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const titleStyle = vue.computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagName.value), {
        class: vue.normalizeClass(["aheart-typography-title", titleClass.value]),
        style: vue.normalizeStyle(titleStyle.value)
      }, {
        default: vue.withCtx(() => [
          vue.unref(isCopyable) && actionPlacement.value === "start" ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "aheart-typography__copy",
            type: "button",
            title: vue.unref(copyTitle),
            "aria-label": vue.unref(copyTitle) || "Copy",
            tabindex: vue.unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => vue.unref(handleCopy) && vue.unref(handleCopy)(...args))
          }, [
            vue.createVNode(vue.unref(copyable.TypographyRenderNode), { node: vue.unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            ref_key: "contentRef",
            ref: contentRef,
            class: "aheart-typography__content"
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 512),
          vue.unref(isCopyable) && actionPlacement.value === "end" ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: "aheart-typography__copy",
            type: "button",
            title: vue.unref(copyTitle),
            "aria-label": vue.unref(copyTitle) || "Copy",
            tabindex: vue.unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[1] || (_cache[1] = //@ts-ignore
            (...args) => vue.unref(handleCopy) && vue.unref(handleCopy)(...args))
          }, [
            vue.createVNode(vue.unref(copyable.TypographyRenderNode), { node: vue.unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_2)) : vue.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style"]);
    };
  }
});
exports.default = _sfc_main;
