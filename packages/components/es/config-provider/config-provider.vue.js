import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle, renderSlot } from "vue";
import { provideAheartConfig } from "../config/context.js";
import { configProviderProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AConfigProvider"
  },
  __name: "config-provider",
  props: configProviderProps,
  setup(__props) {
    const props = __props;
    provideAheartConfig(
      computed(() => ({
        size: props.size,
        disabled: props.disabled,
        locale: props.locale,
        theme: props.theme
      }))
    );
    const cssVariables = computed(() => {
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
      return openBlock(), createElementBlock("div", {
        class: "aheart-config-provider",
        style: normalizeStyle(cssVariables.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};
