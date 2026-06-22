"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACardGrid"
  },
  __name: "grid",
  props: types.cardGridProps,
  setup(__props) {
    const props = __props;
    const gridClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-hoverable": props.hoverable
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-card-grid", gridClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["aheart-card-grid__content", (_a = _ctx.classNames) == null ? void 0 : _a.content]),
          style: vue.normalizeStyle((_b = _ctx.styles) == null ? void 0 : _b.content)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
