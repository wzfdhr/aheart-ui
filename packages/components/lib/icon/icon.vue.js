"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AIcon"
  },
  __name: "icon",
  props: types.iconProps,
  setup(__props) {
    const props = __props;
    const normalizeSize = (size) => {
      if (typeof size === "number") {
        return `${size}px`;
      }
      return size;
    };
    const iconClass = vue.computed(() => ({
      "aheart-icon--spin": props.spin
    }));
    const iconStyle = vue.computed(() => ({
      "--aheart-icon-size": normalizeSize(props.size),
      "--aheart-icon-color": props.color
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-icon", iconClass.value]),
        style: vue.normalizeStyle(iconStyle.value),
        "aria-hidden": "true"
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.name), 1)
        ])
      ], 6);
    };
  }
});
exports.default = _sfc_main;
