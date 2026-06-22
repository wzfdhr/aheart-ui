"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACol"
  },
  __name: "col",
  props: types.colProps,
  setup(__props) {
    const props = __props;
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
    const normalizeSpanConfig = (value) => {
      if (typeof value === "number") {
        return { span: value };
      }
      return value;
    };
    const flexToValue = (flex) => {
      if (typeof flex === "number") {
        return `0 0 ${flex}px`;
      }
      return flex;
    };
    const responsiveConfigs = vue.computed(() => {
      return Object.fromEntries(
        breakpoints.map((breakpoint) => [breakpoint, normalizeSpanConfig(props[breakpoint])])
      );
    });
    const colClass = vue.computed(() => {
      const classes = [
        props.span !== void 0 ? `aheart-col-${props.span}` : void 0,
        props.offset !== void 0 ? `aheart-col-offset-${props.offset}` : void 0,
        props.order !== void 0 ? `aheart-col-order-${props.order}` : void 0,
        props.push !== void 0 ? `aheart-col-push-${props.push}` : void 0,
        props.pull !== void 0 ? `aheart-col-pull-${props.pull}` : void 0
      ];
      breakpoints.forEach((breakpoint) => {
        if (responsiveConfigs.value[breakpoint]) {
          classes.push(`aheart-col-${breakpoint}`);
        }
      });
      return classes;
    });
    const colStyle = vue.computed(() => {
      const style = {};
      if (props.span !== void 0) {
        style["--aheart-col-span"] = props.span;
      }
      if (props.offset !== void 0) {
        style["--aheart-col-offset"] = props.offset;
      }
      if (props.order !== void 0) {
        style["--aheart-col-order"] = props.order;
      }
      if (props.pull !== void 0) {
        style["--aheart-col-pull"] = props.pull;
      }
      if (props.push !== void 0) {
        style["--aheart-col-push"] = props.push;
      }
      const flex = flexToValue(props.flex);
      if (flex !== void 0) {
        style["--aheart-col-flex"] = flex;
      }
      breakpoints.forEach((breakpoint) => {
        const config = responsiveConfigs.value[breakpoint];
        if (!config) {
          return;
        }
        if (config.span !== void 0) {
          style[`--aheart-col-${breakpoint}-span`] = config.span;
        }
        if (config.offset !== void 0) {
          style[`--aheart-col-${breakpoint}-offset`] = config.offset;
        }
        if (config.order !== void 0) {
          style[`--aheart-col-${breakpoint}-order`] = config.order;
        }
        if (config.pull !== void 0) {
          style[`--aheart-col-${breakpoint}-pull`] = config.pull;
        }
        if (config.push !== void 0) {
          style[`--aheart-col-${breakpoint}-push`] = config.push;
        }
        const responsiveFlex = flexToValue(config.flex);
        if (responsiveFlex !== void 0) {
          style[`--aheart-col-${breakpoint}-flex`] = responsiveFlex;
        }
      });
      return style;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-col", colClass.value]),
        style: vue.normalizeStyle(colStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
exports.default = _sfc_main;
