import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { colProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACol"
  },
  __name: "col",
  props: colProps,
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
    const responsiveConfigs = computed(() => {
      return Object.fromEntries(
        breakpoints.map((breakpoint) => [breakpoint, normalizeSpanConfig(props[breakpoint])])
      );
    });
    const colClass = computed(() => {
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
    const colStyle = computed(() => {
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-col", colClass.value]),
        style: normalizeStyle(colStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
