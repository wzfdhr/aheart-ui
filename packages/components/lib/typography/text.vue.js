"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AText"
  },
  __name: "text",
  props: types.textProps,
  setup(__props) {
    const props = __props;
    const tagName = vue.computed(() => {
      if (props.code)
        return "code";
      if (props.keyboard)
        return "kbd";
      if (props.delete)
        return "del";
      if (props.underline)
        return "u";
      if (props.italic)
        return "em";
      if (props.strong)
        return "strong";
      return "span";
    });
    const textClass = vue.computed(() => ({
      [`aheart-typography-text--${props.type}`]: props.type,
      "is-strong": props.strong,
      "is-italic": props.italic,
      "is-disabled": props.disabled
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagName.value), {
        class: vue.normalizeClass(["aheart-typography-text", textClass.value])
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
exports.default = _sfc_main;
