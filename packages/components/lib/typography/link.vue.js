"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["href", "target", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ALink"
  },
  __name: "link",
  props: types.linkProps,
  setup(__props) {
    const props = __props;
    const resolvedHref = vue.computed(() => props.disabled ? void 0 : props.href);
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const linkClass = vue.computed(() => [
      {
        "is-disabled": props.disabled,
        "is-underline": props.underline
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const linkStyle = vue.computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("a", {
        class: vue.normalizeClass(["aheart-typography-link", linkClass.value]),
        href: resolvedHref.value,
        target: props.target,
        "aria-disabled": props.disabled || void 0,
        style: vue.normalizeStyle(linkStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
