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
    name: "AParagraph"
  },
  __name: "paragraph",
  props: types.paragraphProps,
  setup(__props) {
    const props = __props;
    const contentRef = vue.ref(null);
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
    const isEllipsis = vue.computed(() => Boolean(props.ellipsis));
    const ellipsisRows = vue.computed(() => {
      var _a;
      if (typeof props.ellipsis === "object" && ((_a = props.ellipsis) == null ? void 0 : _a.rows) && props.ellipsis.rows > 0) {
        return props.ellipsis.rows;
      }
      return 1;
    });
    const isMultilineEllipsis = vue.computed(() => isEllipsis.value && ellipsisRows.value > 1);
    const paragraphClass = vue.computed(() => [
      {
        [`aheart-typography-paragraph--${props.type}`]: props.type,
        "is-strong": props.strong,
        "is-italic": props.italic,
        "is-ellipsis": isEllipsis.value,
        "is-ellipsis-multiline": isMultilineEllipsis.value,
        "is-mark": props.mark,
        "is-disabled": props.disabled
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const paragraphStyle = vue.computed(() => [
      isEllipsis.value ? { "--aheart-typography-ellipsis-rows": ellipsisRows.value } : void 0,
      props.style,
      semanticStyles.value.root
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("p", {
        class: vue.normalizeClass(["aheart-typography-paragraph", paragraphClass.value]),
        style: vue.normalizeStyle(paragraphStyle.value)
      }, [
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
      ], 6);
    };
  }
});
exports.default = _sfc_main;
