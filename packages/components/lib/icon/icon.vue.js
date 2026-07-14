"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icons = require("./icons.js");
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
    const slots = vue.useSlots();
    const resolvedComponent = vue.computed(() => {
      const component = props.component ?? (props.name ? icons.iconComponents[props.name] : void 0);
      return component ? vue.markRaw(vue.toRaw(component)) : void 0;
    });
    vue.watchEffect(() => {
      if (slots.default || props.component || !props.name || resolvedComponent.value || icons.warnedUnknownIconNames.has(props.name)) {
        return;
      }
      icons.warnedUnknownIconNames.add(props.name);
      vue.warn(`[Aheart UI] Unknown icon name: ${props.name}`);
    });
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
        vue.unref(slots).default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : resolvedComponent.value ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(resolvedComponent.value), {
          key: 1,
          class: "aheart-icon__svg",
          "aria-hidden": "true",
          focusable: "false"
        })) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
