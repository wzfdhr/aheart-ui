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
    const linkClass = vue.computed(() => ({
      "is-disabled": props.disabled,
      "is-underline": props.underline
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("a", {
        class: vue.normalizeClass(["aheart-typography-link", linkClass.value]),
        href: resolvedHref.value,
        target: props.target,
        "aria-disabled": props.disabled || void 0
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
