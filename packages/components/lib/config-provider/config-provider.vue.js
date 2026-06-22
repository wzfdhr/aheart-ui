"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AConfigProvider"
  },
  __name: "config-provider",
  props: types.configProviderProps,
  setup(__props) {
    const props = __props;
    context.provideAheartConfig(
      vue.computed(() => ({
        size: props.size,
        disabled: props.disabled,
        locale: props.locale,
        theme: props.theme
      }))
    );
    const cssVariables = vue.computed(() => {
      const theme = props.theme || {};
      return {
        "--aheart-color-primary": theme.primaryColor,
        "--aheart-color-primary-hover": theme.primaryHoverColor,
        "--aheart-color-success": theme.successColor,
        "--aheart-color-warning": theme.warningColor,
        "--aheart-color-danger": theme.dangerColor,
        "--aheart-color-info": theme.infoColor,
        "--aheart-color-text": theme.textColor,
        "--aheart-color-text-secondary": theme.textSecondaryColor,
        "--aheart-color-border": theme.borderColor,
        "--aheart-color-fill": theme.fillColor,
        "--aheart-color-bg": theme.backgroundColor,
        "--aheart-radius": theme.borderRadius,
        "--aheart-font-size": theme.fontSize
      };
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: "aheart-config-provider",
        style: vue.normalizeStyle(cssVariables.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
exports.default = _sfc_main;
